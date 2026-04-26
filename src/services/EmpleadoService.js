import { apiFetch } from "./Api";

/* ===========================
   👤 EMPLEADOS / USUARIOS
   =========================== */

// 📌 LISTAR EMPLEADOS
export const obtenerEmpleados = async () => {
  return await apiFetch("/priv/empleados");
};

// 📌 BUSCAR POR NOMBRE O APELLIDO
export const buscarEmpleados = async (texto) => {
  return await apiFetch(`/priv/empleados/buscar?texto=${encodeURIComponent(texto)}`);
};

// 📌 CREAR EMPLEADO
export const crearEmpleado = async (empleado) => {
  return await apiFetch("/priv/empleados", {
    method: "POST",
    body: empleado,
  });
};

// 📌 ACTUALIZAR EMPLEADO
export const actualizarEmpleado = async (id, empleado) => {
  return await apiFetch(`/priv/empleados/${id}`, {
    method: "PUT",
    body: empleado,
  });
};