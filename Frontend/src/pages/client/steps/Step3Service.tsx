import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BookingState } from '../../../types/appointment'

interface Props {
  booking: BookingState
  onNext: (data: Partial<BookingState>) => void
  onBack: () => void
}

const mockServices = [
  { id: '1', name: 'Corte Masculino', duration: 30, price: 4500 },
  { id: '2', name: 'Barba', duration: 20, price: 3000 },
  { id: '3', name: 'Corte + Barba', duration: 45, price: 6500 },
  { id: '4', name: 'Sobrancelha', duration: 15, price: 2000 },
]

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Step3Service({ booking, onNext, onBack }: Props) {
  function handleSelect(id: string, name: string, duration: number, price: number) {
    onNext({ serviceId: id, serviceName: name, serviceDuration: duration, servicePrice: price })
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

        <h2 className="text-white font-semibold mb-1">Escolha o Servico</h2>
        <p className="text-zinc-400 text-sm mb-6">
          {booking.professionalName} · {booking.date} às {booking.time}
        </p>

        <div className="flex flex-col gap-2">
          {mockServices.map(service => (
            <button
              key={service.id}
              onClick={() => handleSelect(service.id, service.name, service.duration, service.price)}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-700 hover:border-amber-500 transition-colors text-left"
            >
              <div>
                <p className="text-white font-medium">{service.name}</p>
                <p className="text-zinc-400 text-sm">{service.duration} min</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">{formatPrice(service.price)}</span>
                <ChevronRight size={16} className="text-zinc-500" />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}