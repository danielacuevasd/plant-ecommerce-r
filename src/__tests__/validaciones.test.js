import { describe, expect, it } from "vitest";
import {
  validarContacto,
  validarContrasena,
  validarCorreo,
  validarLogin,
  validarProducto,
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

describe("validarContacto", () => {
  it("no devuelve errores con datos válidos", () => {
    expect(validarContacto({ nombre: "Ana", correo: "ana@gmail.com", comentario: "Hola" })).toEqual({});
  });

  it("exige nombre, correo y comentario", () => {
    const errores = validarContacto({ nombre: "", correo: "", comentario: "" });

    expect(errores.nombre).toBe("El nombre es obligatorio.");
    expect(errores.correo).toBe("El correo es obligatorio.");
    expect(errores.comentario).toBe("El comentario es obligatorio.");
  });

  it("rechaza comentarios de más de 500 caracteres", () => {
    const errores = validarContacto({ nombre: "Ana", correo: "ana@gmail.com", comentario: "x".repeat(501) });

    expect(errores.comentario).toBe("Máximo 500 caracteres.");
  });

  it("el correo debe tener un dominio permitido", () => {
    const errores = validarContacto({ nombre: "Ana", correo: "ana@hotmail.com", comentario: "Hola" });

    expect(errores.correo).toMatch(/solo se aceptan/i);
  });
});

describe("validarProducto", () => {
  const valido = {
    codigo: "PL-009", nombre: "Helecho", descripcion: "", precio: "7000",
    categoria: "interior", stock: "5", stockCritico: ""
  };

  it("no devuelve errores con datos válidos (descripción y stock crítico son opcionales)", () => {
    expect(validarProducto(valido)).toEqual({});
  });

  it("exige código de al menos 3 caracteres, nombre y categoría", () => {
    const errores = validarProducto({ ...valido, codigo: "PL", nombre: "", categoria: "" });

    expect(errores.codigo).toBe("El código debe tener al menos 3 caracteres.");
    expect(errores.nombre).toBe("El nombre es obligatorio.");
    expect(errores.categoria).toBe("Selecciona una categoría.");
  });

  it("el precio debe ser un número mayor o igual a 0", () => {
    expect(validarProducto({ ...valido, precio: "0" }).precio).toBeUndefined();
    expect(validarProducto({ ...valido, precio: "-5" }).precio).toMatch(/mayor o igual a 0/);
    expect(validarProducto({ ...valido, precio: "abc" }).precio).toBeDefined();
    expect(validarProducto({ ...valido, precio: "" }).precio).toBeDefined();
  });

  it("el stock debe ser un entero mayor o igual a 0", () => {
    expect(validarProducto({ ...valido, stock: "0" }).stock).toBeUndefined();
    expect(validarProducto({ ...valido, stock: "1.5" }).stock).toBeDefined();
    expect(validarProducto({ ...valido, stock: "-1" }).stock).toBeDefined();
    expect(validarProducto({ ...valido, stock: "" }).stock).toBeDefined();
  });

  it("el stock crítico es opcional, pero si se ingresa debe ser válido", () => {
    expect(validarProducto({ ...valido, stockCritico: "" }).stockCritico).toBeUndefined();
    expect(validarProducto({ ...valido, stockCritico: "2" }).stockCritico).toBeUndefined();
    expect(validarProducto({ ...valido, stockCritico: "-1" }).stockCritico).toBeDefined();
  });

  it("la descripción no puede superar los 500 caracteres", () => {
    const errores = validarProducto({ ...valido, descripcion: "x".repeat(501) });

    expect(errores.descripcion).toBe("Máximo 500 caracteres.");
  });
});