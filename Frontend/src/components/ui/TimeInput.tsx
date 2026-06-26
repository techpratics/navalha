import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface TimeInputProps {
  value: string          // 'HH:MM'
  onChange: (time: string) => void  // emite 'HH:MM'
  label?: string
  disabled?: boolean
  error?: string
  className?: string
}

function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.substring(0, 2)}:${digits.substring(2, 4)}`
}

function isValidTime(value: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(value)) return false
  const [h, m] = value.split(':').map(Number)
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}

export default function TimeInput({ value, onChange, label, disabled, error, className = '' }: TimeInputProps) {
  const [display, setDisplay] = useState(value || '')

  // Sincroniza quando o pai muda o valor externamente
  useEffect(() => {
    if (value && value !== display) setDisplay(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyMask(e.target.value)
    setDisplay(masked)
    if (masked.length === 5 && isValidTime(masked)) {
      onChange(masked)
    } else if (masked.length < 5) {
      onChange('')
    }
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <input
          type="text"
          inputMode="numeric"
          placeholder="HH:MM"
          value={display}
          onChange={handleChange}
          disabled={disabled}
          maxLength={5}
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            borderColor: error ? '#ef4444' : 'var(--border)',
            opacity: disabled ? 0.5 : 1,
          }}
          className="w-full rounded-lg pl-9 py-3 text-sm outline-none border focus:border-amber-500 transition-colors"
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  )
}
