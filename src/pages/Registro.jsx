import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import { useAuth } from "../context/AuthContext";
import { obtenerComunas, regiones } from "../data/regiones";
import { validarRegistro } from "../utils/validaciones";

const datosIniciales = {
  run: "", nombre: "", apellidos: "", correo: "", contrasena: "", confirmar: "",
  fechaNacimiento: "", telefono: "", region: "", comuna: "", direccion: ""
};

export default function Registro() {
  const { registrar } = useAuth();
  const navegar = useNavigate();
  const [datos, setDatos] = useState(datosIniciales);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    // Al cambiar la region se reinicia la comuna
    setDatos(name === "region" ? { ...datos, region: value, comuna: "" } : { ...datos, [name]: value });
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    const nuevos = validarRegistro(datos);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;

    const resultado = registrar(datos);
    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    navegar("/");
  }

  return (
    <section className="seccion-formulario">
      <form className="tarjeta-formulario" onSubmit={manejarSubmit} noValidate>
        <h1>Registro de usuario</h1>

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
          id="correo" label="Correo" type="email" maxLength={100} autoComplete="email"
          value={datos.correo} onChange={manejarCambio} error={errores.correo}
        />
        <CampoFormulario
          id="contrasena" label="Contraseña" type="password" maxLength={10} autoComplete="new-password"
          value={datos.contrasena} onChange={manejarCambio} error={errores.contrasena}
        />
        <CampoFormulario
          id="confirmar" label="Confirmar contraseña" type="password" maxLength={10} autoComplete="new-password"
          value={datos.confirmar} onChange={manejarCambio} error={errores.confirmar}
        />
        <CampoFormulario
          id="fechaNacimiento" label="Fecha de nacimiento (opcional)" type="date"
          value={datos.fechaNacimiento} onChange={manejarCambio}
        />
        <CampoFormulario
          id="telefono" label="Teléfono (opcional)" type="tel" placeholder="+56 9 1234 5678"
          value={datos.telefono} onChange={manejarCambio}
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

        <button type="submit" className="btn-principal">Registrar</button>

        <p className="texto-secundario">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </section>
  );
}