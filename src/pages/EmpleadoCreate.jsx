import React, { useEffect, useMemo, useState } from "react";
import { crearEmpleado } from "../services/EmpleadoService";
import { obtenerDistritos } from "../services/DistritoService";

const initialForm = {
  nombres: "",
  apellidos: "",
  tipoDocumento: "DNI",
  documento: "",
  telefono: "",
  email: "",
  distritoId: "",
};

const EmpleadoCreate = ({ onClose, onCreated }) => {
  const [form, setForm] = useState(initialForm);
  const [distritos, setDistritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDistritos, setLoadingDistritos] = useState(true);
  const [error, setError] = useState("");

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
    !loading &&
    !loadingDistritos;

  // ======================
  // SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Revisa los campos antes de guardar");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await crearEmpleado({
        nombres: form.nombres.trim(),
        apellidos: form.apellidos.trim(),
        tipoDocumento: form.tipoDocumento, // 👈 IMPORTANTE
        documento: form.documento.trim(),
        telefono: form.telefono.trim(),
        email: form.email.trim(),
        distritoId: form.distritoId ? Number(form.distritoId) : null,
      });

      onCreated();
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
        <h3>➕ Nuevo Empleado</h3>

        <form onSubmit={handleSubmit} noValidate>

          {/* NOMBRES */}
          <div className="field">
            <label>Nombres</label>
            <input
              value={form.nombres}
              onChange={(e) => updateField("nombres", e.target.value)}
              className={`input ${form.nombres ? (isNombreValid ? "valid" : "error") : ""}`}
            />
            {form.nombres && !isNombreValid && (
              <span className="error-text">Mínimo 2 caracteres</span>
            )}
          </div>

          {/* APELLIDOS */}
          <div className="field">
            <label>Apellidos</label>
            <input
              value={form.apellidos}
              onChange={(e) => updateField("apellidos", e.target.value)}
              className={`input ${form.apellidos ? (isApellidosValid ? "valid" : "error") : ""}`}
            />
            {form.apellidos && !isApellidosValid && (
              <span className="error-text">Mínimo 2 caracteres</span>
            )}
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
                  ? "El DNI debe tener 8 dígitos"
                  : "El RUC debe tener 11 dígitos"}
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
            {form.telefono && !isTelefonoValid && (
              <span className="error-text">Debe tener 9 dígitos</span>
            )}
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
            {form.email && !isEmailValid && (
              <span className="error-text">Correo inválido</span>
            )}
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
            <button className="btn btn-primary" disabled={!isFormValid}>
              {loading ? "Guardando..." : "Guardar"}
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

export default EmpleadoCreate;