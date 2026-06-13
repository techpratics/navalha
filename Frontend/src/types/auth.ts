
export interface PerfilClienteResponse {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  status: boolean;
}

export interface CadastroResponse {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  telefone: string;
  status: boolean;
}

export interface LoginResponse {
  token: string;
}

export interface CustomJWTPayload {
  iss: string;
  sub: string; 
  exp: number;
  id: string;
  role: string; 
}

export interface UsuarioLogado extends PerfilClienteResponse {
  role: 'ADMIN' | 'PROFISSIONAL' | 'CLIENTE';
}


// HARDCODED: VERSAO ANTIGA
export type UserRole = 'admin' | 'professional' | 'client'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export interface LoginFormData {
  email: string
  password: string
  role: UserRole
  rememberMe: boolean
}