import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  // 🔥 Redirección automática
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    if (!username.trim() || !password) return;

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="mb-8 text-center">
          <h1 className="login-title">Panel Administrativo</h1>
          <p className="login-subtitle">Acceso al sistema</p>
        </div>

        {error && (
          <div className="login-error mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="login-label">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="login-input"
              placeholder="Ingresa tu usuario"
            />
          </div>

          <div>
            <label className="login-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="login-input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        <p className="login-footer">
          © {new Date().getFullYear()} AE&R CONSTRUCCIONES
        </p>

      </div>
    </div>
  );
};

export default Login;