const API_URL = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_URL}/api`;

const getHeaders = (auth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleAuthError = () => {
  localStorage.clear();
};

export const apiFetch = async (endpoint, options = {}) => {
  const { method = "GET", body, auth = true } = options;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: getHeaders(auth),
      body: body ? JSON.stringify(body) : undefined,
    });
    
    // 🔥 leer UNA SOLA VEZ
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError();
        throw new Error("Sesión expirada");
      }

      if (response.status === 403) {
        throw new Error("No tienes permisos");
      }

      throw new Error(data?.message || "Error en la petición");
    }

    return data;

  } catch (error) {
    console.error("API ERROR:", error.message);
    throw error;
  }
};