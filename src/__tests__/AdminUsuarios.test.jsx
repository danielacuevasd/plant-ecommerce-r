import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminUsuarios from "../pages/admin/AdminUsuarios";
import { eliminarUsuario, obtenerUsuarios } from "../services/usuariosService";
import { usuariosPrueba } from "./usuariosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/usuariosService");

// La API simulada guarda la lista, así el listado refleja las eliminaciones
let lista;

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  lista = [...usuariosPrueba];
  obtenerUsuarios.mockImplementation(async () => lista);
  eliminarUsuario.mockImplementation(async (id) => {
    lista = lista.filter((u) => u.id !== id);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function iniciarSesionComoAdministrador() {
  localStorage.setItem(
    "florae_sesion",
    JSON.stringify({ id: 3, nombre: "Marcelo", correo: "marcelo.caceres@profesor.duoc.cl", tipo: "Administrador" })
  );
}

describe("AdminUsuarios", () => {
  it("muestra un mensaje de carga mientras llega el listado", async () => {
    renderConProveedores(<AdminUsuarios />);

    expect(screen.getByText("Cargando usuarios...")).toBeInTheDocument();
    await screen.findByRole("table");
  });

  it("lista los usuarios con su nombre completo, correo y tipo", async () => {
    renderConProveedores(<AdminUsuarios />);

    expect(await screen.findAllByRole("row")).toHaveLength(4);
    const fila = screen.getByText("Camila Reyes Soto").closest("tr");
    expect(within(fila).getByText("camila.reyes@gmail.com")).toBeInTheDocument();
    expect(within(fila).getByText("Cliente")).toBeInTheDocument();
  });

  it("muestra el error si la API falla (por ejemplo, sin permisos)", async () => {
    obtenerUsuarios.mockRejectedValue({ response: { status: 403, data: { mensaje: "No tienes permisos para realizar esta acción" } } });
    renderConProveedores(<AdminUsuarios />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permisos para realizar esta acción");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("elimina un usuario cuando se confirma (mock de window.confirm)", async () => {
    iniciarSesionComoAdministrador();
    const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderConProveedores(<AdminUsuarios />);

    const fila = (await screen.findByText("Camila Reyes Soto")).closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(confirmar).toHaveBeenCalledWith(expect.stringContaining("Camila"));
    expect(eliminarUsuario).toHaveBeenCalledWith(1);
    await vi.waitFor(() => expect(screen.queryByText("Camila Reyes Soto")).not.toBeInTheDocument());
    expect(screen.getAllByRole("row")).toHaveLength(3);
  });

  it("no elimina nada si el administrador cancela", async () => {
    iniciarSesionComoAdministrador();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderConProveedores(<AdminUsuarios />);

    const fila = (await screen.findByText("Camila Reyes Soto")).closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(eliminarUsuario).not.toHaveBeenCalled();
    expect(screen.getByText("Camila Reyes Soto")).toBeInTheDocument();
  });

  it("muestra el error de la API si no se puede eliminar", async () => {
    iniciarSesionComoAdministrador();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    eliminarUsuario.mockRejectedValue({ response: { status: 404, data: { mensaje: "Usuario no encontrado" } } });
    renderConProveedores(<AdminUsuarios />);

    const fila = (await screen.findByText("Camila Reyes Soto")).closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Usuario no encontrado");
    expect(screen.getByText("Camila Reyes Soto")).toBeInTheDocument();
  });

  it("no permite eliminar la cuenta con la que se inició sesión (renderizado condicional)", async () => {
    iniciarSesionComoAdministrador();
    renderConProveedores(<AdminUsuarios />);

    const propia = (await screen.findByText("Marcelo Cáceres")).closest("tr");
    expect(within(propia).getByRole("button", { name: "Eliminar" })).toBeDisabled();

    const otra = screen.getByText("Camila Reyes Soto").closest("tr");
    expect(within(otra).getByRole("button", { name: "Eliminar" })).toBeEnabled();
  });
});