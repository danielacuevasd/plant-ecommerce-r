import { describe, expect, it } from "vitest";
import { validarCorreo, validarRun } from "../utils/validaciones";

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