import axios from 'axios'

const CLAVE_TOKEN = 'florae_token'
const CLAVE_SESION = 'florae_sesion'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
})

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN)
}

export function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token)
}

export function borrarToken() {
  localStorage.removeItem(CLAVE_TOKEN)
}

// Envia el JWT como Bearer en cada peticion
api.interceptors.request.use((config) => {
  const token = obtenerToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si el servidor rechaza el token (vencido o invalido), se cierra la sesion
api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401 && obtenerToken()) {
      borrarToken()
      localStorage.removeItem(CLAVE_SESION)
      window.location.assign('/login')
    }
    return Promise.reject(error)
  }
)

// Texto listo para mostrar al usuario a partir de un error de axios
export function mensajeDeError(error) {
  if (!error.response) return 'No se pudo conectar con el servidor'
  const { mensaje, errores } = error.response.data ?? {}
  if (errores?.length) return errores.join('. ')
  return mensaje ?? 'Ocurrió un error inesperado'
}