import { describe, expect, it } from "vitest";
import {
  validarContrasena,
  validarCorreo,
  validarLogin,
  validarRegistro,
  validarRun
} from "../utils/validaciones";

describe("validarRun", () => {
  it("acepta un RUN con dígito verificador correcto", () => {
    expect(validarRun("191102207")).toBe("");
    expect(validarRun("175293841")).toBe("");
  });

  it("rechaza un RUN con dígito verificador incorrecto", () => {
    expect(validarRun("191102201")).toMatch(/dígito verificador/i);
  });

  it("rechaza largos y caracteres inválidos", () => {
    expect(validarRun("123")).toMatch(/entre 7 y 9/);
    expect(validarRun("12A45678")).toMatch(/solo debe contener números/i);
  });
});

describe("validarCorreo", () => {
  it.each(["a@duoc.cl", "b@profesor.duoc.cl", "c@gmail.com"])("acepta %s", (correo) => {
    expect(validarCorreo(correo)).toBe("");
  });

  it("rechaza dominios no permitidos y formatos inválidos", () => {
    expect(validarCorreo("a@hotmail.com")).toMatch(/solo se aceptan/i);
    expect(validarCorreo("sin-arroba")).toMatch(/formato válido/i);
  });
});

describe("validarContrasena", () => {
  it("acepta entre 4 y 10 caracteres", () => {
    expect(validarContrasena("abcd")).toBe("");
    expect(validarContrasena("abcdefghij")).toBe("");
  });

  it("rechaza menos de 4 o más de 10 caracteres", () => {
    expect(validarContrasena("abc")).toMatch(/entre 4 y 10/);
    expect(validarContrasena("abcdefghijk")).toMatch(/entre 4 y 10/);
  });
});

describe("validarLogin", () => {
  it("no devuelve errores con datos válidos", () => {
    expect(validarLogin({ correo: "ana@gmail.com", contrasena: "abcd" })).toEqual({});
  });

  it("devuelve un error por cada campo inválido", () => {
    const errores = validarLogin({ correo: "", contrasena: "ab" });
    expect(errores.correo).toBe("El correo es obligatorio.");
    expect(errores.contrasena).toBeDefined();
  });
});

describe("validarRegistro", () => {
  const valido = {
    run: "191102207", nombre: "Ana", apellidos: "Pérez", correo: "ana@gmail.com",
    contrasena: "abcd", confirmar: "abcd", region: "Región de Valparaíso",
    comuna: "Quilpué", direccion: "Calle 1"
  };

  it("no devuelve errores con datos válidos", () => {
    expect(validarRegistro(valido)).toEqual({});
  });

  it("detecta contraseñas que no coinciden y campos vacíos", () => {
    const errores = validarRegistro({ ...valido, confirmar: "otra", nombre: "", comuna: "" });
    expect(errores.confirmar).toMatch(/no coinciden/i);
    expect(errores.nombre).toBeDefined();
    expect(errores.comuna).toBeDefined();
  });
});