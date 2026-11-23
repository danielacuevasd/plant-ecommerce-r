import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import { useCart } from "../context/CartContext";
import { useCargar } from "../hooks/useCargar";
import { obtenerProductoPorId, obtenerProductos } from "../services/productosService";
import { formatearPrecio } from "../utils/formato";

// Trae el producto y, si existe, otros de su misma categoría
async function cargarDetalle(id) {
  const producto = await obtenerProductoPorId(id);
  if (!producto) return { producto: null, relacionados: [] };

  const mismaCategoria = await obtenerProductos(producto.categoria);
  const relacionados = mismaCategoria.filter((p) => p.id !== producto.id).slice(0, 4);
  return { producto, relacionados };
}

export default function DetalleProducto() {
  const { id } = useParams();
  const { agregar } = useCart();
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");
  const { datos, cargando, error } = useCargar(() => cargarDetalle(id), [id]);

  if (cargando) {
    return (
      <section className="encabezado-pagina">
        <p role="status" className="texto-secundario">Cargando producto...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="encabezado-pagina">
        <h1>No pudimos cargar el producto</h1>
        <p role="alert" className="mensaje-error">{error}</p>
        <Link to="/productos" className="btn-principal">Volver a productos</Link>
      </section>
    );
  }

  const { producto, relacionados } = datos;

  if (!producto) {
    return (
      <section className="encabezado-pagina">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscas no existe o fue retirado del catálogo.</p>
        <Link to="/productos" className="btn-principal">Volver a productos</Link>
      </section>
    );
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    const unidades = Math.max(1, parseInt(cantidad, 10) || 1);
    agregar(producto.id, unidades);
    setMensaje(`Se agregó ${producto.nombre} al carrito.`);
  }

  return (
    <>
      <nav className="migas-pan" aria-label="Ruta de navegación">
        <Link to="/">Home</Link> &gt; <Link to="/productos">Productos</Link> &gt;{" "}
        <span>{producto.nombre}</span>
      </nav>

      <section className="detalle-producto">
        <div className="detalle-producto__galeria">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="detalle-producto__info">
          <h1>{producto.nombre}</h1>
          <p className="precio">{formatearPrecio(producto.precio)}</p>
          <p>{producto.descripcion}</p>
          <p className="texto-secundario">Stock disponible: {producto.stock}</p>

          <form className="form-cantidad" onSubmit={manejarSubmit}>
            <label htmlFor="cantidad">Cantidad</label>
            <input
              id="cantidad"
              type="number"
              min="1"
              max={producto.stock}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
            <button type="submit" className="btn-principal" disabled={producto.stock <= 0}>
              Añadir al carrito
            </button>
          </form>
          {mensaje && <p role="status" className="mensaje-exito">{mensaje}</p>}
        </div>
      </section>

      <section className="productos-relacionados">
        <h2>Productos relacionados</h2>
        {relacionados.length ? (
          <ProductList productos={relacionados} onAgregar={(pid) => agregar(pid, 1)} />
        ) : (
          <p className="texto-secundario">No hay productos relacionados por ahora.</p>
        )}
      </section>
    </>
  );
}