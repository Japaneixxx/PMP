import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { offlineDB } from '../../services/offlineDB'
import api from '../../services/api'
import '../shared/Pages.css'

export default function QrScannerPage() {
  const [escaneando, setEscaneando] = useState(false)
  const [consultasSalvas, setConsultasSalvas] = useState([])
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)
  const scannerRef = useRef(null)

  useEffect(() => {
    carregarSalvas()
    return () => { if (scannerRef.current) scannerRef.current.stop().catch(()=>{}) }
  }, [])

  const carregarSalvas = async () => {
    const salvas = await offlineDB.getConsultas()
    setConsultasSalvas(salvas)
  }

  const iniciarScan = () => {
    setErro(null)
    setEscaneando(true)
  }

  useEffect(() => {
    if (!escaneando) return

    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      async (texto) => {
        await scanner.stop()
        setEscaneando(false)
        await processarQR(texto)
      },
      () => {}
    ).catch(() => {
      setErro('Não foi possível acessar a câmera')
      setEscaneando(false)
    })

    return () => { scanner.stop().catch(() => {}) }
  }, [escaneando]) // eslint-disable-line react-hooks/exhaustive-deps

  const processarQR = async (texto) => {
    try {
      // Extrai o token da URL ou usa direto
      const token = texto.includes('/c/') ? texto.split('/c/')[1] : texto

      // Busca via API pública (sem auth)
      const { data } = await api.get(`/compartilhar/${token}`)

      // Salva offline
      await offlineDB.salvarConsulta(data)
      setResultado(data)
      carregarSalvas()
    } catch (e) {
      if (e.response?.status === 410) setErro('Link expirado — peça um novo QR Code ao médico')
      else if (e.response?.status === 404) setErro('QR Code inválido')
      else setErro('Erro ao processar QR Code')
    }
  }

  const removerSalva = async (id) => {
    await offlineDB.deletarConsulta(id)
    carregarSalvas()
  }

  return (
    <div className="page">
      <div className="page-header teal">
        <h2>QR Code</h2>
        <p className="page-subtitle">Escaneie o QR Code da consulta</p>
      </div>

      <div className="page-body">
        {/* Scanner */}
        <div className="qr-section">
          {!escaneando ? (
            <button className="btn-qr" onClick={iniciarScan}>
              <span className="btn-qr-icon">📷</span>
              <span>Escanear QR Code</span>
            </button>
          ) : (
            <div className="qr-container">
              <div id="qr-reader" style={{ width: '100%' }} />
              <button className="btn-sm btn-danger" onClick={() => {
                scannerRef.current?.stop().catch(()=>{})
                setEscaneando(false)
              }}>Cancelar</button>
            </div>
          )}

          {erro && <div className="alert-erro">{erro}</div>}

          {resultado && (
            <div className="alert-sucesso">
              ✅ Consulta salva! Dr(a). {resultado.medico?.nome} — {new Date(resultado.dataHora).toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>

        {/* Consultas salvas offline */}
        <div className="section-titulo">
          <h3>Consultas Salvas ({consultasSalvas.length})</h3>
          <p className="section-desc">Disponíveis offline</p>
        </div>

        {consultasSalvas.length === 0 ? (
          <div className="empty-state">
            <span>📋</span>
            <p>Nenhuma consulta salva ainda</p>
            <p className="empty-hint">Escaneie o QR Code do seu médico</p>
          </div>
        ) : consultasSalvas.map(c => (
          <div key={c.id} className="card">
            <div className="consulta-card-header">
              <div>
                <p className="consulta-medico">🩺 Dr(a). {c.medico?.nome}</p>
                <p className="consulta-data">{new Date(c.dataHora).toLocaleDateString('pt-BR')}</p>
              </div>
              <button className="btn-sm btn-danger" onClick={() => removerSalva(c.id)}>✕</button>
            </div>
            {c.queixaPrincipal && <p className="consulta-queixa">{c.queixaPrincipal}</p>}
            {c.diagnostico && (
              <div className="consulta-diagnostico">
                <strong>Diagnóstico:</strong> {c.diagnostico}
              </div>
            )}
            {c.prescricoes?.length > 0 && (
              <p className="consulta-prescricoes">💊 {c.prescricoes.length} prescrição(ões)</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
