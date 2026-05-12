"use client"

import { useState, useMemo } from "react"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { financialEntries } from "@/lib/mock-data"
import { FinancialLayout } from "./financial-layout"

export function CaixaPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [openCashDialog, setOpenCashDialog] = useState(false)
  const [closeCashDialog, setCloseCashDialog] = useState(false)
  const [openingBalance, setOpeningBalance] = useState("500")

  const today = new Date().toISOString().split("T")[0]

  const todayEntries = useMemo(() => {
    return financialEntries.filter((e) => e.date === today)
  }, [today])

  const cashSummary = useMemo(() => {
    const totalIncome = todayEntries
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0)

    const totalExpenses = todayEntries
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0)

    const opening = parseFloat(openingBalance) || 0
    const currentBalance = opening + totalIncome - totalExpenses

    const byPaymentMethod = {
      cash: todayEntries
        .filter((e) => e.paymentMethod === "cash" && e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
      credit: todayEntries
        .filter((e) => e.paymentMethod === "credit" && e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
      debit: todayEntries
        .filter((e) => e.paymentMethod === "debit" && e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
      pix: todayEntries
        .filter((e) => e.paymentMethod === "pix" && e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0),
    }

    return {
      openingBalance: opening,
      totalIncome,
      totalExpenses,
      currentBalance,
      byPaymentMethod,
    }
  }, [todayEntries, openingBalance])

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })

  return (
    <FinancialLayout>
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Status do Caixa */}
        <Card className={isOpen ? "border-emerald-500/50" : "border-red-500/50"}>
          <CardHeader className="flex flex-col gap-4 pb-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                  isOpen ? "bg-emerald-500/20" : "bg-red-500/20"
                }`}
              >
                <Wallet
                  className={`size-5 ${
                    isOpen ? "text-emerald-500" : "text-red-500"
                  }`}
                />
              </div>
              <div>
                <CardTitle className="text-base md:text-lg">
                  Caixa {isOpen ? "Aberto" : "Fechado"}
                </CardTitle>
                <p className="text-xs text-muted-foreground md:text-sm">
                  {format(new Date(), "EEEE, dd 'de' MMMM", {
                    locale: ptBR,
                  })}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {isOpen ? (
                <Button
                  variant="destructive"
                  onClick={() => setCloseCashDialog(true)}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  <XCircle className="mr-2 size-4" />
                  Fechar Caixa
                </Button>
              ) : (
                <Button 
                  onClick={() => setOpenCashDialog(true)}
                  className="w-full sm:w-auto"
                  size="sm"
                >
                  <CheckCircle2 className="mr-2 size-4" />
                  Abrir Caixa
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium md:text-sm">Abertura</CardTitle>
              <Clock className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold md:text-2xl">
                R$ {formatCurrency(cashSummary.openingBalance)}
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">Saldo inicial</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium md:text-sm">Entradas</CardTitle>
              <ArrowUpRight className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-emerald-500 md:text-2xl">
                R$ {formatCurrency(cashSummary.totalIncome)}
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">Total recebido</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium md:text-sm">Saídas</CardTitle>
              <ArrowDownRight className="size-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-red-500 md:text-2xl">
                R$ {formatCurrency(cashSummary.totalExpenses)}
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">Total de despesas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium md:text-sm">Saldo Atual</CardTitle>
              {cashSummary.currentBalance >= 0 ? (
                <TrendingUp className="size-4 text-emerald-500" />
              ) : (
                <TrendingDown className="size-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div
                className={`text-lg font-bold md:text-2xl ${
                  cashSummary.currentBalance >= 0
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                R$ {formatCurrency(cashSummary.currentBalance)}
              </div>
              <p className="hidden text-xs text-muted-foreground sm:block">Em caixa</p>
            </CardContent>
          </Card>
        </div>

        {/* Resumo por Forma de Pagamento */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <CreditCard className="size-5" />
                Recebimentos por Forma de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { key: "cash", label: "Dinheiro", color: "bg-emerald-500" },
                  { key: "pix", label: "PIX", color: "bg-cyan-500" },
                  { key: "debit", label: "Débito", color: "bg-blue-500" },
                  { key: "credit", label: "Crédito", color: "bg-purple-500" },
                ].map((method) => (
                  <div key={method.key} className="flex items-center gap-3">
                    <div className={`size-3 shrink-0 rounded-full ${method.color}`} />
                    <span className="flex-1 text-sm">{method.label}</span>
                    <span className="text-sm font-medium">
                      R${" "}
                      {formatCurrency(
                        cashSummary.byPaymentMethod[
                          method.key as keyof typeof cashSummary.byPaymentMethod
                        ]
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <DollarSign className="size-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 md:grid-cols-1 md:gap-3">
              <Button className="justify-start text-xs md:text-sm" variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                Registrar Entrada
              </Button>
              <Button className="justify-start text-xs md:text-sm" variant="outline" size="sm">
                <ArrowDownRight className="mr-2 size-4" />
                Registrar Saída
              </Button>
              <Button className="justify-start text-xs md:text-sm" variant="outline" size="sm">
                <Wallet className="mr-2 size-4" />
                Sangria
              </Button>
              <Button className="justify-start text-xs md:text-sm" variant="outline" size="sm">
                <Plus className="mr-2 size-4" />
                Reforço de Caixa
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Movimentações do Dia */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Movimentações de Hoje</CardTitle>
          </CardHeader>
          <CardContent className="p-0 md:p-6 md:pt-0">
            {/* Mobile List View */}
            <div className="divide-y md:hidden">
              {todayEntries.length === 0 ? (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  Nenhuma movimentação hoje.
                </p>
              ) : (
                todayEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{entry.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.paymentMethod === "cash" && "Dinheiro"}
                        {entry.paymentMethod === "credit" && "Crédito"}
                        {entry.paymentMethod === "debit" && "Débito"}
                        {entry.paymentMethod === "pix" && "PIX"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-medium ${
                          entry.type === "income"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {entry.type === "income" ? "+" : "-"} R${" "}
                        {formatCurrency(entry.amount)}
                      </p>
                      <Badge
                        variant={
                          entry.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {entry.status === "completed"
                          ? "Concluído"
                          : "Pendente"}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma movimentação hoje.
                      </TableCell>
                    </TableRow>
                  ) : (
                    todayEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {format(new Date(), "HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {entry.description}
                        </TableCell>
                        <TableCell>
                          {entry.paymentMethod === "cash" && "Dinheiro"}
                          {entry.paymentMethod === "credit" && "Crédito"}
                          {entry.paymentMethod === "debit" && "Débito"}
                          {entry.paymentMethod === "pix" && "PIX"}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            entry.type === "income"
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {entry.type === "income" ? "+" : "-"} R${" "}
                          {formatCurrency(entry.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              entry.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {entry.status === "completed"
                              ? "Concluído"
                              : "Pendente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog Abrir Caixa */}
      <Dialog open={openCashDialog} onOpenChange={setOpenCashDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Abrir Caixa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="opening">Saldo de Abertura (R$)</Label>
              <Input
                id="opening"
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                placeholder="0,00"
              />
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setOpenCashDialog(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setIsOpen(true)
                setOpenCashDialog(false)
              }}
              className="w-full sm:w-auto"
            >
              Abrir Caixa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Fechar Caixa */}
      <Dialog open={closeCashDialog} onOpenChange={setCloseCashDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fechar Caixa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="rounded-lg border p-4">
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Abertura</span>
                <span>R$ {formatCurrency(cashSummary.openingBalance)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Entradas</span>
                <span className="text-emerald-500">
                  + R$ {formatCurrency(cashSummary.totalIncome)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Saídas</span>
                <span className="text-red-500">
                  - R$ {formatCurrency(cashSummary.totalExpenses)}
                </span>
              </div>
              <div className="flex justify-between border-t py-2 font-bold">
                <span>Saldo Final</span>
                <span>R$ {formatCurrency(cashSummary.currentBalance)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => setCloseCashDialog(false)} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsOpen(false)
                setCloseCashDialog(false)
              }}
              className="w-full sm:w-auto"
            >
              Confirmar Fechamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FinancialLayout>
  )
}
