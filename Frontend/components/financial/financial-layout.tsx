"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Wallet,
  History,
  ArrowLeftRight,
  Percent,
  CreditCard,
  Boxes,
  TrendingUp,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const financialNav = [
  { title: "Caixa", href: "/financeiro", icon: Wallet },
  { title: "Histórico de Caixa", href: "/financeiro/historico", icon: History },
  { title: "Entrada / Saída", href: "/financeiro/movimentacoes", icon: ArrowLeftRight },
  { title: "Comissões", href: "/financeiro/comissoes", icon: Percent },
  { title: "Conta do Cliente", href: "/financeiro/conta-cliente", icon: CreditCard },
  { title: "Estoque", href: "/financeiro/estoque", icon: Boxes },
  { title: "Fluxo de Caixa", href: "/financeiro/fluxo-caixa", icon: TrendingUp },
  { title: "Conta do Profissional", href: "/financeiro/conta-profissional", icon: UserCheck },
]

interface FinancialLayoutProps {
  children: ReactNode
}

export function FinancialLayout({ children }: FinancialLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financeiro</h1>
        <p className="text-muted-foreground">
          Gestão financeira completa do seu estabelecimento
        </p>
      </div>

      <nav className="flex gap-2 overflow-x-auto pb-2">
        {financialNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {children}
    </div>
  )
}
