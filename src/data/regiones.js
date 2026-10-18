// Regiones y comunas disponibles para registro y direccion de entrega
export const regiones = [
  {
    nombre: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Ñuñoa"]
  },
  {
    nombre: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"]
  },
  {
    nombre: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Chillán"]
  },
  {
    nombre: "Región de la Araucanía",
    comunas: ["Temuco", "Villarrica", "Angol", "Pucón"]
  }
];

export function obtenerComunas(nombreRegion) {
  const region = regiones.find((r) => r.nombre === nombreRegion);
  return region ? region.comunas : [];
}