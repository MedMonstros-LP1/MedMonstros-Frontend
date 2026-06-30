import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { consultaApi } from '../services/api'

export default function PacienteDashboard() {
  const { perfil } = useAuth()
  const [medicos, setMedicos] = useState([])
  const [medicoSelecionado, setMedicoSelecionado] = useState(null)
  const [horarios, setHorarios] = useState([])
  const [horarioSelecionado, setHorarioSelecionado] = useState('')
  const [consultas, setConsultas] = useState([])
  const [erroEspecie, setErroEspecie] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregarDados()
  }, [perfil])

  const eNoturno = (inicio) => {
    const h = new Date(inicio).getHours()
    return h >= 18 || h < 6
  }

  const filtrarHorariosPorEspecie = (lista) => {
    if (perfil?.tipo === 'VAMPIRO') return lista.filter(h => eNoturno(h.inicio))
    if (perfil?.tipo === 'LOBISOMEM') return lista.filter(h => !h.luaCheia)
    return lista
  }

  const carregarDados = async () => {
    try {
      const medicosData = await consultaApi.listarMedicos()
      setMedicos(medicosData)
      if (perfil?.id) {
        const consultasData = await consultaApi.getConsultasPaciente(perfil.id)
        setConsultas(consultasData)
      }
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Erro ao carregar dados.')
    }
  }

  const handleMedicoSelect = async (e) => {
    const medId = parseInt(e.target.value)
    const medico = medicos.find(m => m.id === medId)
    setMedicoSelecionado(medico)
    setHorarioSelecionado('')
    setErroEspecie('')
    setErro('')
    setHorarios([])

    if (!medico) return

    if (perfil?.tipo === 'FANTASMA') {
      const atende = medico.especialidades?.some(esp => esp.atendeEtereos)
      if (!atende) {
        setErroEspecie('Este médico não atende seres etéreos (Fantasmas).')
        return
      }
    }

    try {
      const horariosData = await consultaApi.getHorariosMedico(medico.id)
      setHorarios(filtrarHorariosPorEspecie(horariosData))
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Erro ao buscar horários.')
    }
  }

  const agendar = async () => {
    if (!medicoSelecionado || !horarioSelecionado) return
    setErro('')
    try {
      const novaConsulta = await consultaApi.agendarConsulta({
        pacienteId: perfil.id,
        medicoId: medicoSelecionado.id,
        horarioId: parseInt(horarioSelecionado)
      })
      setConsultas([...consultas, novaConsulta])
      setMedicoSelecionado(null)
      setHorarioSelecionado('')
      setHorarios([])
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Erro ao agendar consulta.')
    }
  }

  const cancelarConsulta = async (id) => {
    setErro('')
    try {
      await consultaApi.atualizarStatus(id, 'cancelar')
      const atualizada = await consultaApi.getConsulta(id)
      setConsultas(consultas.map(c => c.id === id ? atualizada : c))
    } catch (error) {
      setErro(error.response?.data?.mensagem || 'Erro ao cancelar consulta.')
    }
  }

  const bannerRestricao = () => {
    if (perfil?.tipo === 'VAMPIRO') return 'Como vampiro, apenas horários noturnos (18h às 6h) estão disponíveis.'
    if (perfil?.tipo === 'LOBISOMEM') return 'Como lobisomem, horários em noites de lua cheia foram ocultados.'
    return null
  }

  const labelMedico = (m) => {
    if (perfil?.tipo === 'FANTASMA') {
      const atende = m.especialidades?.some(e => e.atendeEtereos)
      return `${m.nome} — ${atende ? 'Atende etéreos' : 'Não atende etéreos'}`
    }
    return m.nome
  }

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Agendar Nova Consulta</h2>
          {perfil?.tipo && perfil.tipo !== 'MEDICO' && (
            <span className="badge badge-purple">{perfil.tipo}</span>
          )}
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm flex items-start gap-2">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{erro}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Selecione o Médico</label>
            <select
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={medicoSelecionado?.id || ''}
              onChange={handleMedicoSelect}
            >
              <option value="">-- Escolha --</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{labelMedico(m)}</option>
              ))}
            </select>
          </div>

          {erroEspecie && (
            <div className="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm flex items-start gap-2">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{erroEspecie}</span>
            </div>
          )}

          {medicoSelecionado && !erroEspecie && (
            <>
              {bannerRestricao() && (
                <div className="p-3 bg-amber-900/30 border border-amber-700 rounded text-amber-200 text-sm">
                  {bannerRestricao()}
                </div>
              )}
              {horarios.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Horários Disponíveis</label>
                  <select
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                    value={horarioSelecionado}
                    onChange={(e) => setHorarioSelecionado(e.target.value)}
                  >
                    <option value="">-- Escolha --</option>
                    {horarios.map(h => (
                      <option key={h.id} value={h.id}>
                        {new Date(h.inicio).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-sm text-amber-300">Nenhum horário disponível compatível com sua espécie para este médico.</p>
              )}
            </>
          )}

          <button
            onClick={agendar}
            disabled={!medicoSelecionado || !horarioSelecionado || !!erroEspecie}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Meu Histórico de Consultas</h2>
        <div className="space-y-3">
          {consultas.length === 0 ? (
            <p className="text-slate-400">Nenhuma consulta encontrada.</p>
          ) : (
            consultas.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                <div>
                  <p className="text-white font-medium">Médico: {c.medico?.nome}</p>
                  <p className="text-sm text-slate-300">Data: {new Date(c.horario?.inicio).toLocaleString()}</p>
                  <p className="text-sm text-slate-400 mt-1">Status: <span className="font-semibold">{c.status}</span></p>
                  {c.tratamento && (
                    <div className="mt-2 text-sm text-purple-300 bg-purple-900/30 p-2 rounded">
                      <p>Tratamento: {c.tratamento.tipo}</p>
                      <p>Custo: R$ {c.tratamento.custo?.toFixed(2)}</p>
                    </div>
                  )}
                </div>
                {(c.status === 'SOLICITADA' || c.status === 'ACEITA') && (
                  <button
                    onClick={() => cancelarConsulta(c.id)}
                    className="px-3 py-1 text-red-400 border border-red-400 rounded hover:bg-red-500 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
