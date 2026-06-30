import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export default api

export const authApi = {
  registrarMedico: (dados) => api.post('/auth/registrar', dados).then((r) => r.data),
  registrarPaciente: (dados) => api.post('/auth/registrar-paciente', dados).then((r) => r.data),
  login: (credenciais) => api.post('/auth/login', credenciais).then((r) => r.data),
}

export const CONFIG_MOCK = true;

let consultasMock = [];
let nextConsultaId = 1;

export const consultaApi = {
  listarMedicos: () => {
    return api.get('/medicos').then(r => r.data);
  },
  
  getHorariosMedico: (id) => {
    if (CONFIG_MOCK) {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      
      const inicio1 = new Date(amanha);
      inicio1.setHours(14, 0, 0, 0);
      const fim1 = new Date(amanha);
      fim1.setHours(15, 0, 0, 0);

      const inicio2 = new Date(amanha);
      inicio2.setHours(15, 0, 0, 0);
      const fim2 = new Date(amanha);
      fim2.setHours(16, 0, 0, 0);

      return Promise.resolve([
        { id: parseInt(`${id}01`), inicio: inicio1.toISOString(), fim: fim1.toISOString(), luaCheia: false },
        { id: parseInt(`${id}02`), inicio: inicio2.toISOString(), fim: fim2.toISOString(), luaCheia: false }
      ]);
    }
    return api.get(`/horarios/medico/${id}`).then(r => r.data);
  },

  agendarConsulta: (dados) => {
    if (CONFIG_MOCK) {
      const amanha = new Date();
      amanha.setDate(amanha.getDate() + 1);
      amanha.setHours(14, 0, 0, 0);

      const nova = { 
        id: nextConsultaId++, 
        status: "SOLICITADA", 
        paciente: { id: dados.pacienteId, nome: `Paciente ${dados.pacienteId}` }, 
        medico: { id: dados.medicoId, nome: `Médico ${dados.medicoId}` }, 
        horario: { id: dados.horarioId, inicio: amanha.toISOString() },
        tratamento: null 
      };
      consultasMock.push(nova);
      return Promise.resolve(nova);
    }
    return api.post('/consultas', dados).then(r => r.data);
  },

  getConsultasPaciente: (id) => {
    if (CONFIG_MOCK) return Promise.resolve(consultasMock.filter(c => c.paciente.id === id));
    return api.get(`/consultas/paciente/${id}`).then(r => r.data);
  },

  getConsultasMedico: (id) => {
    if (CONFIG_MOCK) return Promise.resolve(consultasMock.filter(c => c.medico.id === id));
    return api.get(`/consultas/medico/${id}`).then(r => r.data);
  },

  atualizarStatus: (id, acao) => {
    if (CONFIG_MOCK) {
      const mapAcaoToStatus = {
        'aceitar': 'ACEITA',
        'recusar': 'RECUSADA',
        'cancelar': 'CANCELADA',
        'realizar': 'REALIZADA'
      };
      const cIndex = consultasMock.findIndex(c => c.id === id);
      if (cIndex !== -1) {
        consultasMock[cIndex] = { ...consultasMock[cIndex], status: mapAcaoToStatus[acao] };
        return Promise.resolve(consultasMock[cIndex]);
      }
      return Promise.reject(new Error("Consulta não encontrada"));
    }
    return api.patch(`/consultas/${id}/${acao}`).then(r => r.data);
  },

  registrarTratamento: (id, dados) => {
    if (CONFIG_MOCK) {
      const cIndex = consultasMock.findIndex(c => c.id === id);
      if (cIndex !== -1) {
        const custo = dados.tipo === 'MAGICO' ? dados.valorBase + (dados.nivelEncantamento * 30) : dados.valorBase + (dados.requerExorcismo ? 140 : 0);
        consultasMock[cIndex] = {
          ...consultasMock[cIndex],
          tratamento: {
            tipo: dados.tipo,
            descricao: dados.descricao,
            valorBase: dados.valorBase,
            nivelEncantamento: dados.nivelEncantamento,
            requerExorcismo: dados.requerExorcismo,
            custo: custo || 290.0
          }
        };
        return Promise.resolve(consultasMock[cIndex]);
      }
      return Promise.reject(new Error("Consulta não encontrada"));
    }
    return api.post(`/consultas/${id}/tratamento`, dados).then(r => r.data);
  }
};
