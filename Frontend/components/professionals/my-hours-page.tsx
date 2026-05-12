"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { professionals as mockProfessionals } from "@/lib/mock-data"
import { Professional, TimeBlock } from "@/lib/types"
import { Clock, Plus, Trash2, Save, Copy } from "lucide-react"

const DAYS = [
  { value: 0, label: 'Domingo', short: 'Dom' },
  { value: 1, label: 'Segunda', short: 'Seg' },
  { value: 2, label: 'Terca', short: 'Ter' },
  { value: 3, label: 'Quarta', short: 'Qua' },
  { value: 4, label: 'Quinta', short: 'Qui' },
  { value: 5, label: 'Sexta', short: 'Sex' },
  { value: 6, label: 'Sabado', short: 'Sab' },
]

interface DayConfig {
  enabled: boolean
  blocks: TimeBlock[]
}

export function MyHoursPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [daysConfig, setDaysConfig] = useState<Record<number, DayConfig>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user?.professionalId) {
      const prof = mockProfessionals.find(p => p.id === user.professionalId)
      if (prof) {
        setProfessional(prof)
        initializeDaysConfig(prof)
      }
    }
  }, [user?.professionalId])

  const initializeDaysConfig = (prof: Professional) => {
    const config: Record<number, DayConfig> = {}
    
    DAYS.forEach(day => {
      const workingHours = prof.workingHours.find(wh => wh.dayOfWeek === day.value)
      config[day.value] = {
        enabled: !!workingHours?.blocks && workingHours.blocks.length > 0,
        blocks: workingHours?.blocks || []
      }
    })
    
    setDaysConfig(config)
  }

  const toggleDay = useCallback((dayIndex: number) => {
    setDaysConfig(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        enabled: !prev[dayIndex].enabled,
        blocks: !prev[dayIndex].enabled && prev[dayIndex].blocks.length === 0
          ? [{ id: `${dayIndex}-${Date.now()}`, startTime: '09:00', endTime: '18:00' }]
          : prev[dayIndex].blocks
      }
    }))
  }, [])

  const addBlock = useCallback((dayIndex: number) => {
    setDaysConfig(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        blocks: [
          ...prev[dayIndex].blocks,
          { id: `${dayIndex}-${Date.now()}`, startTime: '09:00', endTime: '18:00' }
        ]
      }
    }))
  }, [])

  const removeBlock = useCallback((dayIndex: number, blockId: string) => {
    setDaysConfig(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        blocks: prev[dayIndex].blocks.filter(b => b.id !== blockId)
      }
    }))
  }, [])

  const updateBlockTime = useCallback((dayIndex: number, blockId: string, field: 'startTime' | 'endTime', value: string) => {
    // Format time input
    let formatted = value.replace(/\D/g, '')
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + ':' + formatted.slice(2, 4)
    }
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5)
    }

    setDaysConfig(prev => ({
      ...prev,
      [dayIndex]: {
        ...prev[dayIndex],
        blocks: prev[dayIndex].blocks.map(b =>
          b.id === blockId ? { ...b, [field]: formatted } : b
        )
      }
    }))
  }, [])

  const copyToAllDays = useCallback((sourceDayIndex: number) => {
    const sourceConfig = daysConfig[sourceDayIndex]
    if (!sourceConfig.enabled || sourceConfig.blocks.length === 0) {
      toast({
        title: 'Nenhum horario para copiar',
        description: 'Configure os horarios deste dia primeiro',
        variant: 'destructive'
      })
      return
    }

    setDaysConfig(prev => {
      const newConfig = { ...prev }
      DAYS.forEach(day => {
        if (day.value !== sourceDayIndex) {
          newConfig[day.value] = {
            enabled: true,
            blocks: sourceConfig.blocks.map(b => ({
              ...b,
              id: `${day.value}-${Date.now()}-${Math.random()}`
            }))
          }
        }
      })
      return newConfig
    })

    toast({
      title: 'Horarios copiados',
      description: 'Os horarios foram copiados para todos os dias'
    })
  }, [daysConfig, toast])

  const handleSave = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: 'Horarios salvos',
      description: 'Seus horarios de trabalho foram atualizados com sucesso'
    })
    
    setIsSaving(false)
  }

  if (!professional) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Horarios</h1>
          <p className="text-muted-foreground">
            Configure seus horarios de trabalho para cada dia da semana
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 size-4" />
          {isSaving ? 'Salvando...' : 'Salvar Alteracoes'}
        </Button>
      </div>

      <div className="grid gap-4">
        {DAYS.map((day) => {
          const config = daysConfig[day.value] || { enabled: false, blocks: [] }
          
          return (
            <Card key={day.value} className={!config.enabled ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={() => toggleDay(day.value)}
                    />
                    <CardTitle className="text-base">{day.label}</CardTitle>
                    {config.enabled && (
                      <Badge variant="outline" className="text-xs">
                        {config.blocks.length} bloco(s)
                      </Badge>
                    )}
                  </div>
                  {config.enabled && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToAllDays(day.value)}
                        title="Copiar para todos os dias"
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addBlock(day.value)}
                      >
                        <Plus className="mr-1 size-4" />
                        Bloco
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              {config.enabled && (
                <CardContent className="pt-0">
                  {config.blocks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum bloco de horario. Clique em &quot;Bloco&quot; para adicionar.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {config.blocks.map((block, index) => (
                        <div key={block.id} className="flex items-center gap-3">
                          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-2">
                            <Clock className="size-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Bloco {index + 1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="sr-only">Inicio</Label>
                            <Input
                              value={block.startTime}
                              onChange={(e) => updateBlockTime(day.value, block.id, 'startTime', e.target.value)}
                              placeholder="09:00"
                              className="w-20 text-center"
                            />
                            <span className="text-muted-foreground">ate</span>
                            <Label className="sr-only">Fim</Label>
                            <Input
                              value={block.endTime}
                              onChange={(e) => updateBlockTime(day.value, block.id, 'endTime', e.target.value)}
                              placeholder="18:00"
                              className="w-20 text-center"
                            />
                          </div>
                          {config.blocks.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-destructive hover:text-destructive"
                              onClick={() => removeBlock(day.value, block.id)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
