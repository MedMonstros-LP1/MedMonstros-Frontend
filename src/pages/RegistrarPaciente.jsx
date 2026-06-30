import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/ui/AuthLayout'
import FormField from '../components/ui/FormField'
import ErrorAlert from '../components/ui/ErrorAlert'

const especies = [
  { valor: '', rotulo: 'Selecione sua espécie...' },
  { valor: 'VAMPIRO', rotulo: 'Vampiro' },
  { valor: 'LOBISOMEM', rotulo: 'Lobisomem' },
  { valor: 'FANTASMA', rotulo: 'Fantasma' },
]

const beneficios = [
  'Atendimento especializado para sua espécie',
  'Agendamento online com médicos monstruosos',
  'Prontuário digital seguro e confidencial',
]

function PainelEsquerdo() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
        Cuidamos de todas<br />as criaturas
      </h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-10">
        Registre-se e tenha acesso a especialistas que entendem suas necessidades sobrenaturais.
      </p>
      <ul className="space-y-3">
        {beneficios.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm text-slate-400">
            <span className="mt-1 w-1 h-1 rounded-full bg-violet-500 shrink-0" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

function validarFormulario(formulario) {
  if (!formulario.nome.trim()) return 'Preencha o campo "Nome completo".'
  if (!formulario.email.trim()) return 'Preencha o campo "E-mail".'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)) return 'Informe um e-mail válido.'
  if (!formulario.senha) return 'Preencha o campo "Senha".'
  if (formulario.senha.length < 6) return 'A senha deve ter no mínimo 6 caracteres.'
  if (!formulario.especie) return 'Selecione sua espécie.'
  if (formulario.especie === 'FANTASMA') {
    if (formulario.anosAssombrando === '' || formulario.anosAssombrando === null || formulario.anosAssombrando === undefined) {
      return 'Informe os anos assombrando.'
    }
    if (Number(formulario.anosAssombrando) < 0) {
      return 'Anos assombrando deve ser um valor positivo.'
    }
  }
  return null
}

export default function RegistrarPaciente() {
  const [formulario, setFormulario] = useState({
    nome: '',
    email: '',
    senha: '',
    especie: '',
    toleranciaSolar: false,
    controlaTransformacao: false,
    anosAssombrando: '',
  })
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const { entrar } = useAuth()
  const navigate = useNavigate()

  const atualizar = (chave) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormulario({ ...formulario, [chave]: valor })
  }

  const montarPayload = () => {
    const payload = {
      nome: formulario.nome.trim(),
      email: formulario.email.trim(),
      senha: formulario.senha,
      especie: formulario.especie,
    }
    if (formulario.especie === 'VAMPIRO') {
      payload.toleranciaSolar = formulario.toleranciaSolar
    }
    if (formulario.especie === 'LOBISOMEM') {
      payload.controlaTransformacao = formulario.controlaTransformacao
    }
    if (formulario.especie === 'FANTASMA') {
      payload.anosAssombrando = Number(formulario.anosAssombrando)
    }
    return payload
  }

  const registrar = async () => {
    const erroValidacao = validarFormulario(formulario)
    if (erroValidacao) { setErro(erroValidacao); return }
    setErro(null)
    setCarregando(true)
    try {
      const perfil = await authApi.registrarPaciente(montarPayload())
      entrar(perfil)
      navigate('/')
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Falha no registro. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  const aoTeclar = (e) => e.key === 'Enter' && registrar()

  return (
    <AuthLayout leftContent={<PainelEsquerdo />}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Criar conta de paciente</h1>
        <p className="text-sm text-slate-500 mt-1">Preencha os dados para se registrar na plataforma</p>
      </div>

      <ErrorAlert message={erro} />

      <div className="space-y-4">
        <FormField
          label="Nome completo"
          type="text"
          placeholder="Preencha seu nome..."
          value={formulario.nome}
          onChange={atualizar('nome')}
          onKeyDown={aoTeclar}
        />
        <FormField
          label="E-mail"
          type="email"
          placeholder="Preencha seu e-mail..."
          value={formulario.email}
          onChange={atualizar('email')}
          onKeyDown={aoTeclar}
          autoComplete="email"
        />
        <FormField
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres..."
          value={formulario.senha}
          onChange={atualizar('senha')}
          onKeyDown={aoTeclar}
          autoComplete="new-password"
        />

        {/* Seletor de espécie */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Espécie</label>
          <select
            className="input-field"
            value={formulario.especie}
            onChange={atualizar('especie')}
          >
            {especies.map((e) => (
              <option key={e.valor} value={e.valor}>{e.rotulo}</option>
            ))}
          </select>
        </div>

        {/* Campos dinâmicos por espécie */}
        {formulario.especie === 'VAMPIRO' && (
          <div className="flex items-center gap-3">
            <input
              id="toleranciaSolar"
              type="checkbox"
              checked={formulario.toleranciaSolar}
              onChange={atualizar('toleranciaSolar')}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500"
            />
            <label htmlFor="toleranciaSolar" className="text-sm text-slate-300">
              Tolera luz solar?
            </label>
          </div>
        )}

        {formulario.especie === 'LOBISOMEM' && (
          <div className="flex items-center gap-3">
            <input
              id="controlaTransformacao"
              type="checkbox"
              checked={formulario.controlaTransformacao}
              onChange={atualizar('controlaTransformacao')}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500"
            />
            <label htmlFor="controlaTransformacao" className="text-sm text-slate-300">
              Controla a transformação?
            </label>
          </div>
        )}

        {formulario.especie === 'FANTASMA' && (
          <FormField
            label="Anos assombrando"
            type="number"
            placeholder="Ex: 150"
            value={formulario.anosAssombrando}
            onChange={atualizar('anosAssombrando')}
            onKeyDown={aoTeclar}
            min="0"
          />
        )}
      </div>

      <button onClick={registrar} disabled={carregando} className="btn-primary mt-6">
        {carregando ? 'Registrando...' : 'Criar conta'}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Já tem uma conta?{' '}
        <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  )
}
