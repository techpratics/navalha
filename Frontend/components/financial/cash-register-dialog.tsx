"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { financialEntries } from "@/lib/mock-data"
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react"

interface CashRegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CashRegisterDialog({
  open,
  onOpenChange,
}: CashRegisterDialogProps) {
  const cashFlowSummary = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const todayEntries = financialEntries.filter(e => e.date === today)
    
    const totalIncome = todayEntries
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0)
    
    const totalExpenses = todayEntries
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0)
    
    const openingBalance = 500.00
    
    return {
      openingBalance,
      totalIncome,
      totalExpenses,
      currentBalance: openingBalance + totalIncome - totalExpenses,
    }
  }, [])

  const [openingBalance, setOpeningBalance] = useState(
    cashFlowSummary.openingBalance
  )
  const [isOpen, setIsOpen] = useState(true)

  const handleOpenCash = () => {
    setIsOpen(true)
  }

  const handleCloseCash = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Controle de Caixa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  isOpen ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
              <span className="font-medium">
                Caixa {isOpen ? "Aberto" : "Fechado"}
              </span>
            </div>
            <Badge variant={isOpen ? "default" : "secondary"}>
              {isOpen ? "Em operação" : "Encerrado"}
            </Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Abertura
              </div>
              <div className="mt-1 text-2xl font-bold">
                R${" "}
                {cashFlowSummary.openingBalance.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Saldo Atual
              </div>
              <div className="mt-1 text-2xl font-bold">
                R${" "}
                {cashFlowSummary.currentBalance.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Movimentações do Dia</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span>Entradas</span>
                </div>
                <span className="font-medium text-emerald-500">
                  R${" "}
                  {cashFlowSummary.totalIncome.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                  <span>Saídas</span>
                </div>
                <span className="font-medium text-red-500">
                  R${" "}
                  {cashFlowSummary.totalExpenses.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Diferença</span>
                <span
                  className={`font-bold ${
                    cashFlowSummary.totalIncome -
                      cashFlowSummary.totalExpenses >=
                    0
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  R${" "}
                  {(
                    cashFlowSummary.totalIncome -
                    cashFlowSummary.totalExpenses
                  ).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {!isOpen ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openingBalance">Valor de Abertura</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    R$
                  </span>
                  <Input
                    id="openingBalance"
                    type="number"
                    step="0.01"
                    min="0"
                    value={openingBalance}
                    onChange={(e) =>
                      setOpeningBalance(parseFloat(e.target.value) || 0)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleOpenCash}>
                Abrir Caixa
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCloseCash}
              >
                Fechar Caixa
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Ao fechar o caixa, será gerado um relatório com todas as
                movimentações do dia.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
