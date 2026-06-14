import { api } from './api';

export const clientService = {
  async getClients(): Promise<any[]> {
    const response = await api.get('/clientes');
    return response.data || [];
  }
};