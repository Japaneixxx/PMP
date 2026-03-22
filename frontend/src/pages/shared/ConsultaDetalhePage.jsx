import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import './Pages.css'

const SECOES_INFO = [
  { key: 'tipoSanguineo', titulo: '🩸 Tipo Sanguíneo', destaque: true },
  { key: 'alergias', titulo: '🤧 Alergias' },
  { key: 'comorbidades', titulo: '🏥 Comorbidades' },
  { key: 'cirurgiasPrevias', titulo: '🏥 Cirurgias Previas' },
  { key: 'historicoFamiliar', titulo: '👨‍👩‍👧 Histórico Familiar' },
  { key: 'contextoSocial', titulo: '🏠 Contexto Social' },
  { key: 'observacoes', titulo: '📝 Observações' },
]

export default function ConsultaDetalhePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isMedico } = useAuthStore()
  const [consulta, setConsulta] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({})
  const [infoPaciente, setInfoPaciente] = useState(null)
  const [modalInfo, setModalInfo] = useState(false)
  const [carregandoInfo, setCarregandoInfo] = useState(false)

  useEffect(() => { carregar() }, [id])

  const carregar = async () => {
    try {
      const { data } = await api.get(`/consultas/${id}`)
      setConsulta(data)
      setForm({
        pacienteId: data.paciente?.id,
        dataHora: data.dataHora?.slice(0, 16),
        queixaPrincipal: data.queixaPrincipal || '',
        anamnese: data.anamnese || '',
        exameFisico: data.exameFisico || '',
        diagnostico: data.diagnostico || '',
        planoTratamento: data.planoTratamento || '',
        observacoes: data.observacoes || '',
      })
    } finally {
      setCarregando(false)
    }
  }

  const abrirInfoPaciente = async () => {
    setModalInfo(true)
    if (infoPaciente) return // já carregou
    setCarregandoInfo(true)
    try {
      const { data } = await api.get(`/paciente-info/${consulta.paciente?.id}`)
      setInfoPaciente(data)
    } catch (err) {
      alert('Erro ao carregar informações do paciente')
    } finally {
      setCarregandoInfo(false)
    }
  }

  const salvar = async (e) => {
    e.preventDefault()
    setSalvando(true)
    try {
      await api.put(`/consultas/${id}`, {
        pacienteId: Number(consulta.paciente?.id),
        dataHora: form.dataHora,
        queixaPrincipal: form.queixaPrincipal || '',
        anamnese: form.anamnese || '',
        exameFisico: form.exameFisico || '',
        diagnostico: form.diagnostico || '',
        planoTratamento: form.planoTratamento || '',
        observacoes: form.observacoes || '',
      })
      await carregar()
      setEditando(false)
    } catch (err) {
      alert('Erro ao salvar: ' + (err.response?.data || err.message))
    } finally {
      setSalvando(false)
    }
  }

  const deletar = async () => {
    if (!confirm('Remover a consulta permanentemente?')) return
    try {
      await api.delete(`/consultas/${id}`)
      navigate('/app/consultas')
    } catch (err) {
      alert('Erro ao remover: ' + (err.response?.data || err.message))
    }
  }

  if (carregando) return <div className="full-center loading">Carregando...</div>
  if (!consulta) return <div className="full-center">Consulta não encontrada</div>

  return (
    <div className="page">
      <div className="page-header teal">
        <div className="page-header-top">
          <button className="btn-icon-white" onClick={() => navigate(-1)}>←</button>
          <h2>Consulta</h2>
          <span className={`badge ${consulta.status === 'FINALIZADA' ? 'badge-green' : 'badge-amber'}`}>
            {consulta.status === 'FINALIZADA' ? 'Finalizada' : 'Rascunho'}
          </span>
        </div>
        <p className="page-subtitle">
          {new Date(consulta.dataHora).toLocaleDateString('pt-BR', { dateStyle: 'full' })}
        </p>
      </div>

      <div className="page-body">

        {/* Ações do médico */}
        {isMedico() && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-sm" style={{ flex: 1 }} onClick={abrirInfoPaciente}>
              📋 Info do Paciente
            </button>
            {consulta.status !== 'FINALIZADA' && (
              <button className="btn-sm" style={{ flex: 1 }} onClick={() => setEditando(!editando)}>
                {editando ? 'Cancelar' : 'Editar'}
              </button>
            )}
            <button className="btn-sm btn-danger" style={{ flex: 1 }} onClick={deletar}>
              Remover
            </button>
          </div>
        )}

        {/* Modo edição */}
        {editando ? (
          <form onSubmit={salvar} className="modal-form">
            <div className="campo"><label>Data e Hora</label>
              <input type="datetime-local" value={form.dataHora}
                onChange={e => setForm({ ...form, dataHora: e.target.value })} required /></div>
            <div className="campo"><label>Queixa Principal</label>
              <textarea value={form.queixaPrincipal}
                onChange={e => setForm({ ...form, queixaPrincipal: e.target.value })} /></div>
            <div className="campo"><label>Anamnese</label>
              <textarea value={form.anamnese}
                onChange={e => setForm({ ...form, anamnese: e.target.value })}
                style={{ minHeight: 100 }} /></div>
            <div className="campo"><label>Exame Físico</label>
              <textarea value={form.exameFisico}
                onChange={e => setForm({ ...form, exameFisico: e.target.value })} /></div>
            <div className="campo"><label>Diagnóstico</label>
              <textarea value={form.diagnostico}
                onChange={e => setForm({ ...form, diagnostico: e.target.value })} /></div>
            <div className="campo"><label>Plano de Tratamento</label>
              <textarea value={form.planoTratamento}
                onChange={e => setForm({ ...form, planoTratamento: e.target.value })} /></div>
            <div className="campo"><label>Observações</label>
              <textarea value={form.observacoes}
                onChange={e => setForm({ ...form, observacoes: e.target.value })} /></div>
            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </form>

        ) : (
          <>
            <div className="card">
              <InfoRow label="Médico" value={`Dr(a). ${consulta.medico?.nome}`} />
              <InfoRow label="Paciente" value={consulta.paciente?.nome} />
              {consulta.medico?.especialidade &&
                <InfoRow label="Especialidade" value={consulta.medico.especialidade} />}
            </div>

            {consulta.queixaPrincipal &&
              <SecaoConsulta titulo="Queixa Principal" texto={consulta.queixaPrincipal} />}
            {consulta.anamnese &&
              <SecaoConsulta titulo="Anamnese" texto={consulta.anamnese} />}
            {consulta.exameFisico &&
              <SecaoConsulta titulo="Exame Físico" texto={consulta.exameFisico} />}
            {consulta.diagnostico &&
              <SecaoConsulta titulo="Diagnostico" texto={consulta.diagnostico} destaque />}
            {consulta.planoTratamento &&
              <SecaoConsulta titulo="Plano de Tratamento" texto={consulta.planoTratamento} />}
            {consulta.observacoes &&
              <SecaoConsulta titulo="Observacoes" texto={consulta.observacoes} />}

            {consulta.prescricoes?.length > 0 && (
              <div>
                <h3 style={{ fontWeight: 800, marginBottom: 8 }}>
                  Prescricoes ({consulta.prescricoes.length})
                </h3>
                {consulta.prescricoes.map(p => (
                  <div key={p.id} className="card" style={{ marginBottom: 8 }}>
                    <p style={{ fontWeight: 700 }}>{p.remedio}</p>
                    <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                      {p.dosagem} — a cada {p.intervaloHoras}h
                    </p>
                  </div>
                ))}
              </div>
            )}

            {consulta.exames?.length > 0 && (
              <div>
                <h3 style={{ fontWeight: 800, marginBottom: 8 }}>
                  Exames ({consulta.exames.length})
                </h3>
                {consulta.exames.map(e => (
                  <div key={e.id} className="card" style={{ marginBottom: 8 }}>
                    <p style={{ fontWeight: 700 }}>{e.nome}</p>
                    <a href={e.arquivoUrl} target="_blank" rel="noreferrer">
                      <button className="btn-sm" style={{ marginTop: 8 }}>
                        Abrir arquivo
                      </button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal info do paciente */}
      {modalInfo && (
        <div className="modal-overlay" onClick={() => setModalInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Info — {consulta.paciente?.nome}</h3>
              <button onClick={() => setModalInfo(false)}>x</button>
            </div>

            {carregandoInfo ? (
              <div className="loading">Carregando...</div>
            ) : !infoPaciente || (!infoPaciente.tipoSanguineo && !infoPaciente.alergias && !infoPaciente.doencasPermanentes) ? (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <span>📋</span>
                <p>Paciente ainda nao preencheu as informacoes</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {infoPaciente.tipoSanguineo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      background: 'var(--coral-100)', color: 'var(--coral-500)',
                      borderRadius: 'var(--radius-md)', padding: '8px 16px',
                      fontWeight: 800, fontSize: 22, fontFamily: 'var(--font-mono)'
                    }}>
                      {infoPaciente.tipoSanguineo}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Tipo Sanguineo</span>
                  </div>
                )}
                {SECOES_INFO.filter(s => s.key !== 'tipoSanguineo').map(s => (
                  infoPaciente[s.key] ? (
                    <div key={s.key} style={{
                      background: 'var(--gray-50)', borderRadius: 'var(--radius-md)',
                      padding: '10px 14px'
                    }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 4, textTransform: 'uppercase' }}>
                        {s.titulo}
                      </p>
                      <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {infoPaciente[s.key]}
                      </p>
                    </div>
                  ) : null
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '6px 0', borderBottom: '1px solid var(--gray-100)'
    }}>
      <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function SecaoConsulta({ titulo, texto, destaque }) {
  return (
    <div className="card" style={destaque ? {
      border: '1.5px solid var(--teal-300)', background: 'var(--teal-50)'
    } : {}}>
      <p style={{
        fontSize: 11, fontWeight: 700,
        color: destaque ? 'var(--teal-700)' : 'var(--gray-500)',
        textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.08em'
      }}>{titulo}</p>
      <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--gray-700)' }}>
        {texto}
      </p>
    </div>
  )
}