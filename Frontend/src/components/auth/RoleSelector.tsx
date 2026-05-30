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
    <div className="flex bg-zinc-800 rounded-lg p-1 mb-6">
      {roles.map(r => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={`flex-1 py-2 text-sm rounded-md transition-colors ${
            selected === r.value
              ? 'bg-zinc-700 text-white font-medium'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  )
}