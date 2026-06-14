import { Clock, Copy, Save, CheckCircle2, AlertCircle } from 'lucide-react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { useAvailability } from '../../hooks/useAvailability'

export default function AvailabilityPage() {
  const {
    schedule,
    isLoading,
    isSaving,
    showSuccess,
    errorMsg,
    updateDay,
    copyToAll,
    handleSave
  } = useAvailability()

  if (isLoading) {
    return (
      <ProfessionalLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
        </div>
      </ProfessionalLayout>
    )
  }

  return (
    <ProfessionalLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Meus Horários</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Configure sua disponibilidade semanal para os clientes.
            </p>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 px-6"
          >
            {isSaving ? (
              <span className="animate-pulse">Salvando...</span>
            ) : (
              <>
                <Save size={18} />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={18} />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {showSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 size={18} />
            <span className="font-medium">Horários atualizados com sucesso!</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {schedule.map((day) => (
            <div 
              key={day.id}
              style={{ 
                backgroundColor: 'var(--bg-surface)', 
                borderColor: day.active ? 'var(--brand)' : 'var(--border)',
                opacity: day.active ? 1 : 0.6
              }}
              className="p-4 md:p-5 rounded-2xl border transition-all flex flex-col md:flex-row gap-4 md:items-center justify-between group"
            >
              <div className="flex items-center gap-4 md:w-1/3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={day.active}
                    onChange={(e) => updateDay(day.id, 'active', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
                <span style={{ color: 'var(--text-primary)' }} className="font-semibold select-none">
                  {day.name}
                </span>
              </div>

              <div className="flex items-center gap-3 md:w-1/2">
                <Input
                  type="time"
                  value={day.start}
                  disabled={!day.active}
                  onChange={(e) => updateDay(day.id, 'start', e.target.value)}
                  leftElement={<Clock size={16} style={{ color: 'var(--text-muted)' }} />}
                  className="!mb-0"
                />
                <span style={{ color: 'var(--text-muted)' }}>até</span>
                <Input
                  type="time"
                  value={day.end}
                  disabled={!day.active}
                  onChange={(e) => updateDay(day.id, 'end', e.target.value)}
                  leftElement={<Clock size={16} style={{ color: 'var(--text-muted)' }} />}
                  className="!mb-0"
                />
              </div>

              <div className="md:w-1/6 flex justify-end">
                <button
                  onClick={() => copyToAll(day)}
                  disabled={!day.active}
                  title="Copiar estes horários para os outros dias ativos"
                  className="p-2 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors disabled:opacity-0 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                >
                  <Copy size={18} />
                  <span className="md:hidden">Copiar para todos</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProfessionalLayout>
  )
}