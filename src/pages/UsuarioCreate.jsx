import React, { useEffect, useState } from "react";
import { crearUsuario } from "../services/UsuarioService";
import { obtenerRoles } from "../services/RolService";
import { apiFetch } from "../services/Api";

const UsuarioCreate = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    rolId: "",
    empleadoId: "",
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 BUSCADOR
  const [tipoDoc, setTipoDoc] = useState("DNI");
  const [numeroDoc, setNumeroDoc] = useState("");
  const [empleado, setEmpleado] = useState(null);
  const [buscando, setBuscando] = useState(false);

  // 📌 Cargar roles
  useEffect(() => {
    const cargarRoles = async () => {
      try {
        const data = await obtenerRoles();
        setRoles(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarRoles();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ VALIDAR DOC
  const validarDocumento = () => {
    if (tipoDoc === "DNI" && numeroDoc.length !== 8) {
      return "DNI debe tener 8 dígitos";
    }
    if (tipoDoc === "RUC" && numeroDoc.length !== 11) {
      return "RUC debe tener 11 dígitos";
    }
    return null;
  };

  // 🔍 BUSCAR EMPLEADO
  const buscarEmpleado = async () => {
    const error = validarDocumento();
    if (error) {
      alert(error);
      return;
    }

    try {
      setBuscando(true);

      const data = await apiFetch(
        `/priv/empleados/buscar-documento?tipo=${tipoDoc}&numero=${numeroDoc}`
      );

      if (!data) throw new Error();

      setEmpleado(data);

      setForm((prev) => ({
        ...prev,
        empleadoId: data.id,
      }));

    } catch {
      setEmpleado(null);
      setForm((prev) => ({
        ...prev,
        empleadoId: "",
      }));

      alert("Empleado no encontrado");
    } finally {
      setBuscando(false);
    }
  };

  const validar = () => {
    if (!form.username.trim()) return "Username obligatorio";
    if (form.password.length < 4) return "Mínimo 4 caracteres";
    if (!form.rolId) return "Selecciona un rol";
    if (!form.empleadoId) return "Debes buscar un empleado";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validar();
    if (error) {
      alert(error);
      return;
    }

    try {
      setLoading(true);

      await crearUsuario({
        username: form.username.trim(),
        password: form.password,
        rolId: Number(form.rolId),
        empleadoId: Number(form.empleadoId),
      });

      onCreated();
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Nuevo Usuario</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />

          <select name="rolId" value={form.rolId} onChange={handleChange}>
            <option value="">Seleccionar rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>

          {/* 🔍 BUSCADOR */}
          <div className="empleado-busqueda">
            <select value={tipoDoc} onChange={(e) => setTipoDoc(e.target.value)}>
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
            </select>

            <input
              type="text"
              placeholder="Número"
              value={numeroDoc}
              onChange={(e) => setNumeroDoc(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-primary"
              onClick={buscarEmpleado}
              disabled={buscando}
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {/* RESULTADO */}
          {empleado && (
            <div className="empleado-result">
              <div><b>👤 {empleado.nombres} {empleado.apellidos}</b></div>
              <div>{empleado.tipoDocumento}: {empleado.documento}</div>
            </div>
          )}

          <div className="modal-actions">
            <button
              className="btn btn-primary"
              disabled={loading || !empleado}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioCreate;