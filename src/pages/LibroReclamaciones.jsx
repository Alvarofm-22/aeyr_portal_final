import React, { useEffect, useState } from "react";
import { obtenerReclamos } from "../services/ReclamoService";
import ReclamoDetalle from "../componentes/ReclamoDetalle";
import "../style/LibroReclamaciones.css";

const Reclamaciones = () => {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reclamoSeleccionado, setReclamoSeleccionado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerReclamos();
        setReclamos(data);
      } catch {
        setError("No autorizado o error al cargar");
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // 🔥 Formatear ENUMS bonito
  const formatEnum = (value) => {
    if (!value) return "-";
    return value
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // 🔥 Clases dinámicas de estado
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "pendiente";
      case "ATENDIDO":
        return "atendido";
      case "RECHAZADO":
        return "rechazado";
      default:
        return "";
    }
  };

  if (loading) return <p className="center">Cargando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="reclam-container">
      <h1>📘 Libro de Reclamaciones</h1>
      <p className="subtitle">
        Selecciona un reclamo para ver el detalle
      </p>

      <div className="reclam-grid">
        {reclamos.map((r) => (
          <div
            key={r.id}
            className="reclam-card"
            onClick={() => setReclamoSeleccionado(r)}
          >
            <div className="card-header">
              <span className="caso">CASO #{r.numeroReclamo}</span>

              <span className={`estado ${getEstadoClass(r.estado)}`}>
                {formatEnum(r.estado)}
              </span>
            </div>

            <h3>{r.nombre}</h3>

            <p className="tipo">
              Tipo: {formatEnum(r.tipo)}
            </p>

            <small>
              {new Date(r.fechaRegistro).toLocaleDateString("es-PE")}
            </small>
          </div>
        ))}
      </div>

      {reclamoSeleccionado && (
        <ReclamoDetalle
          reclamo={reclamoSeleccionado}
          onClose={() => setReclamoSeleccionado(null)}
        />
      )}
    </div>
  );
};

export default Reclamaciones;