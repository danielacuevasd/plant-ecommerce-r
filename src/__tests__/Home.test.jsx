import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "../pages/Home";
import { renderConProveedores } from "./utils";

describe("Home", () => {
  it("muestra el título de la portada y el enlace al catálogo", () => {
    renderConProveedores(<Home />);

    expect(screen.getByRole("heading", { name: "Naturaleza para tu espacio" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute("href", "/productos");
  });

  it("muestra solo 4 productos destacados del catálogo", () => {
    renderConProveedores(<Home />);

    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getByRole("heading", { level: 3, name: "Monstera Deliciosa" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Set de Herramientas de Jardín" })).not.toBeInTheDocument();
  });

  it("agregar un destacado lo guarda en el carrito", async () => {
    renderConProveedores(<Home />);

    await userEvent.click(screen.getAllByRole("button", { name: "Añadir al carrito" })[0]);

    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 1 }]);
  });
});