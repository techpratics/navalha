import { useState } from 'react'
import type { Appointment } from '../types/appointment'

const mockAppointments: Appointment[] = [
  {
    id: '1',
    professionalName: 'Carlos Silva',
    professionalInitials: 'CS',
    clientName: 'João Oliveira',
    clientInitials: 'JO',
    serviceName: 'Corte Masculino',
    date: '2026-05-31',
    time: '09:00',
    durationMinutes: 30,
    priceInCents: 4500,
    status: 'confirmed',
  },
  {
    id: '4',
    professionalName: 'Carlos Silva',
    professionalInitials: 'CS',
    clientName: 'Ricardo Santos',
    clientInitials: 'RS',
    serviceName: 'Barba',
    date: '2026-05-31',
    time: '10:30',
    durationMinutes: 20,
    priceInCents: 3000,
    status: 'confirmed',
  },
  {
    id: '5',
    professionalName: 'Carlos Silva',
    professionalInitials: 'CS',
    clientName: 'Marcos Souza',
    clientInitials: 'MS',
    serviceName: 'Corte + Barba',
    date: '2026-05-31',
    time: '14:00',
    durationMinutes: 45,
    priceInCents: 6500,
    status: 'confirmed',
  },
  {
    id: '2',
    professionalName: 'Ana Beatriz',
    professionalInitials: 'AB',
    clientName: 'Paulo Lima',
    clientInitials: 'PL',
    serviceName: 'Corte + Barba',
    date: '2026-05-31',
    time: '14:00',
    durationMinutes: 45,
    priceInCents: 6500,
    status: 'pending',
  },
  {
    id: '3',
    professionalName: 'Carlos Silva',
    professionalInitials: 'CS',
    clientName: 'Felipe Neves',
    clientInitials: 'FN',
    serviceName: 'Barba',
    date: '2026-06-18',
    time: '09:30',
    durationMinutes: 20,
    priceInCents: 3000,
    status: 'confirmed',
  },
]

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(
    [...mockAppointments].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time.localeCompare(b.time)
    })
  )

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const appointment: Appointment = {
      ...newApp,
      id: Math.random().toString(36).substr(2, 9)
    }
    
    setAppointments(prev => {
      const updated = [...prev, appointment]
      return updated.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        if (dateCompare !== 0) return dateCompare
        return a.time.localeCompare(b.time)
      })
    })
  }

  const checkAvailability = (date: string, time: string, duration: number, professionalName: string) => {
    const newStartTime = new Date(`${date}T${time}`).getTime()
    const newEndTime = newStartTime + duration * 60000

    return !appointments.some(app => {
      if (app.date !== date || app.professionalName !== professionalName || app.status === 'cancelled') return false
      
      const appStartTime = new Date(`${app.date}T${app.time}`).getTime()
      const appEndTime = appStartTime + app.durationMinutes * 60000

      // Sobreposição: (Inicio1 < Fim2) && (Inicio2 < Fim1)
      return newStartTime < appEndTime && appStartTime < newEndTime
    })
  }

  return { appointments, addAppointment, checkAvailability }
}
