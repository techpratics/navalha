import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { UserCheck, CheckCircle2, Calendar } from 'lucide-react'
import { useProfessionals } from '../../hooks/useProfessionals'

export default function ProfessionalRegistrationPage() {
  const { addProfessional } = useProfessionals()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    dataNascimento: '2000-01-01',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.name) newErrors.name = 'Nome é obrigatório'
    if (!form.email) newErrors.email = 'Email é obrigatório'
    if (!form.phone) newErrors.phone = 'Telefone é obrigatório'
    if (!form.cpf) newErrors.cpf = 'CPF é obrigatório'
    if (!form.dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await addProfessional(form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', cpf: '', dataNascimento: '2000-01-01' })
    } catch (err) {
      console.error(err)
      alert('Erro ao realizar o cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-1">Cadastrar Profissional</h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
            Adicione um novo colaborador à equipe da barbearia
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
              <h2 style={{ color: 'var(--text-primary)' }} className="text-xl font-bold mb-2">Profissional Cadastrado!</h2>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mb-6">
                O novo colaborador foi adicionado com sucesso.
              </p>
              <Button onClick={() => setSuccess(false)} variant="primary">
                Cadastrar Outro
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                label="Nome Completo"
                placeholder="Ex: Carlos Barbeiro"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                error={errors.name}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="profissional@navalha.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  error={errors.email}
                />
                <Input
                  label="Telefone"
                  placeholder="(88) 99999-9999"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  error={errors.phone}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="CPF"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))}
                  error={errors.cpf}
                />
                <Input
                  label="Data de Nascimento"
                  type="date"
                  value={form.dataNascimento}
                  onChange={e => setForm(f => ({ ...f, dataNascimento: e.target.value }))}
                  error={errors.dataNascimento}
                  leftElement={<Calendar size={16} style={{ color: 'var(--text-muted)' }} />}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  <UserCheck size={18} className="mr-2" />
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