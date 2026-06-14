import { useState, useEffect, useCallback } from 'react';
import { scheduleService } from '../services/schedule.service';
import type { Appointment } from '../types/appointment';

function getClientIdFromToken(): string | null {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    return decoded.id || decoded.sub || null; 
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    const clienteId = getClientIdFromToken();
    
    // Fallback temporário para testes enquanto o login não está 100%
    const idParaBuscar = clienteId || "b4402afd-93fc-407f-a3bc-f9080a94ce40";

    setLoading(true);
    setError(null);
    try {
      const response = await scheduleService.getClientAppointments(idParaBuscar);
      
      const sorted = (response || []).sort((a: Appointment, b: Appointment) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.time.localeCompare(b.time);
      });
      
      setAppointments(sorted);
    } catch (err: any) {
      console.error("Erro ao buscar agendamentos:", err);
      setError("Não foi possível carregar o seu histórico de agendamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const canCancel = (date: string, time: string) => {
    const appointmentDate = new Date(`${date}T${time}`);
    const now = new Date();
    
    const diffInHours = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return diffInHours >= 2;
  };

  const cancelAppointment = async (id: string) => {
    setLoading(true);
    try {
      await scheduleService.updateAppointmentStatus(id, 'CANCELADO');
      
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

  return { 
    appointments, 
    loading, 
    error, 
    fetchAppointments, 
    cancelAppointment, 
    canCancel 
  };
}