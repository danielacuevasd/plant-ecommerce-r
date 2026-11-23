import { createContext, useContext, useState } from "react";
import {
  iniciarSesion as apiIniciarSesion,
  registrarUsuario as apiRegistrarUsuario,
  cerrarSesion as apiCerrarSesion
} from "../services/authService";
import { mensajeDeError } from "../services/api";

const CLAVE_SESION = "florae_sesion";

const AuthContext = createContext(null);

function leerSesion() {
  try {
    const guardada = localStorage.getItem(CLAVE_SESION);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

// Solo se guarda lo necesario para mostrar la sesion (nunca la contrasena).
// El JWT vive aparte, bajo la clave florae_token (lo maneja services/api.js).
function crearSesion(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, tipo: usuario.tipo };
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  function guardarSesion(usuario) {
    const nueva = crearSesion(usuario);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nueva));
    setSesion(nueva);
    return nueva;
  }

  async function iniciarSesion(correo, contrasena) {
    try {
      const usuario = await apiIniciarSesion(correo, contrasena);
      return { ok: true, sesion: guardarSesion(usuario) };
    } catch (error) {
      return { ok: false, error: mensajeDeError(error) };
    }
  }

  async function registrar(datos) {
    try {
      const usuario = await apiRegistrarUsuario({
        run: datos.run.trim().toUpperCase(),
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim(),
        contrasena: datos.contrasena,
        fechaNacimiento: datos.fechaNacimiento || undefined,
        region: datos.region,
        comuna: datos.comuna,
        direccion: datos.direccion.trim()
      });
      return { ok: true, sesion: guardarSesion(usuario) };
    } catch (error) {
      return { ok: false, error: mensajeDeError(error) };
    }
  }

  function cerrarSesion() {
    apiCerrarSesion(); // borra el token
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  }

  return (
    <AuthContext.Provider value={{ sesion, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return contexto;
}