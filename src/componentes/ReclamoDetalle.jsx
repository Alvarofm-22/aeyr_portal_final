import React, { useMemo } from "react";
import "../style/reclamoDetalle.css";

const ReclamoDetalle = ({ reclamo, onClose }) => {
  if (!reclamo) return null;

  // 🔥 Formatear ENUM
  const formatEnum = (value) => {
    if (!value) return "-";
    return value
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // 🔥 Fecha formateada
  const formattedFecha = useMemo(
    () =>
      new Date(reclamo.fechaRegistro).toLocaleString("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [reclamo.fechaRegistro]
  );

  // 🔥 Monto formateado
  const formattedMonto = useMemo(() => {
    if (!reclamo.montoReclamado) return "-";

    return reclamo.tipoMoneda === "SOLES"
      ? `S/ ${Number(reclamo.montoReclamado).toFixed(2)}`
      : `$ ${Number(reclamo.montoReclamado).toFixed(2)}`;
  }, [reclamo.montoReclamado, reclamo.tipoMoneda]);

  const monedaLabel =
    reclamo.tipoMoneda === "SOLES" ? "Soles" : "Dólares";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <header className="modal-header">
          <div>
            <h2 id="modalTitle">Detalle del Reclamo</h2>
            <span className="caso-id">
              Caso #{reclamo.numeroReclamo}
            </span>
          </div>

          <div className="header-right">
            <span className={`estado-badge ${reclamo.estado.toLowerCase()}`}>
              {formatEnum(reclamo.estado)}
            </span>

            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Cerrar modal"
            >
              ✕
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="modal-body">

          {/* INFO GENERAL */}
          <section className="info-card">
            <h4>Información general</h4>

            <div className="info-grid">
              <Info label="Tipo" value={formatEnum(reclamo.tipo)} />
              <Info label="Fecha" value={formattedFecha} />
              <Info label="Bien contratado" value={reclamo.bienContratado || "-"} />
              <Info label="Moneda" value={monedaLabel} />
              <Info label="Monto" value={formattedMonto} />
            </div>
          </section>

          {/* DATOS DEL CONSUMIDOR */}
          <section className="info-card">
            <h4>Datos del consumidor</h4>

            <div className="info-grid">
              <Info label="Nombre" value={reclamo.nombre} />
              <Info label="Documento" value={reclamo.documento} />
              <Info label="Teléfono" value={reclamo.telefono || "-"} />
              <Info label="Email" value={reclamo.email || "-"} />
              <Info label="Domicilio" value={reclamo.domicilio || "-"} />
              <Info
                label="Representante"
                value={reclamo.representante || "-"}
              />
            </div>
          </section>

          {/* DESCRIPCIÓN */}
          <section className="info-card">
            <h4>Descripción del bien o servicio</h4>
            <p className="text-block">
              {reclamo.descripcionBien || "-"}
            </p>
          </section>

          {/* DETALLE */}
          <section className="info-card">
            <h4>Detalle del reclamo</h4>
            <p className="text-block">{reclamo.detalle || "-"}</p>

            <h4 className="mt">Pedido del consumidor</h4>
            <p className="text-block">{reclamo.pedido || "-"}</p>
          </section>

        </main>

        {/* FOOTER */}
        <footer className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
};

// 🔥 Componente reutilizable
const Info = ({ label, value }) => (
  <div className="info-item">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

export default ReclamoDetalle;