import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CampoFormulario from "../components/CampoFormulario";
import { useAuth } from "../context/AuthContext";
import { validarLogin } from "../utils/validaciones";

export default function Login() {
  const { iniciarSesion } = useAuth();
  const navegar = useNavigate();
  const [datos, setDatos] = useState({ correo: "", contrasena: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    const nuevos = validarLogin(datos);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;

    const resultado = iniciarSesion(datos.correo, datos.contrasena);
    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    navegar(resultado.sesion.tipo === "Administrador" ? "/admin" : "/");
  }

  return (
    <section className="seccion-formulario seccion-formulario--login">
      <div className="login-marca">
        <img src="/img/logo.png" alt="Logo Florae" className="login-marca__logo" />
        <h2>Florae</h2>
      </div>

      <form className="tarjeta-formulario" onSubmit={manejarSubmit} noValidate>
        <h1>Inicio de sesión</h1>

        <CampoFormulario
          id="correo" label="Correo" type="email" maxLength={100} autoComplete="email"
          value={datos.correo} onChange={manejarCambio} error={errores.correo}
        />
        <CampoFormulario
          id="contrasena" label="Contraseña" type="password" maxLength={10} autoComplete="current-password"
          value={datos.contrasena} onChange={manejarCambio} error={errores.contrasena}
        />

        {errorGeneral && <p role="alert" className="mensaje-error">{errorGeneral}</p>}

        <button type="submit" className="btn-principal">Iniciar sesión</button>

        <p className="texto-secundario">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </section>
  );
}