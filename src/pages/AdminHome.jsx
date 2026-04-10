import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../style/Home.css";

const AdminHome = () => {
  const { user } = useAuth();

  const frases = [
    "Gestiona el sistema con eficiencia.",
    "Tienes control total del sistema.",
    "Supervisa y optimiza cada proceso.",
  ];

  const [quote] = useState(() =>
    frases[Math.floor(Math.random() * frases.length)]
  );

  const [fecha, setFecha] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setFecha(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const nombreDia = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"][fecha.getDay()];

  return (
    <div className="home-screen">
      <div className="hero-background"></div>

      <div className="home-content fade-in">
        <div>
          <span className="portal-tag">ADMIN PANEL</span>

          <h1 className="day-name">{nombreDia}</h1>

          <p className="date-text">
            {fecha.toLocaleDateString("es-PE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="motivation-quote">
            <p>👨‍💼 Bienvenido, {user?.nombre}</p>
            <p>{quote}</p>
          </div>

          {/* 🔥 Zona exclusiva ADMIN */}
          <div className="admin-widgets">
            <p>📊 Acceso a reportes</p>
            <p>👥 Gestión de usuarios</p>
            <p>⚙️ Configuración del sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;