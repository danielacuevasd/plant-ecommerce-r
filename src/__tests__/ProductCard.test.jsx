import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ProductCard from "../components/ProductCard";
import { productosSemilla } from "../data/db";
import { renderConProveedores } from "./utils";

const producto = productosSemilla[0];

describe("ProductCard", () => {
  it("muestra nombre, precio e imagen recibidos por props", () => {
    renderConProveedores(<ProductCard producto={producto} onAgregar={() => {}} />);

    expect(screen.getByRole("heading", { name: "Monstera Deliciosa" })).toBeInTheDocument();
    expect(screen.getByText("$18.990")).toBeInTheDocument();
    expect(screen.getByAltText("Monstera Deliciosa")).toHaveAttribute("src", "/img/monstera.jpg");
  });

  it("llama a onAgregar con el id del producto al hacer clic", async () => {
    const onAgregar = vi.fn();
    renderConProveedores(<ProductCard producto={producto} onAgregar={onAgregar} />);

    await userEvent.click(screen.getByRole("button", { name: "Añadir al carrito" }));

    expect(onAgregar).toHaveBeenCalledTimes(1);
    expect(onAgregar).toHaveBeenCalledWith(1);
  });

  it("cambia el texto del botón a Agregado después del clic (estado)", async () => {
    renderConProveedores(<ProductCard producto={producto} onAgregar={() => {}} />);

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button", { name: "Agregado" })).toBeInTheDocument();
  });

  it("deshabilita el botón cuando no hay stock (renderizado condicional)", () => {
    renderConProveedores(<ProductCard producto={{ ...producto, stock: 0 }} onAgregar={() => {}} />);

    expect(screen.getByRole("button", { name: "Sin stock" })).toBeDisabled();
  });
});