// Filtra el catalogo por texto (nombre o descripcion corta) y por categoria
export function filtrarProductos(productos, { texto = "", categoria = "" } = {}) {
  const buscado = texto.trim().toLowerCase();

  return productos.filter((p) => {
    const coincideCategoria = !categoria || p.categoria === categoria;
    const coincideTexto =
      !buscado ||
      p.nombre.toLowerCase().includes(buscado) ||
      (p.descripcionCorta || "").toLowerCase().includes(buscado);
    return coincideCategoria && coincideTexto;
  });
}