import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [perfil, setPerfil] = useState(() => {
    const salvo = localStorage.getItem('perfil')
    return salvo ? JSON.parse(salvo) : null
  })

  const entrar = (dados) => {
    setPerfil(dados)
    localStorage.setItem('perfil', JSON.stringify(dados))
  }

  const sair = () => {
    setPerfil(null)
    localStorage.removeItem('perfil')
  }

  return (
    <AuthContext.Provider value={{ perfil, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
