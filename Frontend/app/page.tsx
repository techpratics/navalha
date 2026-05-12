"use client"

import { useAuth } from '@/lib/auth-context'
import { AppShell } from '@/components/app-shell'
import { SchedulePage } from '@/components/schedule/schedule-page'
import { ClientBookingPage } from '@/components/schedule/client-booking-page'

export default function Home() {
  const { user } = useAuth()
  
  return (
    <AppShell>
      {user?.role === 'client' ? (
        <ClientBookingPage />
      ) : (
        <SchedulePage />
      )}
    </AppShell>
  )
}
