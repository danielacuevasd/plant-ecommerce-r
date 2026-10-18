import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import CampoFormulario from "../components/CampoFormulario";

describe("CampoFormulario", () => {
  it("asocia la etiqueta con el campo", () => {
    render(<CampoFormulario id="nombre" label="Nombre" value="" onChange={() => {}} />);

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("muestra el error solo cuando se recibe por props (renderizado condicional)", () => {
    const { rerender } = render(<CampoFormulario id="correo" label="Correo" value="" onChange={() => {}} />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Correo")).not.toHaveAttribute("aria-invalid");

    rerender(<CampoFormulario id="correo" label="Correo" value="" onChange={() => {}} error="Correo inválido" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Correo inválido");
    expect(screen.getByLabelText("Correo")).toHaveAttribute("aria-invalid", "true");
  });

  it("llama a onChange al escribir (eventos)", async () => {
    const onChange = vi.fn();
    render(<CampoFormulario id="nombre" label="Nombre" value="" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText("Nombre"), "Ana");

    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("puede renderizarse como select con opciones", () => {
    render(
      <CampoFormulario id="region" label="Región" as="select" value="" onChange={() => {}}>
        <option value="">-- Seleccione --</option>
        <option value="a">A</option>
      </CampoFormulario>
    );

    expect(screen.getByLabelText("Región").tagName).toBe("SELECT");
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });
});