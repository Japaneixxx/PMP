import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import './Auth.css'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', senha: '' })
  const { login, carregando, erro } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(form.email, form.senha)
    if (ok) navigate('/app')
  }

  return (
    <div className="auth-bg">
      <div className="auth-card slide-up">
        <div className="auth-logo">💊</div>
        <h1 className="auth-titulo">PMP</h1>
        <p className="auth-subtitulo">Prontuário Médico Pessoal</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="campo">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="campo">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.senha}
              onChange={e => setForm({ ...form, senha: e.target.value })}
              required
            />
          </div>

          {erro && <div className="auth-erro">{erro}</div>}

          <button type="submit" className="btn-primary" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-link">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}
