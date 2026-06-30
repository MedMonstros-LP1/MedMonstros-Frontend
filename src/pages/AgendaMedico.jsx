import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { horarioApi } from '../services/api'
import ErrorAlert from '../components/ui/ErrorAlert'

function formatarDataHora(iso) {
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toLocalISOString(dateStr) {
  // dateStr vem do input datetime-local como "2025-03-15T14:30"
  // O backend espera LocalDateTime, então mandamos sem timezone
  return dateStr + ':00'
}

function CardHorario({ horario, onRemover, removendo }) {
  const livre = !horario.ocupado

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
        livre
          ? 'bg-[#1e1c3a] border-slate-800/50'
          : 'bg-[#1a1830] border-amber-900/30'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${
              livre ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`text-xs font-semibold uppercase tracking-wide ${
              livre ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {livre ? 'Livre' : 'Ocupado'}
          </span>
          {horario.luaCheia && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              🌕 Lua cheia
            </span>
          )}
        </div>
        <p className="text-sm text-slate-200">
          {formatarDataHora(horario.inicio)} — {formatarDataHora(horario.fim)}
        </p>
      </div>

      {livre && (
        <button
          onClick={() => onRemover(horario.id)}
          disabled={removendo === horario.id}
          className="ml-4 text-xs px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors disabled:opacity-50"
        >
          {removendo === horario.id ? 'Removendo...' : 'Remover'}
        </button>
      )}
    </div>
  )
}

export default function AgendaMedico() {
  const { perfil } = useAuth()
  const [horarios, setHorarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState(null)
  const [removendo, setRemovendo] = useState(null)

  // Estado do formulário
  const [mostrarForm, setMostrarForm] = useState(false)
  const [form, setForm] = useState({ inicio: '', fim: '', luaCheia: false })
  const [erroForm, setErroForm] = useState(null)
  const [criando, setCriando] = useState(false)

  useEffect(() => {
    if (!perfil?.id) return
    horarioApi
      .listarTodos(perfil.id)
      .then(setHorarios)
      .catch(() => setErro('Falha ao carregar os horários.'))
      .finally(() => setLoading(false))
  }, [perfil?.id])

  const remover = async (id) => {
    setErro(null)
    setRemovendo(id)
    try {
      await horarioApi.deletar(id)
      setHorarios((prev) => prev.filter((h) => h.id !== id))
    } catch (e) {
      const msg = e.response?.data?.mensagem || e.response?.data?.message || 'Não foi possível remover o horário.'
      setErro(msg)
    } finally {
      setRemovendo(null)
    }
  }

  const validarForm = () => {
    if (!form.inicio) return 'Preencha a data/hora de início.'
    if (!form.fim) return 'Preencha a data/hora de fim.'
    if (new Date(form.inicio) >= new Date(form.fim)) {
      return 'O início deve ser anterior ao fim.'
    }
    return null
  }

  const criarHorario = async () => {
    const erroValidacao = validarForm()
    if (erroValidacao) {
      setErroForm(erroValidacao)
      return
    }
    setErroForm(null)
    setCriando(true)
    try {
      const novo = await horarioApi.criar({
        medicoId: perfil.id,
        inicio: toLocalISOString(form.inicio),
        fim: toLocalISOString(form.fim),
        luaCheia: form.luaCheia,
      })
      setHorarios((prev) => [...prev, novo])
      setForm({ inicio: '', fim: '', luaCheia: false })
      setMostrarForm(false)
    } catch (e) {
      const msg = e.response?.data?.mensagem || e.response?.data?.message || 'Falha ao criar o horário.'
      setErroForm(msg)
    } finally {
      setCriando(false)
    }
  }

  const livres = horarios.filter((h) => !h.ocupado)
  const ocupados = horarios.filter((h) => h.ocupado)

  if (loading) {
    return <div className="text-slate-400 animate-fade-in">Carregando agenda...</div>
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Minha Agenda</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie seus horários de atendimento
          </p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo horário'}
        </button>
      </div>

      <ErrorAlert message={erro} />

      {/* Formulário de novo horário */}
      {mostrarForm && (
        <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">Cadastrar horário</h2>

          {erroForm && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/40 border border-red-900/40">
              <p className="text-sm text-red-400">{erroForm}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Data/Hora início
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.inicio}
                onChange={(e) => setForm({ ...form, inicio: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Data/Hora fim
              </label>
              <input
                type="datetime-local"
                className="input-field"
                value={form.fim}
                onChange={(e) => setForm({ ...form, fim: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="luaCheia"
              type="checkbox"
              checked={form.luaCheia}
              onChange={(e) => setForm({ ...form, luaCheia: e.target.checked })}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500"
            />
            <label htmlFor="luaCheia" className="text-sm text-slate-300">
              🌕 Noite de lua cheia?
            </label>
          </div>

          <button
            onClick={criarHorario}
            disabled={criando}
            className="btn-primary max-w-xs"
          >
            {criando ? 'Salvando...' : 'Salvar horário'}
          </button>
        </div>
      )}

      {/* Horários livres */}
      <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <h2 className="text-lg font-semibold text-white">
            Horários livres ({livres.length})
          </h2>
        </div>
        {livres.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum horário livre cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {livres.map((h) => (
              <CardHorario
                key={h.id}
                horario={h}
                onRemover={remover}
                removendo={removendo}
              />
            ))}
          </div>
        )}
      </div>

      {/* Horários ocupados */}
      <div className="bg-[#15132b] border border-violet-900/30 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <h2 className="text-lg font-semibold text-white">
            Horários ocupados ({ocupados.length})
          </h2>
        </div>
        {ocupados.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum horário ocupado no momento.</p>
        ) : (
          <div className="space-y-3">
            {ocupados.map((h) => (
              <CardHorario
                key={h.id}
                horario={h}
                onRemover={remover}
                removendo={removendo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
