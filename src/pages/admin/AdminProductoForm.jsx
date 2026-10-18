import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { categorias } from "../../data/categorias";
import { actualizarProducto, crearProducto, obtenerProductoPorId } from "../../data/db";
import { validarProducto } from "../../utils/validaciones";

const vacio = {
  codigo: "", nombre: "", descripcion: "", precio: "", categoria: "",
  stock: "", stockCritico: "", imagen: ""
};

export default function AdminProductoForm() {
  const { id } = useParams();
  const navegar = useNavigate();
  const existente = id ? obtenerProductoPorId(id) : null;

  const [datos, setDatos] = useState(() =>
    existente
      ? {
          codigo: existente.codigo,
          nombre: existente.nombre,
          descripcion: existente.descripcion || "",
          precio: String(existente.precio),
          categoria: existente.categoria,
          stock: String(existente.stock),
          stockCritico: String(existente.stockCritico ?? ""),
          imagen: existente.imagen || ""
        }
      : vacio
  );
  const [errores, setErrores] = useState({});

  if (id && !existente) {
    return <h1>Producto no encontrado</h1>;
  }

  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  function manejarSubmit(evento) {
    evento.preventDefault();
    const nuevos = validarProducto(datos);
    setErrores(nuevos);
    if (Object.keys(nuevos).length > 0) return;

    const producto = {
      codigo: datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      descripcionCorta: datos.descripcion.trim().slice(0, 80),
      precio: parseFloat(datos.precio),
      categoria: datos.categoria,
      stock: parseInt(datos.stock, 10),
      imagen: datos.imagen.trim() || "/img/logo.png"
    };
    if (datos.stockCritico !== "") producto.stockCritico = parseInt(datos.stockCritico, 10);

    if (existente) actualizarProducto(existente.id, producto);
    else crearProducto(producto);

    navegar("/admin/productos");
  }

  return (
    <>
      <h1>{existente ? "Editar producto" : "Nuevo producto"}</h1>

      <form className="tarjeta-formulario" style={{ maxWidth: 560, marginTop: "1.5rem" }} onSubmit={manejarSubmit} noValidate>
        <CampoFormulario
          id="codigo" label="Código producto" placeholder="Ej: PL-009"
          value={datos.codigo} onChange={manejarCambio} error={errores.codigo}
        />
        <CampoFormulario
          id="nombre" label="Nombre" maxLength={100}
          value={datos.nombre} onChange={manejarCambio} error={errores.nombre}
        />
        <CampoFormulario
          id="descripcion" label="Descripción (opcional)" as="textarea" rows={4} maxLength={500}
          value={datos.descripcion} onChange={manejarCambio} error={errores.descripcion}
        />

        <div className="campo-formulario-doble">
          <CampoFormulario
            id="precio" label="Precio" type="number" min="0" step="0.01"
            value={datos.precio} onChange={manejarCambio} error={errores.precio}
          />
          <CampoFormulario
            id="categoria" label="Categoría" as="select"
            value={datos.categoria} onChange={manejarCambio} error={errores.categoria}
          >
            <option value="">-- Seleccione categoría --</option>
            {categorias.map((c) => <option key={c.valor} value={c.valor}>{c.nombre}</option>)}
          </CampoFormulario>
        </div>

        <div className="campo-formulario-doble">
          <CampoFormulario
            id="stock" label="Stock" type="number" min="0" step="1"
            value={datos.stock} onChange={manejarCambio} error={errores.stock}
          />
          <CampoFormulario
            id="stockCritico" label="Stock crítico (opcional)" type="number" min="0" step="1"
            value={datos.stockCritico} onChange={manejarCambio} error={errores.stockCritico}
          />
        </div>

        <CampoFormulario
          id="imagen" label="Imagen (opcional)" placeholder="/img/nombre-archivo.jpg"
          value={datos.imagen} onChange={manejarCambio}
        />

        <button type="submit" className="btn-principal">
          {existente ? "Guardar cambios" : "Guardar producto"}
        </button>
      </form>
    </>
  );
}