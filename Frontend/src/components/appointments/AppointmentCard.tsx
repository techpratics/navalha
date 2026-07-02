import { Calendar, Clock, Scissors } from 'lucide-react'
import type { Appointment } from '../../types/appointment'

interface AppointmentCardProps {
  appointment: Appointment
  view?: 'client' | 'professional'
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
  confirmed: { label: 'Confirmado', className: 'bg-green-500/20 text-green-500 border border-green-500/30 mb-4' },
  pending: { label: 'Pendente', className: 'bg-amber-500/20 text-amber-500 border border-amber-500/30' },
  cancelled: { label: 'Cancelado', className: 'bg-red-500/20 text-red-500 border border-red-500/30' },
  completed: {label: 'Concluido', className: 'bg-blue-500/20 text-blue-500 border border-blue-500/30'},
}

export default function AppointmentCard({ appointment, view = 'client' }: AppointmentCardProps) {
  const isProfessional = view === 'professional'
  const name = isProfessional ? appointment.clientName : appointment.professionalName
  const initials = isProfessional ? appointment.clientInitials : appointment.professionalInitials

  if (isProfessional) {
    return (
      <div
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        className="rounded-2xl border flex overflow-hidden group hover:border-amber-500/50 transition-colors"
      >
        {/* Horário em destaque à esquerda */}
        <div 
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
          className="w-20 md:w-28 border-r flex flex-col items-center justify-center p-2 bg-amber-500/5"
        >
          <span style={{ color: 'var(--brand)' }} className="text-xl md:text-2xl font-black leading-none">
            {appointment.time}
          </span>
          <span style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase font-bold mt-1">
            {appointment.durationMinutes} min
          </span>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-xs">
                {initials}
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)' }} className="font-bold text-sm leading-tight">{name}</p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs flex items-center gap-1 mt-0.5">
                  <Scissors size={10} />
                  {appointment.serviceName}
                </p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusConfig[appointment.status].className}`}>
              {statusConfig[appointment.status].label}
            </span>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2 border-t border-dashed border-border/50">
             <div className="flex items-center gap-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
               <Calendar size={12} />
               <span className="capitalize">{new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
             </div>
             <span style={{ color: 'var(--brand)' }} className="font-bold text-sm">{formatPrice(appointment.priceInCents)}</span>
          </div>
        </div>
      </div>
    )
  }

  // Layout padrão para Cliente
  return (
    <div
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      className="rounded-2xl border p-4 md:p-6 flex flex-col gap-4"
    >
      {/* Topo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-sm">
            {initials}
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)' }} className="font-medium">{name}</p>
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
