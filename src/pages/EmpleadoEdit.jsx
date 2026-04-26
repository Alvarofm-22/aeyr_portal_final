import React, { useEffect, useMemo, useState } from "react";
import { actualizarEmpleado } from "../services/EmpleadoService";
import { obtenerDistritos } from "../services/DistritoService";

const EmpleadoEdit = ({ empleado, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    tipoDocumento: "DNI",
    documento: "",
    telefono: "",
    email: "",
    distritoId: "",
  });

  const [distritos, setDistritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDistritos, setLoadingDistritos] = useState(true);
  const [error, setError] = useState("");

  // ======================
  // CARGAR DATA INICIAL
  // ======================
  useEffect(() => {
    if (empleado) {
      setForm({
        nombres: empleado.nombres || "",
        apellidos: empleado.apellidos || "",
        tipoDocumento: empleado.tipoDocumento || "DNI",
        documento: empleado.documento || "",
        telefono: empleado.telefono || "",
        email: empleado.email || "",
        distritoId: empleado.distritoId || "",
      });
    }
  }, [empleado]);

  // ======================
  // CARGAR DISTRITOS
  // ======================
  useEffect(() => {
    const cargarDistritos = async () => {
      try {
        const data = await obtenerDistritos();
        setDistritos(data);
      } catch (err) {
        setError(getErrorMessage(err) || "No se pudieron cargar los distritos");
      } finally {
        setLoadingDistritos(false);
      }
    };

    cargarDistritos();
  }, []);

  // ======================
  // ERROR HANDLER
  // ======================
  const getErrorMessage = (err) => {
    if (!err) return "Ocurrió un error";
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    return "Ocurrió un error";
  };

  // ======================
  // UPDATE FIELD
  // ======================
  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================
  // VALIDACIONES
  // ======================
  const isNombreValid = form.nombres.trim().length >= 2;
  const isApellidosValid = form.apellidos.trim().length >= 2;

  const isDocumentoValid = useMemo(() => {
    if (form.tipoDocumento === "DNI") return /^\d{8}$/.test(form.documento);
    if (form.tipoDocumento === "RUC") return /^\d{11}$/.test(form.documento);
    return false;
  }, [form.tipoDocumento, form.documento]);

  const isTelefonoValid = /^\d{9}$/.test(form.telefono);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const isFormValid =
    isNombreValid &&
    isApellidosValid &&
    isDocumentoValid &&
    isTelefonoValid &&
    isEmailValid &&
    !loading;

  // ======================
  // SUBMIT
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

      await actualizarEmpleado(empleado.id, {
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        tipoDocumento: form.tipoDocumento,
        documento: form.documento.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        distritoId: form.distritoId ? Number(form.distritoId) : null,
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
  // UI
  // ======================
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>✏️ Editar Empleado</h3>

        <form onSubmit={handleSubmit} noValidate>

          {/* NOMBRES */}
          <div className="field">
            <label>Nombres</label>
            <input
              value={form.nombres}
              onChange={(e) => updateField("nombres", e.target.value)}
              className={`input ${form.nombres ? (isNombreValid ? "valid" : "error") : ""}`}
            />
          </div>

          {/* APELLIDOS */}
          <div className="field">
            <label>Apellidos</label>
            <input
              value={form.apellidos}
              onChange={(e) => updateField("apellidos", e.target.value)}
              className={`input ${form.apellidos ? (isApellidosValid ? "valid" : "error") : ""}`}
            />
          </div>

          {/* TIPO DOCUMENTO */}
          <div className="field">
            <label>Tipo Documento</label>
            <select
              value={form.tipoDocumento}
              onChange={(e) => {
                updateField("tipoDocumento", e.target.value);
                updateField("documento", "");
              }}
              className="input"
            >
              <option value="DNI">DNI</option>
              <option value="RUC">RUC</option>
            </select>
          </div>

          {/* DOCUMENTO */}
          <div className="field">
            <label>{form.tipoDocumento}</label>
            <input
              value={form.documento}
              maxLength={form.tipoDocumento === "DNI" ? 8 : 11}
              onChange={(e) =>
                updateField(
                  "documento",
                  e.target.value.replace(/\D/g, "").slice(0, form.tipoDocumento === "DNI" ? 8 : 11)
                )
              }
              className={`input ${form.documento ? (isDocumentoValid ? "valid" : "error") : ""}`}
            />
            {form.documento && !isDocumentoValid && (
              <span className="error-text">
                {form.tipoDocumento === "DNI"
                  ? "DNI debe tener 8 dígitos"
                  : "RUC debe tener 11 dígitos"}
              </span>
            )}
          </div>

          {/* TELEFONO */}
          <div className="field">
            <label>Teléfono</label>
            <input
              value={form.telefono}
              maxLength={9}
              onChange={(e) =>
                updateField("telefono", e.target.value.replace(/\D/g, "").slice(0, 9))
              }
              className={`input ${form.telefono ? (isTelefonoValid ? "valid" : "error") : ""}`}
            />
          </div>

          {/* EMAIL */}
          <div className="field">
            <label>Correo</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={`input ${form.email ? (isEmailValid ? "valid" : "error") : ""}`}
            />
          </div>

          {/* DISTRITO */}
          <div className="field">
            <label>Distrito</label>
            <select
              value={form.distritoId}
              onChange={(e) => updateField("distritoId", e.target.value)}
              disabled={loadingDistritos}
              className="input"
            >
              <option value="">
                {loadingDistritos ? "Cargando..." : "Seleccionar distrito"}
              </option>
              {distritos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* ERROR */}
          {error && <p className="error">{error}</p>}

          {/* BOTONES */}
          <div className="modal-actions">
            <button className="btn btn-warning" disabled={!isFormValid || loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>

            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancelar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EmpleadoEdit;