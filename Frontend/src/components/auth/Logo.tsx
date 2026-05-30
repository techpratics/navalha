import { Scissors } from 'lucide-react'

export default function Logo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mb-4">
        <Scissors size={28} className="text-black" />
      </div>
      <h1 className="text-white text-2xl font-bold">Navalha</h1>
      <p className="text-zinc-400 text-sm mt-1">Sistema de Gestao para Barbearias</p>
    </div>
  )
}