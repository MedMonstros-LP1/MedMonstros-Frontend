import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { pacienteApi } from '../services/api'

const REGRAS_ESPECIE = {
  FANTASMA: {
    regra: 'Você só pode ser atendido por médicos especializados em entidades etéreas.',
    atributo: (dados) => `Anos assombrando: ${dados.anosAssombrando ?? '—'}`,
  },
  VAMPIRO: {
    regra: 'Suas consultas devem ser agendadas em horários noturnos (18h às 6h).',
    atributo: (dados) => `Tolerância solar: ${dados.toleranciaSolar ? 'Sim' : 'Não'}`,
  },
  LOBISOMEM: {
    regra: 'Você não pode agendar consultas em noites de lua cheia.',
    atributo: (dados) => `Controla transformação: ${dados.controlaTransformacao ? 'Sim' : 'Não'}`,
  },
}

export default function PerfilPaciente() {
  const { perfil } = useAuth()
  const [paciente, setPaciente] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!perfil?.id) return
    pacienteApi.getPerfil(perfil.id)
      .then((dados) => {
        setPaciente(dados)
        setLoading(false)
      })
      .catch(() => {
        setErro('Falha ao carregar os dados do perfil.')
        setLoading(false)
      })
  }, [perfil?.id])

  if (loading) return <div className="text-slate-400">Carregando perfil...</div>
  if (!paciente) return <div className="text-red-400">Paciente não encontrado.</div>

  const especie = paciente.especie?.toUpperCase()
  const infoEspecie = REGRAS_ESPECIE[especie]

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Perfil do Paciente</h1>
        <div className="flex flex-col gap-1 text-slate-300">
          <p><span className="font-semibold text-slate-400">Nome:</span> {paciente.nome}</p>
          <p><span className="font-semibold text-slate-400">E-mail:</span> {paciente.email}</p>
          <p><span className="font-semibold text-slate-400">Espécie:</span> {paciente.especie}</p>
          {infoEspecie && (
            <p><span className="font-semibold text-slate-400">Atributo:</span> {infoEspecie.atributo(paciente)}</p>
          )}
        </div>
      </div>

      {erro && (
        <div className="bg-red-950/50 border border-red-900/50 text-red-200 px-4 py-3 rounded-lg">
          {erro}
        </div>
      )}

      {infoEspecie && (
        <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Regras da Sua Espécie</h2>
          <div className="bg-[#1e1c3a] p-4 rounded-lg border border-slate-800/50">
            <p className="text-slate-300 text-sm leading-relaxed">{infoEspecie.regra}</p>
          </div>
        </div>
      )}
    </div>
  )
}
