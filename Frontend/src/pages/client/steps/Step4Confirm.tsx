import { ChevronLeft, Check } from 'lucide-react'
import type { BookingState } from '../../../types/appointment'

interface Props {
  booking: BookingState
  onBack: () => void
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Step4Confirm({ booking, onBack }: Props) {
  function handleConfirm() {
    console.log('Agendamento confirmado:', booking)
    // aqui vai chamar o service quando conectar com o back
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div className="bg-zinc-900 rounded-2xl p-4 md:p-6">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg mb-4 transition-colors"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Check size={18} className="text-white" />
          <h2 className="text-white font-semibold">Confirmar Agendamento</h2>
        </div>
        <p className="text-zinc-400 text-sm mb-6">Revise os detalhes</p>

        {/* Resumo */}
        <div className="bg-zinc-800 rounded-xl p-4 flex flex-col gap-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Profissional</span>
            <span className="text-white font-medium">{booking.professionalName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Servico</span>
            <span className="text-white font-medium">{booking.serviceName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Data</span>
            <span className="text-white font-medium">
                {booking.date
                    ? new Date(booking.date + 'T00:00:00').toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })
                    : '--'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Horario</span>
            <span className="text-white font-medium">{booking.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Duracao</span>
            <span className="text-white font-medium">{booking.serviceDuration} min</span>
          </div>
          <div className="h-px bg-zinc-700" />
          <div className="flex justify-between">
            <span className="text-white font-semibold">Total</span>
            <span className="text-amber-500 font-bold text-lg">
              {booking.servicePrice ? formatPrice(booking.servicePrice) : '--'}
            </span>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold py-3 rounded-xl transition-colors"
        >
          <Check size={18} />
          Confirmar Agendamento
        </button>

      </div>
    </div>
  )
}