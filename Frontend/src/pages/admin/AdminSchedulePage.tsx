import AdminLayout from '../../components/layout/AdminLayout'
import AppointmentCard from '../../components/appointments/AppointmentCard'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, LayoutGrid, Columns, Clock } from 'lucide-react'
import { useSchedule } from '../../hooks/useSchedule'
import AppointmentModal from '../../components/appointments/AppointmentModal'
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';
import { useState } from 'react'

// Helper para formatar a data local para o formato do banco (YYYY-MM-DD)
const getLocalFormattedDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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

  const [selectedApp, setSelectedApp] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState<any>(null);

  // LÓGICA DO DIA
  const dailyDateStr = getLocalFormattedDate(currentDate);
  const dailyAppointments = appointments.filter(app => app.date === dailyDateStr);

  // LÓGICA DA SEMANA
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); 
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return {
      dateObj: d,
      dateStr: getLocalFormattedDate(d),
      dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      dayNumber: d.getDate()
    };
  });

  // LÓGICA DO MÊS 
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  
  const monthDays = Array.from({ length: daysInMonth }).map((_, i) => {
    const d = new Date(year, month, i + 1);
    return {
      dateObj: d,
      dateStr: getLocalFormattedDate(d),
      dayNumber: d.getDate()
    };
  });

  const emptyMonthStartCells = Array.from({ length: firstDayOfMonth }).map((_, i) => i);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto flex flex-col h-full gap-6 pb-10">
        
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
          className="flex flex-col md:flex-row justify-between items-center p-4 rounded-2xl border gap-4"
        >
          {/* Navegação de Data */}
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-between md:justify-start">
            <button 
              onClick={handleToday} 
              style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:opacity-80 transition-opacity border border-transparent hover:border-[var(--border)]"
            >
              Hoje
            </button>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevious} style={{ color: 'var(--text-secondary)' }} className="p-2 hover:text-[var(--brand)] transition-colors bg-[var(--bg-elevated)] rounded-lg">
                <ChevronLeft size={20} />
              </button>
              <h2 style={{ color: 'var(--text-primary)' }} className="text-base md:text-lg font-semibold min-w-[220px] text-center capitalize">
                {viewMode === 'daily' && currentDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                {viewMode === 'weekly' && `Semana ${startOfWeek.getDate()}/${String(startOfWeek.getMonth() + 1).padStart(2, '0')}`}
                {viewMode === 'monthly' && currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h2>
              <button onClick={handleNext} style={{ color: 'var(--text-secondary)' }} className="p-2 hover:text-[var(--brand)] transition-colors bg-[var(--bg-elevated)] rounded-lg">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Toggles de Visualização */}
          <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="flex p-1 rounded-lg w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setViewMode('daily')}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'daily' ? 'bg-[var(--bg-surface)] text-[var(--brand)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <CalendarIcon size={16} /> <span className="hidden sm:inline">Dia</span>
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'weekly' ? 'bg-[var(--bg-surface)] text-[var(--brand)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Columns size={16} /> <span className="hidden sm:inline">Semana</span>
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                viewMode === 'monthly' ? 'bg-[var(--bg-surface)] text-[var(--brand)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <LayoutGrid size={16} /> <span className="hidden sm:inline">Mês</span>
            </button>
          </div>
        </div>

        {/* ÁREA DE RENDERIZAÇÃO */}
        <div className="flex-1">
          
          {/* === VISUALIZAÇÃO DIÁRIA === */}
          {viewMode === 'daily' && (
            <div className="flex flex-col gap-4 animate-in fade-in duration-300 max-w-4xl mx-auto">
              <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium flex items-center gap-2 mb-2">
                <CalendarIcon size={16} /> 
                {currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </h3>
              
              <div className="flex flex-col gap-3">
                {dailyAppointments.length > 0 ? (
                  dailyAppointments.map((app) => (
                    <div 
                      key={app.id} 
                      onClick={() => setSelectedApp(app)} 
                      className="cursor-pointer transition-transform hover:scale-[1.01]"
                    >
                      <AppointmentCard appointment={app} view="professional" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
                    Nenhum agendamento para este dia.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === VISUALIZAÇÃO SEMANAL === */}
          {viewMode === 'weekly' && (
            <div className="animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                  const dayApps = appointments.filter(app => app.date === day.dateStr);
                  const isToday = day.dateStr === getLocalFormattedDate(new Date());

                  return (
                    <div 
                      key={index} 
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: isToday ? 'var(--brand)' : 'var(--border)' }}
                      className={`flex flex-col border rounded-2xl overflow-hidden min-h-[300px] ${isToday ? 'border-2' : ''}`}
                    >
                      {/* Cabeçalho do Dia */}
                      <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} className="p-3 border-b text-center">
                        <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-bold uppercase tracking-wider">{day.dayName}</p>
                        <p style={{ color: isToday ? 'var(--brand)' : 'var(--text-primary)' }} className="text-2xl font-black mt-1">{day.dayNumber}</p>
                      </div>
                      
                      {/* Lista de Agendamentos do Dia */}
                      <div className="flex flex-col gap-2 p-2 flex-1 overflow-y-auto">
                        {dayApps.map(app => (
                          <div 
                            key={app.id}
                            onClick={() => setSelectedApp(app)}
                            style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                            className="p-2 rounded-xl border text-sm flex flex-col gap-1 cursor-pointer hover:border-amber-500/50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <span style={{ color: 'var(--brand)' }} className="font-bold">{app.time}</span>
                            </div>
                            <span style={{ color: 'var(--text-primary)' }} className="font-medium truncate">{app.clientName}</span>
                            <span style={{ color: 'var(--text-muted)' }} className="text-xs truncate">{app.serviceName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* === VISUALIZAÇÃO MENSAL === */}
          {viewMode === 'monthly' && (
            <div 
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              className="border rounded-2xl overflow-hidden animate-in fade-in duration-300"
            >
              {/* Dias da semana (Seg, Ter, Qua...) */}
              <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} className="grid grid-cols-7 border-b">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} style={{ color: 'var(--text-secondary)' }} className="py-3 text-center text-xs font-bold uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid do Calendário */}
              <div className="grid grid-cols-7">
                {/* Células vazias (Dias do mês anterior) */}
                {emptyMonthStartCells.map(cell => (
                  <div key={`empty-${cell}`} style={{ borderColor: 'var(--border)' }} className="min-h-[100px] border-b border-r opacity-30 bg-black/5" />
                ))}

                {/* Dias do mês atual */}
                {monthDays.map(day => {
                  const dayApps = appointments.filter(app => app.date === day.dateStr);
                  const isToday = day.dateStr === getLocalFormattedDate(new Date());

                  return (
                    <div 
                      key={day.dayNumber} 
                      style={{ borderColor: 'var(--border)' }}
                      className="min-h-[100px] border-b border-r p-1 md:p-2 flex flex-col relative group hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <span 
                        style={{ 
                          backgroundColor: isToday ? 'var(--brand)' : 'transparent',
                          color: isToday ? '#000' : 'var(--text-secondary)'
                        }} 
                        className={`text-xs md:text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full ml-auto ${isToday ? '' : 'group-hover:text-[var(--text-primary)]'}`}
                      >
                        {day.dayNumber}
                      </span>
                      
                      {/* Indicadores de Agendamentos */}
                      <div className="mt-1 flex flex-col gap-1 overflow-hidden">
                        {dayApps.slice(0, 3).map(app => (
                          <div 
                            key={app.id} 
                            onClick={() => setSelectedApp(app)}
                            style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: 'var(--brand)' }}
                            className="text-[10px] px-1.5 py-0.5 rounded truncate font-medium flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <Clock size={8} className="shrink-0" />
                            <span className="truncate">{app.time} - {app.clientName}</span>
                          </div>
                        ))}
                        {dayApps.length > 3 && (
                          <span style={{ color: 'var(--text-muted)' }} className="text-[10px] pl-1 font-medium">
                            +{dayApps.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Renderização do Modal */}
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

        </div>
      </div>
    </AdminLayout>
  )
}