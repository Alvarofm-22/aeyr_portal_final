import { apiFetch } from "./Api";

export const loginUsuarioDB = async (username, password) => {
  if (!username?.trim() || !password) {
    throw new Error("Usuario y contraseña son requeridos");
  }

  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: {
      username: username.trim(),
      password,
    },
    auth: false, // 🔥 no necesita token
  });

  // 🔥 guardar sesión
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));

  return data;
};