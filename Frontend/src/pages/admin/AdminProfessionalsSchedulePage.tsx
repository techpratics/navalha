import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { ChevronLeft, ChevronRight, Scissors, Clock } from 'lucide-react'
import { useProfessionalsSchedule } from '../../hooks/useProfessionalsSchedule'
import AppointmentModal from '../../components/appointments/AppointmentModal'
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal'

const statusConfig = {
  confirmed: { label: 'Confirmado', className: 'bg-green-500/20 text-green-500 border-green-500/30' },
  pending: { label: 'Pendente', className: 'bg-amber-500/20 text-amber-500 border-amber-500/30' },
  cancelled: { label: 'Cancelado', className: 'bg-red-500/20 text-red-500 border-red-500/30' },
  completed: { label: 'Concluido', className: 'bg-blue-500/20 text-blue-500 border-blue-500/30'},
}

export default function AdminProfessionalsSchedulePage() {
  const {
    currentDate,
    groupedSchedule,
    loading,
    error,
    handlePrevious,
    handleNext,
    handleToday
  } = useProfessionalsSchedule()

  // Estados para controlar os modais (mesma lógica da Agenda Geral)
  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [rescheduleData, setRescheduleData] = useState<any>(null)

  return (
    <AdminLayout>
      <div className="flex flex-col h-full gap-6 pb-6">
        
        {/* Cabeçalho */}
        <div>
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Visão por Profissional</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Agenda consolidada da equipe para o dia selecionado
          </p>
        </div>

        {/* Barra de Navegação de Data */}
        <div 
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          className="flex justify-between items-center p-4 rounded-2xl border"
        >
          <button 
            onClick={handleToday} 
            style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-transparent hover:border-[var(--border)] transition-colors"
          >
            Hoje
          </button>
          
          <div className="flex items-center gap-2">
            <button onClick={handlePrevious} style={{ color: 'var(--text-secondary)' }} className="p-2 hover:text-[var(--brand)] transition-colors bg-[var(--bg-elevated)] rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-semibold min-w-[200px] text-center capitalize">
              {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={handleNext} style={{ color: 'var(--text-secondary)' }} className="p-2 hover:text-[var(--brand)] transition-colors bg-[var(--bg-elevated)] rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="w-[68px] hidden sm:block"></div>
        </div>

        {/* FEEDBACK DE CARREGAMENTO */}
        {loading && (
          <div className="text-center py-10 text-[var(--text-secondary)]">Carregando colunas da equipe...</div>
        )}

        {error && (
          <div className="text-center py-10 text-red-500">{error}</div>
        )}

        {/* LINHA DE COLUNAS (KANBAN) */}
        {!loading && !error && (
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 items-start h-full min-w-max">
              
              {groupedSchedule.length > 0 ? (
                groupedSchedule.map((group) => (
                  <div 
                    key={group.professionalId}
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                    className="w-80 border rounded-2xl flex flex-col max-h-[calc(100vh-260px)] shadow-sm"
                  >
                    {/* Topo da Coluna */}
                    <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} className="p-4 border-b flex items-center gap-3 shrink-0 rounded-t-2xl">
                      <div className="w-9 h-9 rounded-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-sm">
                        {group.professionalInitials}
                      </div>
                      <div>
                        <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-sm leading-tight">{group.professionalName}</h3>
                        <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">{group.appointments.length} atendimentos</p>
                      </div>
                    </div>

                    {/* Lista de Cards */}
                    <div className="p-3 flex flex-col gap-3 overflow-y-auto flex-1">
                      {group.appointments.map((app) => (
                        <div 
                          key={app.id}
                          onClick={() => setSelectedApp(app)} // <-- ADICIONAMOS O CLICK AQUI
                          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                          className="p-3 rounded-xl border flex flex-col gap-2 hover:border-amber-500/40 transition-colors group cursor-pointer" // <-- ADICIONAMOS CURSOR-POINTER
                        >
                          <div className="flex items-center justify-between">
                            <span style={{ color: 'var(--brand)' }} className="font-black text-base flex items-center gap-1">
                              <Clock size={14} />
                              {app.time}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${statusConfig[app.status]?.className || statusConfig.pending.className}`}>
                              {statusConfig[app.status]?.label || 'Pendente'}
                            </span>
                          </div>

                          <div>
                            <p style={{ color: 'var(--text-primary)' }} className="font-bold text-sm leading-tight">{app.clientName}</p>
                            <p style={{ color: 'var(--text-secondary)' }} className="text-xs flex items-center gap-1 mt-1">
                              <Scissors size={12} style={{ color: 'var(--text-muted)' }} />
                              {app.serviceName}
                            </p>
                          </div>

                          <div className="text-[10px] text-right" style={{ color: 'var(--text-muted)' }}>
                            {app.durationMinutes} min
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-20" style={{ color: 'var(--text-muted)' }}>
                  Nenhum atendimento agendado para nenhum profissional na data selecionada.
                </div>
              )}

            </div>
          </div>
        )}

      </div>

      {/* Renderização do Modal de Detalhes / Cancelar */}
      {selectedApp && (
        <AppointmentModal
          appointment={selectedApp}
          isOpen={!!selectedApp}
          onClose={() => setSelectedApp(null)}
          onSuccess={() => {
            setSelectedApp(null);
            window.location.reload(); 
          }}
          onReschedule={(app) => {
            setSelectedApp(null);
            setRescheduleData(app);
            setIsFormOpen(true);
          }}
        />
      )}

      {/* Renderização do Modal de Reagendamento / Novo Agendamento */}
      {isFormOpen && (
        <AppointmentFormModal 
          isOpen={isFormOpen}
          rescheduleData={rescheduleData}
          onClose={() => {
            setIsFormOpen(false);
            setRescheduleData(null);
          }}
          onSuccess={() => {
            window.location.reload();
          }}
        />
      )}

    </AdminLayout>
  )
}
