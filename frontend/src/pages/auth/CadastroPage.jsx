import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './Auth.css'

export default function CadastroPage() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', perfil: 'PACIENTE',
    crm: '', especialidade: '', telefone: ''
  })
  const { cadastro, carregando, erro } = useAuthStore()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await cadastro(form)
    if (ok) navigate('/app')
  }

  return (
    <div className="auth-bg">
      <div className="auth-card slide-up">
        <div className="auth-logo">💊</div>
        <h1 className="auth-titulo">Criar Conta</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Tipo de perfil */}
          <div className="perfil-toggle">
            <button type="button"
              className={`perfil-btn ${form.perfil === 'PACIENTE' ? 'ativo' : ''}`}
              onClick={() => set('perfil', 'PACIENTE')}>
              👤 Paciente
            </button>
            <button type="button"
              className={`perfil-btn ${form.perfil === 'MEDICO' ? 'ativo' : ''}`}
              onClick={() => set('perfil', 'MEDICO')}>
              🩺 Médico
            </button>
          </div>

          <div className="campo">
            <label>Nome completo</label>
            <input type="text" placeholder="Seu nome"
              value={form.nome} onChange={e => set('nome', e.target.value)} required />
          </div>
          <div className="campo">
            <label>E-mail</label>
            <input type="email" placeholder="seu@email.com"
              value={form.email} onChange={e => set('email', e.target.value)} required />
          </div>
          <div className="campo">
            <label>Senha</label>
            <input type="password" placeholder="Mínimo 6 caracteres"
              value={form.senha} onChange={e => set('senha', e.target.value)} required minLength={6} />
          </div>
          <div className="campo">
            <label>Telefone</label>
            <input type="tel" placeholder="(11) 99999-9999"
              value={form.telefone} onChange={e => set('telefone', e.target.value)} />
          </div>

          {form.perfil === 'MEDICO' && (
            <>
              <div className="campo">
                <label>CRM</label>
                <input type="text" placeholder="CRM/SP 123456"
                  value={form.crm} onChange={e => set('crm', e.target.value)} />
              </div>
              <div className="campo">
                <label>Especialidade</label>
                <input type="text" placeholder="Ex: Cardiologia"
                  value={form.especialidade} onChange={e => set('especialidade', e.target.value)} />
              </div>
            </>
          )}

          {erro && <div className="auth-erro">{erro}</div>}

          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
