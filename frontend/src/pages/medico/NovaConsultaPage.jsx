import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import '../shared/Pages.css'
import '../auth/Auth.css'

export default function NovaConsultaPage() {
  const [pacientes, setPacientes] = useState([])
  const [form, setForm] = useState({
    pacienteId: '', dataHora: new Date().toISOString().slice(0, 16),
    queixaPrincipal: '', anamnese: '', exameFisico: '',
    diagnostico: '', planoTratamento: '', observacoes: ''
  })
  const [salvando, setSalvando] = useState(false)
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    api.get('/usuarios/pacientes')
      .then(r => setPacientes(r.data))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.pacienteId) return alert('Selecione um paciente')
    setSalvando(true)
    try {
      const payload = {
        ...form,
        pacienteId: parseInt(form.pacienteId)
      }
      const { data } = await api.post('/consultas', payload)
      navigate(`/app/consultas/${data.id}`)
    } catch (err) {
      alert('Erro: ' + (err.response?.data || err.message))
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header teal">
        <div className="page-header-top">
          <button className="btn-icon-white" onClick={() => navigate(-1)}>←</button>
          <h2>Nova Consulta</h2>
          <div style={{ width: 36 }} />
        </div>
      </div>
      <div className="page-body">
        <form onSubmit={handleSubmit} className="modal-form">

          <div className="campo">
            <label>Paciente</label>
            {pacientes.length > 0 ? (
              <select
                required
                value={form.pacienteId}
                onChange={e => set('pacienteId', e.target.value)}
              >
                <option value="">Selecione um paciente...</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nome} — {p.email}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                placeholder="ID do paciente"
                required
                value={form.pacienteId}
                onChange={e => set('pacienteId', e.target.value)}
              />
            )}
          </div>

          <div className="campo">
            <label>Data e Hora</label>
            <input type="datetime-local" value={form.dataHora}
              onChange={e => set('dataHora', e.target.value)} required />
          </div>
          <div className="campo"><label>Queixa Principal</label>
            <textarea value={form.queixaPrincipal}
              onChange={e => set('queixaPrincipal', e.target.value)}
              placeholder="Motivo da consulta..." /></div>
          <div className="campo"><label>Anamnese</label>
            <textarea value={form.anamnese}
              onChange={e => set('anamnese', e.target.value)}
              placeholder="Histórico do paciente..."
              style={{ minHeight: 100 }} /></div>
          <div className="campo"><label>Exame Físico</label>
            <textarea value={form.exameFisico}
              onChange={e => set('exameFisico', e.target.value)}
              placeholder="Achados do exame físico..." /></div>
          <div className="campo"><label>Diagnóstico</label>
            <textarea value={form.diagnostico}
              onChange={e => set('diagnostico', e.target.value)}
              placeholder="Diagnóstico principal..." /></div>
          <div className="campo"><label>Plano de Tratamento</label>
            <textarea value={form.planoTratamento}
              onChange={e => set('planoTratamento', e.target.value)}
              placeholder="Conduta, medicamentos, retorno..." /></div>
          <div className="campo"><label>Observações</label>
            <textarea value={form.observacoes}
              onChange={e => set('observacoes', e.target.value)} /></div>

          <button type="submit" className="btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Consulta'}
          </button>
        </form>
      </div>
    </div>
  )
}