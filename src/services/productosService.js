import { api } from './api.js'

export async function obtenerProductos(categoria) {
  const { data } = await api.get('/products', {
    params: categoria ? { categoria } : undefined,
  })
  return data
}

// Devuelve null si el producto no existe o el id no es valido
export async function obtenerProductoPorId(id) {
  try {
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (error) {
    if ([400, 404].includes(error.response?.status)) return null
    throw error
  }
}

export async function crearProducto(datos) {
  const { data } = await api.post('/products', datos)
  return data
}

export async function actualizarProducto(id, datos) {
  const { data } = await api.put(`/products/${id}`, datos)
  return data
}

export async function eliminarProducto(id) {
  await api.delete(`/products/${id}`)
  return true
}

export async function obtenerProductosStockCritico() {
  const productos = await obtenerProductos()
  return productos.filter((p) => p.stock <= p.stockCritico)
}