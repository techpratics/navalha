import AdminLayout from '../../components/layout/AdminLayout'
import AppointmentCard from '../../components/appointments/AppointmentCard'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid, Columns } from 'lucide-react'
import { useSchedule } from '../../hooks/useSchedule'

export default function AdminSchedulePage() {
  const { 
    viewMode, 
    setViewMode, 
    currentDate, 
    appointments, 
    handlePrevious, 
    handleNext, 
    handleToday 
  } = useSchedule()

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto flex flex-col h-full gap-6">
        
        {/* Cabeçalho */}
        <div>
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Agenda Geral</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Gerencie os agendamentos e horários da barbearia
          </p>
        </div>

        {/* Barra de Controles */}
        <div 
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          className="flex flex-col sm:flex-row justify-between items-center p-4 rounded-2xl border gap-4"
        >
          {/* Navegação de Data */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToday} 
              style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-80 transition-opacity border border-transparent hover:border-[var(--border)]"
            >
              Hoje
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevious} style={{ color: 'var(--text-secondary)' }} className="p-2 hover:text-[var(--brand)] transition-colors">
                <ChevronLeft size={20} />
              </button>
              <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-semibold min-w-[140px] text-center capitalize">
                {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={handleNext} style={{ color: 'var(--text-secondary)' }} className="p-2 hover:text-[var(--brand)] transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Toggles de Visualização */}
          <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="flex p-1 rounded-lg">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'daily' ? 'bg-[var(--bg-surface)] text-[var(--brand)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <CalendarIcon size={16} /> Dia
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'weekly' ? 'bg-[var(--bg-surface)] text-[var(--brand)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Columns size={16} /> Semana
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'monthly' ? 'bg-[var(--bg-surface)] text-[var(--brand)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LayoutGrid size={16} /> Mês
            </button>
          </div>
        </div>

        {/* Renderização condicional da Agenda */}
        <div className="flex-1">
          {viewMode === 'daily' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300">
              <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium flex items-center gap-2 mb-2">
                <CalendarIcon size={16} /> 
                {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </h3>
              <div className="flex flex-col gap-3">
                {appointments.map((app) => (
                  <AppointmentCard key={app.id} appointment={app} view="professional" />
                ))}
              </div>
            </div>
          )}

          {viewMode === 'weekly' && (
            <div style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} className="flex items-center justify-center h-64 border rounded-2xl border-dashed text-[var(--text-muted)] animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-2">
                <Columns size={32} className="opacity-20" />
                <p>Grid Semanal - Em construção</p>
              </div>
            </div>
          )}

          {viewMode === 'monthly' && (
            <div style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} className="flex items-center justify-center h-64 border rounded-2xl border-dashed text-[var(--text-muted)] animate-in fade-in duration-300">
              <div className="flex flex-col items-center gap-2">
                <LayoutGrid size={32} className="opacity-20" />
                <p>Calendário Mensal - Em construção</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}