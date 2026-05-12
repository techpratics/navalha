'use client'

import * as React from 'react'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Users,
  Calendar,
  Check,
  X,
  Crown,
  Star,
  Zap,
  Shield,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { subscriptionPlans, services, clients } from '@/lib/mock-data'
import type { SubscriptionPlan } from '@/lib/types'

const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const dayNamesFull = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

const planIcons: Record<string, React.ElementType> = {
  'Premium': Crown,
  'Premium Plus': Star,
  'VIP': Zap,
  'Basic': Shield,
}

export function SubscriptionsPage() {
  const [plans, setPlans] = React.useState<SubscriptionPlan[]>(subscriptionPlans)
  const [search, setSearch] = React.useState('')
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null)
  const [planToDelete, setPlanToDelete] = React.useState<SubscriptionPlan | null>(null)

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    usageLimit: '1',
    allowedDays: [] as number[],
    selectedServices: [] as string[],
    isActive: true,
  })

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(search.toLowerCase())
  )

  const getSubscribersCount = (planId: string) => {
    return clients.filter(c => c.subscription?.planId === planId).length
  }

  const openNewDialog = () => {
    setSelectedPlan(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      usageLimit: '1',
      allowedDays: [],
      selectedServices: [],
      isActive: true,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price.toString(),
      usageLimit: plan.usageLimit.toString(),
      allowedDays: plan.allowedDays,
      selectedServices: plan.services,
      isActive: plan.isActive,
    })
    setDialogOpen(true)
  }

  const confirmDelete = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan)
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (planToDelete) {
      setPlans(prev => prev.filter(p => p.id !== planToDelete.id))
      setPlanToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const newPlan: SubscriptionPlan = {
      id: selectedPlan?.id || `plan-${Date.now()}`,
      name: formData.name,
      description: formData.description || undefined,
      price: parseFloat(formData.price),
      usageLimit: parseInt(formData.usageLimit),
      allowedDays: formData.allowedDays,
      services: formData.selectedServices,
      isActive: formData.isActive,
    }

    if (selectedPlan) {
      setPlans(prev => prev.map(p => p.id === selectedPlan.id ? newPlan : p))
    } else {
      setPlans(prev => [...prev, newPlan])
    }

    setDialogOpen(false)
  }

  const toggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      allowedDays: prev.allowedDays.includes(day)
        ? prev.allowedDays.filter(d => d !== day)
        : [...prev.allowedDays, day].sort()
    }))
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Assinaturas</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os planos de assinatura dos clientes
          </p>
        </div>
        <Button onClick={openNewDialog}>
          <Plus className="mr-2 size-4" />
          Novo Plano
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Planos</CardTitle>
            <Crown className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              {plans.filter(p => p.isActive).length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => c.subscription).length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {clients.length} clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {clients
                .filter(c => c.subscription)
                .reduce((sum, c) => {
                  const plan = plans.find(p => p.id === c.subscription?.planId)
                  return sum + (plan?.price || 0)
                }, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              em assinaturas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano Mais Popular</CardTitle>
            <Star className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.reduce((most, plan) => {
                const count = getSubscribersCount(plan.id)
                const mostCount = getSubscribersCount(most.id)
                return count > mostCount ? plan : most
              }, plans[0])?.name || '-'}
            </div>
            <p className="text-xs text-muted-foreground">
              mais assinantes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar plano..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Plans Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPlans.map((plan) => {
          const IconComponent = planIcons[plan.name] || Crown
          const subscribers = getSubscribersCount(plan.id)

          return (
            <Card key={plan.id} className={cn(!plan.isActive && 'opacity-60')}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'flex size-10 items-center justify-center rounded-lg',
                      plan.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    )}>
                      <IconComponent className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{plan.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {subscribers} assinante{subscribers !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(plan)}>
                        <Pencil className="mr-2 size-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => confirmDelete(plan)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    R$ {plan.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500" />
                    <span>{plan.usageLimit} uso{plan.usageLimit !== 1 ? 's' : ''} por semana</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {plan.allowedDays.map(d => dayNames[d]).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-500" />
                    <span>{plan.services.length} serviço{plan.services.length !== 1 ? 's' : ''} incluído{plan.services.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <Badge variant={plan.isActive ? 'default' : 'secondary'} className="mt-2">
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assinantes</CardTitle>
          <CardDescription>Lista de clientes com assinatura ativa</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Dias Permitidos</TableHead>
                <TableHead className="text-center">Uso Semanal</TableHead>
                <TableHead>Início</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.filter(c => c.subscription).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    Nenhum assinante encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                clients
                  .filter(c => c.subscription)
                  .map((client) => {
                    const plan = plans.find(p => p.id === client.subscription?.planId)
                    if (!plan || !client.subscription) return null

                    return (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div className="font-medium">{client.name}</div>
                          <div className="text-xs text-muted-foreground">{client.phone}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1">
                            {React.createElement(planIcons[plan.name] || Crown, { className: 'size-3' })}
                            {plan.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {plan.allowedDays.map(d => dayNames[d]).join(', ')}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={client.subscription.usedThisWeek >= plan.usageLimit ? 'destructive' : 'secondary'}
                            className={cn(
                              client.subscription.usedThisWeek < plan.usageLimit && 'bg-emerald-500/10 text-emerald-600'
                            )}
                          >
                            {client.subscription.usedThisWeek}/{plan.usageLimit}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(client.subscription.startDate).toLocaleDateString('pt-BR')}
                          </span>
                        </TableCell>
                      </TableRow>
                    )
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Plan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPlan ? 'Editar Plano' : 'Novo Plano'}</DialogTitle>
            <DialogDescription>
              Configure os detalhes do plano de assinatura
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Premium"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Valor Mensal (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="150.00"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do plano..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usos por Semana *</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                  placeholder="2"
                  min="1"
                  required
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="isActive">Plano Ativo</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dias Permitidos *</Label>
              <div className="flex flex-wrap gap-2">
                {dayNamesFull.map((day, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={formData.allowedDays.includes(index) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleDay(index)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Serviços Incluídos *</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      formData.selectedServices.includes(service.id) && 'border-primary bg-primary/5'
                    )}
                    onClick={() => toggleService(service.id)}
                  >
                    <Checkbox
                      checked={formData.selectedServices.includes(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        R$ {service.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {selectedPlan ? 'Salvar' : 'Criar Plano'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir plano?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O plano{' '}
              <strong>{planToDelete?.name}</strong> será permanentemente removido.
              {getSubscribersCount(planToDelete?.id || '') > 0 && (
                <span className="block mt-2 text-destructive">
                  Atenção: Existem {getSubscribersCount(planToDelete?.id || '')} assinantes neste plano.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
