interface Day {
  date: string
  label: string
  day: string
  month: string
  disabled?: boolean
}

interface DateSelectorProps {
  days: Day[]
  selectedDate: string
  onSelect: (date: string) => void
}

export default function DateSelector({ days, selectedDate, onSelect }: DateSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map(d => (
        <button
          key={d.date}
          disabled={d.disabled}
          onClick={() => onSelect(d.date)}
          style={
            d.disabled
              ? { borderColor: 'var(--border)', color: 'var(--text-muted)' }
              : selectedDate === d.date
                ? { backgroundColor: 'var(--brand)', borderColor: 'var(--brand)', color: '#000' }
                : { borderColor: 'var(--border)', color: 'var(--text-primary)' }
          }
          className="flex flex-col items-center min-w-[64px] py-3 px-2 rounded-xl border transition-colors disabled:cursor-not-allowed"
        >
          <span className="text-[10px] font-medium">{d.label}</span>
          <span className="text-xl font-bold">{d.day}</span>
          <span className="text-[10px]">{d.month}</span>
        </button>
      ))}
    </div>
  )
}