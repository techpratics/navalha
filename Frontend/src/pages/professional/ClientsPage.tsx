import { useState, useMemo } from 'react'
import { Search, User, Phone, Mail, Calendar, TrendingUp } from 'lucide-react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout'
import { useClients } from '../../hooks/useClients'
import Input from '../../components/ui/Input'

export default function ClientsPage() {
  const { clients } = useClients()
  const [search, setSearch] = useState('')
  const [filterFrequent, setFilterFrequent] = useState(false)

  const filteredClients = useMemo(() => {
    return clients
      .filter(client => {
        const matchesSearch = 
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.phone.includes(search)
        
        const isFrequent = !filterFrequent || client.totalAppointments >= 10
        
        return matchesSearch && isFrequent
      })
      .sort((a, b) => b.totalAppointments - a.totalAppointments)
  }, [clients, search, filterFrequent])

  return (
    <ProfessionalLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Clientes</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Gerencie e busque sua base de clientes
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Barra de Busca e Filtros */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftElement={<Search size={18} style={{ color: 'var(--text-muted)' }} />}
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Lista de Clientes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map(client => (
              <div
                key={client.id}
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
                className="p-5 rounded-2xl border flex flex-col gap-4 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                    {client.initials}
                  </div>
                  <div className="flex-1">
                    <h3 style={{ color: 'var(--text-primary)' }} className="font-bold">{client.name}</h3>
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
                    <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>Última visita: {new Date(client.lastVisit).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredClients.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center gap-3">
                <User size={48} style={{ color: 'var(--text-muted)' }} />
                <p style={{ color: 'var(--text-secondary)' }}>Nenhum cliente encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  )
}
