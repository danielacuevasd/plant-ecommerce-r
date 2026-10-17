import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columna">
        <h3>Florae</h3>
        <p>Tu vivero online de confianza.</p>
      </div>

      <div className="footer-columna">
        <h4>Categorías</h4>
        <ul>
          <li><Link to="/productos">Plantas de interior</Link></li>
          <li><Link to="/productos">Plantas de exterior</Link></li>
          <li><Link to="/productos">Macetas y accesorios</Link></li>
        </ul>
      </div>

      <div className="footer-columna">
        <h4>Contacto</h4>
        <p>contacto@florae.cl</p>
        <p>Santiago, Chile</p>
      </div>
    </footer>
  );
}