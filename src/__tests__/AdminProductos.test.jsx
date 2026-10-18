import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { obtenerProductos } from "../data/db";
import AdminProductos from "../pages/admin/AdminProductos";
import { renderConProveedores } from "./utils";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AdminProductos", () => {
  it("lista los productos y marca el stock crítico", () => {
    renderConProveedores(<AdminProductos />);

    expect(screen.getAllByRole("row")).toHaveLength(9);
    const fila = screen.getByText("Calathea Orbifolia").closest("tr");
    expect(within(fila).getByText("Stock crítico")).toBeInTheDocument();
    const filaNormal = screen.getByText("Monstera Deliciosa").closest("tr");
    expect(within(filaNormal).getByText("Disponible")).toBeInTheDocument();
  });

  it("elimina un producto cuando se confirma (mock de window.confirm)", async () => {
    const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderConProveedores(<AdminProductos />);

    const fila = screen.getByText("Lavanda").closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(confirmar).toHaveBeenCalledWith(expect.stringContaining("Lavanda"));
    expect(screen.queryByText("Lavanda")).not.toBeInTheDocument();
    expect(obtenerProductos()).toHaveLength(7);
  });

  it("no elimina nada si el usuario cancela", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderConProveedores(<AdminProductos />);

    const fila = screen.getByText("Lavanda").closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(screen.getByText("Lavanda")).toBeInTheDocument();
    expect(obtenerProductos()).toHaveLength(8);
  });

  it("muestra un mensaje cuando no hay productos (renderizado condicional)", () => {
    localStorage.setItem("florae_productos", "[]");
    renderConProveedores(<AdminProductos />);

    expect(screen.getByText("No hay productos registrados.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});