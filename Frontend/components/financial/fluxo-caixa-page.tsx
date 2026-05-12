"use client"

import { useState, useMemo } from "react"
import { format, subDays, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { financialEntries } from "@/lib/mock-data"
import { FinancialLayout } from "./financial-layout"

export function FluxoCaixaPage() {
  const [period, setPeriod] = useState("month")

  const dateRange = useMemo(() => {
    const now = new Date()
    switch (period) {
      case "week":
        return { start: subDays(now, 7), end: now }
      case "month":
        return { start: startOfMonth(now), end: endOfMonth(now) }
      case "quarter":
        return { start: subDays(now, 90), end: now }
      default:
        return { start: startOfMonth(now), end: endOfMonth(now) }
    }
  }, [period])

  const cashFlowData = useMemo(() => {
    const days = eachDayOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    })

    let runningBalance = 500 // Starting balance

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd")
      const dayEntries = financialEntries.filter((e) => e.date === dateStr)
      
      const income = dayEntries
        .filter((e) => e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0)
      
      const expenses = dayEntries
        .filter((e) => e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0)
      
      runningBalance += income - expenses

      return {
        date: day,
        dateStr,
        income,
        expenses,
        balance: income - expenses,
        runningBalance,
      }
    })
  }, [dateRange])

  const totals = useMemo(() => {
    return cashFlowData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expenses: acc.expenses + day.expenses,
        balance: acc.balance + day.balance,
      }),
      { income: 0, expenses: 0, balance: 0 }
    )
  }, [cashFlowData])

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })

  // Filter to show only days with transactions or last 10 days
  const visibleData = cashFlowData.filter(
    (day, index) => 
      day.income > 0 || 
      day.expenses > 0 || 
      index >= cashFlowData.length - 10
  )

  return (
    <FinancialLayout>
      <div className="flex flex-col gap-6">
        {/* Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="mr-2 size-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Últimos 7 dias</SelectItem>
              <SelectItem value="month">Este mês</SelectItem>
              <SelectItem value="quarter">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
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
                Total Entradas
              </CardTitle>
              <ArrowUpRight className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                R$ {formatCurrency(totals.income)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Saídas
              </CardTitle>
              <ArrowDownRight className="size-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                R$ {formatCurrency(totals.expenses)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Saldo do Período
              </CardTitle>
              {totals.balance >= 0 ? (
                <TrendingUp className="size-4 text-emerald-500" />
              ) : (
                <TrendingDown className="size-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  totals.balance >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                R$ {formatCurrency(totals.balance)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
              <DollarSign className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                R${" "}
                {formatCurrency(
                  cashFlowData[cashFlowData.length - 1]?.runningBalance || 0
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Fluxo de Caixa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Fluxo de Caixa Diário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Entradas</TableHead>
                  <TableHead className="text-right">Saídas</TableHead>
                  <TableHead className="text-right">Saldo Dia</TableHead>
                  <TableHead className="text-right">Saldo Acumulado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhum dado para o período.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleData.map((day) => (
                    <TableRow key={day.dateStr}>
                      <TableCell>
                        {format(day.date, "EEEE, dd/MM", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        {day.income > 0 ? (
                          <span className="text-emerald-500">
                            + R$ {formatCurrency(day.income)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {day.expenses > 0 ? (
                          <span className="text-red-500">
                            - R$ {formatCurrency(day.expenses)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          day.balance >= 0
                            ? day.balance > 0
                              ? "text-emerald-500"
                              : "text-muted-foreground"
                            : "text-red-500"
                        }`}
                      >
                        {day.balance !== 0 ? (
                          <>R$ {formatCurrency(day.balance)}</>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        R$ {formatCurrency(day.runningBalance)}
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
