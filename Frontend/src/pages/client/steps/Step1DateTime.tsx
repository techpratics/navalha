import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import type { BookingState, ProfessionalSlots } from '../../../types/appointment'
import DateSelector from '../../../components/stepsAgendamento/DateSelector'
import ProfessionalSlotsComponent from '../../../components/stepsAgendamento/ProfessionalSlots'

interface Props {
  booking: BookingState
  onNext: (data: Partial<BookingState>) => void
}

const mockDays = [
  { date: '2026-05-29', label: 'SEXTA', day: '29', month: 'mai' },
  { date: '2026-05-30', label: 'SÁBADO', day: '30', month: 'mai' },
  { date: '2026-05-31', label: 'DOMINGO', day: '31', month: 'mai', disabled: true },
  { date: '2026-06-01', label: 'SEGUNDA', day: '01', month: 'jun' },
  { date: '2026-06-02', label: 'TERÇA', day: '02', month: 'jun' },
  { date: '2026-06-03', label: 'QUARTA', day: '03', month: 'jun' },
  { date: '2026-06-04', label: 'QUINTA', day: '04', month: 'jun' },
]

const mockSlots: ProfessionalSlots[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    initials: 'CS',
    slots: [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: true },
      { time: '12:00', available: true },
      { time: '12:30', available: true },
      { time: '13:00', available: true },
      { time: '13:30', available: true },
    ],
  },
  {
    id: '2',
    name: 'Ana Beatriz',
    initials: 'AB',
    slots: [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: true },
      { time: '12:00', available: true },
      { time: '12:30', available: true },
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '14:00', available: true },
      { time: '14:30', available: true },
      { time: '15:00', available: true },
      { time: '15:30', available: true },
    ],
  },
]

export default function Step1DateTime({ onNext }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-30')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null)

  function handleSlotClick(professionalId: string, time: string) {
    setSelectedTime(time)
    setSelectedProfessionalId(professionalId)
  }

  function handleNext() {
    if (!selectedDate || !selectedTime || !selectedProfessionalId) return
    const professional = mockSlots.find(p => p.id === selectedProfessionalId)
    onNext({
      date: selectedDate,
      time: selectedTime,
      professionalId: selectedProfessionalId,
      professionalName: professional?.name ?? null,
    })
  }

  const selectedDay = mockDays.find(d => d.date === selectedDate)

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">

      <div className="bg-zinc-900 rounded-2xl p-4 md:p-6">
        <h2 className="text-white font-semibold flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-amber-500" />
          Escolha a Data
        </h2>
        <DateSelector
          days={mockDays}
          selectedDate={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date)
            setSelectedTime(null)
            setSelectedProfessionalId(null)
          }}
        />
      </div>

      <div className="bg-zinc-900 rounded-2xl p-4 md:p-6">
        <h2 className="text-white font-semibold flex items-center gap-2 mb-1">
          <Clock size={16} className="text-amber-500" />
          Horarios Disponíveis
        </h2>
        {selectedDay && (
          <p className="text-zinc-400 text-sm mb-4">
            {selectedDay.label.toLowerCase()}, {selectedDay.day} de {selectedDay.month === 'mai' ? 'maio' : 'junho'}
          </p>
        )}
        <div className="flex flex-col gap-6">
          {mockSlots.map(professional => (
            <ProfessionalSlotsComponent
              key={professional.id}
              professional={professional}
              selectedTime={selectedTime}
              selectedProfessionalId={selectedProfessionalId}
              onSelect={handleSlotClick}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedTime}
        className={`w-full py-3 rounded-xl font-semibold transition-colors ${
          selectedTime
            ? 'bg-amber-500 hover:bg-amber-400 text-black'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        Próximo
      </button>

    </div>
  )
}