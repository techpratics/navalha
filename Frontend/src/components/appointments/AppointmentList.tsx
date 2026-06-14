import { Calendar, Clock, Scissors, XCircle } from 'lucide-react'
import type { Appointment } from '../../types/appointment'

interface Props {
  appointments: Appointment[]
  onCancel: (id: string) => void
  canCancel: (date: string, time: string) => boolean
}

function formatDate(dateString: string) {
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

export default function AppointmentList({ appointments, onCancel, canCancel }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {appointments.map((app) => {
        const isCancelled = app.status === 'cancelled'
        const isPast = new Date(`${app.date}T${app.time}`) < new Date()
        const isCancelable = canCancel(app.date, app.time)

        return (
          <div 
            key={app.id} 
            style={{ 
              backgroundColor: 'var(--bg-surface)',
              opacity: isCancelled || isPast ? 0.6 : 1 
            }} 
            className="rounded-2xl p-5 border border-[var(--border)] shadow-sm flex flex-col gap-4"
          >
            {/* CABEÇALHO DO CARD */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                  {app.professionalInitials}
                </div>
                <div>
                  <p style={{ color: 'var(--text-primary)' }} className="font-semibold">
                    {app.professionalName}
                  </p>
                  <p style={{ color: 'var(--text-secondary)' }} className="text-sm flex items-center gap-1">
                    <Scissors size={14} />
                    {app.serviceName}
                  </p>
                </div>
              </div>
              
              {/* BADGE DE STATUS */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold
                ${isCancelled ? 'bg-red-500/10 text-red-500' : 
                  app.status === 'pending' ? 'bg-blue-500/10 text-blue-500' : 
                  'bg-green-500/10 text-green-500'}`}
              >
                {isCancelled ? 'Cancelado' : app.status === 'pending' ? 'Pendente' : 'Confirmado'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--border)' }} className="h-px w-full" />

            {/* DADOS DE DATA E HORA */}
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                <div className="flex items-center gap-1.5">
                  <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                  {formatDate(app.date)}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                  {app.time}
                </div>
              </div>
            </div>

            {/* BOTÃO DE CANCELAR (LÓGICA DA HU-44) */}
            {!isCancelled && !isPast && (
              <button
                onClick={() => onCancel(app.id)}
                disabled={!isCancelable}
                className={`mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-colors border
                  ${isCancelable 
                    ? 'border-red-500/30 text-red-500 hover:bg-red-500/10 active:scale-[0.98]' 
                    : 'border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed bg-[var(--bg-elevated)]'
                  }`}
              >
                <XCircle size={18} />
                {isCancelable ? 'Cancelar Agendamento' : 'Cancelamento indisponível (menos de 2h)'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}