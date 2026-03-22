import { useState, useEffect } from 'react'
import api from '../../services/api'
import './Pages.css'

export default function ExamesPage() {
  const [exames, setExames] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ nome: '', tipo: 'IMAGEM', descricao: '', arquivo: null })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => { carregar() }, [])

  const carregar = async () => {
    api.get('/exames').then(r => setExames(r.data)).finally(() => setCarregando(false))
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (!form.arquivo) return alert('Selecione um arquivo')
    setEnviando(true)
    try {
      const fd = new FormData()
      fd.append('arquivo', form.arquivo)
      fd.append('nome', form.nome)
      fd.append('tipo', form.tipo)
      fd.append('descricao', form.descricao)
      await api.post('/exames', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setModal(false)
      setForm({ nome: '', tipo: 'IMAGEM', descricao: '', arquivo: null })
      carregar()
    } catch (err) {
      alert('Erro: ' + (err.response?.data || err.message))
    } finally {
      setEnviando(false)
    }
  }

  const deletar = async (id) => {
    if (!confirm('Remover exame?')) return
    await api.delete(`/exames/${id}`)
    carregar()
  }

  const icone = (tipo) => ({ IMAGEM: '🩻', LABORATORIAL: '🧪', LAUDO: '📄', OUTRO: '📎' }[tipo] || '📎')

  const formatarTamanho = (bytes) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + 'B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + 'KB'
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB'
  }

  return (
    <div className="page">
      <div className="page-header teal">
        <div className="page-header-top">
          <h2>Exames</h2>
          <button className="btn-icon-white" onClick={() => setModal(true)}>+</button>
        </div>
      </div>

      <div className="page-body">
        {carregando ? <div className="loading">Carregando...</div> :
         exames.length === 0 ? (
          <div className="empty-state">
            <span>🩻</span>
            <p>Nenhum exame cadastrado</p>
            <button className="btn-primary-sm" onClick={() => setModal(true)}>Adicionar Exame</button>
          </div>
        ) : exames.map(e => (
          <div key={e.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 28 }}>{icone(e.tipo)}</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{e.nome}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {new Date(e.criadoEm).toLocaleDateString('pt-BR')}
                    {e.arquivoTamanho && ` • ${formatarTamanho(e.arquivoTamanho)}`}
                  </p>
                  {e.descricao && <p style={{ fontSize: 13, color: 'var(--gray-700)', marginTop: 4 }}>{e.descricao}</p>}
                </div>
              </div>
              <span className="badge badge-teal">{e.tipo}</span>
            </div>
            <div className="card-actions">
              {e.arquivoUrl && (
                <a href={e.arquivoUrl} target="_blank" rel="noreferrer">
                  <button className="btn-sm">Abrir</button>
                </a>
              )}
              <button className="btn-sm btn-danger" onClick={() => deletar(e.id)}>Remover</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Novo Exame</h3>
              <button onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={enviar} className="modal-form">
              <div className="campo"><label>Nome do exame</label>
                <input required placeholder="Ex: Raio-X Tórax, Hemograma..."
                  value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} /></div>
              <div className="campo"><label>Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                  <option value="IMAGEM">🩻 Imagem (Raio-X, Tomografia...)</option>
                  <option value="LABORATORIAL">🧪 Laboratorial</option>
                  <option value="LAUDO">📄 Laudo PDF</option>
                  <option value="OUTRO">📎 Outro</option>
                </select>
              </div>
              <div className="campo"><label>Descrição (opcional)</label>
                <textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} /></div>
              <div className="campo"><label>Arquivo (imagem ou PDF, max 20MB)</label>
                <input type="file" accept="image/*,.pdf"
                  onChange={e => setForm({...form, arquivo: e.target.files[0]})} required /></div>
              <button type="submit" className="btn-primary" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Enviar Exame'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
