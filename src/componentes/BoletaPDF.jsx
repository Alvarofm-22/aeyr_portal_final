import React, { useEffect, useMemo, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import "../style/BoletaPDF.css";

const IGV_RATE = 0.18;

const BoletaPDF = ({ data }) => {
  const boletaRef = useRef();
  const [modoPDF, setModoPDF] = useState(false);

  const [editable, setEditable] = useState({
    nombreProyecto: "",
    rucDni: "",
    distritoNombre: "",
    estado: "",
    tipoCotizacion: "SUMINISTRO",
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!data) return;

    setEditable({
      nombreProyecto: data.nombreProyecto || "",
      rucDni: data.rucDni || "",
      distritoNombre: data.distritoNombre || "",
      estado: data.estado || "",
      tipoCotizacion: data.tipoCotizacion || "SUMINISTRO",
    });

    setItems(data.items || []);
  }, [data]);

  // 🔥 SOLO INSTALACIÓN ES EDITABLE
  const isEditable = editable.tipoCotizacion === "INSTALACION";

  // 🔥 EDITAR ITEM
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];

    newItems[index][field] = value;

    const cantidad = Number(newItems[index].cantidad || 0);
    const precio = Number(newItems[index].precioUnitario || 0);

    newItems[index].subtotal = cantidad * precio;

    setItems(newItems);
  };

  // 🔥 AGREGAR FILA SOLO INSTALACIÓN
  const agregarFila = () => {
    setItems([
      ...items,
      {
        productoNombre: "",
        cantidad: 1,
        unidad: "UND",
        precioUnitario: 0,
        subtotal: 0,
        tipo: "SERVICIO",
      },
    ]);
  };

  // 🔥 ELIMINAR
  const eliminarFila = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // 🔥 TOTALES
  const totales = useMemo(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0
    );

    const igv = subtotal * IGV_RATE;
    const total = subtotal + igv;

    return { subtotal, igv, total };
  }, [items]);

  if (!data) return null;

  // PARA EXPORTAR  
    const exportPDF = () => {
    setModoPDF(true);

    setTimeout(() => {
        html2pdf()
        .set({
            margin: 8,
            filename: `cotizacion_${data.id}.pdf`,
            html2canvas: {
            scale: 2,
            useCORS: true,
            },
            jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
            },
        })
        .from(boletaRef.current)
        .save()
        .then(() => setModoPDF(false));
    }, 300);
    };

  return (
    <div className="boleta-page">
      <div className="boleta-actions">
        {isEditable && (
          <button className="boleta-btn secondary" onClick={agregarFila}>
            + Agregar fila
          </button>
        )}

        <button className="boleta-btn primary" onClick={exportPDF}>
        Descargar PDF
        </button>

      </div>

      <div className="boleta-container-pro">
        <div className="a4-sheet pro" ref={boletaRef}>
          
          {/* HEADER */}
          <div className="boleta-header-pro">
            <div className="company-block">
              <h2>AE&R CG SAC</h2>
              <span>RUC: 20612345678</span>
              <p>Lima - Perú</p>
            </div>

            <div className="cot-box">
              <span className="cot-label">COTIZACIÓN</span>
              <h1>#{data.id}</h1>
              <span className="cot-sub">Sistema interno</span>
            </div>
          </div>

          {/* 🔥 TIPO */}
          <div className="tipo-cotizacion">
            <label>Tipo:</label>
            <select
              value={editable.tipoCotizacion}
              onChange={(e) =>
                setEditable({
                  ...editable,
                  tipoCotizacion: e.target.value,
                })
              }
            >
              <option value="SUMINISTRO">SUMINISTRO</option>
              <option value="INSTALACION">INSTALACIÓN</option>
            </select>
          </div>

          {/* INFO */}
          <div className="boleta-info-grid">
            <div className="info-card">
              <label>Proyecto</label>
              <input
                value={editable.nombreProyecto}
                onChange={(e) =>
                  setEditable({
                    ...editable,
                    nombreProyecto: e.target.value,
                  })
                }
              />
            </div>

            <div className="info-card">
              <label>Cliente</label>
              <input
                value={editable.rucDni}
                onChange={(e) =>
                  setEditable({
                    ...editable,
                    rucDni: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* TABLA */}
          <table className="tabla-pro">
            <thead>
              <tr>
                <th>#</th>
                {isEditable && <th>Tipo</th>}
                <th>Descripción</th>
                <th>Cant</th>
                <th>Und</th>
                <th>P.U.</th>
                <th>Total</th>
                {isEditable && <th></th>}
              </tr>
            </thead>

            <tbody>
            {items.map((item, i) => (
                <tr key={i}>
                <td>{i + 1}</td>

                {isEditable && (
                    <td>
                    {modoPDF ? (
                        <span>{item.tipo || "PRODUCTO"}</span>
                    ) : (
                        <select
                        value={item.tipo || "PRODUCTO"}
                        onChange={(e) =>
                            handleItemChange(i, "tipo", e.target.value)
                        }
                        >
                        <option value="PRODUCTO">Producto</option>
                        <option value="SERVICIO">Servicio</option>
                        </select>
                    )}
                    </td>
                )}

                {/* DESCRIPCIÓN */}
                <td>
                {modoPDF ? (
                    <span>{item.productoNombre}</span>
                ) : isEditable ? (
                    <input
                    type="text"
                    value={item.productoNombre}
                    onChange={(e) =>
                        handleItemChange(i, "productoNombre", e.target.value.toUpperCase())
                    }
                    placeholder="Descripción del servicio"
                    />
                ) : (
                    <span>{item.productoNombre}</span>
                )}
                </td>

                {/* CANTIDAD */}
                <td>
                    {modoPDF ? (
                    <span>{item.cantidad}</span>
                    ) : (
                    <input
                        type="number"
                        value={item.cantidad}
                        onChange={(e) =>
                        handleItemChange(i, "cantidad", e.target.value)
                        }
                    />
                    )}
                </td>

                <td>{item.unidad}</td>

                {/* PRECIO UNITARIO */}
                <td>
                    {modoPDF ? (
                    <span>S/ {Number(item.precioUnitario || 0).toFixed(2)}</span>
                    ) : (
                    <input
                        type="number"
                        value={item.precioUnitario}
                        onChange={(e) =>
                        handleItemChange(i, "precioUnitario", e.target.value)
                        }
                    />
                    )}
                </td>

                {/* TOTAL */}
                <td>
                    S/ {Number(item.subtotal || 0).toFixed(2)}
                </td>

                {isEditable && (
                    <td>
                    {!modoPDF && (
                        <button
                        onClick={() => eliminarFila(i)}
                        style={{ color: "red", border: "none" }}
                        >
                        ✕
                        </button>
                    )}
                    </td>
                )}
                </tr>
            ))}
            </tbody>


          </table>

          {/* TOTALES */}
          <div className="footer-pro">
            <div></div>

            <div className="totales-pro">
              <div className="total-line">
                <span>SUBTOTAL</span>
                <strong>S/ {totales.subtotal.toFixed(2)}</strong>
              </div>

              <div className="total-line">
                <span>IGV</span>
                <strong>S/ {totales.igv.toFixed(2)}</strong>
              </div>

              <div className="total-grand">
                <span>TOTAL</span>
                <strong>S/ {totales.total.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoletaPDF;