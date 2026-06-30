import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export default api

export const authApi = {
  registrarMedico: (dados) => api.post('/auth/registrar', dados).then((r) => r.data),
  registrarPaciente: (dados) => api.post('/auth/registrar-paciente', dados).then((r) => r.data),
  login: (credenciais) => api.post('/auth/login', credenciais).then((r) => r.data),
}

export const consultaApi = {
  listarMedicos: () => {
    return api.get('/medicos').then(r => r.data);
  },

  getHorariosMedico: (id) => {
    return api.get(`/horarios/medico/${id}`).then(r => r.data);
  },

  agendarConsulta: (dados) => {
    return api.post('/consultas', dados).then(r => r.data);
  },

  getConsultasPaciente: (id) => {
    return api.get(`/consultas/paciente/${id}`).then(r => r.data);
  },

  getConsultasMedico: (id) => {
    return api.get(`/consultas/medico/${id}`).then(r => r.data);
  },

  getConsulta: (id) => {
    return api.get(`/consultas/${id}`).then(r => r.data);
  },

  atualizarStatus: (id, acao) => {
    return api.patch(`/consultas/${id}/${acao}`).then(r => r.data);
  },

  registrarTratamento: (id, dados) => {
    return api.post(`/consultas/${id}/tratamento`, dados).then(r => r.data);
  },
};
