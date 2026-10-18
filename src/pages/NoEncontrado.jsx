import { Link } from "react-router-dom";

export default function NoEncontrado() {
  return (
    <section className="encabezado-pagina">
      <h1>Página no encontrada</h1>
      <p>La dirección que ingresaste no existe.</p>
      <Link to="/" className="btn-principal">Volver al inicio</Link>
    </section>
  );
}