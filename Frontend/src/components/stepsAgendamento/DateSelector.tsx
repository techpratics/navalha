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
          className={`flex flex-col items-center min-w-[64px] py-3 px-2 rounded-xl border transition-colors ${
            d.disabled
              ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
              : selectedDate === d.date
                ? 'border-amber-500 bg-amber-500 text-black'
                : 'border-zinc-700 text-white hover:border-zinc-500'
          }`}
        >
          <span className="text-[10px] font-medium">{d.label}</span>
          <span className="text-xl font-bold">{d.day}</span>
          <span className="text-[10px]">{d.month}</span>
        </button>
      ))}
    </div>
  )
}