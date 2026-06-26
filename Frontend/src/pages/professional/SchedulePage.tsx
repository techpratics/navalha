import { useState, useEffect } from 'react'
import { Plus, X, User, Scissors, AlertCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import TimeInput from '../../components/ui/TimeInput'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout'
import AppointmentList from '../../components/appointments/AppointmentList'
import { useAppointments } from '../../hooks/useAppointments'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { clientService } from '../../services/client.service'
import { catalogService } from '../../services/catalog.service'
import { api } from '../../services/api'

function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDisplayDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function SchedulePage() {
  const { appointments, fetchAppointments, completeAppointment } = useAppointments()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString())

  const [clientOptions, setClientOptions] = useState<any[]>([])
  const [serviceOptions, setServiceOptions] = useState<any[]>([])

  const [form, setForm] = useState({
    clienteId: '',
    servicoId: '',
    time: '',
  })

  useEffect(() => {
    Promise.all([
      clientService.getClients(),
      catalogService.getServices()
    ]).then(([clients, services]) => {
      setClientOptions(clients)
      setServiceOptions(services)
    }).catch(console.error)
  }, [])

  // Filtra apenas por data — o backend já retorna somente os agendamentos do profissional logado
  const dailySchedule = appointments.filter(app => app.date === selectedDate)

  function handlePreviousDay() {
    const date = new Date(selectedDate + 'T00:00:00')
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  function handleNextDay() {
    const date = new Date(selectedDate + 'T00:00:00')
    date.setDate(date.getDate() + 1)
    setSelectedDate(date.toISOString().split('T')[0])
  }

  function handleGoToToday() {
    setSelectedDate(getTodayString())
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.clienteId || !form.servicoId || !form.time) {
      setError('Preencha todos os campos obrigatórios')
      return
    }

    setSubmitting(true)
    try {
      await api.post('/agendamentos/encaixe', {
        profissionalId: '00000000-0000-0000-0000-000000000000',
        clienteId: form.clienteId,
        servicoId: form.servicoId,
        data: selectedDate,
        horarioInicio: form.time,
      })
      setIsModalOpen(false)
      setForm({ clienteId: '', servicoId: '', time: '' })
      await fetchAppointments()
    } catch (err: any) {
      const msg = err.response?.data?.erro || err.response?.data?.message || 'Erro ao criar encaixe.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProfessionalLayout>
      <div className="max-w-2xl mx-auto">

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Minha Agenda</h1>

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handlePreviousDay}
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                className="p-1.5 rounded-lg border hover:opacity-80 transition-opacity"
              >
                <ChevronLeft size={16} />
              </button>

              <span style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold min-w-[180px] text-center capitalize">
                {formatDisplayDate(selectedDate)}
              </span>

              <button
                onClick={handleNextDay}
                style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', borderColor: 'var(--border)' }}
                className="p-1.5 rounded-lg border hover:opacity-80 transition-opacity"
              >
                <ChevronRight size={16} />
              </button>

              {selectedDate !== getTodayString() && (
                <button
                  onClick={handleGoToToday}
                  style={{ color: 'var(--brand)' }}
                  className="text-xs font-bold ml-2 flex items-center gap-1 hover:underline"
                >
                  <Calendar size={12} />
                  Hoje
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
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

          {dailySchedule.length === 0 ? (
            <div className="text-center py-12 border border-[var(--border)] border-dashed rounded-2xl" style={{ color: 'var(--text-muted)' }}>
              Nenhum compromisso agendado para este dia.
            </div>
          ) : (
            <AppointmentList
              appointments={dailySchedule}
              view="professional"
              onComplete={completeAppointment}
            />
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">Novo Encaixe</h2>
              <button onClick={() => { setIsModalOpen(false); setError(null) }} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 transition-opacity">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label style={{ color: 'var(--text-secondary)' }} className="block text-sm font-medium mb-1">
                  <User size={14} className="inline mr-1" />
                  Cliente
                </label>
                <select
                  value={form.clienteId}
                  onChange={e => setForm({ ...form, clienteId: e.target.value })}
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[var(--brand)]"
                >
                  <option value="">Selecione um cliente...</option>
                  {clientOptions.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ color: 'var(--text-secondary)' }} className="block text-sm font-medium mb-1">
                  <Scissors size={14} className="inline mr-1" />
                  Serviço
                </label>
                <select
                  value={form.servicoId}
                  onChange={e => setForm({ ...form, servicoId: e.target.value })}
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[var(--brand)]"
                >
                  <option value="">Selecione um serviço...</option>
                  {serviceOptions.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.nome} ({s.duracaoMinutos} min)</option>
                  ))}
                </select>
              </div>

              <TimeInput
                label="Horário"
                value={form.time}
                onChange={time => setForm({ ...form, time })}
              />

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm border border-red-500/20">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setError(null) }} className="flex-1">Cancelar</Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
                  {submitting ? 'Confirmando...' : 'Confirmar Encaixe'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProfessionalLayout>
  )
}
