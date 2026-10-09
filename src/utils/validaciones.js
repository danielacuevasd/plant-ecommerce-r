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