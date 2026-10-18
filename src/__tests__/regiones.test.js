import { describe, expect, it } from "vitest";
import { obtenerComunas, regiones } from "../data/regiones";

describe("regiones y comunas", () => {
  it("devuelve las comunas de una región existente", () => {
    const comunas = obtenerComunas("Región de Valparaíso");

    expect(comunas).toContain("Quilpué");
    expect(comunas).toHaveLength(4);
  });

  it("devuelve una lista vacía si la región no existe o no se eligió", () => {
    expect(obtenerComunas("Región Inventada")).toEqual([]);
    expect(obtenerComunas("")).toEqual([]);
  });

  it("todas las regiones tienen al menos una comuna", () => {
    regiones.forEach((region) => expect(region.comunas.length).toBeGreaterThan(0));
  });
});