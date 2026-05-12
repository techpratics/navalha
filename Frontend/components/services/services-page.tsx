'use client'

import * as React from 'react'
import {
  Plus,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Copy,
  MoreHorizontal,
  Clock,
  DollarSign,
  Percent,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { services as mockServices, serviceCategories } from '@/lib/mock-data'
import type { Service } from '@/lib/types'
import { ServiceDialog } from '@/components/services/service-dialog'

export function ServicesPage() {
  const [services, setServices] = React.useState<Service[]>(mockServices)
  const [search, setSearch] = React.useState('')
  const [selectedService, setSelectedService] = React.useState<Service | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [serviceToDelete, setServiceToDelete] = React.useState<Service | null>(null)
  const [editMode, setEditMode] = React.useState(false)

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddService = (service: Service) => {
    setServices(prev => [...prev, service])
  }

  const handleUpdateService = (service: Service) => {
    setServices(prev => prev.map(s => s.id === service.id ? service : s))
  }

  const handleDeleteService = () => {
    if (serviceToDelete) {
      setServices(prev => prev.filter(s => s.id !== serviceToDelete.id))
      setServiceToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleDuplicateService = (service: Service) => {
    const duplicate: Service = {
      ...service,
      id: `service-${Date.now()}`,
      name: `${service.name} (Cópia)`,
    }
    setServices(prev => [...prev, duplicate])
  }

  const openNewDialog = () => {
    setSelectedService(null)
    setEditMode(false)
    setDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setSelectedService(service)
    setEditMode(true)
    setDialogOpen(true)
  }

  const confirmDelete = (service: Service) => {
    setServiceToDelete(service)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Serviços</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os serviços oferecidos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={openNewDialog}>
            <Plus className="mr-2 size-4" />
            Novo Serviço
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="ghost" size="icon">
          <RefreshCw className="size-4" />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serviço</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Duração</TableHead>
              <TableHead className="text-right">Comissão</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhum serviço encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      {service.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {service.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign className="size-3 text-muted-foreground" />
                      <span className="font-medium">R$ {service.price.toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="size-3 text-muted-foreground" />
                      <span>{service.duration}min</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Percent className="size-3 text-muted-foreground" />
                      <span>{service.commission}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={service.isAvailable ? 'default' : 'secondary'}
                      className={cn(
                        service.isAvailable && 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
                        !service.isAvailable && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {service.isAvailable ? 'Disponível' : 'Indisponível'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(service)}>
                          <Pencil className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateService(service)}>
                          <Copy className="mr-2 size-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => confirmDelete(service)}
                        >
                          <Trash2 className="mr-2 size-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-semibold">{services.length}</div>
          <p className="text-sm text-muted-foreground">Total de serviços</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-semibold">
            {services.filter(s => s.isAvailable).length}
          </div>
          <p className="text-sm text-muted-foreground">Disponíveis</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-semibold">
            R$ {(services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(0)}
          </div>
          <p className="text-sm text-muted-foreground">Preço médio</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-2xl font-semibold">
            {Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length)}min
          </div>
          <p className="text-sm text-muted-foreground">Duração média</p>
        </div>
      </div>

      {/* Dialogs */}
      <ServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editMode ? selectedService : null}
        onSave={editMode ? handleUpdateService : handleAddService}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir serviço?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O serviço{' '}
              <strong>{serviceToDelete?.name}</strong> será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
