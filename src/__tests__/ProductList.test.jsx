import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProductList from "../components/ProductList";
import { productosPrueba } from "./productosPrueba";
import { renderConProveedores } from "./utils";

describe("ProductList", () => {
  it("renderiza una tarjeta por cada producto del conjunto de datos", () => {
    renderConProveedores(<ProductList productos={productosPrueba} onAgregar={() => {}} />);

    expect(screen.getAllByRole("article")).toHaveLength(productosPrueba.length);
    expect(screen.getByText("Lavanda")).toBeInTheDocument();
  });

  it("muestra un mensaje solo cuando la lista está vacía", () => {
    renderConProveedores(<ProductList productos={[]} onAgregar={() => {}} />);

    expect(screen.getByText(/no hay productos que coincidan/i)).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});