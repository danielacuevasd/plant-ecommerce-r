import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { formatearPrecio } from "../utils/formato";

export default function Carrito() {
  const { items, subtotal, descuento, total, cupon, cambiarCantidad, eliminar, aplicarCupon } = useCart();
  const [codigo, setCodigo] = useState("");
  const [errorCupon, setErrorCupon] = useState("");

  function manejarCupon(evento) {
    evento.preventDefault();
    const resultado = aplicarCupon(codigo);
    setErrorCupon(resultado.error);
  }

  return (
    <>
      <section className="encabezado-pagina">
        <h1>Mi carrito de compras</h1>
      </section>

      <section className="carrito-contenido">
        <div className="carrito-items">
          {items.length === 0 ? (
            <p className="texto-secundario">
              Tu carrito está vacío. <Link to="/productos">Explora el catálogo</Link>
            </p>
          ) : (
            items.map((item) => (
              <CartItem key={item.id} item={item} onCambiar={cambiarCantidad} onEliminar={eliminar} />
            ))
          )}
        </div>

        <aside className="carrito-resumen">
          <h2>Resumen</h2>

          <div className="resumen-linea">
            <span>Subtotal</span>
            <span>{formatearPrecio(subtotal)}</span>
          </div>
          {descuento > 0 && (
            <div className="resumen-linea">
              <span>Descuento ({cupon})</span>
              <span>-{formatearPrecio(descuento)}</span>
            </div>
          )}
          <div className="resumen-linea resumen-linea--total">
            <span>Total</span>
            <span data-testid="carrito-total">{formatearPrecio(total)}</span>
          </div>

          <form className="form-cupon" onSubmit={manejarCupon}>
            <label htmlFor="cupon">Cupón de descuento</label>
            <div className="form-cupon__grupo">
              <input
                id="cupon"
                type="text"
                placeholder="Ingresa tu código"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
              />
              <button type="submit" className="btn-secundario">Aplicar</button>
            </div>
            {errorCupon && <small className="mensaje-error" role="alert">{errorCupon}</small>}
          </form>
        </aside>
      </section>
    </>
  );
}