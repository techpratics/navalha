'use client'

import * as React from 'react'
import {
  Plus,
  RefreshCw,
  Clock,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  CalendarDays,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { professionals as mockProfessionals, services } from '@/lib/mock-data'
import type { Professional } from '@/lib/types'
import { ProfessionalDialog } from '@/components/professionals/professional-dialog'
import { WorkingHoursDialog } from '@/components/professionals/working-hours-dialog'

export function ProfessionalsPage() {
  const [professionals, setProfessionals] = React.useState<Professional[]>(mockProfessionals)
  const [search, setSearch] = React.useState('')
  const [selectedProfessional, setSelectedProfessional] = React.useState<Professional | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [hoursDialogOpen, setHoursDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [professionalToDelete, setProfessionalToDelete] = React.useState<Professional | null>(null)
  const [editMode, setEditMode] = React.useState(false)

  const filteredProfessionals = professionals.filter(prof =>
    prof.name.toLowerCase().includes(search.toLowerCase()) ||
    prof.email.toLowerCase().includes(search.toLowerCase()) ||
    prof.phone.includes(search)
  )

  const handleAddProfessional = (professional: Professional) => {
    setProfessionals(prev => [...prev, professional])
  }

  const handleUpdateProfessional = (professional: Professional) => {
    setProfessionals(prev => prev.map(p => p.id === professional.id ? professional : p))
  }

  const handleDeleteProfessional = () => {
    if (professionalToDelete) {
      setProfessionals(prev => prev.filter(p => p.id !== professionalToDelete.id))
      setProfessionalToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const openNewDialog = () => {
    setSelectedProfessional(null)
    setEditMode(false)
    setDialogOpen(true)
  }

  const openEditDialog = (professional: Professional) => {
    setSelectedProfessional(professional)
    setEditMode(true)
    setDialogOpen(true)
  }

  const openHoursDialog = () => {
    setHoursDialogOpen(true)
  }

  const confirmDelete = (professional: Professional) => {
    setProfessionalToDelete(professional)
    setDeleteDialogOpen(true)
  }

  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds
      .map(id => services.find(s => s.id === id)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(', ') + (serviceIds.length > 2 ? ` +${serviceIds.length - 2}` : '')
  }

  const getWorkingDays = (prof: Professional) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    return prof.workingHours
      .map(wh => days[wh.dayOfWeek])
      .join(', ')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Profissionais</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie sua equipe de profissionais
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={openHoursDialog}>
            <Clock className="mr-2 size-4" />
            Horários de Trabalho
          </Button>
          <Button size="sm" onClick={openNewDialog}>
            <Plus className="mr-2 size-4" />
            Novo Profissional
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
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
              <TableHead>Profissional</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Apelido</TableHead>
              <TableHead>Serviços</TableHead>
              <TableHead>Disponibilidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfessionals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhum profissional encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfessionals.map((prof) => (
                <TableRow key={prof.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {prof.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{prof.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="size-3" />
                        {prof.phone}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="size-3" />
                        {prof.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{prof.nickname || '-'}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {getServiceNames(prof.services)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {getWorkingDays(prof)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={prof.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        prof.status === 'active' && 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
                        prof.status === 'inactive' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {prof.status === 'active' ? 'Ativo' : 'Inativo'}
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
                        <DropdownMenuItem>
                          <CalendarDays className="mr-2 size-4" />
                          Ver Agenda
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(prof)}>
                          <Pencil className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => confirmDelete(prof)}
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

      {/* Dialogs */}
      <ProfessionalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        professional={editMode ? selectedProfessional : null}
        onSave={editMode ? handleUpdateProfessional : handleAddProfessional}
      />

      <WorkingHoursDialog
        open={hoursDialogOpen}
        onOpenChange={setHoursDialogOpen}
        professionals={professionals}
        onUpdate={handleUpdateProfessional}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir profissional?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O profissional{' '}
              <strong>{professionalToDelete?.name}</strong> será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProfessional}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
