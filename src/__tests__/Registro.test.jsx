import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { obtenerUsuarios } from "../data/db";
import Registro from "../pages/Registro";
import { renderConProveedores } from "./utils";

function renderRegistro() {
  return renderConProveedores(
    <Routes>
      <Route path="/registro" element={<Registro />} />
      <Route path="/" element={<h1>Inicio de la tienda</h1>} />
    </Routes>,
    { ruta: "/registro" }
  );
}

// Completa el formulario con datos válidos (el correo se puede cambiar)
async function completarFormulario(correo = "ana.perez@gmail.com") {
  await userEvent.type(screen.getByLabelText("RUN"), "191102207");
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
  await userEvent.type(screen.getByLabelText("Apellidos"), "Pérez");
  await userEvent.type(screen.getByLabelText("Correo"), correo);
  await userEvent.type(screen.getByLabelText("Contraseña"), "abcd");
  await userEvent.type(screen.getByLabelText("Confirmar contraseña"), "abcd");
  await userEvent.selectOptions(screen.getByLabelText("Región"), "Región de Valparaíso");
  await userEvent.selectOptions(screen.getByLabelText("Comuna"), "Quilpué");
  await userEvent.type(screen.getByLabelText("Dirección"), "Calle 1");
}

describe("Registro", () => {
  it("no muestra errores al inicio y los muestra al enviar vacío (renderizado condicional)", async () => {
    renderRegistro();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    expect(screen.getAllByRole("alert").length).toBeGreaterThanOrEqual(6);
  });

  it("las comunas dependen de la región seleccionada (estado)", async () => {
    renderRegistro();
    const comuna = screen.getByLabelText("Comuna");
    expect(comuna.querySelectorAll("option")).toHaveLength(1);

    await userEvent.selectOptions(screen.getByLabelText("Región"), "Región de Valparaíso");

    expect(comuna.querySelectorAll("option")).toHaveLength(5);
  });

  it("muestra error si el RUN tiene dígito verificador incorrecto", async () => {
    renderRegistro();

    await userEvent.type(screen.getByLabelText("RUN"), "191102201");
    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    expect(screen.getByText(/dígito verificador incorrecto/i)).toBeInTheDocument();
  });

  it("muestra error si las contraseñas no coinciden", async () => {
    renderRegistro();

    await userEvent.type(screen.getByLabelText("Contraseña"), "abcd");
    await userEvent.type(screen.getByLabelText("Confirmar contraseña"), "xyz1");
    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    expect(await screen.findByText("Las contraseñas no coinciden.")).toBeInTheDocument();
  });

  it("rechaza un correo ya registrado", async () => {
    renderRegistro();

    await completarFormulario("camila.reyes@gmail.com");
    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    expect(await screen.findByText("Ya existe una cuenta con ese correo.")).toBeInTheDocument();
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("un registro válido crea el usuario, inicia sesión y vuelve a la tienda", async () => {
    renderRegistro();

    await completarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Registrar" }));

    expect(await screen.findByRole("heading", { name: "Inicio de la tienda" })).toBeInTheDocument();
    expect(obtenerUsuarios()).toHaveLength(4);
    expect(JSON.parse(localStorage.getItem("florae_sesion")).nombre).toBe("Ana");
  });
});