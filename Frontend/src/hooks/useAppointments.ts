import { useState } from 'react';
import { scheduleService } from '../services/schedule.service';
import type { BookingState } from '../types/appointment';

// Função atualizada: Lê o ID direto do usuário logado no storage
function getClientId(): string | null {
  try {
    // 1. Tenta pegar direto do objeto de usuário (Mais fácil e limpo)
    const userStr = localStorage.getItem('@Navalha:user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.id) return user.id;
    }

    // 2. Fallback: Se não achar o user, tenta ler o token com o nome correto
    const token = localStorage.getItem('@Navalha:token'); 
    if (!token) return null;

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    return decoded.id || decoded.sub || null; 
  } catch (error) {
    console.error("Erro ao resgatar o ID do cliente:", error);
    return null;
  }
}

interface UseSubmitAppointmentProps {
  booking: BookingState;
  onSuccess: () => void;
}

export function useSubmitAppointment({ booking, onSuccess }: UseSubmitAppointmentProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submitAppointment = async () => {
    if (!booking.professionalId || !booking.serviceId || !booking.date || !booking.time) {
      setErrorMsg("Dados de agendamento incompletos.");
      return;
    }

    // Chama a nossa nova função
    const clienteId = getClientId();

    if (!clienteId) {
      setErrorMsg("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await scheduleService.createClientAppointment({
        profissionalId: booking.professionalId,
        servicoId: booking.serviceId,
        data: booking.date,
        horarioInicio: booking.time.length === 5 ? `${booking.time}:00` : booking.time,
        clienteId: clienteId 
      });

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao confirmar:', error);
      const backendError = error.response?.data?.erro || error.response?.data?.message || 'Este horário não está mais disponível. Por favor, tente outro.';
      setErrorMsg(backendError);
    } finally {
      setLoading(false);
    }
  };

  return { submitAppointment, loading, errorMsg };
}