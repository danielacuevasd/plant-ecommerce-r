import { useState } from "react";
import CampoFormulario from "../components/CampoFormulario";
import { mensajeDeError } from "../services/api";
import { enviarMensaje } from "../services/contactoService";
import { validarContacto } from "../utils/validaciones";

const MAX_COMENTARIO = 500;

export default function Contacto() {
  const [datos, setDatos] = useState({ nombre: "", correo: "", comentario: "" });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
    setEnviado(false);
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();
    const nuevos = validarContacto(datos);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;

    setEnviando(true);
    try {
      await enviarMensaje(datos);
      setDatos({ nombre: "", correo: "", comentario: "" });
      setEnviado(true);
    } catch (error) {
      // Si falla, se conservan los datos para que el usuario no tenga que escribirlos de nuevo
      setErrorGeneral(mensajeDeError(error));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="seccion-formulario">
      <form className="tarjeta-formulario" onSubmit={manejarSubmit} noValidate>
        <h1>Formulario de contacto</h1>

        <CampoFormulario
          id="nombre" label="Nombre completo" maxLength={100} autoComplete="name"
          value={datos.nombre} onChange={manejarCambio} error={errores.nombre}
        />
        <CampoFormulario
          id="correo" label="Correo" type="email" maxLength={100} autoComplete="email"
          value={datos.correo} onChange={manejarCambio} error={errores.correo}
        />
        <CampoFormulario
          id="comentario" label="Comentario" as="textarea" rows={5} maxLength={MAX_COMENTARIO}
          value={datos.comentario} onChange={manejarCambio} error={errores.comentario}
        />
        <small className="contador-caracteres" data-testid="contador-comentario">
          {datos.comentario.length} / {MAX_COMENTARIO}
        </small>

        {errorGeneral && <p role="alert" className="mensaje-error">{errorGeneral}</p>}

        <button type="submit" className="btn-principal" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar mensaje"}
        </button>
        {enviado && (
          <p role="status" className="mensaje-exito">
            Gracias por tu mensaje. Te responderemos a la brevedad.
          </p>
        )}
      </form>
    </section>
  );
}