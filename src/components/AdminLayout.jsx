import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Solo el administrador puede entrar al panel
export default function AdminLayout() {
  const { sesion } = useAuth();

  if (!sesion || sesion.tipo !== "Administrador") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <img src="/img/logo.png" alt="Logo Florae" className="logo-img" />
          <span>Florae</span>
        </div>

        <nav className="admin-nav" aria-label="Panel administrador">
          <ul>
            <li><NavLink to="/admin" end>Inicio</NavLink></li>
            <li><NavLink to="/admin/productos">Productos</NavLink></li>
            <li><NavLink to="/admin/usuarios">Usuarios</NavLink></li>
          </ul>
        </nav>

        <div className="admin-sidebar__pie">
          <Link to="/">Volver a la tienda</Link>
        </div>
      </aside>

      <main className="admin-contenido">
        <Outlet />
      </main>
    </div>
  );
}