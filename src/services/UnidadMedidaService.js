import { apiFetch } from "./Api";

// ======================
// 📌 LISTAR UNIDADES
// ======================
export const obtenerUnidadesMedida = async () => {
  try {
    return await apiFetch("/priv/unidad-medida");
  } catch (error) {
    throw getErrorMessage(error, "Error al obtener unidades de medida");
  }
};

// ======================
const getErrorMessage = (err, defaultMsg) => {
  if (!err) return defaultMsg;
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  return defaultMsg;
};