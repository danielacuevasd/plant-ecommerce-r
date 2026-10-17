import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatearPrecio } from "../utils/formato";

// Props: producto (datos a mostrar) y onAgregar (callback con el id del producto)
export default function ProductCard({ producto, onAgregar }) {
  const [agregado, setAgregado] = useState(false);
  const sinStock = producto.stock <= 0;

  useEffect(() => {
    if (!agregado) return undefined;
    const temporizador = setTimeout(() => setAgregado(false), 1200);
    return () => clearTimeout(temporizador);
  }, [agregado]);

  function manejarClick() {
    onAgregar(producto.id);
    setAgregado(true);
  }

  return (
    <article className="tarjeta-producto">
      <Link to={`/productos/${producto.id}`}>
        <img src={producto.imagen} alt={producto.nombre} />
        <h3>{producto.nombre}</h3>
      </Link>
      <p className="precio">{formatearPrecio(producto.precio)}</p>
      <button type="button" className="btn-secundario" onClick={manejarClick} disabled={sinStock}>
        {sinStock ? "Sin stock" : agregado ? "Agregado" : "Añadir al carrito"}
      </button>
    </article>
  );
}