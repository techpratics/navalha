
import { useState, useEffect } from 'react';
import { scheduleService } from '../services/schedule.service';
import { professionalService } from '../services/professional.service';
import { clientService } from '../services/client.service';
import { catalogService } from '../services/catalog.service';
import type { Appointment } from '../types/appointment';

interface UseAppointmentFormProps {
  isOpen: boolean;
  rescheduleData?: Appointment | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function useAppointmentForm({ isOpen, rescheduleData, onSuccess, onClose }: UseAppointmentFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Listas dos dropdowns
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);

  // Estado do formulário
  const [form, setForm] = useState({
    profissionalId: '',
    clienteId: '',
    servicoId: '',
    data: '',
    horarioInicio: ''
  });

  // Carrega os dados paralelos quando o modal abre
  useEffect(() => {
    if (!isOpen) return;

    async function fetchFormData() {
      try {
        const [profData, servData, clientData] = await Promise.all([
          professionalService.getProfessionals(),
          catalogService.getServices(),
          clientService.getClients()
        ]);

        setProfessionals(profData);
        setServices(servData);
        setClients(clientData);
      } catch (error) {
        console.error("Erro ao carregar dados do formulário:", error);
      }
    }

    fetchFormData();
  }, [isOpen]);

  // Preenche dados se for reagendamento
  useEffect(() => {
    if (rescheduleData) {
      setForm({
        profissionalId: rescheduleData.professionalId || '',
        clienteId: rescheduleData.clientId || '', 
        servicoId: rescheduleData.serviceId || '',
        data: rescheduleData.date,
        horarioInicio: rescheduleData.time,
      });
    } else {
      setForm({ profissionalId: '', clienteId: '', servicoId: '', data: '', horarioInicio: '' });
    }
  }, [rescheduleData, isOpen]);

  const handleFieldChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clienteId || !form.servicoId || !form.profissionalId) {
      alert('Por favor, selecione todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      await scheduleService.createAppointment({
        profissionalId: form.profissionalId,
        clienteId: form.clienteId,
        servicoId: form.servicoId,
        data: form.data,
        horarioInicio: form.horarioInicio.length === 5 ? `${form.horarioInicio}:00` : form.horarioInicio
      });

      if (rescheduleData) {
        await scheduleService.updateAppointmentStatus(rescheduleData.id, 'CANCELADO');
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.erro || 'Erro ao realizar o agendamento. Verifique a disponibilidade.');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    clients,
    services,
    professionals,
    handleFieldChange,
    handleSubmit
  };
}