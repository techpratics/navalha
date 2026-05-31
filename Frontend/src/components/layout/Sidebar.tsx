import { useState } from 'react'
import { Scissors, Calendar, CalendarPlus, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {
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
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Scissors size={14} className="text-black" />
          </div>
          <div>
            <p style={{ color: 'var(--text-primary)' }} className="text-sm font-bold leading-none">Navalha</p>
            <p style={{ color: 'var(--text-muted)' }} className="text-xs">Cliente</p>
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
          onClick={() => navigate('/client/agendar')}
          style={{
            backgroundColor: location.pathname === '/client/agendar' ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: location.pathname === '/client/agendar' ? 'var(--brand)' : 'var(--text-secondary)',
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors hover:opacity-80"
        >
          <CalendarPlus size={16} />
          <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
            <span className="text-sm font-medium">Agendar</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/client/agendamentos')}
          style={{
            backgroundColor: location.pathname === '/client/agendamentos' ? 'rgba(245,158,11,0.1)' : 'transparent',
            color: location.pathname === '/client/agendamentos' ? 'var(--brand)' : 'var(--text-secondary)',
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors hover:opacity-80"
        >
          <Calendar size={16} />
          <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
            <span className="text-sm font-medium">Agendamentos</span>
            <span className="bg-amber-500 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">3</span>
          </div>
        </button>
      </nav>
    </aside>
  )
}