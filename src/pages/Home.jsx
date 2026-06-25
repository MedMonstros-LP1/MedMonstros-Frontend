import { useAuth } from '../context/AuthContext'

function saudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function Home() {
  const { perfil } = useAuth()

  return (
    <div className="animate-fade-in">
      <div className="welcome-banner">
        <p className="text-xs text-slate-500 mb-1">{saudacao()},</p>
        <h1 className="text-2xl font-bold text-white mb-2">
          {perfil?.tipo === 'MEDICO' ? `Dr. ${perfil?.nome}` : perfil?.nome}
        </h1>
        <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
          Bem-vindo ao MedMonstros. Os módulos do sistema estão sendo preparados.
        </p>
      </div>
    </div>
  )
}
