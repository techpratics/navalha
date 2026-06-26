import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Save, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import Button from '../ui/Button'
import TimeInput from '../ui/TimeInput'
import type { Professional } from '../../types/professional'
import { professionalService } from '../../services/professional.service'

type TimeBlock = {
  dbId?: string
  start: string
  end: string
}

type DaySchedule = {
  id: number
  name: string
  active: boolean
  blocks: TimeBlock[]
}

const DAY_NAMES = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']

function buildDefault(): DaySchedule[] {
  return DAY_NAMES.map((name, i) => ({ id: i + 1, name, active: false, blocks: [] }))
}

interface Props {
  professional: Professional | null
  isOpen: boolean
  onClose: () => void
}

export default function ProfessionalAvailabilityModal({ professional, isOpen, onClose }: Props) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(buildDefault)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const pendingDeleteIds = useRef<string[]>([])

  const fetchAvailability = useCallback(async () => {
    if (!professional) return
    setIsLoading(true)
    try {
      const data = await professionalService.getAvailabilityById(professional.id)
      const grouped = buildDefault()
      for (const d of data) {
        const day = grouped.find(g => g.id === d.diaSemana)
        if (day) {
          day.active = true
          day.blocks.push({ dbId: d.id, start: d.horaInicio.substring(0, 5), end: d.horaFim.substring(0, 5) })
        }
      }
      grouped.forEach(day => day.blocks.sort((a, b) => a.start.localeCompare(b.start)))
      setSchedule(grouped)
      pendingDeleteIds.current = []
    } catch {
      setSchedule(buildDefault())
    } finally {
      setIsLoading(false)
    }
  }, [professional])

  useEffect(() => {
    if (isOpen && professional) {
      fetchAvailability()
      setShowSuccess(false)
      setErrorMsg(null)
    }
  }, [isOpen, fetchAvailability, professional])

  if (!isOpen || !professional) return null

  const toggleDay = (dayId: number, active: boolean) => {
    if (!active) {
      const day = schedule.find(d => d.id === dayId)
      day?.blocks.forEach(b => {
        if (b.dbId && !pendingDeleteIds.current.includes(b.dbId)) {
          pendingDeleteIds.current = [...pendingDeleteIds.current, b.dbId]
        }
      })
    }
    setSchedule(prev => prev.map(day => {
      if (day.id !== dayId) return day
      if (!active) return { ...day, active: false, blocks: [] }
      return { ...day, active: true, blocks: day.blocks.length > 0 ? day.blocks : [{ start: '09:00', end: '18:00' }] }
    }))
  }

  const addBlock = (dayId: number) => {
    setSchedule(prev => prev.map(day => {
      if (day.id !== dayId) return day
      const last = day.blocks[day.blocks.length - 1]
      const newStart = last?.end ?? '09:00'
      const [h, m] = newStart.split(':').map(Number)
      const endH = Math.min(h + 1, 23)
      const newEnd = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      return { ...day, blocks: [...day.blocks, { start: newStart, end: newEnd }] }
    }))
  }

  const removeBlock = (dayId: number, blockIndex: number) => {
    const day = schedule.find(d => d.id === dayId)
    const block = day?.blocks[blockIndex]
    if (block?.dbId && !pendingDeleteIds.current.includes(block.dbId)) {
      pendingDeleteIds.current = [...pendingDeleteIds.current, block.dbId]
    }
    setSchedule(prev => prev.map(d => {
      if (d.id !== dayId) return d
      const newBlocks = d.blocks.filter((_, i) => i !== blockIndex)
      return { ...d, blocks: newBlocks, active: newBlocks.length > 0 ? d.active : false }
    }))
  }

  const updateBlock = (dayId: number, blockIndex: number, field: 'start' | 'end', value: string) => {
    setSchedule(prev => prev.map(day => {
      if (day.id !== dayId) return day
      const newBlocks = day.blocks.map((b, i) => i === blockIndex ? { ...b, [field]: value } : b)
      return { ...day, blocks: newBlocks }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setShowSuccess(false)
    setErrorMsg(null)

    for (const day of schedule) {
      if (!day.active) continue
      for (const block of day.blocks) {
        if (!block.start || !block.end) {
          setErrorMsg(`Preencha todos os horários de ${day.name} antes de salvar.`)
          setIsSaving(false)
          return
        }
        if (block.end <= block.start) {
          setErrorMsg(`Em ${day.name}: o horário de fim deve ser maior que o de início.`)
          setIsSaving(false)
          return
        }
      }
    }

    try {
      // 1. DELETE primeiro
      for (const id of pendingDeleteIds.current) {
        await professionalService.deleteAvailabilityDay(id)
      }

      // 2. UPDATE blocos existentes
      for (const day of schedule) {
        for (const block of day.blocks) {
          if (block.dbId) {
            await professionalService.updateAvailabilityDay(block.dbId, {
              diaSemana: day.id,
              horaInicio: `${block.start}:00`,
              horaFim: `${block.end}:00`,
            })
          }
        }
      }

      // 3. CREATE novos blocos
      for (const day of schedule) {
        for (const block of day.blocks) {
          if (!block.dbId) {
            await professionalService.saveAvailabilityDayById(professional.id, {
              diaSemana: day.id,
              horaInicio: `${block.start}:00`,
              horaFim: `${block.end}:00`,
            })
          }
        }
      }

      await fetchAvailability()
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.erro || 'Erro ao salvar horários.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        className="w-full max-w-2xl rounded-2xl border shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">Configurar Horários</h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm mt-0.5">{professional.name}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={24} /></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }} />
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 text-sm">
                  <AlertCircle size={16} />{errorMsg}
                </div>
              )}
              {showSuccess && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2 text-sm">
                  <CheckCircle2 size={16} />Horários salvos com sucesso!
                </div>
              )}

              {schedule.map(day => (
                <div
                  key={day.id}
                  style={{
                    backgroundColor: 'var(--bg-elevated)',
                    borderColor: day.active ? 'var(--brand)' : 'var(--border)',
                    opacity: day.active ? 1 : 0.6,
                  }}
                  className="rounded-xl border transition-all overflow-hidden"
                >
                  {/* Cabeçalho do dia */}
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={day.active}
                          onChange={e => toggleDay(day.id, e.target.checked)}
                        />
                        <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                      </label>
                      <span style={{ color: 'var(--text-primary)' }} className="font-semibold text-sm select-none">
                        {day.name}
                      </span>
                    </div>

                    {day.active && (
                      <button
                        onClick={() => addBlock(day.id)}
                        style={{ color: 'var(--brand)' }}
                        className="flex items-center gap-1 text-xs font-semibold hover:opacity-70 transition-opacity"
                      >
                        <Plus size={14} />Adicionar bloco
                      </button>
                    )}
                  </div>

                  {/* Blocos */}
                  {day.active && day.blocks.length > 0 && (
                    <div
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
                      className="border-t px-4 py-3 flex flex-col gap-2"
                    >
                      {day.blocks.map((block, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <TimeInput
                            value={block.start}
                            onChange={time => updateBlock(day.id, idx, 'start', time)}
                            className="flex-1"
                          />
                          <span style={{ color: 'var(--text-muted)' }} className="text-xs shrink-0">até</span>
                          <TimeInput
                            value={block.end}
                            onChange={time => updateBlock(day.id, idx, 'end', time)}
                            className="flex-1"
                          />
                          <button
                            onClick={() => removeBlock(day.id, idx)}
                            className="shrink-0 p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {day.active && day.blocks.length === 0 && (
                    <div style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }} className="border-t px-4 py-2">
                      <p style={{ color: 'var(--text-muted)' }} className="text-xs text-center">Clique em "Adicionar bloco" para definir um horário.</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3 shrink-0" style={{ borderColor: 'var(--border)' }}>
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading} className="flex-1">
            <Save size={16} className="mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar Horários'}
          </Button>
        </div>
      </div>
    </div>
  )
}
