import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/ui/AuthLayout'
import FormField from '../components/ui/FormField'
import ErrorAlert from '../components/ui/ErrorAlert'

const campos = [
  { label: 'Nome completo',              chave: 'nome',              type: 'text',     placeholder: 'Preencha seu nome...' },
  { label: 'E-mail profissional',        chave: 'email',             type: 'email',    placeholder: 'Preencha seu e-mail...' },
  { label: 'Senha de acesso',            chave: 'senha',             type: 'password', placeholder: 'Preencha sua senha...' },
  { label: 'Registro no Conselho (CRM)', chave: 'registroConselho',  type: 'text',     placeholder: 'Preencha seu CRM...' },
]

const beneficios = [
  'Acesso imediato ao sistema',
  'Dados protegidos por criptografia de ponta',
  'Suporte dedicado para especialistas',
]

function PainelEsquerdo() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
        Registre-se e comece a atender
      </h2>
      <p className="text-slate-400 text-sm leading-relaxed mb-10">
        Junte-se aos especialistas que já cuidam de milhares de criaturas. Configuração simples, resultados imediatos.
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

export default function RegistrarMedico() {
  const [formulario, setFormulario] = useState({ nome: '', email: '', senha: '', registroConselho: '' })
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const { entrar } = useAuth()
  const navigate = useNavigate()

  const atualizar = (chave) => (e) => setFormulario({ ...formulario, [chave]: e.target.value })

  const registrar = async () => {
    const vazio = campos.find((c) => !formulario[c.chave])
    if (vazio) { setErro(`Preencha o campo "${vazio.label}".`); return }
    setErro(null)
    setCarregando(true)
    try {
      const perfil = await authApi.registrarMedico(formulario)
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
        <h1 className="text-2xl font-bold text-white">Criar conta médica</h1>
        <p className="text-sm text-slate-500 mt-1">Preencha os dados para se registrar na plataforma</p>
      </div>

      <ErrorAlert message={erro} />

      <div className="space-y-4">
        {campos.map((c) => (
          <FormField
            key={c.chave}
            label={c.label}
            type={c.type}
            placeholder={c.placeholder}
            value={formulario[c.chave]}
            onChange={atualizar(c.chave)}
            onKeyDown={aoTeclar}
            autoComplete={c.type === 'password' ? 'new-password' : undefined}
          />
        ))}
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
