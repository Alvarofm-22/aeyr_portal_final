import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerCotizacionPorId } from "../services/CotizacionService";
import BoletaPDF from "../componentes/BoletaPDF";

const CotizacionViewer = () => {
  const { id } = useParams(); // 🔥 ID DESDE URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const res = await obtenerCotizacionPorId(id);
        setData(res);
      } catch (e) {
        alert("No encontrada");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCotizacion();
  }, [id]);

  if (loading) return <p>Cargando cotización...</p>;

  if (!data) return <p>No se encontró la cotización</p>;

  return (
    <div className="viewer-container">
      <BoletaPDF data={data} />
    </div>
  );
};

export default CotizacionViewer;