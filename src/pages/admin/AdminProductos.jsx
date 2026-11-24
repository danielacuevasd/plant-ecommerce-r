import { useState } from "react";
import { Link } from "react-router-dom";
import { useCargar } from "../../hooks/useCargar";
import { mensajeDeError } from "../../services/api";
import { eliminarProducto, obtenerProductos } from "../../services/productosService";
import { formatearPrecio } from "../../utils/formato";

export default function AdminProductos() {
  // Al cambiar "version" se vuelve a pedir el listado a la API
  const [version, setVersion] = useState(0);
  const [errorEliminar, setErrorEliminar] = useState("");
  const { datos: productos, cargando, error } = useCargar(() => obtenerProductos(), [version]);

  async function manejarEliminar(producto) {
    if (!window.confirm(`¿Seguro que deseas eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setErrorEliminar("");
    try {
      await eliminarProducto(producto.id);
      setVersion((v) => v + 1);
    } catch (err) {
      setErrorEliminar(mensajeDeError(err));
    }
  }

  return (
    <>
      <div className="admin-encabezado-lista">
        <h1>Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn-principal">Nuevo producto</Link>
      </div>

      {cargando && <p role="status" className="texto-secundario">Cargando productos...</p>}
      {error && <p role="alert" className="mensaje-error">{error}</p>}
      {errorEliminar && <p role="alert" className="mensaje-error">{errorEliminar}</p>}

      {productos && productos.length === 0 && (
        <p className="texto-secundario">No hay productos registrados.</p>
      )}

      {productos && productos.length > 0 && (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => {
                const critico = p.stock <= p.stockCritico;
                return (
                  <tr key={p.id}>
                    <td>{p.codigo}</td>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>{formatearPrecio(p.precio)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`estado ${critico ? "estado--alerta" : "estado--ok"}`}>
                        {critico ? "Stock crítico" : "Disponible"}
                      </span>
                    </td>
                    <td className="acciones">
                      <Link to={`/admin/productos/${p.id}/editar`}>Editar</Link>
                      <button type="button" className="accion-eliminar" onClick={() => manejarEliminar(p)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}