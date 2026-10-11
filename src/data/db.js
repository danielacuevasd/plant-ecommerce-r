// Fuente de datos simulada (reemplaza a una base de datos en EP2).
// Los datos viven en localStorage y se inicializan con los datos semilla.

export const CLAVES = {
  productos: "florae_productos",
  usuarios: "florae_usuarios"
};

export const productosSemilla = [
  {
    id: 1, codigo: "PL-001", nombre: "Monstera Deliciosa", categoria: "interior",
    precio: 18990, stock: 12, stockCritico: 3,
    descripcionCorta: "Planta de interior de hojas grandes y recortadas.",
    descripcion: "La Monstera Deliciosa es una de las plantas de interior más populares por sus hojas grandes con recortes característicos. Prefiere luz indirecta y riego moderado, ideal para espacios luminosos sin sol directo.",
    imagen: "/img/monstera.jpg"
  },
  {
    id: 2, codigo: "PL-002", nombre: "Potus Verde", categoria: "interior",
    precio: 8990, stock: 20, stockCritico: 5,
    descripcionCorta: "Planta colgante de fácil cuidado, ideal para principiantes.",
    descripcion: "El Potus es una planta trepadora o colgante muy resistente, perfecta para quienes recién comienzan en el mundo de las plantas. Tolera baja luminosidad y riego espaciado.",
    imagen: "/img/potus.jpg"
  },
  {
    id: 3, codigo: "PL-003", nombre: "Calathea Orbifolia", categoria: "interior",
    precio: 14990, stock: 3, stockCritico: 3,
    descripcionCorta: "Hojas redondeadas con líneas plateadas, apta para mascotas.",
    descripcion: "La Calathea Orbifolia destaca por sus hojas redondeadas con vetas plateadas. Necesita humedad ambiental y luz indirecta. Es una planta no tóxica, apta para hogares con mascotas.",
    imagen: "/img/calathea.jpg"
  },
  {
    id: 4, codigo: "PL-004", nombre: "Lavanda", categoria: "exterior",
    precio: 6990, stock: 15, stockCritico: 4,
    descripcionCorta: "Arbusto aromático de exterior, ideal para jardines soleados.",
    descripcion: "La lavanda es un arbusto perenne muy aromático, perfecto para jardines exteriores con buena exposición solar. Atrae polinizadores y requiere riego escaso una vez establecida.",
    imagen: "/img/lavanda.jpg"
  },
  {
    id: 5, codigo: "PL-005", nombre: "Suculenta Echeveria", categoria: "exterior",
    precio: 4990, stock: 30, stockCritico: 8,
    descripcionCorta: "Suculenta de bajo mantenimiento, ideal para principiantes.",
    descripcion: "La Echeveria es una suculenta de roseta compacta, ideal para espacios con mucha luz. Requiere riego muy espaciado y es perfecta para quienes buscan plantas de bajo mantenimiento.",
    imagen: "/img/echeveria.jpg"
  },
  {
    id: 6, codigo: "MC-001", nombre: "Maceta Cerámica Blanca", categoria: "macetas",
    precio: 9990, stock: 25, stockCritico: 5,
    descripcionCorta: "Maceta de cerámica con plato incluido, 20 cm de diámetro.",
    descripcion: "Maceta de cerámica esmaltada color blanco, con orificio de drenaje y plato incluido. Diámetro de 20 cm, ideal para plantas de interior medianas.",
    imagen: "/img/maceta-blanca.jpg"
  },
  {
    id: 7, codigo: "SU-001", nombre: "Sustrato Universal 5L", categoria: "sustratos",
    precio: 5990, stock: 40, stockCritico: 10,
    descripcionCorta: "Mezcla de tierra apta para la mayoría de las plantas de interior.",
    descripcion: "Sustrato universal balanceado, apto para el trasplante de la mayoría de las plantas de interior y exterior. Presentación de 5 litros.",
    imagen: "/img/sustrato.jpg"
  },
  {
    id: 8, codigo: "HT-001", nombre: "Set de Herramientas de Jardín", categoria: "herramientas",
    precio: 12990, stock: 10, stockCritico: 2,
    descripcionCorta: "Set de 3 piezas: pala, rastrillo y tijera de podar.",
    descripcion: "Set de herramientas básicas de jardinería en acero inoxidable con mango ergonómico: pala de trasplante, rastrillo de mano y tijera de podar.",
    imagen: "/img/herramientas.jpg"
  }
];

// Los RUN semilla tienen dígito verificador válido
export const usuariosSemilla = [
  {
    id: 1, run: "191102207", nombre: "Camila", apellidos: "Reyes Soto",
    correo: "camila.reyes@gmail.com", contrasena: "cliente", tipo: "Cliente",
    region: "Región Metropolitana de Santiago", comuna: "Santiago",
    direccion: "Av. Siempre Viva 123, Santiago"
  },
  {
    id: 2, run: "128374655", nombre: "Matías", apellidos: "Fuentes Lara",
    correo: "matias.fuentes@duoc.cl", contrasena: "vendedor", tipo: "Vendedor",
    region: "Región de Valparaíso", comuna: "Viña del Mar",
    direccion: "Calle Los Aromos 456, Viña del Mar"
  },
  {
    id: 3, run: "175293841", nombre: "Marcelo", apellidos: "Cáceres",
    correo: "marcelo.caceres@profesor.duoc.cl", contrasena: "admin", tipo: "Administrador",
    region: "Región Metropolitana de Santiago", comuna: "Ñuñoa",
    direccion: "Pasaje Las Flores 789, Ñuñoa"
  }
];

// Utilidades internas de persistencia

function copiar(datos) {
  return JSON.parse(JSON.stringify(datos));
}

function leer(clave, semilla) {
  try {
    const guardado = localStorage.getItem(clave);
    if (guardado) return JSON.parse(guardado);
  } catch {
    // Si el dato esta corrupto se vuelve a la semilla
  }
  escribir(clave, semilla);
  return copiar(semilla);
}

function escribir(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

function siguienteId(lista) {
  return lista.length ? Math.max(...lista.map((e) => e.id)) + 1 : 1;
}

// CRUD de productos

export function obtenerProductos() {
  return leer(CLAVES.productos, productosSemilla);
}

export function obtenerProductoPorId(id) {
  return obtenerProductos().find((p) => p.id === Number(id)) || null;
}

export function crearProducto(datos) {
  const productos = obtenerProductos();
  const nuevo = {
    descripcionCorta: (datos.descripcion || "").slice(0, 80),
    imagen: "/img/logo.png",
    stockCritico: 0,
    ...datos,
    id: siguienteId(productos)
  };
  escribir(CLAVES.productos, [...productos, nuevo]);
  return nuevo;
}

export function actualizarProducto(id, cambios) {
  const productos = obtenerProductos();
  const indice = productos.findIndex((p) => p.id === Number(id));
  if (indice === -1) return null;
  productos[indice] = { ...productos[indice], ...cambios, id: productos[indice].id };
  escribir(CLAVES.productos, productos);
  return productos[indice];
}

export function eliminarProducto(id) {
  const productos = obtenerProductos();
  const restantes = productos.filter((p) => p.id !== Number(id));
  escribir(CLAVES.productos, restantes);
  return restantes.length !== productos.length;
}

export function obtenerProductosStockCritico() {
  return obtenerProductos().filter((p) => p.stock <= p.stockCritico);
}

// CRUD de usuarios

export function obtenerUsuarios() {
  return leer(CLAVES.usuarios, usuariosSemilla);
}

export function obtenerUsuarioPorId(id) {
  return obtenerUsuarios().find((u) => u.id === Number(id)) || null;
}

export function existeCorreo(correo, idExcluido = null) {
  const buscado = correo.trim().toLowerCase();
  return obtenerUsuarios().some(
    (u) => u.correo.toLowerCase() === buscado && u.id !== Number(idExcluido)
  );
}

export function crearUsuario(datos) {
  const usuarios = obtenerUsuarios();
  const nuevo = { tipo: "Cliente", ...datos, id: siguienteId(usuarios) };
  escribir(CLAVES.usuarios, [...usuarios, nuevo]);
  return nuevo;
}

export function actualizarUsuario(id, cambios) {
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex((u) => u.id === Number(id));
  if (indice === -1) return null;
  usuarios[indice] = { ...usuarios[indice], ...cambios, id: usuarios[indice].id };
  escribir(CLAVES.usuarios, usuarios);
  return usuarios[indice];
}

export function eliminarUsuario(id) {
  const usuarios = obtenerUsuarios();
  const restantes = usuarios.filter((u) => u.id !== Number(id));
  escribir(CLAVES.usuarios, restantes);
  return restantes.length !== usuarios.length;
}

// Autenticacion simulada: compara correo y contrasena contra los usuarios guardados
export function autenticarUsuario(correo, contrasena) {
  const buscado = correo.trim().toLowerCase();
  const usuario = obtenerUsuarios().find(
    (u) => u.correo.toLowerCase() === buscado && u.contrasena === contrasena
  );
  return usuario || null;
}