import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

// Por defecto ningún test llama a la API real: el catálogo llega vacío
vi.mock("./services/productosService", () => ({
  obtenerProductos: vi.fn(async () => []),
  obtenerProductoPorId: vi.fn(async () => null),
  crearProducto: vi.fn(),
  actualizarProducto: vi.fn(),
  eliminarProducto: vi.fn(),
  obtenerProductosStockCritico: vi.fn(async () => [])
}));

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});