import { ChevronLeft, Check, AlertCircle } from 'lucide-react'
import { useSubmitAppointment } from '../../../hooks/useSubmitAppointment'
import type { BookingState } from '../../../types/appointment'

interface Props {
  booking: BookingState
  onBack: () => void
  onNext: () => void
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

export default function Step3Confirm({ booking, onBack, onNext }: Props) {
  // A UI consome o Hook e passa as responsabilidades
  const { submitAppointment, loading, errorMsg } = useSubmitAppointment({ 
    booking, 
    onSuccess: onNext 
  });

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6 shadow-sm border border-[var(--border)]">

        <button
          onClick={onBack}
          disabled={loading}
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 transition-colors hover:opacity-80 disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Check size={18} style={{ color: 'var(--text-primary)' }} />
          <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold text-lg">Confirmar Agendamento</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">Revise os detalhes do seu atendimento</p>

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl mb-4 flex items-start gap-2 text-red-500 animate-in slide-in-from-top-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        )}

        {/* Resumo */}
        <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="rounded-xl p-4 flex flex-col gap-3 mb-6 border border-[var(--border)]">
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Profissional</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.professionalName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Serviço</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Data</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium capitalize">
              {booking.date ? formatDate(booking.date) : '--'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Horário</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-secondary)' }}>Duração</span>
            <span style={{ color: 'var(--text-primary)' }} className="font-medium">{booking.serviceDuration} min</span>
          </div>
          <div style={{ backgroundColor: 'var(--border)' }} className="h-px my-1" />
          <div className="flex justify-between items-center">
            <span style={{ color: 'var(--text-primary)' }} className="font-semibold">Total</span>
            <span style={{ color: 'var(--brand)' }} className="font-bold text-lg">
              {booking.servicePrice ? formatPrice(booking.servicePrice) : '--'}
            </span>
          </div>
        </div>

        <button
          onClick={submitAppointment}
          disabled={loading}
          style={{ backgroundColor: 'var(--brand)' }}
          className="w-full flex items-center justify-center gap-2 text-black font-bold py-3.5 rounded-xl transition-transform active:scale-[0.98] hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="animate-pulse">Confirmando...</span>
          ) : (
            <>
              <Check size={18} strokeWidth={3} />
              Confirmar Agendamento
            </>
          )}
        </button>

      </div>
    </div>
  )
}