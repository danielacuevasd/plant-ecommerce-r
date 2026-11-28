import { api } from './api.js'

// Publico: cualquier visitante puede enviar un mensaje
export async function enviarMensaje(datos) {
  const { data } = await api.post('/contact', datos)
  return data
}

// Solo administrador
export async function obtenerMensajes() {
  const { data } = await api.get('/contact')
  return data
}