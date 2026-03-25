import { useAuthStore } from '../../store/authStore'
import { QRCodeSVG } from 'qrcode.react'
import '../shared/Pages.css'

export default function QrCodePacientePage() {
  const { usuario } = useAuthStore()

  return (
    <div className="page">
      <div className="page-header teal">
        <h2>Meu QR Code</h2>
        <p className="page-subtitle">Mostre ao medico para se vincular</p>
      </div>

      <div className="page-body" style={{ alignItems: 'center', textAlign: 'center' }}>
        <div className="card" style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
            Seu medico deve escanear este QR Code para vincula-lo como paciente
          </p>

          <div style={{
            background: 'white', padding: 20,
            borderRadius: 'var(--radius-lg)',
            border: '2px solid var(--teal-200)'
          }}>
            <QRCodeSVG
              value={String(usuario?.id)}
              size={220}
              fgColor="var(--teal-800)"
            />
          </div>

          <div style={{
            background: 'var(--teal-50)', borderRadius: 'var(--radius-md)',
            padding: '12px 24px', border: '1.5px solid var(--teal-200)'
          }}>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 4 }}>Seu ID</p>
            <p style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal-700)', fontFamily: 'var(--font-mono)' }}>
              {usuario?.id}
            </p>
          </div>

          <p style={{ fontSize: 12, color: 'var(--gray-300)' }}>
            {usuario?.nome} • {usuario?.email}
          </p>
        </div>
      </div>
    </div>
  )
}