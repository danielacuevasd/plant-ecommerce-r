import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Productos from "../pages/Productos";
import { obtenerProductos } from "../services/productosService";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/productosService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  obtenerProductos.mockResolvedValue(productosPrueba);
});

describe("Productos (filtros)", () => {
  it("muestra el catálogo completo al inicio", async () => {
    renderConProveedores(<Productos />);

    expect(await screen.findAllByRole("article")).toHaveLength(8);
    expect(screen.getByText("8 productos disponibles")).toBeInTheDocument();
  });

  it("muestra un mensaje de carga mientras llegan los productos", async () => {
    renderConProveedores(<Productos />);

    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
    await screen.findAllByRole("article");
  });

  it("muestra el error si la API falla", async () => {
    obtenerProductos.mockRejectedValue({ response: { data: { mensaje: "No se pudo conectar con el servidor." } } });
    renderConProveedores(<Productos />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor.");
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("filtra por texto de búsqueda", async () => {
    renderConProveedores(<Productos />);
    await screen.findAllByRole("article");

    await userEvent.type(screen.getByLabelText("Buscar producto"), "monstera");

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("1 producto disponible")).toBeInTheDocument();
  });

  it("filtra por categoría", async () => {
    renderConProveedores(<Productos />);
    await screen.findAllByRole("article");

    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "exterior");

    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("agregar al carrito guarda el producto en el carrito", async () => {
    renderConProveedores(<Productos />);

    const botones = await screen.findAllByRole("button", { name: "Añadir al carrito" });
    await userEvent.click(botones[0]);

    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 1 }]);
  });
});