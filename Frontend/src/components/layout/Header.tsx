import { Bell, Moon, RefreshCw } from 'lucide-react'

interface HeaderProps {
  userName?: string
}

export default function Header({ userName = 'João' }: HeaderProps) {
  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 md:px-6">

      {/* Busca — só no desktop */}
      <div className="hidden md:flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 w-64">
        <span className="text-zinc-400 text-sm">Buscar...</span>
      </div>

      {/* Espaço vazio no mobile pra empurrar ações pra direita */}
      <div className="md:hidden" />

      {/* Ações */}
      <div className="flex items-center gap-3">
        <button className="hidden md:block text-zinc-400 hover:text-white transition-colors">
          <RefreshCw size={18} />
        </button>
        <button className="text-zinc-400 hover:text-white transition-colors relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <button className="text-zinc-400 hover:text-white transition-colors">
          <Moon size={18} />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">
              {userName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="hidden sm:block text-white text-sm">{userName}</span>
        </div>
      </div>

    </header>
  )
}