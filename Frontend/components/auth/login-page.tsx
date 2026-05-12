"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scissors, Eye, EyeOff, Loader2, Shield, User, UserCircle } from "lucide-react"

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loginType, setLoginType] = useState<"admin" | "professional" | "client">("admin")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)
    
    if (!success) {
      setError("Email ou senha incorretos")
    }
    
    setIsLoading(false)
  }

  const handleQuickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail)
    setPassword(userPassword)
    setIsLoading(true)
    setError("")
    
    const success = await login(userEmail, userPassword)
    
    if (!success) {
      setError("Erro ao fazer login")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Background pattern */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
            <Scissors className="size-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Navalha
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sistema de Gestao para Barbearias
          </p>
        </div>

        {/* Login card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
            <CardDescription>
              Selecione o tipo de acesso e digite suas credenciais
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={loginType} onValueChange={(v) => setLoginType(v as typeof loginType)} className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin" className="gap-1.5 text-xs">
                  <Shield className="size-3.5" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="professional" className="gap-1.5 text-xs">
                  <UserCircle className="size-3.5" />
                  Profissional
                </TabsTrigger>
                <TabsTrigger value="client" className="gap-1.5 text-xs">
                  <User className="size-3.5" />
                  Cliente
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={() => {/* Implement forgot password */}}
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground"
                >
                  Manter conectado
                </Label>
              </div>

              <Button
                type="submit"
                className="h-11 w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo credentials based on selected tab */}
        <div className="mt-6 rounded-lg border border-border/50 bg-card/50 p-4">
          <p className="mb-3 text-center text-sm font-medium text-foreground">
            Acesso rapido (demonstracao)
          </p>
          
          {loginType === "admin" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleQuickLogin("admin@barberpro.com", "admin123")}
              disabled={isLoading}
            >
              <Shield className="mr-2 size-4" />
              Entrar como Admin
            </Button>
          )}
          
          {loginType === "professional" && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleQuickLogin("joao.prof@barberpro.com", "joao123")}
                disabled={isLoading}
              >
                <UserCircle className="mr-2 size-4" />
                Entrar como Joao (Barbeiro)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleQuickLogin("pedro.prof@barberpro.com", "pedro123")}
                disabled={isLoading}
              >
                <UserCircle className="mr-2 size-4" />
                Entrar como Pedro (Barbeiro)
              </Button>
            </div>
          )}
          
          {loginType === "client" && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleQuickLogin("joao@email.com", "cliente123")}
                disabled={isLoading}
              >
                <User className="mr-2 size-4" />
                Entrar como Joao (Cliente)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleQuickLogin("maria@email.com", "cliente123")}
                disabled={isLoading}
              >
                <User className="mr-2 size-4" />
                Entrar como Maria (Cliente)
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BarberPro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}
