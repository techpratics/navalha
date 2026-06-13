import { useState, useEffect } from 'react'
import type { Professional } from '../types/professional'
import { professionalService } from '../services/professional.service'

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadProfessionals() {
    setLoading(true)
    setError(null)
    try {
      const data = await professionalService.getProfessionals()
      setProfessionals(data)
    } catch (err) {
      console.error(err)
      setError('Falha ao carregar a lista de profissionais.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfessionals()
  }, [])

  const toggleProfessionalStatus = async (id: string) => {
    const target = professionals.find(p => p.id === id)
    if (!target) return

    try {
      await professionalService.updateStatus(id, target.isActive)
      setProfessionals(prev => prev.map(prof => 
        prof.id === id ? { ...prof, isActive: !prof.isActive } : prof
      ))
    } catch (err) {
      console.error(err)
      alert('Não foi possível alterar o status do profissional.')
    }
  }

  const addProfessional = async (form: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
    dataNascimento: string;
  }) => {
    await professionalService.createProfessional({
      nome: form.name,
      cpf: form.cpf,
      dataNascimento: form.dataNascimento,
      telefone: form.phone,
      email: form.email,
      senha: '123'
    })
    
    // Atualiza a listagem local
    await loadProfessionals()
  }

  return { professionals, loading, error, toggleProfessionalStatus, addProfessional, reload: loadProfessionals }
}