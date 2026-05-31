import ClientLayout from '../../components/layout/ClientLayout'
import AppointmentList from '../../components/appointments/AppointmentList'
import { useAppointments } from '../../hooks/useAppointments'

export default function AppointmentsPage() {
  const { appointments } = useAppointments()

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-1">Meus Agendamentos</h1>
        <p className="text-zinc-400 text-sm mb-6">Seus próximos compromissos</p>
        <AppointmentList appointments={appointments} />
      </div>
    </ClientLayout>
  )
}