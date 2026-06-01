import AdminLayout from '../../components/layout/AdminLayout'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-6">Painel Administrativo</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Bem-vindo de volta! Use o menu lateral para gerenciar clientes e agendamentos.</p>
      </div>
    </AdminLayout>
  )
}
