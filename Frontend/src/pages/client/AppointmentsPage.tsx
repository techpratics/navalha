import ClientLayout from '../../components/layout/ClientLayout'
import AppointmentList from '../../components/appointments/AppointmentList'
import { useAppointments } from '../../hooks/useAppointments'

export default function AppointmentsPage() {
  const { appointments, loading, error, cancelAppointment, canCancel } = useAppointments()

  return (
    <ClientLayout>
      <div className="max-w-2xl mx-auto">
        <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Meus Agendamentos</h1>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">Seus próximos compromissos</p>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-center">
            {error}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
            Você ainda não possui agendamentos.
          </div>
        ) : (
          <AppointmentList 
            appointments={appointments} 
            onCancel={cancelAppointment}
            canCancel={canCancel}
          />
        )}
      </div>
    </ClientLayout>
  )
}