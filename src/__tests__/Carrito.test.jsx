import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Carrito from "../pages/Carrito";
import { obtenerProductos } from "../services/productosService";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/productosService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  obtenerProductos.mockResolvedValue(productosPrueba);
});

function cargarCarrito(items, cupon = "") {
  localStorage.setItem("florae_carrito", JSON.stringify({ items, cupon }));
}

// Espera a que el carrito termine de traer los datos del producto desde la API
function esperarMonstera() {
  return screen.findByRole("heading", { level: 3, name: "Monstera Deliciosa" });
}

describe("Carrito", () => {
  it("muestra el mensaje de carrito vacío cuando no hay ítems", () => {
    renderConProveedores(<Carrito />);

    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$0");
  });

  it("muestra un mensaje de carga mientras llegan los datos de los productos", async () => {
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);

    expect(screen.getByText("Cargando carrito...")).toBeInTheDocument();
    expect(screen.queryByText(/tu carrito está vacío/i)).not.toBeInTheDocument();
    await esperarMonstera();
    expect(screen.queryByText("Cargando carrito...")).not.toBeInTheDocument();
  });

  it("muestra el error si la API no responde", async () => {
    obtenerProductos.mockRejectedValue({ response: { data: { mensaje: "No se pudo conectar con el servidor." } } });
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor.");
    expect(screen.queryByText(/tu carrito está vacío/i)).not.toBeInTheDocument();
  });

  it("calcula el total con los productos guardados", async () => {
    cargarCarrito([{ id: 1, cantidad: 2 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$37.980");
  });

  it("los botones + y - cambian la cantidad y el total", async () => {
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    await userEvent.click(screen.getByRole("button", { name: /sumar una unidad de monstera/i }));
    expect(screen.getByLabelText("Cantidad de Monstera Deliciosa")).toHaveTextContent("2");
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$37.980");

    await userEvent.click(screen.getByRole("button", { name: /restar una unidad de monstera/i }));
    expect(screen.getByLabelText("Cantidad de Monstera Deliciosa")).toHaveTextContent("1");
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$18.990");
  });

  it("no permite sumar más unidades que el stock de la API", async () => {
    cargarCarrito([{ id: 1, cantidad: 12 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    expect(screen.getByRole("button", { name: /sumar una unidad de monstera/i })).toBeDisabled();
  });

  it("elimina un producto del carrito", async () => {
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    await userEvent.click(screen.getByRole("button", { name: /eliminar monstera/i }));

    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("aplica el cupón FLORAE10 sin distinguir mayúsculas y descuenta el 10%", async () => {
    cargarCarrito([{ id: 1, cantidad: 2 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    await userEvent.type(screen.getByLabelText("Cupón de descuento"), "florae10");
    await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.getByText("Descuento (FLORAE10)")).toBeInTheDocument();
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$34.182");
  });

  it("muestra un error con un cupón inválido y no descuenta nada", async () => {
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    await userEvent.type(screen.getByLabelText("Cupón de descuento"), "NOEXISTE");
    await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.getByRole("alert")).toHaveTextContent(/no es válido/i);
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$18.990");
  });

  it("pide ingresar un código si el campo está vacío", async () => {
    cargarCarrito([{ id: 1, cantidad: 1 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    await userEvent.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Ingresa un código de cupón.");
  });

  it("Pagar con productos vacía el carrito y confirma la compra", async () => {
    cargarCarrito([{ id: 1, cantidad: 2 }]);
    renderConProveedores(<Carrito />);
    await esperarMonstera();

    await userEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(screen.getByRole("status")).toHaveTextContent(/compra simulada con éxito/i);
    expect(screen.getByTestId("carrito-total")).toHaveTextContent("$0");
    expect(JSON.parse(localStorage.getItem("florae_carrito")).items).toEqual([]);
  });

  it("Pagar con el carrito vacío muestra un aviso (renderizado condicional)", async () => {
    renderConProveedores(<Carrito />);

    await userEvent.click(screen.getByRole("button", { name: "Pagar" }));

    expect(screen.getByRole("status")).toHaveTextContent(/agrega productos antes de continuar/i);
  });
});