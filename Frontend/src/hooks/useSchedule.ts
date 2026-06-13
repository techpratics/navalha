import { useState } from 'react'
import type { Appointment } from '../types/appointment'

type ViewMode = 'daily' | 'weekly' | 'monthly'

export function useSchedule() {
  const [viewMode, setViewMode] = useState<ViewMode>('daily')
  const [currentDate, setCurrentDate] = useState(new Date())

  // Mock de dados (futuramente aqui vai ter um useEffect chamando a API com a currentDate)
  const appointments: Appointment[] = [
    {
      id: '1',
      time: '09:00',
      durationMinutes: 45,
      clientName: 'Carlos Silva',
      clientInitials: 'CS',
      professionalName: 'João Barbeiro',
      professionalInitials: 'JB',
      serviceName: 'Corte Degradê',
      status: 'confirmed',
      date: '2026-06-13',
      priceInCents: 4500
    },
    {
      id: '2',
      time: '10:30',
      durationMinutes: 60,
      clientName: 'Marcos Paulo',
      clientInitials: 'MP',
      professionalName: 'João Barbeiro',
      professionalInitials: 'JB',
      serviceName: 'Barba Terapia Completa',
      status: 'pending',
      date: '2026-06-13',
      priceInCents: 3500
    }
  ]

  // Lógica inteligente de navegação baseada no ViewMode
  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (viewMode === 'daily') newDate.setDate(prev.getDate() - 1)
      if (viewMode === 'weekly') newDate.setDate(prev.getDate() - 7)
      if (viewMode === 'monthly') newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (viewMode === 'daily') newDate.setDate(prev.getDate() + 1)
      if (viewMode === 'weekly') newDate.setDate(prev.getDate() + 7)
      if (viewMode === 'monthly') newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return {
    viewMode,
    setViewMode,
    currentDate,
    appointments,
    handlePrevious,
    handleNext,
    handleToday
  }
}