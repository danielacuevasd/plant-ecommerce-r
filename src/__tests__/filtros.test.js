import { describe, expect, it } from "vitest";
import { productosSemilla } from "../data/db";
import { filtrarProductos } from "../utils/filtros";

describe("filtrarProductos", () => {
  it("sin filtros devuelve todos los productos", () => {
    expect(filtrarProductos(productosSemilla)).toHaveLength(8);
  });

  it("filtra por nombre sin distinguir mayúsculas", () => {
    const resultado = filtrarProductos(productosSemilla, { texto: "MONSTERA" });
    expect(resultado.map((p) => p.nombre)).toEqual(["Monstera Deliciosa"]);
  });

  it("también busca en la descripción corta", () => {
    const resultado = filtrarProductos(productosSemilla, { texto: "principiantes" });
    expect(resultado).toHaveLength(2);
  });

  it("filtra por categoría", () => {
    const resultado = filtrarProductos(productosSemilla, { categoria: "exterior" });
    expect(resultado.map((p) => p.nombre)).toEqual(["Lavanda", "Suculenta Echeveria"]);
  });

  it("combina texto y categoría", () => {
    expect(filtrarProductos(productosSemilla, { texto: "calathea", categoria: "interior" })).toHaveLength(1);
    expect(filtrarProductos(productosSemilla, { texto: "monstera", categoria: "exterior" })).toHaveLength(0);
  });

  it("ignora los espacios al inicio y al final del texto", () => {
    expect(filtrarProductos(productosSemilla, { texto: "  lavanda  " })).toHaveLength(1);
  });

  it("devuelve una lista vacía si nada coincide", () => {
    expect(filtrarProductos(productosSemilla, { texto: "zzz" })).toEqual([]);
  });
});