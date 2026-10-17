import { createContext, useContext, useState } from "react";
import { autenticarUsuario, crearUsuario, existeCorreo } from "../data/db";

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

// Solo se guarda lo necesario para mostrar la sesion (nunca la contrasena)
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

  function iniciarSesion(correo, contrasena) {
    const usuario = autenticarUsuario(correo, contrasena);
    if (!usuario) return { ok: false, error: "Correo o contraseña incorrectos." };
    return { ok: true, sesion: guardarSesion(usuario) };
  }

  function registrar(datos) {
    if (existeCorreo(datos.correo)) {
      return { ok: false, error: "Ya existe una cuenta con ese correo." };
    }
    const usuario = crearUsuario({
      run: datos.run.trim().toUpperCase(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      contrasena: datos.contrasena,
      tipo: "Cliente",
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim()
    });
    return { ok: true, sesion: guardarSesion(usuario) };
  }

  function cerrarSesion() {
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