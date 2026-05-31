import type { ProfessionalSlots as ProfessionalSlotsType } from '../../types/appointment'
import TimeSlotGrid from './TimeSlotGrid'

interface ProfessionalSlotsProps {
  professional: ProfessionalSlotsType
  selectedTime: string | null
  selectedProfessionalId: string | null
  onSelect: (professionalId: string, time: string) => void
}

export default function ProfessionalSlots({
  professional,
  selectedTime,
  selectedProfessionalId,
  onSelect,
}: ProfessionalSlotsProps) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-500 text-xs font-bold flex items-center justify-center">
          {professional.initials}
        </div>
        <span className="text-amber-500 text-sm font-medium">{professional.name}</span>
      </div>
      <TimeSlotGrid
        slots={professional.slots}
        selectedTime={selectedTime}
        selectedProfessionalId={selectedProfessionalId}
        professionalId={professional.id}
        onSelect={(time) => onSelect(professional.id, time)}
      />
    </div>
  )
}