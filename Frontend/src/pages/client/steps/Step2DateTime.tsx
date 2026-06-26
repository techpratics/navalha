import { useState, useEffect } from 'react'
import { Calendar, Clock, ChevronLeft } from 'lucide-react'
import type { BookingState, ProfessionalSlots } from '../../../types/appointment'
import DateSelector from '../../../components/stepsAgendamento/DateSelector'
import ProfessionalSlotsComponent from '../../../components/stepsAgendamento/ProfessionalSlots'
import { professionalService } from '../../../services/professional.service'
interface Props {
  booking: BookingState
  onNext: (data: Partial<BookingState>) => void
  onBack: () => void
}

function generateNextDays(daysCount: number = 7) {
  const days = [];
  const today = new Date();

  const weekDays = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    days.push({
      date: dateString,
      label: weekDays[currentDate.getDay()],
      day: String(currentDate.getDate()).padStart(2, '0'),
      month: months[currentDate.getMonth()]
    });
  }

  return days;
}

export default function Step2DateTime({ booking, onNext, onBack }: Props) {

  const dynamicDays = generateNextDays(10);
  const [selectedDate, setSelectedDate] = useState<string>(dynamicDays[0].date) 
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null)
  
  const [availableSlots, setAvailableSlots] = useState<ProfessionalSlots[]>([])
  const [loading, setLoading] = useState(false)

  // Dispara a busca toda vez que a DATA mudar
  useEffect(() => {
    async function loadSlots() {
      // Se por algum motivo bizarro o cliente chegou aqui sem serviço, aborta
      if (!booking.serviceId || !selectedDate) return;

      setLoading(true);
      setSelectedTime(null);
      setSelectedProfessionalId(null);
      
      try {
        // 1. Busca todos os profissionais da barbearia
        const profs = await professionalService.getProfessionals();
        
        // 2. Faz as chamadas simultâneas para buscar os horários de todos eles
        const slotsPromises = profs.map(async (p: any) => {
          try {
            const times = await professionalService.getProfessionalSlots(p.id, selectedDate, booking.serviceId!);
            
            // Se o backend não retornou nada, ignora este profissional
            if (!times || times.length === 0) return null;

            // Converte ["14:00:00"] para o formato da UI [{ time: "14:00", available: true }]
            const formattedSlots = times.map((t: string) => ({
              time: t.substring(0, 5),
              available: true
            }));

            return {
              id: p.id,
              name: p.nome || p.name,
              initials: (p.nome || p.name).substring(0, 2).toUpperCase(),
              slots: formattedSlots
            };
          } catch (error) {
            console.error(`Erro ao buscar horários para o prof. ${p.id}`, error);
            return null; // Se der erro num profissional específico, ignora só ele
          }
        });

        // 3. Resolve todas as requisições e filtra os nulos (profissionais sem horário)
        const resolvedSlots = (await Promise.all(slotsPromises)).filter(Boolean) as ProfessionalSlots[];
        setAvailableSlots(resolvedSlots);

      } catch (error) {
        console.error("Erro geral ao carregar a agenda", error);
      } finally {
        setLoading(false);
      }
    }

    loadSlots();
  }, [selectedDate, booking.serviceId]); // O array de dependências garante o recarregamento automático

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

  const selectedDay = dynamicDays.find(d => d.date === selectedDate)

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6 shadow-sm border border-[var(--border)]">
        
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
          days={dynamicDays}
          selectedDate={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
        />
      </div>

      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6 shadow-sm border border-[var(--border)]">
        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold flex items-center gap-2 mb-1">
          <Clock size={16} style={{ color: 'var(--brand)' }} />
          Horários Disponíveis
        </h2>
        
        {selectedDay && (
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-4 capitalize">
            {selectedDay.label.toLowerCase()}, {selectedDay.day} de {selectedDay.month}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
          </div>
        ) : availableSlots.length === 0 ? (
          <p className="text-center py-8 font-medium" style={{ color: 'var(--text-muted)' }}>
            Não há horários disponíveis para esta data.
          </p>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
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
        className="w-full py-3.5 rounded-xl font-bold transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Próximo
      </button>
    </div>
  )
}