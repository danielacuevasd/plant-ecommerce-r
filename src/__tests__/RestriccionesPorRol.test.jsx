import { screen, within } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminLayout from "../components/AdminLayout";
import Header from "../components/Header";
import RequiereRol from "../components/RequiereRol";
import AdminProductos from "../pages/admin/AdminProductos";
import { obtenerProductos } from "../services/productosService";
import { ROLES } from "../utils/roles";
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
    JSON.stringify({ id: 5, nombre: "Usuario", correo: "u@gmail.com", tipo })
  );
}

// Panel reducido con la misma estructura de rutas que App.jsx
function renderPanel(ruta) {
  return renderConProveedores(
    <Routes>
      <Route path="/login" element={<h1>Pantalla de login</h1>} />
      <Route path="/" element={<h1>Tienda</h1>} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="productos" element={<AdminProductos />} />
        <Route element={<RequiereRol roles={[ROLES.ADMIN]} />}>
          <Route index element={<h1>Resumen del panel</h1>} />
          <Route path="usuarios" element={<h1>Lista de usuarios</h1>} />
        </Route>
      </Route>
    </Routes>,
    { ruta }
  );
}

describe("Restricciones del rol Vendedor", () => {
  it("el menú del vendedor solo muestra Productos", async () => {
    iniciarSesionComo(ROLES.VENDEDOR);
    renderPanel("/admin/productos");
    await screen.findByRole("table");

    const menu = screen.getByRole("navigation", { name: "Panel administrador" });
    expect(within(menu).getByRole("link", { name: "Productos" })).toBeInTheDocument();
    expect(within(menu).queryByRole("link", { name: "Inicio" })).not.toBeInTheDocument();
    expect(within(menu).queryByRole("link", { name: "Usuarios" })).not.toBeInTheDocument();
    expect(within(menu).queryByRole("link", { name: "Mensajes" })).not.toBeInTheDocument();
  });

  it("el menú del administrador muestra todas las secciones", async () => {
    iniciarSesionComo(ROLES.ADMIN);
    renderPanel("/admin/productos");
    await screen.findByRole("table");

    const menu = screen.getByRole("navigation", { name: "Panel administrador" });
    ["Inicio", "Productos", "Usuarios", "Mensajes"].forEach((nombre) => {
      expect(within(menu).getByRole("link", { name: nombre })).toBeInTheDocument();
    });
  });

  it("si el vendedor abre el resumen, lo devuelve a Productos", async () => {
    iniciarSesionComo(ROLES.VENDEDOR);
    renderPanel("/admin");

    expect(await screen.findByRole("heading", { name: "Productos" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Resumen del panel" })).not.toBeInTheDocument();
  });

  it("si el vendedor escribe la ruta de usuarios, no la ve y vuelve a Productos", async () => {
    iniciarSesionComo(ROLES.VENDEDOR);
    renderPanel("/admin/usuarios");

    expect(await screen.findByRole("heading", { name: "Productos" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Lista de usuarios" })).not.toBeInTheDocument();
  });

  it("el administrador sí entra a la ruta de usuarios", () => {
    iniciarSesionComo(ROLES.ADMIN);
    renderPanel("/admin/usuarios");

    expect(screen.getByRole("heading", { name: "Lista de usuarios" })).toBeInTheDocument();
  });

  it("un cliente no entra al panel y va al login", () => {
    iniciarSesionComo(ROLES.CLIENTE);
    renderPanel("/admin/productos");

    expect(screen.getByRole("heading", { name: "Pantalla de login" })).toBeInTheDocument();
  });

  it("sin sesión, las rutas de administrador van al login", () => {
    renderPanel("/admin/usuarios");

    expect(screen.getByRole("heading", { name: "Pantalla de login" })).toBeInTheDocument();
  });
});

describe("Acciones sobre productos según el rol", () => {
  it("el vendedor ve el listado pero sin crear, editar ni eliminar", async () => {
    iniciarSesionComo(ROLES.VENDEDOR);
    renderConProveedores(<AdminProductos />);

    expect(await screen.findAllByRole("row")).toHaveLength(9);
    expect(screen.queryByRole("link", { name: "Nuevo producto" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Editar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Eliminar" })).not.toBeInTheDocument();
  });

  it("el vendedor puede abrir el detalle de cada producto", async () => {
    iniciarSesionComo(ROLES.VENDEDOR);
    renderConProveedores(<AdminProductos />);

    const fila = (await screen.findByText("Monstera Deliciosa")).closest("tr");
    expect(within(fila).getByRole("link", { name: "Ver detalle" })).toHaveAttribute("href", "/productos/1");
  });

  it("el administrador sí ve crear, editar y eliminar", async () => {
    iniciarSesionComo(ROLES.ADMIN);
    renderConProveedores(<AdminProductos />);

    expect(await screen.findByRole("link", { name: "Nuevo producto" })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Editar" })).toHaveLength(8);
    expect(screen.getAllByRole("button", { name: "Eliminar" })).toHaveLength(8);
    expect(screen.queryByRole("link", { name: "Ver detalle" })).not.toBeInTheDocument();
  });
});

describe("Header según el rol", () => {
  it("el vendedor ve el enlace a su panel y no el del administrador", () => {
    iniciarSesionComo(ROLES.VENDEDOR);
    renderConProveedores(<Header />);

    expect(screen.getByRole("link", { name: "Panel vendedor" })).toHaveAttribute("href", "/admin/productos");
    expect(screen.queryByRole("link", { name: "Panel admin" })).not.toBeInTheDocument();
  });
});