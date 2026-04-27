import { apiFetch } from "./Api";

// ======================
// 📌 LISTAR TIPOS PRODUCTO
// ======================
export const obtenerTiposProducto = async () => {
  try {
    return await apiFetch("/priv/tipo-producto");
  } catch (error) {
    throw getErrorMessage(error, "Error al obtener tipos de producto");
  }
};

// ======================
// ⚠️ ERROR HANDLER
// ======================
const getErrorMessage = (err, defaultMsg) => {
  if (!err) return defaultMsg;
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  return defaultMsg;
};