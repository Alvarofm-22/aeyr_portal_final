import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import '../style/Cotizacion.css';
// CORRECCIÓN: Importación con A mayúscula para que coincida con el archivo
import { guardarCotizacionDB } from '../services/CotizacionService'; 

const PRODUCTOS_BASE = {
  'B-09': { peso: 10.60, parihuela: 192, um: 'PZA', desc: 'BLOCK ENTERO LISO 9X19X39 NATURAL' },
  'B-12': { peso: 11.70, parihuela: 156, um: 'PZA', desc: 'BLOCK ENTERO LISO 12X19X39 NATURAL' },
  'B-14': { peso: 12.50, parihuela: 110, um: 'PZA', desc: 'BLOCK ENTERO LISO 15X19X39 NATURAL' },
  'B-19': { peso: 16.50, parihuela: 90, um: 'PZA', desc: 'BLOCK ENTERO LISO 19X19X39 NATURAL' },
  'MORTERO 1:4': { peso: 40.00, parihuela: 40, um: 'BLS', desc: 'MORTERO 1:4' },
  'CONCRETO LIQUIDO': { peso: 40.00, parihuela: 40, um: 'BLS', desc: 'CONCRETO LIQUIDO 176 KG/CM2' },
  'TARRAJEO 1:4': { peso: 40.00, parihuela: 40, um: 'BLS', desc: 'TARRAJEO 1:4' }
};

const ZONAS = {
  ZONA_1: {
    distritos: ['SJM', 'MAGDALENA', 'SURCO', 'SAN MIGUEL', 'SURQUILLO', 'CHORRILLOS', 'MIRAFLORES', 'RIMAC', 'SAN ISIDRO', 'SAN BORJA', 'LINCE'],
    precios: { 'B-09': 2.3499, 'B-12': 2.4698, 'B-14': 2.9580, 'B-19': 3.3661, 'OTROS': 9.6143 }
  },
  ZONA_2: {
    distritos: ['RIMAC_ALT', 'INDEPENDENCIA', 'CARABAYLLO', 'COMAS', 'CALLAO', 'SJL', 'SAN MARTIN DE PORRES'],
    precios: { 'B-09': 2.3799, 'B-12': 2.4998, 'B-14': 2.9880, 'B-19': 3.3961, 'OTROS': 9.6443 }
  },
  ZONA_3: {
    distritos: ['SAN BARTOLO', 'PUNTA HERMOSA', 'SANTA MARIA', 'OTROS'],
    precios: { 'B-09': 2.3899, 'B-12': 2.5098, 'B-14': 2.9980, 'B-19': 3.4061, 'OTROS': 9.6543 }
  }
};

const Cotizacion = () => {
  const [items, setItems] = useState([{ m2: '', cant: '', mat: 'B-12' }]);
  const [proyecto, setProyecto] = useState('');
  const [distrito, setDistrito] = useState('SURCO');
  const [mostrarBoleta, setMostrarBoleta] = useState(false);
  const [loading, setLoading] = useState(false);
  const boletaRef = useRef();

  const getPrecioUnitario = (material, dist) => {
    const zonaActual = Object.values(ZONAS).find(z => z.distritos.includes(dist)) || ZONAS.ZONA_3;
    if (['MORTERO 1:4', 'CONCRETO LIQUIDO', 'TARRAJEO 1:4'].includes(material)) {
      return zonaActual.precios['OTROS'];
    }
    return zonaActual.precios[material] || 0;
  };

  const res = useMemo(() => {
    // CORRECCIÓN: Uso de 'let' para evitar el error de reasignación
    let subtotal = 0;
    let pesoTotalKg = 0;
    let totalParihuelas = 0;
    let totalM2 = 0;

    const detalle = items.map(item => {
      const pUnit = getPrecioUnitario(item.mat, distrito);
      const cant = parseFloat(item.cant) || 0;
      const m2Val = parseFloat(item.m2) || 0;
      const importe = cant * pUnit;
      const pBase = PRODUCTOS_BASE[item.mat] || { peso: 0, parihuela: 1 };
      
      const pesoFila = cant * pBase.peso;
      const parihuelasFila = cant / pBase.parihuela;

      subtotal += importe;
      pesoTotalKg += pesoFila;
      totalParihuelas += parihuelasFila;
      totalM2 += m2Val;

      return { ...item, pUnit, importe, pesoFila, pesoUnit: pBase.peso, pzsParihuela: pBase.parihuela, parihuelasFila };
    });

    let pesoRestante = pesoTotalKg / 1000;
    const pesoTn = pesoRestante;
    const flota = [30, 20, 10, 6, 2];
    let desgloseViajes = [];
    let totalViajesCount = 0;

    flota.forEach(capacidad => {
      if (pesoRestante >= capacidad) {
        const cantViajes = Math.floor(pesoRestante / capacidad);
        desgloseViajes.push(`${cantViajes} viaje(s) de ${capacidad} TN`);
        totalViajesCount += cantViajes;
        pesoRestante = (pesoRestante % capacidad);
      }
    });

    if (pesoRestante > 0.1) {
      desgloseViajes.push(`1 viaje de 2 TN (Residuo)`);
      totalViajesCount += 1;
    }

    return { 
      detalle, subtotal, igv: subtotal * 0.18, total: subtotal * 1.18, 
      pesoTn, desgloseViajes, totalViajesCount, totalParihuelas, totalM2 
    };
  }, [items, distrito]);

  const handleGuardar = async () => {
    if (!proyecto) return alert("Nombre del proyecto requerido");
    setLoading(true);
    try {
      await guardarCotizacionDB({
        proyecto,
        distrito,
        ...res,
        fecha: new Date().toLocaleString()
      });
      alert("Guardado en la base de datos");
    } catch (e) {
      alert("Error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cotizacion-wrapper">
      {/* AQUÍ SE USA MOTION: Ya no saldrá el error de "never used" */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="card-editor"
      >
        <div className="editor-header">
          <input type="text" placeholder="PROYECTO" value={proyecto} onChange={e => setProyecto(e.target.value.toUpperCase())} className="input-proyecto" />
          <select value={distrito} onChange={e => setDistrito(e.target.value)} className="select-distrito">
            {Object.values(ZONAS).flatMap(z => z.distritos).map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="table-responsive">
          <table className="tabla-editor">
            <thead>
              <tr><th>M2</th><th>CANT.</th><th>MATERIAL</th><th>P. UNIT</th><th>ACCIONES</th></tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td><input type="number" value={item.m2} onChange={e => {const n=[...items]; n[i].m2=e.target.value; setItems(n)}} /></td>
                  <td><input type="number" value={item.cant} onChange={e => {const n=[...items]; n[i].cant=e.target.value; setItems(n)}} /></td>
                  <td>
                    <select value={item.mat} onChange={e => {const n=[...items]; n[i].mat=e.target.value; setItems(n)}}>
                      {Object.keys(PRODUCTOS_BASE).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </td>
                  <td className="p-unit-label">S/ {getPrecioUnitario(item.mat, distrito).toFixed(4)}</td>
                  <td><button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="btn-del">🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="btn-add-full" onClick={() => setItems([...items, { m2: '', cant: '', mat: 'B-12' }])}>+ AGREGAR</button>
        <button className="btn-toggle-boleta" onClick={() => setMostrarBoleta(!mostrarBoleta)}>VER BOLETA</button>
        <button className="btn-add-full" style={{background: '#2c3e50', marginTop: '10px'}} onClick={handleGuardar} disabled={loading}>
          {loading ? "PROCESANDO..." : "💾 GUARDAR EN SQL"}
        </button>
      </motion.div>

      <AnimatePresence>
        {mostrarBoleta && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="boleta-preview"
          >
            <div className="a4-sheet" ref={boletaRef}>
               <div className="boleta-header-oficial">
                <div><h2>AE&R CG SAC</h2><p>RUC: 20612345678</p></div>
                <div className="cot-nro"><h1>COTIZACIÓN</h1><p>NRO. 001 - 2026</p></div>
              </div>
              <div className="boleta-datos">
                <p><strong>Obra:</strong> {proyecto || 'S/N'}</p>
                <p><strong>Lugar:</strong> {distrito}</p>
              </div>
              <table className="tabla-boleta-final">
                <thead>
                  <tr><th>M2</th><th>CANT.</th><th>DESC</th><th>PESO</th><th>P.U.</th><th>TOTAL</th></tr>
                </thead>
                <tbody>
                  {res.detalle.map((d, i) => (
                    <tr key={i}>
                      <td>{d.m2}</td><td>{d.cant}</td><td>{PRODUCTOS_BASE[d.mat].desc}</td>
                      <td>{d.pesoFila.toFixed(2)}</td><td>{d.pUnit.toFixed(4)}</td><td>{d.importe.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="boleta-footer">
                <div className="logistica">
                  <p>Peso: {res.pesoTn.toFixed(2)} TN</p>
                  {res.desgloseViajes.map((v, idx) => <p key={idx}>{v}</p>)}
                </div>
                <div className="totales">
                  <p>SUBTOTAL: S/ {res.subtotal.toFixed(2)}</p>
                  <p>IGV: S/ {res.igv.toFixed(2)}</p>
                  <h2>TOTAL: S/ {res.total.toFixed(2)}</h2>
                </div>
              </div>
            </div>
            <button className="btn-descargar-pdf" onClick={() => html2pdf().from(boletaRef.current).save()}>PDF</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cotizacion;