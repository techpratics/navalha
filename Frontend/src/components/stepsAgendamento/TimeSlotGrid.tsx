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
          style={
            selectedTime === slot.time && selectedProfessionalId === professionalId
              ? { backgroundColor: 'var(--brand)', borderColor: 'var(--brand)', color: '#000' }
              : slot.available
                ? { borderColor: 'var(--border)', color: 'var(--text-primary)', backgroundColor: 'transparent' }
                : { borderColor: 'var(--border)', color: 'var(--text-muted)', backgroundColor: 'transparent' }
          }
          className="px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:cursor-not-allowed"
        >
          {slot.time}
        </button>
      ))}
    </div>
  )
}