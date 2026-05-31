import { Calendar } from 'lucide-react'
import type { Appointment } from '../../types/appointment'
import AppointmentCard from './AppointmentCard'

interface AppointmentListProps {
  appointments: Appointment[]
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div
        style={{ backgroundColor: 'var(--bg-surface)' }}
        className="rounded-2xl p-8 flex flex-col items-center gap-3"
      >
        <Calendar size={32} style={{ color: 'var(--text-muted)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Nenhum agendamento futuro</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {appointments.map(appointment => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  )
}