import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../App";
import Nosotros from "../pages/Nosotros";

describe("Nosotros", () => {
  it("muestra el título y las tres secciones de contenido", () => {
    render(<Nosotros />);

    expect(screen.getByRole("heading", { level: 1, name: "Nosotros" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "¿Quiénes somos?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Nuestra misión" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "El equipo" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("está disponible en la ruta /nosotros y no cae en la página 404", () => {
    render(
      <MemoryRouter initialEntries={["/nosotros"]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1, name: "Nosotros" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Página no encontrada" })).not.toBeInTheDocument();
  });
});