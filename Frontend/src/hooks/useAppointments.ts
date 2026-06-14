import { useState, useEffect, useCallback } from 'react';
import { scheduleService } from '../services/schedule.service';
import type { Appointment } from '../types/appointment';

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Chama a API sem precisar passar IDs
      const response = await scheduleService.getClientAppointments();
      
      // Mapeia o JSON retornado pelo backend para a interface do frontend
      const mappedAppointments: Appointment[] = (response || []).map((app: any) => ({
        id: app.id,
        professionalName: app.nomeProfissional || 'Profissional',
        professionalId: app.profissionalId || '',
        professionalInitials: (app.nomeProfissional || 'PR').substring(0, 2).toUpperCase(),
        clientName: app.nomeCliente || '',
        clientId: app.clienteId || '',
        clientInitials: (app.nomeCliente || 'CL').substring(0, 2).toUpperCase(),
        serviceName: app.nomeServico || 'Serviço',
        serviceId: app.servicoId || '',
        date: app.data,
        time: app.horarioInicio ? app.horarioInicio.substring(0, 5) : '', // Corta os segundos (:00)
        durationMinutes: 45, // Como o response não trouxe duracaoMinutos, mantemos um fallback visual adequado
        priceInCents: app.preco ? app.preco * 100 : 4000, // Fallback caso queira calcular depois
        status: app.status?.toLowerCase() === 'cancelado' ? 'cancelled' : 
        app.status?.toLowerCase() === 'concluido' ? 'completed' :
        app.status?.toLowerCase() === 'pendente' ? 'pending' : 'confirmed'
      }));

      // Ordena por data e horário (mais próximos primeiro)
      const sorted = mappedAppointments.sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
      
      setAppointments(sorted);
    } catch (err: any) {
      console.error("Erro ao buscar agendamentos:", err);
      setError("Não foi possível carregar os seus agendamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Regra de negócio: Cancelamento com antecedência mínima de 2 horas
  const canCancel = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    const now = new Date();
    const diffInHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffInHours >= 2;
  };

  const cancelAppointment = async (id: string) => {
    setLoading(true);
    try {
      // Atualiza o status no backend
      await scheduleService.updateAppointmentStatus(id, 'CANCELADO');
      
      // Atualiza o estado local para mudar o badge na hora sem dar refetch
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: 'cancelled' } : app)
      );
      
      alert("Agendamento cancelado com sucesso!");
    } catch (err: any) {
      console.error("Erro ao cancelar:", err);
      alert(err.response?.data?.erro || "Erro ao cancelar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  const completeAppointment = async (id: string) => {
    setLoading(true);
    try {
      await scheduleService.updateAppointmentStatus(id, 'CONCLUIDO');
      
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: 'completed' } : app)
      );
      
      alert("Atendimento concluído com sucesso!");
    } catch (err: any) {
      console.error("Erro ao concluir:", err);
      alert(err.response?.data?.erro || "Erro ao concluir o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÕES DE ENCAIXE/MOCK (HU-30) ---
  const checkAvailability = (date: string, time: string, durationMinutes: number, professionalName: string) => {
    return true; // Libera sempre provisoriamente
  };

  const addAppointment = async (appointmentData: any) => {
    const newApp = {
      ...appointmentData,
      id: Math.random().toString(36).substring(2, 9),
      status: 'confirmed'
    };
    setAppointments(prev => [...prev, newApp]);
  };

  return { 
    appointments, 
    loading, 
    error, 
    fetchAppointments, 
    cancelAppointment, 
    canCancel,
    checkAvailability, 
    addAppointment,
    completeAppointment
  };
}