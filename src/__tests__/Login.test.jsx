import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Login from "../pages/Login";
import { renderConProveedores } from "./utils";

function renderLogin() {
  return renderConProveedores(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<h1>Inicio de la tienda</h1>} />
      <Route path="/admin" element={<h1>Panel de administración</h1>} />
    </Routes>,
    { ruta: "/login" }
  );
}

async function ingresar(correo, contrasena) {
  await userEvent.type(screen.getByLabelText("Correo"), correo);
  await userEvent.type(screen.getByLabelText("Contraseña"), contrasena);
  await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));
}

describe("Login", () => {
  it("no muestra errores hasta que se envía el formulario (renderizado condicional)", async () => {
    renderLogin();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(screen.getAllByRole("alert").length).toBeGreaterThan(0);
  });

  it("actualiza el estado del campo correo al escribir", async () => {
    renderLogin();
    const correo = screen.getByLabelText("Correo");

    await userEvent.type(correo, "ana@gmail.com");

    expect(correo).toHaveValue("ana@gmail.com");
  });

  it("muestra un error si las credenciales no existen", async () => {
    renderLogin();

    await ingresar("nadie@gmail.com", "clave1");

    expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
    expect(localStorage.getItem("florae_sesion")).toBeNull();
  });

  it("un cliente entra a la tienda y la sesión no guarda la contraseña", async () => {
    renderLogin();

    await ingresar("camila.reyes@gmail.com", "cliente");

    expect(await screen.findByRole("heading", { name: "Inicio de la tienda" })).toBeInTheDocument();
    const sesion = JSON.parse(localStorage.getItem("florae_sesion"));
    expect(sesion).toEqual({ id: 1, nombre: "Camila", correo: "camila.reyes@gmail.com", tipo: "Cliente" });
  });

  it("un administrador es enviado al panel", async () => {
    renderLogin();

    await ingresar("marcelo.caceres@profesor.duoc.cl", "admin");

    expect(await screen.findByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
  });
});