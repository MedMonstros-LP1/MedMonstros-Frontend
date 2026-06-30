import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export default api

export const authApi = {
  registrarMedico: (dados) => api.post('/auth/registrar', dados).then((r) => r.data),
  registrarPaciente: (dados) => api.post('/auth/registrar-paciente', dados).then((r) => r.data),
  login: (credenciais) => api.post('/auth/login', credenciais).then((r) => r.data),
}

export const medicoApi = {
  getPerfil: (id) => api.get(`/medicos/${id}`).then((r) => r.data),
  getEspecialidades: () => api.get('/especialidades').then((r) => r.data),
  addEspecialidade: (medicoId, espId) => api.post(`/medicos/${medicoId}/especialidades/${espId}`).then((r) => r.data),
  removeEspecialidade: (medicoId, espId) => api.delete(`/medicos/${medicoId}/especialidades/${espId}`).then((r) => r.data),
}

export const horarioApi = {
  listarTodos: (medicoId) => api.get(`/horarios/medico/${medicoId}/todos`).then((r) => r.data),
  criar: (dados) => api.post('/horarios', dados).then((r) => r.data),
  deletar: (id) => api.delete(`/horarios/${id}`).then((r) => r.data),
}
