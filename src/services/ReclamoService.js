import { apiFetch } from "./Api";

export const obtenerReclamos = async () => {
  try {
    const data = await apiFetch("/priv/libro-reclamaciones");

    const reclamos = Array.isArray(data) ? data : data?.reclamos || [];

    return reclamos.map((r) => ({
      ...r,

      // Formateo de enums
      tipoLabel: formatEnum(r.tipo),
      estadoLabel: formatEnum(r.estado),
      monedaLabel: r.tipoMoneda === "SOLES" ? "Soles" : "Dólares",

      // Fecha ya lista (opcional)
      fechaFormateada: new Date(r.fechaRegistro).toLocaleDateString("es-PE"),
    }));

  } catch (error) {
    console.error("Error en reclamos:", error.message);
    return [];
  }
};

// Helper para enums
const formatEnum = (value) => {
  if (!value) return "-";
  return value
    .toLowerCase()
    .replace("_", " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};