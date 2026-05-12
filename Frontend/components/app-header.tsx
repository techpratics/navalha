'use client'

import * as React from 'react'
import { Bell, ChevronDown, RefreshCw, Search, Sun, Moon, Palette, Monitor, LogOut, User, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { useSidebarColor, sidebarColors, SidebarColor } from '@/components/theme-provider'
import { useAuth } from '@/lib/auth-context'

export function AppHeader() {
  const { theme, setTheme } = useTheme()
  const { sidebarColor, setSidebarColor } = useSidebarColor()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getUserInitials = () => {
    if (!user) return 'U'
    return user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  }

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'Administrador',
      professional: 'Profissional',
      receptionist: 'Recepcionista',
    }
    return roles[role] || role
  }

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-card px-2 md:gap-4 md:px-4 lg:px-6">
      <SidebarTrigger className="-ml-1 md:-ml-2" />
      
      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden w-48 md:block md:w-64">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="h-9 pl-8"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="size-8 md:size-9">
          <RefreshCw className="size-4" />
          <span className="sr-only">Atualizar</span>
        </Button>

        <Button variant="ghost" size="icon" className="relative size-8 md:size-9">
          <Bell className="size-4" />
          <span className="absolute right-1 top-1 size-2 rounded-full bg-destructive" />
          <span className="sr-only">Notificacoes</span>
        </Button>

        {/* Theme Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 md:size-9">
              {mounted && theme === 'dark' ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tema</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 size-4" />
              Claro
              {mounted && theme === 'light' && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 size-4" />
              Escuro
              {mounted && theme === 'dark' && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Monitor className="mr-2 size-4" />
              Sistema
              {mounted && theme === 'system' && <span className="ml-auto text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 size-4" />
                Cor da Barra Lateral
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                {(Object.keys(sidebarColors) as SidebarColor[]).map((colorKey) => (
                  <DropdownMenuItem
                    key={colorKey}
                    onClick={() => setSidebarColor(colorKey)}
                    className="cursor-pointer"
                  >
                    <span
                      className="mr-2 size-4 shrink-0 rounded-sm border"
                      style={{ backgroundColor: sidebarColors[colorKey].bg }}
                    />
                    {sidebarColors[colorKey].label}
                    {mounted && sidebarColor === colorKey && <span className="ml-auto text-primary">✓</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-1 px-1 md:h-9 md:gap-2 md:px-2">
              <Avatar className="size-6 md:size-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px] md:text-xs">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline-block">
                {user?.name.split(' ')[0] || 'Usuario'}
              </span>
              <ChevronDown className="size-3 text-muted-foreground md:size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">{user?.role ? getRoleName(user.role) : ''}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 size-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 size-4" />
              Configuracoes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 size-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
