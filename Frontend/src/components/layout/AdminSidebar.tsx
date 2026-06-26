import { useState } from 'react'
import { Scissors, UserPlus, Users, PanelLeftClose, PanelLeftOpen, Briefcase, Calendar, BarChart3, Tag } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { path: '/admin/agenda', label: 'Agenda Geral', icon: Calendar },
    { path: '/admin/agenda-profissionais', label: 'Visão por Equipe', icon: Users },
    { path: '/admin/cadastro-cliente', label: 'Cadastrar Cliente', icon: UserPlus },
    { path: '/admin/clientes', label: 'Clientes', icon: Users },
    { path: '/admin/cadastro-profissional', label: 'Cadastrar Profissional', icon: Briefcase },
    { path: '/admin/profissionais', label: 'Profissionais', icon: Scissors },
    { path: '/admin/servicos', label: 'Serviços', icon: Tag },
    { path: '/admin/relatorios', label: 'Relatórios', icon: BarChart3 },
  ]

  return (
    <aside
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      className={`h-screen border-r flex flex-col transition-all duration-300 ${collapsed ? 'w-12 md:w-16' : 'w-12 md:w-60'}`}
    >
      <div
        style={{ borderColor: 'var(--border)' }}
        className="flex items-center justify-between px-2 md:px-4 py-4 border-b"
      >
        <div className={`items-center gap-2 hidden md:flex ${collapsed ? 'md:hidden' : ''}`}>
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/alabama_logo.jpeg" alt="Alabama Barbers" className="w-full h-full object-cover" />
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)' }} className="text-sm font-bold leading-none">Navalha</p>
            <p style={{ color: 'var(--text-muted)' }} className="text-xs">Administrador</p>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(v => !v)}
          style={{ color: 'var(--text-secondary)' }}
          className="transition-colors mx-auto md:mx-0 hover:opacity-80"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-1 md:px-2 py-4">
        <p style={{ color: 'var(--text-muted)' }} className={`text-xs px-2 mb-2 hidden ${collapsed ? '' : 'md:block'}`}>
          Administração
        </p>

        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              backgroundColor: location.pathname === item.path ? 'rgba(245,158,11,0.1)' : 'transparent',
              color: location.pathname === item.path ? 'var(--brand)' : 'var(--text-secondary)',
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors hover:opacity-80"
          >
            <item.icon size={16} />
            <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            </div>
          </button>
        ))}
      </nav>
    </aside>
  )
}