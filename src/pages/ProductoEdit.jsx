import { useEffect, useState } from "react";
import { actualizarProducto } from "../services/ProductoService";
import { obtenerTiposProducto } from "../services/TipoProductoService";
import { obtenerUnidadesMedida } from "../services/UnidadMedidaService";

import "../style/ProductoEdit.css";

const ProductoEdit = ({ producto, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipoProductoId: "",
    unidadMedidaId: "",
    activo: true,
  });

  const [tipos, setTipos] = useState([]);
  const [unidades, setUnidades] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  // ======================
  // 📌 SET DATA INICIAL
  // ======================
  useEffect(() => {
    if (producto) {
      setForm({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        tipoProductoId: producto.tipoProductoId
          ? String(producto.tipoProductoId)
          : "",
        unidadMedidaId: producto.unidadMedidaId
          ? String(producto.unidadMedidaId)
          : "",
        activo: producto.activo ?? true,
      });
    }
  }, [producto]);

  // ======================
  // 📌 CARGAR COMBOS
  // ======================
  useEffect(() => {
    const cargarData = async () => {
      try {
        const [tiposData, unidadesData] = await Promise.all([
          obtenerTiposProducto(),
          obtenerUnidadesMedida(),
        ]);

        setTipos(tiposData);
        setUnidades(unidadesData);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingData(false);
      }
    };

    cargarData();
  }, []);

  // ======================
  // ⚠️ ERROR HANDLER
  // ======================
  const getErrorMessage = (err) => {
    if (!err) return "Ocurrió un error";
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    return "Ocurrió un error";
  };

  // ======================
  // ✏️ UPDATE FIELD
  // ======================
  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================
  // ✅ VALIDACIONES
  // ======================
  const isNombreValid = form.nombre.trim().length >= 2;
  const isTipoValid = !!form.tipoProductoId;
  const isUnidadValid = !!form.unidadMedidaId;

  const isFormValid =
    isNombreValid &&
    isTipoValid &&
    isUnidadValid &&
    !loading &&
    !loadingData;

  // ======================
  // 📤 SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Revisa los campos antes de actualizar");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await actualizarProducto(producto.id, {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        tipoProductoId: Number(form.tipoProductoId),
        unidadMedidaId: Number(form.unidadMedidaId),
        activo: form.activo,
      });

      onUpdated();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🎨 UI
  // ======================
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>✏️ Editar Producto</h3>

        <form onSubmit={handleSubmit} noValidate>

          {/* NOMBRE */}
          <div className="field">
            <label>Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => updateField("nombre", e.target.value)}
              className={`input ${
                form.nombre ? (isNombreValid ? "valid" : "error") : ""
              }`}
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div className="field">
            <label>Descripción</label>
            <input
              value={form.descripcion}
              onChange={(e) => updateField("descripcion", e.target.value)}
              className="input"
            />
          </div>

          {/* TIPO */}
          <div className="field">
            <label>Tipo Producto</label>
            <select
              value={form.tipoProductoId}
              onChange={(e) => updateField("tipoProductoId", e.target.value)}
              disabled={loadingData}
              className="input"
            >
              <option value="">
                {loadingData ? "Cargando..." : "Seleccionar tipo"}
              </option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* UNIDAD */}
          <div className="field">
            <label>Unidad Medida</label>
            <select
              value={form.unidadMedidaId}
              onChange={(e) => updateField("unidadMedidaId", e.target.value)}
              disabled={loadingData}
              className="input"
            >
              <option value="">
                {loadingData ? "Cargando..." : "Seleccionar unidad"}
              </option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* ACTIVO */}
            <div className="field">
            <label>Estado</label>

            <div className="toggle-row">
                <div
                className={`switch ${form.activo ? "active" : ""}`}
                onClick={() => updateField("activo", !form.activo)}
                />

                <span className={`status-badge ${form.activo ? "on" : "off"}`}>
                {form.activo ? "Activo" : "Inactivo"}
                </span>
            </div>
            </div>

          {/* ERROR */}
          {error && <p className="error">{error}</p>}

          {/* BOTONES */}
          <div className="modal-actions">
            <button className="btn-primary" disabled={!isFormValid}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>

            <button
              type="button"
              className="btn-danger"
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

export default ProductoEdit;