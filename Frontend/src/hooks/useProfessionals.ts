import { useState } from 'react'
import type { Professional } from '../types/professional'

const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    initials: 'CS',
    email: 'carlos@navalha.com',
    phone: '(11) 91111-2222',
    specialty: 'Cabelo e Barba',
    isActive: true,
    createdAt: '2026-01-10',
  },
  {
    id: '2',
    name: 'Ana Beatriz',
    initials: 'AB',
    email: 'ana@navalha.com',
    phone: '(11) 92222-3333',
    specialty: 'Cortes Femininos e Química',
    isActive: true,
    createdAt: '2026-02-15',
  },
  {
    id: '3',
    name: 'Pedro Alvares',
    initials: 'PA',
    email: 'pedro@navalha.com',
    phone: '(11) 93333-4444',
    specialty: 'Barba e Navalha',
    isActive: false,
    createdAt: '2026-03-05',
  },
]

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<Professional[]>(mockProfessionals)

  const toggleProfessionalStatus = (id: string) => {
    setProfessionals(prev => prev.map(prof => 
      prof.id === id ? { ...prof, isActive: !prof.isActive } : prof
    ))
  }

  const addProfessional = (prof: Omit<Professional, 'id' | 'createdAt' | 'isActive' | 'initials'>) => {
    const initials = prof.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    const newProf: Professional = {
      ...prof,
      id: Math.random().toString(36).substr(2, 9),
      initials,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0]
    }
    setProfessionals(prev => [...prev, newProf])
  }

  return { professionals, toggleProfessionalStatus, addProfessional }
}
