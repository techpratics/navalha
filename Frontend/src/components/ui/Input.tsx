interface InputProps {
  label?: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  rightElement?: React.ReactNode
  className?: string
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  rightElement,
  className = '',
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border)',
          }}
          className={`w-full rounded-lg px-4 py-3 text-sm outline-none border focus:border-amber-500 transition-colors ${className}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}