import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { cantidadTotal } = useCart();
  const { sesion, cerrarSesion } = useAuth();
  const navegar = useNavigate();

  function salir() {
    cerrarSesion();
    navegar("/");
  }

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src="/img/logo.png" alt="Logo Florae" className="logo-img" />
          <span>Florae</span>
        </Link>
      </div>

      <button
        type="button"
        className="btn-secundario d-md-none"
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        Menú
      </button>

      <nav
        id="menu-principal"
        className={`nav-principal ${menuAbierto ? "d-block" : "d-none"} d-md-block`}
        aria-label="Navegación principal"
      >
        <ul className="flex-column flex-md-row">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/productos">Productos</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/contacto">Contacto</NavLink></li>
        </ul>
      </nav>

      <div className="acciones-usuario">
        {sesion ? (
          <>
            <span>Hola, {sesion.nombre}</span>
            {sesion.tipo === "Administrador" && <Link to="/admin">Panel admin</Link>}
            <button type="button" className="btn-secundario" onClick={salir}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Iniciar sesión</NavLink>
            <NavLink to="/registro">Registrarse</NavLink>
          </>
        )}
        <NavLink to="/carrito" className="carrito-link">
          Carrito (<span data-testid="contador-carrito">{cantidadTotal}</span>)
        </NavLink>
      </div>
    </header>
  );
}