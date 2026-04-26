import React, { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  buscarUsuarios,
} from "../services/UsuarioService";

import UsuarioCreate from "./UsuarioCreate";
import UsuarioEdit from "./UsuarioEdit";

import "../style/UsuarioHome.css";
import "../style/UsuarioEdit.css";
import "../style/UsuarioCreate.css";

const UsuarioHome = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // ✅ CARGAR
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // 📌 INICIO
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // 📌 BUSCAR
    const handleBuscar = async () => {
      try {
        setLoading(true);

        const data =
          textoBusqueda.trim() === ""
            ? await obtenerUsuarios()
            : await buscarUsuarios(textoBusqueda);

        setUsuarios(data);
      } catch {
        setError("Error al buscar usuarios");
      } finally {
        setLoading(false);
      }
    };

  if (loading) return <p className="center">Cargando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1>👤 Gestión de Usuarios</h1>

        <button
          className="btn btn-primary"
          onClick={() => setMostrarCrear(true)}
        >
          + Nuevo Usuario
        </button>
      </div>

      <p className="subtitle">
        Selecciona un usuario para ver o editar
      </p>

      {/* 🔍 BUSCADOR */}
      <div className="usuarios-search">
        <input
          type="text"
          placeholder="Buscar por username..."
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleBuscar();
          }}
        />

        <button className="btn btn-primary" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      {/* 📦 GRID */}
      <div className="usuarios-grid">
        {usuarios.length === 0 ? (
          <p>No hay usuarios</p>
        ) : (
          usuarios.map((u) => (
            <div
              key={u.id}
              className="usuario-card"
              onClick={() => setUsuarioSeleccionado(u)}
            >
              <div className="card-header">
                <span className="doc">ID: {u.id}</span>
              </div>

              <h3>{u.username}</h3>

              <p className="info">🛡️ Rol: {u.rol}</p>
              <p className="info">👤 {u.nombresEmpleado}</p>

              <span className={`estado ${u.isActive ? "activo" : "inactivo"}`}>
                {u.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 🟢 CREAR */}
      {mostrarCrear && (
        <UsuarioCreate
          onClose={() => setMostrarCrear(false)}
          onCreated={cargarUsuarios}
        />
      )}

      {/* 🟡 EDITAR */}
      {modoEdicion && usuarioSeleccionado && (
        <UsuarioEdit
          usuario={usuarioSeleccionado}
          onClose={() => {
            setModoEdicion(false);
            setUsuarioSeleccionado(null);
          }}
          onUpdated={cargarUsuarios}
        />
      )}

      {/* 🔵 DETALLE */}
      {usuarioSeleccionado && !modoEdicion && (
        <div className="modal">
          <div className="modal-content">
            <h3>Usuario</h3>

            <p><b>Username:</b> {usuarioSeleccionado.username}</p>
            <p><b>Rol:</b> {usuarioSeleccionado.rol}</p>
            <p><b>Empleado:</b> {usuarioSeleccionado.nombresEmpleado}</p>
            <p>
              <b>Estado:</b>{" "}
              {usuarioSeleccionado.isActive ? "Activo" : "Inactivo"}
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-warning"
                onClick={() => setModoEdicion(true)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger"
                onClick={() => setUsuarioSeleccionado(null)}
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

export default UsuarioHome;