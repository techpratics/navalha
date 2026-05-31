import ClientLayout from '../../components/layout/ClientLayout'
import Step1DateTime from './steps/Step1DateTime'
import Step2Professional from './steps/Step2Professional'
import Step3Service from './steps/Step3Service'
import Step4Confirm from './steps/Step4Confirm'
import Stepper from '../../components/booking/Stepper'
import { useBooking } from '../../hooks/useBooking'

const stepLabels = ['Data/Hora', 'Profissional', 'Servico', 'Confirmar']

export default function BookingPage() {
  const { booking, nextStep, prevStep } = useBooking()

  return (
    <ClientLayout>
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">Agendar Horario</h1>
        </div>
        <span
          style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }}
          className="text-xs bg-amber-500/10 border px-2 py-0.5 rounded-full"
        >
          ✦ Premium · (1/2 usos)
        </span>
      </div>

      <Stepper steps={stepLabels} currentStep={booking.step} />

      {booking.step === 1 && <Step1DateTime booking={booking} onNext={nextStep} />}
      {booking.step === 2 && <Step2Professional booking={booking} onNext={nextStep} onBack={prevStep} />}
      {booking.step === 3 && <Step3Service booking={booking} onNext={nextStep} onBack={prevStep} />}
      {booking.step === 4 && <Step4Confirm booking={booking} onBack={prevStep} />}
    </ClientLayout>
  )
}