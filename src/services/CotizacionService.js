import { apiFetch } from "./Api";

export const guardarCotizacionDB = async (cotizacion) => {
  return await apiFetch("/cotizaciones", {
    method: "POST",
    body: cotizacion,
  });
};

export const obtenerCotizaciones = async () => {
  return await apiFetch("/priv/cotizaciones");
};

export const actualizarEstadoCotizacion = async (id, dto) => {
  await apiFetch(`/priv/cotizaciones/${id}`, {
    method: "PUT",
    body: dto,
  });
};

export const obtenerCotizacionPorId = async (id) => {
  return await apiFetch(`/priv/cotizaciones/${id}`);
};