import { Calendar, Clock, Scissors } from 'lucide-react'
import type { Appointment } from '../../types/appointment'

interface AppointmentCardProps {
  appointment: Appointment
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const statusConfig = {
  confirmed: { label: 'Confirmado', className: 'bg-green-500/20 text-green-500 border border-green-500/30' },
  pending: { label: 'Pendente', className: 'bg-amber-500/20 text-amber-500 border border-amber-500/30' },
  cancelled: { label: 'Cancelado', className: 'bg-red-500/20 text-red-500 border border-red-500/30' },
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <div
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      className="rounded-2xl border p-4 md:p-6 flex flex-col gap-4"
    >
      {/* Topo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-sm">
            {appointment.professionalInitials}
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)' }} className="font-medium">{appointment.professionalName}</p>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm flex items-center gap-1">
              <Scissors size={12} />
              {appointment.serviceName}
            </p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[appointment.status].className}`}>
          {statusConfig[appointment.status].label}
        </span>
      </div>

      {/* Detalhes */}
      <div
        style={{ backgroundColor: 'var(--bg-elevated)' }}
        className="rounded-xl p-3 flex flex-col gap-2"
      >
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }} className="capitalize">{formatDate(appointment.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>{appointment.time} · {appointment.durationMinutes} min</span>
        </div>
      </div>

      {/* Preço */}
      <div className="flex justify-between items-center">
        <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Total</span>
        <span style={{ color: 'var(--brand)' }} className="font-bold">{formatPrice(appointment.priceInCents)}</span>
      </div>
    </div>
  )
}