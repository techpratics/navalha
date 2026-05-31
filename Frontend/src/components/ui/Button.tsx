interface ButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit'
  variant?: 'primary' | 'ghost'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  className = '',
  disabled = false
}: ButtonProps) {
  const base = 'w-full py-3 rounded-lg font-semibold text-sm transition-colors'

  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-black',
    ghost: 'bg-zinc-800 hover:bg-zinc-700 text-white',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  )
}