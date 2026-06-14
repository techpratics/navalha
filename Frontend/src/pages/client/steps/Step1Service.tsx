import { useState, useEffect } from 'react'
import { Scissors, ChevronRight } from 'lucide-react'
import { catalogService } from '../../../services/catalog.service'
import type { BookingState } from '../../../types/appointment'

interface Props {
  booking: BookingState
  onNext: (data: Partial<BookingState>) => void
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Step1Service({ onNext }: Props) {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Busca os serviços reais do catálogo no banco de dados
  useEffect(() => {
    async function loadServices() {
      setLoading(true)
      try {
        const data = await catalogService.getServices()
        setServices(data || [])
      } catch (error) {
        console.error("Erro ao carregar serviços do catálogo:", error)
      } finally {
        setLoading(false)
      }
    }
    loadServices()
  }, [])

  function handleSelect(service: any) {
    const price = service.precoEmCentavos || (service.preco ? service.preco * 100 : 0)
    
    onNext({ 
      serviceId: service.id, 
      serviceName: service.nome,
      serviceDuration: service.duracaoMinutos ?? 30, 
      servicePrice: price
    })
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div style={{ backgroundColor: 'var(--bg-surface)' }} className="rounded-2xl p-4 md:p-6 shadow-sm border border-[var(--border)]">

        <h2 style={{ color: 'var(--text-primary)' }} className="font-semibold mb-1 flex items-center gap-2">
          <Scissors size={18} style={{ color: 'var(--brand)' }} />
          Escolha o Serviço
        </h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
          O que vamos fazer hoje?
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }}></div>
          </div>
        ) : services.length === 0 ? (
          <p className="text-center py-8 font-medium" style={{ color: 'var(--text-muted)' }}>
            Nenhum serviço disponível no momento.
          </p>
        ) : (
          <div className="flex flex-col gap-3 animate-in fade-in duration-300">
            {services.map(s => {
              const precoExibido = s.precoEmCentavos ? s.precoEmCentavos : (s.preco ? s.preco * 100 : 0)
              const duracaoExibida = s.duracaoMinutos ?? 30

              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}
                  className="flex items-center gap-4 p-4 rounded-xl border hover:border-[var(--brand)] transition-all text-left group active:scale-[0.99]"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-[var(--brand)] group-hover:text-black transition-colors">
                    <Scissors size={18} />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{s.nome}</p>
                    <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5">{duracaoExibida} min</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span style={{ color: 'var(--brand)' }} className="font-bold text-sm">
                      {formatPrice(precoExibido)}
                    </span>
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}