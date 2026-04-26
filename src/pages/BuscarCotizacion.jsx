import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerCotizacionPorNumero } from "../services/CotizacionService";
import "../style/BuscarCotizacion.css";

const BuscarCotizacion = () => {
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleBuscar = async () => {
    if (!numero) return;

    setLoading(true);
    setError(false);

    const limpio = numero.trim().toUpperCase();

    try {
      await obtenerCotizacionPorNumero(limpio);

      // ✅ SI EXISTE → navega
      navigate(`/cotizaciones/numero/${encodeURIComponent(limpio)}`);
    } catch (e) {
      // ❌ SI NO EXISTE → muestra UI bonita
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buscar-container">
      <h2>Buscar Cotización</h2>
      <p>Ingresa el código para consultar tu cotización</p>

      <div className="input-group">
        <input
          type="text"
          placeholder="COT-20260423-LIM-XXXX"
          value={numero}
          onChange={(e) => {
            setNumero(e.target.value.toUpperCase());
            setError(false); // 🔥 limpia error al escribir
          }}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
          className={error ? "input-error" : ""}
        />
      </div>

      <button onClick={handleBuscar} disabled={loading}>
        {loading ? <span className="spinner"></span> : "Buscar"}
      </button>

      {/* 🔥 MENSAJE PRO */}
      {error && (
        <div className="error-box">
          <span className="error-icon">⚠️</span>
          <div>
            <strong>No encontramos esa cotización</strong>
            <p>Verifica el código e intenta nuevamente</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuscarCotizacion;