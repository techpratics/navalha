'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Plus,
  RefreshCw,
  Download,
  FileSpreadsheet,
  Search,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Phone,
  Mail,
  Star,
  Crown,
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
import { clients as mockClients, subscriptionPlans } from '@/lib/mock-data'
import type { Client } from '@/lib/types'
import { ClientDialog } from '@/components/clients/client-dialog'
import { ClientDetailsDialog } from '@/components/clients/client-details-dialog'

export function ClientsPage() {
  const [clients, setClients] = React.useState<Client[]>(mockClients)
  const [search, setSearch] = React.useState('')
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [clientToDelete, setClientToDelete] = React.useState<Client | null>(null)
  const [editMode, setEditMode] = React.useState(false)

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase()) ||
    client.phone.includes(search)
  )

  const handleAddClient = (client: Client) => {
    setClients(prev => [...prev, client])
  }

  const handleUpdateClient = (client: Client) => {
    setClients(prev => prev.map(c => c.id === client.id ? client : c))
  }

  const handleDeleteClient = () => {
    if (clientToDelete) {
      setClients(prev => prev.filter(c => c.id !== clientToDelete.id))
      setClientToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const openNewDialog = () => {
    setSelectedClient(null)
    setEditMode(false)
    setDialogOpen(true)
  }

  const openEditDialog = (client: Client) => {
    setSelectedClient(client)
    setEditMode(true)
    setDialogOpen(true)
  }

  const openDetails = (client: Client) => {
    setSelectedClient(client)
    setDetailsOpen(true)
  }

  const confirmDelete = (client: Client) => {
    setClientToDelete(client)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Clientes</h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            Gerencie sua base de clientes
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 size-4" />
            <span className="hidden md:inline">Exportar</span> PDF
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <FileSpreadsheet className="mr-2 size-4" />
            <span className="hidden md:inline">Exportar</span> Excel
          </Button>
          <Button size="sm" onClick={openNewDialog}>
            <Plus className="mr-2 size-4" />
            <span className="hidden sm:inline">Novo Cliente</span>
            <span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </div>

      {/* Search and filters */}
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
      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Contato</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead className="text-center hidden md:table-cell">Pontos</TableHead>
              <TableHead className="hidden lg:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Data Cadastro</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="font-medium">{client.name}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col gap-0.5 text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Phone className="size-3" />
                        {client.phone}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Mail className="size-3" />
                        {client.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {client.subscription ? (
                      (() => {
                        const plan = subscriptionPlans.find(p => p.id === client.subscription?.planId)
                        const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
                        return plan ? (
                          <div className="space-y-1">
                            <Badge variant="outline" className="gap-1 text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                              <Crown className="size-3" />
                              {plan.name}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {plan.allowedDays.map(d => dayNames[d]).join(' e ')}
                            </div>
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                'text-xs',
                                client.subscription.usedThisWeek >= plan.usageLimit 
                                  ? 'bg-red-500/10 text-red-600' 
                                  : 'bg-emerald-500/10 text-emerald-600'
                              )}
                            >
                              ({client.subscription.usedThisWeek}/{plan.usageLimit})
                            </Badge>
                          </div>
                        ) : null
                      })()
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="size-3 fill-amber-500 text-amber-500" />
                      <span className="font-medium">{client.points}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge
                      variant={client.status === 'active' ? 'default' : 'secondary'}
                      className={cn(
                        client.status === 'active' && 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
                        client.status === 'inactive' && 'bg-muted text-muted-foreground'
                      )}
                    >
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(client.createdAt), 'dd/MM/yyyy')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openDetails(client)}>
                          <Eye className="mr-2 size-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(client)}>
                          <Pencil className="mr-2 size-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => confirmDelete(client)}
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

      {/* Pagination info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Mostrando {filteredClients.length} de {clients.length} clientes</span>
      </div>

      {/* Dialogs */}
      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={editMode ? selectedClient : null}
        onSave={editMode ? handleUpdateClient : handleAddClient}
      />

      <ClientDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        client={selectedClient}
        onEdit={() => {
          setDetailsOpen(false)
          setEditMode(true)
          setDialogOpen(true)
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cliente?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O cliente{' '}
              <strong>{clientToDelete?.name}</strong> será permanentemente removido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
