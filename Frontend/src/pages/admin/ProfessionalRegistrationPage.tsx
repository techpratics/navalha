import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { UserCheck, CheckCircle2, Briefcase } from 'lucide-react'
import { useProfessionals } from '../../hooks/useProfessionals'

export default function ProfessionalRegistrationPage() {
  const { addProfessional } = useProfessionals()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const newErrors: Record<string, string> = {}
    if (!form.name) newErrors.name = 'Nome é obrigatório'
    if (!form.email) newErrors.email = 'Email é obrigatório'
    if (!form.phone) newErrors.phone = 'Telefone é obrigatório'
    if (!form.specialty) newErrors.specialty = 'Especialidade é obrigatória'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setTimeout(() => {
      addProfessional(form)
      setLoading(false)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', specialty: '' })
      setTimeout(() => setSuccess(false), 3000)
    }, 1000)
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
                  placeholder="(00) 00000-0000"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  error={errors.phone}
                />
              </div>

              <Input
                label="Especialidade"
                placeholder="Ex: Cabelo, Barba, Visagismo"
                value={form.specialty}
                onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))}
                error={errors.specialty}
                leftElement={<Briefcase size={16} style={{ color: 'var(--text-muted)' }} />}
              />

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
