import { useAuth } from '../context/AuthContext'
import MedicoDashboard from './MedicoDashboard'
import PacienteDashboard from './PacienteDashboard'

function saudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Home() {
  const { perfil } = useAuth()

  return (
    <div className="animate-fade-in space-y-6">
      <div className="welcome-banner bg-slate-800/50 p-6 rounded-lg border border-slate-700">
        <p className="text-xs text-slate-500 mb-1">{saudacao()},</p>
        <h1 className="text-2xl font-bold text-white mb-2">
          {perfil?.tipo === 'MEDICO' ? `Dr. ${perfil?.nome}` : perfil?.nome}
        </h1>
        <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
          Bem-vindo ao MedMonstros.
        </p>
      </div>
      
      {perfil?.tipo === 'MEDICO' ? <MedicoDashboard /> : <PacienteDashboard />}
    </div>
  )
}
