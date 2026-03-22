import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import api from '../../services/api'
import '../shared/Pages.css'

export default function MeusPacientesPage() {
  const [pacientes, setPacientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modal, setModal] = useState(false) // 'scanner' | 'id' | null
  const [idInput, setIdInput] = useState('')
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(null)
  const [escaneando, setEscaneando] = useState(false)
  const scannerRef = useState(null)
  const navigate = useNavigate()

  useEffect(() => { carregar() }, [])

  const carregar = async () => {
    api.get('/meus-pacientes')
      .then(r => setPacientes(r.data))
      .finally(() => setCarregando(false))
  }

  const vincularPorId = async (id) => {
    setErro(null)
    try {
      await api.post(`/meus-pacientes/vincular/${id}`)
      setSucesso('Paciente vinculado com sucesso!')
      setModal(null)
      setIdInput('')
      carregar()
    } catch (err) {
      setErro(err.response?.data || 'Erro ao vincular paciente')
    }
  }

  const desvincular = async (pacienteId) => {
    if (!confirm('Desvincular este paciente?')) return
    await api.delete(`/meus-pacientes/desvincular/${pacienteId}`)
    carregar()
  }

  const iniciarScan = async () => {
    setErro(null)
    setEscaneando(true)
    try {
      const scanner = new Html5Qrcode('qr-reader-paciente')
      scannerRef[0] = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (texto) => {
          await scanner.stop()
          setEscaneando(false)
          // QR Code do paciente contém o ID
          const id = texto.replace(/\D/g, '') // extrai só números
          if (id) await vincularPorId(id)
          else setErro('QR Code inválido')
        },
        () => {}
      )
    } catch {
      setErro('Não foi possível acessar a câmera')
      setEscaneando(false)
    }
  }

  const pararScan = () => {
    scannerRef[0]?.stop().catch(() => {})
    setEscaneando(false)
    setModal(null)
  }

  return (
    <div className="page">
      <div className="page-header teal">
        <div className="page-header-top">
          <h2>Meus Pacientes</h2>
          <button className="btn-icon-white" onClick={() => { setModal('opcoes'); setSucesso(null); setErro(null) }}>+</button>
        </div>
        <p className="page-subtitle">{pacientes.length} paciente(s) vinculado(s)</p>
      </div>

      <div className="page-body">
        {sucesso && <div className="alert-sucesso">{sucesso}</div>}

        {carregando ? <div className="loading">Carregando...</div> :
         pacientes.length === 0 ? (
          <div className="empty-state">
            <span>👥</span>
            <p>Nenhum paciente vinculado ainda</p>
            <p className="empty-hint">Escaneie o QR Code do paciente ou digite o ID</p>
            <button className="btn-primary-sm" onClick={() => setModal('opcoes')}>
              Adicionar Paciente
            </button>
          </div>
        ) : pacientes.map(p => (
          <div key={p.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15 }}>{p.nome}</p>
                <p style={{ fontSize: 12, color: 'var(--gray-500)', fontFamily: 'var(--font-mono)' }}>
                  ID: {p.id} • {p.email}
                </p>
              </div>
              <span style={{
                background: 'var(--teal-100)', color: 'var(--teal-700)',
                borderRadius: '50%', width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, fontWeight: 800
              }}>
                {p.nome?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="card-actions">
              <button className="btn-sm" onClick={() => navigate(`/app/consultas/nova?pacienteId=${p.id}`)}>
                Nova Consulta
              </button>
              <button className="btn-sm" onClick={() => navigate(`/app/historico/${p.id}`)}>
                Historico
              </button>
              <button className="btn-sm btn-danger" onClick={() => desvincular(p.id)}>
                Desvincular
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal opcoes */}
      {modal === 'opcoes' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Adicionar Paciente</h3>
              <button onClick={() => setModal(null)}>x</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button className="btn-qr" onClick={() => setModal('scanner')}>
                <span className="btn-qr-icon">📷</span>
                <span>Escanear QR Code do Paciente</span>
              </button>
              <button className="btn-qr" onClick={() => setModal('id')}>
                <span className="btn-qr-icon">🔢</span>
                <span>Digitar ID do Paciente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal scanner */}
      {modal === 'scanner' && (
        <div className="modal-overlay" onClick={pararScan}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Escanear QR Code</h3>
              <button onClick={pararScan}>x</button>
            </div>
            {!escaneando ? (
              <button className="btn-primary" onClick={iniciarScan}>Iniciar Camera</button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
                <div id="qr-reader-paciente" style={{ width: '100%' }} />
                <button className="btn-sm btn-danger" onClick={pararScan}>Cancelar</button>
              </div>
            )}
            {erro && <div className="alert-erro" style={{ marginTop: 12 }}>{erro}</div>}
          </div>
        </div>
      )}

      {/* Modal digitar ID */}
      {modal === 'id' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Digitar ID do Paciente</h3>
              <button onClick={() => setModal(null)}>x</button>
            </div>
            <div className="modal-form">
              <div className="campo">
                <label>ID do Paciente</label>
                <input
                  type="number"
                  placeholder="Ex: 42"
                  value={idInput}
                  onChange={e => setIdInput(e.target.value)}
                  autoFocus
                />
              </div>
              {erro && <div className="alert-erro">{erro}</div>}
              <button
                className="btn-primary"
                onClick={() => vincularPorId(idInput)}
                disabled={!idInput}
              >
                Vincular Paciente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}