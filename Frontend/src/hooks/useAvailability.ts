import { useState, useEffect, useCallback, useRef } from 'react'
import { professionalService } from '../services/professional.service'

export type TimeBlock = {
  dbId?: string
  start: string
  end: string
}

export type DaySchedule = {
  id: number
  name: string
  active: boolean
  blocks: TimeBlock[]
}

const DAY_NAMES = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']

function buildDefaultSchedule(): DaySchedule[] {
  return DAY_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    active: false,
    blocks: [],
  }))
}

export function useAvailability() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(buildDefaultSchedule)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const pendingDeleteIds = useRef<string[]>([])

  const fetchAvailability = useCallback(async () => {
    try {
      const data = await professionalService.getAvailability()
      const grouped = buildDefaultSchedule()
      for (const d of data) {
        const day = grouped.find(g => g.id === d.diaSemana)
        if (day) {
          day.active = true
          day.blocks.push({
            dbId: d.id,
            start: d.horaInicio.substring(0, 5),
            end: d.horaFim.substring(0, 5),
          })
        }
      }
      // Sort blocks within each day by start time
      grouped.forEach(day => day.blocks.sort((a, b) => a.start.localeCompare(b.start)))
      setSchedule(grouped)
      pendingDeleteIds.current = []
    } catch {
      setSchedule(buildDefaultSchedule())
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchAvailability() }, [fetchAvailability])

  const toggleDay = (dayId: number, active: boolean) => {
    if (!active) {
      // Coleta IDs ANTES do updater para evitar duplicatas em Strict Mode
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
    // Coleta o ID ANTES do updater para evitar duplicatas em Strict Mode
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
      // 1. DELETE primeiro — libera os blocos removidos antes de validar os novos
      for (const id of pendingDeleteIds.current) {
        await professionalService.deleteAvailabilityDay(id)
      }

      // 2. UPDATE blocos existentes — atualiza intervalos no banco antes de criar novos
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

      // 3. CREATE novos blocos — o validator já vê o estado final do banco
      for (const day of schedule) {
        for (const block of day.blocks) {
          if (!block.dbId) {
            await professionalService.saveAvailabilityDay({
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
    } catch (error: any) {
      setErrorMsg(error.response?.data?.erro || 'Erro ao salvar as configurações.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    schedule,
    isLoading,
    isSaving,
    showSuccess,
    errorMsg,
    toggleDay,
    addBlock,
    removeBlock,
    updateBlock,
    handleSave,
  }
}
