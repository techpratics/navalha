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
  step: 1 | 2 | 3 | 4
  date: string | null
  time: string | null
  professionalId: string | null
  professionalName: string | null
  serviceId: string | null
  serviceName: string | null
  serviceDuration: number | null
  servicePrice: number | null
}