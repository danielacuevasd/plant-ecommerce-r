import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminProductoForm from "../pages/admin/AdminProductoForm";
import { actualizarProducto, crearProducto, obtenerProductoPorId } from "../services/productosService";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/productosService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  obtenerProductoPorId.mockImplementation(async (id) => productosPrueba.find((p) => p.id === Number(id)) ?? null);
  crearProducto.mockResolvedValue({ id: 9 });
  actualizarProducto.mockResolvedValue({ id: 1 });
});

function renderFormulario(ruta) {
  return renderConProveedores(
    <Routes>
      <Route path="/admin/productos" element={<h1>Lista de productos</h1>} />
      <Route path="/admin/productos/nuevo" element={<AdminProductoForm />} />
      <Route path="/admin/productos/:id/editar" element={<AdminProductoForm />} />
    </Routes>,
    { ruta }
  );
}

async function completarProductoNuevo() {
  await userEvent.type(screen.getByLabelText("Código producto"), "PL-009");
  await userEvent.type(screen.getByLabelText("Nombre"), "Helecho");
  await userEvent.type(screen.getByLabelText("Precio"), "7000");
  await userEvent.selectOptions(screen.getByLabelText("Categoría"), "interior");
  await userEvent.type(screen.getByLabelText("Stock"), "5");
}

describe("AdminProductoForm", () => {
  it("el título y el botón cambian según sea nuevo o edición", async () => {
    const { unmount } = renderFormulario("/admin/productos/nuevo");
    expect(screen.getByRole("heading", { name: "Nuevo producto" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar producto" })).toBeInTheDocument();
    unmount();

    renderFormulario("/admin/productos/1/editar");
    expect(await screen.findByRole("heading", { name: "Editar producto" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
  });

  it("no muestra errores al inicio y los muestra al enviar vacío (renderizado condicional)", async () => {
    renderFormulario("/admin/productos/nuevo");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(screen.getByText("El código debe tener al menos 3 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una categoría.")).toBeInTheDocument();
    expect(crearProducto).not.toHaveBeenCalled();
  });

  it("rechaza un precio con decimales porque la API solo acepta enteros", async () => {
    renderFormulario("/admin/productos/nuevo");

    await completarProductoNuevo();
    await userEvent.clear(screen.getByLabelText("Precio"));
    await userEvent.type(screen.getByLabelText("Precio"), "7000.5");
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(screen.getByText(/precio debe ser un número entero/i)).toBeInTheDocument();
    expect(crearProducto).not.toHaveBeenCalled();
  });

  it("crea un producto nuevo enviando los datos a la API y vuelve al listado", async () => {
    renderFormulario("/admin/productos/nuevo");

    await completarProductoNuevo();
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(await screen.findByRole("heading", { name: "Lista de productos" })).toBeInTheDocument();
    expect(crearProducto).toHaveBeenCalledWith({
      codigo: "PL-009",
      nombre: "Helecho",
      descripcion: "",
      descripcionCorta: "",
      precio: 7000,
      categoria: "interior",
      stock: 5,
      imagen: "/img/logo.png"
    });
  });

  it("muestra el error de la API si el código ya existe y no cambia de página", async () => {
    crearProducto.mockRejectedValue({ response: { status: 409, data: { mensaje: "Ya existe un producto con ese código" } } });
    renderFormulario("/admin/productos/nuevo");

    await completarProductoNuevo();
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(await screen.findByText("Ya existe un producto con ese código")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nuevo producto" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar producto" })).toBeEnabled();
  });

  it("al editar, carga los datos del producto y guarda los cambios", async () => {
    renderFormulario("/admin/productos/1/editar");
    expect(await screen.findByLabelText("Nombre")).toHaveValue("Monstera Deliciosa");

    const precio = screen.getByLabelText("Precio");
    await userEvent.clear(precio);
    await userEvent.type(precio, "20000");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByRole("heading", { name: "Lista de productos" })).toBeInTheDocument();
    expect(actualizarProducto).toHaveBeenCalledWith(1, expect.objectContaining({ precio: 20000, nombre: "Monstera Deliciosa" }));
  });

  it("muestra un mensaje si el producto a editar no existe", async () => {
    renderFormulario("/admin/productos/999/editar");

    expect(await screen.findByRole("heading", { name: "Producto no encontrado" })).toBeInTheDocument();
  });
});