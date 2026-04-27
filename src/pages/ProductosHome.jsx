import { useEffect, useState } from "react";
import {
  obtenerProductos,
  buscarProductos,
} from "../services/ProductoService";

import ProductoEdit from "./ProductoEdit";
import ProductoCreate from "./ProductoCreate";

import "../style/ProductoHome.css";

export default function ProductosHome() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nombre, setNombre] = useState(""); // 🔥 solo filtro simple

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // ======================
  // 📌 CARGAR TODOS
  // ======================
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await obtenerProductos();
      setProductos(data);
    } catch (err) {
      setError(err.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🔍 BUSCAR SOLO POR NOMBRE
  // ======================
  const handleBuscar = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await buscarProductos({
        nombre: nombre,
        activo: "", // 👈 no usamos filtro activo
      });

      setProductos(data);
    } catch (err) {
      setError(err.message || "Error en la búsqueda");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // 🧹 LIMPIAR
  // ======================
  const limpiarBusqueda = () => {
    setNombre("");
    cargarProductos();
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  if (loading) return <p className="loading">Cargando productos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="productos-container">
      {/* HEADER */}
      <div className="productos-header">
        <h2>Gestión de Productos</h2>
        <button
          className="btn-primary"
          onClick={() => setMostrarCrear(true)}
        >
          + Nuevo
        </button>
      </div>

      {/* BUSCADOR SIMPLE */}
      <div className="productos-filtros">
        <input
          placeholder="Buscar por nombre..."
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button onClick={handleBuscar} className="btn-secondary">
          Buscar
        </button>

        <button onClick={limpiarBusqueda} className="btn-ghost">
          Limpiar
        </button>
      </div>

      {/* LISTADO */}
      <div className="productos-grid">
        {productos.length === 0 ? (
          <p className="empty">No hay productos</p>
        ) : (
          productos.map((p) => (
            <div
              key={p.id}
              className="producto-card"
              onClick={() => setProductoSeleccionado(p)}
            >
              <h3>{p.nombre}</h3>
              <p>{p.tipoProducto}</p>
              <p>{p.unidadMedida}</p>

              <span className={p.activo ? "activo" : "inactivo"}>
                {p.activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          ))
        )}
      </div>

      {/* CREAR */}
      {mostrarCrear && (
        <ProductoCreate
          onClose={() => setMostrarCrear(false)}
          onCreated={cargarProductos}
        />
      )}

      {/* EDITAR */}
      {modoEdicion && productoSeleccionado && (
        <ProductoEdit
          producto={productoSeleccionado}
          onClose={() => {
            setModoEdicion(false);
            setProductoSeleccionado(null);
          }}
          onUpdated={cargarProductos}
        />
      )}

      {/* DETALLE */}
      {productoSeleccionado && !modoEdicion && (
        <div
          className="modal"
          onClick={() => setProductoSeleccionado(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{productoSeleccionado.nombre}</h3>

            <p>{productoSeleccionado.descripcion}</p>
            <p>{productoSeleccionado.tipoProducto}</p>
            <p>{productoSeleccionado.unidadMedida}</p>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => setModoEdicion(true)}
              >
                Editar
              </button>

              <button
                className="btn-danger"
                onClick={() => setProductoSeleccionado(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}