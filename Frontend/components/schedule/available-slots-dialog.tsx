'use client'

import * as React from 'react'
import { format, addDays, eachDayOfInterval, parse, addMinutes, isAfter, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Clock, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { professionals, services, timeSlots } from '@/lib/mock-data'
import type { Appointment } from '@/lib/types'

interface AvailableSlotsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointments: Appointment[]
}

export function AvailableSlotsDialog({
  open,
  onOpenChange,
  appointments,
}: AvailableSlotsDialogProps) {
  const [professionalId, setProfessionalId] = React.useState<string>('')
  const [serviceId, setServiceId] = React.useState<string>('')
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const [endDate, setEndDate] = React.useState<Date>(addDays(new Date(), 7))
  const [availableSlots, setAvailableSlots] = React.useState<{ date: string; slots: string[] }[]>([])
  const [searched, setSearched] = React.useState(false)

  const selectedService = services.find(s => s.id === serviceId)
  const selectedProfessional = professionals.find(p => p.id === professionalId)

  const findAvailableSlots = () => {
    if (!professionalId || !serviceId) return

    const service = services.find(s => s.id === serviceId)
    if (!service) return

    const days = eachDayOfInterval({ start: startDate, end: endDate })
    const results: { date: string; slots: string[] }[] = []

    days.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd')
      const dayOfWeek = day.getDay()

      // Check professional working hours
      const professional = professionals.find(p => p.id === professionalId)
      const workingHours = professional?.workingHours.find(wh => wh.dayOfWeek === dayOfWeek)

      if (!workingHours || !workingHours.blocks || workingHours.blocks.length === 0) return

      const dayAppointments = appointments.filter(
        a => a.date === dateStr && a.professionalId === professionalId && a.status !== 'cancelled'
      )

      const availableDaySlots: string[] = []

      // Filter time slots within any of the working hour blocks
      const filteredSlots = timeSlots.filter(slot => {
        const slotTime = parse(slot, 'HH:mm', new Date())
        const slotEnd = addMinutes(slotTime, service.duration)

        // Check if slot fits in any of the working hour blocks
        return workingHours.blocks.some(block => {
          const blockStart = parse(block.startTime, 'HH:mm', new Date())
          const blockEnd = parse(block.endTime, 'HH:mm', new Date())
          return !isBefore(slotTime, blockStart) && !isAfter(slotEnd, blockEnd)
        })
      })

      filteredSlots.forEach(slot => {
        const slotStart = parse(slot, 'HH:mm', new Date())
        const slotEnd = addMinutes(slotStart, service.duration)

        // Check if this slot conflicts with any existing appointment
        const hasConflict = dayAppointments.some(apt => {
          const aptStart = parse(apt.startTime, 'HH:mm', new Date())
          const aptEnd = parse(apt.endTime, 'HH:mm', new Date())

          return (
            (isAfter(slotStart, aptStart) || format(slotStart, 'HH:mm') === apt.startTime) &&
            isBefore(slotStart, aptEnd)
          ) || (
            isAfter(slotEnd, aptStart) && 
            (isBefore(slotEnd, aptEnd) || format(slotEnd, 'HH:mm') === apt.endTime)
          ) || (
            !isAfter(slotStart, aptStart) && !isBefore(slotEnd, aptEnd)
          )
        })

        if (!hasConflict) {
          availableDaySlots.push(slot)
        }
      })

      if (availableDaySlots.length > 0) {
        results.push({ date: dateStr, slots: availableDaySlots })
      }
    })

    setAvailableSlots(results)
    setSearched(true)
  }

  const handleReset = () => {
    setProfessionalId('')
    setServiceId('')
    setStartDate(new Date())
    setEndDate(addDays(new Date(), 7))
    setAvailableSlots([])
    setSearched(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Horários Disponíveis
          </DialogTitle>
          <DialogDescription>
            Pesquise horários disponíveis por profissional e serviço.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filters */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select value={professionalId} onValueChange={setProfessionalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
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

            <div className="space-y-2">
              <Label>Serviço</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {services.filter(s => s.isAvailable).map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 size-4" />
                    {format(startDate, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(d) => d && setStartDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 size-4" />
                    {format(endDate, 'dd/MM/yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(d) => d && setEndDate(d)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={findAvailableSlots} 
              disabled={!professionalId || !serviceId}
              className="flex-1"
            >
              <Search className="mr-2 size-4" />
              Buscar Horários
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Limpar
            </Button>
          </div>

          {/* Results */}
          {searched && (
            <div className="rounded-lg border">
              <div className="border-b bg-muted/50 px-4 py-2">
                <p className="text-sm font-medium">
                  Resultados para {selectedProfessional?.name} - {selectedService?.name}
                </p>
              </div>
              <ScrollArea className="h-64">
                {availableSlots.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhum horário disponível encontrado no período selecionado.
                  </div>
                ) : (
                  <div className="divide-y">
                    {availableSlots.map(({ date, slots }) => (
                      <div key={date} className="p-4">
                        <p className="mb-2 text-sm font-medium">
                          {format(new Date(date + 'T12:00:00'), "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {slots.map((slot) => (
                            <Badge 
                              key={slot} 
                              variant="outline" 
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            >
                              {slot}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
