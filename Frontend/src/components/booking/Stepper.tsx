interface StepperProps {
  steps: string[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-8 w-full overflow-hidden">
      {steps.map((label, index) => {
        const stepNumber = index + 1
        const isDone = currentStep > stepNumber
        const isActive = currentStep === stepNumber

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                style={
                  isDone
                    ? { backgroundColor: 'var(--bg-overlay)', color: 'var(--text-secondary)' }
                    : isActive
                      ? { backgroundColor: 'var(--brand)', color: '#000' }
                      : { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' }
                }
                className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-colors"
              >
                {isDone ? '✓' : stepNumber}
              </div>
              <span
                style={{ color: 'var(--text-secondary)' }}
                className="text-[10px] md:text-xs mt-1 hidden md:block"
              >
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                style={{ backgroundColor: currentStep > stepNumber ? 'var(--brand)' : 'var(--border)' }}
                className="w-8 md:w-24 h-px mb-0 md:mb-5 mx-1"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}