import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CartItem from "../components/CartItem";

const item = {
  id: 1,
  nombre: "Monstera Deliciosa",
  imagen: "/img/monstera.jpg",
  precio: 18990,
  cantidad: 2,
  subtotalItem: 37980,
  stock: 12
};

describe("CartItem", () => {
  it("muestra nombre, precio, cantidad y subtotal recibidos por props", () => {
    render(<CartItem item={item} onCambiar={() => {}} onEliminar={() => {}} />);

    expect(screen.getByRole("heading", { name: "Monstera Deliciosa" })).toBeInTheDocument();
    expect(screen.getByText("$18.990")).toBeInTheDocument();
    expect(screen.getByLabelText("Cantidad de Monstera Deliciosa")).toHaveTextContent("2");
    expect(screen.getByText("$37.980")).toBeInTheDocument();
  });

  it("el botón + pide aumentar la cantidad en uno", async () => {
    const onCambiar = vi.fn();
    render(<CartItem item={item} onCambiar={onCambiar} onEliminar={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: /sumar una unidad/i }));

    expect(onCambiar).toHaveBeenCalledWith(1, 3);
  });

  it("el botón - pide reducir la cantidad en uno", async () => {
    const onCambiar = vi.fn();
    render(<CartItem item={item} onCambiar={onCambiar} onEliminar={() => {}} />);

    await userEvent.click(screen.getByRole("button", { name: /restar una unidad/i }));

    expect(onCambiar).toHaveBeenCalledWith(1, 1);
  });

  it("deshabilita el botón + cuando la cantidad llega al stock (renderizado condicional)", () => {
    render(<CartItem item={{ ...item, cantidad: 12 }} onCambiar={() => {}} onEliminar={() => {}} />);

    expect(screen.getByRole("button", { name: /sumar una unidad/i })).toBeDisabled();
  });

  it("el botón Eliminar llama a onEliminar con el id del producto", async () => {
    const onEliminar = vi.fn();
    render(<CartItem item={item} onCambiar={() => {}} onEliminar={onEliminar} />);

    await userEvent.click(screen.getByRole("button", { name: /eliminar monstera/i }));

    expect(onEliminar).toHaveBeenCalledTimes(1);
    expect(onEliminar).toHaveBeenCalledWith(1);
  });
});