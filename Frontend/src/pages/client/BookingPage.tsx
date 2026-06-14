import ClientLayout from '../../components/layout/ClientLayout'
import Step1Service from './steps/Step1Service' 
import Step2DateTime from './steps/Step2DateTime'
import Step3Confirm from './steps/Step3Confirm'
import Step4Success from './steps/Step4Success'
import Stepper from '../../components/booking/Stepper'
import { useBooking } from '../../hooks/useBooking'

const stepLabels = ['Serviço', 'Data e Horário', 'Confirmar']

export default function BookingPage() {
  const { booking, nextStep, prevStep } = useBooking()

  return (
    <ClientLayout>
      {/* ORQUESTRADOR DE PASSOS */}
      {booking.step < 4 && (
        <>
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h1 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">Agendar Horário</h1>
            </div>
            <span
              style={{ color: 'var(--brand)', borderColor: 'var(--brand)' }}
              className="text-xs bg-amber-500/10 border px-2 py-0.5 rounded-full"
            >
              ✦ Premium · (1/2 usos)
            </span>
          </div>

          <Stepper steps={stepLabels} currentStep={booking.step} />
        </>
      )}

      {booking.step === 1 && <Step1Service booking={booking} onNext={nextStep} />}
      {booking.step === 2 && <Step2DateTime booking={booking} onNext={nextStep} onBack={prevStep} />}
      {booking.step === 3 && <Step3Confirm booking={booking} onBack={prevStep} onNext={() => nextStep({})} />}
      {booking.step === 4 && <Step4Success />}
      
    </ClientLayout>
  )
}