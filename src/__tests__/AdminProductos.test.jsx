import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminProductos from "../pages/admin/AdminProductos";
import { eliminarProducto, obtenerProductos } from "../services/productosService";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/productosService");

// La API simulada guarda la lista, así el listado refleja las eliminaciones
let lista;

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  // Solo el administrador puede modificar productos
  localStorage.setItem(
    "florae_sesion",
    JSON.stringify({ id: 3, nombre: "Marcelo", correo: "marcelo.caceres@profesor.duoc.cl", tipo: "Administrador" })
  );
  lista = [...productosPrueba];
  obtenerProductos.mockImplementation(async () => lista);
  eliminarProducto.mockImplementation(async (id) => {
    lista = lista.filter((p) => p.id !== id);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AdminProductos", () => {
  it("muestra un mensaje de carga mientras llega el listado", async () => {
    renderConProveedores(<AdminProductos />);

    expect(screen.getByText("Cargando productos...")).toBeInTheDocument();
    await screen.findByRole("table");
  });

  it("lista los productos y marca el stock crítico", async () => {
    renderConProveedores(<AdminProductos />);

    expect(await screen.findAllByRole("row")).toHaveLength(9);
    const fila = screen.getByText("Calathea Orbifolia").closest("tr");
    expect(within(fila).getByText("Stock crítico")).toBeInTheDocument();
    const filaNormal = screen.getByText("Monstera Deliciosa").closest("tr");
    expect(within(filaNormal).getByText("Disponible")).toBeInTheDocument();
  });

  it("muestra el error si la API falla", async () => {
    obtenerProductos.mockRejectedValue({ response: { data: { mensaje: "No se pudo conectar con el servidor." } } });
    renderConProveedores(<AdminProductos />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor.");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("elimina un producto cuando se confirma (mock de window.confirm)", async () => {
    const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderConProveedores(<AdminProductos />);

    const fila = (await screen.findByText("Lavanda")).closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(confirmar).toHaveBeenCalledWith(expect.stringContaining("Lavanda"));
    expect(eliminarProducto).toHaveBeenCalledWith(4);
    await vi.waitFor(() => expect(screen.queryByText("Lavanda")).not.toBeInTheDocument());
    expect(screen.getAllByRole("row")).toHaveLength(8);
  });

  it("no elimina nada si el usuario cancela", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderConProveedores(<AdminProductos />);

    const fila = (await screen.findByText("Lavanda")).closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(eliminarProducto).not.toHaveBeenCalled();
    expect(screen.getByText("Lavanda")).toBeInTheDocument();
  });

  it("muestra el error de la API si no se puede eliminar", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    eliminarProducto.mockRejectedValue({ response: { status: 403, data: { mensaje: "No tienes permisos para esta acción" } } });
    renderConProveedores(<AdminProductos />);

    const fila = (await screen.findByText("Lavanda")).closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permisos para esta acción");
    expect(screen.getByText("Lavanda")).toBeInTheDocument();
  });

  it("muestra un mensaje cuando no hay productos (renderizado condicional)", async () => {
    lista = [];
    renderConProveedores(<AdminProductos />);

    expect(await screen.findByText("No hay productos registrados.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});