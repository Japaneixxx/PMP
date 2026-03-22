import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import './Pages.css'

export default function ConsultasPage() {
  const [consultas, setConsultas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [qrConsulta, setQrConsulta] = useState(null)
  const [editando, setEditando] = useState(null) // consulta sendo editada
  const [formEdit, setFormEdit] = useState({})
  const [salvando, setSalvando] = useState(false)
  const { isMedico } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => { carregar() }, [])

  const carregar = async () => {
    const r = await api.get('/consultas')
    setConsultas(r.data)
    setCarregando(false)
  }

  const finalizar = async (id) => {
    await api.patch(`/consultas/${id}/finalizar`)
    carregar()
  }

  const abrirEdicao = (c) => {
    setEditando(c.id)
    setFormEdit({
      pacienteId: c.paciente?.id,
      dataHora: c.dataHora?.slice(0, 16),
      queixaPrincipal: c.queixaPrincipal || '',
      anamnese: c.anamnese || '',
      exameFisico: c.exameFisico || '',
      diagnostico: c.diagnostico || '',
      planoTratamento: c.planoTratamento || '',
      observacoes: c.observacoes || '',
    })
  }

  const salvarEdicao = async (e, id) => {
    e.preventDefault()
    setSalvando(true)
    try {
      await api.put(`/consultas/${id}`, {
        pacienteId: Number(formEdit.pacienteId),
        dataHora: formEdit.dataHora,
        queixaPrincipal: formEdit.queixaPrincipal || '',
        anamnese: formEdit.anamnese || '',
        exameFisico: formEdit.exameFisico || '',
        diagnostico: formEdit.diagnostico || '',
        planoTratamento: formEdit.planoTratamento || '',
        observacoes: formEdit.observacoes || '',
      })
      setEditando(null)
      carregar()
    } catch (err) {
      alert('Erro ao salvar: ' + (err.response?.data || err.message))
    } finally {
      setSalvando(false)
    }
  }

  const deletar = async (id) => {
    if (!confirm('Remover esta consulta permanentemente?')) return
    try {
      await api.delete(`/consultas/${id}`)
      carregar()
    } catch (err) {
      alert('Erro ao remover: ' + (err.response?.data || err.message))
    }
  }

  const qrUrl = qrConsulta
    ? `${window.location.origin}/c/${qrConsulta.tokenCompartilhamento}`
    : ''

  const set = (k, v) => setFormEdit(f => ({ ...f, [k]: v }))

  return (
    <div className="page">
      <div className="page-header teal">
        <div className="page-header-top">
          <h2>Consultas</h2>
          {isMedico() && (
            <button className="btn-icon-white" onClick={() => navigate('/app/consultas/nova')}>+</button>
          )}
        </div>
      </div>

      <div className="page-body">
        {carregando ? <div className="loading">Carregando...</div> :
         consultas.length === 0 ? (
          <div className="empty-state">
            <span>📋</span>
            <p>Nenhuma consulta ainda</p>
          </div>
        ) : consultas.map(c => (
          <div key={c.id} className="card">

            {/* Modo visualização */}
            {editando !== c.id ? (
              <>
                <div className="consulta-card-header">
                  <div>
                    <p className="consulta-medico">
                      {isMedico() ? `${c.paciente?.nome}` : `Dr(a). ${c.medico?.nome}`}
                    </p>
                    <p className="consulta-data">
                      {new Date(c.dataHora).toLocaleDateString('pt-BR')}
                      {' '}&bull;{' '}
                      <span className={`badge ${c.status === 'FINALIZADA' ? 'badge-green' : 'badge-amber'}`}>
                        {c.status === 'FINALIZADA' ? 'Finalizada' : 'Rascunho'}
                      </span>
                    </p>
                  </div>
                </div>

                {c.queixaPrincipal && <p className="consulta-queixa">{c.queixaPrincipal}</p>}
                {c.diagnostico && (
                  <div className="consulta-diagnostico">
                    <strong>Diagnóstico:</strong> {c.diagnostico}
                  </div>
                )}

                <div className="card-actions">
                  <button className="btn-sm" onClick={() => navigate(`/app/consultas/${c.id}`)}>
                    Ver detalhes
                  </button>
                  {isMedico() && c.status === 'RASCUNHO' && (
                    <>
                      <button className="btn-sm" onClick={() => finalizar(c.id)}>✔ Finalizar</button>
                      <button className="btn-sm" onClick={() => abrirEdicao(c)}>✏️ Editar</button>
                    </>
                  )}
                  {isMedico() && (
                    <button className="btn-sm btn-danger" onClick={() => deletar(c.id)}>🗑️</button>
                  )}
                  {c.status === 'FINALIZADA' && (
                    <button className="btn-sm" onClick={() => setQrConsulta(c)}>📷 QR Code</button>
                  )}
                </div>
              </>
            ) : (
              /* Modo edição inline */
              <form onSubmit={(e) => salvarEdicao(e, c.id)} className="modal-form">
                <p style={{ fontWeight: 800, marginBottom: 8 }}>
                  ✏️ Editando consulta — {c.paciente?.nome}
                </p>
                <div className="campo"><label>Data e Hora</label>
                  <input type="datetime-local" value={formEdit.dataHora}
                    onChange={e => set('dataHora', e.target.value)} required /></div>
                <div className="campo"><label>Queixa Principal</label>
                  <textarea value={formEdit.queixaPrincipal}
                    onChange={e => set('queixaPrincipal', e.target.value)} /></div>
                <div className="campo"><label>Anamnese</label>
                  <textarea value={formEdit.anamnese}
                    onChange={e => set('anamnese', e.target.value)}
                    style={{ minHeight: 80 }} /></div>
                <div className="campo"><label>Exame Físico</label>
                  <textarea value={formEdit.exameFisico}
                    onChange={e => set('exameFisico', e.target.value)} /></div>
                <div className="campo"><label>Diagnóstico</label>
                  <textarea value={formEdit.diagnostico}
                    onChange={e => set('diagnostico', e.target.value)} /></div>
                <div className="campo"><label>Plano de Tratamento</label>
                  <textarea value={formEdit.planoTratamento}
                    onChange={e => set('planoTratamento', e.target.value)} /></div>
                <div className="campo"><label>Observações</label>
                  <textarea value={formEdit.observacoes}
                    onChange={e => set('observacoes', e.target.value)} /></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn-primary" disabled={salvando}
                    style={{ flex: 1 }}>
                    {salvando ? 'Salvando...' : '💾 Salvar'}
                  </button>
                  <button type="button" className="btn-sm"
                    onClick={() => setEditando(null)}
                    style={{ flex: 1 }}>
                    ✕ Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>

      {/* Modal QR Code */}
      {qrConsulta && (
        <div className="modal-overlay" onClick={() => setQrConsulta(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
            <div className="modal-header">
              <h3>Compartilhar Consulta</h3>
              <button onClick={() => setQrConsulta(null)}>✕</button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
              Mostre este QR Code para o paciente escanear
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <QRCodeSVG value={qrUrl} size={220} fgColor="var(--teal-800)" />
            </div>
            <p style={{ fontSize: 11, color: 'var(--gray-300)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
              {qrUrl}
            </p>
            <p style={{ fontSize: 11, color: 'var(--gray-500)', marginTop: 12 }}>
              Válido por 30 dias
            </p>
          </div>
        </div>
      )}
    </div>
  )
}