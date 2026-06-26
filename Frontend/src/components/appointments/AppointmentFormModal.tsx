import { X, User, Scissors, Briefcase } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import DateInput from '../ui/DateInput';
import TimeInput from '../ui/TimeInput';
import { useAppointmentForm } from '../../hooks/useAppointmentForm';
import type { Appointment } from '../../types/appointment';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  rescheduleData?: Appointment | null;
}

export default function AppointmentFormModal({ isOpen, onClose, onSuccess, rescheduleData }: AppointmentFormModalProps) {
  const {
    form,
    loading,
    clients,
    services,
    professionals,
    handleFieldChange,
    handleSubmit
  } = useAppointmentForm({ isOpen, rescheduleData, onSuccess, onClose });

  if (!isOpen) return null;

  const selectStyle = {
    backgroundColor: 'var(--bg-elevated)',
    borderColor: 'var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
      >
        <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} className="px-6 py-4 border-b flex justify-between items-center">
          <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-bold">
            {rescheduleData ? 'Reagendar Horário' : 'Novo Agendamento'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }} className="hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-black/5">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {rescheduleData && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-2 text-sm text-amber-600 font-medium">
              Reagendando o cliente <strong className="font-bold">
                {rescheduleData.clientName === 'string' ? `CPF/ID: ${rescheduleData.clientId?.substring(0,6)}` : rescheduleData.clientName}
              </strong>. 
              O horário antigo será liberado automaticamente.
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--text-secondary)' }} className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <User size={14} style={{ color: 'var(--text-muted)' }} /> Cliente *
            </label>
            <select
              style={selectStyle}
              value={form.clienteId}
              onChange={e => handleFieldChange('clienteId', e.target.value)}
              className="w-full h-[42px] px-3 rounded-xl border text-sm font-medium focus:outline-none transition-colors"
              required
            >
              <option value="">Selecione o cliente...</option>
              {clients.map(c => {
                let displayName = c.nome;
                if (c.nome === 'string' || !c.nome) {
                  displayName = c.cpf 
                    ? `CPF: ${c.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}`
                    : `Cliente (${c.id.substring(0,4)})`;
                }
                return <option key={c.id} value={c.id}>{displayName}</option>;
              })}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--text-secondary)' }} className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Scissors size={14} style={{ color: 'var(--text-muted)' }} /> Serviço *
            </label>
            <select
              style={selectStyle}
              value={form.servicoId}
              onChange={e => handleFieldChange('servicoId', e.target.value)}
              className="w-full h-[42px] px-3 rounded-xl border text-sm font-medium focus:outline-none transition-colors"
              required
            >
              <option value="">Selecione o serviço...</option>
              {services.map(s => {
                const precoFormatado = s.precoEmCentavos 
                  ? (s.precoEmCentavos / 100).toFixed(2) 
                  : Number(s.preco || 0).toFixed(2);
                return (
                  <option key={s.id} value={s.id}>
                    {s.nome} — R$ {precoFormatado.replace('.', ',')}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ color: 'var(--text-secondary)' }} className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Briefcase size={14} style={{ color: 'var(--text-muted)' }} /> Profissional *
            </label>
            <select
              style={selectStyle}
              value={form.profissionalId}
              onChange={e => handleFieldChange('profissionalId', e.target.value)}
              className="w-full h-[42px] px-3 rounded-xl border text-sm font-medium focus:outline-none transition-colors"
              required
            >
              <option value="">Selecione o profissional...</option>
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name || p.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DateInput
              label="Data"
              value={form.data}
              onChange={iso => handleFieldChange('data', iso)}
            />
            <TimeInput
              label="Horário"
              value={form.horarioInicio}
              onChange={time => handleFieldChange('horarioInicio', time)}
            />
          </div>

          <div className="pt-4 mt-2 border-t border-[var(--border)]">
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Salvando...' : 'Confirmar Agendamento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}