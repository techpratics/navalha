import { useState, useRef, useEffect } from 'react'
import { Bell, Moon, Sun, RefreshCw, LogOut, ChevronDown } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useLogin } from '../../hooks/useLogin'

interface HeaderProps {
  userName?: string
}

export default function Header({ userName = 'Carlos Silva' }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme()
  const { logout } = useLogin()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      className="h-14 border-b flex items-center justify-between px-4 md:px-6 relative z-40"
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
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-black text-xs font-bold">
                {userName.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <span style={{ color: 'var(--text-primary)' }} className="hidden sm:block text-sm font-medium">{userName}</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
              className="absolute right-0 mt-2 w-48 rounded-xl border shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                onClick={logout}
                style={{ color: 'var(--text-secondary)' }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm hover:bg-red-500/10 hover:text-red-500 transition-colors"
              >
                <LogOut size={16} />
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
