import { api } from './api';

export const catalogService = {
  async getServices(): Promise<any[]> {
    const response = await api.get('/servicos');
    return response.data || [];
  }
};