import { Calendar } from 'lucide-react'
import type { Appointment } from '../../types/appointment'
import AppointmentCard from './AppointmentCard'

interface AppointmentListProps {
  appointments: Appointment[]
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-8 flex flex-col items-center gap-3">
        <Calendar size={32} className="text-zinc-600" />
        <p className="text-zinc-400">Nenhum agendamento futuro</p>
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