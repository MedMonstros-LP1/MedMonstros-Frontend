import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Badge from './ui/Badge'

const navegacao = [
  {
    para: '/',
    rotulo: 'Painel',
    icone: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
]

function Avatar({ nome }) {
  const iniciais = nome
    ? nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : '?'
  return <div className="avatar w-8 h-8">{iniciais}</div>
}

function IconeSair() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}

export default function Layout() {
  const { perfil, sair } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const deslogar = () => { sair(); navigate('/login') }

  return (
    <div className="min-h-screen bg-[#0b0a14]">
      <header className="app-header sticky top-0 z-30">
        <nav className="mx-auto flex max-w-6xl items-center gap-1 px-5 h-14">
          <Link to="/" className="flex items-center gap-2.5 mr-6">
            <div className="brand-icon-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-sm font-bold tracking-tight text-white">MedMonstros</span>
          </Link>

          {navegacao.map((item) => {
            const ativo = location.pathname === item.para
            return (
              <Link
                key={item.para}
                to={item.para}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  ativo
                    ? 'bg-violet-900/50 text-violet-300'
                    : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span className={ativo ? 'text-violet-400' : 'text-slate-600'}>{item.icone}</span>
                {item.rotulo}
              </Link>
            )
          })}


          <div className="ml-auto flex items-center gap-3">
            {perfil?.tipo && (
              <Badge variant="purple" className="hidden sm:inline-flex">{perfil.tipo}</Badge>
            )}

            <Link to="/perfil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar nome={perfil?.nome} />
              <span className="hidden md:block text-sm font-medium text-slate-300 max-w-[160px] truncate">
                {perfil?.nome}
              </span>
            </Link>

            <div className="h-5 w-px bg-[#1e1c3a]" />

            <button
              onClick={deslogar}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-950/30"
            >
              <IconeSair />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
