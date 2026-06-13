import { useState, useMemo } from 'react'
import { Search, Scissors, Phone, Mail, UserX, UserCheck, Filter, AlertTriangle, Settings } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { useProfessionals } from '../../hooks/useProfessionals'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import type { Professional } from '../../types/professional'
import ProfessionalServicesModal from '../../components/professionals/ProfessionalServicesModal'

export default function AdminProfessionalsPage() {
  const { professionals, toggleProfessionalStatus } = useProfessionals()
  const [search, setSearch] = useState('')
  const [showDeactivated, setShowDeactivated] = useState(false)
  const [confirmingStatus, setConfirmingStatus] = useState<Professional | null>(null)
  const [servicesModalProf, setServicesModalProf] = useState<Professional | null>(null)

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(prof => {
      const matchesSearch = 
        prof.name.toLowerCase().includes(search.toLowerCase()) ||
        prof.specialty.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = showDeactivated ? !prof.isActive : prof.isActive
      
      return matchesSearch && matchesStatus
    })
  }, [professionals, search, showDeactivated])

  function handleConfirmToggle() {
    if (confirmingStatus) {
      toggleProfessionalStatus(confirmingStatus.id)
      setConfirmingStatus(null)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Equipe de Profissionais</h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Gerencie os colaboradores da sua barbearia</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="w-full md:w-64">
              <Input
                placeholder="Nome ou especialidade..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftElement={<Search size={18} style={{ color: 'var(--text-muted)' }} />}
                className="rounded-2xl"
              />
            </div>
            <button
              onClick={() => setShowDeactivated(!showDeactivated)}
              style={{ 
                backgroundColor: showDeactivated ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-surface)',
                borderColor: showDeactivated ? '#ef4444' : 'var(--border)',
                color: showDeactivated ? '#ef4444' : 'var(--text-secondary)'
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors hover:opacity-80 text-sm font-medium h-[42px]"
            >
              <Filter size={16} />
              {showDeactivated ? 'Ver Ativos' : 'Ver Inativos'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfessionals.map(prof => (
            <div
              key={prof.id}
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              className={`p-6 rounded-3xl border flex flex-col gap-5 transition-all relative overflow-hidden group ${!prof.isActive ? 'opacity-75 grayscale' : ''}`}
            >
              {!prof.isActive && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-3 py-1 font-bold uppercase tracking-widest rounded-bl-xl">
                  Inativo
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl ${prof.isActive ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {prof.initials}
                </div>
                <div>
                  <h3 style={{ color: 'var(--text-primary)' }} className="font-bold text-lg">{prof.name}</h3>
                  <p className="text-xs font-medium text-amber-500 uppercase tracking-wider">{prof.specialty}</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-elevated)' }} className="rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }} className="truncate">{prof.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{prof.phone}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <Button 
                  onClick={() => setServicesModalProf(prof)}
                  variant="secondary"
                  className="flex-1"
                  disabled={!prof.isActive}
                >
                  <Settings size={18} className="mr-2" />
                  Serviços
                </Button>

                <Button 
                  onClick={() => prof.isActive ? setConfirmingStatus(prof) : toggleProfessionalStatus(prof.id)}
                  variant={prof.isActive ? 'secondary' : 'primary'} 
                  className={`flex-1 ${prof.isActive ? 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50' : ''}`}
                >
                  {prof.isActive ? (
                    <>
                      <UserX size={18} className="mr-2" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <UserCheck size={18} className="mr-2" />
                      Reativar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {filteredProfessionals.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center text-center">
              <Scissors size={48} style={{ color: 'var(--text-muted)' }} className="mb-4" />
              <p style={{ color: 'var(--text-primary)' }} className="font-bold text-lg">Nenhum profissional encontrado</p>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm">Tente mudar o filtro ou a busca.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {confirmingStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
            className="w-full max-w-md rounded-2xl border shadow-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2">Confirmar Desativação</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
              Você deseja desativar o profissional <span className="font-bold">{confirmingStatus.name}</span>? 
              Ele não poderá mais ser selecionado para novos agendamentos, mas seus dados permanecerão salvos e a ação pode ser <span className="text-green-500 font-semibold">revertida</span>.
            </p>
            <div className="flex gap-3">
              <Button 
                onClick={() => setConfirmingStatus(null)}
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
      {/*Modal de Vínculo de Serviços */}
      <ProfessionalServicesModal 
        professional={servicesModalProf}
        isOpen={!!servicesModalProf}
        onClose={() => setServicesModalProf(null)}
      />
    </AdminLayout>
  )
}
