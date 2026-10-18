// Validaciones de formularios como funciones puras.
// Cada validador devuelve "" si es valido o el mensaje de error.

export const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

export function validarCorreo(correo) {
  const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
  if (!formatoValido) return "Ingresa un correo con formato válido.";

  const dominio = correo.split("@")[1]?.toLowerCase();
  if (!DOMINIOS_PERMITIDOS.includes(dominio)) {
    return "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
  }
  return "";
}

export function validarRun(run) {
  const limpio = run.trim().toUpperCase();

  if (limpio.length < 7 || limpio.length > 9) {
    return "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.";
  }
  if (!/^[0-9]+[0-9K]$/.test(limpio)) {
    return "El RUN solo debe contener números y, opcionalmente, K al final.";
  }

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  const resto = 11 - (suma % 11);
  const dvEsperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);

  return dv === dvEsperado ? "" : "El RUN ingresado no es válido (dígito verificador incorrecto).";
}

export function validarContrasena(contrasena) {
  if (contrasena.length < 4 || contrasena.length > 10) {
    return "La contraseña debe tener entre 4 y 10 caracteres.";
  }
  return "";
}

function validarTexto(valor, mensajeObligatorio, max, obligatorio = true) {
  const texto = (valor ?? "").trim();
  if (!texto) return obligatorio ? mensajeObligatorio : "";
  if (texto.length > max) return `Máximo ${max} caracteres.`;
  return "";
}

function validarCorreoCampo(valor, obligatorio = true) {
  const correo = (valor ?? "").trim();
  if (!correo) return obligatorio ? "El correo es obligatorio." : "";
  if (correo.length > 100) return "Máximo 100 caracteres.";
  return validarCorreo(correo);
}

// Agrega la clave solo cuando hay error, asi un objeto vacio significa "valido"
function reunir(campos) {
  const errores = {};
  Object.entries(campos).forEach(([clave, mensaje]) => {
    if (mensaje) errores[clave] = mensaje;
  });
  return errores;
}

export function validarLogin({ correo, contrasena }) {
  return reunir({
    correo: validarCorreoCampo(correo),
    contrasena: validarContrasena(contrasena ?? "")
  });
}

export function validarRegistro(datos) {
  return reunir({
    run: validarRun(datos.run ?? ""),
    nombre: validarTexto(datos.nombre, "El nombre es obligatorio.", 50),
    apellidos: validarTexto(datos.apellidos, "Los apellidos son obligatorios.", 100),
    correo: validarCorreoCampo(datos.correo),
    contrasena: validarContrasena(datos.contrasena ?? ""),
    confirmar:
      datos.confirmar !== datos.contrasena || !datos.confirmar
        ? "Las contraseñas no coinciden."
        : "",
    region: datos.region ? "" : "Selecciona una región.",
    comuna: datos.comuna ? "" : "Selecciona una comuna.",
    direccion: validarTexto(datos.direccion, "La dirección es obligatoria.", 300)
  });
}

export function validarContacto({ nombre, correo, comentario }) {
  return reunir({
    nombre: validarTexto(nombre, "El nombre es obligatorio.", 100),
    correo: validarCorreoCampo(correo),
    comentario: validarTexto(comentario, "El comentario es obligatorio.", 500)
  });
}

function validarEnteroNoNegativo(valor, obligatorio = true) {
  if (valor === "" || valor === null || valor === undefined) {
    return obligatorio ? "Debe ser un número entero mayor o igual a 0." : "";
  }
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 0) {
    return "Debe ser un número entero mayor o igual a 0.";
  }
  return "";
}

export function validarProducto(datos) {
  const precio = parseFloat(datos.precio);

  return reunir({
    codigo: (datos.codigo ?? "").trim().length < 3 ? "El código debe tener al menos 3 caracteres." : "",
    nombre: validarTexto(datos.nombre, "El nombre es obligatorio.", 100),
    descripcion: validarTexto(datos.descripcion, "", 500, false),
    precio: isNaN(precio) || precio < 0 ? "El precio debe ser un número mayor o igual a 0." : "",
    categoria: datos.categoria ? "" : "Selecciona una categoría.",
    stock: validarEnteroNoNegativo(datos.stock),
    stockCritico: validarEnteroNoNegativo(datos.stockCritico, false)
  });
}