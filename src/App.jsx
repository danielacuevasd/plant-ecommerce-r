import { Route, Routes } from "react-router-dom";
import StoreLayout from "./components/StoreLayout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import NoEncontrado from "./pages/NoEncontrado";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NoEncontrado />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}