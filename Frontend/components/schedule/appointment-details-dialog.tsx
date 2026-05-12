'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  User, 
  Clock, 
  Calendar, 
  DollarSign, 
  Scissors,
  UserCircle,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Appointment } from '@/lib/types'

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onUpdate: (appointment: Appointment) => void
  onDelete: (id: string) => void
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointment,
  onUpdate,
  onDelete,
}: AppointmentDetailsDialogProps) {
  if (!appointment) return null

  const handleStatusChange = (status: Appointment['status']) => {
    onUpdate({ ...appointment, status })
  }

  const handleDelete = () => {
    onDelete(appointment.id)
    onOpenChange(false)
  }

  const statusConfig = {
    confirmed: { label: 'Confirmado', color: 'bg-emerald-500', icon: CheckCircle },
    pending: { label: 'Pendente', color: 'bg-amber-500', icon: AlertCircle },
    cancelled: { label: 'Cancelado', color: 'bg-red-500', icon: XCircle },
    completed: { label: 'Concluído', color: 'bg-blue-500', icon: CheckCircle },
  }

  const currentStatus = statusConfig[appointment.status]
  const StatusIcon = currentStatus.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusIcon className={cn('size-5', 
              appointment.status === 'confirmed' && 'text-emerald-500',
              appointment.status === 'pending' && 'text-amber-500',
              appointment.status === 'cancelled' && 'text-red-500',
              appointment.status === 'completed' && 'text-blue-500'
            )} />
            Detalhes do Agendamento
          </DialogTitle>
          <DialogDescription>
            <Badge 
              variant="outline" 
              className={cn(
                'mt-1',
                appointment.status === 'confirmed' && 'border-emerald-500 text-emerald-600',
                appointment.status === 'pending' && 'border-amber-500 text-amber-600',
                appointment.status === 'cancelled' && 'border-red-500 text-red-600',
                appointment.status === 'completed' && 'border-blue-500 text-blue-600'
              )}
            >
              {currentStatus.label}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Client */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <User className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{appointment.clientName}</p>
            </div>
          </div>

          {/* Service */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <Scissors className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Serviço</p>
              <p className="font-medium">{appointment.serviceName}</p>
            </div>
          </div>

          {/* Professional */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <UserCircle className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profissional</p>
              <p className="font-medium">{appointment.professionalName}</p>
            </div>
          </div>

          <Separator />

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Calendar className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">
                  {format(new Date(appointment.date + 'T12:00:00'), "dd 'de' MMMM", { locale: ptBR })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <Clock className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Horário</p>
                <p className="font-medium">{appointment.startTime} - {appointment.endTime}</p>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <DollarSign className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor</p>
              <p className="text-lg font-semibold">R$ {appointment.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="text-sm">{appointment.notes}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Status actions */}
        {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Alterar Status</p>
            <div className="flex flex-wrap gap-2">
              {appointment.status !== 'confirmed' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => handleStatusChange('confirmed')}
                >
                  <CheckCircle className="mr-1 size-4" />
                  Confirmar
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline"
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
                onClick={() => handleStatusChange('completed')}
              >
                <CheckCircle className="mr-1 size-4" />
                Concluir
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => handleStatusChange('cancelled')}
              >
                <XCircle className="mr-1 size-4" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Excluir Agendamento
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O agendamento será permanentemente removido.
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
