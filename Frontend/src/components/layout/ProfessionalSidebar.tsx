import { useState } from 'react'
import { Calendar, PanelLeftClose, PanelLeftOpen, Users } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ProfessionalSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      className={`h-screen border-r flex flex-col transition-all duration-300 ${collapsed ? 'w-12 md:w-16' : 'w-12 md:w-52'}`}
    >
      {/* Topo */}
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
            <p style={{ color: 'var(--text-muted)' }} className="text-xs">Profissional</p>
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

      {/* Menu */}
      <nav className="flex flex-col gap-1 px-1 md:px-2 py-4">
        <p style={{ color: 'var(--text-muted)' }} className={`text-xs px-2 mb-2 hidden ${collapsed ? '' : 'md:block'}`}>
          Menu Principal
        </p>

        <button
          onClick={() => navigate('/professional/agenda')}
          style={{
            backgroundColor: location.pathname === '/professional/agenda' ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: location.pathname === '/professional/agenda' ? 'var(--brand)' : 'var(--text-secondary)',
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors hover:opacity-80"
        >
          <Calendar size={16} />
          <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
            <span className="text-sm font-medium">Minha Agenda</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/professional/disponibilidade')}
          style={{
            backgroundColor: location.pathname === '/professional/disponibilidade' ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: location.pathname === '/professional/disponibilidade' ? 'var(--brand)' : 'var(--text-secondary)',
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors hover:opacity-80"
        >
          <Calendar size={16} />
          <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
            <span className="text-sm font-medium">Disponibilidade</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/professional/clientes')}
          style={{
            backgroundColor: location.pathname === '/professional/clientes' ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: location.pathname === '/professional/clientes' ? 'var(--brand)' : 'var(--text-secondary)',
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors hover:opacity-80"
        >
          <Users size={16} />
          <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
            <span className="text-sm font-medium">Clientes</span>
          </div>
        </button>
      </nav>
    </aside>
  )
}
