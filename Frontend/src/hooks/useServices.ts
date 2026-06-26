import { useState, useEffect } from 'react'
import { catalogService } from '../services/catalog.service'

export interface Servico {
  id: string
  nome: string
  preco: number
  duracaoMinutos: number
  ativo: boolean
}

export function useServices() {
  const [services, setServices] = useState<Servico[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadServices() {
    setLoading(true)
    setError(null)
    try {
      const data = await catalogService.getAllServicesAdmin()
      setServices(data)
    } catch (err) {
      console.error(err)
      setError('Falha ao carregar serviços.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadServices()
  }, [])

  async function addService(nome: string, preco: number, duracaoMinutos: number) {
    const created = await catalogService.createService(nome, preco, duracaoMinutos)
    setServices(prev => [...prev, created])
    return created
  }

  async function editService(id: string, nome: string, preco: number, duracaoMinutos: number) {
    const updated = await catalogService.updateService(id, nome, preco, duracaoMinutos)
    setServices(prev => prev.map(s => s.id === id ? updated : s))
    return updated
  }

  async function toggleServiceStatus(id: string) {
    const service = services.find(s => s.id === id)
    if (!service) return
    await catalogService.toggleServiceStatus(id)
    setServices(prev => prev.map(s => s.id === id ? { ...s, ativo: !s.ativo } : s))
  }

  return { services, loading, error, addService, editService, toggleServiceStatus }
}
