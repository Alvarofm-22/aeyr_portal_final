import React, { useState, useEffect } from "react";
import { cambiarEstadoUsuario } from "../services/UsuarioService";

const UsuarioEdit = ({ usuario, onClose, onUpdated }) => {
  const [activo, setActivo] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setActivo(usuario.isActive);
    }
  }, [usuario]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await cambiarEstadoUsuario(usuario.id, activo);
      onUpdated();
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h2>Editar Usuario</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">

          <div className="info-group">
            <label>Username</label>
            <span>{usuario.username}</span>
          </div>

          <div className="info-group">
            <label>Rol</label>
            <span>{usuario.rol}</span>
          </div>

          <div className="info-group">
            <label>Empleado</label>
            <span>{usuario.nombresEmpleado}</span>
          </div>

          {/* Toggle moderno */}
          <div className="toggle-container">
            <span>Estado</span>

            <label className="switch">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              <span className="slider"></span>
            </label>

            <span className={activo ? "status active" : "status inactive"}>
              {activo ? "Activo" : "Inactivo"}
            </span>
          </div>

          <div className="modal-footer">
            <button className="btn secondary" type="button" onClick={onClose}>
              Cancelar
            </button>

            <button className="btn primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UsuarioEdit;