import React, { useEffect, useMemo, useState } from "react";
import {
  actualizarTarifa,
  obtenerCombosTarifa,
} from "../services/TarifaProductoService";

const TarifaProductoEdit = ({ tarifa, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    productoId: "",
    distritoId: "",
    precioUnitario: "",
    activo: true
  });

  const [combos, setCombos] = useState({ productos: [], distritos: [] });
  const [loading, setLoading] = useState(false);
  const [loadingCombos, setLoadingCombos] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (tarifa) {
      setForm({
        productoId: tarifa.productoId || "",
        distritoId: tarifa.distritoId || "",
        precioUnitario:
          tarifa.precioUnitario !== null && tarifa.precioUnitario !== undefined
            ? String(tarifa.precioUnitario)
            : "",
        activo: tarifa.activo

      });
    }
  }, [tarifa]);

  useEffect(() => {
    const cargarCombos = async () => {
      try {
        const data = await obtenerCombosTarifa();
        setCombos(data || { productos: [], distritos: [] });
      } catch (err) {
        setError(err?.message || "No se pudieron cargar los combos");
      } finally {
        setLoadingCombos(false);
      }
    };

    cargarCombos();
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const precioValido = useMemo(() => {
    const value = String(form.precioUnitario).trim();
    return /^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value) && Number(value) > 0;
  }, [form.precioUnitario]);

  const isFormValid =
    form.productoId &&
    form.distritoId &&
    precioValido &&
    !loading &&
    !loadingCombos;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      setError("Completa los campos correctamente");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await actualizarTarifa(tarifa.id, {
        productoId: Number(form.productoId),
        distritoId: Number(form.distritoId),
        precioUnitario: form.precioUnitario,
        activo: form.activo,
      });

      onUpdated();
      onClose();
    } catch (err) {
      setError(err?.message || "Error al actualizar tarifa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>✏️ Editar Tarifa</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Producto</label>
            <select
              className="input"
              value={form.productoId}
              onChange={(e) => updateField("productoId", e.target.value)}
              disabled={loadingCombos}
            >
              <option value="">
                {loadingCombos ? "Cargando..." : "Seleccionar producto"}
              </option>
              {combos.productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Distrito</label>
            <select
              className="input"
              value={form.distritoId}
              onChange={(e) => updateField("distritoId", e.target.value)}
              disabled={loadingCombos}
            >
              <option value="">
                {loadingCombos ? "Cargando..." : "Seleccionar distrito"}
              </option>
              {combos.distritos.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Precio unitario</label>

              <input
                type="text"
                inputMode="decimal"
                placeholder="Ej: 10.50"
                value={form.precioUnitario}
                onChange={(e) => {
                  let value = e.target.value.replace(",", ".");

                  if (/^\d*\.?\d{0,2}$/.test(value)) {
                    updateField("precioUnitario", value);
                  }
                }}
                className={`input ${
                  form.precioUnitario ? (precioValido ? "valid" : "error") : ""
                }`}
              />

            {form.precioUnitario && !precioValido && (
              <span className="error-text">
                Debe ser mayor a 0 y tener máximo 4 decimales
              </span>
            )}
          </div>


          <div className="field">
            <label>Estado</label>

            <select
              className="input"
              value={String(form.activo)}
              onChange={(e) =>
                updateField("activo", e.target.value === "true")
              }
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="modal-actions">
            <button className="btn btn-warning" disabled={!isFormValid}>
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

export default TarifaProductoEdit;