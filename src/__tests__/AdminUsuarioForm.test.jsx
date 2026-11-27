import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminUsuarioForm from "../pages/admin/AdminUsuarioForm";
import { actualizarUsuario, crearUsuario, obtenerUsuarioPorId } from "../services/usuariosService";
import { usuariosPrueba } from "./usuariosPrueba";
import { renderConProveedores } from "./utils";

vi.mock("../services/usuariosService");

beforeEach(() => {
  vi.resetAllMocks();
  localStorage.clear();
  obtenerUsuarioPorId.mockImplementation(async (id) => usuariosPrueba.find((u) => u.id === Number(id)) ?? null);
  crearUsuario.mockResolvedValue({ id: 4 });
  actualizarUsuario.mockResolvedValue({ id: 1 });
});

function renderFormulario(ruta) {
  return renderConProveedores(
    <Routes>
      <Route path="/admin/usuarios" element={<h1>Lista de usuarios</h1>} />
      <Route path="/admin/usuarios/nuevo" element={<AdminUsuarioForm />} />
      <Route path="/admin/usuarios/:id/editar" element={<AdminUsuarioForm />} />
    </Routes>,
    { ruta }
  );
}

// Completa el formulario con datos válidos (el correo se puede cambiar)
async function completarFormulario(correo = "ana.perez@gmail.com") {
  await userEvent.type(screen.getByLabelText("RUN"), "191102207");
  await userEvent.type(screen.getByLabelText("Nombre"), "Ana");
  await userEvent.type(screen.getByLabelText("Apellidos"), "Pérez");
  await userEvent.type(screen.getByLabelText("Correo"), correo);
  await userEvent.type(screen.getByLabelText("Contraseña"), "abcd");
  await userEvent.selectOptions(screen.getByLabelText("Tipo de usuario"), "Vendedor");
  await userEvent.selectOptions(screen.getByLabelText("Región"), "Región de Valparaíso");
  await userEvent.selectOptions(screen.getByLabelText("Comuna"), "Quilpué");
  await userEvent.type(screen.getByLabelText("Dirección"), "Calle 1");
}

describe("AdminUsuarioForm", () => {
  it("el título y el botón cambian según sea nuevo o edición", async () => {
    const { unmount } = renderFormulario("/admin/usuarios/nuevo");
    expect(screen.getByRole("heading", { name: "Nuevo usuario" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar usuario" })).toBeInTheDocument();
    unmount();

    renderFormulario("/admin/usuarios/1/editar");
    expect(await screen.findByRole("heading", { name: "Editar usuario" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
  });

  it("no muestra errores al inicio y los muestra al enviar vacío (renderizado condicional)", async () => {
    renderFormulario("/admin/usuarios/nuevo");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));

    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona un tipo de usuario.")).toBeInTheDocument();
    expect(crearUsuario).not.toHaveBeenCalled();
  });

  it("las comunas dependen de la región seleccionada (estado)", async () => {
    renderFormulario("/admin/usuarios/nuevo");
    const comuna = screen.getByLabelText("Comuna");
    expect(comuna.querySelectorAll("option")).toHaveLength(1);

    await userEvent.selectOptions(screen.getByLabelText("Región"), "Región de Valparaíso");

    expect(comuna.querySelectorAll("option")).toHaveLength(5);
  });

  it("crea un usuario nuevo enviando los datos a la API y vuelve al listado", async () => {
    renderFormulario("/admin/usuarios/nuevo");

    await completarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));

    expect(await screen.findByRole("heading", { name: "Lista de usuarios" })).toBeInTheDocument();
    expect(crearUsuario).toHaveBeenCalledWith({
      run: "191102207",
      nombre: "Ana",
      apellidos: "Pérez",
      correo: "ana.perez@gmail.com",
      contrasena: "abcd",
      tipo: "Vendedor",
      fechaNacimiento: "",
      region: "Región de Valparaíso",
      comuna: "Quilpué",
      direccion: "Calle 1"
    });
  });

  it("muestra el error de la API si el correo ya lo usa otro usuario y no cambia de página", async () => {
    crearUsuario.mockRejectedValue({ response: { status: 409, data: { mensaje: "El correo ya está registrado" } } });
    renderFormulario("/admin/usuarios/nuevo");

    await completarFormulario("camila.reyes@gmail.com");
    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));

    expect(await screen.findByText("El correo ya está registrado")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nuevo usuario" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar usuario" })).toBeEnabled();
  });

  it("al editar, carga los datos y guarda los cambios sin enviar contraseña si se deja vacía", async () => {
    renderFormulario("/admin/usuarios/1/editar");
    expect(await screen.findByLabelText("Nombre")).toHaveValue("Camila");
    expect(screen.getByLabelText("Correo")).toHaveValue("camila.reyes@gmail.com");
    expect(screen.getByLabelText("Nueva contraseña (opcional)")).toHaveValue("");

    const nombre = screen.getByLabelText("Nombre");
    await userEvent.clear(nombre);
    await userEvent.type(nombre, "Camila Andrea");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByRole("heading", { name: "Lista de usuarios" })).toBeInTheDocument();
    expect(actualizarUsuario).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: "Camila Andrea", tipo: "Cliente" }));
    expect(actualizarUsuario.mock.calls[0][1]).not.toHaveProperty("contrasena");
  });

  it("al editar, envía la contraseña solo si se escribe una nueva", async () => {
    renderFormulario("/admin/usuarios/1/editar");

    await userEvent.type(await screen.findByLabelText("Nueva contraseña (opcional)"), "nueva1");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByRole("heading", { name: "Lista de usuarios" })).toBeInTheDocument();
    expect(actualizarUsuario).toHaveBeenCalledWith(1, expect.objectContaining({ contrasena: "nueva1" }));
  });

  it("muestra un mensaje si el usuario a editar no existe", async () => {
    renderFormulario("/admin/usuarios/999/editar");

    expect(await screen.findByRole("heading", { name: "Usuario no encontrado" })).toBeInTheDocument();
  });
});