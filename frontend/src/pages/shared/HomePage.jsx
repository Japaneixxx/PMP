import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import './Pages.css'

export default function HomePage() {
  const { usuario, isMedico } = useAuthStore()
  const [stats, setStats] = useState({ prescricoes: 0, consultas: 0, exames: 0, pacientes: 0 })

  useEffect(() => {
    const requests = [
      api.get('/prescricoes').catch(() => ({ data: [] })),
      api.get('/consultas').catch(() => ({ data: [] })),
      api.get('/exames').catch(() => ({ data: [] })),
    ]

    if (isMedico()) {
      requests.push(api.get('/meus-pacientes').catch(() => ({ data: [] })))
    }

    Promise.all(requests).then(([p, c, e, pac]) => setStats({
      prescricoes: p.data.filter(x => x.ativo !== false).length,
      consultas: c.data.length,
      exames: e.data.length,
      pacientes: pac?.data.length || 0,
    }))
  }, [])

  return (
    <div className="page">
      <div className="page-header teal">
        <h2>Ola, {usuario?.nome?.split(' ')[0]}!</h2>
        <p className="page-subtitle">
          {isMedico() ? `${usuario.especialidade || 'Medico'} ${usuario.crm ? '• ' + usuario.crm : ''}` : 'Paciente'}
        </p>
      </div>
      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {isMedico() && (
            <StatCard emoji="👥" label="Meus Pacientes" value={stats.pacientes} to="/app/meus-pacientes" cor="teal" />
          )}
          <StatCard emoji="📋" label="Consultas" value={stats.consultas} to="/app/consultas" cor="blue" />
          <StatCard emoji="💊" label="Prescricoes Ativas" value={stats.prescricoes} to="/app/prescricoes" cor="teal" />
          <StatCard emoji="🩻" label="Exames" value={stats.exames} to="/app/exames" cor="coral" />
          {!isMedico() && (
            <StatCard emoji="📷" label="QR Code" value="Ver" to="/app/perfil?aba=qrcode" cor="amber" />
          )}
        </div>

        {isMedico() && (
          <Link to="/app/consultas/nova">
            <div className="card" style={{
              background: 'var(--teal-700)', color: 'white',
              textAlign: 'center', padding: '20px', cursor: 'pointer'
            }}>
              <div style={{ fontSize: 28 }}>✍️</div>
              <p style={{ fontWeight: 800, fontSize: 16, marginTop: 8 }}>Nova Consulta</p>
              <p style={{ fontSize: 12, opacity: .8 }}>Registrar atendimento</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}

function StatCard({ emoji, label, value, to, cor }) {
  const cores = {
    teal:  { bg: 'var(--teal-50)',  border: 'var(--teal-200)',  text: 'var(--teal-700)' },
    blue:  { bg: 'var(--blue-100)', border: '#bfdbfe',          text: 'var(--blue-500)' },
    coral: { bg: 'var(--coral-100)',border: '#fecaca',          text: 'var(--coral-500)' },
    amber: { bg: 'var(--amber-100)',border: '#fde68a',          text: '#92400e' },
  }
  const c = cores[cor]
  return (
    <Link to={to}>
      <div style={{
        background: c.bg, border: `1.5px solid ${c.border}`,
        borderRadius: 'var(--radius-lg)', padding: '16px 14px'
      }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
        <p style={{ fontSize: 22, fontWeight: 800, color: c.text }}>{value}</p>
        <p style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600, marginTop: 2 }}>{label}</p>
      </div>
    </Link>
  )
}