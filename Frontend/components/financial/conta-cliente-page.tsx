"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CreditCard,
  Search,
  Download,
  DollarSign,
  AlertCircle,
  CheckCircle2,
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
import { clients, appointments, services } from "@/lib/mock-data"
import { FinancialLayout } from "./financial-layout"

export function ContaClientePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")

  const clientAccounts = useMemo(() => {
    return clients.map((client) => {
      const clientAppointments = appointments.filter(
        (a) => a.clientId === client.id
      )
      const completedAppointments = clientAppointments.filter(
        (a) => a.status === "completed"
      )
      
      const totalSpent = completedAppointments.reduce((sum, a) => {
        const service = services.find((s) => s.id === a.serviceId)
        return sum + (service?.price || 0)
      }, 0)

      // Simulated pending amount (in real app, this would come from database)
      const pendingAmount = Math.random() > 0.7 ? Math.floor(Math.random() * 200) : 0

      return {
        client,
        totalAppointments: completedAppointments.length,
        totalSpent,
        pendingAmount,
        lastVisit: completedAppointments.length > 0
          ? completedAppointments.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0].date
          : null,
      }
    })
  }, [])

  const filteredAccounts = clientAccounts.filter((account) => {
    const matchesSearch =
      account.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.client.phone.includes(searchTerm)
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && account.pendingAmount > 0) ||
      (filter === "clear" && account.pendingAmount === 0)
    return matchesSearch && matchesFilter
  })

  const totals = useMemo(() => {
    return clientAccounts.reduce(
      (acc, item) => ({
        spent: acc.spent + item.totalSpent,
        pending: acc.pending + item.pendingAmount,
      }),
      { spent: 0, pending: 0 }
    )
  }, [clientAccounts])

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })

  return (
    <FinancialLayout>
      <div className="flex flex-col gap-6">
        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Faturado
              </CardTitle>
              <DollarSign className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                R$ {formatCurrency(totals.spent)}
              </div>
              <p className="text-xs text-muted-foreground">
                De {clients.length} clientes
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valores Pendentes
              </CardTitle>
              <AlertCircle className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                R$ {formatCurrency(totals.pending)}
              </div>
              <p className="text-xs text-muted-foreground">
                {clientAccounts.filter((a) => a.pendingAmount > 0).length}{" "}
                clientes com débito
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes em Dia
              </CardTitle>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {clientAccounts.filter((a) => a.pendingAmount === 0).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sem pendências
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Com pendências</SelectItem>
                <SelectItem value="clear">Em dia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="mr-2 size-4" />
            Exportar
          </Button>
        </div>

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Contas de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-center">Atendimentos</TableHead>
                  <TableHead className="text-right">Total Gasto</TableHead>
                  <TableHead className="text-right">Pendente</TableHead>
                  <TableHead>Última Visita</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAccounts.map((account) => (
                    <TableRow key={account.client.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">
                              {account.client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {account.client.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {account.client.phone}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {account.totalAppointments}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {formatCurrency(account.totalSpent)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          account.pendingAmount > 0
                            ? "text-amber-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        R$ {formatCurrency(account.pendingAmount)}
                      </TableCell>
                      <TableCell>
                        {account.lastVisit
                          ? format(new Date(account.lastVisit), "dd/MM/yyyy", {
                              locale: ptBR,
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            account.pendingAmount > 0
                              ? "secondary"
                              : "default"
                          }
                          className={
                            account.pendingAmount > 0
                              ? "bg-amber-500/20 text-amber-500"
                              : ""
                          }
                        >
                          {account.pendingAmount > 0 ? "Pendente" : "Em dia"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {account.pendingAmount > 0 && (
                          <Button variant="outline" size="sm">
                            Receber
                          </Button>
                        )}
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
