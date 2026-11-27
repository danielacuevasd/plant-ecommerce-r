import { screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminMensajes from "../pages/admin/AdminMensajes";
import { obtenerMensajes } from "../services/contactoService";
import { renderConProveedores } from "./utils";

vi.mock("../services/contactoService");

const mensajesPrueba = [
  { id: 2, nombre: "Ana Pérez", correo: "ana@gmail.com", comentario: "¿Hacen envíos a regiones?", fecha: "2026-11-25T15:30:00.000Z" },
  { id: 1, nombre: "Luis Soto", correo: "luis@duoc.cl", comentario: "Busco una Monstera grande.", fecha: "2026-11-24T10:00:00.000Z" }
];

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  obtenerMensajes.mockResolvedValue(mensajesPrueba);
});

describe("AdminMensajes", () => {
  it("muestra un mensaje de carga mientras llegan los mensajes", async () => {
    renderConProveedores(<AdminMensajes />);

    expect(screen.getByText("Cargando mensajes...")).toBeInTheDocument();
    await screen.findByRole("table");
  });

  it("lista los mensajes con nombre, correo y comentario", async () => {
    renderConProveedores(<AdminMensajes />);

    expect(await screen.findAllByRole("row")).toHaveLength(3);
    const fila = screen.getByText("Ana Pérez").closest("tr");
    expect(within(fila).getByText("ana@gmail.com")).toBeInTheDocument();
    expect(within(fila).getByText("¿Hacen envíos a regiones?")).toBeInTheDocument();
  });

  it("muestra un aviso cuando no hay mensajes (renderizado condicional)", async () => {
    obtenerMensajes.mockResolvedValue([]);
    renderConProveedores(<AdminMensajes />);

    expect(await screen.findByText("Todavía no hay mensajes de contacto.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("muestra el error si la API falla", async () => {
    obtenerMensajes.mockRejectedValue({ response: { status: 403, data: { mensaje: "No tienes permisos para realizar esta acción" } } });
    renderConProveedores(<AdminMensajes />);

    expect(await screen.findByRole("alert")).toHaveTextContent("No tienes permisos para realizar esta acción");
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});