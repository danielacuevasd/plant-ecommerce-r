import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

// Renderiza un componente con router y contextos, como en la aplicacion real
export function renderConProveedores(ui, { ruta = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}