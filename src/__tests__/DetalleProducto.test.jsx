import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import DetalleProducto from "../pages/DetalleProducto";
import { obtenerProductoPorId, obtenerProductos } from "../services/productosService";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/productosService");

// La API simulada responde como el backend real
function simularApi(productos = productosPrueba) {
  obtenerProductoPorId.mockImplementation(async (id) => productos.find((p) => p.id === Number(id)) ?? null);
  obtenerProductos.mockImplementation(async (categoria) =>
    categoria ? productos.filter((p) => p.categoria === categoria) : productos
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  simularApi();
});

function renderDetalle(id) {
  return renderConProveedores(
    <Routes>
      <Route path="/productos/:id" element={<DetalleProducto />} />
    </Routes>,
    { ruta: `/productos/${id}` }
  );
}

// El formulario de cantidad es el que contiene el campo "Cantidad"
async function formularioDeCantidad() {
  return (await screen.findByLabelText("Cantidad")).closest("form");
}

describe("DetalleProducto", () => {
  it("muestra un mensaje de carga mientras llega el producto", async () => {
    renderDetalle(1);

    expect(screen.getByText("Cargando producto...")).toBeInTheDocument();
    await screen.findByRole("heading", { level: 1, name: "Monstera Deliciosa" });
  });

  it("muestra los datos del producto de la ruta", async () => {
    renderDetalle(1);

    expect(await screen.findByRole("heading", { level: 1, name: "Monstera Deliciosa" })).toBeInTheDocument();
    expect(screen.getByText("$18.990")).toBeInTheDocument();
    expect(screen.getByText("Stock disponible: 12")).toBeInTheDocument();
  });

  it("muestra un mensaje si el producto no existe (renderizado condicional)", async () => {
    renderDetalle(999);

    expect(await screen.findByRole("heading", { name: "Producto no encontrado" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Cantidad")).not.toBeInTheDocument();
  });

  it("muestra el error si la API falla", async () => {
    obtenerProductoPorId.mockRejectedValue({ response: { data: { mensaje: "No se pudo conectar con el servidor." } } });
    renderDetalle(1);

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor.");
    expect(screen.queryByLabelText("Cantidad")).not.toBeInTheDocument();
  });

  it("muestra productos relacionados de la misma categoría, sin repetir el actual", async () => {
    renderDetalle(1);

    expect(await screen.findByRole("heading", { level: 3, name: "Potus Verde" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Calathea Orbifolia" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3, name: "Monstera Deliciosa" })).not.toBeInTheDocument();
    expect(obtenerProductos).toHaveBeenCalledWith("interior");
  });

  it("agrega la cantidad elegida al carrito y muestra confirmación (estado y eventos)", async () => {
    renderDetalle(1);

    const cantidad = await screen.findByLabelText("Cantidad");
    await userEvent.clear(cantidad);
    await userEvent.type(cantidad, "3");
    await userEvent.click(within(await formularioDeCantidad()).getByRole("button", { name: "Añadir al carrito" }));

    expect(screen.getByRole("status")).toHaveTextContent("Se agregó Monstera Deliciosa al carrito.");
    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 3 }]);
  });

  it("el carrito no supera el stock al agregar varias veces", async () => {
    renderDetalle(1);
    const cantidad = await screen.findByLabelText("Cantidad");

    await userEvent.clear(cantidad);
    await userEvent.type(cantidad, "10");
    await userEvent.click(within(await formularioDeCantidad()).getByRole("button", { name: "Añadir al carrito" }));

    await userEvent.clear(cantidad);
    await userEvent.type(cantidad, "5");
    await userEvent.click(within(await formularioDeCantidad()).getByRole("button", { name: "Añadir al carrito" }));

    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([{ id: 1, cantidad: 12 }]);
  });

  it("deshabilita el botón cuando el producto no tiene stock", async () => {
    simularApi(productosPrueba.map((p) => (p.id === 1 ? { ...p, stock: 0 } : p)));
    renderDetalle(1);

    const formulario = await formularioDeCantidad();
    expect(within(formulario).getByRole("button", { name: "Añadir al carrito" })).toBeDisabled();
  });
});