import { useState } from "react";
import { Link } from "react-router-dom";
import ProductList from "../components/ProductList";
import { useCart } from "../context/CartContext";
import { obtenerProductos } from "../data/db";

export default function Home() {
  const { agregar } = useCart();
  const [destacados] = useState(() => obtenerProductos().slice(0, 4));

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
        <ProductList productos={destacados} onAgregar={(id) => agregar(id, 1)} />
      </section>
    </>
  );
}