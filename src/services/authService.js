import { api, guardarToken, borrarToken } from './api.js'

// Devuelve el usuario ({ id, nombre, correo, tipo }) y deja el JWT guardado
export async function iniciarSesion(correo, contrasena) {
  borrarToken()
  const { data } = await api.post('/auth/login', { correo, contrasena })
  guardarToken(data.token)
  return data.usuario
}

// El registro inicia sesion automaticamente (RF-08)
export async function registrarUsuario(datos) {
  borrarToken()
  const { data } = await api.post('/auth/register', datos)
  guardarToken(data.token)
  return data.usuario
}

export function cerrarSesion() {
  borrarToken()
}

// Confirma con el servidor que el token guardado sigue siendo valido
export async function obtenerPerfil() {
  const { data } = await api.get('/auth/me')
  return data
}