import { afterEach, describe, expect, it, vi } from "vitest";
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
  obtenerProductosStockCritico
} from "../data/db";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("db.js: productos (fuente de datos simulada)", () => {
  it("inicializa los productos semilla en localStorage", () => {
    expect(obtenerProductos()).toHaveLength(8);
    expect(localStorage.getItem("florae_productos")).not.toBeNull();
  });

  it("vuelve a los datos semilla si lo guardado está corrupto", () => {
    localStorage.setItem("florae_productos", "esto-no-es-json");
    expect(obtenerProductos()).toHaveLength(8);
  });

  it("crea, actualiza y elimina un producto (CRUD)", () => {
    const nuevo = crearProducto({ codigo: "PL-099", nombre: "Helecho", categoria: "interior", precio: 7000, stock: 5 });
    expect(nuevo.id).toBe(9);
    expect(obtenerProductoPorId(9).nombre).toBe("Helecho");

    actualizarProducto(9, { precio: 7500 });
    expect(obtenerProductoPorId(9).precio).toBe(7500);

    expect(eliminarProducto(9)).toBe(true);
    expect(obtenerProductoPorId(9)).toBeNull();
  });

  it("devuelve null si el producto no existe", () => {
    expect(obtenerProductoPorId(999)).toBeNull();
    expect(actualizarProducto(999, { precio: 1 })).toBeNull();
  });

  it("detecta productos con stock crítico", () => {
    const criticos = obtenerProductosStockCritico().map((p) => p.nombre);
    expect(criticos).toContain("Calathea Orbifolia");
  });

  it("persiste los cambios usando localStorage (mock de setItem)", () => {
    const espia = vi.spyOn(Storage.prototype, "setItem");
    crearProducto({ codigo: "PL-100", nombre: "Ficus", categoria: "interior", precio: 9000, stock: 2 });
    expect(espia).toHaveBeenCalledWith("florae_productos", expect.stringContaining("Ficus"));
  });
});