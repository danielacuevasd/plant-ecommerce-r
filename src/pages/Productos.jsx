import { useMemo, useState } from "react";
import ProductList from "../components/ProductList";
import { useCart } from "../context/CartContext";
import { categorias } from "../data/categorias";
import { obtenerProductos } from "../data/db";
import { filtrarProductos } from "../utils/filtros";

export default function Productos() {
  const { agregar } = useCart();
  const [productos] = useState(obtenerProductos);
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("");

  const visibles = useMemo(
    () => filtrarProductos(productos, { texto, categoria }),
    [productos, texto, categoria]
  );

  return (
    <>
      <section className="encabezado-pagina">
        <h1>Productos</h1>
        <p>
          {visibles.length} {visibles.length === 1 ? "producto disponible" : "productos disponibles"}
        </p>
      </section>

      <section className="listado-productos">
        <form className="row g-2 mb-4" role="search" onSubmit={(e) => e.preventDefault()}>
          <div className="col-12 col-md-6">
            <label htmlFor="buscar" className="visually-hidden">Buscar producto</label>
            <input
              id="buscar"
              type="search"
              className="form-control"
              placeholder="Buscar por nombre"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label htmlFor="filtro-categoria" className="visually-hidden">Categoría</label>
            <select
              id="filtro-categoria"
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.valor} value={c.valor}>{c.nombre}</option>
              ))}
            </select>
          </div>
        </form>

        <ProductList productos={visibles} onAgregar={(id) => agregar(id, 1)} />
      </section>
    </>
  );
}