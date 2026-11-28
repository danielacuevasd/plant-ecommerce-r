import { describe, expect, it } from "vitest";
import { filtrarProductos } from "../utils/filtros";
import { productosPrueba } from "./productosPrueba";

describe("filtrarProductos", () => {
  it("sin filtros devuelve todos los productos", () => {
    expect(filtrarProductos(productosPrueba)).toHaveLength(8);
  });

  it("filtra por nombre sin distinguir mayúsculas", () => {
    const resultado = filtrarProductos(productosPrueba, { texto: "MONSTERA" });
    expect(resultado.map((p) => p.nombre)).toEqual(["Monstera Deliciosa"]);
  });

  it("también busca en la descripción corta", () => {
    const resultado = filtrarProductos(productosPrueba, { texto: "principiantes" });
    expect(resultado).toHaveLength(2);
  });

  it("filtra por categoría", () => {
    const resultado = filtrarProductos(productosPrueba, { categoria: "exterior" });
    expect(resultado.map((p) => p.nombre)).toEqual(["Lavanda", "Suculenta Echeveria"]);
  });

  it("combina texto y categoría", () => {
    expect(filtrarProductos(productosPrueba, { texto: "calathea", categoria: "interior" })).toHaveLength(1);
    expect(filtrarProductos(productosPrueba, { texto: "monstera", categoria: "exterior" })).toHaveLength(0);
  });

  it("ignora los espacios al inicio y al final del texto", () => {
    expect(filtrarProductos(productosPrueba, { texto: "  lavanda  " })).toHaveLength(1);
  });

  it("devuelve una lista vacía si nada coincide", () => {
    expect(filtrarProductos(productosPrueba, { texto: "zzz" })).toEqual([]);
  });
});