import { apiFetch } from "./Api";

export const obtenerDistritos = async () => {
  return await apiFetch("/public/distritos", {
    auth: false,
  });
};