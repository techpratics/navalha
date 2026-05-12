"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Minus } from "lucide-react"
import { Product } from "@/lib/types"

interface StockAdjustmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onAdjust: (productId: string, quantity: number, type: "add" | "remove") => void
}

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  product,
  onAdjust,
}: StockAdjustmentDialogProps) {
  const [type, setType] = useState<"add" | "remove">("add")
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (product && quantity > 0) {
      onAdjust(product.id, quantity, type)
      setQuantity(1)
      setReason("")
      setType("add")
    }
  }

  const newQuantity =
    type === "add"
      ? (product?.stockQuantity || 0) + quantity
      : Math.max(0, (product?.stockQuantity || 0) - quantity)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajuste de Estoque</DialogTitle>
        </DialogHeader>
        {product && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Produto</div>
              <div className="font-medium">{product.name}</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Estoque atual:{" "}
                <span className="font-medium text-foreground">
                  {product.stockQuantity} unidades
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tipo de Movimentação</Label>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as "add" | "remove")}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="add"
                    id="add"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="add"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Plus className="mb-2 h-6 w-6 text-emerald-500" />
                    <span className="text-sm font-medium">Entrada</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="remove"
                    id="remove"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="remove"
                    className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <Minus className="mb-2 h-6 w-6 text-red-500" />
                    <span className="text-sm font-medium">Saída</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={type === "remove" ? product.stockQuantity : undefined}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Compra de fornecedor, Venda avulsa, Perda..."
                rows={2}
              />
            </div>

            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Novo estoque:
                </span>
                <span
                  className={`text-lg font-bold ${
                    type === "add" ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {newQuantity} unidades
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Confirmar Ajuste</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
