import { describe, expect, it } from "vitest";
import {
  actualizarUsuario,
  autenticarUsuario,
  crearUsuario,
  eliminarUsuario,
  existeCorreo,
  obtenerUsuarioPorId,
  obtenerUsuarios
} from "../data/db";
import { validarRun } from "../utils/validaciones";

describe("db.js: usuarios y autenticación", () => {
  it("inicializa los usuarios semilla", () => {
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("los usuarios semilla tienen RUN válido", () => {
    obtenerUsuarios().forEach((u) => expect(validarRun(u.run)).toBe(""));
  });

  it("crea, actualiza y elimina un usuario (CRUD)", () => {
    const nuevo = crearUsuario({
      run: "191102207", nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com", contrasena: "abcd"
    });
    expect(nuevo.id).toBe(4);
    expect(nuevo.tipo).toBe("Cliente");

    actualizarUsuario(4, { nombre: "Ana María" });
    expect(obtenerUsuarioPorId(4).nombre).toBe("Ana María");

    expect(eliminarUsuario(4)).toBe(true);
    expect(obtenerUsuarioPorId(4)).toBeNull();
  });

  it("detecta correos repetidos sin distinguir mayúsculas", () => {
    expect(existeCorreo("CAMILA.REYES@GMAIL.COM")).toBe(true);
    expect(existeCorreo("nadie@gmail.com")).toBe(false);
  });

  it("permite excluir el propio usuario al editar", () => {
    expect(existeCorreo("camila.reyes@gmail.com", 1)).toBe(false);
    expect(existeCorreo("camila.reyes@gmail.com", 2)).toBe(true);
  });

  it("autentica con correo y contraseña correctos", () => {
    const usuario = autenticarUsuario("marcelo.caceres@profesor.duoc.cl", "admin");
    expect(usuario.tipo).toBe("Administrador");
  });

  it("rechaza credenciales incorrectas", () => {
    expect(autenticarUsuario("marcelo.caceres@profesor.duoc.cl", "mala")).toBeNull();
    expect(autenticarUsuario("nadie@gmail.com", "admin")).toBeNull();
  });
});