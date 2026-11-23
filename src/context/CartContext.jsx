import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { mensajeDeError } from "../services/api";
import { obtenerProductos } from "../services/productosService";
import {
  calcularTotales,
  carritoReducer,
  CUPONES_VALIDOS,
  estadoInicialCarrito
} from "../utils/carritoReducer";

const CLAVE_CARRITO = "florae_carrito";

const CartContext = createContext(null);

function leerEstadoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    return guardado ? JSON.parse(guardado) : estadoInicialCarrito;
  } catch {
    return estadoInicialCarrito;
  }
}

export function CartProvider({ children }) {
  const [estado, dispatch] = useReducer(carritoReducer, undefined, leerEstadoGuardado);
  const [catalogo, setCatalogo] = useState(null);
  const [errorCatalogo, setErrorCatalogo] = useState("");

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(estado));
  }, [estado]);

  // El carrito solo guarda id y cantidad: nombre, precio y stock se piden a la API
  useEffect(() => {
    let activo = true;

    async function cargarCatalogo() {
      try {
        const lista = await obtenerProductos();
        if (activo) setCatalogo(Array.isArray(lista) ? lista : []);
      } catch (error) {
        if (activo) setErrorCatalogo(mensajeDeError(error));
      }
    }

    cargarCatalogo();
    return () => {
      activo = false;
    };
  }, []);

  const valor = useMemo(() => {
    const buscar = (id) => catalogo?.find((p) => p.id === id);

    // Une id + cantidad con los datos actuales del producto
    const items = estado.items
      .map((item) => {
        const producto = buscar(item.id);
        if (!producto) return null;
        return { ...producto, cantidad: item.cantidad, subtotalItem: producto.precio * item.cantidad };
      })
      .filter(Boolean);

    const totales = calcularTotales(items, estado.cupon);
    const stockDe = (id) => buscar(id)?.stock;

    return {
      items,
      cupon: estado.cupon,
      // Se calcula con lo guardado para que el Header no parpadee mientras carga el catálogo
      cantidadTotal: estado.items.reduce((total, i) => total + i.cantidad, 0),
      cargando: !catalogo && !errorCatalogo && estado.items.length > 0,
      errorCatalogo,
      ...totales,
      agregar: (id, cantidad = 1) => dispatch({ tipo: "agregar", id, cantidad, stock: stockDe(id) }),
      cambiarCantidad: (id, cantidad) => dispatch({ tipo: "cambiar", id, cantidad, stock: stockDe(id) }),
      eliminar: (id) => dispatch({ tipo: "eliminar", id }),
      vaciar: () => dispatch({ tipo: "vaciar" }),
      aplicarCupon: (codigo) => {
        const normalizado = codigo.trim().toUpperCase();
        if (!normalizado) return { ok: false, error: "Ingresa un código de cupón." };
        if (!CUPONES_VALIDOS[normalizado]) {
          dispatch({ tipo: "cupon", codigo: "" });
          return { ok: false, error: "El cupón ingresado no es válido." };
        }
        dispatch({ tipo: "cupon", codigo: normalizado });
        return { ok: true, error: "" };
      }
    };
  }, [estado, catalogo, errorCatalogo]);

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>;
}

export function useCart() {
  const contexto = useContext(CartContext);
  if (!contexto) throw new Error("useCart debe usarse dentro de CartProvider");
  return contexto;
}