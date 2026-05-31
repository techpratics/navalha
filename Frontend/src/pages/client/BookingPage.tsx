import ClientLayout from '../../components/layout/ClientLayout'
import Step1DateTime from './steps/Step1DateTime'
import Step2Professional from './steps/Step2Professional'
import Step3Service from './steps/Step3Service'
import Step4Confirm from './steps/Step4Confirm'
import Stepper from '../../components/booking/Stepper'
import { useAgendamento } from '../../hooks/useBookings'


const stepLabels = ['Data/Hora', 'Profissional', 'Servico', 'Confirmar']

export default function AgendamentoPage() {

    const { booking, nextStep, prevStep } = useAgendamento()
    
    return (
        <ClientLayout>
            {/* Título */}
            <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-1">
                <h1 className="text-white text-2xl font-bold">Agendar Horario</h1>
            </div>
            <span className="text-xs bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full">
                ✦ Premium · (1/2 usos)
            </span>
            </div>

            {/* Stepper */}
            <Stepper steps={stepLabels} currentStep={booking.step} />

            {/* Steps */}
            {booking.step === 1 && <Step1DateTime booking={booking} onNext={nextStep} />}
            {booking.step === 2 && <Step2Professional booking={booking} onNext={nextStep} onBack={prevStep} />}
            {booking.step === 3 && <Step3Service booking={booking} onNext={nextStep} onBack={prevStep} />}
            {booking.step === 4 && <Step4Confirm booking={booking} onBack={prevStep} />}
        </ClientLayout>
  )
}