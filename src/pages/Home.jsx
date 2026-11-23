import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import { useCart } from "../context/CartContext";
import { useCargar } from "../hooks/useCargar";
import { obtenerProductos } from "../services/productosService";

export default function Home() {
  const { agregar } = useCart();
  const { datos, cargando, error } = useCargar(() => obtenerProductos(), []);
  const destacados = datos ? datos.slice(0, 4) : [];

  return (
    <>
      <section className="hero">
        <div className="hero-texto">
          <h1>Naturaleza para tu espacio</h1>
          <p>
            En Florae encuentras plantas, macetas y accesorios para transformar cualquier
            rincón de tu hogar en un espacio verde. Envíos a todo Chile.
          </p>
          <Link to="/productos" className="btn-principal">Ver productos</Link>
        </div>
        <div className="hero-imagen">
          <img src="/img/hero-plantas.jpg" alt="Selección de plantas Florae" />
        </div>
      </section>

      <section className="productos-destacados">
        <h2>Productos destacados</h2>
        {cargando && <p role="status" className="texto-secundario">Cargando productos...</p>}
        {error && <p role="alert" className="mensaje-error">{error}</p>}
        {datos && <ProductList productos={destacados} onAgregar={(id) => agregar(id, 1)} />}
      </section>
    </>
  );
}