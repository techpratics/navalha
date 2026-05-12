'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth, UserRole } from '@/lib/auth-context'
import {
  CalendarDays,
  Users,
  UserCircle,
  Scissors,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  ChevronDown,
  Sparkles,
  Wallet,
  History,
  ArrowLeftRight,
  Percent,
  CreditCard,
  Boxes,
  TrendingUp,
  UserCheck,
  Crown,
  Clock,
  LucideIcon,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface NavItem {
  title: string
  icon: LucideIcon
  href: string
  badge?: number
  roles: UserRole[] // Which roles can see this item
  items?: {
    title: string
    href: string
    icon?: LucideIcon
  }[]
}

// Navigation items with role-based access
const navigation: NavItem[] = [
  {
    title: 'Agenda',
    icon: CalendarDays,
    href: '/',
    badge: 8,
    roles: ['admin', 'professional', 'client'],
  },
  {
    title: 'Clientes',
    icon: Users,
    href: '/clientes',
    roles: ['admin', 'professional'],
  },
  {
    title: 'Profissionais',
    icon: UserCircle,
    href: '/profissionais',
    roles: ['admin'],
  },
  {
    title: 'Meus Horarios',
    icon: Clock,
    href: '/meus-horarios',
    roles: ['professional'],
  },
  {
    title: 'Servicos',
    icon: Scissors,
    href: '/servicos',
    roles: ['admin'],
  },
  {
    title: 'Produtos',
    icon: Package,
    href: '/produtos',
    roles: ['admin'],
  },
  {
    title: 'Assinaturas',
    icon: Crown,
    href: '/assinaturas',
    roles: ['admin'],
  },
  {
    title: 'Financeiro',
    icon: DollarSign,
    href: '/financeiro',
    roles: ['admin'],
    items: [
      { title: 'Caixa', href: '/financeiro', icon: Wallet },
      { title: 'Historico de Caixa', href: '/financeiro/historico', icon: History },
      { title: 'Entrada / Saida', href: '/financeiro/movimentacoes', icon: ArrowLeftRight },
      { title: 'Comissoes', href: '/financeiro/comissoes', icon: Percent },
      { title: 'Conta do Cliente', href: '/financeiro/conta-cliente', icon: CreditCard },
      { title: 'Estoque', href: '/financeiro/estoque', icon: Boxes },
      { title: 'Fluxo de Caixa', href: '/financeiro/fluxo-caixa', icon: TrendingUp },
      { title: 'Conta do Profissional', href: '/financeiro/conta-profissional', icon: UserCheck },
    ],
  },
  {
    title: 'Relatorios',
    icon: BarChart3,
    href: '/relatorios',
    roles: ['admin'],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Filter navigation based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!user) return false
    return item.roles.includes(user.role)
  })

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-sidebar-foreground">Navalha</span>
            <span className="text-xs text-sidebar-foreground/60">
              {user?.role === 'admin' && 'Administrador'}
              {user?.role === 'professional' && 'Profissional'}
              {user?.role === 'client' && 'Cliente'}
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                if (item.items) {
                  return (
                    <Collapsible key={item.title} asChild defaultOpen={pathname.startsWith(item.href)}>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.href}>
                                  <Link href={subItem.href}>
                                    {subItem.icon && <subItem.icon className="size-3.5" />}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-sidebar-primary text-[10px] font-medium text-sidebar-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {user?.role === 'admin' && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Configuracoes" isActive={pathname === '/configuracoes'}>
                <Link href="/configuracoes">
                  <Settings className="size-4" />
                  <span>Configuracoes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
