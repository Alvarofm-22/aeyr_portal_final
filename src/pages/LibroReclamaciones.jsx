import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  obtenerReclamos,
  actualizarEstadoReclamo,
} from "../services/ReclamoService";
import "../style/LibroReclamaciones.css";
import "../style/reclamoDetalle.css"

const Reclamaciones = () => {
  const [reclamos, setReclamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState("TODOS");

  const ESTADOS = {
    PENDIENTE: 7,
    EN_PROCESO: 8,
    ATENDIDO: 9,
    RECHAZADO: 10,
    CERRADO: 11,
  };

  const TRANSICIONES = {
    PENDIENTE: ["EN_PROCESO", "RECHAZADO"],
    EN_PROCESO: ["ATENDIDO", "RECHAZADO"],
    ATENDIDO: ["CERRADO"],
    RECHAZADO: ["PENDIENTE"],
    CERRADO: [],
  };

  const puedeCambiar = (actual, destino) => {
    return TRANSICIONES[actual]?.includes(destino);
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obtenerReclamos();
      setReclamos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el libro de reclamaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const contadores = reclamos.reduce(
    (acc, r) => {
      acc.TODOS++;
      acc[r.estado] = (acc[r.estado] || 0) + 1;
      return acc;
    },
    { TODOS: 0 }
  );

  const reclamosFiltrados =
    filtro === "TODOS"
      ? reclamos
      : reclamos.filter((r) => r.estado === filtro);

  const formatEnum = (value) => {
    if (!value) return "-";
    return value
      .toLowerCase()
      .replaceAll("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "estado-pendiente";
      case "EN_PROCESO":
        return "estado-proceso";
      case "ATENDIDO":
        return "estado-respondido";
      case "CERRADO":
        return "estado-cerrado";
      case "RECHAZADO":
        return "estado-rechazado";
      default:
        return "";
    }
  };

  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoReclamo(id, {
        id: ESTADOS[nuevoEstado], // ✅ CORRECTO
      });

      setReclamos((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, estado: nuevoEstado } : r
        )
      );

      if (seleccionado?.id === id) {
        setSeleccionado((prev) => ({ ...prev, estado: nuevoEstado }));
      }

    } catch (err) {
      console.error(err);
      alert(err.message || "Este cambio de estado no está permitido");
    }
  };

  if (loading) return <div className="loading-state">Cargando reclamos...</div>;

  if (error) {
    return (
      <div className="error-state">
        {error}
        <button onClick={cargarDatos}>Reintentar</button>
      </div>
    );
  }

  const acciones = [
    { label: "Procesar", estado: "EN_PROCESO", className: "btn-proceso" },
    { label: "Atender", estado: "ATENDIDO", className: "btn-respondido" },
    { label: "Cerrar", estado: "CERRADO", className: "btn-cerrar" },
    { label: "Rechazar", estado: "RECHAZADO", className: "btn-rechazar" },
  ];


  

  return (
    <div className="page-container">
      <motion.div
        className="glass-card notif-width"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header>
          <h1 className="title-accent">Libro de Reclamaciones</h1>
          <p className="subtitle-light">Gestión de estados en tiempo real</p>
        </header>

        <div className="filter-tabs">
          <button
            className={`tab ${filtro === "TODOS" ? "active" : ""}`}
            onClick={() => setFiltro("TODOS")}
          >
            📊 Todos ({contadores.TODOS || 0})
          </button>

          <button
            className={`tab ${filtro === "PENDIENTE" ? "active" : ""}`}
            onClick={() => setFiltro("PENDIENTE")}
          >
            🟡 Pendientes ({contadores.PENDIENTE || 0})
          </button>

          <button
            className={`tab ${filtro === "EN_PROCESO" ? "active" : ""}`}
            onClick={() => setFiltro("EN_PROCESO")}
          >
            🔵 En proceso ({contadores.EN_PROCESO || 0})
          </button>

          <button
            className={`tab ${filtro === "ATENDIDO" ? "active" : ""}`}
            onClick={() => setFiltro("ATENDIDO")}
          >
            🟢 Atendidos ({contadores.ATENDIDO || 0})
          </button>

          <button
            className={`tab ${filtro === "CERRADO" ? "active" : ""}`}
            onClick={() => setFiltro("CERRADO")}
          >
            ⚪ Cerrados ({contadores.CERRADO || 0})
          </button>

          <button
            className={`tab ${filtro === "RECHAZADO" ? "active" : ""}`}
            onClick={() => setFiltro("RECHAZADO")}
          >
            🔴 Rechazados ({contadores.RECHAZADO || 0})
          </button>
        </div>

        <div className="notif-list-wrapper">
          {reclamosFiltrados.map((r) => (
            <div
              key={r.id}
              className={`quote-item-card ${r.estado?.toLowerCase()}`}
              onClick={() => setSeleccionado(r)}
            >
              <div className="quote-summary-bar">
                <div className="quote-main-info">
                  <span className="quote-proj-name">
                    CASO #{r.numeroReclamo}
                  </span>
                  <span className="quote-reg-date">
                    📅{" "}
                    {r.fechaRegistro
                      ? new Date(r.fechaRegistro).toLocaleString("es-PE")
                      : "Sin fecha"}
                  </span>
                </div>

                <div className="status-group">
                  <span className={`status-pill ${getEstadoClass(r.estado)}`}>
                    {formatEnum(r.estado)}
                  </span>
                </div>
              </div>

              <div className="reclamo-mini-info">
                <p><strong>Cliente:</strong> {r.nombre}</p>
                <p><strong>Tipo:</strong> {formatEnum(r.tipo)}</p>
                <p><strong>Correo:</strong> {r.email}</p>
              </div>

              <div className="reclamo-actions">
                {acciones.map((accion) => (
                  <button
                    key={accion.estado}
                    className={`btn-s ${accion.className}`}
                    disabled={!puedeCambiar(r.estado, accion.estado)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(r.id, accion.estado);
                    }}
                  >
                    {accion.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {reclamosFiltrados.length === 0 && (
            <div className="no-data">No hay resultados para este filtro</div>
          )}
        </div>

          {seleccionado && (
            <div className="modal-overlay" onClick={() => setSeleccionado(null)}>
              <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
              >
                {/* HEADER */}
                <div className="modal-header">
                  <div>
                    <h2>Detalle del Reclamo</h2>
                    <span className="caso-id">
                      CASO #{seleccionado.numeroReclamo}
                    </span>
                  </div>

                  <button
                    className="close-btn"
                    onClick={() => setSeleccionado(null)}
                  >
                    ✕
                  </button>
                </div>

                {/* BODY */}
                <div className="modal-body">

                  {/* CLIENTE */}
                  <div className="info-card">
                    <h4>Cliente</h4>

                    <div className="info-grid">
                      <div className="info-item">
                        <span>Nombre</span>
                        <strong>{seleccionado.nombre}</strong>
                      </div>

                      <div className="info-item">
                        <span>Documento</span>
                        <strong>
                          {seleccionado.tipoDocumento} - {seleccionado.documento}
                        </strong>
                      </div>

                      <div className="info-item">
                        <span>Email</span>
                        <strong>{seleccionado.email}</strong>
                      </div>

                      <div className="info-item">
                        <span>Teléfono</span>
                        <strong>{seleccionado.telefono}</strong>
                      </div>
                    </div>
                  </div>

                  {/* RECLAMO */}
                  <div className="info-card">
                    <h4>Reclamo</h4>

                    <div className="info-grid">
                      <div className="info-item">
                        <span>Tipo</span>
                        <strong>{formatEnum(seleccionado.tipo)}</strong>
                      </div>

                      <div className="info-item">
                        <span>Estado</span>
                        <strong>{formatEnum(seleccionado.estado)}</strong>
                      </div>

                      <div className="info-item">
                        <span>Moneda</span>
                        <strong>{seleccionado.tipoMoneda}</strong>
                      </div>

                      <div className="info-item">
                        <span>Monto</span>
                        <strong>{seleccionado.montoReclamado}</strong>
                      </div>
                    </div>
                  </div>

                  {/* DESCRIPCIÓN */}
                  <div className="info-card">
                    <h4>Descripción</h4>
                    <p className="text-block">
                      {seleccionado.descripcionBien}
                    </p>
                  </div>

                  {/* DETALLE */}
                  <div className="info-card">
                    <h4>Detalle</h4>
                    <p className="text-block">
                      {seleccionado.detalle}
                    </p>
                  </div>

                  {/* PEDIDO */}
                  <div className="info-card">
                    <h4>Pedido del cliente</h4>
                    <p className="text-block">
                      {seleccionado.pedido}
                    </p>
                  </div>

                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                  <button
                    className="btn-secondary"
                    onClick={() => setSeleccionado(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

      </motion.div>
    </div>
  );
};

export default Reclamaciones;