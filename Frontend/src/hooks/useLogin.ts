import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LoginFormData, CustomJWTPayload, UsuarioLogado } from '../types/auth'
import { authService } from '../services/auth-service'

export function useLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // FUNCAO PARA DECODIFICAR O TOKEN E PEGAR O PAYLOAD COM AS INFORMACOES DO USUÁRIO
  const getPayloadFromToken = (token: string): CustomJWTPayload | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (err) {
      return null;
    }
  };

  async function login(form: LoginFormData) {
    if (!form.email || !form.password) {
      setError('Preencha todos os campos')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { token } = await authService.login({
        login: form.email,
        senha: form.password
      })

      localStorage.setItem('@Navalha:token', token)

      const payload = getPayloadFromToken(token)
      
      if (!payload || !payload.role) {
        throw new Error('Token inválido ou corrompido')
      }

      const userRole = payload.role.toUpperCase() as 'ADMIN' | 'PROFISSIONAL' | 'CLIENTE';

      let usuario: Partial<UsuarioLogado> = { 
        id: payload.id,
        role: userRole 
      }
      

      if (userRole === 'CLIENTE') {
        const perfil = await authService.getPerfilCliente()
        usuario = { ...usuario, ...perfil }
      }

      localStorage.setItem('@Navalha:user', JSON.stringify(usuario))

      if (userRole === 'CLIENTE') {
        navigate('/client/agendar')
      } else if (userRole === 'PROFISSIONAL') {
        navigate('/professional/agenda')
      } else if (userRole === 'ADMIN') {
        navigate('/admin/profissionais')
      }

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao realizar login')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('@Navalha:token')
    localStorage.removeItem('@Navalha:user')
    navigate('/login')
  }

  return { login, logout, loading, error }
}