import { openDB } from 'idb'

const DB_NAME = 'pmp-offline'
const DB_VERSION = 1

async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Consultas salvas offline (QR Code)
      if (!db.objectStoreNames.contains('consultas')) {
        db.createObjectStore('consultas', { keyPath: 'id' })
      }
      // Prescrições salvas offline
      if (!db.objectStoreNames.contains('prescricoes')) {
        db.createObjectStore('prescricoes', { keyPath: 'id' })
      }
      // Exames salvos offline
      if (!db.objectStoreNames.contains('exames')) {
        db.createObjectStore('exames', { keyPath: 'id' })
      }
    }
  })
}

export const offlineDB = {
  // Salvar consulta recebida pelo QR Code para acesso offline
  async salvarConsulta(consulta) {
    const db = await getDB()
    await db.put('consultas', { ...consulta, salvoOfflineEm: new Date().toISOString() })
  },

  async getConsultas() {
    const db = await getDB()
    return db.getAll('consultas')
  },

  async getConsulta(id) {
    const db = await getDB()
    return db.get('consultas', id)
  },

  async deletarConsulta(id) {
    const db = await getDB()
    return db.delete('consultas', id)
  },

  // Prescrições offline
  async salvarPrescricoes(prescricoes) {
    const db = await getDB()
    const tx = db.transaction('prescricoes', 'readwrite')
    await Promise.all(prescricoes.map(p => tx.store.put(p)))
    await tx.done
  },

  async getPrescricoes() {
    const db = await getDB()
    return db.getAll('prescricoes')
  },

  // Exames offline
  async salvarExames(exames) {
    const db = await getDB()
    const tx = db.transaction('exames', 'readwrite')
    await Promise.all(exames.map(e => tx.store.put(e)))
    await tx.done
  },

  async getExames() {
    const db = await getDB()
    return db.getAll('exames')
  }
}
