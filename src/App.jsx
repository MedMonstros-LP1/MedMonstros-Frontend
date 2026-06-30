import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RotaProtegida from './components/RotaProtegida'
import Login from './pages/Login'
import RegistrarMedico from './pages/RegistrarMedico'
import RegistrarPaciente from './pages/RegistrarPaciente'
import Home from './pages/Home'
import PerfilMedico from './pages/PerfilMedico'
import PerfilPaciente from './pages/PerfilPaciente'
import AgendaMedico from './pages/AgendaMedico'
import { useAuth } from './context/AuthContext'

function PerfilRoute() {
  const { perfil } = useAuth()
  return perfil?.tipo === 'MEDICO' ? <PerfilMedico /> : <PerfilPaciente />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<RegistrarMedico />} />
      <Route path="/registrar-paciente" element={<RegistrarPaciente />} />
      <Route
        element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<PerfilRoute />} />
        <Route path="/agenda" element={<AgendaMedico />} />
      </Route>
    </Routes>
  )
}
