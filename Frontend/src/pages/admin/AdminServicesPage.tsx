import { useState, useMemo } from 'react'
import { Search, Scissors, Plus, Edit2, X, Check, AlertTriangle, Clock, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useServices, type Servico } from '../../hooks/useServices'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const EMPTY_FORM = { nome: '', preco: '', duracaoMinutos: '' }

export default function AdminServicesPage() {
  const { services, loading, addService, editService, toggleServiceStatus } = useServices()
  const [search, setSearch] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState<Servico | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formLoading, setFormLoading] = useState(false)
  const [confirmingToggle, setConfirmingToggle] = useState<Servico | null>(null)

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = s.nome.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = showInactive ? !s.ativo : s.ativo
      return matchesSearch && matchesStatus
    })
  }, [services, search, showInactive])

  function openCreate() {
    setEditingService(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setShowForm(true)
  }

  function openEdit(service: Servico) {
    setEditingService(service)
    setForm({
      nome: service.nome,
      preco: service.preco.toString().replace('.', ','),
      duracaoMinutos: service.duracaoMinutos.toString(),
    })
    setFormErrors({})
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingService(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
  }

  function validate() {
    const errors: Record<string, string> = {}
    if (!form.nome.trim()) errors.nome = 'Nome é obrigatório'
    const preco = parseFloat(form.preco.replace(',', '.'))
    if (!form.preco || isNaN(preco) || preco <= 0) errors.preco = 'Preço inválido'
    const duracao = parseInt(form.duracaoMinutos)
    if (!form.duracaoMinutos || isNaN(duracao) || duracao <= 0) errors.duracaoMinutos = 'Duração inválida'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setFormLoading(true)
    try {
      const preco = parseFloat(form.preco.replace(',', '.'))
      const duracaoMinutos = parseInt(form.duracaoMinutos)
      if (editingService) {
        await editService(editingService.id, form.nome.trim(), preco, duracaoMinutos)
      } else {
        await addService(form.nome.trim(), preco, duracaoMinutos)
      }
      closeForm()
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.erro || 'Erro ao salvar serviço.'
      alert(msg)
    } finally {
      setFormLoading(false)
    }
  }

  async function handleConfirmToggle() {
    if (!confirmingToggle) return
    try {
      await toggleServiceStatus(confirmingToggle.id)
    } catch {
      alert('Erro ao alterar status do serviço.')
    } finally {
      setConfirmingToggle(null)
    }
  }

  function formatPrice(preco: number) {
    return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Serviços</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Gerencie os serviços oferecidos pela barbearia</p>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <Plus size={18} className="mr-2" />
            Novo Serviço
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="flex-1 w-full">
            <Input
              placeholder="Buscar serviço..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftElement={<Search size={18} style={{ color: 'var(--text-muted)' }} />}
              className="rounded-2xl"
            />
          </div>
          <button
            onClick={() => setShowInactive(!showInactive)}
            style={{
              backgroundColor: showInactive ? 'rgba(239,68,68,0.1)' : 'var(--bg-surface)',
              borderColor: showInactive ? '#ef4444' : 'var(--border)',
              color: showInactive ? '#ef4444' : 'var(--text-secondary)',
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors hover:opacity-80 text-sm font-medium h-[42px] whitespace-nowrap"
          >
            {showInactive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            {showInactive ? 'Ver Ativos' : 'Ver Inativos'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--brand)' }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map(service => (
              <div
                key={service.id}
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                className={`p-5 rounded-2xl border flex flex-col gap-4 hover:border-amber-500/50 transition-colors relative ${!service.ativo ? 'opacity-70 grayscale-[0.4]' : ''}`}
              >
                {!service.ativo && (
                  <div className="absolute top-2 right-2 bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 font-bold uppercase rounded-md">
                    Inativo
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${service.ativo ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                    <Scissors size={20} />
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--text-primary)' }} className="font-bold">{service.nome}</h3>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="rounded-xl p-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{formatPrice(service.preco)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{service.duracaoMinutos} min</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => openEdit(service)}
                  >
                    <Edit2 size={15} className="mr-1.5" />
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
                    className={`flex-1 ${service.ativo ? 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50' : 'hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/50'}`}
                    onClick={() => setConfirmingToggle(service)}
                  >
                    {service.ativo ? (
                      <><ToggleLeft size={15} className="mr-1.5" />Desativar</>
                    ) : (
                      <><ToggleRight size={15} className="mr-1.5" />Reativar</>
                    )}
                  </Button>
                </div>
              </div>
            ))}

            {filteredServices.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center gap-3 text-center">
                <Scissors size={48} style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Nenhum serviço encontrado</p>
                {!showInactive && (
                  <Button variant="primary" onClick={openCreate}>
                    <Plus size={16} className="mr-1.5" />
                    Criar primeiro serviço
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação/Edição */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h2>
              <button onClick={closeForm} style={{ color: 'var(--text-muted)' }}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Nome do Serviço"
                placeholder="Ex: Corte masculino"
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                error={formErrors.nome}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Preço (R$)"
                  placeholder="Ex: 35,00"
                  value={form.preco}
                  onChange={e => setForm(f => ({ ...f, preco: e.target.value }))}
                  error={formErrors.preco}
                  leftElement={<DollarSign size={15} style={{ color: 'var(--text-muted)' }} />}
                />
                <Input
                  label="Duração (min)"
                  placeholder="Ex: 30"
                  value={form.duracaoMinutos}
                  onChange={e => setForm(f => ({ ...f, duracaoMinutos: e.target.value.replace(/\D/g, '') }))}
                  error={formErrors.duracaoMinutos}
                  leftElement={<Clock size={15} style={{ color: 'var(--text-muted)' }} />}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={closeForm} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="flex-1" disabled={formLoading}>
                  <Check size={18} className="mr-2" />
                  {formLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Toggle */}
      {confirmingToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 text-center"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmingToggle.ativo ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2">
              {confirmingToggle.ativo ? 'Desativar Serviço?' : 'Reativar Serviço?'}
            </h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
              {confirmingToggle.ativo
                ? <>O serviço <span className="font-bold">{confirmingToggle.nome}</span> ficará indisponível para novos agendamentos. A ação é <span className="text-green-500 font-semibold">reversível</span>.</>
                : <>O serviço <span className="font-bold">{confirmingToggle.nome}</span> voltará a aparecer para os clientes e profissionais.</>
              }
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setConfirmingToggle(null)} variant="secondary" className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmToggle}
                className={`flex-1 text-white ${confirmingToggle.ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {confirmingToggle.ativo ? 'Sim, Desativar' : 'Sim, Reativar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
