import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LoginFormData } from '../types/auth'

export function useLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function login(form: LoginFormData) {
    setLoading(true)
    setError(null)

    setTimeout(() => {
      if (!form.email || !form.password) {
        setError('Preencha todos os campos')
        setLoading(false)
        return
      }

      if (form.role === 'client') {
        navigate('/client/agendar')
      } else if (form.role === 'professional') {
        navigate('/professional/agenda')
      } else {
        navigate('/admin/profissionais')
      }

      setLoading(false)
    }, 500)
  }

  function logout() {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return { login, logout, loading, error }
}