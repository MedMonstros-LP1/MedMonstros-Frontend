import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RotaProtegida from './components/RotaProtegida'
import Login from './pages/Login'
import RegistrarMedico from './pages/RegistrarMedico'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registrar" element={<RegistrarMedico />} />
      <Route
        element={
          <RotaProtegida>
            <Layout />
          </RotaProtegida>
        }
      >
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}
