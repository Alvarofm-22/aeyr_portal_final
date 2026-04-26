import React, { useEffect, useState } from "react";
import {
  obtenerEmpleados,
  buscarEmpleados,
} from "../services/EmpleadoService";

import EmpleadoCreate from "./EmpleadoCreate";
import EmpleadoEdit from "./EmpleadoEdit";

import "../style/Empleado.css";

const EmpleadoHome = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // ✅ CARGAR INICIAL
  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const data = await obtenerEmpleados();
      setEmpleados(data);
    } catch {
      setError("Error al cargar empleados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // 🔍 BUSCAR MANUAL
  const handleBuscar = async () => {
    try {
      setBuscando(true);

      const data =
        textoBusqueda.trim() === ""
          ? await obtenerEmpleados()
          : await buscarEmpleados(textoBusqueda);

      setEmpleados(data);
    } catch {
      setError("Error al buscar empleados");
    } finally {
      setBuscando(false);
    }
  };

  const getNombreCompleto = (e) => `${e.nombres} ${e.apellidos}`;

  if (loading) return <p className="center">Cargando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>👤 Gestión de Empleados</h2>

        <button
          className="btn btn-primary"
          onClick={() => setMostrarCrear(true)}
        >
          ➕ Nuevo Empleado
        </button>
      </div>

      <p className="subtitle">
        Selecciona un empleado para ver o editar
      </p>

      {/* 🔍 BUSCADOR */}
      <div className="usuarios-search">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleBuscar();
          }}
        />

        <button
          className="btn btn-primary"
          onClick={handleBuscar}
          disabled={buscando}
        >
          {buscando ? "Buscando..." : "🔍 Buscar"}
        </button>
      </div>

      {/* GRID */}
      <div className="usuarios-grid">
        {empleados.length === 0 ? (
          <p>No hay empleados</p>
        ) : (
          empleados.map((e) => (
            <div
              key={e.id}
              className="usuario-card"
              onClick={() => setEmpleadoSeleccionado(e)}
            >
              <div className="card-header">
                <span className="doc">DNI: {e.documento}</span>
              </div>

              <h3>{getNombreCompleto(e)}</h3>

              <p className="info">📞 {e.telefono}</p>
              <p className="info">📧 {e.email}</p>
            </div>
          ))
        )}
      </div>

      {/* CREAR */}
      {mostrarCrear && (
        <EmpleadoCreate
          onClose={() => setMostrarCrear(false)}
          onCreated={cargarEmpleados}
        />
      )}

      {/* EDITAR */}
      {modoEdicion && empleadoSeleccionado && (
        <EmpleadoEdit
          empleado={empleadoSeleccionado}
          onClose={() => {
            setModoEdicion(false);
            setEmpleadoSeleccionado(null);
          }}
          onUpdated={cargarEmpleados}
        />
      )}

      {/* DETALLE */}
      {empleadoSeleccionado && !modoEdicion && (
        <div className="modal">
          <div className="modal-content">
            <h3>Empleado</h3>

            <p><b>Nombre:</b> {getNombreCompleto(empleadoSeleccionado)}</p>
            <p><b>DNI:</b> {empleadoSeleccionado.documento}</p>
            <p><b>Teléfono:</b> {empleadoSeleccionado.telefono}</p>
            <p><b>Email:</b> {empleadoSeleccionado.email}</p>

            <div className="modal-actions">
              <button
                className="btn btn-warning"
                onClick={() => setModoEdicion(true)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger"
                onClick={() => setEmpleadoSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpleadoHome;