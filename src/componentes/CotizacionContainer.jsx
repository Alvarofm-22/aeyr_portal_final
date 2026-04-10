import React, { useState } from "react";
import CotizacionViewer from "./CotizacionViewer";
import Cotizacion from "./Cotizacion"; // tu actual editor

const CotizacionContainer = () => {
  const [modo, setModo] = useState("crear");

  return (
    <div>
      <div className="tabs">
        <button onClick={() => setModo("crear")}>Crear</button>
        <button onClick={() => setModo("buscar")}>Buscar</button>
      </div>

      {modo === "crear" && <Cotizacion />}
      {modo === "buscar" && <CotizacionViewer />}
    </div>
  );
};

export default CotizacionContainer;