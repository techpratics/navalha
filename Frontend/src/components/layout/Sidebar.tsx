import { useState } from 'react'
import { Scissors, Calendar, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

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
        <button className="flex items-center justify-center md:justify-start gap-3 px-2 md:px-3 py-2 rounded-lg bg-amber-500/10 text-amber-500 w-full">
          <Calendar size={16} />
          <div className={`items-center justify-between w-full hidden ${collapsed ? '' : 'md:flex'}`}>
            <span className="text-sm font-medium">Agenda</span>
          </div>
        </button>
      </nav>

    </aside>
  )
}