import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { obtenerProductoPorId, obtenerProductos } from "../data/db";
import AdminProductoForm from "../pages/admin/AdminProductoForm";
import { renderConProveedores } from "./utils";

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

describe("AdminProductoForm", () => {
  it("el título y el botón cambian según sea nuevo o edición", () => {
    const { unmount } = renderFormulario("/admin/productos/nuevo");
    expect(screen.getByRole("heading", { name: "Nuevo producto" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar producto" })).toBeInTheDocument();
    unmount();

    renderFormulario("/admin/productos/1/editar");
    expect(screen.getByRole("heading", { name: "Editar producto" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
  });

  it("no muestra errores al inicio y los muestra al enviar vacío (renderizado condicional)", async () => {
    renderFormulario("/admin/productos/nuevo");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(screen.getByText("El código debe tener al menos 3 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona una categoría.")).toBeInTheDocument();
    expect(obtenerProductos()).toHaveLength(8);
  });

  it("crea un producto nuevo y vuelve al listado", async () => {
    renderFormulario("/admin/productos/nuevo");

    await userEvent.type(screen.getByLabelText("Código producto"), "PL-009");
    await userEvent.type(screen.getByLabelText("Nombre"), "Helecho");
    await userEvent.type(screen.getByLabelText("Precio"), "7000");
    await userEvent.selectOptions(screen.getByLabelText("Categoría"), "interior");
    await userEvent.type(screen.getByLabelText("Stock"), "5");
    await userEvent.click(screen.getByRole("button", { name: "Guardar producto" }));

    expect(await screen.findByRole("heading", { name: "Lista de productos" })).toBeInTheDocument();
    expect(obtenerProductos()).toHaveLength(9);
    expect(obtenerProductoPorId(9)).toMatchObject({ nombre: "Helecho", precio: 7000, stock: 5 });
  });

  it("al editar, carga los datos del producto y guarda los cambios", async () => {
    renderFormulario("/admin/productos/1/editar");
    expect(screen.getByLabelText("Nombre")).toHaveValue("Monstera Deliciosa");

    const precio = screen.getByLabelText("Precio");
    await userEvent.clear(precio);
    await userEvent.type(precio, "20000");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByRole("heading", { name: "Lista de productos" })).toBeInTheDocument();
    expect(obtenerProductoPorId(1).precio).toBe(20000);
    expect(obtenerProductos()).toHaveLength(8);
  });

  it("muestra un mensaje si el producto a editar no existe", () => {
    renderFormulario("/admin/productos/999/editar");

    expect(screen.getByRole("heading", { name: "Producto no encontrado" })).toBeInTheDocument();
  });
});