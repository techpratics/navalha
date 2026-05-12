"use client"

import { useState, useMemo } from "react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Percent,
  Download,
  Calculator,
  DollarSign,
  User,
  CalendarIcon,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { professionals, services, appointments } from "@/lib/mock-data"
import { FinancialLayout } from "./financial-layout"

export function ComissoesPage() {
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM")
  )
  const [selectedProfessional, setSelectedProfessional] = useState("all")

  const commissionData = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number)
    const start = startOfMonth(new Date(year, month - 1))
    const end = endOfMonth(new Date(year, month - 1))

    return professionals
      .filter((p) => p.status === "active")
      .filter(
        (p) => selectedProfessional === "all" || p.id === selectedProfessional
      )
      .map((professional) => {
        const profAppointments = appointments.filter(
          (a) =>
            a.professionalId === professional.id &&
            a.status === "completed" &&
            new Date(a.date) >= start &&
            new Date(a.date) <= end
        )

        const serviceDetails = profAppointments.map((a) => {
          const service = services.find((s) => s.id === a.serviceId)
          return {
            ...a,
            serviceName: service?.name || "Serviço",
            servicePrice: service?.price || 0,
          }
        })

        const totalServices = serviceDetails.reduce(
          (sum, s) => sum + s.servicePrice,
          0
        )
        const commissionRate = professional.commission || 50
        const totalCommission = (totalServices * commissionRate) / 100

        return {
          professional,
          serviceCount: profAppointments.length,
          totalServices,
          commissionRate,
          totalCommission,
          serviceDetails,
          status: "pending" as const,
        }
      })
  }, [selectedMonth, selectedProfessional])

  const totals = useMemo(() => {
    return commissionData.reduce(
      (acc, item) => ({
        services: acc.services + item.serviceCount,
        total: acc.total + item.totalServices,
        commission: acc.commission + item.totalCommission,
      }),
      { services: 0, total: 0, commission: 0 }
    )
  }, [commissionData])

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
            <Select
              value={selectedProfessional}
              onValueChange={setSelectedProfessional}
            >
              <SelectTrigger className="w-[200px]">
                <User className="mr-2 size-4" />
                <SelectValue placeholder="Profissional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os profissionais</SelectItem>
                {professionals
                  .filter((p) => p.status === "active")
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Calculator className="mr-2 size-4" />
              Calcular
            </Button>
            <Button variant="outline">
              <Download className="mr-2 size-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total em Serviços
              </CardTitle>
              <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {formatCurrency(totals.total)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totals.services} serviços realizados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Comissões
              </CardTitle>
              <Percent className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                R$ {formatCurrency(totals.commission)}
              </div>
              <p className="text-xs text-muted-foreground">A pagar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lucro Líquido
              </CardTitle>
              <DollarSign className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                R$ {formatCurrency(totals.total - totals.commission)}
              </div>
              <p className="text-xs text-muted-foreground">
                Após comissões
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Comissões */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="size-5" />
              Comissões por Profissional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profissional</TableHead>
                  <TableHead className="text-center">Serviços</TableHead>
                  <TableHead className="text-right">Total Serviços</TableHead>
                  <TableHead className="text-center">Taxa</TableHead>
                  <TableHead className="text-right">Comissão</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissionData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum dado encontrado para o período.
                    </TableCell>
                  </TableRow>
                ) : (
                  commissionData.map((item) => (
                    <TableRow key={item.professional.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">
                              {item.professional.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {item.professional.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.professional.role}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.serviceCount}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {formatCurrency(item.totalServices)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">
                          {item.commissionRate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-emerald-500">
                        R$ {formatCurrency(item.totalCommission)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.status === "pending"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {item.status === "pending" ? "Pendente" : "Pago"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Pagar
                        </Button>
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
