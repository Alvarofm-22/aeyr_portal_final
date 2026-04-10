import { createContext, useContext, useEffect, useState } from "react";
import { loginUsuarioDB } from "../services/AuthService";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("user");
    if (!stored || stored === "undefined") return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 🔥 clave
  const [error, setError] = useState(null);

  // 🔥 INIT APP
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loginUsuarioDB(username, password);

      // 🔥 MAPEO DEL BACKEND
      const userData = {
        id: data.id,
        username: data.username,
        rol: data.rol,
        nombre: data.nombresEmpleado,
        isActive: data.isActive,
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(data.token);
      setUser(userData);
      setIsAuthenticated(true);

    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
        isLoading,
        error,
        user,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);