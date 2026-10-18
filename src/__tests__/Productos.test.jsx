import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Productos from "../pages/Productos";
import { renderConProveedores } from "./utils";

describe("Productos (filtros)", () => {
  it("muestra el catálogo completo al inicio", () => {
    renderConProveedores(<Productos />);

    expect(screen.getAllByRole("article")).toHaveLength(8);
    expect(screen.getByText("8 productos disponibles")).toBeInTheDocument();
  });

  it("filtra por texto de búsqueda", async () => {
    renderConProveedores(<Productos />);

    await userEvent.type(screen.getByLabelText("Buscar producto"), "monstera");

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("1 producto disponible")).toBeInTheDocument();
  });

  it("filtra por categoría", async () => {
    renderConProveedores(<Productos />);

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "exterior");

    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("agregar al carrito guarda el producto en el carrito", async () => {
    renderConProveedores(<Productos />);

    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al carrito" })[0]);

    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 1 }]);
  });
});