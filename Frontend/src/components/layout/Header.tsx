import { Bell, Moon, Sun, RefreshCw } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

interface HeaderProps {
  userName?: string
}

export default function Header({ userName = 'João' }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      className="h-14 border-b flex items-center justify-between px-4 md:px-6"
    >
      <div
        style={{ backgroundColor: 'var(--bg-elevated)' }}
        className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2 w-64"
      >
        <span style={{ color: 'var(--text-muted)' }} className="text-sm">Buscar...</span>
      </div>

      <div className="md:hidden" />

      <div className="flex items-center gap-3">
        <button style={{ color: 'var(--text-secondary)' }} className="hidden md:block transition-colors hover:opacity-80">
          <RefreshCw size={18} />
        </button>
        <button style={{ color: 'var(--text-secondary)' }} className="transition-colors hover:opacity-80 relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
        </button>
        <button
          onClick={toggleTheme}
          style={{ color: 'var(--text-secondary)' }}
          className="transition-colors hover:opacity-80"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
            <span className="text-black text-xs font-bold">
              {userName.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span style={{ color: 'var(--text-primary)' }} className="hidden sm:block text-sm">{userName}</span>
        </div>
      </div>
    </header>
  )
}