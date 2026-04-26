import { apiFetch } from "./Api";

// ==========================
// LISTAR
// ==========================
export const obtenerReclamos = async () => {
  try {
    const data = await apiFetch("/priv/libro-reclamaciones");

    const reclamos = Array.isArray(data)
      ? data
      : data?.reclamos || [];

    return reclamos.map(mapReclamo);

  } catch (error) {
    console.error("Error en reclamos:", error.message);
    return [];
  }
};

// ==========================
// ACTUALIZAR (IGUAL QUE COTIZACIONES)
// ==========================
export const actualizarEstadoReclamo = async (id, dto) => {
  return await apiFetch(`/priv/libro-reclamaciones/${id}`, {
    method: "PUT",
    body: dto,
  });
};

// ==========================
// OBTENER POR ID
// ==========================
export const obtenerReclamoPorId = async (id) => {
  return await apiFetch(`/priv/libro-reclamaciones/${id}`);
};

// ==========================
// MAPPER
// ==========================
const mapReclamo = (r) => ({
  ...r,

  tipoLabel: formatEnum(r.tipo),
  estadoLabel: formatEnum(r.estado),

  monedaLabel:
    r.tipoMoneda === "SOLES" ? "Soles" : "Dólares",

  fechaFormateada: r.fechaRegistro
    ? new Date(r.fechaRegistro).toLocaleDateString("es-PE")
    : "-",
});

// ==========================
// HELPER
// ==========================
const formatEnum = (value) => {
  if (!value) return "-";
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};