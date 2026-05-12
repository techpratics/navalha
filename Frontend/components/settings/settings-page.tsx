"use client"

import { useState, useEffect } from "react"
import {
  Building2,
  Clock,
  Bell,
  Palette,
  CreditCard,
  Save,
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useSidebarColor, sidebarColors, SidebarColor } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { sidebarColor, setSidebarColor } = useSidebarColor()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const [businessSettings, setBusinessSettings] = useState({
    name: "Alabama Barbers",
    cnpj: "12.345.678/0001-90",
    phone: "(11) 99999-9999",
    email: "seuemail@gmail.com",
    address: "Rua das Flores, 123 - Centro",
    city: "Fortaleza",
    state: "CE",
    cep: "01234-567",
    description: "A melhor barbearia da cidade, com profissionais qualificados e ambiente moderno.",
  })

  const [scheduleSettings, setScheduleSettings] = useState({
    openTime: "09:00",
    closeTime: "20:00",
    slotDuration: 30,
    advanceBookingDays: 30,
    allowSameDayBooking: true,
    requireConfirmation: false,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderHours: 24,
    sendConfirmation: true,
    sendReminder: true,
    sendFollowUp: false,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCredit: true,
    acceptDebit: true,
    acceptPix: true,
    pixKey: "seuemail@gmail.com",
    requirePaymentUpfront: false,
    cancellationFee: 0,
  })

  const handleSaveSettings = () => {
    alert("Configurações salvas com sucesso!")
  }

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Configurações</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Gerencie as configurações do seu estabelecimento
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-5">
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Horários</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 hidden lg:flex">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2 hidden lg:flex">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Pagamentos</span>
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tema do Sistema</CardTitle>
              <CardDescription>
                Escolha entre tema claro, escuro ou automático
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-primary",
                    mounted && theme === "light" ? "border-primary bg-primary/5" : "border-muted"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Sun className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Claro</span>
                  {mounted && theme === "light" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-primary",
                    mounted && theme === "dark" ? "border-primary bg-primary/5" : "border-muted"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                    <Moon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Escuro</span>
                  {mounted && theme === "dark" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-lg border-2 p-4 transition-all hover:border-primary",
                    mounted && theme === "system" ? "border-primary bg-primary/5" : "border-muted"
                  )}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-slate-800 text-slate-600">
                    <Monitor className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Sistema</span>
                  {mounted && theme === "system" && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cor da Barra Lateral</CardTitle>
              <CardDescription>
                Personalize a cor do menu lateral do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
                {(Object.keys(sidebarColors) as SidebarColor[]).map((colorKey) => (
                  <button
                    key={colorKey}
                    onClick={() => setSidebarColor(colorKey)}
                    className={cn(
                      "group flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:border-primary",
                      mounted && sidebarColor === colorKey ? "border-primary bg-primary/5" : "border-muted"
                    )}
                  >
                    <div 
                      className="h-10 w-10 rounded-lg shadow-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: sidebarColors[colorKey].bg }}
                    />
                    <span className="text-xs font-medium">{sidebarColors[colorKey].label}</span>
                    {mounted && sidebarColor === colorKey && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Estabelecimento</CardTitle>
              <CardDescription>
                Dados básicos que aparecem para seus clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome do Estabelecimento</Label>
                  <Input
                    id="businessName"
                    value={businessSettings.name}
                    onChange={(e) =>
                      setBusinessSettings({ ...businessSettings, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={businessSettings.cnpj}
                    onChange={(e) =>
                      setBusinessSettings({ ...businessSettings, cnpj: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={businessSettings.phone}
                    onChange={(e) =>
                      setBusinessSettings({ ...businessSettings, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessSettings.email}
                    onChange={(e) =>
                      setBusinessSettings({ ...businessSettings, email: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={businessSettings.address}
                  onChange={(e) =>
                    setBusinessSettings({ ...businessSettings, address: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={businessSettings.city}
                    onChange={(e) =>
                      setBusinessSettings({ ...businessSettings, city: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={businessSettings.state}
                    onChange={(e) =>
                      setBusinessSettings({ ...businessSettings, state: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={businessSettings.cep}
                    onChange={(e) =>
                      setBusinessSettings({ ...businessSettings, cep: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={businessSettings.description}
                  onChange={(e) =>
                    setBusinessSettings({ ...businessSettings, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>
                Configure os horários de atendimento e regras de agendamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="openTime">Horário de Abertura</Label>
                  <Input
                    id="openTime"
                    type="time"
                    value={scheduleSettings.openTime}
                    onChange={(e) =>
                      setScheduleSettings({ ...scheduleSettings, openTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeTime">Horário de Fechamento</Label>
                  <Input
                    id="closeTime"
                    type="time"
                    value={scheduleSettings.closeTime}
                    onChange={(e) =>
                      setScheduleSettings({ ...scheduleSettings, closeTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="slotDuration">Duração do Slot (minutos)</Label>
                  <Select
                    value={scheduleSettings.slotDuration.toString()}
                    onValueChange={(value) =>
                      setScheduleSettings({
                        ...scheduleSettings,
                        slotDuration: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advanceBookingDays">
                    Antecedência Máxima (dias)
                  </Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    min="1"
                    max="90"
                    value={scheduleSettings.advanceBookingDays}
                    onChange={(e) =>
                      setScheduleSettings({
                        ...scheduleSettings,
                        advanceBookingDays: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Permitir Agendamento no Mesmo Dia</Label>
                    <p className="text-sm text-muted-foreground">
                      Clientes podem agendar para hoje
                    </p>
                  </div>
                  <Switch
                    checked={scheduleSettings.allowSameDayBooking}
                    onCheckedChange={(checked) =>
                      setScheduleSettings({
                        ...scheduleSettings,
                        allowSameDayBooking: checked,
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exigir Confirmação Manual</Label>
                    <p className="text-sm text-muted-foreground">
                      Agendamentos precisam ser confirmados por um funcionário
                    </p>
                  </div>
                  <Switch
                    checked={scheduleSettings.requireConfirmation}
                    onCheckedChange={(checked) =>
                      setScheduleSettings({
                        ...scheduleSettings,
                        requireConfirmation: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Notificação</CardTitle>
              <CardDescription>
                Configure como você e seus clientes recebem notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar confirmações e lembretes por e-mail
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembretes por SMS (custo adicional)
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações no navegador e app
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Notificação</CardTitle>
              <CardDescription>
                Escolha quais notificações enviar automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Confirmação de Agendamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar quando um agendamento for criado
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.sendConfirmation}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      sendConfirmation: checked,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembrete de Agendamento</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar lembrete antes do horário marcado
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.sendReminder}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      sendReminder: checked,
                    })
                  }
                />
              </div>
              {notificationSettings.sendReminder && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="reminderHours">Enviar lembrete com antecedência de</Label>
                  <Select
                    value={notificationSettings.reminderHours.toString()}
                    onValueChange={(value) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        reminderHours: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hora</SelectItem>
                      <SelectItem value="2">2 horas</SelectItem>
                      <SelectItem value="24">24 horas</SelectItem>
                      <SelectItem value="48">48 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pesquisa de Satisfação</Label>
                  <p className="text-sm text-muted-foreground">
                    Enviar pesquisa após o atendimento
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.sendFollowUp}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      sendFollowUp: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento Aceitas</CardTitle>
              <CardDescription>
                Configure quais métodos de pagamento você aceita
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dinheiro</Label>
                </div>
                <Switch
                  checked={paymentSettings.acceptCash}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, acceptCash: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cartão de Crédito</Label>
                </div>
                <Switch
                  checked={paymentSettings.acceptCredit}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, acceptCredit: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cartão de Débito</Label>
                </div>
                <Switch
                  checked={paymentSettings.acceptDebit}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, acceptDebit: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Pix</Label>
                </div>
                <Switch
                  checked={paymentSettings.acceptPix}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({ ...paymentSettings, acceptPix: checked })
                  }
                />
              </div>
              {paymentSettings.acceptPix && (
                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave Pix</Label>
                  <Input
                    id="pixKey"
                    value={paymentSettings.pixKey}
                    onChange={(e) =>
                      setPaymentSettings({ ...paymentSettings, pixKey: e.target.value })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Regras de Pagamento</CardTitle>
              <CardDescription>
                Configure as políticas de pagamento do estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Exigir Pagamento Antecipado</Label>
                  <p className="text-sm text-muted-foreground">
                    Cliente deve pagar ao agendar
                  </p>
                </div>
                <Switch
                  checked={paymentSettings.requirePaymentUpfront}
                  onCheckedChange={(checked) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      requirePaymentUpfront: checked,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cancellationFee">Taxa de Cancelamento (%)</Label>
                <Input
                  id="cancellationFee"
                  type="number"
                  min="0"
                  max="100"
                  value={paymentSettings.cancellationFee}
                  onChange={(e) =>
                    setPaymentSettings({
                      ...paymentSettings,
                      cancellationFee: parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Porcentagem cobrada em caso de cancelamento tardio
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
