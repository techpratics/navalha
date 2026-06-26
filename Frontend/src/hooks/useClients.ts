import { useState, useEffect } from 'react'
import type { Client } from '../types/client'
import { clientService } from '../services/client.service'

const getInitials = (name: string) => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadClients() {
    setLoading(true)
    setError(null)
    try {
      const [clientResult, statsResult] = await Promise.allSettled([
        clientService.getClients(),
        clientService.getFrequentStats()
      ])

      const rawClients = clientResult.status === 'fulfilled' ? clientResult.value : []
      const stats: any[] = statsResult.status === 'fulfilled' ? statsResult.value : []

      const statsMap: Record<string, any> = {}
      stats.forEach(s => { statsMap[s.clienteId] = s })

      const mapped: Client[] = rawClients.map((item: any) => {
        const stat = statsMap[item.id]
        return {
          id: item.id,
          name: item.nome,
          initials: getInitials(item.nome),
          phone: item.telefone,
          email: item.email || '',
          cpf: item.cpf,
          isActive: item.status,
          totalAppointments: stat?.totalAtendimentos ?? 0,
          lastVisit: stat?.ultimoAtendimento ?? ''
        }
      })

      setClients(mapped)
    } catch (err) {
      console.error(err)
      setError('Falha ao carregar clientes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const updateClient = async (id: string, updatedData: Partial<Client>) => {
    try {
      await clientService.updateClient(id, updatedData.name || '', updatedData.phone || '')
      setClients(prev => prev.map(client =>
        client.id === id ? { ...client, ...updatedData } : client
      ))
    } catch (err) {
      console.error(err)
      alert('Erro ao atualizar cliente.')
    }
  }

  const toggleClientStatus = async (id: string) => {
    try {
      await clientService.toggleStatus(id)
      setClients(prev => prev.map(client =>
        client.id === id ? { ...client, isActive: !client.isActive } : client
      ))
    } catch (err) {
      console.error(err)
      alert('Erro ao alterar status do cliente.')
    }
  }

  return { clients, loading, error, updateClient, toggleClientStatus }
}
