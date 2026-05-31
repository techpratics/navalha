import type { UserRole } from '../../types/auth'

interface RoleSelectorProps {
  selected: UserRole
  onChange: (role: UserRole) => void
}

const roles: { value: UserRole; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'professional', label: 'Profissional' },
  { value: 'client', label: 'Cliente' },
]

export default function RoleSelector({ selected, onChange }: RoleSelectorProps) {
  return (
    <div
      style={{ backgroundColor: 'var(--bg-elevated)' }}
      className="flex rounded-lg p-1 mb-6"
    >
      {roles.map(r => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          style={
            selected === r.value
              ? { backgroundColor: 'var(--bg-overlay)', color: 'var(--text-primary)' }
              : { color: 'var(--text-secondary)' }
          }
          className="flex-1 py-2 text-sm rounded-md transition-colors hover:opacity-80 font-medium"
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}