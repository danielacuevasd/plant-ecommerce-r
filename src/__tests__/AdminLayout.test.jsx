import { screen, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminLayout from "../components/AdminLayout";
import AdminInicio from "../pages/admin/AdminInicio";
import { obtenerProductos } from "../services/productosService";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/productosService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  obtenerProductos.mockResolvedValue(productosPrueba);
});

function iniciarSesionComo(tipo) {
  localStorage.setItem(
    "florae_sesion",
    JSON.stringify({ id: 1, nombre: "Usuario", correo: "u@gmail.com", tipo })
  );
}

function renderAdmin() {
  return renderConProveedores(
    <Routes>
      <Route path="/login" element={<h1>Pantalla de login</h1>} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminInicio />} />
      </Route>
    </Routes>,
    { ruta: "/admin" }
  );
}

describe("AdminLayout (acceso al panel)", () => {
  it("envía al login a quien no ha iniciado sesión", () => {
    renderAdmin();

    expect(screen.getByRole("heading", { name: "Pantalla de login" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Panel de administración" })).not.toBeInTheDocument();
  });

  it("envía al login a un cliente", () => {
    iniciarSesionComo("Cliente");
    renderAdmin();

    expect(screen.getByRole("heading", { name: "Pantalla de login" })).toBeInTheDocument();
  });

  it("permite el acceso a un administrador y muestra el menú lateral", async () => {
    iniciarSesionComo("Administrador");
    renderAdmin();

    expect(screen.getByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
    const menu = screen.getByRole("navigation", { name: "Panel administrador" });
    expect(within(menu).getByRole("link", { name: "Productos" })).toHaveAttribute("href", "/admin/productos");
    expect(within(menu).getByRole("link", { name: "Usuarios" })).toHaveAttribute("href", "/admin/usuarios");
    await screen.findByText("8");
  });
});

describe("AdminInicio", () => {
  it("muestra los totales de productos, usuarios y stock crítico", async () => {
    iniciarSesionComo("Administrador");
    renderAdmin();

    const tarjeta = (texto) => screen.getByText(texto).closest("article");
    expect(await within(tarjeta("Productos registrados")).findByText("8")).toBeInTheDocument();
    expect(within(tarjeta("Usuarios registrados")).getByText("3")).toBeInTheDocument();
    expect(within(tarjeta("Productos con stock crítico")).getByText("1")).toBeInTheDocument();
  });

  it("muestra el error si la API falla", async () => {
    obtenerProductos.mockRejectedValue({ response: { data: { mensaje: "No se pudo conectar con el servidor." } } });
    iniciarSesionComo("Administrador");
    renderAdmin();

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor.");
  });
});