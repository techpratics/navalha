'use client'

import * as React from 'react'
import { Upload } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { serviceCategories, professionals } from '@/lib/mock-data'
import type { Service } from '@/lib/types'

interface ServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service: Service | null
  onSave: (service: Service) => void
}

export function ServiceDialog({
  open,
  onOpenChange,
  service,
  onSave,
}: ServiceDialogProps) {
  const isEdit = !!service
  const [step, setStep] = React.useState(1)
  const totalSteps = 3

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    duration: '30',
    price: '',
    commission: '40',
    category: '',
    isAvailable: true,
    showPrice: true,
    simultaneousQty: '1',
    returnTime: '',
    notes: '',
    selectedProfessionals: [] as string[],
    discount: '',
  })

  React.useEffect(() => {
    if (open) {
      setStep(1)
      if (service) {
        setFormData({
          name: service.name,
          description: service.description || '',
          duration: service.duration.toString(),
          price: service.price.toString(),
          commission: service.commission.toString(),
          category: service.category,
          isAvailable: service.isAvailable,
          showPrice: true,
          simultaneousQty: '1',
          returnTime: '',
          notes: '',
          selectedProfessionals: [],
          discount: '',
        })
      } else {
        setFormData({
          name: '',
          description: '',
          duration: '30',
          price: '',
          commission: '40',
          category: '',
          isAvailable: true,
          showPrice: true,
          simultaneousQty: '1',
          returnTime: '',
          notes: '',
          selectedProfessionals: [],
          discount: '',
        })
      }
    }
  }, [open, service])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < totalSteps) {
      setStep(step + 1)
      return
    }

    const newService: Service = {
      id: service?.id || `service-${Date.now()}`,
      name: formData.name,
      description: formData.description || undefined,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      commission: parseInt(formData.commission),
      category: formData.category,
      isAvailable: formData.isAvailable,
    }

    onSave(newService)
    onOpenChange(false)
  }

  const updateField = (field: keyof typeof formData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleProfessional = (professionalId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProfessionals: prev.selectedProfessionals.includes(professionalId)
        ? prev.selectedProfessionals.filter(id => id !== professionalId)
        : [...prev.selectedProfessionals, professionalId]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Serviço' : 'Novo Serviço'}
          </DialogTitle>
          <DialogDescription>
            Etapa {step} de {totalSteps}: {
              step === 1 ? 'Dados do Serviço' :
              step === 2 ? 'Profissionais' :
              'Descontos'
            }
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 flex-1 rounded-full',
                i < step ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Service Data */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Nome do Serviço *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Ex: Corte Masculino"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Descrição do serviço..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (minutos) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    placeholder="30"
                    min="5"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Valor (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="50.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission">Comissão (%) *</Label>
                  <Input
                    id="commission"
                    type="number"
                    value={formData.commission}
                    onChange={(e) => updateField('commission', e.target.value)}
                    placeholder="40"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => updateField('category', v)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="simultaneousQty">Atendimentos Simultâneos</Label>
                  <Input
                    id="simultaneousQty"
                    type="number"
                    value={formData.simultaneousQty}
                    onChange={(e) => updateField('simultaneousQty', e.target.value)}
                    placeholder="1"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnTime">Tempo de Retorno (dias)</Label>
                  <Input
                    id="returnTime"
                    type="number"
                    value={formData.returnTime}
                    onChange={(e) => updateField('returnTime', e.target.value)}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label>Disponível para agendamento</Label>
                      <p className="text-xs text-muted-foreground">
                        Serviço aparece nas opções de agendamento
                      </p>
                    </div>
                    <Switch
                      checked={formData.isAvailable}
                      onCheckedChange={(checked) => updateField('isAvailable', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Label>Mostrar valor ao cliente</Label>
                      <p className="text-xs text-muted-foreground">
                        Exibe o valor no agendamento online
                      </p>
                    </div>
                    <Switch
                      checked={formData.showPrice}
                      onCheckedChange={(checked) => updateField('showPrice', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Imagem do Serviço</Label>
                  <div className="flex items-center justify-center rounded-lg border border-dashed p-6">
                    <div className="text-center">
                      <Upload className="mx-auto size-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Clique para fazer upload
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professionals */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione os profissionais que executam este serviço:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {professionals.map((prof) => (
                  <div
                    key={prof.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      formData.selectedProfessionals.includes(prof.id) && 'border-primary bg-primary/5'
                    )}
                    onClick={() => toggleProfessional(prof.id)}
                  >
                    <Checkbox
                      checked={formData.selectedProfessionals.includes(prof.id)}
                      onCheckedChange={() => toggleProfessional(prof.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{prof.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {prof.nickname || prof.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Discounts */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="discountPercent">Desconto (%)</Label>
                  <Input
                    id="discountPercent"
                    type="number"
                    placeholder="10"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountFixed">Desconto Fixo (R$)</Label>
                  <Input
                    id="discountFixed"
                    type="number"
                    step="0.01"
                    placeholder="5.00"
                    min="0"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="promoNotes">Observações da Promoção</Label>
                  <Textarea
                    id="promoNotes"
                    placeholder="Detalhes sobre promoções ou descontos especiais..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Review */}
              <div className="rounded-lg border p-4 space-y-2">
                <h4 className="font-medium text-sm">Resumo do Serviço</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Categoria:</span>
                    <p className="font-medium">{formData.category || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duração:</span>
                    <p className="font-medium">{formData.duration} min</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Valor:</span>
                    <p className="font-medium">R$ {parseFloat(formData.price || '0').toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <div className="flex w-full justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Voltar
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
              )}
              <Button type="submit">
                {step < totalSteps ? 'Próximo' : (isEdit ? 'Salvar' : 'Cadastrar')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
