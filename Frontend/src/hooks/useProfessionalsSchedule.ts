import { useState, useEffect } from 'react';
import type { Appointment } from '../types/appointment';
import { scheduleService } from '../services/schedule.service';

export interface ProfessionalGroup {
  professionalId: string;
  professionalName: string;
  professionalInitials: string;
  appointments: Appointment[];
}

export function useProfessionalsSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [groupedSchedule, setGroupedSchedule] = useState<ProfessionalGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfessionalsSchedule() {
      setLoading(true);
      setError(null);
      try {
        const allAppointments = await scheduleService.getAgendamentos();

        // Formatar data atual para YYYY-MM-DD
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Filtrar apenas agendamentos do dia selecionado
        const dailyAppointments = allAppointments.filter(app => app.date === formattedDate);

        // Agrupar agendamentos por Profissional
        const groups: Record<string, ProfessionalGroup> = {};

        dailyAppointments.forEach(app => {
          const profId = app.professionalId;
          if (!groups[profId]) {
            groups[profId] = {
              professionalId: profId,
              professionalName: app.professionalName,
              professionalInitials: app.professionalInitials,
              appointments: []
            };
          }
          groups[profId].appointments.push(app);
        });

        // Transformar em Array e ordenar cronologicamente cada lista de horários
        const formattedGroups = Object.values(groups).map(group => {
          group.appointments.sort((a, b) => a.time.localeCompare(b.time));
          return group;
        });

        setGroupedSchedule(formattedGroups);
      } catch (err: any) {
        console.error(err);
        setError('Erro ao carregar a agenda consolidada.');
      } finally {
        setLoading(false);
      }
    }

    loadProfessionalsSchedule();
  }, [currentDate]);

  const handlePrevious = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 1);
      return d;
    });
  };

  const handleNext = () => {
    setCurrentDate(prev => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 1);
      return d;
    });
  };

  const handleToday = () => setCurrentDate(new Date());

  return {
    currentDate,
    groupedSchedule,
    loading,
    error,
    handlePrevious,
    handleNext,
    handleToday
  };
}