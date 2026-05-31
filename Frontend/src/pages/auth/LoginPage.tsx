import { useState } from 'react'
import { Eye, EyeOff, Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import type { LoginFormData } from '../../types/auth'
import Logo from '../../components/auth/Logo'
import RoleSelector from '../../components/auth/RoleSelector'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useLogin } from '../../hooks/useLogin'

export default function LoginPage() {
  const [form, setForm] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'admin',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading, error } = useLogin()

  const { isDark, toggleTheme } = useTheme()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    login(form)
  }

  return (
    <div
      style={{ backgroundColor: 'var(--bg-base)' }}
      className="min-h-screen flex flex-col items-center justify-center px-4"
    >
      {/* Botão de tema */}
      <button
        onClick={toggleTheme}
        style={{ color: 'var(--text-secondary)' }}
        className="absolute top-4 right-4 hover:opacity-80 transition-colors"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <Logo />

      <div
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        className="w-full max-w-md rounded-2xl border p-8"
      >
        <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-semibold mb-1">
          Entrar na sua conta
        </h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
          Selecione o tipo de acesso e digite suas credenciais
        </p>

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
              <label style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">Senha</label>
              <button type="button" style={{ color: 'var(--text-secondary)' }} className="text-sm hover:opacity-80">
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
                  style={{ color: 'var(--text-secondary)' }}
                  className="hover:opacity-80"
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
            <span style={{ color: 'var(--text-secondary)' }} className="text-sm">Manter conectado</span>
          </label>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

        </form>
      </div>

      <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-8">
        © 2026 BarberPro. Todos os direitos reservados.
      </p>
    </div>
  )
}