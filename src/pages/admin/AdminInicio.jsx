import { Link } from "react-router-dom";
import { obtenerUsuarios } from "../../data/db";
import { useCargar } from "../../hooks/useCargar";
import { obtenerProductos } from "../../services/productosService";

// Una sola petición a la API entrega el total y los productos con stock crítico
async function cargarResumen() {
  const productos = await obtenerProductos();
  return {
    totalProductos: productos.length,
    totalCriticos: productos.filter((p) => p.stock <= p.stockCritico).length
  };
}

export default function AdminInicio() {
  const { datos, cargando, error } = useCargar(cargarResumen, []);
  // TODO paso 6: los usuarios todavía vienen de db.js hasta que la API tenga su CRUD
  const totalUsuarios = obtenerUsuarios().length;
  const valor = (n) => (cargando || error ? "—" : n);

  return (
    <>
      <header className="admin-header">
        <h1>Panel de administración</h1>
      </header>

      {error && <p role="alert" className="mensaje-error">{error}</p>}

      <section className="admin-resumen">
        <article className="admin-tarjeta">
          <h2>{valor(datos?.totalProductos)}</h2>
          <p>Productos registrados</p>
        </article>
        <article className="admin-tarjeta">
          <h2>{totalUsuarios}</h2>
          <p>Usuarios registrados</p>
        </article>
        <article className="admin-tarjeta admin-tarjeta--alerta">
          <h2>{valor(datos?.totalCriticos)}</h2>
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