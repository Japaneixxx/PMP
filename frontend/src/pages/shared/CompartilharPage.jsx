// CompartilharPage.jsx — Página pública acessada pelo QR Code
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import '../shared/Pages.css'

export default function CompartilharPage() {
  const { token } = useParams()
  const [consulta, setConsulta] = useState(null)
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    axios.get(`/api/compartilhar/${token}`)
      .then(r => setConsulta(r.data))
      .catch(e => setErro(e.response?.data || 'Erro ao carregar consulta'))
      .finally(() => setCarregando(false))
  }, [token])

  if (carregando) return <div className="full-center">Carregando...</div>
  if (erro) return (
    <div className="full-center">
      <div className="empty-state">
        <span>⚠️</span>
        <p>{erro}</p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 40 }}>💊</div>
        <h1 style={{ color: 'var(--teal-700)', fontSize: 22, fontWeight: 800 }}>PMP</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>Consulta compartilhada</p>
      </div>

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase' }}>Médico</p>
          <p style={{ fontWeight: 700, fontSize: 16 }}>Dr(a). {consulta.medico?.nome}</p>
          {consulta.medico?.especialidade && <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>{consulta.medico.especialidade}</p>}
          {consulta.medico?.crm && <p style={{ color: 'var(--gray-500)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>{consulta.medico.crm}</p>}
        </div>
        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 12, marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 700 }}>DATA</p>
          <p style={{ fontWeight: 600 }}>{new Date(consulta.dataHora).toLocaleDateString('pt-BR', { dateStyle: 'full' })}</p>
        </div>
        {consulta.queixaPrincipal && <SectionCard label="Queixa Principal" value={consulta.queixaPrincipal} />}
        {consulta.diagnostico && <SectionCard label="Diagnóstico" value={consulta.diagnostico} />}
        {consulta.planoTratamento && <SectionCard label="Plano de Tratamento" value={consulta.planoTratamento} />}
        {consulta.observacoes && <SectionCard label="Observações" value={consulta.observacoes} />}
      </div>

      {consulta.prescricoes?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h3 style={{ fontWeight: 800, marginBottom: 12, color: 'var(--teal-700)' }}>💊 Prescrições</h3>
          {consulta.prescricoes.map(p => (
            <div key={p.id} className="card" style={{ marginBottom: 8 }}>
              <p style={{ fontWeight: 700 }}>{p.remedio}</p>
              <p style={{ color: 'var(--gray-500)', fontSize: 13 }}>{p.dosagem} — a cada {p.intervaloHoras}h</p>
            </div>
          ))}
        </div>
      )}

      <p style={{ textAlign: 'center', color: 'var(--gray-300)', fontSize: 11, marginTop: 32 }}>
        Gerado pelo PMP — Prontuário Médico Pessoal
      </p>
    </div>
  )
}

function SectionCard({ label, value }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <p style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{value}</p>
    </div>
  )
}
