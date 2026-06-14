export interface TimeSlot {
  time: string
  available: boolean
}

export interface ProfessionalSlots {
  id: string
  name: string
  initials: string
  slots: TimeSlot[]
}

export interface BookingState {
  step: 1 | 2 | 3 | 4 | 5
  date: string | null
  time: string | null
  professionalId: string | null
  professionalName: string | null
  serviceId: string | null
  serviceName: string | null
  serviceDuration: number | null
  servicePrice: number | null
}

export interface Appointment {
  id: string
  professionalName: string
  professionalId: string;
  professionalInitials: string
  clientName: string
  clientId: string;
  clientInitials: string
  serviceName: string
  serviceId: string;
  date: string
  time: string
  durationMinutes: number
  priceInCents: number
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
}