import { apiFetch } from "./Api";

/* ===========================
   🛡️ ROLES
   =========================== */

// 📌 LISTAR ROLES
export const obtenerRoles = async () => {
  return await apiFetch("/priv/roles");
};

// 📌 BUSCAR ROLES
export const buscarRoles = async (texto) => {
  return await apiFetch(
    `/priv/roles/buscar?texto=${encodeURIComponent(texto)}`
  );
};

// 📌 CREAR ROL
export const crearRol = async (rol) => {
  /*
    rol:
    {
      nombre: "",
      descripcion: ""
    }
  */
  return await apiFetch("/priv/roles", {
    method: "POST",
    body: rol,
  });
};

// 📌 ACTUALIZAR ROL
export const actualizarRol = async (id, rol) => {
  return await apiFetch(`/priv/roles/${id}`, {
    method: "PUT",
    body: rol,
  });
};