import { useEffect, useState } from "react";
import { mensajeDeError } from "../services/api";

// Ejecuta una función asíncrona y entrega { datos, cargando, error }.
// Se vuelve a ejecutar cuando cambian las dependencias.
export function useCargar(cargar, dependencias) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: "" });

  useEffect(() => {
    let activo = true; // evita actualizar el estado si el componente ya se desmontó
    setEstado({ datos: null, cargando: true, error: "" });

    cargar()
      .then((datos) => {
        if (activo) setEstado({ datos, cargando: false, error: "" });
      })
      .catch((error) => {
        if (activo) setEstado({ datos: null, cargando: false, error: mensajeDeError(error) });
      });

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencias);

  return estado;
}