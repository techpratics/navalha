'use client'

import * as React from 'react'
import { 
  format, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks, 
  subWeeks,
  addMonths,
  subMonths,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  getDay,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Plus,
  Printer,
  Clock,
  CalendarDays,
  User,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { professionals, appointments as mockAppointments, services } from '@/lib/mock-data'
import type { Appointment, Professional, TimeBlock } from '@/lib/types'
import { NewAppointmentDialog } from '@/components/schedule/new-appointment-dialog'
import { AppointmentDetailsDialog } from '@/components/schedule/appointment-details-dialog'
import { AvailableSlotsDialog } from '@/components/schedule/available-slots-dialog'

type ViewMode = 'day' | 'week' | 'month'

interface SchedulePageProps {
  selectedProfessionalId?: string
}

export function SchedulePage({ selectedProfessionalId }: SchedulePageProps) {
  const { user } = useAuth()
  const [viewMode, setViewMode] = React.useState<ViewMode>('day')
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [appointments, setAppointments] = React.useState<Appointment[]>(mockAppointments)
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null)
  const [newAppointmentOpen, setNewAppointmentOpen] = React.useState(false)
  const [newAppointmentTime, setNewAppointmentTime] = React.useState<string | undefined>()
  const [newAppointmentProfessionalId, setNewAppointmentProfessionalId] = React.useState<string | undefined>()
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [slotsDialogOpen, setSlotsDialogOpen] = React.useState(false)
  const [blockMode, setBlockMode] = React.useState(false)

  const dateString = format(selectedDate, 'yyyy-MM-dd')
  const dayOfWeek = selectedDate.getDay()
  
  // For professionals, only show their own schedule
  // For clients, show all professionals to book with
  // For admin, show all or selected professional
  const displayedProfessionals = React.useMemo(() => {
    if (user?.role === 'professional' && user.professionalId) {
      return professionals.filter(p => p.id === user.professionalId)
    }
    if (selectedProfessionalId) {
      return professionals.filter(p => p.id === selectedProfessionalId)
    }
    return professionals.filter(p => p.status === 'active')
  }, [user?.role, user?.professionalId, selectedProfessionalId])
  
  // Check if user can modify appointments
  const canModifyAppointments = user?.role === 'admin' || user?.role === 'professional'
  const isClientView = user?.role === 'client'

  const dayAppointments = appointments.filter(a => a.date === dateString)

  const goToToday = () => setSelectedDate(new Date())
  
  const goToPrevious = () => {
    if (viewMode === 'day') setSelectedDate(prev => subDays(prev, 1))
    else if (viewMode === 'week') setSelectedDate(prev => subWeeks(prev, 1))
    else if (viewMode === 'month') setSelectedDate(prev => subMonths(prev, 1))
  }
  
  const goToNext = () => {
    if (viewMode === 'day') setSelectedDate(prev => addDays(prev, 1))
    else if (viewMode === 'week') setSelectedDate(prev => addWeeks(prev, 1))
    else if (viewMode === 'month') setSelectedDate(prev => addMonths(prev, 1))
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setViewMode('day')
  }

  const handleSlotClick = (time: string, professionalId: string) => {
    if (blockMode) {
      return
    }
    setNewAppointmentTime(time)
    setNewAppointmentProfessionalId(professionalId)
    setNewAppointmentOpen(true)
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDetailsOpen(true)
  }

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment])
  }

  const handleUpdateAppointment = (updated: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updated.id ? updated : a))
  }

  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id))
  }

  // Generate time slots for a block (15 min intervals)
  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = []
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    let currentHour = startHour
    let currentMin = startMin
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`)
      currentMin += 15
      if (currentMin >= 60) {
        currentMin = 0
        currentHour++
      }
    }
    
    return slots
  }

  // Get working blocks for a professional on a specific day
  const getWorkingBlocks = (professionalId: string, dayOfWeek: number): TimeBlock[] => {
    const prof = professionals.find(p => p.id === professionalId)
    if (!prof) return []
    
    const dayWorkingHours = prof.workingHours.find(wh => wh.dayOfWeek === dayOfWeek)
    return dayWorkingHours?.blocks || []
  }

  // Get appointments count for a specific date
  const getAppointmentsCount = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return appointments.filter(a => a.date === dateStr && a.status !== 'cancelled').length
  }

  // Render title based on view mode
  const renderTitle = () => {
    if (viewMode === 'day') {
      return format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
    } else if (viewMode === 'week') {
      const start = startOfWeek(selectedDate, { weekStartsOn: 0 })
      const end = endOfWeek(selectedDate, { weekStartsOn: 0 })
      return `${format(start, "d 'de' MMM", { locale: ptBR })} - ${format(end, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`
    } else {
      return format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR })
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4 lg:flex-row">
      {/* Main schedule area */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border bg-card">
        {/* Schedule toolbar */}
        <div className="flex flex-col gap-2 border-b p-2 md:flex-row md:items-center md:justify-between md:p-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border">
              <Button
                variant={viewMode === 'day' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-r-none px-2 text-xs md:px-3 md:text-sm"
                onClick={() => setViewMode('day')}
              >
                Dia
              </Button>
              <Button
                variant={viewMode === 'week' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-none border-x px-2 text-xs md:px-3 md:text-sm"
                onClick={() => setViewMode('week')}
              >
                Semana
              </Button>
              <Button
                variant={viewMode === 'month' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-l-none px-2 text-xs md:px-3 md:text-sm"
                onClick={() => setViewMode('month')}
              >
                Mês
              </Button>
            </div>

            <div className="hidden h-6 w-px bg-border md:block" />

            <Button variant="outline" size="sm" onClick={goToToday} className="px-2 text-xs md:px-3 md:text-sm">
              Hoje
            </Button>
            <Button variant="ghost" size="icon" className="size-7 md:size-8" onClick={goToPrevious}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-7 md:size-8" onClick={goToNext}>
              <ChevronRight className="size-4" />
            </Button>

            <span className="text-xs font-medium md:text-sm capitalize">
              {renderTitle()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-7 md:size-8">
              <RefreshCw className="size-4" />
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="px-2 text-xs md:px-3 md:text-sm"
              onClick={() => {
                setNewAppointmentTime(undefined)
                setNewAppointmentProfessionalId(undefined)
                setNewAppointmentOpen(true)
              }}
            >
              <Plus className="mr-1 size-4" />
              <span className="hidden sm:inline">Encaixe</span>
              <span className="sm:hidden">Novo</span>
            </Button>
            <Button variant="ghost" size="icon" className="size-7 md:size-8">
              <Printer className="size-4" />
            </Button>
          </div>
        </div>

        {/* Content based on view mode */}
        <div className="flex-1 overflow-y-auto">
          {viewMode === 'day' && (
            <DayView
              date={selectedDate}
              professionals={displayedProfessionals}
              appointments={dayAppointments}
              getWorkingBlocks={getWorkingBlocks}
              generateTimeSlots={generateTimeSlots}
              onSlotClick={handleSlotClick}
              onAppointmentClick={handleAppointmentClick}
              blockMode={blockMode}
            />
          )}

          {viewMode === 'week' && (
            <WeekView
              selectedDate={selectedDate}
              appointments={appointments}
              professionals={displayedProfessionals}
              getAppointmentsCount={getAppointmentsCount}
              onDayClick={handleDayClick}
            />
          )}

          {viewMode === 'month' && (
            <MonthView
              selectedDate={selectedDate}
              appointments={appointments}
              getAppointmentsCount={getAppointmentsCount}
              onDayClick={handleDayClick}
            />
          )}
        </div>
      </div>

      {/* Right sidebar - only visible on day view */}
      {viewMode === 'day' && (
        <div className="hidden w-72 flex-col gap-4 xl:flex">
          {/* Today's appointments list */}
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <CalendarDays className="size-4" />
                Agendamentos do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-64">
                <div className="space-y-1 p-3 pt-0">
                  {dayAppointments.filter(a => a.status !== 'cancelled').length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Nenhum agendamento
                    </p>
                  ) : (
                    dayAppointments
                      .filter(a => a.status !== 'cancelled')
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm hover:bg-accent"
                          onClick={() => handleAppointmentClick(appointment)}
                        >
                          <StatusDot status={appointment.status} />
                          <span className="font-mono text-xs text-muted-foreground">
                            {appointment.startTime}
                          </span>
                          <span className="truncate">{appointment.clientName}</span>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setSlotsDialogOpen(true)}
            >
              <Clock className="mr-2 size-4" />
              Horários Disponíveis
            </Button>
            <div className="flex items-center gap-2 rounded-md border p-3">
              <Checkbox 
                id="block-mode" 
                checked={blockMode}
                onCheckedChange={(checked) => setBlockMode(checked === true)}
              />
              <Label htmlFor="block-mode" className="text-sm cursor-pointer">
                Modo Bloquear Horário
              </Label>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <NewAppointmentDialog
        open={newAppointmentOpen}
        onOpenChange={setNewAppointmentOpen}
        selectedDate={selectedDate}
        selectedTime={newAppointmentTime}
        selectedProfessionalId={newAppointmentProfessionalId}
        onAdd={handleAddAppointment}
      />

      <AppointmentDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        appointment={selectedAppointment}
        onUpdate={handleUpdateAppointment}
        onDelete={handleDeleteAppointment}
      />

      <AvailableSlotsDialog
        open={slotsDialogOpen}
        onOpenChange={setSlotsDialogOpen}
        appointments={appointments}
      />
    </div>
  )
}

// Day View Component
function DayView({
  date,
  professionals,
  appointments,
  getWorkingBlocks,
  generateTimeSlots,
  onSlotClick,
  onAppointmentClick,
  blockMode,
}: {
  date: Date
  professionals: Professional[]
  appointments: Appointment[]
  getWorkingBlocks: (professionalId: string, dayOfWeek: number) => TimeBlock[]
  generateTimeSlots: (start: string, end: string) => string[]
  onSlotClick: (time: string, professionalId: string) => void
  onAppointmentClick: (appointment: Appointment) => void
  blockMode: boolean
}) {
  const dayOfWeek = date.getDay()

  return (
    <div className="p-4 space-y-6">
      {professionals.map((professional) => {
        const blocks = getWorkingBlocks(professional.id, dayOfWeek)
        const profAppointments = appointments.filter(a => a.professionalId === professional.id)

        return (
          <Card key={professional.id} className="overflow-hidden">
            <CardHeader className="bg-sidebar text-sidebar-foreground py-3 px-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border-2 border-sidebar-primary">
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-medium">
                    {professional.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{professional.name}</CardTitle>
                  <p className="text-xs text-sidebar-foreground/70">
                    {blocks.length > 0 
                      ? blocks.map(b => `${b.startTime} - ${b.endTime}`).join(' | ')
                      : 'Folga'
                    }
                  </p>
                </div>
                {blocks.length === 0 && (
                  <Badge variant="secondary" className="ml-auto">Folga</Badge>
                )}
              </div>
            </CardHeader>

            {blocks.length > 0 && (
              <CardContent className="p-0">
                <div className="divide-y">
                  {blocks.map((block) => {
                    const slots = generateTimeSlots(block.startTime, block.endTime)
                    
                    return (
                      <div key={block.id} className="p-3">
                        <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <Clock className="size-3" />
                          {block.startTime} - {block.endTime}
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-1">
                          {slots.map((slot) => {
                            const slotAppointment = profAppointments.find(
                              a => a.startTime === slot && a.status !== 'cancelled'
                            )
                            
                            return (
                              <div
                                key={slot}
                                className={cn(
                                  'relative rounded-md border p-1.5 text-center text-xs transition-all',
                                  slotAppointment 
                                    ? 'cursor-pointer'
                                    : 'cursor-pointer hover:bg-accent hover:border-accent-foreground/20',
                                  slotAppointment?.status === 'confirmed' && 'bg-emerald-500/20 border-emerald-500/50 text-emerald-700',
                                  slotAppointment?.status === 'pending' && 'bg-amber-500/20 border-amber-500/50 text-amber-700',
                                  slotAppointment?.status === 'completed' && 'bg-blue-500/20 border-blue-500/50 text-blue-700',
                                  blockMode && !slotAppointment && 'hover:bg-red-500/20 hover:border-red-500/50'
                                )}
                                onClick={() => {
                                  if (slotAppointment) {
                                    onAppointmentClick(slotAppointment)
                                  } else {
                                    onSlotClick(slot, professional.id)
                                  }
                                }}
                                title={slotAppointment ? `${slotAppointment.clientName} - ${slotAppointment.serviceName}` : 'Clique para agendar'}
                              >
                                <div className="font-mono">{slot}</div>
                                {slotAppointment && (
                                  <div className="truncate text-[10px] mt-0.5 font-medium">
                                    {slotAppointment.clientName.split(' ')[0]}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      {professionals.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <User className="size-12 mb-4 opacity-50" />
          <p>Nenhum profissional encontrado</p>
        </div>
      )}
    </div>
  )
}

// Week View Component
function WeekView({
  selectedDate,
  appointments,
  professionals,
  getAppointmentsCount,
  onDayClick,
}: {
  selectedDate: Date
  appointments: Appointment[]
  professionals: Professional[]
  getAppointmentsCount: (date: Date) => number
  onDayClick: (date: Date) => void
}) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {days.map((day) => {
          const dayOfWeek = day.getDay()
          const count = getAppointmentsCount(day)
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayAppointments = appointments.filter(a => a.date === dateStr && a.status !== 'cancelled')
          
          // Check which professionals work on this day
          const workingProfessionals = professionals.filter(p => {
            const wh = p.workingHours.find(w => w.dayOfWeek === dayOfWeek)
            return wh?.blocks && wh.blocks.length > 0
          })

          return (
            <Card 
              key={day.toISOString()} 
              className={cn(
                'cursor-pointer transition-all hover:shadow-md hover:border-primary/50',
                isToday(day) && 'ring-2 ring-primary'
              )}
              onClick={() => onDayClick(day)}
            >
              <CardHeader className="pb-2 pt-3 px-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{dayNames[dayOfWeek]}</p>
                    <p className={cn(
                      'text-2xl font-bold',
                      isToday(day) && 'text-primary'
                    )}>
                      {format(day, 'd')}
                    </p>
                  </div>
                  {count > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {count} {count === 1 ? 'agend.' : 'agend.'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-1">
                  {workingProfessionals.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Sem expediente</p>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {workingProfessionals.slice(0, 3).map(p => (
                          <Avatar key={p.id} className="size-6">
                            <AvatarFallback className="text-[10px] bg-muted">
                              {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {workingProfessionals.length > 3 && (
                          <Avatar className="size-6">
                            <AvatarFallback className="text-[10px] bg-muted">
                              +{workingProfessionals.length - 3}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      {dayAppointments.slice(0, 2).map((apt) => (
                        <div key={apt.id} className="flex items-center gap-1.5 text-xs">
                          <StatusDot status={apt.status} />
                          <span className="font-mono text-muted-foreground">{apt.startTime}</span>
                          <span className="truncate">{apt.clientName.split(' ')[0]}</span>
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{dayAppointments.length - 2} mais
                        </p>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Month View Component
function MonthView({
  selectedDate,
  appointments,
  getAppointmentsCount,
  onDayClick,
}: {
  selectedDate: Date
  appointments: Appointment[]
  getAppointmentsCount: (date: Date) => number
  onDayClick: (date: Date) => void
}) {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <div className="p-4">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-muted-foreground py-2">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const count = getAppointmentsCount(day)
          const isCurrentMonth = isSameMonth(day, selectedDate)
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'aspect-square p-1 rounded-lg border cursor-pointer transition-all hover:bg-accent',
                !isCurrentMonth && 'opacity-40',
                isToday(day) && 'ring-2 ring-primary bg-primary/5',
              )}
              onClick={() => onDayClick(day)}
            >
              <div className="h-full flex flex-col">
                <span className={cn(
                  'text-sm font-medium',
                  isToday(day) && 'text-primary'
                )}>
                  {format(day, 'd')}
                </span>
                {count > 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {count}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: Appointment['status'] }) {
  return (
    <div
      className={cn(
        'size-2 rounded-full shrink-0',
        status === 'confirmed' && 'bg-emerald-500',
        status === 'pending' && 'bg-amber-500',
        status === 'cancelled' && 'bg-red-500',
        status === 'completed' && 'bg-blue-500'
      )}
    />
  )
}
