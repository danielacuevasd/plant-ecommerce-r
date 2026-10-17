import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { actualizarProducto } from "../data/db";
import DetalleProducto from "../pages/DetalleProducto";
import { renderConProveedores } from "./utils";

function renderDetalle(id) {
  return renderConProveedores(
    <Routes>
      <Route path="/productos/:id" element={<DetalleProducto />} />
    </Routes>,
    { ruta: `/productos/${id}` }
  );
}

// El formulario de cantidad es el que contiene el campo "Cantidad"
function formularioDeCantidad() {
  return screen.getByLabelText("Cantidad").closest("form");
}

describe("DetalleProducto", () => {
  it("muestra los datos del producto de la ruta", () => {
    renderDetalle(1);

    expect(screen.getByRole("heading", { level: 1, name: "Monstera Deliciosa" })).toBeInTheDocument();
    expect(screen.getByText("$18.990")).toBeInTheDocument();
    expect(screen.getByText("Stock disponible: 12")).toBeInTheDocument();
  });

  it("muestra un mensaje si el producto no existe (renderizado condicional)", () => {
    renderDetalle(999);

    expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Cantidad")).not.toBeInTheDocument();
  });

  it("muestra productos relacionados de la misma categoría, sin repetir el actual", () => {
    renderDetalle(1);

    expect(screen.getByRole("heading", { level: 3, name: "Potus Verde" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Calathea Orbifolia" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Monstera Deliciosa" })).not.toBeInTheDocument();
  });

  it("agrega la cantidad elegida al carrito y muestra confirmación (estado y eventos)", async () => {
    renderDetalle(1);

    const cantidad = screen.getByLabelText("Cantidad");
    await userEvent.clear(cantidad);
    await userEvent.type(cantidad, "3");
    await userEvent.click(within(formularioDeCantidad()).getByRole("button", { name: "Añadir al carrito" }));

    expect(screen.getByRole("status")).toHaveTextContent("Se agregó Monstera Deliciosa al carrito.");
    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 3 }]);
  });

  it("el carrito no supera el stock al agregar varias veces", async () => {
    renderDetalle(1);
    const cantidad = screen.getByLabelText("Cantidad");

    await userEvent.clear(cantidad);
    await userEvent.type(cantidad, "10");
    await userEvent.click(within(formularioDeCantidad()).getByRole("button", { name: "Añadir al carrito" }));

    await userEvent.clear(cantidad);
    await userEvent.type(cantidad, "5");
    await userEvent.click(within(formularioDeCantidad()).getByRole("button", { name: "Añadir al carrito" }));

    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 12 }]);
  });

  it("deshabilita el botón cuando el producto no tiene stock", () => {
    actualizarProducto(1, { stock: 0 });
    renderDetalle(1);

    expect(within(formularioDeCantidad()).getByRole("button", { name: "Añadir al carrito" })).toBeDisabled();
  });
});