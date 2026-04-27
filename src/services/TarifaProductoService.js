import { apiFetch } from "./Api";

/* ===========================
   💰 TARIFAS PRODUCTO DISTRITO
   =========================== */

export const obtenerTarifas = async () => {
  return await apiFetch("/priv/tarifas");
};

export const obtenerCombosTarifa = async () => {
  return await apiFetch("/priv/tarifas/combos");
};

export const crearTarifa = async (tarifa) => {
  return await apiFetch("/priv/tarifas", {
    method: "POST",
    body: tarifa,
  });
};

export const actualizarTarifa = async (id, tarifa) => {
  return await apiFetch(`/priv/tarifas/${id}`, {
    method: "PUT",
    body: tarifa,
  });
};