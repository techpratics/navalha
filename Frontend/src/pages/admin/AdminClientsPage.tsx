import { useState, useMemo } from 'react'
import { Search, User, Phone, Mail, Calendar, Edit2, X, Check, TrendingUp, UserX, UserCheck, AlertTriangle } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useClients } from '../../hooks/useClients'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { Client } from '../../types/client'

export default function AdminClientsPage() {
  const { clients, updateClient, toggleClientStatus } = useClients()
  const [search, setSearch] = useState('')
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [sortByFrequent, setSortByFrequent] = useState(false)
  const [confirmingDeactivation, setConfirmingDeactivation] = useState<Client | null>(null)

  const filteredClients = useMemo(() => {
    let result = clients.filter(client => 
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search) ||
      client.cpf.includes(search)
    )

    if (sortByFrequent) {
      result = [...result].sort((a, b) => b.totalAppointments - a.totalAppointments)
    }

    return result
  }, [clients, search, sortByFrequent])

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault()
    if (editingClient) {
      updateClient(editingClient.id, editingClient)
      setEditingClient(null)
    }
  }

  function handleConfirmToggle() {
    if (confirmingDeactivation) {
      toggleClientStatus(confirmingDeactivation.id)
      setConfirmingDeactivation(null)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Gestão de Clientes</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Visualize, busque e edite informações dos clientes</p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Barra de Busca e Filtros */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input
                placeholder="Buscar por nome, telefone ou CPF..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftElement={<Search size={18} style={{ color: 'var(--text-muted)' }} />}
                className="rounded-2xl"
              />
            </div>
            <button
              onClick={() => setSortByFrequent(!sortByFrequent)}
              style={{ 
                backgroundColor: sortByFrequent ? 'rgba(245,158,11,0.1)' : 'var(--bg-surface)',
                borderColor: sortByFrequent ? 'var(--brand)' : 'var(--border)',
                color: sortByFrequent ? 'var(--brand)' : 'var(--text-secondary)'
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors hover:opacity-80 text-sm font-medium h-[42px] whitespace-nowrap"
            >
              <TrendingUp size={16} />
              Mais Frequentes
            </button>
          </div>

          {/* Lista de Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map(client => (
              <div
                key={client.id}
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                className={`p-5 rounded-2xl border flex flex-col gap-4 hover:border-amber-500/50 transition-colors group relative ${!client.isActive ? 'opacity-70 grayscale-[0.5]' : ''}`}
              >
                {!client.isActive && (
                  <div className="absolute top-2 right-2 bg-red-500/10 text-red-500 text-[10px] px-2 py-0.5 font-bold uppercase rounded-md">
                    Inativo
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${client.isActive ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                      {client.initials}
                    </div>
                    <div className="flex-1">
                      <h3 style={{ color: 'var(--text-primary)' }} className="font-bold">{client.name}</h3>
                      <p style={{ color: 'var(--text-muted)' }} className="text-xs">{client.cpf}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingClient(client)}
                      style={{ color: 'var(--text-muted)' }}
                      className="p-2 hover:text-amber-500 transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => client.isActive ? setConfirmingDeactivation(client) : toggleClientStatus(client.id)}
                      style={{ color: client.isActive ? 'var(--text-muted)' : 'var(--brand)' }}
                      className={`p-2 transition-colors ${client.isActive ? 'hover:text-red-500' : 'hover:opacity-80'}`}
                      title={client.isActive ? 'Desativar' : 'Reativar'}
                    >
                      {client.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                  </div>
                </div>

                <div 
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                  className="rounded-xl p-3 grid grid-cols-1 gap-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }} className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{client.totalAppointments} atendimentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Última visita: {new Date(client.lastVisit).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredClients.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center gap-3 text-center">
                <User size={48} style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="w-full max-w-lg rounded-2xl border shadow-2xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold">Editar Cliente</h2>
              <button 
                onClick={() => setEditingClient(null)}
                style={{ color: 'var(--text-muted)' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <Input
                label="Nome do Cliente"
                value={editingClient.name}
                onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="CPF"
                  value={editingClient.cpf}
                  onChange={e => setEditingClient({ ...editingClient, cpf: e.target.value })}
                />
                <Input
                  label="Telefone"
                  value={editingClient.phone}
                  onChange={e => setEditingClient({ ...editingClient, phone: e.target.value })}
                />
              </div>
              <Input
                label="E-mail"
                type="email"
                value={editingClient.email}
                onChange={e => setEditingClient({ ...editingClient, email: e.target.value })}
              />

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={() => setEditingClient(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  variant="primary" 
                  className="flex-1"
                >
                  <Check size={18} className="mr-2" />
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Desativação */}
      {confirmingDeactivation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2">Tem certeza?</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
              Você está prestes a desativar o cliente <span className="font-bold">{confirmingDeactivation.name}</span>. 
              Esta ação apenas ocultará o cliente de algumas listas, mas é <span className="text-green-500 font-semibold">totalmente reversível</span> a qualquer momento.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => setConfirmingDeactivation(null)}
                variant="secondary" 
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmToggle}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                Sim, Desativar
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
