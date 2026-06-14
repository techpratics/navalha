import { useState, useEffect } from 'react'
import { Calendar, ChevronLeft, Clock } from 'lucide-react'
import type { BookingState, ProfessionalSlots } from '../../../types/appointment'
import DateSelector from '../../../components/stepsAgendamento/DateSelector'
import ProfessionalSlotsComponent from '../../../components/stepsAgendamento/ProfessionalSlots'
import { professionalService } from '../../../services/professional.service'

interface Props {
  booking: BookingState
  onNext: (data: Partial<BookingState>) => void,
  onBack: () => void
}

const mockDays = [
  { date: '2026-05-29', label: 'SEXTA', day: '29', month: 'mai' },
  { date: '2026-05-30', label: 'SÁBADO', day: '30', month: 'mai' },
  { date: '2026-05-31', label: 'DOMINGO', day: '31', month: 'mai', disabled: true },
  { date: '2026-06-01', label: 'SEGUNDA', day: '01', month: 'jun' },
  { date: '2026-06-02', label: 'TERÇA', day: '02', month: 'jun' },
]

export default function Step2DateTime({ onNext, onBack }: Props) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-05-30')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null)
  
  const [availableSlots, setAvailableSlots] = useState<ProfessionalSlots[]>([])
  const [loading, setLoading] = useState(false)

  // Busca os profissionais reais quando o componente monta
  useEffect(() => {
    async function loadProfessionals() {
      setLoading(true)
      try {
        const profs = await professionalService.getProfessionals()
        
        // POR ENQUANTO MOCKADO ENQUANTO O BACKEND CORRIGE O ERRO
        const slotsComProfissionaisReais: ProfessionalSlots[] = profs.map((p: any) => ({
          id: p.id,
          name: p.nome || p.name,
          initials: (p.nome || p.name).substring(0, 2).toUpperCase(),
          slots: [
            { time: '09:00', available: true },
            { time: '10:00', available: true },
            { time: '11:00', available: true },
            { time: '14:00', available: true },
            { time: '15:00', available: true },
          ],
        }))
        
        setAvailableSlots(slotsComProfissionaisReais)
      } catch (error) {
        console.error("Erro ao carregar profissionais", error)
      } finally {
        setLoading(false)
      }
    }
    loadProfessionals()
  }, []) 

  function handleSlotClick(professionalId: string, time: string) {
    setSelectedTime(time)
    setSelectedProfessionalId(professionalId)
  }

  function handleNext() {
    if (!selectedDate || !selectedTime || !selectedProfessionalId) return
    const professional = availableSlots.find(p => p.id === selectedProfessionalId)
    
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
      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6">
        <button
          onClick={onBack}
          style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
          className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg mb-4 transition-colors hover:opacity-80"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>
        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold flex items-center gap-2 mb-4">
          <Calendar size={16} style={{ color: 'var(--brand)' }} />
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

      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6">
        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold flex items-center gap-2 mb-1">
          <Clock size={16} style={{ color: 'var(--brand)' }} />
          Horários Disponíveis
        </h2>
        
        {selectedDay && (
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4">
            {selectedDay.label.toLowerCase()}, {selectedDay.day} de {selectedDay.month === 'mai' ? 'maio' : 'junho'}
          </p>
        )}

        {loading ? (
          <p className="text-center py-4" style={{ color: 'var(--text-muted)' }}>Carregando profissionais...</p>
        ) : (
          <div className="flex flex-col gap-6">
            {availableSlots.map(professional => (
              <ProfessionalSlotsComponent
                key={professional.id}
                professional={professional}
                selectedTime={selectedTime}
                selectedProfessionalId={selectedProfessionalId}
                onSelect={handleSlotClick}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedTime}
        style={{
          backgroundColor: selectedTime ? 'var(--brand)' : 'var(--bg-elevated)',
          color: selectedTime ? '#000' : 'var(--text-muted)',
        }}
        className="w-full py-3 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed"
      >
        Próximo
      </button>
    </div>
  )
}