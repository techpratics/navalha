import { useState } from 'react';
import { X, Calendar, Clock, User, Scissors, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import type { Appointment } from '../../types/appointment';
import { scheduleService } from '../../services/schedule.service';

interface AppointmentModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; 
  onReschedule: (appointment: Appointment) => void; 
}

export default function AppointmentModal({ appointment, isOpen, onClose, onSuccess, onReschedule }: AppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!isOpen) return null;

  const handleCancel = async () => {
    setLoading(true);
    try {
      await scheduleService.updateAppointmentStatus(appointment.id, 'CANCELADO');
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error("Erro ao cancelar:", error);
      alert('Erro ao cancelar o agendamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Cabeçalho */}
        <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} className="px-6 py-4 border-b flex justify-between items-center">
          <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-bold">Detalhes do Agendamento</h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }} className="hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-black/5">
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 flex flex-col gap-5">
          {/* Status Badge */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold uppercase tracking-wider px-3 py-1 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">
              {appointment.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
            </span>
          </div>

          {/* Informações */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase font-bold tracking-wider mb-0.5">Cliente</p>
                <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{appointment.clientName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <Scissors size={18} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase font-bold tracking-wider mb-0.5">Serviço & Profissional</p>
                <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{appointment.serviceName} <span style={{ color: 'var(--text-muted)' }} className="font-normal">com</span> {appointment.professionalName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs uppercase font-bold tracking-wider mb-0.5">Data e Horário</p>
                <p style={{ color: 'var(--text-primary)' }} className="font-semibold flex items-center gap-2">
                  {appointment.date.split('-').reverse().join('/')} 
                  <Clock size={14} style={{ color: 'var(--text-muted)' }} /> 
                  {appointment.time} ({appointment.durationMinutes} min)
                </p>
              </div>
            </div>
          </div>

          {/* Área de Confirmação de Cancelamento */}
          {confirmCancel && (
            <div className="mt-2 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex flex-col items-center text-center animate-in slide-in-from-top-2">
              <AlertTriangle size={24} className="text-red-500 mb-2" />
              <p className="text-red-500 text-sm font-bold mb-3">Tem certeza que deseja cancelar?</p>
              <div className="flex gap-2 w-full">
                <Button onClick={() => setConfirmCancel(false)} variant="secondary" className="flex-1 text-xs py-1.5 h-auto">Não, Voltar</Button>
                <Button onClick={handleCancel} disabled={loading} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 h-auto border-none">
                  {loading ? 'Cancelando...' : 'Sim, Cancelar'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Botões Principais */}
        {!confirmCancel && (
          <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} className="p-4 border-t flex gap-3">
            <Button 
              onClick={() => setConfirmCancel(true)} 
              variant="secondary" 
              className="flex-1 text-red-500 hover:bg-red-500/10 hover:border-red-500/30"
            >
              Cancelar Horário
            </Button>
            <Button 
              onClick={() => {
                onClose();
                onReschedule(appointment);
              }} 
              variant="primary" 
              className="flex-1"
            >
              Reagendar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}