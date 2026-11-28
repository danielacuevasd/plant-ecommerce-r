import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { obtenerComunas, regiones } from "../../data/regiones";
import { useCargar } from "../../hooks/useCargar";
import { mensajeDeError } from "../../services/api";
import { actualizarUsuario, crearUsuario, obtenerUsuarioPorId } from "../../services/usuariosService";
import { validarUsuarioAdmin } from "../../utils/validaciones";

const vacio = {
  run: "", nombre: "", apellidos: "", correo: "", contrasena: "", tipo: "",
  fechaNacimiento: "", region: "", comuna: "", direccion: ""
};

function FormularioUsuario({ existente }) {
  const navegar = useNavigate();

  // La API nunca devuelve la contraseña: al editar el campo parte vacío
  const [datos, setDatos] = useState(() => (existente ? { ...vacio, ...existente, contrasena: "" } : vacio));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    // Al cambiar la region se reinicia la comuna
    setDatos(name === "region" ? { ...datos, region: value, comuna: "" } : { ...datos, [name]: value });
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();
    const nuevos = validarUsuarioAdmin(datos, { edicion: Boolean(existente) });
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;

    const usuario = {
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      tipo: datos.tipo,
      fechaNacimiento: datos.fechaNacimiento,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim()
    };
    // Si no se escribe contraseña al editar, la API conserva la actual
    if (datos.contrasena) usuario.contrasena = datos.contrasena;

    setEnviando(true);
    try {
      if (existente) await actualizarUsuario(existente.id, usuario);
      else await crearUsuario(usuario);
      navegar("/admin/usuarios");
    } catch (error) {
      setErrorGeneral(mensajeDeError(error));
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>{existente ? "Editar usuario" : "Nuevo usuario"}</h1>

      <form className="tarjeta-formulario" style={{ maxWidth: 560, marginTop: "1.5rem" }} onSubmit={manejarSubmit} noValidate>
        <CampoFormulario
          id="run" label="RUN" maxLength={9} placeholder="Sin puntos ni guión, ej: 19110220K"
          value={datos.run} onChange={manejarCambio} error={errores.run}
        />
        <CampoFormulario
          id="nombre" label="Nombre" maxLength={50}
          value={datos.nombre} onChange={manejarCambio} error={errores.nombre}
        />
        <CampoFormulario
          id="apellidos" label="Apellidos" maxLength={100}
          value={datos.apellidos} onChange={manejarCambio} error={errores.apellidos}
        />
        <CampoFormulario
          id="correo" label="Correo" type="email" maxLength={100}
          value={datos.correo} onChange={manejarCambio} error={errores.correo}
        />

        <div className="campo-formulario-doble">
          <CampoFormulario
            id="contrasena" type="password" maxLength={10} autoComplete="new-password"
            label={existente ? "Nueva contraseña (opcional)" : "Contraseña"}
            value={datos.contrasena} onChange={manejarCambio} error={errores.contrasena}
          />
          <CampoFormulario
            id="tipo" label="Tipo de usuario" as="select"
            value={datos.tipo} onChange={manejarCambio} error={errores.tipo}
          >
            <option value="">-- Seleccione --</option>
            <option value="Administrador">Administrador</option>
            <option value="Vendedor">Vendedor</option>
            <option value="Cliente">Cliente</option>
          </CampoFormulario>
        </div>

        <CampoFormulario
          id="fechaNacimiento" label="Fecha de nacimiento (opcional)" type="date"
          value={datos.fechaNacimiento} onChange={manejarCambio}
        />

        <div className="campo-formulario-doble">
          <CampoFormulario
            id="region" label="Región" as="select"
            value={datos.region} onChange={manejarCambio} error={errores.region}
          >
            <option value="">-- Seleccione la región --</option>
            {regiones.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
          </CampoFormulario>
          <CampoFormulario
            id="comuna" label="Comuna" as="select"
            value={datos.comuna} onChange={manejarCambio} error={errores.comuna}
          >
            <option value="">-- Seleccione la comuna --</option>
            {obtenerComunas(datos.region).map((c) => <option key={c} value={c}>{c}</option>)}
          </CampoFormulario>
        </div>

        <CampoFormulario
          id="direccion" label="Dirección" maxLength={300}
          value={datos.direccion} onChange={manejarCambio} error={errores.direccion}
        />

        {errorGeneral && <p role="alert" className="mensaje-error">{errorGeneral}</p>}

        <button type="submit" className="btn-principal" disabled={enviando}>
          {enviando ? "Guardando..." : existente ? "Guardar cambios" : "Guardar usuario"}
        </button>
      </form>
    </>
  );
}

export default function AdminUsuarioForm() {
  const { id } = useParams();
  const { datos: existente, cargando, error } = useCargar(
    () => (id ? obtenerUsuarioPorId(id) : Promise.resolve(null)),
    [id]
  );

  // Usuario nuevo: no hay nada que cargar
  if (!id) return <FormularioUsuario key="nuevo" existente={null} />;

  if (cargando) return <p role="status" className="texto-secundario">Cargando usuario...</p>;
  if (error) return <p role="alert" className="mensaje-error">{error}</p>;
  if (!existente) return <h1>Usuario no encontrado</h1>;

  return <FormularioUsuario key={existente.id} existente={existente} />;
}