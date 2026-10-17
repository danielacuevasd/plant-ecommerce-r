import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Carrito from "../pages/Carrito";
import { renderConProveedores } from "./utils";

function cargarCarrito(items, cupon = "") {
  localStorage.setItem("florae_carrito", JSON.stringify({ items, cupon }));
}

describe("Carrito", () => {
  it("muestra el mensaje de carrito vacío cuando no hay ítems", () => {
    renderConProveedores(<Carrito />);

    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$0");
  });

  it("calcula el total con los productos guardados", () => {
    cargarCarrito([{ id: 1, cantidad: 2 }]);
    renderConProveedores(<Carrito />);

    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$37.980");
  });

  it("los botones + y - cambian la cantidad y el total", async () => {
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);

    await userEvent.click(screen.getByRole("button", { name: /sumar una unidad de monstera/i }));
    expect(screen.getByLabelText("Cantidad de Monstera Deliciosa")).toHaveTextContent("2");
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$37.980");

    await userEvent.click(screen.getByRole("button", { name: /restar una unidad de monstera/i }));
    expect(screen.getByLabelText("Cantidad de Monstera Deliciosa")).toHaveTextContent("1");
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$18.990");
  });

  it("elimina un producto del carrito", async () => {
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);

    await userEvent.click(screen.getByRole("button", { name: /eliminar monstera/i }));

    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });
});