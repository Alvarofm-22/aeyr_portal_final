import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/BuscarCotizacion.css";

const BuscarCotizacion = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleBuscar = () => {
    if (!id) return alert("Ingresa un ID");
    navigate(`/cotizaciones/${id}`);
  };

  return (
    <div className="buscar-container">
      <h2>Buscar Cotización</h2>

      <input
        type="number"
        placeholder="Ingrese ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={handleBuscar}>Buscar</button>
    </div>
  );
};

export default BuscarCotizacion;