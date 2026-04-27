import { apiFetch } from "./Api";

/* ===========================
   📦 PRODUCTOS SERVICE
   =========================== */

// ======================
// 📌 LISTAR TODOS
// ======================
export const obtenerProductos = async () => {
  try {
    return await apiFetch("/priv/productos");
  } catch (error) {
    throw getErrorMessage(error, "Error al obtener productos");
  }
};

// ======================
// 📌 LISTAR ACTIVOS
// ======================
export const obtenerProductosActivos = async () => {
  try {
    return await apiFetch("/priv/productos/activos");
  } catch (error) {
    throw getErrorMessage(error, "Error al obtener productos activos");
  }
};

// ======================
// 📌 OBTENER POR ID
// ======================
export const obtenerProductoPorId = async (id) => {
  try {
    return await apiFetch(`/priv/productos/${id}`);
  } catch (error) {
    throw getErrorMessage(error, "Error al obtener el producto");
  }
};

// ======================
// 📌 CREAR
// ======================
export const crearProducto = async (producto) => {
  try {
    return await apiFetch("/priv/productos", {
      method: "POST",
      body: producto, // ✅ objeto plano
    });
  } catch (error) {
    throw getErrorMessage(error, "Error al crear producto");
  }
};

// ======================
// 📌 ACTUALIZAR
// ======================
export const actualizarProducto = async (id, producto) => {
  try {
    return await apiFetch(`/priv/productos/${id}`, {
      method: "PUT",
      body: producto, // ✅ objeto plano
    });
  } catch (error) {
    throw getErrorMessage(error, "Error al actualizar producto");
  }
};

// ======================
// 📌 ELIMINAR (SOFT DELETE recomendado)
// ======================
export const eliminarProducto = async (id) => {
  try {
    return await apiFetch(`/priv/productos/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    throw getErrorMessage(error, "Error al eliminar producto");
  }
};

// ======================
// 📌 BUSCAR
// ======================
export const buscarProductos = async ({
  nombre = "",
  tipo = "",
  activo = "",
}) => {
  try {
    const params = new URLSearchParams();

    if (nombre) params.append("nombre", nombre);
    if (tipo) params.append("tipoProducto", tipo);
    if (activo !== "") params.append("activo", activo);

    return await apiFetch(`/priv/productos/buscar?${params.toString()}`);
  } catch (error) {
    throw getErrorMessage(error, "Error al buscar productos");
  }
};

// ======================
// ⚠️ MANEJO DE ERRORES
// ======================
const getErrorMessage = (err, defaultMsg) => {
  if (!err) return defaultMsg;

  if (typeof err === "string") return err;

  if (err.message) return err.message;

  if (err.error) return err.error;

  return defaultMsg;
};