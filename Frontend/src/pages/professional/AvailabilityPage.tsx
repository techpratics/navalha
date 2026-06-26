import { Save, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout'
import Button from '../../components/ui/Button'
import TimeInput from '../../components/ui/TimeInput'
import { useAvailability } from '../../hooks/useAvailability'

export default function AvailabilityPage() {
  const {
    schedule,
    isLoading,
    isSaving,
    showSuccess,
    errorMsg,
    toggleDay,
    addBlock,
    removeBlock,
    updateBlock,
    handleSave,
  } = useAvailability()

  if (isLoading) {
    return (
      <ProfessionalLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: 'var(--brand)' }} />
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
              Configure os blocos de atendimento por dia da semana.
            </p>
          </div>

          <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6">
            {isSaving ? (
              <span className="animate-pulse">Salvando...</span>
            ) : (
              <><Save size={18} />Salvar Configurações</>
            )}
          </Button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={18} />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {showSuccess && (
          <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={18} />
            <span className="font-medium">Horários atualizados com sucesso!</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {schedule.map(day => (
            <div
              key={day.id}
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: day.active ? 'var(--brand)' : 'var(--border)',
                opacity: day.active ? 1 : 0.6,
              }}
              className="rounded-2xl border transition-all overflow-hidden"
            >
              {/* Cabeçalho do dia */}
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={day.active}
                      onChange={e => toggleDay(day.id, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                  </label>
                  <span style={{ color: 'var(--text-primary)' }} className="font-bold select-none">
                    {day.name}
                  </span>
                </div>

                {day.active && (
                  <button
                    onClick={() => addBlock(day.id)}
                    style={{ color: 'var(--brand)' }}
                    className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
                  >
                    <Plus size={16} />
                    Adicionar bloco
                  </button>
                )}
              </div>

              {/* Blocos de horário */}
              {day.active && day.blocks.length > 0 && (
                <div
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
                  className="border-t px-5 py-3 flex flex-col gap-3"
                >
                  {day.blocks.map((block, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <TimeInput
                        value={block.start}
                        onChange={time => updateBlock(day.id, idx, 'start', time)}
                      />
                      <span style={{ color: 'var(--text-muted)' }} className="shrink-0 text-sm">até</span>
                      <TimeInput
                        value={block.end}
                        onChange={time => updateBlock(day.id, idx, 'end', time)}
                      />
                      <button
                        onClick={() => removeBlock(day.id, idx)}
                        className="shrink-0 p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Remover bloco"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {day.active && day.blocks.length === 0 && (
                <div
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
                  className="border-t px-5 py-3"
                >
                  <p style={{ color: 'var(--text-muted)' }} className="text-sm text-center">
                    Nenhum bloco adicionado. Clique em "Adicionar bloco" para definir um horário.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ProfessionalLayout>
  )
}
