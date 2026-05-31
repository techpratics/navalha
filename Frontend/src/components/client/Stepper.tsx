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
              <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-colors ${
                isDone
                  ? 'bg-zinc-600 text-white'
                  : isActive
                    ? 'bg-amber-500 text-black'
                    : 'bg-zinc-800 text-zinc-500'
              }`}>
                {isDone ? '✓' : stepNumber}
              </div>
              <span className="text-[10px] md:text-xs text-zinc-400 mt-1 hidden md:block">{label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 md:w-24 h-px mb-0 md:mb-5 mx-1 ${currentStep > stepNumber ? 'bg-amber-500' : 'bg-zinc-700'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}