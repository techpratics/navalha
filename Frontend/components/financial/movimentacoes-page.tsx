"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Search,
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
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { financialEntries } from "@/lib/mock-data"
import { FinancialLayout } from "./financial-layout"
import { TransactionDialog } from "./transaction-dialog"
import { Transaction } from "@/lib/types"

export function MovimentacoesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(financialEntries)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income")

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filter === "all" || t.type === filter
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesType && matchesSearch
  })

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })

  const handleSave = (transaction: Transaction) => {
    if (selectedTransaction) {
      setTransactions(
        transactions.map((t) => (t.id === transaction.id ? transaction : t))
      )
    } else {
      setTransactions([
        ...transactions,
        { ...transaction, id: crypto.randomUUID() },
      ])
    }
    setDialogOpen(false)
    setSelectedTransaction(null)
  }

  const handleNewEntry = (type: "income" | "expense") => {
    setTransactionType(type)
    setSelectedTransaction(null)
    setDialogOpen(true)
  }

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      service: "Serviço",
      product: "Produto",
      salary: "Salário",
      rent: "Aluguel",
      utilities: "Contas",
      supplies: "Suprimentos",
      marketing: "Marketing",
      other: "Outros",
    }
    return categories[category] || category
  }

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: "Dinheiro",
      credit: "Crédito",
      debit: "Débito",
      pix: "PIX",
      transfer: "Transferência",
    }
    return methods[method] || method
  }

  return (
    <FinancialLayout>
      <div className="flex flex-col gap-6">
        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Entradas
              </CardTitle>
              <ArrowUpRight className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                R$ {formatCurrency(totalIncome)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Saídas
              </CardTitle>
              <ArrowDownRight className="size-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                R$ {formatCurrency(totalExpenses)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold ${
                  totalIncome - totalExpenses >= 0
                    ? "text-emerald-500"
                    : "text-red-500"
                }`}
              >
                R$ {formatCurrency(totalIncome - totalExpenses)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações e Filtros */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button onClick={() => handleNewEntry("income")}>
              <ArrowUpRight className="mr-2 size-4" />
              Nova Entrada
            </Button>
            <Button variant="outline" onClick={() => handleNewEntry("expense")}>
              <ArrowDownRight className="mr-2 size-4" />
              Nova Saída
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 size-4" />
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Entradas</SelectItem>
                <SelectItem value="expense">Saídas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Download className="size-4" />
            </Button>
          </div>
        </div>

        {/* Tabela */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhuma movimentação encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>
                        {format(new Date(t.date), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{t.description}</div>
                        {t.notes && (
                          <div className="text-sm text-muted-foreground">
                            {t.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getCategoryLabel(t.category)}</TableCell>
                      <TableCell>
                        {getPaymentMethodLabel(t.paymentMethod)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          t.type === "income"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {t.type === "income" ? "+" : "-"} R${" "}
                        {formatCurrency(t.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            t.status === "completed" ? "default" : "secondary"
                          }
                        >
                          {t.status === "completed" ? "Concluído" : "Pendente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={selectedTransaction}
        onSave={handleSave}
      />
    </FinancialLayout>
  )
}
