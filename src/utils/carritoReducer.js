// Logica pura del carrito: facil de probar sin renderizar componentes.

export const CUPONES_VALIDOS = {
  FLORAE10: 0.1,
  BIENVENIDO: 0.05
};

export const estadoInicialCarrito = { items: [], cupon: "" };

// Limita la cantidad al stock disponible (si se informa)
function limitar(cantidad, stock) {
  return typeof stock === "number" ? Math.min(cantidad, stock) : cantidad;
}

export function carritoReducer(estado, accion) {
  switch (accion.tipo) {
    case "agregar": {
      const { id, cantidad = 1, stock } = accion;
      const existente = estado.items.find((i) => i.id === id);

      if (existente) {
        return {
          ...estado,
          items: estado.items.map((i) =>
            i.id === id ? { ...i, cantidad: limitar(i.cantidad + cantidad, stock) } : i
          )
        };
      }
      return { ...estado, items: [...estado.items, { id, cantidad: limitar(cantidad, stock) }] };
    }

    case "cambiar": {
      const { id, cantidad, stock } = accion;
      if (cantidad <= 0) {
        return { ...estado, items: estado.items.filter((i) => i.id !== id) };
      }
      return {
        ...estado,
        items: estado.items.map((i) => (i.id === id ? { ...i, cantidad: limitar(cantidad, stock) } : i))
      };
    }

    case "eliminar":
      return { ...estado, items: estado.items.filter((i) => i.id !== accion.id) };

    case "cupon":
      return { ...estado, cupon: accion.codigo };

    case "vaciar":
      return estadoInicialCarrito;

    default:
      return estado;
  }
}

export function descuentoDeCupon(codigo) {
  return CUPONES_VALIDOS[codigo] ?? 0;
}

// items: [{ precio, cantidad }]
export function calcularTotales(items, codigoCupon = "") {
  const subtotal = items.reduce((total, i) => total + i.precio * i.cantidad, 0);
  const porcentaje = descuentoDeCupon(codigoCupon);
  const descuento = Math.round(subtotal * porcentaje);
  return { subtotal, descuento, total: subtotal - descuento };
}