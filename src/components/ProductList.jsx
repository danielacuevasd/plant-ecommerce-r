import ProductCard from "./ProductCard";

// Grilla responsiva con Bootstrap: 2 columnas en movil, 3 en tablet y 4 en escritorio
export default function ProductList({ productos, onAgregar }) {
  if (productos.length === 0) {
    return <p className="texto-secundario">No hay productos que coincidan con tu búsqueda.</p>;
  }

  return (
    <div className="row g-4">
      {productos.map((producto) => (
        <div className="col-6 col-md-4 col-lg-3" key={producto.id}>
          <ProductCard producto={producto} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  );
}