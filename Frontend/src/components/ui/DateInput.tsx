import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

interface DateInputProps {
  label?: string
  value: string        // YYYY-MM-DD (formato backend)
  onChange: (isoDate: string) => void  // emite YYYY-MM-DD
  error?: string
  className?: string
}

function isoToDisplay(iso: string): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

function displayToIso(display: string): string {
  if (!display || display.length !== 10) return ''
  const [day, month, year] = display.split('/')
  if (!day || !month || !year || year.length !== 4) return ''
  return `${year}-${month}-${day}`
}

function applyMask(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.substring(0, 2)}/${digits.substring(2)}`
  return `${digits.substring(0, 2)}/${digits.substring(2, 4)}/${digits.substring(4, 8)}`
}

export default function DateInput({ label, value, onChange, error, className = '' }: DateInputProps) {
  const [display, setDisplay] = useState(() => isoToDisplay(value))

  // Sincroniza quando o pai muda o valor externamente para um ISO completo (ex: reagendar)
  useEffect(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const asDisplay = isoToDisplay(value)
      if (display !== asDisplay) setDisplay(asDisplay)
    }
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = applyMask(e.target.value)
    setDisplay(masked)

    if (masked.length === 10) {
      onChange(displayToIso(masked) || '')
    } else {
      onChange('')
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
        </div>
        <input
          type="text"
          inputMode="numeric"
          placeholder="DD/MM/AAAA"
          value={display}
          onChange={handleChange}
          maxLength={10}
          style={{
            backgroundColor: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            borderColor: error ? '#ef4444' : 'var(--border)',
          }}
          className={`w-full rounded-lg pl-10 py-3 text-sm outline-none border focus:border-amber-500 transition-colors ${className}`}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1">{error}</span>
      )}
    </div>
  )
}
