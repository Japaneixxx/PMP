import { create } from 'zustand'
import api from '../services/api'

export const useAuthStore = create((set, get) => ({
  usuario: JSON.parse(localStorage.getItem('pmp_usuario') || 'null'),
  token: localStorage.getItem('pmp_token') || null,
  carregando: false,
  erro: null,

  login: async (email, senha) => {
    set({ carregando: true, erro: null })
    try {
      const { data } = await api.post('/auth/login', { email, senha })
      localStorage.setItem('pmp_token', data.token)
      localStorage.setItem('pmp_usuario', JSON.stringify(data.usuario))
      set({ token: data.token, usuario: data.usuario, carregando: false })
      return true
    } catch (e) {
      set({ erro: e.response?.data || 'Erro ao fazer login', carregando: false })
      return false
    }
  },

  cadastro: async (dados) => {
    set({ carregando: true, erro: null })
    try {
      const { data } = await api.post('/auth/cadastro', dados)
      localStorage.setItem('pmp_token', data.token)
      localStorage.setItem('pmp_usuario', JSON.stringify(data.usuario))
      set({ token: data.token, usuario: data.usuario, carregando: false })
      return true
    } catch (e) {
      set({ erro: e.response?.data || 'Erro ao cadastrar', carregando: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('pmp_token')
    localStorage.removeItem('pmp_usuario')
    set({ token: null, usuario: null })
  },

  isMedico: () => get().usuario?.perfil === 'MEDICO',
  isPaciente: () => get().usuario?.perfil === 'PACIENTE',
}))
