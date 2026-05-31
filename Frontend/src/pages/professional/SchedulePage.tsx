import { useState } from 'react'
import { Plus, X, Clock, User, Scissors, AlertCircle } from 'lucide-react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout'
import AppointmentList from '../../components/appointments/AppointmentList'
import { useAppointments } from '../../hooks/useAppointments'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function SchedulePage() {
  const { appointments, addAppointment, checkAvailability } = useAppointments()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Simulação de profissional logado (Carlos Silva)
  const loggedInProfessionalName = 'Carlos Silva'
  const loggedInProfessionalInitials = 'CS'
  const today = '2026-05-31'

  const [form, setForm] = useState({
    clientName: '',
    serviceName: '',
    time: '',
    duration: '30',
    price: '45.00'
  })

  const dailySchedule = appointments.filter(
    app => app.professionalName === loggedInProfessionalName && app.date === today
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.clientName || !form.serviceName || !form.time) {
      setError('Preencha os campos obrigatórios')
      return
    }

    const isAvailable = checkAvailability(
      today,
      form.time,
      Number(form.duration),
      loggedInProfessionalName
    )

    if (!isAvailable) {
      setError('Horário indisponível ou em conflito com outro agendamento')
      return
    }

    addAppointment({
      professionalName: loggedInProfessionalName,
      professionalInitials: loggedInProfessionalInitials,
      clientName: form.clientName,
      clientInitials: form.clientName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      serviceName: form.serviceName,
      date: today,
      time: form.time,
      durationMinutes: Number(form.duration),
      priceInCents: Math.round(Number(form.price) * 100),
      status: 'confirmed'
    })

    setIsModalOpen(false)
    setForm({ clientName: '', serviceName: '', time: '', duration: '30', price: '45.00' })
  }

  return (
    <ProfessionalLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Minha Agenda</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Hoje, <span className="font-semibold text-amber-500">31 de maio</span>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Resumo do dia */}
          <div
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="p-4 rounded-2xl border flex items-center justify-around text-center"
          >
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider mb-1">Total</p>
              <p style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">{dailySchedule.length}</p>
            </div>
            <div style={{ borderColor: 'var(--border)' }} className="h-8 border-r" />
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider mb-1">Confirmados</p>
              <p style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">
                {dailySchedule.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <div style={{ borderColor: 'var(--border)' }} className="h-8 border-r" />
            <div>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider mb-1">Pendentes</p>
              <p style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">
                {dailySchedule.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>

          {/* Botão Novo Encaixe (Estilizado como o resumo) */}
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ 
              backgroundColor: 'rgba(245, 158, 11, 0.1)', 
              borderColor: 'var(--brand)',
              color: 'var(--brand)'
            }}
            className="w-full p-4 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 font-bold hover:opacity-80 transition-opacity"
          >
            <Plus size={20} />
            Novo Encaixe
          </button>

          <AppointmentList appointments={dailySchedule} view="professional" />
        </div>
      </div>

      {/* Modal de Encaixe Rápido */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">Novo Encaixe</h2>
              <button 
                onClick={() => { setIsModalOpen(false); setError(null); }}
                style={{ color: 'var(--text-muted)' }}
                className="hover:opacity-70 transition-opacity"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nome do Cliente"
                placeholder="Ex: Pedro Santos"
                value={form.clientName}
                onChange={e => setForm({ ...form, clientName: e.target.value })}
                leftElement={<User size={16} style={{ color: 'var(--text-muted)' }} />}
              />
              
              <Input
                label="Serviço"
                placeholder="Ex: Corte e Barba"
                value={form.serviceName}
                onChange={e => setForm({ ...form, serviceName: e.target.value })}
                leftElement={<Scissors size={16} style={{ color: 'var(--text-muted)' }} />}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Horário"
                  type="time"
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  leftElement={<Clock size={16} style={{ color: 'var(--text-muted)' }} />}
                />
                <Input
                  label="Duração (min)"
                  type="number"
                  value={form.duration}
                  onChange={e => setForm({ ...form, duration: e.target.value })}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm border border-red-500/20">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => { setIsModalOpen(false); setError(null); }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  variant="primary" 
                  className="flex-1"
                >
                  Confirmar Encaixe
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProfessionalLayout>
  )
}
