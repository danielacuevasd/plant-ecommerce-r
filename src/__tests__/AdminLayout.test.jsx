import { screen, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AdminLayout from "../components/AdminLayout";
import AdminInicio from "../pages/admin/AdminInicio";
import { renderConProveedores } from "./utils";

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

  it("permite el acceso a un administrador y muestra el menú lateral", () => {
    iniciarSesionComo("Administrador");
    renderAdmin();

    expect(screen.getByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
    const menu = screen.getByRole("navigation", { name: "Panel administrador" });
    expect(within(menu).getByRole("link", { name: "Productos" })).toHaveAttribute("href", "/admin/productos");
    expect(within(menu).getByRole("link", { name: "Usuarios" })).toHaveAttribute("href", "/admin/usuarios");
  });
});

describe("AdminInicio", () => {
  it("muestra los totales de productos, usuarios y stock crítico", () => {
    iniciarSesionComo("Administrador");
    renderAdmin();

    const tarjeta = (texto) => screen.getByText(texto).closest("article");
    expect(within(tarjeta("Productos registrados")).getByText("8")).toBeInTheDocument();
    expect(within(tarjeta("Usuarios registrados")).getByText("3")).toBeInTheDocument();
    expect(within(tarjeta("Productos con stock crítico")).getByText("1")).toBeInTheDocument();
  });
});