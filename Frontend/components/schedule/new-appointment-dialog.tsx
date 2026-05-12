'use client'

import * as React from 'react'
import { format, addMinutes, parse } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Clock, Search, User, Plus, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { clients, professionals, services } from '@/lib/mock-data'
import type { Appointment, Client } from '@/lib/types'

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date
  selectedTime?: string
  selectedProfessionalId?: string
  onAdd: (appointment: Appointment) => void
  isInsert?: boolean
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  selectedDate,
  selectedTime,
  selectedProfessionalId,
  onAdd,
  isInsert = false,
}: NewAppointmentDialogProps) {
  const [date, setDate] = React.useState<Date>(selectedDate)
  const [time, setTime] = React.useState<string>(selectedTime || '')
  const [professionalId, setProfessionalId] = React.useState<string>(selectedProfessionalId || '')
  const [serviceId, setServiceId] = React.useState<string>('')
  const [clientId, setClientId] = React.useState<string>('')
  const [clientSearch, setClientSearch] = React.useState('')
  const [isSearchFocused, setIsSearchFocused] = React.useState(false)
  const [notes, setNotes] = React.useState('')
  const [isNewClient, setIsNewClient] = React.useState(false)
  const [newClientName, setNewClientName] = React.useState('')
  const [newClientPhone, setNewClientPhone] = React.useState('')

  const searchRef = React.useRef<HTMLDivElement>(null)

  // Reset form when dialog opens with new values
  React.useEffect(() => {
    if (open) {
      setDate(selectedDate)
      setTime(selectedTime || '')
      setProfessionalId(selectedProfessionalId || '')
      setServiceId('')
      setClientId('')
      setClientSearch('')
      setNotes('')
      setIsNewClient(false)
      setNewClientName('')
      setNewClientPhone('')
    }
  }, [open, selectedDate, selectedTime, selectedProfessionalId])

  // Close search dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedService = services.find(s => s.id === serviceId)
  const selectedClient = clients.find(c => c.id === clientId)
  const selectedProfessional = professionals.find(p => p.id === professionalId)

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    c.phone.includes(clientSearch) ||
    c.email.toLowerCase().includes(clientSearch.toLowerCase())
  ).slice(0, 8)

  // Format time input (HH:MM)
  const handleTimeChange = (value: string) => {
    // Remove non-numeric characters except ':'
    let cleaned = value.replace(/[^\d:]/g, '')
    
    // Auto-add colon after 2 digits
    if (cleaned.length === 2 && !cleaned.includes(':')) {
      cleaned = cleaned + ':'
    }
    
    // Limit to HH:MM format
    if (cleaned.length > 5) {
      cleaned = cleaned.slice(0, 5)
    }
    
    setTime(cleaned)
  }

  const calculateEndTime = () => {
    if (!time || !selectedService || time.length < 5) return ''
    try {
      const startDate = parse(time, 'HH:mm', new Date())
      const endDate = addMinutes(startDate, selectedService.duration)
      return format(endDate, 'HH:mm')
    } catch {
      return ''
    }
  }

  const isValidTime = (timeStr: string) => {
    if (timeStr.length !== 5) return false
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const clientName = isNewClient ? newClientName : selectedClient?.name
    if (!clientName || !serviceId || !professionalId || !time || !isValidTime(time)) return

    const endTime = calculateEndTime()
    const newAppointment: Appointment = {
      id: `temp-${Date.now()}`,
      clientId: isNewClient ? `new-${Date.now()}` : clientId,
      clientName: clientName,
      professionalId,
      professionalName: selectedProfessional?.name || '',
      serviceId,
      serviceName: selectedService?.name || '',
      date: format(date, 'yyyy-MM-dd'),
      startTime: time,
      endTime,
      status: 'pending',
      price: selectedService?.price || 0,
      notes,
    }

    onAdd(newAppointment)
    onOpenChange(false)
  }

  const availableServices = professionalId
    ? services.filter(s => {
        const prof = professionals.find(p => p.id === professionalId)
        return prof?.services.includes(s.id) && s.isAvailable
      })
    : services.filter(s => s.isAvailable)

  const canSubmit = (isNewClient ? (newClientName.trim() && newClientPhone.trim()) : clientId) && 
                    serviceId && 
                    professionalId && 
                    time && 
                    isValidTime(time)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isInsert ? 'Inserir Encaixe' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription>
            {isInsert
              ? 'Adicione um encaixe no horário desejado.'
              : 'Preencha os dados para criar um novo agendamento.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client search/selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Cliente *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  setIsNewClient(!isNewClient)
                  setClientId('')
                  setClientSearch('')
                }}
              >
                {isNewClient ? 'Buscar existente' : 'Novo cliente'}
              </Button>
            </div>

            {isNewClient ? (
              <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Plus className="size-4" />
                  Cadastrar novo cliente
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Nome do cliente *"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                  />
                  <Input
                    placeholder="Telefone *"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="relative" ref={searchRef}>
                {selectedClient ? (
                  <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="size-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{selectedClient.name}</div>
                        <div className="text-sm text-muted-foreground">{selectedClient.phone}</div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => {
                        setClientId('')
                        setClientSearch('')
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome, telefone ou email..."
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        className="pl-9"
                      />
                    </div>
                    
                    {isSearchFocused && (clientSearch || filteredClients.length > 0) && (
                      <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
                        <div className="max-h-64 overflow-y-auto p-1">
                          {filteredClients.length === 0 ? (
                            <div className="py-6 text-center">
                              <p className="text-sm text-muted-foreground">Nenhum cliente encontrado</p>
                              <Button
                                type="button"
                                variant="link"
                                size="sm"
                                onClick={() => {
                                  setIsNewClient(true)
                                  setNewClientName(clientSearch)
                                  setIsSearchFocused(false)
                                }}
                              >
                                Cadastrar novo cliente
                              </Button>
                            </div>
                          ) : (
                            filteredClients.map((client) => (
                              <button
                                key={client.id}
                                type="button"
                                className="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-accent transition-colors"
                                onClick={() => {
                                  setClientId(client.id)
                                  setIsSearchFocused(false)
                                  setClientSearch('')
                                }}
                              >
                                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                                  <User className="size-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{client.name}</div>
                                  <div className="text-xs text-muted-foreground">{client.phone}</div>
                                </div>
                                {client.subscription && (
                                  <Badge variant="secondary" className="text-xs shrink-0">Assinante</Badge>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Professional */}
          <div className="space-y-2">
            <Label>Profissional *</Label>
            <Select value={professionalId} onValueChange={setProfessionalId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o profissional" />
              </SelectTrigger>
              <SelectContent>
                {professionals.filter(p => p.status === 'active').map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label>Serviço *</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{service.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {service.duration}min - R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {date ? format(date, 'dd/MM/yyyy') : 'Selecione'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Horário *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="HH:MM"
                  value={time}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className={cn(
                    "pl-9 font-mono",
                    time && !isValidTime(time) && "border-red-500 focus-visible:ring-red-500"
                  )}
                  maxLength={5}
                />
              </div>
              {time && !isValidTime(time) && (
                <p className="text-xs text-red-500">Formato inválido (use HH:MM)</p>
              )}
            </div>
          </div>

          {/* Service summary */}
          {selectedService && time && isValidTime(time) && (
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Serviço:</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Duração:</span>
                <span className="font-medium">{selectedService.duration} minutos</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Horário:</span>
                <span className="font-medium">{time} - {calculateEndTime()}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Valor:</span>
                <span className="font-semibold text-lg">R$ {selectedService.price.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Observações sobre o agendamento..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Agendar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
