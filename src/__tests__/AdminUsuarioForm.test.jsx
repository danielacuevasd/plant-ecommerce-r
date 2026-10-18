import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { obtenerUsuarioPorId, obtenerUsuarios } from "../data/db";
import AdminUsuarioForm from "../pages/admin/AdminUsuarioForm";
import { renderConProveedores } from "./utils";

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
  it("el título y el botón cambian según sea nuevo o edición", () => {
    const { unmount } = renderFormulario("/admin/usuarios/nuevo");
    expect(screen.getByRole("heading", { name: "Nuevo usuario" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar usuario" })).toBeInTheDocument();
    unmount();

    renderFormulario("/admin/usuarios/1/editar");
    expect(screen.getByRole("heading", { name: "Editar usuario" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
  });

  it("no muestra errores al inicio y los muestra al enviar vacío (renderizado condicional)", async () => {
    renderFormulario("/admin/usuarios/nuevo");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));

    expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
    expect(screen.getByText("Selecciona un tipo de usuario.")).toBeInTheDocument();
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("las comunas dependen de la región seleccionada (estado)", async () => {
    renderFormulario("/admin/usuarios/nuevo");
    const comuna = screen.getByLabelText("Comuna");
    expect(comuna.querySelectorAll("option")).toHaveLength(1);

    await userEvent.selectOptions(screen.getByLabelText("Región"), "Región de Valparaíso");

    expect(comuna.querySelectorAll("option")).toHaveLength(5);
  });

  it("crea un usuario nuevo y vuelve al listado", async () => {
    renderFormulario("/admin/usuarios/nuevo");

    await completarFormulario();
    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));

    expect(await screen.findByRole("heading", { name: "Lista de usuarios" })).toBeInTheDocument();
    expect(obtenerUsuarios()).toHaveLength(4);
    expect(obtenerUsuarioPorId(4)).toMatchObject({ nombre: "Ana", tipo: "Vendedor", comuna: "Quilpué" });
  });

  it("rechaza un correo que ya usa otro usuario", async () => {
    renderFormulario("/admin/usuarios/nuevo");

    await completarFormulario("camila.reyes@gmail.com");
    await userEvent.click(screen.getByRole("button", { name: "Guardar usuario" }));

    expect(await screen.findByText("Ya existe un usuario con ese correo.")).toBeInTheDocument();
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("al editar, carga los datos, permite conservar su propio correo y guarda los cambios", async () => {
    renderFormulario("/admin/usuarios/1/editar");
    expect(screen.getByLabelText("Nombre")).toHaveValue("Camila");
    expect(screen.getByLabelText("Correo")).toHaveValue("camila.reyes@gmail.com");

    const nombre = screen.getByLabelText("Nombre");
    await userEvent.clear(nombre);
    await userEvent.type(nombre, "Camila Andrea");
    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByRole("heading", { name: "Lista de usuarios" })).toBeInTheDocument();
    expect(obtenerUsuarioPorId(1).nombre).toBe("Camila Andrea");
    expect(obtenerUsuarios()).toHaveLength(3);
  });

  it("muestra un mensaje si el usuario a editar no existe", () => {
    renderFormulario("/admin/usuarios/999/editar");

    expect(screen.getByRole("heading", { name: "Usuario no encontrado" })).toBeInTheDocument();
  });
});