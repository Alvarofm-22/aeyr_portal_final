import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerCotizacionPorNumero } from "../services/CotizacionService";
import BoletaPDF from "../componentes/BoletaPDF";

const CotizacionViewer = () => {
  const { numero } = useParams(); // 🔥 CAMBIO AQUÍ
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCotizacion = async () => {
      try {
        const res = await obtenerCotizacionPorNumero(numero);
        setData(res);
      } catch (e) {
        alert("No encontrada");
      } finally {
        setLoading(false);
      }
    };

    if (numero) fetchCotizacion();
  }, [numero]);

  if (loading) return <p>Cargando cotización...</p>;
  if (!data) return <p>No se encontró la cotización</p>;

  return (
    <div className="viewer-container">
      <BoletaPDF data={data} />
    </div>
  );
};

export default CotizacionViewer;