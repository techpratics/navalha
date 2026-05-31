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