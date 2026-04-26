import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../style/NotCotizacion.css';

import {
  obtenerCotizaciones,
  actualizarEstadoCotizacion
} from '../services/CotizacionService';

const NotCotizacion = () => {
  const [pedidos, setPedidos] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 NUEVO
  const [filtro, setFiltro] = useState("TODOS");

  const ESTADOS = {
    PENDIENTE: 1,
    EN_PROCESO: 2,
    ENVIADA: 3,
    APROBADA: 4,
    RECHAZADA: 5,
    CERRADA: 6
  };

  const TRANSICIONES = {
    PENDIENTE: ['EN_PROCESO', 'RECHAZADA'],
    EN_PROCESO: ['ENVIADA', 'RECHAZADA'],
    ENVIADA: ['APROBADA', 'RECHAZADA'],
    APROBADA: ['CERRADA'],
    RECHAZADA: ['PENDIENTE'],
    CERRADA: []
  };

  const puedeCambiar = (actual, destino) => {
    return TRANSICIONES[actual]?.includes(destino);
  };

  // ==============================
  // Carga de Datos
  // ==============================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await obtenerCotizaciones();
      setPedidos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar las cotizaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // ==============================
  // FILTROS + CONTADORES 🔥
  // ==============================
  const contadores = pedidos.reduce((acc, p) => {
    acc.TODOS++;
    acc[p.tipoCotizacion] = (acc[p.tipoCotizacion] || 0) + 1;
    return acc;
  }, { TODOS: 0 });

  const pedidosFiltrados =
    filtro === "TODOS"
      ? pedidos
      : pedidos.filter(p => p.tipoCotizacion === filtro);

  // ==============================
  // Actualizar Estado
  // ==============================
  const handleStatusChange = async (id, nuevoEstado) => {
    try {
      await actualizarEstadoCotizacion(id, {
        id: ESTADOS[nuevoEstado]
      });

      setPedidos(prev =>
        prev.map(p =>
          p.id === id ? { ...p, estado: nuevoEstado } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Este cambio de estado no está permitido");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <div className="loading-state">Cargando bandeja...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        {error}
        <button onClick={cargarDatos}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        className="glass-card notif-width"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <header>
          <h1 className="title-accent">Bandeja de Cotizaciones</h1>
          <p className="subtitle-light">
            Gestión en tiempo real
          </p>
        </header>

        {/* 🔥 FILTROS */}
        <div className="filter-tabs">
          <button
            className={`tab ${filtro === "TODOS" ? "active" : ""}`}
            onClick={() => setFiltro("TODOS")}
          >
            📊 Todos ({contadores.TODOS || 0})
          </button>

          <button
            className={`tab suministro ${filtro === "SUMINISTRO" ? "active" : ""}`}
            onClick={() => setFiltro("SUMINISTRO")}
          >
            🧱 Suministro ({contadores.SUMINISTRO || 0})
          </button>

          <button
            className={`tab instalacion ${filtro === "INSTALACION" ? "active" : ""}`}
            onClick={() => setFiltro("INSTALACION")}
          >
            🔧 Instalación ({contadores.INSTALACION || 0})
          </button>
        </div>

        <div className="notif-list-wrapper">
          {pedidosFiltrados.map((p) => {

            const acciones = [
              { label: 'Procesar', estado: 'EN_PROCESO', class: 'p-btn' },
              { label: 'Enviar', estado: 'ENVIADA', class: 'e-btn' },
              { label: 'Aprobar', estado: 'APROBADA', class: 'a-btn' },
              { label: 'Rechazar', estado: 'RECHAZADA', class: 'r-btn' },
              { label: 'Cerrar', estado: 'CERRADA', class: 'c-btn' }
            ];

            return (
              <div
                key={p.id}
                className={`quote-item-card ${p.estado?.toLowerCase()} ${expandedId === p.id ? 'active' : ''}`}
              >
                {/* RESUMEN */}
                <div className="quote-summary-bar" onClick={() => toggleExpand(p.id)}>
                  <div className="quote-main-info">

                    <div className="quote-header-main">
                      <span className="quote-code">
                        {p.numeroCotizacion || "COT-SIN-CODIGO"}
                      </span>

                      <span className="quote-proj-name">
                        {p.nombreProyecto || "SIN TÍTULO"}
                      </span>
                    </div>

                    <span className="quote-reg-date">
                      📅 {p.fechaRegistro
                        ? new Date(p.fechaRegistro).toLocaleString()
                        : 'Sin fecha'}
                    </span>
                  </div>

                  <div className="status-group">

                    {/* 🔥 TIPO CON ICONO */}
                    <span className={`type-pill ${p.tipoCotizacion?.toLowerCase()}`}>
                      {p.tipoCotizacion === "SUMINISTRO" && "🧱 Suministro"}
                      {p.tipoCotizacion === "INSTALACION" && "🔧 Instalación"}
                    </span>

                    {/* ESTADO */}
                    <span className={`status-pill ${p.estado?.toLowerCase()}`}>
                      {p.estado}
                    </span>

                  </div>
                </div>

                {/* DETALLE */}
                {expandedId === p.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                  >
                    <div className="details-layout">

                      <section className="detail-box">
                        <h4>📍 Información</h4>
                        <p><strong>Doc:</strong> {p.tipoDocumento}</p>
                        <p><strong>RUC/DNI:</strong> {p.rucDni}</p>
                        <p><strong>Email:</strong> {p.email}</p>
                        <p><strong>Dirección:</strong> {p.direccion}</p>
                        <p><strong>Distrito:</strong> {p.distritoNombre}</p>
                      </section>

                      <section className="detail-box">
                        <h4>🧱 Materiales</h4>
                        <table className="mini-table">
                          <tbody>
                            {p.items?.length > 0 ? (
                              p.items.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.cantidad}</td>
                                  <td>{item.unidad}</td>
                                  <td>{item.productoNombre}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td>Sin materiales</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </section>

                      <section className="detail-box total-box">
                        <h4>💰 Totales</h4>
                        <div className="price-line">
                          <span>Subtotal</span>
                          <span>S/ {p.subtotal?.toFixed(2)}</span>
                        </div>
                        <div className="price-line">
                          <span>IGV</span>
                          <span>S/ {p.igv?.toFixed(2)}</span>
                        </div>
                        <div className="price-line total">
                          <span>Total</span>
                          <span>S/ {p.total?.toFixed(2)}</span>
                        </div>
                      </section>

                    </div>

                    {/* ACCIONES */}
                    <footer className='quote-footer-actions'>
                      <div className='status-selector'>
                        {acciones.map((accion) => (
                          <button
                            key={accion.estado}
                            onClick={() => handleStatusChange(p.id, accion.estado)}
                            className={`btn-s ${accion.class}`}
                            disabled={!puedeCambiar(p.estado, accion.estado)}
                          >
                            {accion.label}
                          </button>
                        ))}
                      </div>
                    </footer>

                  </motion.div>
                )}
              </div>
            );
          })}

          {pedidosFiltrados.length === 0 && (
            <div className="no-data">
              No hay resultados para este filtro
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotCotizacion;