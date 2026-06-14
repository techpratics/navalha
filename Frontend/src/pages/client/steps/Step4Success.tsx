import { CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../../../components/ui/Button'

export default function Step4Success() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-md mx-auto animate-in fade-in zoom-in duration-300">
      <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={48} />
      </div>
      
      <h2 style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold mb-2">
        Agendamento Confirmado!
      </h2>
      
      <p style={{ color: 'var(--text-secondary)' }} className="mb-8">
        Seu horário foi reservado com sucesso. Você receberá uma notificação em breve com os detalhes.
      </p>

      <Button 
        variant="primary" 
        className="w-full py-4 text-lg font-bold"
        onClick={() => navigate('/client/agendamentos')}
      >
        Continuar
      </Button>
    </div>
  )
}
