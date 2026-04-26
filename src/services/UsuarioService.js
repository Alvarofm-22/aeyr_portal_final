import { apiFetch } from "./Api";

/* ===========================
   👤 USUARIOS
   =========================== */

// 📌 LISTAR USUARIOS
export const obtenerUsuarios = async () => {
  return await apiFetch("/priv/usuarios");
};

// 📌 BUSCAR USUARIOS (por username)
export const buscarUsuarios = async (texto) => {
  return await apiFetch(
    `/priv/usuarios/buscar?texto=${encodeURIComponent(texto)}`
  );
};

// 📌 CREAR USUARIO
export const crearUsuario = async (usuario) => {
  return await apiFetch("/priv/usuarios", {
    method: "POST",
    body: usuario,
  });
};

// 📌 CAMBIAR ESTADO (ACTIVO / INACTIVO)
export const cambiarEstadoUsuario = async (id, activo) => {
  return await apiFetch(`/priv/usuarios/${id}/estado?activo=${activo}`, {
    method: "PUT",
  });
};

// 📌 ELIMINAR USUARIO (opcional)
export const eliminarUsuario = async (id) => {
  return await apiFetch(`/priv/usuarios/${id}`, {
    method: "DELETE",
  });
};