import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import { useCart } from "../context/CartContext";
import { formatearPrecio } from "../utils/formato";

export default function Carrito() {
  const { items, subtotal, total, cambiarCantidad, eliminar } = useCart();

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
          <div className="resumen-linea resumen-linea--total">
            <span>Total</span>
            <span data-testid="carrito-total">{formatearPrecio(total)}</span>
          </div>
        </aside>
      </section>
    </>
  );
}