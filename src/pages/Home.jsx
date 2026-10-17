import { Link } from "react-router-dom";

export default function Home() {
  return (
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
  );
}