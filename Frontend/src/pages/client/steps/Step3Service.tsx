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
      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6">

        <button
          onClick={onBack}
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 transition-colors hover:opacity-80"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-1">
          Escolha o Servico
        </h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
          {booking.professionalName} · {booking.date} às {booking.time}
        </p>

        <div className="flex flex-col gap-2">
          {mockServices.map(service => (
            <button
              key={service.id}
              onClick={() => handleSelect(service.id, service.name, service.duration, service.price)}
              style={{ borderColor: 'var(--border)' }}
              className="flex items-center justify-between p-4 rounded-xl border hover:border-amber-500 transition-colors text-left"
            >
              <div>
                <p style={{ color: 'var(--text-primary)' }} className="font-medium">{service.name}</p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{service.duration} min</p>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ color: 'var(--text-primary)' }} className="font-medium">{formatPrice(service.price)}</span>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}