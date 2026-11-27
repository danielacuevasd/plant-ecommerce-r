import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCargar } from "../../hooks/useCargar";
import { mensajeDeError } from "../../services/api";
import { eliminarUsuario, obtenerUsuarios } from "../../services/usuariosService";

export default function AdminUsuarios() {
  const { sesion } = useAuth();
  // Al cambiar "version" se vuelve a pedir el listado a la API
  const [version, setVersion] = useState(0);
  const [errorEliminar, setErrorEliminar] = useState("");
  const { datos: usuarios, cargando, error } = useCargar(() => obtenerUsuarios(), [version]);

  async function manejarEliminar(usuario) {
    if (!window.confirm(`¿Seguro que deseas eliminar a ${usuario.nombre}? Esta acción no se puede deshacer.`)) {
      return;
    }
    setErrorEliminar("");
    try {
      await eliminarUsuario(usuario.id);
      setVersion((v) => v + 1);
    } catch (err) {
      setErrorEliminar(mensajeDeError(err));
    }
  }

  return (
    <>
      <div className="admin-encabezado-lista">
        <h1>Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn-principal">Nuevo usuario</Link>
      </div>

      {cargando && <p role="status" className="texto-secundario">Cargando usuarios...</p>}
      {error && <p role="alert" className="mensaje-error">{error}</p>}
      {errorEliminar && <p role="alert" className="mensaje-error">{errorEliminar}</p>}

      {usuarios && (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>RUN</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.tipo}</td>
                  <td className="acciones">
                    <Link to={`/admin/usuarios/${u.id}/editar`}>Editar</Link>
                    <button
                      type="button"
                      className="accion-eliminar"
                      disabled={u.id === sesion?.id}
                      title={u.id === sesion?.id ? "No puedes eliminar tu propia cuenta" : undefined}
                      onClick={() => manejarEliminar(u)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}