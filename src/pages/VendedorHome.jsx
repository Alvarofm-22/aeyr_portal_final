import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../style/Home.css";

const VendedorHome = () => {
  const { user } = useAuth();

  const frases = [
    "Cada cliente cuenta.",
    "Convierte oportunidades en ventas.",
    "Tu esfuerzo genera resultados.",
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
          <span className="portal-tag">VENDEDOR PANEL</span>

          <h1 className="day-name">{nombreDia}</h1>

          <p className="date-text">
            {fecha.toLocaleDateString("es-PE", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          <div className="motivation-quote">
            <p>🧑‍💼 Hola, {user?.nombre}</p>
            <p>{quote}</p>
          </div>

          {/* 🔥 Zona vendedor */}
          <div className="seller-widgets">
            <p>📦 Registrar cotización</p>
            <p>📋 Ver clientes</p>
            <p>📈 Seguimiento de ventas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorHome;