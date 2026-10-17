import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Header from "../components/Header";
import { renderConProveedores } from "./utils";

describe("Header", () => {
  it("muestra el contador del carrito según el estado guardado", () => {
    localStorage.setItem(
      "florae_carrito",
      JSON.stringify({ items: [{ id: 1, cantidad: 2 }, { id: 2, cantidad: 1 }], cupon: "" })
    );
    renderConProveedores(<Header />);

    expect(screen.getByTestId("contador-carrito")).toHaveTextContent("3");
  });

  it("muestra el panel admin solo para administradores", () => {
    localStorage.setItem(
      "florae_sesion",
      JSON.stringify({ id: 3, nombre: "Marcelo", correo: "m@duoc.cl", tipo: "Administrador" })
    );
    renderConProveedores(<Header />);

    expect(screen.getByText("Hola, Marcelo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Panel admin" })).toBeInTheDocument();
  });

  it("no muestra el panel admin a un cliente", () => {
    localStorage.setItem(
      "florae_sesion",
      JSON.stringify({ id: 1, nombre: "Camila", correo: "c@gmail.com", tipo: "Cliente" })
    );
    renderConProveedores(<Header />);

    expect(screen.queryByRole("link", { name: "Panel admin" })).not.toBeInTheDocument();
  });

  it("el botón de menú alterna aria-expanded (responsivo)", async () => {
    renderConProveedores(<Header />);
    const boton = screen.getByRole("button", { name: "Menú" });
    expect(boton).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(boton);

    expect(boton).toHaveAttribute("aria-expanded", "true");
  });
});