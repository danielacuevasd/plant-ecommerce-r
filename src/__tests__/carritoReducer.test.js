import { describe, expect, it } from "vitest";
import { calcularTotales, carritoReducer, estadoInicialCarrito } from "../utils/carritoReducer";

describe("carritoReducer", () => {
  it("agrega un producto nuevo y suma cantidad si ya existe", () => {
    let estado = carritoReducer(estadoInicialCarrito, { tipo: "agregar", id: 1, cantidad: 2 });
    estado = carritoReducer(estado, { tipo: "agregar", id: 1, cantidad: 1 });
    expect(estado.items).toEqual([{ id: 1, cantidad: 3 }]);
  });

  it("no supera el stock disponible", () => {
    const estado = carritoReducer(estadoInicialCarrito, { tipo: "agregar", id: 3, cantidad: 10, stock: 3 });
    expect(estado.items[0].cantidad).toBe(3);
  });

  it("cambia la cantidad de un ítem", () => {
    const base = { items: [{ id: 1, cantidad: 1 }], cupon: "" };
    expect(carritoReducer(base, { tipo: "cambiar", id: 1, cantidad: 5 }).items).toEqual([{ id: 1, cantidad: 5 }]);
  });

  it("elimina el ítem cuando la cantidad llega a 0", () => {
    const base = { items: [{ id: 1, cantidad: 1 }], cupon: "" };
    expect(carritoReducer(base, { tipo: "cambiar", id: 1, cantidad: 0 }).items).toEqual([]);
  });

  it("elimina un ítem por id y deja los demás", () => {
    const base = { items: [{ id: 1, cantidad: 1 }, { id: 2, cantidad: 4 }], cupon: "" };
    expect(carritoReducer(base, { tipo: "eliminar", id: 1 }).items).toEqual([{ id: 2, cantidad: 4 }]);
  });

  it("guarda el código del cupón", () => {
    const estado = carritoReducer(estadoInicialCarrito, { tipo: "cupon", codigo: "FLORAE10" });
    expect(estado.cupon).toBe("FLORAE10");
  });

  it("vacía el carrito", () => {
    const base = { items: [{ id: 1, cantidad: 1 }], cupon: "FLORAE10" };
    expect(carritoReducer(base, { tipo: "vaciar" })).toEqual(estadoInicialCarrito);
  });
});

describe("calcularTotales", () => {
  const items = [{ precio: 10000, cantidad: 2 }, { precio: 5000, cantidad: 1 }];

  it("calcula subtotal sin cupón", () => {
    expect(calcularTotales(items)).toEqual({ subtotal: 25000, descuento: 0, total: 25000 });
  });

  it("aplica el descuento del cupón", () => {
    expect(calcularTotales(items, "FLORAE10")).toEqual({ subtotal: 25000, descuento: 2500, total: 22500 });
  });

  it("ignora cupones desconocidos", () => {
    expect(calcularTotales(items, "FALSO").descuento).toBe(0);
  });
});