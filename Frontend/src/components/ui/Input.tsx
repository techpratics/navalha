interface InputProps {
  label?: string
  type?: 'text' | 'email' | 'password' | 'time' | 'number' | 'date';
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  rightElement?: React.ReactNode
  leftElement?: React.ReactNode
  className?: string
  required?: boolean;
  error?: string
}

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  rightElement,
  leftElement,
  className = '',
  error,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {leftElement}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            borderColor: error ? '#ef4444' : 'var(--border)',
          }}
          className={`w-full rounded-lg ${leftElement ? 'pl-10' : 'px-4'} py-3 text-sm outline-none border focus:border-amber-500 transition-colors ${className}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  )
}