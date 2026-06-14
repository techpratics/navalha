import { useState } from 'react'
import { Plus, X, Clock, User, Scissors, AlertCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout'
import AppointmentList from '../../components/appointments/AppointmentList'
import { useAppointments } from '../../hooks/useAppointments'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

// Função utilitária para pegar a data de hoje no formato YYYY-MM-DD corrigindo fuso horário
function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Função para formatar a data por extenso na tela (Ex: 14 de junho de 2026)
function formatDisplayDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-')
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function SchedulePage() {
  const { appointments, addAppointment, checkAvailability, completeAppointment } = useAppointments()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. DATA DINÂMICA: Começa sempre com o dia de hoje real do PC
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString())

  // Simulação de profissional logado (Kaua)
  const loggedInProfessionalName = 'Kaua'
  const loggedInProfessionalInitials = 'KA'

  const [form, setForm] = useState({
    clientName: '',
    serviceName: '',
    time: '',
    duration: '45',
    price: '40.00'
  })

  // 2. FILTRAGEM DINÂMICA: Filtra usando o estado da selectedDate
  const dailySchedule = appointments.filter(
    app => app.professionalName.toLowerCase() === loggedInProfessionalName.toLowerCase() && app.date === selectedDate
  )

  // 3. FUNÇÕES DE NAVEGAÇÃO: Soma ou subtrai 1 dia da data atual
  function handlePreviousDay() {
    const date = new Date(selectedDate + 'T00:00:00') // Evita quebra de fuso
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.clientName || !form.serviceName || !form.time) {
      setError('Preencha os campos obrigatórios')
      return
    }

    if (checkAvailability) {
      const isAvailable = checkAvailability(selectedDate, form.time, Number(form.duration), loggedInProfessionalName)
      if (!isAvailable) {
        setError('Horário indisponível ou em conflito com outro agendamento')
        return
      }
    }

    if (addAppointment) {
      addAppointment({
        professionalName: loggedInProfessionalName,
        professionalInitials: loggedInProfessionalInitials,
        clientName: form.clientName,
        clientInitials: form.clientName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        serviceName: form.serviceName,
        date: selectedDate, // Usa a data que está aberta na tela
        time: form.time,
        durationMinutes: Number(form.duration),
        priceInCents: Math.round(Number(form.price) * 100),
        status: 'confirmed'
      })
    }

    setIsModalOpen(false)
    setForm({ clientName: '', serviceName: '', time: '', duration: '45', price: '40.00' })
  }

  return (
    <ProfessionalLayout>
      <div className="max-w-2xl mx-auto">
        
        {/* CABEÇALHO COM CONTROLES DE DATA */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Minha Agenda</h1>
            
            {/* Barra de Navegação de Dias */}
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

              {/* Botão Atalho para voltar para o "Hoje" */}
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

          {/* Botão Novo Encaixe */}
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

          {/* Listagem dos cartões */}
          {dailySchedule.length === 0 ? (
            <div className="text-center py-12 border border-[var(--border)] border-dashed rounded-2xl" style={{ color: 'var(--text-muted)' }}>
              Nenhum compromisso agendado para este dia.
            </div>
          ) : (
            <AppointmentList 
              appointments={dailySchedule} 
              view="professional" 
              onComplete={completeAppointment} // <-- ADICIONAMOS ISSO AQUI
            />
          )}
        </div>
      </div>

      {/* Modal de Encaixe Rápido */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">Novo Encaixe</h2>
              <button onClick={() => { setIsModalOpen(false); setError(null); }} style={{ color: 'var(--text-muted)' }} className="hover:opacity-70 transition-opacity">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Nome do Cliente" placeholder="Ex: Pedro Santos" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} leftElement={<User size={16} style={{ color: 'var(--text-muted)' }} />} />
              <Input label="Serviço" placeholder="Ex: Corte e Barba" value={form.serviceName} onChange={e => setForm({ ...form, serviceName: e.target.value })} leftElement={<Scissors size={16} style={{ color: 'var(--text-muted)' }} />} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Horário" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} leftElement={<Clock size={16} style={{ color: 'var(--text-muted)' }} />} />
                <Input label="Duração (min)" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm border border-red-500/20"><AlertCircle size={16} />{error}</div>
              )}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setError(null); }} className="flex-1">Cancelar</Button>
                <Button type="submit" variant="primary" className="flex-1">Confirmar Encaixe</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProfessionalLayout>
  )
}