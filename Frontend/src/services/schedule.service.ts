import { api } from './api';
import type { Appointment } from '../types/appointment';

export const scheduleService = {
  async getAgendamentos(): Promise<Appointment[]> {
    const response = await api.get('/agendamentos');
    const data = response.data;

    // Função auxiliar para calcular a duração entre inicio e fim
    const calculateDuration = (start: string, end: string) => {
      if (!start || !end) return 30; // Padrão 30 min se der erro
      const [h1, m1] = start.split(':').map(Number);
      const [h2, m2] = end.split(':').map(Number);
      return (h2 * 60 + m2) - (h1 * 60 + m1);
    };

    // Função auxiliar para pegar as iniciais do nome
    const getInitials = (name: string) => {
      if (!name) return '??';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Tradutor de Status do Back para o Front
    const statusMap: Record<string, 'confirmed' | 'pending' | 'cancelled'> = {
      'CONFIRMADO': 'confirmed',
      'PENDENTE': 'pending',
      'CANCELADO': 'cancelled'
    };

    return data.map((item: any) => ({
      id: item.id,
      professionalId: item.profissionalId,
      date: item.data, 
      time: item.horarioInicio ? item.horarioInicio.substring(0, 5) : '--:--', 
      durationMinutes: calculateDuration(item.horarioInicio, item.horarioFim),
      clientName: item.nomeCliente || 'Cliente Não Informado',
      clientInitials: getInitials(item.nomeCliente),
      professionalName: item.nomeProfissional || 'Profissional',
      professionalInitials: getInitials(item.nomeProfissional),
      serviceName: item.nomeServico || 'Serviço',
      status: statusMap[item.status] || 'pending',
      priceInCents: 0 
    }));
  }
};