"use client"

import { useState, useMemo } from "react"
import {
  Boxes,
  Search,
  Download,
  DollarSign,
  AlertTriangle,
  Package,
  TrendingDown,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { products, productCategories } from "@/lib/mock-data"
import { FinancialLayout } from "./financial-layout"

export function EstoqueFinanceiroPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && product.quantity <= product.minQuantity) ||
      (stockFilter === "ok" && product.quantity > product.minQuantity)
    return matchesSearch && matchesCategory && matchesStock
  })

  const stockSummary = useMemo(() => {
    const totalValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    )
    const totalCost = products.reduce(
      (sum, p) => sum + (p.professionalPrice || p.price * 0.6) * p.quantity,
      0
    )
    const lowStockCount = products.filter(
      (p) => p.quantity <= p.minQuantity
    ).length
    const outOfStockCount = products.filter((p) => p.quantity === 0).length

    return {
      totalValue,
      totalCost,
      potentialProfit: totalValue - totalCost,
      lowStockCount,
      outOfStockCount,
      totalProducts: products.length,
    }
  }, [])

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })

  return (
    <FinancialLayout>
      <div className="flex flex-col gap-6">
        {/* Cards de Resumo */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor em Estoque
              </CardTitle>
              <DollarSign className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">
                R$ {formatCurrency(stockSummary.totalValue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Preço de venda
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo Total</CardTitle>
              <TrendingDown className="size-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                R$ {formatCurrency(stockSummary.totalCost)}
              </div>
              <p className="text-xs text-muted-foreground">Preço de custo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lucro Potencial
              </CardTitle>
              <DollarSign className="size-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                R$ {formatCurrency(stockSummary.potentialProfit)}
              </div>
              <p className="text-xs text-muted-foreground">Se vender tudo</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estoque Baixo
              </CardTitle>
              <AlertTriangle className="size-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">
                {stockSummary.lowStockCount}
              </div>
              <p className="text-xs text-muted-foreground">
                {stockSummary.outOfStockCount} sem estoque
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
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {productCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estoque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="low">Estoque baixo</SelectItem>
                <SelectItem value="ok">Estoque OK</SelectItem>
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
              <Boxes className="size-5" />
              Valor Financeiro do Estoque
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Preço Custo</TableHead>
                  <TableHead className="text-right">Preço Venda</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const costPrice = product.professionalPrice || product.price * 0.6
                    const totalValue = product.price * product.quantity
                    const isLowStock = product.quantity <= product.minQuantity

                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                              <Package className="size-5 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.brand}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={
                              isLowStock
                                ? "text-amber-500 font-medium"
                                : ""
                            }
                          >
                            {product.quantity} {product.unit}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {formatCurrency(costPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          R$ {formatCurrency(product.price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          R$ {formatCurrency(totalValue)}
                        </TableCell>
                        <TableCell>
                          {product.quantity === 0 ? (
                            <Badge variant="destructive">Sem estoque</Badge>
                          ) : isLowStock ? (
                            <Badge
                              variant="secondary"
                              className="bg-amber-500/20 text-amber-500"
                            >
                              Baixo
                            </Badge>
                          ) : (
                            <Badge variant="default">OK</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </FinancialLayout>
  )
}
