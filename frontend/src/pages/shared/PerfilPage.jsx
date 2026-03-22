import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import api from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import './Pages.css'
import { useSearchParams } from 'react-router-dom'

const TIPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const SECOES_INFO = [
  { key: 'alergias', titulo: 'Alergias' },
  { key: 'comorbidades', titulo: 'Comorbidades' },
  { key: 'cirurgiasPrevias', titulo: 'Cirurgias Previas' },
  { key: 'historicoFamiliar', titulo: 'Historico Familiar' },
  { key: 'contextoSocial', titulo: 'Contexto Social' },
  { key: 'observacoes', titulo: 'Observacoes' },
]

export default function PerfilPage() {
  const { usuario, isMedico } = useAuthStore()
  const [info, setInfo] = useState(null)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [searchParams] = useSearchParams()
    const [aba, setAba] = useState(searchParams.get('aba') || 'dados')
  const [form, setForm] = useState({
    tipoSanguineo: '',
    alergias: '',
    comorbidades: '',
    cirurgiasPrevias: '',
    historicoFamiliar: '',
    contextoSocial: '',
    observacoes: '',
})

useEffect(() => { if (!isMedico()) carregar() }, [])
    
    const carregar = async () => {
        try {
            const { data } = await api.get('/paciente-info/me')
            setInfo(data)
            setForm({
                tipoSanguineo: data.tipoSanguineo || '',
                alergias: data.alergias || '',
                comorbidades: data.comorbidades || '',
                cirurgiasPrevias: data.cirurgiasPrevias || '',
                historicoFamiliar: data.historicoFamiliar || '',
                contextoSocial: data.contextoSocial || '',
                observacoes: data.observacoes || '',
      })
    } catch (err) {
      console.error(err)
    }
  }

  const salvar = async (e) => {
    e.preventDefault()
    setSalvando(true)
    try {
      await api.put('/paciente-info/me', form)
      await carregar()
      setEditando(false)
    } catch (err) {
      alert('Erro ao salvar: ' + (err.response?.data || err.message))
    } finally {
      setSalvando(false)
    }
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="page">
      <div className="page-header teal">
        <div className="page-header-top">
          <h2>Perfil</h2>
          {!isMedico() && aba === 'medico' && (
            <button className="btn-icon-white" onClick={() => setEditando(!editando)}>
              {editando ? 'x' : 'Editar'}
            </button>
          )}
        </div>
        <p className="page-subtitle">{usuario?.nome}</p>

        <div className="filtros">
          <button className={`filtro-btn ${aba === 'dados' ? 'ativo' : ''}`} onClick={() => setAba('dados')}>
            Conta
          </button>
          {!isMedico() && (
            <>
              <button className={`filtro-btn ${aba === 'medico' ? 'ativo' : ''}`} onClick={() => setAba('medico')}>
                Info Medica
              </button>
              <button className={`filtro-btn ${aba === 'qrcode' ? 'ativo' : ''}`} onClick={() => setAba('qrcode')}>
                Meu QR Code
              </button>
            </>
          )}
        </div>
      </div>

      <div className="page-body">

        {/* ABA DADOS */}
        {aba === 'dados' && (
          <div className="card">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.08em' }}>
              Dados da Conta
            </p>
            <InfoRow label="Nome" value={usuario?.nome} />
            <InfoRow label="E-mail" value={usuario?.email} />
            <InfoRow label="Perfil" value={usuario?.perfil === 'MEDICO' ? 'Medico' : 'Paciente'} />
            {/* Alterar senha */}
            <AlterarSenha />
            {usuario?.crm && <InfoRow label="CRM" value={usuario.crm} />}
            {usuario?.especialidade && <InfoRow label="Especialidade" value={usuario.especialidade} />}

            {isMedico() && (
              <div style={{ background: 'var(--teal-50)', border: '1.5px solid var(--teal-200)', borderRadius: 'var(--radius-md)', padding: 14, marginTop: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--teal-700)', textAlign: 'center' }}>
                  Para ver informacoes medicas de um paciente, acesse o historico dele atraves de uma consulta.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ABA INFO MEDICA */}
        {aba === 'medico' && !isMedico() && (
          editando ? (
            <form onSubmit={salvar} className="modal-form">
              <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Informacoes Medicas</p>

              <div className="campo">
                <label>Tipo Sanguineo</label>
                <select value={form.tipoSanguineo} onChange={e => set('tipoSanguineo', e.target.value)}>
                  <option value="">Nao sei / Nao informado</option>
                  {TIPOS_SANGUINEOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="campo">
                <label>Alergias</label>
                <textarea value={form.alergias} onChange={e => set('alergias', e.target.value)}
                  placeholder="Ex: Dipirona, Penicilina, Latex..." />
              </div>

              <div className="campo">
                <label>Comorbidades</label>
                <textarea value={form.comorbidades} onChange={e => set('comorbidades', e.target.value)}
                  placeholder="Ex: Diabetes tipo 2, Hipertensao, Asma..." />
              </div>

              <div className="campo">
                <label>Cirurgias Previas</label>
                <textarea value={form.cirurgiasPrevias} onChange={e => set('cirurgiasPrevias', e.target.value)}
                    placeholder="Ex: Apendicectomia em 2015, Cesariana em 2018..." />
            </div>

              <div className="campo">
                <label>Historico Familiar</label>
                <textarea value={form.historicoFamiliar} onChange={e => set('historicoFamiliar', e.target.value)}
                  placeholder="Ex: Pai com historico de infarto..." />
              </div>

              <div className="campo">
                <label>Contexto Social</label>
                <textarea value={form.contextoSocial} onChange={e => set('contextoSocial', e.target.value)}
                  placeholder="Ex: Mora sozinho, trabalha em escritorio..." />
              </div>

              <div className="campo">
                <label>Observacoes Gerais</label>
                <textarea value={form.observacoes} onChange={e => set('observacoes', e.target.value)} />
              </div>

              <button type="submit" className="btn-primary" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar Informacoes'}
              </button>
            </form>
          ) : (
            <div className="card">
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.08em' }}>
                Informacoes Medicas
              </p>

              {info?.tipoSanguineo ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    background: 'var(--coral-100)', color: 'var(--coral-500)',
                    borderRadius: 'var(--radius-md)', padding: '8px 16px',
                    fontWeight: 800, fontSize: 20, fontFamily: 'var(--font-mono)'
                  }}>
                    {info.tipoSanguineo}
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Tipo Sanguineo</span>
                </div>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  <span className="badge badge-gray">Tipo sanguineo nao informado</span>
                </div>
              )}

              {SECOES_INFO.map(s => (
                info?.[s.key] ? (
                  <div key={s.key} style={{ marginBottom: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 4, textTransform: 'uppercase' }}>
                      {s.titulo}
                    </p>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>
                      {info[s.key]}
                    </p>
                  </div>
                ) : null
              ))}

              {!info?.alergias && !info?.comorbidades && !info?.tipoSanguineo && (
                <div className="empty-state" style={{ padding: '24px 0' }}>
                  <span>📋</span>
                  <p>Nenhuma informacao cadastrada</p>
                  <button className="btn-primary-sm" onClick={() => setEditando(true)}>
                    Preencher agora
                  </button>
                </div>
              )}
            </div>
          )
        )}

        {/* ABA QR CODE */}
        {aba === 'qrcode' && !isMedico() && (
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--gray-500)' }}>
              Mostre este QR Code ao seu medico para que ele possa te vincular como paciente.
            </p>

            <div style={{
              background: 'white', padding: 20,
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--teal-200)',
              display: 'inline-block'
            }}>
              <QRCodeSVG value={String(usuario?.id)} size={220} fgColor="#0f7b6c" />
            </div>

            <div style={{
              background: 'var(--teal-50)', borderRadius: 'var(--radius-md)',
              padding: '12px 32px', border: '1.5px solid var(--teal-200)', width: '100%'
            }}>
              <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 4 }}>Seu ID</p>
              <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--teal-700)', fontFamily: 'var(--font-mono)' }}>
                {usuario?.id}
              </p>
            </div>

            <p style={{ fontSize: 12, color: 'var(--gray-300)' }}>
              {usuario?.nome} — {usuario?.email}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function AlterarSenha() {
  const [aberto, setAberto] = useState(false)
  const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)
  const [sucesso, setSucesso] = useState(false)

  const salvar = async (e) => {
    e.preventDefault()
    setErro(null)
    if (form.novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres')
      return
    }
    if (form.novaSenha !== form.confirmar) {
      setErro('As senhas nao coincidem')
      return
    }
    setSalvando(true)
    try {
      await api.patch('/usuarios/alterar-senha', {
        senhaAtual: form.senhaAtual,
        novaSenha: form.novaSenha,
      })
      setSucesso(true)
      setForm({ senhaAtual: '', novaSenha: '', confirmar: '' })
      setTimeout(() => { setSucesso(false); setAberto(false) }, 2000)
    } catch (err) {
      setErro(err.response?.data || 'Erro ao alterar senha')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <button
        className="btn-sm"
        style={{ width: '100%' }}
        onClick={() => { setAberto(!aberto); setErro(null); setSucesso(false) }}
      >
        {aberto ? 'Cancelar' : 'Alterar Senha'}
      </button>

      {aberto && (
        <form onSubmit={salvar} className="modal-form" style={{ marginTop: 14 }}>
          <div className="campo">
            <label>Senha Atual</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.senhaAtual}
              onChange={e => setForm(f => ({ ...f, senhaAtual: e.target.value }))}
              required
            />
          </div>
          <div className="campo">
            <label>Nova Senha</label>
            <input
              type="password"
              placeholder="Minimo 6 caracteres"
              value={form.novaSenha}
              onChange={e => setForm(f => ({ ...f, novaSenha: e.target.value }))}
              required
              minLength={6}
            />
          </div>
          <div className="campo">
            <label>Confirmar Nova Senha</label>
            <input
              type="password"
              placeholder="Repita a nova senha"
              value={form.confirmar}
              onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))}
              required
            />
          </div>

          {erro && <div className="alert-erro">{erro}</div>}
          {sucesso && <div className="alert-sucesso">Senha alterada com sucesso!</div>}

          <button type="submit" className="btn-primary" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Nova Senha'}
          </button>
        </form>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
      <span style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{value || '—'}</span>
    </div>
  )
}