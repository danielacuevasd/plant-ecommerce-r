import { api } from './api.js'

export async function obtenerUsuarios() {
  const { data } = await api.get('/users')
  return data
}

// Devuelve null si el usuario no existe o el id no es valido
export async function obtenerUsuarioPorId(id) {
  try {
    const { data } = await api.get(`/users/${id}`)
    return data
  } catch (error) {
    if ([400, 404].includes(error.response?.status)) return null
    throw error
  }
}

export async function crearUsuario(datos) {
  const { data } = await api.post('/users', datos)
  return data
}

export async function actualizarUsuario(id, datos) {
  const { data } = await api.put(`/users/${id}`, datos)
  return data
}

export async function eliminarUsuario(id) {
  const { data } = await api.delete(`/users/${id}`)
  return data
}