'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  FileText,
  Pencil,
  CalendarDays,
} from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { appointments } from '@/lib/mock-data'
import type { Client } from '@/lib/types'

interface ClientDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
  onEdit: () => void
}

export function ClientDetailsDialog({
  open,
  onOpenChange,
  client,
  onEdit,
}: ClientDetailsDialogProps) {
  if (!client) return null

  const clientAppointments = appointments.filter(a => a.clientId === client.id)
  const completedCount = clientAppointments.filter(a => a.status === 'completed').length
  const totalSpent = clientAppointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => sum + a.price, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {client.name}
                <Badge
                  variant={client.status === 'active' ? 'default' : 'secondary'}
                  className={cn(
                    'ml-2',
                    client.status === 'active' && 'bg-emerald-500/10 text-emerald-600',
                  )}
                >
                  {client.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Cliente desde {format(new Date(client.createdAt), "MMMM 'de' yyyy", { locale: ptBR })}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-semibold">
                <Star className="size-5 fill-amber-500 text-amber-500" />
                {client.points}
              </div>
              <p className="text-xs text-muted-foreground">Pontos</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-semibold">{completedCount}</div>
              <p className="text-xs text-muted-foreground">Visitas</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <div className="text-2xl font-semibold">R$ {totalSpent.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">Total Gasto</p>
            </div>
          </div>

          <Separator />

          {/* Contact info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                <Phone className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Telefone</p>
                <p className="text-sm font-medium">{client.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                <Mail className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{client.email}</p>
              </div>
            </div>

            {client.birthDate && (
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <Calendar className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Aniversário</p>
                  <p className="text-sm font-medium">
                    {format(new Date(client.birthDate + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            )}

            {client.address && (
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <MapPin className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Endereço</p>
                  <p className="text-sm font-medium">
                    {client.address.street}, {client.address.number}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {client.address.neighborhood} - {client.address.city}/{client.address.state}
                  </p>
                </div>
              </div>
            )}

            {client.notes && (
              <div className="flex items-start gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                  <FileText className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Observações</p>
                  <p className="text-sm">{client.notes}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Recent appointments */}
          <div>
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="size-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Histórico de Agendamentos</h4>
            </div>
            <ScrollArea className="h-32">
              {clientAppointments.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum agendamento registrado
                </p>
              ) : (
                <div className="space-y-2">
                  {clientAppointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div>
                        <p className="font-medium">{apt.serviceName}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(apt.date + 'T12:00:00'), 'dd/MM/yyyy')} às {apt.startTime}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          apt.status === 'completed' && 'border-blue-500 text-blue-600',
                          apt.status === 'confirmed' && 'border-emerald-500 text-emerald-600',
                          apt.status === 'pending' && 'border-amber-500 text-amber-600',
                          apt.status === 'cancelled' && 'border-red-500 text-red-600',
                        )}
                      >
                        {apt.status === 'completed' && 'Concluído'}
                        {apt.status === 'confirmed' && 'Confirmado'}
                        {apt.status === 'pending' && 'Pendente'}
                        {apt.status === 'cancelled' && 'Cancelado'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            <Pencil className="mr-2 size-4" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
