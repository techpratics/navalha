import { useState, useEffect } from 'react'
import { BarChart3, Users, Scissors, TrendingUp, Award, CheckCircle2, XCircle, Star } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { api } from '../../services/api'

type Tab = 'planos' | 'profissionais' | 'servicos'

function formatBRL(value: number | string) {
  return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('planos')

  const [planos, setPlanos] = useState<any[]>([])
  const [planosLoading, setPlanosLoading] = useState(false)

  const [desempenho, setDesempenho] = useState<any[]>([])
  const [desempenhoLoading, setDesempenhoLoading] = useState(false)

  const [servicos, setServicos] = useState<any[]>([])
  const [servicosLoading, setServicosLoading] = useState(false)

  useEffect(() => {
    setPlanosLoading(true)
    api.get('/planos/distribuicao')
      .then(r => setPlanos(r.data || []))
      .catch(() => setPlanos([]))
      .finally(() => setPlanosLoading(false))
  }, [])

  useEffect(() => {
    setDesempenhoLoading(true)
    api.get('/relatorios/desempenho-profissionais')
      .then(r => setDesempenho(r.data || []))
      .catch(() => setDesempenho([]))
      .finally(() => setDesempenhoLoading(false))
  }, [])

  useEffect(() => {
    setServicosLoading(true)
    api.get('/relatorios/servicos-mais-vendidos')
      .then(r => setServicos(r.data || []))
      .catch(() => setServicos([]))
      .finally(() => setServicosLoading(false))
  }, [])

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'planos', label: 'Planos de Assinatura', icon: Users },
    { id: 'profissionais', label: 'Desempenho Profissionais', icon: Award },
    { id: 'servicos', label: 'Serviços Mais Vendidos', icon: Scissors },
  ]

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1 flex items-center gap-2">
            <BarChart3 size={24} style={{ color: 'var(--brand)' }} />
            Relatórios e Análises
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Visão geral do desempenho da barbearia
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          className="flex border rounded-2xl overflow-hidden mb-6"
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: activeTab === tab.id ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: activeTab === tab.id ? 'var(--brand)' : 'var(--text-secondary)',
                borderColor: activeTab === tab.id ? 'var(--brand)' : 'transparent',
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors border-b-2"
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'planos' && (
          <div className="flex flex-col gap-4">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Distribuição de clientes ativos por plano de assinatura.
            </p>

            {planosLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }} />
              </div>
            ) : planos.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                Os planos serão cadastrados na proxima feature.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planos.map((plano: any) => (
                  <div
                    key={plano.id}
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                    className={`p-6 rounded-2xl border flex flex-col gap-4 ${!plano.ativo ? 'opacity-60 grayscale' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-lg">{plano.nome}</h3>
                        <p className="text-amber-500 font-bold text-xl mt-1">{formatBRL(plano.precoMensal)}<span style={{ color: 'var(--text-muted)' }} className="text-sm font-normal">/mês</span></p>
                      </div>
                      {!plano.ativo && (
                        <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase">Inativo</span>
                      )}
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider mb-1">Clientes Ativos</p>
                        <p style={{ color: 'var(--brand)' }} className="text-3xl font-black">{plano.clientesAtivos}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--text-muted)' }} className="text-xs uppercase font-bold tracking-wider mb-1">Usos/Semana</p>
                        <p style={{ color: 'var(--text-primary)' }} className="text-2xl font-black text-right">{plano.usosPorSemana}×</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profissionais' && (
          <div className="flex flex-col gap-4">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Desempenho geral de cada profissional (todos os períodos).
            </p>

            {desempenhoLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }} />
              </div>
            ) : desempenho.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                Nenhum dado de desempenho disponível.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {desempenho.map((prof: any, idx: number) => {
                  const initials = prof.nomeProfissional?.split(' ').map((p: string) => p[0]).join('').substring(0, 2).toUpperCase() || '??'
                  return (
                    <div
                      key={prof.profissionalId}
                      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                      className="p-5 rounded-2xl border"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-lg">
                            {initials}
                          </div>
                          {idx === 0 && (
                            <Star size={14} className="absolute -top-1 -right-1 text-amber-400 fill-amber-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 style={{ color: 'var(--text-primary)' }} className="font-bold">{prof.nomeProfissional}</h3>
                          {prof.servicoMaisRealizado && (
                            <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                              Serviço destaque: <span style={{ color: 'var(--text-secondary)' }} className="font-medium">{prof.servicoMaisRealizado}</span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p style={{ color: 'var(--brand)' }} className="font-black text-lg">{formatBRL(prof.totalFaturado)}</p>
                          <p style={{ color: 'var(--text-muted)' }} className="text-xs">faturado</p>
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
                        <div>
                          <p style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase font-bold tracking-wider mb-1">Total</p>
                          <p style={{ color: 'var(--text-primary)' }} className="font-black text-lg">{prof.totalAgendamentos}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                            <CheckCircle2 size={10} className="text-green-500" />Concluídos
                          </p>
                          <p className="font-black text-lg text-green-500">{prof.totalConcluidos}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                            <XCircle size={10} className="text-red-500" />Cancelados
                          </p>
                          <p className="font-black text-lg text-red-500">{prof.totalCancelados}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-muted)' }} className="text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-center gap-1">
                            <TrendingUp size={10} className="text-amber-500" />Taxa
                          </p>
                          <p className="font-black text-lg text-amber-500">{prof.taxaConclusao}%</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'servicos' && (
          <div className="flex flex-col gap-4">
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
              Serviços mais realizados em ordem decrescente de atendimentos.
            </p>

            {servicosLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }} />
              </div>
            ) : servicos.length === 0 ? (
              <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                Nenhum serviço realizado ainda.
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }} className="rounded-2xl border overflow-hidden">
                {/* Cabeçalho da tabela */}
                <div
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                  className="grid grid-cols-12 px-4 py-3 border-b text-xs font-bold uppercase tracking-wider"
                >
                  <span style={{ color: 'var(--text-muted)' }} className="col-span-1 text-center">#</span>
                  <span style={{ color: 'var(--text-muted)' }} className="col-span-5">Serviço</span>
                  <span style={{ color: 'var(--text-muted)' }} className="col-span-3 text-center">Atendimentos</span>
                  <span style={{ color: 'var(--text-muted)' }} className="col-span-3 text-right">Faturado</span>
                </div>

                {servicos.map((s: any, idx: number) => {
                  const maxAts = servicos[0]?.totalAgendamentos || 1
                  const barWidth = Math.round((s.totalAgendamentos / maxAts) * 100)
                  return (
                    <div
                      key={s.servicoId}
                      style={{ borderColor: 'var(--border)' }}
                      className="grid grid-cols-12 px-4 py-4 border-b last:border-b-0 items-center gap-2"
                    >
                      <span style={{ color: idx < 3 ? 'var(--brand)' : 'var(--text-muted)' }} className="col-span-1 text-center font-black text-sm">
                        {idx + 1}
                      </span>
                      <div className="col-span-5">
                        <p style={{ color: 'var(--text-primary)' }} className="font-semibold text-sm">{s.nomeServico}</p>
                        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-elevated)' }}>
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${barWidth}%`, backgroundColor: 'var(--brand)' }}
                          />
                        </div>
                      </div>
                      <span style={{ color: 'var(--text-primary)' }} className="col-span-3 text-center font-bold">{s.totalAgendamentos}</span>
                      <span style={{ color: 'var(--brand)' }} className="col-span-3 text-right font-bold">{formatBRL(s.totalFaturado)}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
