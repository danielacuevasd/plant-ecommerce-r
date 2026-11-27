import { useCargar } from "../../hooks/useCargar";
import { obtenerMensajes } from "../../services/contactoService";

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function AdminMensajes() {
  const { datos: mensajes, cargando, error } = useCargar(() => obtenerMensajes(), []);

  return (
    <>
      <div className="admin-encabezado-lista">
        <h1>Mensajes de contacto</h1>
      </div>

      {cargando && <p role="status" className="texto-secundario">Cargando mensajes...</p>}
      {error && <p role="alert" className="mensaje-error">{error}</p>}

      {mensajes && mensajes.length === 0 && (
        <p className="texto-secundario">Todavía no hay mensajes de contacto.</p>
      )}

      {mensajes && mensajes.length > 0 && (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Comentario</th>
              </tr>
            </thead>
            <tbody>
              {mensajes.map((m) => (
                <tr key={m.id}>
                  <td>{formatearFecha(m.fecha)}</td>
                  <td>{m.nombre}</td>
                  <td>{m.correo}</td>
                  <td>{m.comentario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}