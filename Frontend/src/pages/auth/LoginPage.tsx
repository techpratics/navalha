import { useState } from 'react'
import type { LoginFormData } from '../../types/auth'
import { Eye, EyeOff } from 'lucide-react'
import Logo from '../../components/auth/Logo'
import RoleSelector from '../../components/auth/RoleSelector'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'admin',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    console.log('Login:', form)
    // aqui vai chamar o service quando conectar com o back
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">

      <Logo />

      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8">
        <h2 className="text-white text-xl font-semibold mb-1">Entrar na sua conta</h2>
        <p className="text-zinc-400 text-sm mb-6">Selecione o tipo de acesso e digite suas credenciais</p>

        <RoleSelector
          selected={form.role}
          onChange={role => setForm(f => ({ ...f, role }))}
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />

          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <label className="text-white text-sm font-medium">Senha</label>
              <button type="button" className="text-zinc-400 text-sm hover:text-white">
                Esqueceu a senha?
              </button>
            </div>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="text-zinc-400 hover:text-white text-sm"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={e => setForm(f => ({ ...f, rememberMe: e.target.checked }))}
              className="accent-amber-500"
            />
            <span className="text-zinc-400 text-sm">Manter conectado</span>
          </label>

          <Button type="submit" variant="primary">
            Entrar
          </Button>

        </form>
      </div>

      <p className="text-zinc-600 text-xs mt-8">© 2026 BarberPro. Todos os direitos reservados.</p>
    </div>
  )
}