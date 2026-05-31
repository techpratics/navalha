import type { BookingState } from '../../../types/appointment'
import { ChevronLeft } from 'lucide-react'

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

      <div className="bg-zinc-900 rounded-2xl p-4 md:p-6">
        <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-2 rounded-lg mb-6 transition-colors"
        >
            <ChevronLeft size={16} />
            Voltar
        </button>

        <h2 className="text-white font-semibold mb-1">Escolha o Profissional</h2>
        <p className="text-zinc-400 text-sm mb-6">
          {booking.date} · {booking.time}
        </p>

        <div className="flex flex-col gap-3">
          {mockProfessionals.map(p => (
            <button
              key={p.id}
              onClick={() => handleSelect(p.id, p.name)}
              className="flex items-center gap-4 p-4 rounded-xl border border-zinc-700 hover:border-amber-500 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center text-sm">
                {p.initials}
              </div>
              <div>
                <p className="text-white font-medium">{p.name}</p>
                <p className="text-zinc-400 text-sm">{p.specialty}</p>
              </div>
              <ChevronLeft size={16} className="text-zinc-500 rotate-180 ml-auto" />
            </button>
          ))}
        </div>
      </div>

    </div>
  )
}