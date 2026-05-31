import { useState } from 'react'
import type { Appointment } from '../types/appointment'

const mockAppointments: Appointment[] = [
  {
    id: '1',
    professionalName: 'Carlos Silva',
    professionalInitials: 'CS',
    serviceName: 'Corte Masculino',
    date: '2026-06-03',
    time: '10:00',
    durationMinutes: 30,
    priceInCents: 4500,
    status: 'confirmed',
  },
  {
    id: '2',
    professionalName: 'Ana Beatriz',
    professionalInitials: 'AB',
    serviceName: 'Corte + Barba',
    date: '2026-06-10',
    time: '14:00',
    durationMinutes: 45,
    priceInCents: 6500,
    status: 'pending',
  },
  {
    id: '3',
    professionalName: 'Carlos Silva',
    professionalInitials: 'CS',
    serviceName: 'Barba',
    date: '2026-06-18',
    time: '09:30',
    durationMinutes: 20,
    priceInCents: 3000,
    status: 'confirmed',
  },
]

export function useAppointments() {
  const [appointments] = useState<Appointment[]>(
    [...mockAppointments].sort((a, b) => a.date.localeCompare(b.date))
  )

  return { appointments }
}