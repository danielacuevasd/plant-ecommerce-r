import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../pages/Login";
import { iniciarSesion } from "../services/authService";
import { renderConProveedores } from "./utils";

vi.mock("../services/authService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
});

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
    expect(iniciarSesion).not.toHaveBeenCalled();
  });

  it("actualiza el estado del campo correo al escribir", async () => {
    renderLogin();
    const correo = screen.getByLabelText("Correo");

    await userEvent.type(correo, "ana@gmail.com");

    expect(correo).toHaveValue("ana@gmail.com");
  });

  it("muestra el mensaje de la API si las credenciales son incorrectas", async () => {
    iniciarSesion.mockRejectedValue({
      response: { status: 401, data: { mensaje: "Correo o contraseña incorrectos." } }
    });
    renderLogin();

    await ingresar("nadie@gmail.com", "clave1");

    expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
    expect(localStorage.getItem("florae_sesion")).toBeNull();
  });

  it("un cliente entra a la tienda y la sesión no guarda la contraseña", async () => {
    iniciarSesion.mockResolvedValue({
      id: 1, nombre: "Camila", correo: "camila.reyes@gmail.com", tipo: "Cliente"
    });
    renderLogin();

    await ingresar("camila.reyes@gmail.com", "cliente");

    expect(await screen.findByRole("heading", { name: "Inicio de la tienda" })).toBeInTheDocument();
    expect(iniciarSesion).toHaveBeenCalledWith("camila.reyes@gmail.com", "cliente");
    expect(JSON.parse(localStorage.getItem("florae_sesion"))).toEqual({
      id: 1, nombre: "Camila", correo: "camila.reyes@gmail.com", tipo: "Cliente"
    });
  });

  it("un administrador es enviado al panel", async () => {
    iniciarSesion.mockResolvedValue({
      id: 3, nombre: "Marcelo", correo: "marcelo.caceres@profesor.duoc.cl", tipo: "Administrador"
    });
    renderLogin();

    await ingresar("marcelo.caceres@profesor.duoc.cl", "admin");

    expect(await screen.findByRole("heading", { name: "Panel de administración" })).toBeInTheDocument();
  });
});