import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import CadastroPage from './pages/auth/CadastroPage'
import HomePage from './pages/shared/HomePage'
import ConsultasPage from './pages/shared/ConsultasPage'
import ConsultaDetalhePage from './pages/shared/ConsultaDetalhePage'
import NovaConsultaPage from './pages/medico/NovaConsultaPage'
import PrescricoesPage from './pages/shared/PrescricoesPage'
import ExamesPage from './pages/shared/ExamesPage'
import QrScannerPage from './pages/paciente/QrScannerPage'
import CompartilharPage from './pages/shared/CompartilharPage'
import PerfilPage from './pages/shared/PerfilPage'
import MeusPacientesPage from './pages/medico/MeusPacientesPage'
import HistoricoPacientePage from './pages/medico/HistoricoPacientePage'


import './styles/global.css'

function Protegido({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/c/:token" element={<CompartilharPage />} /> {/* QR Code público */}

        {/* Protegidas */}
        <Route path="/app" element={<Protegido><Layout /></Protegido>}>
          <Route index element={<HomePage />} />
          <Route path="consultas" element={<ConsultasPage />} />
          <Route path="consultas/nova" element={<NovaConsultaPage />} />
          <Route path="consultas/:id" element={<ConsultaDetalhePage />} />
          <Route path="prescricoes" element={<PrescricoesPage />} />
          <Route path="exames" element={<ExamesPage />} />
          <Route path="qrcode" element={<QrScannerPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="meus-pacientes" element={<MeusPacientesPage />} />
          <Route path="historico/:pacienteId" element={<HistoricoPacientePage />} />

        </Route>

        <Route path="/" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
