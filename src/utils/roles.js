// Roles del sistema y reglas de acceso del front.
// La seguridad real está en la API; esto decide qué ve cada usuario.

export const ROLES = {
  ADMIN: "Administrador",
  VENDEDOR: "Vendedor",
  CLIENTE: "Cliente"
};

// Quién puede entrar al panel de administración
export function puedeEntrarAlPanel(tipo) {
  return tipo === ROLES.ADMIN || tipo === ROLES.VENDEDOR;
}

// Primera pantalla de cada rol después de iniciar sesión
export function rutaInicial(tipo) {
  if (tipo === ROLES.ADMIN) return "/admin";
  if (tipo === ROLES.VENDEDOR) return "/admin/productos";
  return "/";
}