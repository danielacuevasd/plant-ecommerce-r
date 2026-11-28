import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { puedeEntrarAlPanel, ROLES } from "../utils/roles";

// Cada opción del menú indica qué roles la ven
const opciones = [
  { to: "/admin", texto: "Inicio", end: true, roles: [ROLES.ADMIN] },
  { to: "/admin/productos", texto: "Productos", roles: [ROLES.ADMIN, ROLES.VENDEDOR] },
  { to: "/admin/usuarios", texto: "Usuarios", roles: [ROLES.ADMIN] },
  { to: "/admin/mensajes", texto: "Mensajes", roles: [ROLES.ADMIN] }
];

// Entran al panel el administrador y el vendedor; cada uno ve solo lo suyo
export default function AdminLayout() {
  const { sesion } = useAuth();

  if (!sesion || !puedeEntrarAlPanel(sesion.tipo)) {
    return <Navigate to="/login" replace />;
  }

  const menu = opciones.filter((opcion) => opcion.roles.includes(sesion.tipo));

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">
          <img src="/img/logo.png" alt="Logo Florae" className="logo-img" />
          <span>Florae</span>
        </div>

        <nav className="admin-nav" aria-label="Panel administrador">
          <ul>
            {menu.map((opcion) => (
              <li key={opcion.to}>
                <NavLink to={opcion.to} end={opcion.end}>{opcion.texto}</NavLink>
              </li>
            ))}
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