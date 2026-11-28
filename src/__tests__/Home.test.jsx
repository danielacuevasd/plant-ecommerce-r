import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "../pages/Home";
import { obtenerProductos } from "../services/productosService";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/productosService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  obtenerProductos.mockResolvedValue(productosPrueba);
});

describe("Home", () => {
  it("muestra el título de la portada y el enlace al catálogo", async () => {
    renderConProveedores(<Home />);

    expect(screen.getByRole("heading", { name: "Naturaleza para tu espacio" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver productos" })).toHaveAttribute("href", "/productos");
    await screen.findAllByRole("article");
  });

  it("muestra un mensaje de carga mientras llegan los productos", async () => {
    renderConProveedores(<Home />);

    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
    await screen.findAllByRole("article");
    expect(screen.queryByText("Cargando productos...")).not.toBeInTheDocument();
  });

  it("muestra solo 4 productos destacados del catálogo", async () => {
    renderConProveedores(<Home />);

    expect(await screen.findAllByRole("article")).toHaveLength(4);
    expect(screen.getByRole("heading", { level: 3, name: "Monstera Deliciosa" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Set de Herramientas de Jardín" })).not.toBeInTheDocument();
  });

  it("muestra el error si la API falla", async () => {
    obtenerProductos.mockRejectedValue({ response: { data: { mensaje: "No se pudo conectar con el servidor." } } });
    renderConProveedores(<Home />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor.");
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("agregar un destacado lo guarda en el carrito", async () => {
    renderConProveedores(<Home />);

    const botones = await screen.findAllByRole("button", { name: "Añadir al carrito" });
    await userEvent.click(botones[0]);

    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 1 }]);
  });
});