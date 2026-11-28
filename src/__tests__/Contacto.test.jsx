import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contacto from "../pages/Contacto";
import { enviarMensaje } from "../services/contactoService";
import { renderConProveedores } from "./utils";

vi.mock("../services/contactoService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  enviarMensaje.mockResolvedValue({ id: 1 });
});

async function completarFormulario() {
  await userEvent.type(screen.getByLabelText("Nombre completo"), "Ana");
  await userEvent.type(screen.getByLabelText("Correo"), "ana@gmail.com");
  await userEvent.type(screen.getByLabelText("Comentario"), "Consulta sobre envíos");
}

describe("Contacto", () => {
  it("el contador de caracteres cambia mientras se escribe (estado)", async () => {
    renderConProveedores(<Contacto />);
    expect(screen.getByTestId("contador-comentario")).toHaveTextContent("0 / 500");

    await userEvent.type(screen.getByLabelText("Comentario"), "Hola");

    expect(screen.getByTestId("contador-comentario")).toHaveTextContent("4 / 500");
  });

  it("exige nombre, correo y comentario (renderizado condicional)", async () => {
    renderConProveedores(<Contacto />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("El correo es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("El comentario es obligatorio.")).toBeInTheDocument();
    expect(screen.getAllByRole("alert")).toHaveLength(3);
    expect(enviarMensaje).not.toHaveBeenCalled();
  });

  it("rechaza un correo con dominio no permitido", async () => {
    renderConProveedores(<Contacto />);

    await userEvent.type(screen.getByLabelText("Nombre completo"), "Ana");
    await userEvent.type(screen.getByLabelText("Correo"), "ana@hotmail.com");
    await userEvent.type(screen.getByLabelText("Comentario"), "Consulta");
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(screen.getByText(/solo se aceptan correos/i)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(enviarMensaje).not.toHaveBeenCalled();
  });

  it("envía el mensaje a la API, confirma y limpia el formulario", async () => {
    renderConProveedores(<Contacto />);

    await completarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByRole("status")).toHaveTextContent(/gracias por tu mensaje/i);
    expect(enviarMensaje).toHaveBeenCalledWith({
      nombre: "Ana",
      correo: "ana@gmail.com",
      comentario: "Consulta sobre envíos"
    });
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("");
    expect(screen.getByLabelText("Correo")).toHaveValue("");
    expect(screen.getByLabelText("Comentario")).toHaveValue("");
  });

  it("si la API falla muestra el error y conserva lo que escribió el usuario", async () => {
    enviarMensaje.mockRejectedValue({ response: { data: { mensaje: "No se pudo conectar con el servidor." } } });
    renderConProveedores(<Contacto />);

    await completarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("No se pudo conectar con el servidor.");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Nombre completo")).toHaveValue("Ana");
    expect(screen.getByLabelText("Comentario")).toHaveValue("Consulta sobre envíos");
  });

  it("la confirmación desaparece cuando el usuario vuelve a escribir", async () => {
    renderConProveedores(<Contacto />);

    await completarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));
    expect(await screen.findByRole("status")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Nombre completo"), "B");

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});