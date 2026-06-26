import { api } from './api';

export const catalogService = {
  async getServices(): Promise<any[]> {
    const response = await api.get('/servicos');
    return response.data || [];
  },

  async getAllServicesAdmin(): Promise<any[]> {
    try {
      const response = await api.get('/servicos/all');
      return response.data || [];
    } catch {
      // fallback para o endpoint existente enquanto o backend não é reconstruído
      const response = await api.get('/servicos');
      return response.data || [];
    }
  },

  async createService(nome: string, preco: number, duracaoMinutos: number): Promise<any> {
    const response = await api.post('/servicos', { nome, preco, duracaoMinutos });
    return response.data;
  },

  async updateService(id: string, nome: string, preco: number, duracaoMinutos: number): Promise<any> {
    const response = await api.put(`/servicos/${id}`, { nome, preco, duracaoMinutos });
    return response.data;
  },

  async toggleServiceStatus(id: string): Promise<void> {
    await api.patch(`/servicos/${id}/status`);
  },
};
