// Formatea un numero como precio en pesos chilenos (separador de miles con punto).
// Se evita toLocaleString para que el resultado sea igual en cualquier entorno.
export function formatearPrecio(valor) {
  const entero = String(Math.round(valor));
  return "$" + entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}