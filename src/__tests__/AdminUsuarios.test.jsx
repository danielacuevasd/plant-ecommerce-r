import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { obtenerUsuarios } from "../data/db";
import AdminUsuarios from "../pages/admin/AdminUsuarios";
import { renderConProveedores } from "./utils";

function iniciarSesionComoAdministrador() {
  localStorage.setItem(
    "florae_sesion",
    JSON.stringify({ id: 3, nombre: "Marcelo", correo: "marcelo.caceres@profesor.duoc.cl", tipo: "Administrador" })
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("AdminUsuarios", () => {
  it("lista los usuarios con su nombre completo, correo y tipo", () => {
    renderConProveedores(<AdminUsuarios />);

    expect(screen.getAllByRole("row")).toHaveLength(4);
    const fila = screen.getByText("Camila Reyes Soto").closest("tr");
    expect(within(fila).getByText("camila.reyes@gmail.com")).toBeInTheDocument();
    expect(within(fila).getByText("Cliente")).toBeInTheDocument();
  });

  it("elimina un usuario cuando se confirma (mock de window.confirm)", async () => {
    iniciarSesionComoAdministrador();
    const confirmar = vi.spyOn(window, "confirm").mockReturnValue(true);
    renderConProveedores(<AdminUsuarios />);

    const fila = screen.getByText("Camila Reyes Soto").closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(confirmar).toHaveBeenCalledWith(expect.stringContaining("Camila"));
    expect(screen.queryByText("Camila Reyes Soto")).not.toBeInTheDocument();
    expect(obtenerUsuarios()).toHaveLength(2);
  });

  it("no elimina nada si el administrador cancela", async () => {
    iniciarSesionComoAdministrador();
    vi.spyOn(window, "confirm").mockReturnValue(false);
    renderConProveedores(<AdminUsuarios />);

    const fila = screen.getByText("Camila Reyes Soto").closest("tr");
    await userEvent.click(within(fila).getByRole("button", { name: "Eliminar" }));

    expect(screen.getByText("Camila Reyes Soto")).toBeInTheDocument();
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("no permite eliminar la cuenta con la que se inició sesión (renderizado condicional)", () => {
    iniciarSesionComoAdministrador();
    renderConProveedores(<AdminUsuarios />);

    const propia = screen.getByText("Marcelo Cáceres").closest("tr");
    expect(within(propia).getByRole("button", { name: "Eliminar" })).toBeDisabled();

    const otra = screen.getByText("Camila Reyes Soto").closest("tr");
    expect(within(otra).getByRole("button", { name: "Eliminar" })).toBeEnabled();
  });
});