import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../App";

describe("App", () => {
  it("muestra la portada de la tienda en la ruta inicial", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Naturaleza para tu espacio" })).toBeInTheDocument();
  });

  it("muestra la página 404 en una ruta que no existe", () => {
    render(
      <MemoryRouter initialEntries={["/ruta-inexistente"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
  });
});