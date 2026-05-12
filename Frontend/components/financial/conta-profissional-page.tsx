"use client"

import { useState, useMemo } from "react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  UserCheck,
  Search,
  Download,
  DollarSign,
  Percent,
  CalendarIcon,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { professionals, services, appointments } from "@/lib/mock-data"
import { FinancialLayout } from "./financial-layout"

export function ContaProfissionalPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  )

  const professionalAccounts = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number)
    const start = startOfMonth(new Date(year, month - 1))
    const end = endOfMonth(new Date(year, month - 1))

    return professionals
      .filter((p) => p.status === "active")
      .map((professional) => {
        const profAppointments = appointments.filter(
          (a) =>
            a.professionalId === professional.id &&
            a.status === "completed" &&
            new Date(a.date) >= start &&
            new Date(a.date) <= end
        )

        const serviceTotal = profAppointments.reduce((sum, a) => {
          const service = services.find((s) => s.id === a.serviceId)
          return sum + (service?.price || 0)
        }, 0)

        const commissionRate = professional.commission || 50
        const commissionEarned = (serviceTotal * commissionRate) / 100
        
        // Simulated advances and paid amounts
        const advances = Math.random() > 0.7 ? Math.floor(Math.random() * 300) : 0
        const paid = Math.random() > 0.5 ? commissionEarned * 0.5 : 0
        const balance = commissionEarned - advances - paid

        return {
          professional,
          serviceCount: profAppointments.length,
          serviceTotal,
          commissionRate,
          commissionEarned,
          advances,
          paid,
          balance,
        }
      })
  }, [selectedMonth])

  const filteredAccounts = professionalAccounts.filter((account) =>
    account.professional.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totals = useMemo(() => {
    return professionalAccounts.reduce(
      (acc, item) => ({
        services: acc.services + item.serviceTotal,
        commission: acc.commission + item.commissionEarned,
        advances: acc.advances + item.advances,
        paid: acc.paid + item.paid,
        balance: acc.balance + item.balance,
      }),
      { services: 0, commission: 0, advances: 0, paid: 0, balance: 0 }
    )
  }, [professionalAccounts])

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(new Date().getFullYear(), i, 1)
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy", { locale: ptBR }),
    }
  })

  return (
    <FinancialLayout>
      <div className="flex flex-col gap-6">
        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar profissional..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <CalendarIcon className="mr-2 size-4" />
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total em Serviços
              </CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {formatCurrency(totals.services)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Comissões
              </CardTitle>
              <Percent className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                R$ {formatCurrency(totals.commission)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Adiantamentos
              </CardTitle>
              <Wallet className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                R$ {formatCurrency(totals.advances)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo a Pagar</CardTitle>
              <UserCheck className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                R$ {formatCurrency(totals.balance)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="size-5" />
              Conta dos Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead className="text-center">Atendimentos</TableHead>
                  <TableHead className="text-right">Total Serviços</TableHead>
                  <TableHead className="text-center">Taxa</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                  <TableHead className="text-right">Adiantamentos</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Nenhum profissional encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.professional.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">
                              {account.professional.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {account.professional.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {account.professional.role}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {account.serviceCount}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {formatCurrency(account.serviceTotal)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {account.commissionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-emerald-500">
                        R$ {formatCurrency(account.commissionEarned)}
                      </TableCell>
                      <TableCell className="text-right text-amber-500">
                        {account.advances > 0 ? (
                          <>R$ {formatCurrency(account.advances)}</>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-500">
                        R$ {formatCurrency(account.balance)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Adiantar
                          </Button>
                          <Button size="sm">Pagar</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </FinancialLayout>
  )
}
