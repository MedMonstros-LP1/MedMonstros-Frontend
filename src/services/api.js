import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export default api

export const authApi = {
  registrarMedico: (dados) => api.post('/auth/registrar', dados).then((r) => r.data),
  registrarPaciente: (dados) => api.post('/auth/registrar-paciente', dados).then((r) => r.data),
  login: (credenciais) => api.post('/auth/login', credenciais).then((r) => r.data),
}
