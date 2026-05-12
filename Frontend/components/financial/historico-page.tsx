"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, subMonths, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { FinancialLayout } from "./financial-layout"

// Mock data for cash history
const cashHistory = [
  {
    id: "1",
    date: "2024-01-20",
    openingTime: "08:00",
    closingTime: "20:00",
    openingBalance: 500,
    totalIncome: 2850,
    totalExpenses: 450,
    closingBalance: 2900,
    status: "closed",
    operator: "Carlos Silva",
  },
  {
    id: "2",
    date: "2024-01-19",
    openingTime: "08:00",
    closingTime: "20:00",
    openingBalance: 500,
    totalIncome: 3200,
    totalExpenses: 800,
    closingBalance: 2900,
    status: "closed",
    operator: "Carlos Silva",
  },
  {
    id: "3",
    date: "2024-01-18",
    openingTime: "08:00",
    closingTime: "20:00",
    openingBalance: 500,
    totalIncome: 2100,
    totalExpenses: 300,
    closingBalance: 2300,
    status: "closed",
    operator: "Carlos Silva",
  },
]

export function HistoricoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })

  return (
    <FinancialLayout>
      <div className="flex flex-col gap-6">
        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por operador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !dateRange && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                          {format(dateRange.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Selecione o período</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={{ from: dateRange?.from, to: dateRange?.to }}
                    onSelect={(range) =>
                      setDateRange({ from: range?.from, to: range?.to })
                    }
                    numberOfMonths={2}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              <Button variant="outline">
                <Download className="mr-2 size-4" />
                Exportar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Histórico */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Abertura</TableHead>
                  <TableHead>Fechamento</TableHead>
                  <TableHead className="text-right">Saldo Inicial</TableHead>
                  <TableHead className="text-right">Entradas</TableHead>
                  <TableHead className="text-right">Saídas</TableHead>
                  <TableHead className="text-right">Saldo Final</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cashHistory.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>{record.operator}</TableCell>
                    <TableCell>{record.openingTime}</TableCell>
                    <TableCell>{record.closingTime}</TableCell>
                    <TableCell className="text-right">
                      R$ {formatCurrency(record.openingBalance)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-500">
                      + R$ {formatCurrency(record.totalIncome)}
                    </TableCell>
                    <TableCell className="text-right text-red-500">
                      - R$ {formatCurrency(record.totalExpenses)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      R$ {formatCurrency(record.closingBalance)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          record.status === "closed" ? "default" : "secondary"
                        }
                      >
                        {record.status === "closed" ? "Fechado" : "Aberto"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </FinancialLayout>
  )
}
