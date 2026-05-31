import { ChevronLeft, Check } from 'lucide-react'
import type { BookingState } from '../../../types/appointment'

interface Props {
  booking: BookingState
  onBack: () => void
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatDate(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function Step4Confirm({ booking, onBack }: Props) {
  function handleConfirm() {
    console.log('Agendamento confirmado:', booking)
    // aqui vai chamar o service quando conectar com o back
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6">

        <button
          onClick={onBack}
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 transition-colors hover:opacity-80"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Check size={18} style={{ color: 'var(--text-primary)' }} />
          <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold">Confirmar Agendamento</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">Revise os detalhes</p>

        {/* Resumo */}
        <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="rounded-xl p-4 flex flex-col gap-3 mb-6">
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Profissional</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.professionalName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Servico</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Data</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">
              {booking.date ? formatDate(booking.date) : '--'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Horario</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Duracao</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.serviceDuration} min</span>
          </div>
          <div style={{ backgroundColor: 'var(--border)' }} className="h-px" />
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-primary)' }} className="font-semibold">Total</span>
            <span style={{ color: 'var(--brand)' }} className="font-bold text-lg">
              {booking.servicePrice ? formatPrice(booking.servicePrice) : '--'}
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          style={{ backgroundColor: 'var(--brand)' }}
          className="w-full flex items-center justify-center gap-2 text-black font-semibold py-3 rounded-xl transition-colors hover:opacity-90"
        >
          <Check size={18} />
          Confirmar Agendamento
        </button>

      </div>
    </div>
  )
}