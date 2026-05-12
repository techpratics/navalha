"use client"

import { useState } from "react"
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Download,
  FileText,
  Scissors,
  Package,
} from "lucide-react"
import { format, subDays, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  appointments,
  professionals,
  services,
  clients,
  financialEntries,
  products,
} from "@/lib/mock-data"

export function ReportsPage() {
  const [period, setPeriod] = useState("month")

  const getDateRange = () => {
    const now = new Date()
    switch (period) {
      case "week":
        return { start: subDays(now, 7), end: now }
      case "month":
        return { start: subMonths(now, 1), end: now }
      case "quarter":
        return { start: subMonths(now, 3), end: now }
      case "year":
        return { start: subMonths(now, 12), end: now }
      default:
        return { start: subMonths(now, 1), end: now }
    }
  }

  const { start, end } = getDateRange()

  // Calculate statistics
  const filteredAppointments = appointments.filter((a) => {
    const date = new Date(a.date)
    return date >= start && date <= end
  })

  const completedAppointments = filteredAppointments.filter(
    (a) => a.status === "completed"
  )

  const totalRevenue = financialEntries
    .filter((t) => {
      const date = new Date(t.date)
      return date >= start && date <= end && t.type === "income"
    })
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = financialEntries
    .filter((t) => {
      const date = new Date(t.date)
      return date >= start && date <= end && t.type === "expense"
    })
    .reduce((sum, t) => sum + t.amount, 0)

  // Professional performance
  const professionalStats = professionals.map((prof) => {
    const appointments = completedAppointments.filter(
      (a) => a.professionalId === prof.id
    )
    const revenue = appointments.reduce((sum, a) => {
      const service = services.find((s) => s.id === a.serviceId)
      return sum + (service?.price || 0)
    }, 0)
    return {
      ...prof,
      appointments: appointments.length,
      revenue,
      averageTicket:
        appointments.length > 0 ? revenue / appointments.length : 0,
    }
  })

  // Service performance
  const serviceStats = services.map((service) => {
    const appointments = completedAppointments.filter(
      (a) => a.serviceId === service.id
    )
    const revenue = appointments.length * service.price
    return {
      ...service,
      count: appointments.length,
      revenue,
    }
  })

  // Top clients
  const clientStats = clients.map((client) => {
    const appointments = completedAppointments.filter(
      (a) => a.clientId === client.id
    )
    const totalSpent = appointments.reduce((sum, a) => {
      const service = services.find((s) => s.id === a.serviceId)
      return sum + (service?.price || 0)
    }, 0)
    return {
      ...client,
      visits: appointments.length,
      totalSpent,
    }
  })

  const lowStockProducts = products.filter(
    (p) => p.stockQuantity <= p.minStock
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise de desempenho e indicadores do negócio
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Último mês</SelectItem>
              <SelectItem value="quarter">Último trimestre</SelectItem>
              <SelectItem value="year">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Atendimentos
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedAppointments.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {period === "month" ? "No último mês" : "No período selecionado"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">
              R${" "}
              {totalRevenue.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Ticket médio: R${" "}
              {(
                totalRevenue / (completedAppointments.length || 1)
              ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              R${" "}
              {totalExpenses.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Lucro: R${" "}
              {(totalRevenue - totalExpenses).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                new Set(completedAppointments.map((a) => a.clientId)).size
              }
            </div>
            <p className="text-xs text-muted-foreground">
              De {clients.length} clientes cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="professionals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="professionals">
            <Users className="mr-2 h-4 w-4" />
            Profissionais
          </TabsTrigger>
          <TabsTrigger value="services">
            <Scissors className="mr-2 h-4 w-4" />
            Serviços
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Users className="mr-2 h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Package className="mr-2 h-4 w-4" />
            Estoque
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professionals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Profissional</TableHead>
                    <TableHead className="text-center">Atendimentos</TableHead>
                    <TableHead className="text-right">Receita</TableHead>
                    <TableHead className="text-right">Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {professionalStats
                    .sort((a, b) => b.revenue - a.revenue)
                    .map((prof) => (
                      <TableRow key={prof.id}>
                        <TableCell>
                          <div className="font-medium">{prof.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {prof.specialty}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {prof.appointments}
                        </TableCell>
                        <TableCell className="text-right">
                          R${" "}
                          {prof.revenue.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          R${" "}
                          {prof.averageTicket.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-right">Receita Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceStats
                    .sort((a, b) => b.count - a.count)
                    .map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-muted-foreground">
                            R${" "}
                            {service.price.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}{" "}
                            / {service.duration}min
                          </div>
                        </TableCell>
                        <TableCell>{service.category}</TableCell>
                        <TableCell className="text-center">
                          {service.count}
                        </TableCell>
                        <TableCell className="text-right">
                          R${" "}
                          {service.revenue.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Melhores Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-center">Visitas</TableHead>
                    <TableHead className="text-right">Total Gasto</TableHead>
                    <TableHead className="text-right">Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientStats
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 10)
                    .map((client) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {client.visits}
                        </TableCell>
                        <TableCell className="text-right">
                          R${" "}
                          {client.totalSpent.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          R${" "}
                          {(
                            client.totalSpent / (client.visits || 1)
                          ).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Produtos com Estoque Baixo</CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Nenhum produto com estoque baixo
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {product.sku}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`font-medium ${
                              product.stockQuantity === 0
                                ? "text-red-500"
                                : "text-amber-500"
                            }`}
                          >
                            {product.stockQuantity} un
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Mín: {product.minStock}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Valor do Estoque por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Pomadas e Ceras", "Shampoos", "Condicionadores", "Óleos"].map(
                    (category) => {
                      const categoryProducts = products.filter(
                        (p) => p.categoryId === category.toLowerCase()
                      )
                      const value = categoryProducts.reduce(
                        (sum, p) => sum + p.costPrice * p.stockQuantity,
                        0
                      )
                      return (
                        <div
                          key={category}
                          className="flex items-center justify-between"
                        >
                          <span>{category}</span>
                          <span className="font-medium">
                            R${" "}
                            {value.toLocaleString("pt-BR", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      )
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
