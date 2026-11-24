import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CampoFormulario from "../../components/CampoFormulario";
import { categorias } from "../../data/categorias";
import { useCargar } from "../../hooks/useCargar";
import { mensajeDeError } from "../../services/api";
import { actualizarProducto, crearProducto, obtenerProductoPorId } from "../../services/productosService";
import { validarProducto } from "../../utils/validaciones";

const vacio = {
  codigo: "", nombre: "", descripcion: "", precio: "", categoria: "",
  stock: "", stockCritico: "", imagen: ""
};

function FormularioProducto({ existente }) {
  const navegar = useNavigate();

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
  const [errorGeneral, setErrorGeneral] = useState("");
  const [enviando, setEnviando] = useState(false);

  function manejarCambio(evento) {
    setDatos({ ...datos, [evento.target.name]: evento.target.value });
  }

  async function manejarSubmit(evento) {
    evento.preventDefault();
    const nuevos = validarProducto(datos);
    setErrores(nuevos);
    setErrorGeneral("");
    if (Object.keys(nuevos).length > 0) return;

    const producto = {
      codigo: datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      descripcionCorta: datos.descripcion.trim().slice(0, 80),
      precio: parseInt(datos.precio, 10),
      categoria: datos.categoria,
      stock: parseInt(datos.stock, 10),
      imagen: datos.imagen.trim() || "/img/logo.png"
    };
    if (datos.stockCritico !== "") producto.stockCritico = parseInt(datos.stockCritico, 10);

    setEnviando(true);
    try {
      if (existente) await actualizarProducto(existente.id, producto);
      else await crearProducto(producto);
      navegar("/admin/productos");
    } catch (error) {
      setErrorGeneral(mensajeDeError(error));
      setEnviando(false);
    }
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
            id="precio" label="Precio" type="number" min="0" step="1"
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

        {errorGeneral && <p role="alert" className="mensaje-error">{errorGeneral}</p>}

        <button type="submit" className="btn-principal" disabled={enviando}>
          {enviando ? "Guardando..." : existente ? "Guardar cambios" : "Guardar producto"}
        </button>
      </form>
    </>
  );
}

export default function AdminProductoForm() {
  const { id } = useParams();
  const { datos: existente, cargando, error } = useCargar(
    () => (id ? obtenerProductoPorId(id) : Promise.resolve(null)),
    [id]
  );

  // Producto nuevo: no hay nada que cargar
  if (!id) return <FormularioProducto key="nuevo" existente={null} />;

  if (cargando) return <p role="status" className="texto-secundario">Cargando producto...</p>;
  if (error) return <p role="alert" className="mensaje-error">{error}</p>;
  if (!existente) return <h1>Producto no encontrado</h1>;

  return <FormularioProducto key={existente.id} existente={existente} />;
}