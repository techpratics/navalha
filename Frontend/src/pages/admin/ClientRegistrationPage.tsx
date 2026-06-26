import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { UserPlus, CheckCircle2 } from 'lucide-react'
import { clientService } from '../../services/client.service'
import DateInput from '../../components/ui/DateInput'

export default function ClientRegistrationPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    senha: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.name) newErrors.name = 'Nome é obrigatório'
    if (!form.phone) newErrors.phone = 'Telefone é obrigatório'
    if (!form.email) newErrors.email = 'Email é obrigatório'
    if (!form.cpf) newErrors.cpf = 'CPF é obrigatório'
    if (!form.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'
    if (!form.senha) newErrors.senha = 'Senha é obrigatória'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await clientService.createClient({
        nome: form.name,
        telefone: form.phone,
        dataNascimento: form.dataNascimento,
        cpf: form.cpf,
        email: form.email,
        senha: form.senha,
      })
      setSuccess(true)
      setForm({ name: '', phone: '', email: '', cpf: '', dataNascimento: '', senha: '' })
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.erro || 'Erro ao realizar o cadastro.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center md:text-left">
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Cadastrar Novo Cliente</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Preencha as informações abaixo para adicionar um cliente à base
          </p>
        </div>

        <div
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          className="rounded-2xl border p-6 md:p-8"
        >
          {success ? (
            <div className="flex flex-col items-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2">Cliente Cadastrado!</h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
                O cliente foi salvo com sucesso na base de dados.
              </p>
              <Button onClick={() => setSuccess(false)} variant="primary">
                Cadastrar Outro
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <Input
                    label="Nome Completo"
                    placeholder="Ex: João da Silva"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    error={errors.name}
                  />
                </div>

                <Input
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))}
                  error={errors.cpf}
                />

                <Input
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  error={errors.phone}
                />

                <div className="md:col-span-2">
                  <Input
                    label="E-mail"
                    type="email"
                    placeholder="cliente@email.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    error={errors.email}
                  />
                </div>

                <DateInput
                  label="Data de Nascimento"
                  value={form.dataNascimento}
                  onChange={iso => setForm(f => ({ ...f, dataNascimento: iso }))}
                  error={errors.dataNascimento}
                />

                <Input
                  label="Senha"
                  type="password"
                  placeholder="Senha de acesso do cliente"
                  value={form.senha}
                  onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                  error={errors.senha}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  <UserPlus size={18} className="mr-2" />
                  {loading ? 'Salvando...' : 'Finalizar Cadastro'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
