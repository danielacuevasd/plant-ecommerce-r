import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { rutaInicial } from "../utils/roles";

// Uso: <Route element={<RequiereRol roles={[ROLES.ADMIN]} />}> ...rutas... </Route>
export default function RequiereRol({ roles }) {
  const { sesion } = useAuth();

  if (!sesion) return <Navigate to="/login" replace />;
  if (!roles.includes(sesion.tipo)) return <Navigate to={rutaInicial(sesion.tipo)} replace />;

  return <Outlet />;
}