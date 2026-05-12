'use client'

import * as React from 'react'
import { Clock, Save, Plus, Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import type { Professional, WorkingHours, TimeBlock } from '@/lib/types'

interface WorkingHoursDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  professionals: Professional[]
  onUpdate: (professional: Professional) => void
}

const DAYS = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Segunda-feira', short: 'Seg' },
  { value: 2, label: 'Terça-feira', short: 'Ter' },
  { value: 3, label: 'Quarta-feira', short: 'Qua' },
  { value: 4, label: 'Quinta-feira', short: 'Qui' },
  { value: 5, label: 'Sexta-feira', short: 'Sex' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
]

interface DayConfig {
  dayOfWeek: number
  enabled: boolean
  blocks: TimeBlock[]
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function formatTimeInput(value: string): string {
  // Remove non-digits
  const digits = value.replace(/\D/g, '')
  
  if (digits.length === 0) return ''
  if (digits.length <= 2) return digits
  
  const hours = digits.slice(0, 2)
  const minutes = digits.slice(2, 4)
  
  return `${hours}:${minutes}`
}

function isValidTime(time: string): boolean {
  if (!time || time.length !== 5) return false
  const [hours, minutes] = time.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}

export function WorkingHoursDialog({
  open,
  onOpenChange,
  professionals,
  onUpdate,
}: WorkingHoursDialogProps) {
  const { toast } = useToast()
  const [selectedProfessionalId, setSelectedProfessionalId] = React.useState<string>('')
  const [daysConfig, setDaysConfig] = React.useState<Record<number, DayConfig>>({})
  const [isSaving, setIsSaving] = React.useState(false)

  const selectedProfessional = professionals.find(p => p.id === selectedProfessionalId)

  // Initialize config when professional is selected
  React.useEffect(() => {
    if (selectedProfessional) {
      const config: Record<number, DayConfig> = {}
      
      DAYS.forEach(day => {
        const existing = selectedProfessional.workingHours.find(wh => wh.dayOfWeek === day.value)
        
        if (existing && existing.blocks && existing.blocks.length > 0) {
          config[day.value] = {
            dayOfWeek: day.value,
            enabled: true,
            blocks: existing.blocks.map(b => ({ ...b, id: b.id || generateId() })),
          }
        } else if (existing && 'startTime' in existing) {
          // Legacy format conversion
          const legacyBlocks: TimeBlock[] = []
          const legacy = existing as { startTime: string; endTime: string; lunchStart?: string; lunchEnd?: string }
          
          if (legacy.lunchStart && legacy.lunchEnd) {
            legacyBlocks.push({ id: generateId(), startTime: legacy.startTime, endTime: legacy.lunchStart })
            legacyBlocks.push({ id: generateId(), startTime: legacy.lunchEnd, endTime: legacy.endTime })
          } else {
            legacyBlocks.push({ id: generateId(), startTime: legacy.startTime, endTime: legacy.endTime })
          }
          
          config[day.value] = {
            dayOfWeek: day.value,
            enabled: true,
            blocks: legacyBlocks,
          }
        } else {
          config[day.value] = {
            dayOfWeek: day.value,
            enabled: false,
            blocks: [{ id: generateId(), startTime: '09:00', endTime: '18:00' }],
          }
        }
      })
      
      setDaysConfig(config)
    }
  }, [selectedProfessional])

  // Reset state when dialog closes
  React.useEffect(() => {
    if (!open) {
      setSelectedProfessionalId('')
      setDaysConfig({})
    }
  }, [open])

  const handleToggleDay = (dayOfWeek: number, enabled: boolean) => {
    setDaysConfig(prev => ({
      ...prev,
      [dayOfWeek]: { ...prev[dayOfWeek], enabled }
    }))
  }

  const handleAddBlock = (dayOfWeek: number) => {
    setDaysConfig(prev => {
      const dayConfig = prev[dayOfWeek]
      const lastBlock = dayConfig.blocks[dayConfig.blocks.length - 1]
      
      // Suggest a time after the last block
      let suggestedStart = '14:00'
      let suggestedEnd = '18:00'
      
      if (lastBlock && isValidTime(lastBlock.endTime)) {
        const [hours] = lastBlock.endTime.split(':').map(Number)
        suggestedStart = `${(hours + 1).toString().padStart(2, '0')}:00`
        suggestedEnd = `${(hours + 4).toString().padStart(2, '0')}:00`
      }
      
      return {
        ...prev,
        [dayOfWeek]: {
          ...dayConfig,
          blocks: [
            ...dayConfig.blocks,
            { id: generateId(), startTime: suggestedStart, endTime: suggestedEnd }
          ]
        }
      }
    })
  }

  const handleRemoveBlock = (dayOfWeek: number, blockId: string) => {
    setDaysConfig(prev => {
      const dayConfig = prev[dayOfWeek]
      if (dayConfig.blocks.length <= 1) return prev // Keep at least one block
      
      return {
        ...prev,
        [dayOfWeek]: {
          ...dayConfig,
          blocks: dayConfig.blocks.filter(b => b.id !== blockId)
        }
      }
    })
  }

  const handleUpdateBlockTime = (dayOfWeek: number, blockId: string, field: 'startTime' | 'endTime', value: string) => {
    const formattedValue = formatTimeInput(value)
    
    setDaysConfig(prev => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        blocks: prev[dayOfWeek].blocks.map(b =>
          b.id === blockId ? { ...b, [field]: formattedValue } : b
        )
      }
    }))
  }

  const handleSave = () => {
    if (!selectedProfessional) return

    // Validate all times
    let hasError = false
    Object.values(daysConfig).forEach(dayConfig => {
      if (dayConfig.enabled) {
        dayConfig.blocks.forEach(block => {
          if (!isValidTime(block.startTime) || !isValidTime(block.endTime)) {
            hasError = true
          }
        })
      }
    })

    if (hasError) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, corrija os horários inválidos (formato HH:MM).',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    // Convert to WorkingHours format
    const newWorkingHours: WorkingHours[] = Object.values(daysConfig)
      .filter(dc => dc.enabled && dc.blocks.length > 0)
      .map(dc => ({
        dayOfWeek: dc.dayOfWeek,
        blocks: dc.blocks.map(b => ({
          id: b.id,
          startTime: b.startTime,
          endTime: b.endTime,
        }))
      }))

    // Update professional
    onUpdate({
      ...selectedProfessional,
      workingHours: newWorkingHours,
    })

    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: 'Horários salvos',
        description: `Os horários de ${selectedProfessional.name} foram atualizados com sucesso.`,
      })
      onOpenChange(false)
    }, 500)
  }

  const copyToAllDays = (sourceDayOfWeek: number) => {
    const sourceConfig = daysConfig[sourceDayOfWeek]
    if (!sourceConfig || !sourceConfig.enabled) return

    setDaysConfig(prev => {
      const newConfig = { ...prev }
      DAYS.forEach(day => {
        if (day.value !== sourceDayOfWeek) {
          newConfig[day.value] = {
            ...newConfig[day.value],
            enabled: true,
            blocks: sourceConfig.blocks.map(b => ({
              ...b,
              id: generateId(), // New ID for each copy
            }))
          }
        }
      })
      return newConfig
    })

    toast({
      title: 'Horários copiados',
      description: 'Os horários foram copiados para todos os dias.',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Horários de Trabalho
          </DialogTitle>
          <DialogDescription>
            Configure os blocos de horário para cada dia da semana. Você pode adicionar múltiplos blocos por dia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Professional selector */}
          <div className="space-y-2">
            <Label>Profissional</Label>
            <Select value={selectedProfessionalId} onValueChange={setSelectedProfessionalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Working hours config */}
          {selectedProfessionalId && Object.keys(daysConfig).length > 0 && (
            <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-3">
                {DAYS.map((day) => {
                  const dayConfig = daysConfig[day.value]
                  if (!dayConfig) return null

                  return (
                    <div
                      key={day.value}
                      className={cn(
                        'rounded-lg border p-4 transition-colors',
                        dayConfig.enabled ? 'bg-card' : 'bg-muted/50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Label className="font-medium min-w-[110px]">{day.label}</Label>
                          {dayConfig.enabled && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => copyToAllDays(day.value)}
                            >
                              Copiar para todos
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {dayConfig.enabled ? 'Trabalha' : 'Folga'}
                          </span>
                          <Switch
                            checked={dayConfig.enabled}
                            onCheckedChange={(checked) => handleToggleDay(day.value, checked)}
                          />
                        </div>
                      </div>

                      {dayConfig.enabled && (
                        <div className="space-y-2">
                          {dayConfig.blocks.map((block, index) => (
                            <div key={block.id} className="flex items-center gap-2">
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  type="text"
                                  placeholder="08:00"
                                  value={block.startTime}
                                  onChange={(e) => handleUpdateBlockTime(day.value, block.id, 'startTime', e.target.value)}
                                  className={cn(
                                    'w-20 text-center h-9 font-mono',
                                    !isValidTime(block.startTime) && block.startTime.length > 0 && 'border-red-500'
                                  )}
                                  maxLength={5}
                                />
                                <span className="text-muted-foreground">até</span>
                                <Input
                                  type="text"
                                  placeholder="18:00"
                                  value={block.endTime}
                                  onChange={(e) => handleUpdateBlockTime(day.value, block.id, 'endTime', e.target.value)}
                                  className={cn(
                                    'w-20 text-center h-9 font-mono',
                                    !isValidTime(block.endTime) && block.endTime.length > 0 && 'border-red-500'
                                  )}
                                  maxLength={5}
                                />
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleRemoveBlock(day.value, block.id)}
                                disabled={dayConfig.blocks.length <= 1}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => handleAddBlock(day.value)}
                          >
                            <Plus className="size-4 mr-1" />
                            Adicionar bloco
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          )}

          {!selectedProfessionalId && (
            <div className="flex items-center justify-center h-40 rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Selecione um profissional para configurar os horários
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!selectedProfessionalId || isSaving}>
            {isSaving ? (
              <>Salvando...</>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Salvar Horários
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
