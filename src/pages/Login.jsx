import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/ui/AuthLayout'
import FormField from '../components/ui/FormField'
import ErrorAlert from '../components/ui/ErrorAlert'

const recursos = [
  'Cadastro de criaturas de todas as espécies',
  'Agenda de atendimentos por turno lunar',
  'Prontuários digitais sigilosos',
]

function PainelEsquerdo() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
        Cuidado especializado<br />para toda criatura
      </h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-10">
        A primeira plataforma de saúde projetada para monstros, criaturas e entidades de todas as origens.
      </p>
      <ul className="space-y-3">
        {recursos.map((r) => (
          <li key={r} className="flex items-start gap-3 text-sm text-slate-400">
            <span className="mt-1 w-1 h-1 rounded-full bg-violet-500 shrink-0" />
            {r}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const { entrar } = useAuth()
  const navigate = useNavigate()

  const fazerLogin = async () => {
    if (!email || !senha) { setErro('Preencha e-mail e senha.'); return }
    setErro(null)
    setCarregando(true)
    try {
      const perfil = await authApi.login({ email, senha })
      entrar(perfil)
      navigate('/')
    } catch (e) {
      setErro(e.response?.data?.mensagem || 'Credenciais inválidas.')
    } finally {
      setCarregando(false)
    }
  }

  const aoTeclar = (e) => e.key === 'Enter' && fazerLogin()

  return (
    <AuthLayout leftContent={<PainelEsquerdo />}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Entrar na plataforma</h1>
        <p className="text-sm text-slate-500 mt-1">Acesso restrito a especialistas cadastrados</p>
      </div>

      <ErrorAlert message={erro} />

      <div className="space-y-4">
        <FormField
          label="E-mail"
          type="email"
          placeholder="Preencha seu e-mail..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={aoTeclar}
          autoComplete="email"
        />
        <FormField
          label="Senha"
          type="password"
          placeholder="Preencha sua senha..."
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={aoTeclar}
          autoComplete="current-password"
        />
      </div>

      <button onClick={fazerLogin} disabled={carregando} className="btn-primary mt-6">
        {carregando ? 'Verificando...' : 'Entrar'}
      </button>

      <p className="mt-6 text-center text-sm text-slate-500">
        Novo especialista?{' '}
        <Link to="/registrar" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Registrar conta
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-slate-500">
        É paciente?{' '}
        <Link to="/registrar-paciente" className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          Criar conta de paciente
        </Link>
      </p>
    </AuthLayout>
  )
}
