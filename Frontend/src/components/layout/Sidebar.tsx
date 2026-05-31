import { useState } from 'react'
import { Scissors, Calendar, CalendarPlus, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <aside className={`h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300 ${collapsed ? 'w-12 md:w-16' : 'w-12 md:w-52'}`}>

      {/* Topo */}
      <div className="flex items-center justify-between px-2 md:px-4 py-4 border-b border-zinc-800">
        <div className={`items-center gap-2 hidden md:flex ${collapsed ? 'md:hidden' : ''}`}>
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Scissors size={14} className="text-black" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-none">Navalha</p>
            <p className="text-zinc-500 text-xs">Cliente</p>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="text-zinc-400 hover:text-white transition-colors mx-auto md:mx-0"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 px-1 md:px-2 py-4">
        <p className={`text-zinc-500 text-xs px-2 mb-2 hidden ${collapsed ? '' : 'md:block'}`}>
          Menu Principal
        </p>

        <button
          onClick={() => navigate('/client/agendar')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors ${
            location.pathname === '/client/agendar'
              ? 'bg-amber-500/10 text-amber-500'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <CalendarPlus size={16} />
          <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
            <span className="text-sm font-medium">Agendar</span>
          </div>
        </button>

        <button
          onClick={() => navigate('/client/agendamentos')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full transition-colors ${
            location.pathname === '/client/agendamentos'
              ? 'bg-amber-500/10 text-amber-500'
              : 'text-zinc-400 hover:text-white'
          }`}
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