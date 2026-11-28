import { describe, expect, it } from "vitest";
import { puedeEntrarAlPanel, ROLES, rutaInicial } from "../utils/roles";

describe("roles", () => {
  it("solo el administrador y el vendedor entran al panel", () => {
    expect(puedeEntrarAlPanel(ROLES.ADMIN)).toBe(true);
    expect(puedeEntrarAlPanel(ROLES.VENDEDOR)).toBe(true);
    expect(puedeEntrarAlPanel(ROLES.CLIENTE)).toBe(false);
    expect(puedeEntrarAlPanel(undefined)).toBe(false);
  });

  it("cada rol parte en su pantalla", () => {
    expect(rutaInicial(ROLES.ADMIN)).toBe("/admin");
    expect(rutaInicial(ROLES.VENDEDOR)).toBe("/admin/productos");
    expect(rutaInicial(ROLES.CLIENTE)).toBe("/");
  });
});