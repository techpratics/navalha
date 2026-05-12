"use client"

import * as React from "react"
import { format, addDays, isBefore, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Scissors,
  Check,
  Loader2,
  Crown,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  professionals,
  services,
  appointments as mockAppointments,
  clients,
  subscriptionPlans,
} from "@/lib/mock-data"
import type { Professional, Service } from "@/lib/types"

type BookingStep = "datetime" | "professional" | "service" | "confirm"

// Helper function to add minutes to a time string
const addMinutesToTime = (time: string, minutes: number): string => {
  const [h, m] = time.split(":").map(Number)
  const totalMinutes = h * 60 + m + minutes
  const newH = Math.floor(totalMinutes / 60)
  const newM = totalMinutes % 60
  return `${newH.toString().padStart(2, "0")}:${newM.toString().padStart(2, "0")}`
}

export function ClientBookingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [step, setStep] = React.useState<BookingStep>("datetime")
  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null)
  const [selectedService, setSelectedService] = React.useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null)
  const [isBooking, setIsBooking] = React.useState(false)

  // Get client info
  const clientInfo = React.useMemo(() => {
    if (!user?.clientId) return null
    const client = clients.find(c => c.id === user.clientId)
    if (!client) return null
    
    const subscription = client.subscription
    const plan = subscription ? subscriptionPlans.find(p => p.id === subscription.planId) : null
    
    return { client, subscription, plan }
  }, [user?.clientId])

  // Get available dates (next 14 days)
  const availableDates = React.useMemo(() => {
    const dates: Date[] = []
    for (let i = 0; i < 14; i++) {
      const date = addDays(new Date(), i)
      dates.push(date)
    }
    return dates
  }, [])

  // Get available professionals for selected date
  const availableProfessionalsForDate = React.useMemo(() => {
    const dayOfWeek = selectedDate.getDay()
    return professionals.filter(p => {
      if (p.status !== 'active') return false
      const workingHours = p.workingHours.find(wh => wh.dayOfWeek === dayOfWeek)
      return workingHours?.blocks && workingHours.blocks.length > 0
    })
  }, [selectedDate])

  // Get available time slots for selected professional and date
  const availableSlots = React.useMemo(() => {
    if (!selectedProfessional || !selectedService) return []

    const dayOfWeek = selectedDate.getDay()
    const workingHours = selectedProfessional.workingHours.find(wh => wh.dayOfWeek === dayOfWeek)
    
    if (!workingHours?.blocks || workingHours.blocks.length === 0) return []

    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const existingAppointments = mockAppointments.filter(
      a => a.date === dateStr && a.professionalId === selectedProfessional.id && a.status !== "cancelled"
    )

    const slots: string[] = []
    
    workingHours.blocks.forEach(block => {
      let currentTime = block.startTime
      const endTime = block.endTime
      
      while (currentTime < endTime) {
        // Check if slot is available
        const slotTaken = existingAppointments.some(a => {
          const appointmentEnd = addMinutesToTime(a.startTime, selectedService.duration)
          const slotEnd = addMinutesToTime(currentTime, selectedService.duration)
          return (currentTime >= a.startTime && currentTime < appointmentEnd) ||
                 (slotEnd > a.startTime && slotEnd <= appointmentEnd)
        })

        // Check if service fits before block ends
        const serviceEnd = addMinutesToTime(currentTime, selectedService.duration)
        const serviceFits = serviceEnd <= endTime

        if (!slotTaken && serviceFits) {
          // For today, only show future slots
          if (isToday(selectedDate)) {
            const now = new Date()
            const [hours, minutes] = currentTime.split(":").map(Number)
            const slotDate = new Date(selectedDate)
            slotDate.setHours(hours, minutes, 0, 0)
            if (isBefore(slotDate, now)) {
              currentTime = addMinutesToTime(currentTime, 15)
              continue
            }
          }
          slots.push(currentTime)
        }
        
        currentTime = addMinutesToTime(currentTime, 15)
      }
    })

    return slots
  }, [selectedProfessional, selectedService, selectedDate])

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setSelectedProfessional(null)
    setSelectedService(null)
  }

  const handleSelectTime = (time: string) => {
    setSelectedTime(time)
    setStep("professional")
  }

  const handleSelectProfessional = (prof: Professional) => {
    setSelectedProfessional(prof)
    setStep("service")
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
    setStep("confirm")
  }

  const handleConfirmBooking = async () => {
    setIsBooking(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast({
      title: "Agendamento confirmado!",
      description: `${selectedService?.name} com ${selectedProfessional?.name} em ${format(selectedDate, "dd/MM")} as ${selectedTime}`,
    })
    
    // Reset
    setStep("datetime")
    setSelectedProfessional(null)
    setSelectedService(null)
    setSelectedTime(null)
    setIsBooking(false)
  }

  const goBack = () => {
    if (step === "professional") {
      setStep("datetime")
      setSelectedProfessional(null)
    } else if (step === "service") {
      setStep("professional")
      setSelectedService(null)
    } else if (step === "confirm") {
      setStep("service")
    }
  }

  const stepLabels = ["Data/Hora", "Profissional", "Servico", "Confirmar"]
  const stepOrder: BookingStep[] = ["datetime", "professional", "service", "confirm"]
  const currentStepIndex = stepOrder.indexOf(step)

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-friendly header */}
      <div className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">Agendar Horario</h1>
            {clientInfo?.plan && (
              <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-600 border-amber-200">
                  <Crown className="size-3" />
                  {clientInfo.plan.name}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({clientInfo.subscription?.usedThisWeek}/{clientInfo.plan.usageLimit} usos)
                </span>
              </div>
            )}
          </div>

          {/* Progress - mobile optimized */}
          <div className="mt-4 flex items-center justify-center gap-1 md:gap-2">
            {stepLabels.map((label, i) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex size-7 md:size-8 items-center justify-center rounded-full text-xs md:text-sm font-medium transition-colors",
                      currentStepIndex === i
                        ? "bg-primary text-primary-foreground"
                        : currentStepIndex > i
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStepIndex > i ? <Check className="size-3 md:size-4" /> : i + 1}
                  </div>
                  <span className="mt-1 text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div
                    className={cn(
                      "h-0.5 w-4 md:w-8 mt-0 sm:-mt-4",
                      currentStepIndex > i ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl p-4 pb-24">
        {/* Step 1: Date and Time */}
        {step === "datetime" && (
          <div className="space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Calendar className="size-4 md:size-5" />
                  Escolha a Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x snap-mandatory">
                  {availableDates.map((date) => {
                    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                    const dayOfWeek = date.getDay()
                    const hasAvailableProfessionals = professionals.some(p => {
                      if (p.status !== 'active') return false
                      const wh = p.workingHours.find(w => w.dayOfWeek === dayOfWeek)
                      return wh?.blocks && wh.blocks.length > 0
                    })
                    
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleSelectDate(date)}
                        disabled={!hasAvailableProfessionals}
                        className={cn(
                          "flex flex-col items-center rounded-xl border-2 px-3 py-2 md:px-4 md:py-3 transition-all snap-center shrink-0",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground scale-105"
                            : hasAvailableProfessionals
                              ? "border-border hover:border-primary hover:bg-accent"
                              : "cursor-not-allowed opacity-40 border-transparent"
                        )}
                      >
                        <span className="text-[10px] md:text-xs font-medium uppercase">
                          {format(date, "EEE", { locale: ptBR })}
                        </span>
                        <span className="text-lg md:text-xl font-bold">
                          {format(date, "dd")}
                        </span>
                        <span className="text-[10px] md:text-xs">
                          {format(date, "MMM", { locale: ptBR })}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Clock className="size-4 md:size-5" />
                  Horarios Disponiveis
                </CardTitle>
                <CardDescription>
                  {format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {availableProfessionalsForDate.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    Nenhum profissional disponivel nesta data
                  </p>
                ) : (
                  <div className="space-y-4">
                    {availableProfessionalsForDate.map(prof => {
                      const dayOfWeek = selectedDate.getDay()
                      const workingHours = prof.workingHours.find(wh => wh.dayOfWeek === dayOfWeek)
                      const blocks = workingHours?.blocks || []
                      
                      // Get all time slots for this professional
                      const dateStr = format(selectedDate, "yyyy-MM-dd")
                      const existingAppointments = mockAppointments.filter(
                        a => a.date === dateStr && a.professionalId === prof.id && a.status !== "cancelled"
                      )
                      
                      const availableTimesForProf: string[] = []
                      blocks.forEach(block => {
                        let currentTime = block.startTime
                        while (currentTime < block.endTime) {
                          const slotTaken = existingAppointments.some(a => a.startTime === currentTime)
                          
                          if (!slotTaken) {
                            if (isToday(selectedDate)) {
                              const now = new Date()
                              const [hours, minutes] = currentTime.split(":").map(Number)
                              const slotDate = new Date(selectedDate)
                              slotDate.setHours(hours, minutes, 0, 0)
                              if (!isBefore(slotDate, now)) {
                                availableTimesForProf.push(currentTime)
                              }
                            } else {
                              availableTimesForProf.push(currentTime)
                            }
                          }
                          
                          currentTime = addMinutesToTime(currentTime, 30)
                        }
                      })
                      
                      if (availableTimesForProf.length === 0) return null
                      
                      return (
                        <div key={prof.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="size-6">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {prof.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{prof.name}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 md:grid-cols-8">
                            {availableTimesForProf.map((time) => (
                              <Button
                                key={`${prof.id}-${time}`}
                                variant="outline"
                                size="sm"
                                className="text-xs h-9"
                                onClick={() => {
                                  setSelectedTime(time)
                                  setSelectedProfessional(prof)
                                  setStep("service")
                                }}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Professional (only if coming from time without selecting prof first) */}
        {step === "professional" && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-8" onClick={goBack}>
                  <ChevronLeft className="size-4" />
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <User className="size-4 md:size-5" />
                    Escolha o Profissional
                  </CardTitle>
                  <CardDescription>
                    {format(selectedDate, "dd/MM")} as {selectedTime}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2">
              {availableProfessionalsForDate.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => handleSelectProfessional(prof)}
                  className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent active:scale-[0.98]"
                >
                  <Avatar className="size-10 md:size-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {prof.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{prof.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {prof.services.length} servicos
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Service */}
        {step === "service" && selectedProfessional && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-8" onClick={goBack}>
                  <ChevronLeft className="size-4" />
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Scissors className="size-4 md:size-5" />
                    Escolha o Servico
                  </CardTitle>
                  <CardDescription>
                    {selectedProfessional.name} - {format(selectedDate, "dd/MM")} as {selectedTime}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-2">
              {services
                .filter(s => selectedProfessional.services.includes(s.id))
                .map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleSelectService(service)}
                    className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent active:scale-[0.98]"
                  >
                    <div
                      className="size-3 rounded-full shrink-0"
                      style={{ backgroundColor: service.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{service.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {service.duration} min
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-medium text-sm">
                        R$ {service.price.toFixed(2)}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Confirm */}
        {step === "confirm" && selectedProfessional && selectedService && selectedTime && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="size-8" onClick={goBack}>
                  <ChevronLeft className="size-4" />
                </Button>
                <div>
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Check className="size-4 md:size-5" />
                    Confirmar Agendamento
                  </CardTitle>
                  <CardDescription>
                    Revise os detalhes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Profissional</span>
                  <span className="font-medium">{selectedProfessional.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Servico</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data</span>
                  <span className="font-medium">
                    {format(selectedDate, "EEE, dd/MM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Horario</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duracao</span>
                  <span className="font-medium">{selectedService.duration} min</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-primary">
                    R$ {selectedService.price.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base"
                onClick={handleConfirmBooking}
                disabled={isBooking}
              >
                {isBooking ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 size-5" />
                    Confirmar Agendamento
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
