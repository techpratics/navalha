export default function Logo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 rounded-2xl overflow-hidden mb-4">
        <img src="/alabama_logo.jpeg" alt="Alabama Barbers" className="w-full h-full object-cover" />
      </div>
      <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">Navalha</h1>
      <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1">Sistema de Gestao para Barbearias</p>
    </div>
  )
}