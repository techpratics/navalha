import { useState } from 'react'
import type { BookingState } from '../types/appointment'

const initialState: BookingState = {
  step: 1,
  date: null,
  time: null,
  professionalId: null,
  professionalName: null,
  serviceId: null,
  serviceName: null,
  serviceDuration: null,
  servicePrice: null,
}

export function useAgendamento() {
  const [booking, setBooking] = useState<BookingState>(initialState)

  function nextStep(data: Partial<BookingState>) {
    setBooking(prev => ({
      ...prev,
      ...data,
      step: (prev.step + 1) as BookingState['step'],
    }))
  }

  function prevStep() {
    setBooking(prev => ({
      ...prev,
      step: (prev.step - 1) as BookingState['step'],
    }))
  }

  function reset() {
    setBooking(initialState)
  }

  return { booking, nextStep, prevStep, reset }
}