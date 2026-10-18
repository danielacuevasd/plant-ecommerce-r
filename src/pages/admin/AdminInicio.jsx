import { Link } from "react-router-dom";
import { obtenerProductos, obtenerProductosStockCritico, obtenerUsuarios } from "../../data/db";

export default function AdminInicio() {
  const totalProductos = obtenerProductos().length;
  const totalUsuarios = obtenerUsuarios().length;
  const totalCriticos = obtenerProductosStockCritico().length;

  return (
    <>
      <header className="admin-header">
        <h1>Panel de administración</h1>
      </header>

      <section className="admin-resumen">
        <article className="admin-tarjeta">
          <h2>{totalProductos}</h2>
          <p>Productos registrados</p>
        </article>
        <article className="admin-tarjeta">
          <h2>{totalUsuarios}</h2>
          <p>Usuarios registrados</p>
        </article>
        <article className="admin-tarjeta admin-tarjeta--alerta">
          <h2>{totalCriticos}</h2>
          <p>Productos con stock crítico</p>
        </article>
      </section>

      <section className="admin-accesos">
        <h2>Accesos rápidos</h2>
        <div className="admin-accesos__grid">
          <Link to="/admin/productos/nuevo" className="btn-principal">Nuevo producto</Link>
          <Link to="/admin/usuarios/nuevo" className="btn-secundario">Nuevo usuario</Link>
        </div>
      </section>
    </>
  );
}