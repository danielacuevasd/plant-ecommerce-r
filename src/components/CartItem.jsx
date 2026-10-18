import { formatearPrecio } from "../utils/formato";

// Props: item (producto + cantidad), onCambiar(id, nuevaCantidad) y onEliminar(id)
export default function CartItem({ item, onCambiar, onEliminar }) {
  return (
    <article className="item-carrito">
      <img src={item.imagen} alt={item.nombre} width="80" height="80" />
      <div className="item-carrito__info">
        <h3>{item.nombre}</h3>
        <p className="precio">{formatearPrecio(item.precio)}</p>
      </div>
      <div className="item-carrito__cantidad">
        <button
          type="button"
          className="btn-cantidad"
          aria-label={`Restar una unidad de ${item.nombre}`}
          onClick={() => onCambiar(item.id, item.cantidad - 1)}
        >
          -
        </button>
        <span aria-label={`Cantidad de ${item.nombre}`}>{item.cantidad}</span>
        <button
          type="button"
          className="btn-cantidad"
          aria-label={`Sumar una unidad de ${item.nombre}`}
          disabled={item.cantidad >= item.stock}
          onClick={() => onCambiar(item.id, item.cantidad + 1)}
        >
          +
        </button>
      </div>
      <p className="item-carrito__subtotal">{formatearPrecio(item.subtotalItem)}</p>
      <button
        type="button"
        className="btn-eliminar"
        aria-label={`Eliminar ${item.nombre} del carrito`}
        onClick={() => onEliminar(item.id)}
      >
        Eliminar
      </button>
    </article>
  );
}