import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { medicoApi } from '../services/api'
import Badge from '../components/ui/Badge'

export default function PerfilMedico() {
  const { perfil } = useAuth()
  const [medico, setMedico] = useState(null)
  const [todasEspecialidades, setTodasEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!perfil?.id) return

    Promise.all([
      medicoApi.getPerfil(perfil.id),
      medicoApi.getEspecialidades()
    ])
      .then(([dadosMedico, listaEspecialidades]) => {
        setMedico(dadosMedico)
        setTodasEspecialidades(listaEspecialidades)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Falha ao carregar os dados do perfil ou especialidades.')
        setLoading(false)
      })
  }, [perfil?.id])

  const handleAddEspecialidade = async (espId) => {
    try {
      setError(null)
      await medicoApi.addEspecialidade(perfil.id, espId)
      const espAdicionada = todasEspecialidades.find((e) => e.id === espId)
      setMedico((prev) => ({
        ...prev,
        especialidades: [...prev.especialidades, espAdicionada]
      }))
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Falha ao adicionar a especialidade.')
    }
  }

  const handleRemoveEspecialidade = async (espId) => {
    try {
      setError(null)
      await medicoApi.removeEspecialidade(perfil.id, espId)
      setMedico((prev) => ({
        ...prev,
        especialidades: prev.especialidades.filter((e) => e.id !== espId)
      }))
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Falha ao remover a especialidade.')
    }
  }

  if (loading) {
    return <div className="text-slate-400">Carregando perfil...</div>
  }

  if (!medico) {
    return <div className="text-red-400">Médico não encontrado.</div>
  }

  const especialidadesAssociadasIds = medico.especialidades?.map(e => e.id) || []
  
  const especialidadesAssociadas = medico.especialidades || []
  const especialidadesDisponiveis = todasEspecialidades.filter(
    (e) => !especialidadesAssociadasIds.includes(e.id)
  )

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Perfil do Médico</h1>
        <div className="flex flex-col gap-1 text-slate-300">
          <p><span className="font-semibold text-slate-400">Nome:</span> {medico.nome}</p>
          <p><span className="font-semibold text-slate-400">E-mail:</span> {medico.email}</p>
          <p><span className="font-semibold text-slate-400">CRM:</span> {medico.registroConselho}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/50 border border-red-900/50 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Minhas Especialidades</h2>
          {especialidadesAssociadas.length === 0 ? (
            <p className="text-sm text-slate-500">Nenhuma especialidade associada.</p>
          ) : (
            <ul className="space-y-3">
              {especialidadesAssociadas.map((esp) => (
                <li key={esp.id} className="flex items-center justify-between bg-[#1e1c3a] p-3 rounded-lg border border-slate-800/50">
                  <span className="text-slate-200 text-sm font-medium">{esp.nome}</span>
                  <button
                    onClick={() => handleRemoveEspecialidade(esp.id)}
                    className="text-xs px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Especialidades Disponíveis</h2>
          {especialidadesDisponiveis.length === 0 ? (
            <p className="text-sm text-slate-500">Você já possui todas as especialidades.</p>
          ) : (
            <ul className="space-y-3">
              {especialidadesDisponiveis.map((esp) => (
                <li key={esp.id} className="flex items-center justify-between bg-[#1e1c3a] p-3 rounded-lg border border-slate-800/50">
                  <span className="text-slate-200 text-sm font-medium">{esp.nome}</span>
                  <button
                    onClick={() => handleAddEspecialidade(esp.id)}
                    className="text-xs px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-md transition-colors"
                  >
                    Adicionar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
