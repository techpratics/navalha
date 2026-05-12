// Types for the barbershop/salon management system

export interface Professional {
  id: string
  name: string
  email: string
  phone: string
  nickname: string
  avatar?: string
  status: 'active' | 'inactive'
  services: string[]
  workingHours: WorkingHours[]
}

export interface TimeBlock {
  id: string
  startTime: string // "09:00"
  endTime: string // "18:00"
}

export interface WorkingHours {
  dayOfWeek: number // 0-6 (Sunday-Saturday)
  blocks: TimeBlock[]
}

// Legacy format support (for backwards compatibility)
export interface WorkingHoursLegacy {
  dayOfWeek: number
  startTime: string
  endTime: string
  lunchStart?: string
  lunchEnd?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  description?: string
  price: number
  usageLimit: number // How many uses per week
  allowedDays: number[] // Days of week (0-6)
  services: string[] // Service IDs included
  isActive: boolean
}

export interface ClientSubscription {
  planId: string
  startDate: string
  endDate?: string
  usedThisWeek: number
  lastResetDate: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  birthDate?: string
  gender?: 'male' | 'female' | 'other'
  cpf?: string
  address?: Address
  notes?: string
  points: number
  status: 'active' | 'inactive'
  createdAt: string
  subscription?: ClientSubscription
}

export interface Address {
  zipCode: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
}

export interface Service {
  id: string
  name: string
  description?: string
  duration: number // minutes
  price: number
  commission: number // percentage
  category: string
  isAvailable: boolean
  image?: string
}

export interface Appointment {
  id: string
  clientId: string
  clientName: string
  professionalId: string
  professionalName: string
  serviceId: string
  serviceName: string
  date: string // "2024-01-15"
  startTime: string // "09:00"
  endTime: string // "09:30"
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  notes?: string
  price: number
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  quantity: number
  minQuantity: number
  price: number
  professionalPrice: number
  commission: number
  barcode?: string
  unit: string
  supplier?: string
  isAvailable: boolean
  forInternalUse: boolean
  image?: string
}

export interface FinancialEntry {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  date: string
  category: string
  paymentMethod: string
  professionalId?: string
  appointmentId?: string
}

export interface WaitlistEntry {
  id: string
  clientId: string
  clientName: string
  phone: string
  serviceId: string
  serviceName: string
  preferredDate?: string
  notes?: string
  createdAt: string
}
