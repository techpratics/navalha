import { useState, useEffect, useCallback } from 'react'
import { professionalService } from '../services/professional.service'

export type DaySchedule = {
  id: number 
  name: string
  active: boolean
  start: string
  end: string
  dbId?: string 
}

const defaultSchedule: DaySchedule[] = [
  { id: 1, name: 'Segunda-feira', active: true, start: '09:00', end: '18:00' },
  { id: 2, name: 'Terça-feira', active: true, start: '09:00', end: '18:00' },
  { id: 3, name: 'Quarta-feira', active: true, start: '09:00', end: '18:00' },
  { id: 4, name: 'Quinta-feira', active: true, start: '09:00', end: '18:00' },
  { id: 5, name: 'Sexta-feira', active: true, start: '09:00', end: '18:00' },
  { id: 6, name: 'Sábado', active: true, start: '09:00', end: '14:00' },
  { id: 7, name: 'Domingo', active: false, start: '09:00', end: '12:00' },
]

export function useAvailability() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchAvailability = useCallback(async () => {
    try {
      const data = await professionalService.getAvailability();
      
      if (data && data.length > 0) {
        setSchedule(prev => prev.map(day => {
          const diaBanco = data.find((d: any) => d.diaSemana === day.id);
          
          if (diaBanco) {
            return { 
              ...day, 
              active: true, 
              start: diaBanco.horaInicio.substring(0, 5),
              end: diaBanco.horaFim.substring(0, 5),
              dbId: diaBanco.id 
            };
          }
          return { ...day, active: false, dbId: undefined };
        }));
      } else {
         setSchedule(prev => prev.map(day => ({ ...day, active: false, dbId: undefined })));
      }
    } catch (error) {
      console.error("Erro ao carregar horários", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const updateDay = (id: number, field: keyof DaySchedule, value: string | boolean) => {
    setSchedule(prev => 
      prev.map(day => day.id === id ? { ...day, [field]: value } : day)
    )
  }

  const copyToAll = (sourceDay: DaySchedule) => {
    if (!confirm(`Deseja copiar o horário de ${sourceDay.start} às ${sourceDay.end} para todos os outros dias ativos?`)) return;

    setSchedule(prev => 
      prev.map(day => 
        day.active ? { ...day, start: sourceDay.start, end: sourceDay.end } : day
      )
    )
  }

  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccess(false);
    setErrorMsg(null);
    
    try {
      const savePromises = schedule.map(day => {
        const payload = {
          diaSemana: day.id,
          horaInicio: `${day.start}:00`,
          horaFim: `${day.end}:00`
        };

        if (day.active) {
          if (day.dbId) {
            return professionalService.updateAvailabilityDay(day.dbId, payload); 
          } else {
            return professionalService.saveAvailabilityDay(payload); 
          }
        } else {
          if (day.dbId) {
            return professionalService.deleteAvailabilityDay(day.dbId); 
          }
        }
        
        return Promise.resolve(); 
      });

      await Promise.all(savePromises);
      await fetchAvailability();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      console.error('Erro ao salvar horários no backend', error);
      setErrorMsg(error.response?.data?.erro || 'Erro ao salvar as configurações no servidor.');
    } finally {
      setIsSaving(false);
    }
  }

  return {
    schedule,
    isLoading,
    isSaving,
    showSuccess,
    errorMsg,
    updateDay,
    copyToAll,
    handleSave
  }
}