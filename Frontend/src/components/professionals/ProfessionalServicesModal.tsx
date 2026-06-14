import { X, Scissors, Check } from 'lucide-react';
import { useProfessionalServices } from '../../hooks/useProfessionalServices';
import type { Professional } from '../../types/professional';

interface ProfessionalServicesModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfessionalServicesModal({ professional, isOpen, onClose }: ProfessionalServicesModalProps) {
  const { catalog, linkedServiceIds, loading, toggleService } = useProfessionalServices(professional, isOpen);
  

  if (!isOpen || !professional) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        className="w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Cabeçalho */}
        <div style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }} className="px-6 py-4 border-b flex justify-between items-center">
          <div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-lg font-bold">Serviços Habilitados</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">{professional.name}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)' }} className="hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-black/5">
            <X size={20} />
          </button>
        </div>

        {/* Corpo com a Lista de Serviços */}
        <div className="p-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Carregando catálogo...</div>
          ) : catalog.length === 0 ? (
            <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>Nenhum serviço cadastrado no sistema.</div>
          ) : (
            <div className="flex flex-col gap-2">
              {catalog.map(servico => {
                const isLinked = linkedServiceIds.has(servico.id);
                
                return (
                  <label 
                    key={servico.id}
                    style={{ 
                      backgroundColor: isLinked ? 'var(--bg-elevated)' : 'transparent',
                      borderColor: isLinked ? 'var(--brand)' : 'var(--border)' 
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:border-[var(--brand)] ${isLinked ? 'shadow-sm' : 'opacity-80 hover:opacity-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${isLinked ? 'bg-[var(--brand)] border-[var(--brand)] text-black' : 'border-[var(--text-muted)] text-transparent'}`}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <div>
                        <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-sm leading-none mb-1">{servico.nome}</p>
                        <p style={{ color: 'var(--text-muted)' }} className="text-[10px] font-medium flex items-center gap-1">
                          <Scissors size={10} /> R$ {(servico.precoEmCentavos ? servico.precoEmCentavos / 100 : Number(servico.preco || 0)).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                    
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={isLinked}
                      onChange={() => toggleService(servico.id, isLinked)}
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Rodapé informativo */}
        <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="px-6 py-3 border-t border-[var(--border)] text-center">
          <p style={{ color: 'var(--text-muted)' }} className="text-xs">As alterações são salvas automaticamente ao clicar.</p>
        </div>
      </div>
    </div>
  );
}