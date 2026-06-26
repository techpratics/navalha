import { api } from './api';

export const clientService = {
  async getClients(): Promise<any[]> {
    const response = await api.get('/clientes');
    return response.data || [];
  },

  async getFrequentStats(): Promise<any[]> {
    const response = await api.get('/relatorios/clientes-frequentes');
    return response.data || [];
  },

  async updateClient(id: string, nome: string, telefone: string): Promise<any> {
    const response = await api.put(`/clientes/${id}`, { nome, telefone });
    return response.data;
  },

  async toggleStatus(id: string): Promise<void> {
    await api.patch(`/clientes/${id}/status`);
  },

  async createClient(data: {
    nome: string;
    telefone: string;
    dataNascimento: string;
    cpf: string;
    email: string;
    senha: string;
  }): Promise<any> {
    const response = await api.post('/clientes', data);
    return response.data;
  },

  async getHistory(id: string): Promise<any[]> {
    const response = await api.get(`/clientes/${id}/historico`);
    return response.data || [];
  }
};
