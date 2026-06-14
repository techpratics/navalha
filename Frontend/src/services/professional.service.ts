import { api } from './api';
import type { Professional } from '../types/professional';

export const professionalService = {
  async getProfessionals(): Promise<Professional[]> {
    const response = await api.get('/profissionais');
    const data = response.data;

    const getInitials = (name: string) => {
      if (!name) return '??';
      const parts = name.trim().split(' ');
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return data.map((item: any) => ({
      id: item.id,
      name: item.nome || 'Sem nome',
      initials: getInitials(item.nome),
      email: item.email || 'sem@email.com',
      phone: item.telefone || 'Sem telefone',
      specialty: 'Corte', 
      isActive: item.ativo !== undefined ? item.ativo : true,
      createdAt: item.dataNascimento || ''
    }));
  },

  async createProfessional(payload: {
    nome: string;
    cpf: string;
    dataNascimento: string;
    telefone: string;
    email: string;
    senha: string;
  }): Promise<any> {
    const response = await api.post('/profissionais', payload);
    return response.data;
  },

  async updateStatus(id: string, currentStatus: boolean): Promise<void> {
    await api.patch(`/profissionais/${id}/status`, {
      ativo: !currentStatus
    });
  },

  async createAppointment(payload: {
    profissionalId: string;
    clienteId: string;
    servicoId: string;
    data: string;
    horarioInicio: string;
  }): Promise<void> {
    await api.post('/agendamentos/admin', payload);
  },

  async getProfessionalServices(id: string): Promise<any[]> {
    const response = await api.get(`/profissionais/${id}/servicos`);
    return response.data || [];
  },

  // Vincula um novo serviço
  async linkService(id: string, servicoId: string): Promise<any> {
    const response = await api.post(`/profissionais/${id}/servicos`, { servicoId });
    return response.data; 
    },

  // Remove o vínculo de um serviço
  async unlinkService(id: string, servicoId: string): Promise<void> {
    await api.delete(`/profissionais/${id}/servicos/${servicoId}`);
  },

  // GET SLOTS DO PROFISSIONAL PARA UMA DATA E SERVIÇO
  async getProfessionalSlots(profissionalId: string, data: string, servicoId: string): Promise<string[]> {
    const response = await api.get(`/profissionais/${profissionalId}/slots`, {
      params: { data, servicoId }
    });
    return response.data;
  }
};