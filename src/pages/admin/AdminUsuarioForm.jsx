import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { actualizarUsuario, crearUsuario, existeCorreo, obtenerUsuarioPorId } from "../../data/db";
import { obtenerComunas, regiones } from "../../data/regiones";
import { validarUsuarioAdmin } from "../../utils/validaciones";

const vacio = {
  run: "", nombre: "", apellidos: "", correo: "", contrasena: "", tipo: "",
  fechaNacimiento: "", region: "", comuna: "", direccion: ""
};

export default function AdminUsuarioForm() {
  const { id } = useParams();
  const navegar = useNavigate();
  const existente = id ? obtenerUsuarioPorId(id) : null;

  const [datos, setDatos] = useState(() => (existente ? { ...vacio, ...existente } : vacio));
  const [errores, setErrores] = useState({});

  if (id && !existente) {
    return <h1>Usuario no encontrado</h1>;
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    // Al cambiar la region se reinicia la comuna
    setDatos(name === "region" ? { ...datos, region: value, comuna: "" } : { ...datos, [name]: value });
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    const nuevos = validarUsuarioAdmin(datos);
    // El correo no puede repetirse, pero un usuario puede conservar el suyo al editar
    if (!nuevos.correo && existeCorreo(datos.correo, existente?.id)) {
      nuevos.correo = "Ya existe un usuario con ese correo.";
    }
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const usuario = {
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      contrasena: datos.contrasena,
      tipo: datos.tipo,
      fechaNacimiento: datos.fechaNacimiento,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim()
    };

    if (existente) actualizarUsuario(existente.id, usuario);
    else crearUsuario(usuario);

    navegar("/admin/usuarios");
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
            id="contrasena" label="Contraseña" type="password" maxLength={10}
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

        <button type="submit" className="btn-principal">
          {existente ? "Guardar cambios" : "Guardar usuario"}
        </button>
      </form>
    </>
  );
}