import { useState } from "react";
import { Link } from "react-router-dom";
import { eliminarProducto, obtenerProductos } from "../../data/db";
import { formatearPrecio } from "../../utils/formato";

export default function AdminProductos() {
  const [productos, setProductos] = useState(obtenerProductos);

  function manejarEliminar(producto) {
    if (!window.confirm(`¿Seguro que deseas eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    eliminarProducto(producto.id);
    setProductos(obtenerProductos());
  }

  return (
    <>
      <div className="admin-encabezado-lista">
        <h1>Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn-principal">Nuevo producto</Link>
      </div>

      {productos.length === 0 ? (
        <p className="texto-secundario">No hay productos registrados.</p>
      ) : (
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