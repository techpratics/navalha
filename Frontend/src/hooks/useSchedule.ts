import { useState, useEffect } from 'react';
import type { Appointment } from '../types/appointment';
import { scheduleService } from '../services/schedule.service';

type ViewMode = 'daily' | 'weekly' | 'monthly';

export function useSchedule() {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      setError(null);
      try {
        const data = await scheduleService.getAgendamentos();
        setAppointments(data);
      } catch (err: any) {
        console.error("ERRO NA REQUISIÇÃO:", err);
        setError('Não foi possível carregar a agenda. Verifique sua conexão.');
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, [currentDate, viewMode]);

  const handlePrevious = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === 'daily') newDate.setDate(prev.getDate() - 1);
      if (viewMode === 'weekly') newDate.setDate(prev.getDate() - 7);
      if (viewMode === 'monthly') newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (viewMode === 'daily') newDate.setDate(prev.getDate() + 1);
      if (viewMode === 'weekly') newDate.setDate(prev.getDate() + 7);
      if (viewMode === 'monthly') newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return {
    viewMode,
    setViewMode,
    currentDate,
    appointments,
    loading,
    error,
    handlePrevious,
    handleNext,
    handleToday
  };
}