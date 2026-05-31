import type { TimeSlot } from '../../types/appointment'

interface TimeSlotGridProps {
  slots: TimeSlot[]
  selectedTime: string | null
  selectedProfessionalId: string | null
  professionalId: string
  onSelect: (time: string) => void
}

export default function TimeSlotGrid({
  slots,
  selectedTime,
  selectedProfessionalId,
  professionalId,
  onSelect,
}: TimeSlotGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {slots.map(slot => (
        <button
          key={slot.time}
          disabled={!slot.available}
          onClick={() => onSelect(slot.time)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            selectedTime === slot.time && selectedProfessionalId === professionalId
              ? 'bg-amber-500 border-amber-500 text-black font-semibold'
              : slot.available
                ? 'border-zinc-700 text-white hover:border-zinc-500'
                : 'border-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {slot.time}
        </button>
      ))}
    </div>
  )
}