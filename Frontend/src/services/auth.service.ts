import { api } from './api';
import type { LoginResponse, PerfilClienteResponse } from '../types/auth';

export const authService = {
  async login(credentials: Record<string, string>): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  async getPerfilCliente(): Promise<PerfilClienteResponse> {
    const response = await api.get<PerfilClienteResponse>('/clientes/meu-perfil');
    return response.data;
  }
};