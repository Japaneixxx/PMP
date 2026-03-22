import { useState, useEffect } from 'react'
import api from '../../services/api'
import { offlineDB } from '../../services/offlineDB'
import './Pages.css'

export default function PrescricoesPage() {
  const [prescricoes, setPrescricoes] = useState([])
  const [filtro, setFiltro] = useState('TODOS')
  const [busca, setBusca] = useState('')
  const [modal, setModal] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [offline, setOffline] = useState(false)
  const [form, setForm] = useState({
    remedio: '', dosagem: '', intervaloHoras: 8, horarioInicio: '08:00',
    dataInicio: '', dataFim: '', observacoes: ''
  })

  useEffect(() => { carregar() }, [])

  const carregar = async () => {
    try {
      const { data } = await api.get('/prescricoes')
      setPrescricoes(data)
      await offlineDB.salvarPrescricoes(data)
      setOffline(false)
    } catch {
      const local = await offlineDB.getPrescricoes()
      setPrescricoes(local)
      setOffline(true)
    } finally {
      setCarregando(false)
    }
  }

  const salvar = async (e) => {
    e.preventDefault()
    try {
      await api.post('/prescricoes', form)
      setModal(false)
      setForm({ remedio: '', dosagem: '', intervaloHoras: 8, horarioInicio: '08:00', dataInicio: '', dataFim: '', observacoes: '' })
      carregar()
    } catch (err) {
      alert('Erro ao salvar: ' + (err.response?.data || err.message))
    }
  }

  const alterarStatus = async (id, ativo) => {
    await api.patch(`/prescricoes/${id}/status?ativo=${ativo}`)
    carregar()
  }

  const deletar = async (id) => {
    if (!confirm('Remover prescrição?')) return
    await api.delete(`/prescricoes/${id}`)
    carregar()
  }

  const corIntervalo = (h) => h <= 6 ? 'coral' : h <= 12 ? 'amber' : 'teal'

  const filtradas = prescricoes
    .filter(p => filtro === 'TODOS' || (filtro === 'ATIVOS' ? p.ativo : !p.ativo))
    .filter(p => p.remedio.toLowerCase().includes(busca.toLowerCase()))

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header teal">
        <div className="page-header-top">
          <h2>Prescrições</h2>
          {offline && <span className="badge-offline">📵 Offline</span>}
          <button className="btn-icon-white" onClick={() => setModal(true)}>+</button>
        </div>
        <input className="search-input" type="search" placeholder="🔍 Buscar remédio..."
          value={busca} onChange={e => setBusca(e.target.value)} />
        <div className="filtros">
          {['TODOS','ATIVOS','FINALIZADOS'].map(f => (
            <button key={f} className={`filtro-btn ${filtro === f ? 'ativo' : ''}`}
              onClick={() => setFiltro(f)}>
              {f === 'TODOS' ? `Todos (${prescricoes.length})` :
               f === 'ATIVOS' ? `Ativos (${prescricoes.filter(p=>p.ativo).length})` :
               `Finalizados (${prescricoes.filter(p=>!p.ativo).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="page-body">
        {carregando ? (
          <div className="loading">Carregando...</div>
        ) : filtradas.length === 0 ? (
          <div className="empty-state">
            <span>💊</span>
            <p>Nenhuma prescrição encontrada</p>
            <button className="btn-primary-sm" onClick={() => setModal(true)}>Adicionar</button>
          </div>
        ) : filtradas.map(p => (
          <div key={p.id} className={`card prescricao-card ${p.ativo ? '' : 'finalizado'}`}>
            <div className="prescricao-top">
              <div>
                <h3 className="prescricao-nome">{p.remedio}</h3>
                <p className="prescricao-dosagem">{p.dosagem}</p>
              </div>
              <div className="prescricao-badges">
                <span className={`badge badge-${corIntervalo(p.intervaloHoras)}`}>
                  {p.intervaloHoras}h/dose
                </span>
                <span className={`badge ${p.ativo ? 'badge-green' : 'badge-gray'}`}>
                  {p.ativo ? '● Ativo' : '● Finalizado'}
                </span>
              </div>
            </div>
            <div className="prescricao-info">
              <span>🕐 Início: {p.horarioInicio}</span>
              {p.dataInicio && <span>📅 {p.dataInicio}</span>}
            </div>
            {p.observacoes && <p className="prescricao-obs">{p.observacoes}</p>}
            <div className="card-actions">
              <button className="btn-sm" onClick={() => alterarStatus(p.id, !p.ativo)}>
                {p.ativo ? 'Finalizar' : 'Reativar'}
              </button>
              <button className="btn-sm btn-danger" onClick={() => deletar(p.id)}>Remover</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal nova prescrição */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Nova Prescrição</h3>
              <button onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={salvar} className="modal-form">
              <div className="campo"><label>Remédio</label>
                <input required value={form.remedio} onChange={e => setForm({...form, remedio: e.target.value})} /></div>
              <div className="campo"><label>Dosagem</label>
                <input required value={form.dosagem} onChange={e => setForm({...form, dosagem: e.target.value})} /></div>
              <div className="row-campos">
                <div className="campo"><label>Intervalo (h)</label>
                  <input type="number" min="1" max="24" required value={form.intervaloHoras}
                    onChange={e => setForm({...form, intervaloHoras: +e.target.value})} /></div>
                <div className="campo"><label>1ª dose</label>
                  <input type="time" required value={form.horarioInicio}
                    onChange={e => setForm({...form, horarioInicio: e.target.value})} /></div>
              </div>
              <div className="row-campos">
                <div className="campo"><label>Data início</label>
                  <input type="date" value={form.dataInicio} onChange={e => setForm({...form, dataInicio: e.target.value})} /></div>
                <div className="campo"><label>Data fim</label>
                  <input type="date" value={form.dataFim} onChange={e => setForm({...form, dataFim: e.target.value})} /></div>
              </div>
              <div className="campo"><label>Observações</label>
                <textarea value={form.observacoes} onChange={e => setForm({...form, observacoes: e.target.value})} /></div>
              <button type="submit" className="btn-primary">Salvar Prescrição</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
