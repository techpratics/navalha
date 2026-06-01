import { useState } from 'react'
import type { Client } from '../types/client'

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Oliveira',
    initials: 'JO',
    phone: '(11) 98888-7777',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    isActive: true,
    totalAppointments: 15,
    lastVisit: '2026-05-20',
  },
  {
    id: '2',
    name: 'Ricardo Santos',
    initials: 'RS',
    phone: '(11) 97777-6666',
    email: 'ricardo@email.com',
    cpf: '234.567.890-11',
    isActive: true,
    totalAppointments: 8,
    lastVisit: '2026-05-25',
  },
  {
    id: '3',
    name: 'Marcos Souza',
    initials: 'MS',
    phone: '(11) 96666-5555',
    email: 'marcos@email.com',
    cpf: '345.678.901-22',
    isActive: true,
    totalAppointments: 3,
    lastVisit: '2026-05-15',
  },
  {
    id: '4',
    name: 'Paulo Lima',
    initials: 'PL',
    phone: '(11) 95555-4444',
    email: 'paulo@email.com',
    cpf: '456.789.012-33',
    isActive: true,
    totalAppointments: 12,
    lastVisit: '2026-05-28',
  },
  {
    id: '5',
    name: 'Felipe Neves',
    initials: 'FN',
    phone: '(11) 94444-3333',
    email: 'felipe@email.com',
    cpf: '567.890.123-44',
    isActive: false,
    totalAppointments: 1,
    lastVisit: '2026-04-10',
  },
]

export function useClients() {
  const [clients, setClients] = useState<Client[]>(mockClients)

  const updateClient = (id: string, updatedData: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, ...updatedData } : client
    ))
  }

  const toggleClientStatus = (id: string) => {
    setClients(prev => prev.map(client => 
      client.id === id ? { ...client, isActive: !client.isActive } : client
    ))
  }

  return { clients, updateClient, toggleClientStatus }
}
