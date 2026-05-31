import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BookingState } from '../../../types/appointment'

interface Props {
  booking: BookingState
  onNext: (data: Partial<BookingState>) => void
  onBack: () => void
}

const mockProfessionals = [
  { id: '1', name: 'Carlos Silva', initials: 'CS', specialty: 'Corte e Barba' },
  { id: '2', name: 'Ana Beatriz', initials: 'AB', specialty: 'Corte Feminino' },
]

export default function Step2Professional({ booking, onNext, onBack }: Props) {
  function handleSelect(id: string, name: string) {
    onNext({ professionalId: id, professionalName: name })
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
          Escolha o Profissional
        </h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
          {booking.date} · {booking.time}
        </p>

        <div className="flex flex-col gap-3">
          {mockProfessionals.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id, p.name)}
              style={{ borderColor: 'var(--border)' }}
              className="flex items-center gap-4 p-4 rounded-xl border hover:border-amber-500 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-sm">
                {p.initials}
              </div>
              <div>
                <p style={{ color: 'var(--text-primary)' }} className="font-medium">{p.name}</p>
                <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{p.specialty}</p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} className="ml-auto" />
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}