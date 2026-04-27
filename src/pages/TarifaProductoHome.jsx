import React, { useEffect, useState } from "react";
import {
  obtenerTarifas,
  obtenerCombosTarifa,
} from "../services/TarifaProductoService";

import TarifaProductoCreate from "./TarifaProductoCreate";
import TarifaProductoEdit from "./TarifaProductoEdit";

import "../style/TarifaProductoHome.css";

const TarifaProductoHome = () => {
  const [tarifas, setTarifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);

  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [tarifaSeleccionada, setTarifaSeleccionada] = useState(null);

  const formatearSoles = (valor) => {
  if (valor === null || valor === undefined) return "S/ 0.00";

  return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(valor);
  };


  const [combos, setCombos] = useState({
    productos: [],
    distritos: [],
  });

  const cargarData = async () => {
    try {
      setLoading(true);
      const [tarifasData, combosData] = await Promise.all([
        obtenerTarifas(),
        obtenerCombosTarifa(),
      ]);

      setTarifas(tarifasData || []);
      setCombos(combosData || { productos: [], distritos: [] });
    } catch {
      setError("Error al cargar tarifas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarData();
  }, []);

  const getNombreProducto = (id) =>
    combos.productos.find((p) => p.id === id)?.nombre || `Producto #${id}`;

  const getNombreDistrito = (id) =>
    combos.distritos.find((d) => d.id === id)?.nombre || `Distrito #${id}`;

  if (loading) return <p className="center">Cargando...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="tarifas-container">
      <div className="tarifas-header">
        <div>
          <h2>💰 Tarifas por Producto y Distrito</h2>
          <p className="subtitle">
            Gestiona precios por producto según distrito
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setMostrarCrear(true)}
        >
          ➕ Nueva Tarifa
        </button>
      </div>

      <div className="tarifas-grid">
        {tarifas.length === 0 ? (
          <p>No hay tarifas registradas</p>
        ) : (
          tarifas.map((t) => (
            <div
              key={t.id}
              className="tarifa-card"
              onClick={() => {
                setTarifaSeleccionada(t);
                setModoEdicion(true);
              }}
            >
              <h3>{t.productoNombre || getNombreProducto(t.productoId)}</h3>
              <p className="info">📍 {t.distritoNombre || getNombreDistrito(t.distritoId)}</p>
              <p className="precio">{formatearSoles(t.precioUnitario)}</p>
              <span className={t.activo ? "activo" : "inactivo"}>
                {t.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))
        )}
      </div>

      {mostrarCrear && (
        <TarifaProductoCreate
          onClose={() => setMostrarCrear(false)}
          onCreated={cargarData}
        />
      )}

      {modoEdicion && tarifaSeleccionada && (
        <TarifaProductoEdit
          tarifa={tarifaSeleccionada}
          onClose={() => {
            setModoEdicion(false);
            setTarifaSeleccionada(null);
          }}
          onUpdated={cargarData}
        />
      )}
    </div>
  );
};

export default TarifaProductoHome;