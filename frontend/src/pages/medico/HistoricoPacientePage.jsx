import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import '../shared/Pages.css'

const SECOES_INFO = [
  { key: 'alergias', titulo: 'Alergias', emoji: 'Alergias' },
  { key: 'comorbidades', titulo: 'Comorbidades', emoji: 'Comorbidades' },
  { key: 'cirurgiasPrevias', titulo: 'Cirurgias Previas', emoji: 'Cirurgias Previas' },
  { key: 'historicoFamiliar', titulo: 'Historico Familiar', emoji: 'Historico Familiar' },
  { key: 'contextoSocial', titulo: 'Contexto Social', emoji: 'Contexto Social' },
  { key: 'observacoes', titulo: 'Observacoes', emoji: 'Observacoes' },
]

export default function HistoricoPacientePage() {
  const { pacienteId } = useParams()
  const navigate = useNavigate()
  const [dados, setDados] = useState(null)
  const [prescricoes, setPrescricoes] = useState([])
  const [consultas, setConsultas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [aba, setAba] = useState('info')

  useEffect(() => { carregar() }, [pacienteId])

  const carregar = async () => {
    try {
      const [historico, presc, consult] = await Promise.all([
        api.get(`/paciente-info/historico/${pacienteId}`),
        api.get(`/prescricoes/paciente/${pacienteId}`),
        api.get(`/consultas/paciente/${pacienteId}/todas`),
      ])
      setDados(historico.data)
      setPrescricoes(presc.data)
      setConsultas(consult.data)
    } catch (err) {
      console.error('Erro:', err.response?.status, err.response?.data, err.config?.url)
      alert('Erro ao carregar historico: ' + (err.response?.data || err.message))
    } finally {
      setCarregando(false)
    }
  }
  
  if (carregando) return <div className="full-center loading">Carregando...</div>
  if (!dados) return <div className="full-center">Paciente nao encontrado</div>

  const { paciente, info } = dados

  return (
    <div className="page">
      <div className="page-header teal">
        <div className="page-header-top">
          <button className="btn-icon-white" onClick={() => navigate(-1)}>←</button>
          <h2>{paciente.nome}</h2>
          <div style={{ width: 36 }} />
        </div>
        <p className="page-subtitle">{paciente.email}</p>

        <div className="filtros">
          <button className={`filtro-btn ${aba === 'info' ? 'ativo' : ''}`} onClick={() => setAba('info')}>
            Info Medica
          </button>
          <button className={`filtro-btn ${aba === 'remedios' ? 'ativo' : ''}`} onClick={() => setAba('remedios')}>
            Remedios ({prescricoes.filter(p => p.ativo).length})
          </button>
          <button className={`filtro-btn ${aba === 'consultas' ? 'ativo' : ''}`} onClick={() => setAba('consultas')}>
            Consultas ({consultas.length})
          </button>
        </div>
      </div>

      <div className="page-body">

        {/* ABA INFO MEDICA */}
        {aba === 'info' && (
          <>
            {/* Tipo sanguineo destaque */}
            {info?.tipoSanguineo ? (
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  background: 'var(--coral-100)', color: 'var(--coral-500)',
                  borderRadius: 'var(--radius-md)', padding: '10px 20px',
                  fontWeight: 800, fontSize: 24, fontFamily: 'var(--font-mono)',
                  minWidth: 70, textAlign: 'center'
                }}>
                  {info.tipoSanguineo}
                </div>
                <div>
                  <p style={{ fontWeight: 700 }}>Tipo Sanguineo</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>Informacao critica</p>
                </div>
              </div>
            ) : (
              <div className="card">
                <span className="badge badge-gray">Tipo sanguineo nao informado</span>
              </div>
            )}

            {/* Demais secoes */}
            {SECOES_INFO.map(s => (
              info?.[s.key] ? (
                <div key={s.key} className="card">
                  <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.08em' }}>
                    {s.titulo}
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--gray-700)' }}>
                    {info[s.key]}
                  </p>
                </div>
              ) : null
            ))}

            {!info?.alergias && !info?.comorbidades && !info?.tipoSanguineo && !info?.cirurgiasPrevias && (
              <div className="empty-state">
                <span>📋</span>
                <p>Paciente ainda nao preencheu as informacoes medicas</p>
              </div>
            )}
          </>
        )}

        {/* ABA REMEDIOS */}
        {aba === 'remedios' && (
          <>
            {prescricoes.length === 0 ? (
              <div className="empty-state">
                <span>💊</span>
                <p>Nenhum remedio cadastrado</p>
              </div>
            ) : (
              <>
                {/* Ativos primeiro */}
                {prescricoes.filter(p => p.ativo).length > 0 && (
                  <>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Em uso ({prescricoes.filter(p => p.ativo).length})
                    </p>
                    {prescricoes.filter(p => p.ativo).map(p => (
                      <PrescricaoCard key={p.id} prescricao={p} />
                    ))}
                  </>
                )}

                {/* Finalizados */}
                {prescricoes.filter(p => !p.ativo).length > 0 && (
                  <>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>
                      Finalizados ({prescricoes.filter(p => !p.ativo).length})
                    </p>
                    {prescricoes.filter(p => !p.ativo).map(p => (
                      <PrescricaoCard key={p.id} prescricao={p} />
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* ABA CONSULTAS */}
        {aba === 'consultas' && (
          <>
            {consultas.length === 0 ? (
              <div className="empty-state">
                <span>📋</span>
                <p>Nenhuma consulta registrada</p>
              </div>
            ) : consultas.map(c => (
              <div key={c.id} className="card" style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/app/consultas/${c.id}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>
                      {new Date(c.dataHora).toLocaleDateString('pt-BR', { dateStyle: 'long' })}
                    </p>
                    {c.queixaPrincipal && (
                      <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{c.queixaPrincipal}</p>
                    )}
                  </div>
                  <span className={`badge ${c.status === 'FINALIZADA' ? 'badge-green' : 'badge-amber'}`}>
                    {c.status === 'FINALIZADA' ? 'Finalizada' : 'Rascunho'}
                  </span>
                </div>
                {c.diagnostico && (
                  <div style={{ background: 'var(--teal-50)', borderRadius: 8, padding: '8px 12px', marginTop: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal-700)', marginBottom: 2 }}>DIAGNOSTICO</p>
                    <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>{c.diagnostico}</p>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function PrescricaoCard({ prescricao: p }) {
  const cor = p.intervaloHoras <= 6 ? 'coral' : p.intervaloHoras <= 12 ? 'amber' : 'teal'
  return (
    <div className="card" style={{ opacity: p.ativo ? 1 : 0.6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15 }}>{p.remedio}</p>
          <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{p.dosagem}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <span className={`badge badge-${cor}`}>A cada {p.intervaloHoras}h</span>
          <span className={`badge ${p.ativo ? 'badge-green' : 'badge-gray'}`}>
            {p.ativo ? 'Ativo' : 'Finalizado'}
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--gray-500)', fontFamily: 'var(--font-mono)' }}>
        <span>Inicio: {p.horarioInicio}</span>
        {p.dataInicio && <span>{p.dataInicio}</span>}
      </div>
      {p.observacoes && (
        <p style={{ fontSize: 12, color: 'var(--gray-500)', fontStyle: 'italic', marginTop: 6 }}>{p.observacoes}</p>
      )}
    </div>
  )
}