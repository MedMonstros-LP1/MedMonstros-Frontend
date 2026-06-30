import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { consultaApi } from '../services/api'

export default function MedicoDashboard() {
  const { perfil } = useAuth()
  const [consultas, setConsultas] = useState([])
  const [consultaTratamento, setConsultaTratamento] = useState(null)
  
  const [tratamentoForm, setTratamentoForm] = useState({
    tipo: 'MAGICO',
    descricao: '',
    valorBase: 100,
    nivelEncantamento: 1,
    requerExorcismo: false
  })

  useEffect(() => {
    carregarConsultas()
  }, [perfil])

  const carregarConsultas = async () => {
    if (!perfil?.id) return
    try {
      const data = await consultaApi.getConsultasMedico(perfil.id)
      setConsultas(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleStatusChange = async (id, acao) => {
    if (acao === 'realizar') {
      const consulta = consultas.find(c => c.id === id)
      setConsultaTratamento(consulta)
      return
    }
    
    try {
      const atualizada = await consultaApi.atualizarStatus(id, acao)
      setConsultas(consultas.map(c => c.id === id ? atualizada : c))
    } catch (error) {
      console.error(error)
    }
  }

  const submeterTratamento = async (e) => {
    e.preventDefault()
    if (!consultaTratamento) return
    
    try {
      const consultaAtualizada = await consultaApi.registrarTratamento(consultaTratamento.id, tratamentoForm)
      await consultaApi.atualizarStatus(consultaAtualizada.id, 'realizar')
      
      const atualizadaRealizada = { ...consultaAtualizada, status: 'REALIZADA' }
      setConsultas(consultas.map(c => c.id === consultaAtualizada.id ? atualizadaRealizada : c))
      setConsultaTratamento(null)
    } catch (error) {
      console.error(error)
    }
  }

  const pendentes = consultas.filter(c => c.status === 'SOLICITADA')
  const emAndamento = consultas.filter(c => c.status === 'ACEITA')
  const concluidas = consultas.filter(c => ['REALIZADA', 'CANCELADA', 'RECUSADA'].includes(c.status))

  const renderConsultaCard = (c, actions) => (
    <div key={c.id} className="p-4 bg-slate-700 rounded-lg flex flex-col gap-3">
      <div>
        <p className="text-white font-medium">Paciente: {c.paciente?.nome}</p>
        <p className="text-sm text-slate-300">Data: {new Date(c.horario?.inicio).toLocaleString()}</p>
        <p className="text-sm text-slate-400">Status: <span className="font-semibold text-purple-400">{c.status}</span></p>
      </div>
      {c.tratamento && (
        <div className="text-sm text-emerald-300 bg-emerald-900/30 p-2 rounded">
          <p>Tratamento registrado ({c.tratamento.tipo})</p>
          <p className="font-bold">Custo: R$ {c.tratamento.custo.toFixed(2)}</p>
        </div>
      )}
      {actions && <div className="flex gap-2">{actions(c)}</div>}
    </div>
  )

  return (
    <div className="space-y-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <h3 className="font-bold text-white mb-4 text-lg">Pendentes (Solicitadas)</h3>
          <div className="space-y-4">
            {pendentes.map(c => renderConsultaCard(c, (consulta) => (
              <>
                <button onClick={() => handleStatusChange(consulta.id, 'aceitar')} className="flex-1 px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Aceitar</button>
                <button onClick={() => handleStatusChange(consulta.id, 'recusar')} className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Recusar</button>
              </>
            )))}
            {pendentes.length === 0 && <p className="text-sm text-slate-400">Nenhuma pendente.</p>}
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border-t-4 border-blue-500">
          <h3 className="font-bold text-white mb-4 text-lg">Em Andamento (Aceitas)</h3>
          <div className="space-y-4">
            {emAndamento.map(c => renderConsultaCard(c, (consulta) => (
              <>
                <button onClick={() => handleStatusChange(consulta.id, 'realizar')} className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Realizar</button>
                <button onClick={() => handleStatusChange(consulta.id, 'cancelar')} className="flex-1 px-2 py-1 bg-slate-600 text-white rounded text-sm hover:bg-slate-700">Cancelar</button>
              </>
            )))}
            {emAndamento.length === 0 && <p className="text-sm text-slate-400">Nenhuma em andamento.</p>}
          </div>
        </div>

        <div className="bg-slate-800 p-5 rounded-lg shadow-lg border-t-4 border-emerald-500">
          <h3 className="font-bold text-white mb-4 text-lg">Concluídas / Canceladas</h3>
          <div className="space-y-4">
            {concluidas.map(c => renderConsultaCard(c, null))}
            {concluidas.length === 0 && <p className="text-sm text-slate-400">Nenhuma concluída.</p>}
          </div>
        </div>
      </div>

      {consultaTratamento && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md shadow-2xl border border-slate-600">
            <h2 className="text-xl font-bold text-white mb-4">Registrar Tratamento</h2>
            <p className="text-sm text-slate-300 mb-4">Paciente: {consultaTratamento.paciente?.nome}</p>
            
            <form onSubmit={submeterTratamento} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Tipo de Tratamento</label>
                <select
                  className="w-full bg-slate-700 text-white rounded p-2"
                  value={tratamentoForm.tipo}
                  onChange={e => setTratamentoForm({...tratamentoForm, tipo: e.target.value})}
                >
                  <option value="MAGICO">Mágico</option>
                  <option value="ESPIRITUAL">Espiritual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Descrição</label>
                <textarea
                  className="w-full bg-slate-700 text-white rounded p-2"
                  rows="2"
                  value={tratamentoForm.descricao}
                  onChange={e => setTratamentoForm({...tratamentoForm, descricao: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">Valor Base (R$)</label>
                <input
                  type="number"
                  className="w-full bg-slate-700 text-white rounded p-2"
                  value={tratamentoForm.valorBase}
                  onChange={e => setTratamentoForm({...tratamentoForm, valorBase: parseFloat(e.target.value)})}
                  required
                  min="0"
                />
              </div>

              {tratamentoForm.tipo === 'MAGICO' ? (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Nível de Encantamento</label>
                  <input
                    type="number"
                    className="w-full bg-slate-700 text-white rounded p-2"
                    value={tratamentoForm.nivelEncantamento}
                    onChange={e => setTratamentoForm({...tratamentoForm, nivelEncantamento: parseInt(e.target.value)})}
                    required
                    min="1"
                    max="10"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="exorcismo"
                    checked={tratamentoForm.requerExorcismo}
                    onChange={e => setTratamentoForm({...tratamentoForm, requerExorcismo: e.target.checked})}
                    className="rounded bg-slate-700 border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="exorcismo" className="text-sm text-slate-300">Requer Exorcismo?</label>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setConsultaTratamento(null)}
                  className="flex-1 py-2 bg-slate-600 text-white rounded hover:bg-slate-500 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
