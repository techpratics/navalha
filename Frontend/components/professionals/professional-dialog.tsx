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
import { services } from '@/lib/mock-data'
import type { Professional } from '@/lib/types'

interface ProfessionalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  professional: Professional | null
  onSave: (professional: Professional) => void
}

export function ProfessionalDialog({
  open,
  onOpenChange,
  professional,
  onSave,
}: ProfessionalDialogProps) {
  const isEdit = !!professional
  const [step, setStep] = React.useState(1)
  const totalSteps = 4

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    nickname: '',
    cpf: '',
    notes: '',
    selectedServices: [] as string[],
    status: 'active' as Professional['status'],
  })

  React.useEffect(() => {
    if (open) {
      setStep(1)
      if (professional) {
        setFormData({
          name: professional.name,
          email: professional.email,
          phone: professional.phone,
          nickname: professional.nickname,
          cpf: '',
          notes: '',
          selectedServices: professional.services,
          status: professional.status,
        })
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          nickname: '',
          cpf: '',
          notes: '',
          selectedServices: [],
          status: 'active',
        })
      }
    }
  }, [open, professional])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < totalSteps) {
      setStep(step + 1)
      return
    }

    const newProfessional: Professional = {
      id: professional?.id || `prof-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      nickname: formData.nickname,
      status: formData.status,
      services: formData.selectedServices,
      workingHours: professional?.workingHours || [
        { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
        { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
      ],
    }

    onSave(newProfessional)
    onOpenChange(false)
  }

  const updateField = (field: keyof typeof formData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Profissional' : 'Novo Profissional'}
          </DialogTitle>
          <DialogDescription>
            Etapa {step} de {totalSteps}: {
              step === 1 ? 'Dados Pessoais' :
              step === 2 ? 'Serviços' :
              step === 3 ? 'Acesso ao Sistema' :
              'Revisão'
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
          {/* Step 1: Personal Data */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Nome completo do profissional"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Apelido</Label>
                  <Input
                    id="nickname"
                    value={formData.nickname}
                    onChange={(e) => updateField('nickname', e.target.value)}
                    placeholder="Apelido para exibição"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => updateField('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Celular *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Foto</Label>
                  <div className="flex items-center justify-center rounded-lg border border-dashed p-6">
                    <div className="text-center">
                      <Upload className="mx-auto size-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Clique para fazer upload
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Observações sobre o profissional..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Selecione os serviços que este profissional pode executar:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      formData.selectedServices.includes(service.id) && 'border-primary bg-primary/5'
                    )}
                    onClick={() => toggleService(service.id)}
                  >
                    <Checkbox
                      checked={formData.selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.duration}min - R$ {service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: System Access */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => updateField('status', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Acesso</Label>
                  <Select defaultValue="professional">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Login</Label>
                  <Input
                    placeholder="Login para acesso ao sistema"
                    defaultValue={formData.email}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    placeholder="Senha de acesso"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Apelido:</span>
                    <p className="font-medium">{formData.nickname || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Serviços:</span>
                    <p className="font-medium">
                      {formData.selectedServices.length > 0
                        ? formData.selectedServices
                            .map(id => services.find(s => s.id === id)?.name)
                            .filter(Boolean)
                            .join(', ')
                        : 'Nenhum serviço selecionado'}
                    </p>
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
