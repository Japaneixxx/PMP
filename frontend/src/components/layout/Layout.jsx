import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './Layout.css'

const icones = {
  home:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  consultas: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  remedios:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v3"/><circle cx="18" cy="18" r="4"/><path d="M15.5 18H21"/></svg>,
  exames:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  qr:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M18 14h.01M14 18h.01M18 18h.01M14 21h.01M21 14v.01M21 18v3"/></svg>,
  perfil:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  pacientes: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
}

export default function Layout() {
  const { usuario, logout, isMedico } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navMedico = [
  { to: '/app', label: 'Inicio', icon: icones.home, end: true },
  { to: '/app/consultas', label: 'Consultas', icon: icones.consultas },
  { to: '/app/meus-pacientes', label: 'Pacientes', icon: icones.pacientes },
  { to: '/app/prescricoes', label: 'Remedios', icon: icones.remedios },
  { to: '/app/perfil', label: 'Perfil', icon: icones.perfil },
]

  const navPaciente = [
    { to: '/app', label: 'Início', icon: icones.home, end: true },
    { to: '/app/consultas', label: 'Consultas', icon: icones.consultas },
    { to: '/app/prescricoes', label: 'Remédios', icon: icones.remedios },
    { to: '/app/exames', label: 'Exames', icon: icones.exames },
    { to: '/app/perfil', label: 'Perfil', icon: icones.perfil },
  ]

  const navItems = isMedico() ? navMedico : navPaciente

  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <div className="layout-header-left">
          <span className="layout-logo"></span>
          <span className="layout-title">PMP</span>
        </div>
        <div className="layout-header-right">
          <span className="layout-user">{usuario?.nome?.split(' ')[0]}</span>
          <span className={`layout-badge ${isMedico() ? 'badge-medico' : 'badge-paciente'}`}>
            {isMedico() ? 'Médico' : 'Paciente'}
          </span>
          <button className="layout-logout" onClick={handleLogout} title="Sair">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="layout-content">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <nav className="layout-nav">
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item--active' : ''}`
          }>
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
