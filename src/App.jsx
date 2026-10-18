import { Route, Routes } from "react-router-dom";
import StoreLayout from "./components/StoreLayout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import NoEncontrado from "./pages/NoEncontrado";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Contacto from "./pages/Contacto";
import AdminLayout from "./components/AdminLayout";
import AdminInicio from "./pages/admin/AdminInicio";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<NoEncontrado />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/:id" element={<DetalleProducto />} />
            <Route path="carrito" element={<Carrito />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />
            <Route path="contacto" element={<Contacto />} />
          </Route>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminInicio />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}