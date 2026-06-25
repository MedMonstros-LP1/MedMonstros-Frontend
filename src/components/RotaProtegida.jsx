import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RotaProtegida({ children }) {
  const { perfil } = useAuth()
  if (!perfil) return <Navigate to="/login" replace />
  return children
}
