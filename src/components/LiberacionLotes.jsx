import React, { useState, useEffect } from 'react';
import { canUserDownloadProcedure } from '../lib/permissions';
import { LIBERACION_LOTES_PDF_TEXT, LIBERACION_LOTES_TABLES } from '../domain/liberacionLotesFullText';

export default function LiberacionLotes({ tenantId = 'tenant-opt-01', userRole = 'super-admin', carpetaActiva, setCarpetaActiva }) {
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('trazabilidad_costeno');
  const [mostrarFormularioLiberacion, setMostrarFormularioLiberacion] = useState(false);
  const [alertaExito, setAlertaExito] = useState(false);

  // Registros de Liberación de Lotes (FOPD-15-01)
  const [registrosLiberacion, setRegistrosLiberacion] = useState([
    {
      id: 1,
      fecha: '2026-08-10',
      lote: 'L-20260810-QC01',
      producto: 'Queso Costeño Bloque 500g',
      marmita: 'Tina N° 2 (1.200 Litros)',
      phPrueba: 5.30,
      humedad: '44%',
      grasa: '23%',
      microbiologico: 'Conforme (Escherichia coli <10 UFC/g, Listeria Ausente)',
      responsable: 'Oscar Serrano / Analista Q.A.',
      estado: 'Aprobado y Liberado',
      observaciones: 'Empaque al vacío íntegro. Cumple con rotulado Res. 5109.'
    },
    {
      id: 2,
      fecha: '2026-08-11',
      lote: 'L-20260811-QM02',
      producto: 'Queso Mozzarella Tajado 250g',
      marmita: 'Hiladora 3HP / Tina N° 1',
      phPrueba: 5.25,
      humedad: '46%',
      grasa: '22%',
      microbiologico: 'En cultivo de laboratorio (24h)',
      responsable: 'Mauricio Múnera / Jefe Producción',
      estado: 'En Cuarentena / Pendiente Lab',
      observaciones: 'Almacenado a 2.5°C en Cuarto Frío N° 1.'
    }
  ]);

  // Formulario nuevo registro
  const [loteCodigo, setLoteCodigo] = useState('L-20260811-QC03');
  const [productoSeleccionado, setProductoSeleccionado] = useState('Queso Costeño Bloque 500g');
  const [phValor, setPhValor] = useState('5.32');
  const [humedadValor, setHumedadValor] = useState('44.5%');
  const [estadoLiberacion, setEstadoLiberacion] = useState('Aprobado y Liberado');
  const [observacionesInput, setObservacionesInput] = useState('');

  const canDownloadPDF = canUserDownloadProcedure(userRole);

  // Sincronización desde el menú del Sidebar
  useEffect(() => {
    if (!carpetaActiva) return;
    const mapaSecciones = {
      'Objetivo y Responsabilidades': 'objetivo',
      'Definiciones Rotulado': 'definiciones',
      'Trazabilidad Queso Costeño': 'trazabilidad_costeno',
      'Trazabilidad Queso Mozzarella': 'trazabilidad_mozzarella',
      'Bitácora FOPD-15-01': 'bitacora'
    };
    if (mapaSecciones[carpetaActiva]) {
      setSeccionActiva(mapaSecciones[carpetaActiva]);
    }
  }, [carpetaActiva]);

  const handleCrearRegistro = (e) => {
    e.preventDefault();
    if (!loteCodigo.trim()) return;

    const nuevo = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      lote: loteCodigo.trim(),
      producto: productoSeleccionado,
      marmita: 'Marmita N° 1 / Proceso Industrial',
      phPrueba: parseFloat(phValor) || 5.3,
      humedad: humedadValor,
      grasa: '22.5%',
      microbiologico: 'Conforme - Liberación Inmediata',
      responsable: 'Oscar Serrano / Analista Q.A.',
      estado: estadoLiberacion,
      observaciones: observacionesInput.trim() || 'Verificación completa de sello al vacío y loteado de empaque.'
    };

    setRegistrosLiberacion(prev => [nuevo, ...prev]);
    setLoteCodigo(`L-20260811-Q${Math.floor(Math.random() * 90 + 10)}`);
    setObservacionesInput('');
    setMostrarFormularioLiberacion(false);
    setAlertaExito(true);
    setTimeout(() => setAlertaExito(false), 4000);
  };

  // Función de Impresión de PDF Oficial ISO
  const handlePrintDocumentoOficial = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Q-PD-15 - Procedimiento para la Liberación de Productos Terminados</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.5; font-size: 12px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .header-table td { border: 1px solid #334155; padding: 8px; text-align: center; font-size: 11px; }
          .header-title { font-size: 13px; font-weight: bold; text-transform: uppercase; }
          .section-title { font-weight: bold; background: #e0f2fe; color: #0369a1; padding: 6px; margin-top: 15px; border-left: 4px solid #0284c7; }
          table.data-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          table.data-table th, table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 11px; }
          table.data-table th { background: #f8fafc; font-weight: bold; }
          .footer-signatures { margin-top: 40px; width: 100%; border-collapse: collapse; }
          .footer-signatures td { border: none; text-align: center; padding-top: 40px; font-size: 11px; }
          .line { border-top: 1px solid #475569; width: 80%; margin: 0 auto 4px auto; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td width="20%"><strong style="font-size:16px; color:#0284c7;">OCA ONE</strong><br/>Lácteos Río Grande SAS</td>
            <td width="60%" class="header-title">
              PROCEDIMIENTO PARA LA LIBERACIÓN DE PRODUCTOS TERMINADOS Y CONTROL DE LOTES
            </td>
            <td width="20%">
              <strong>CÓDIGO:</strong> Q-PD-15<br/>
              <strong>VERSIÓN:</strong> 01<br/>
              <strong>VIGENCIA:</strong> 16/10/2020
            </td>
          </tr>
        </table>

        <div class="section-title">1. OBJETIVO Y ALCANCE</div>
        <p><strong>OBJETIVO:</strong> Dar a conocer los elementos fundamentales a considerar y el buen desempeño de la liberación de lotes de los productos procesados, empacados y comercializados por Lácteos Río Grande SAS.</p>
        <p><strong>ALCANCE:</strong> Aplica a todos los procesos y controles realizados desde la recepción de materias primas hasta la entrega de producto terminado.</p>

        <div class="section-title">2. DEFINICIONES NORMATIVAS (RESOLUCIÓN 5109)</div>
        <ul>
          <li><strong>Lote:</strong> Cantidad determinada de unidades de un alimento producidas en condiciones esencialmente iguales.</li>
          <li><strong>Contenido Neto:</strong> Cantidad de producto sin considerar el empaque.</li>
          <li><strong>Fecha Límite de Utilización:</strong> Fecha de vencimiento fijada por el laboratorio tras pruebas de vida útil.</li>
          <li><strong>Trazabilidad:</strong> Capacidad de rastrear la historia del producto desde el establo hasta el cliente final.</li>
        </ul>

        <div class="section-title">3. REGISTROS DE LIBERACIÓN DE LOTES (FOPD-15-01)</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Código de Lote</th>
              <th>Producto</th>
              <th>pH / Humedad</th>
              <th>Dictamen microbiológico</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            ${registrosLiberacion.map(r => `
              <tr>
                <td>${r.fecha}</td>
                <td><strong>${r.lote}</strong></td>
                <td>${r.producto}</td>
                <td>pH: ${r.phPrueba} | Hum: ${r.humedad}</td>
                <td>${r.microbiologico}</td>
                <td><strong>${r.estado}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="footer-signatures">
          <tr>
            <td width="50%">
              <div class="line"></div>
              <strong>Elaboró:</strong><br/>
              Oscar Andrés Serrano León / Analista Q.A.
            </td>
            <td width="50%">
              <div class="line"></div>
              <strong>Aprobó:</strong><br/>
              Mauricio Múnera / Jefe de Producción
            </td>
          </tr>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="fade-in-view">
      {/* Alerta de Éxito */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-check-circle-fill me-2"></i>¡Lote Liberado Exitosamente!</strong> El registro FOPD-15-01 ha sido indexado en la bitácora de trazabilidad.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)}></button>
        </div>
      )}

      {/* Banner Encabezado Módulo Liberación de Lotes */}
      <div className="d-flex align-items-center justify-content-between p-3 mb-4 rounded-3 border bg-body shadow-sm border-start border-5 border-info">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-sky" style={{ width: '44px', height: '44px', fontSize: '22px' }}>
            <i className="bi bi-box-seam-fill"></i>
          </div>
          <div>
            <div className="fw-bold font-heading text-dark" style={{ fontSize: '17px' }}>
              Módulo de Liberación de Productos Terminados (Q-PD-15)
            </div>
            <div className="text-muted small">
              Sistema de liberación de lotes, control de vida útil y trazabilidad según Res. 5109 e ISO 22000.
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-info d-flex align-items-center gap-2 fw-semibold"
            onClick={() => setMostrarTextoCompleto(true)}
          >
            <i className="bi bi-file-earmark-pdf-fill"></i> 📖 Leer Documento Completo PDF
          </button>
          {canDownloadPDF && (
            <button 
              className="btn btn-sm btn-info text-white d-flex align-items-center gap-2 fw-semibold"
              onClick={handlePrintDocumentoOficial}
            >
              <i className="bi bi-printer-fill"></i> PDF Oficial Q-PD-15
            </button>
          )}
        </div>
      </div>

      {/* Navegación por Secciones */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {[
          { id: 'objetivo', label: '1. Objetivo y Responsabilidades', icon: 'bi-bullseye' },
          { id: 'definiciones', label: '2. Definiciones de Rotulado (Res. 5109)', icon: 'bi-tags-fill' },
          { id: 'trazabilidad_costeno', label: '3. Ruta Trazabilidad Queso Costeño', icon: 'bi-journal-code' },
          { id: 'trazabilidad_mozzarella', label: '4. Ruta Trazabilidad Queso Mozzarella', icon: 'bi-diagram-2' },
          { id: 'bitacora', label: '5. Bitácora de Liberación (FOPD-15-01)', icon: 'bi-clipboard-check-fill' }
        ].map(btn => (
          <button
            key={btn.id}
            className={`btn btn-sm ${seccionActiva === btn.id ? 'btn-info text-white fw-bold shadow-sm' : 'btn-outline-secondary'}`}
            onClick={() => setSeccionActiva(btn.id)}
            style={{ borderRadius: '8px', fontSize: '12.5px' }}
          >
            <i className={`bi ${btn.icon} me-1`}></i> {btn.label}
          </button>
        ))}
      </div>

      {/* VISTA 1: OBJETIVO Y RESPONSABILIDADES */}
      {seccionActiva === 'objetivo' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-info mb-3 border-bottom pb-2">
            <i className="bi bi-bookmark-star-fill me-2"></i>1. Objetivo, Alcance y Matriz de Responsabilidades
          </h4>
          <div className="row g-3 text-dark small mb-3">
            <div className="col-12 col-md-6 border-end">
              <h6 className="fw-bold text-dark"><i className="bi bi-target me-1 text-info"></i> 1. OBJETIVO:</h6>
              <p style={{ textAlign: 'justify' }}>
                Dar a conocer los elementos fundamentales a considerar y el buen desempeño de la liberación de lotes de los productos procesados, empacados y comercializados por la empresa Lácteos Río Grande SAS.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark"><i className="bi bi-compass me-1 text-info"></i> 2. ALCANCE:</h6>
              <p style={{ textAlign: 'justify' }}>
                El procedimiento aplica a todos los procesos y controles realizados desde la recepción de las materias primas hasta la entrega de producto terminado en la planta de proceso.
              </p>
            </div>
          </div>

          <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-person-check-fill me-2 text-info"></i>Responsabilidades por Cargo:</h6>
          <div className="row g-3">
            {[
              { r: '2.1. Jefe de Producción / Analista de Laboratorio', d: 'Responsables de la vigencia del documento, control e implementación de los POES y conservación de registros de BPM.' },
              { r: '2.2. Analista Q.A. / Calidad', d: 'Realizar todos los controles y generar los registros que correspondan para garantizar la trazabilidad del producto y tomar acciones correctivas eficaces.' },
              { r: '2.3. Manipuladores de Alimentos / Operativos', d: 'Cumplir con todos los controles definidos en los planes de calidad estandarizados para cada producto, registrando datos con legibilidad.' }
            ].map((resp, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="p-3 bg-light rounded-3 border h-100">
                  <strong className="text-info d-block mb-1">{resp.r}:</strong>
                  <span className="text-muted small">{resp.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: DEFINICIONES ROTULADO RES. 5109 */}
      {seccionActiva === 'definiciones' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-info mb-3 border-bottom pb-2">
            <i className="bi bi-tags-fill me-2"></i>2. Definiciones de Loteado y Rotulado (Resolución 5109)
          </h4>

          <div className="row g-2">
            {[
              { t: 'Contenido Neto', d: 'Cantidad de producto sin considerar la masa (tara) o volumen del empaque primario.' },
              { t: 'Declaración de Propiedades', d: 'Cualquier representación que afirme o implique que un alimento tiene cualidades nutricionales especiales.' },
              { t: 'Envase Primario', d: 'Recipiente que contiene el alimento para su entrega como producto único al consumidor.' },
              { t: 'Fecha de Duración Mínima', d: '“Consumir preferentemente antes de” - Fecha fijada que indica el fin del periodo de máxima calidad organoléptica.' },
              { t: 'Fecha Límite de Utilización', d: '“Fecha de vencimiento” - Fecha fijada en que termina el periodo después del cual el producto no tendrá sus atributos de inocuidad.' },
              { t: 'Lote (Res. 5109)', d: 'Cantidad determinada de unidades de un alimento producidas en condiciones esencialmente iguales.' },
              { t: 'Materia Prima', d: 'Sustancias naturales o elaboradas empleadas en la fabricación del alimento que permanecen en el producto final.' },
              { t: 'Trazabilidad', d: 'Capacidad para seguir la historia, aplicación o localización de todo insumo y producto procesado.' }
            ].map((d, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 border h-100">
                  <strong className="text-info d-block mb-1">{d.t}:</strong>
                  <span className="text-muted small">{d.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: TRAZABILIDAD QUESO COSTEÑO */}
      {seccionActiva === 'trazabilidad_costeno' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-info mb-3 border-bottom pb-2">
            <i className="bi bi-journal-code me-2"></i>3. Ruta de Trazabilidad - Queso Costeño (Bloque / Picado)
          </h4>
          <p className="text-muted small mb-3">
            Matriz estandarizada de puntos de control, parámetros de proceso y registros asociados para Queso Costeño.
          </p>

          <div className="table-responsive">
            <table className="table table-bordered align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Etapa del Proceso</th>
                  <th>Control / Parámetro Crítico</th>
                  <th>Registro Oficial Asociado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { e: '1. RECEPCIÓN Y ACOPIO', c: 'Cumplimiento BPM, Acidez 14-18°D, Temp < 10°C, Prueba de alcohol negativa, Reductasa > 4h.', r: 'FOR-RC-01 Registro Recepción' },
                  { e: '2. FILTRACIÓN Y PASTEURIZACIÓN', c: 'Pasteurización a 72°C durante 15 segundos o 65°C x 30 min.', r: 'FOR-PT-02 Graficador Pasteurizador' },
                  { e: '3. CUAJADO Y CORTE', c: 'Temp: 32°C - 35°C, Adición de cuajo y cloruro de calcio. Tiempo de reposo: 30-40 min.', r: 'FOPD-15-01 Hoja de Marmita' },
                  { e: '4. DESUERADO Y SALADO', c: 'Adición de sal marina limpia (2.0% - 2.5% p/p). Mezcla homogénea.', r: 'FOPD-15-01 Control de Salado' },
                  { e: '5. PRENSADO Y MOLDEO', c: 'Presión constante por 4-6 horas. Reducción de suero remanente.', r: 'Control de Prensado' },
                  { e: '6. EMPAQUE AL VACÍO Y LOTEADO', c: 'Verificación de sello térmico al vacío. Impresión de lote L-AAAAMMDD.', r: 'FOPD-15-01 Registro Liberación' },
                  { e: '7. ALMACENAMIENTO EN FRÍO', c: 'Temperatura: 0°C a 4°C +/- 2°C. Control de rotación FIFO.', r: 'FOR-CF-03 Registro Temperatura Frío' }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">{row.e}</td>
                    <td>{row.c}</td>
                    <td><span className="badge bg-secondary">{row.r}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 4: TRAZABILIDAD QUESO MOZZARELLA */}
      {seccionActiva === 'trazabilidad_mozzarella' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-info mb-3 border-bottom pb-2">
            <i className="bi bi-diagram-2 me-2"></i>4. Ruta de Trazabilidad - Queso Mozzarella (Bloque / Tajado)
          </h4>

          <div className="table-responsive">
            <table className="table table-bordered align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Etapa del Proceso</th>
                  <th>Control / Parámetro Crítico (PCC)</th>
                  <th>Registro Oficial Asociado</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { e: '1. RECEPCIÓN Y ESTANDARIZACIÓN', c: 'Ajuste de relación Grasa/Proteína (1.0 - 1.1). Temp < 8°C.', r: 'FOR-RC-01 Recepción' },
                  { e: '2. PASTEURIZACIÓN', c: 'Temp: 72°C x 15s. Verificación de desvío automático de flujo.', r: 'FOR-PT-02 Registrador' },
                  { e: '3. INOCULACIÓN Y CUAJADO', c: 'Cultivo láctico termófilo. Temp: 38°C - 42°C. Tiempo: 5 minutos.', r: 'FOPD-15-01 Marmita' },
                  { e: '4. HILADO TERMOMECÁNICO', c: 'Temperatura del agua de hilado: 75°C - 80°C. Texturización de masa.', r: 'FOPD-15-01 Control Hiladora' },
                  { e: '5. MOLDEO Y SALMUERA', c: 'Enfriamiento en agua helada (2°C-4°C). Inmersión en salmuera a 18-20°Bé.', r: 'Control Salmuera' },
                  { e: '6. EMPAQUE AL VACÍO Y REFRIGERACIÓN', c: 'Sello al vacío termoencogible. Almacenamiento a 0°C - 4°C por 12 horas.', r: 'FOPD-15-01 Registro Liberación' }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">{row.e}</td>
                    <td>{row.c}</td>
                    <td><span className="badge bg-secondary">{row.r}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 5: BITÁCORA DIGITAL FOPD-15-01 */}
      {seccionActiva === 'bitacora' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold font-heading text-info mb-1">
                <i className="bi bi-clipboard-check-fill me-2"></i>5. Bitácora de Liberación de Lotes (FOPD-15-01)
              </h4>
              <p className="text-muted small mb-0">Formato oficial de aprobación microbiológica, fisicoquímica y rotulado de lotes.</p>
            </div>
            <button 
              className="btn btn-sm btn-info text-white d-flex align-items-center gap-2 fw-semibold"
              onClick={() => setMostrarFormularioLiberacion(prev => !prev)}
            >
              <i className="bi bi-plus-circle"></i> {mostrarFormularioLiberacion ? 'Cerrar Formulario' : 'Liberar Nuevo Lote de Planta'}
            </button>
          </div>

          {/* Formulario de Liberación */}
          {mostrarFormularioLiberacion && (
            <form onSubmit={handleCrearRegistro} className="border p-4 rounded-3 bg-light bg-opacity-50 mb-4 fade-in-view" style={{ fontSize: '13px' }}>
              <h5 className="fw-bold text-info font-heading mb-3">
                <i className="bi bi-journal-plus me-2"></i>Nuevo Dictamen de Liberación de Producto Terminado
              </h5>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold small">Código de Lote</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm fw-bold" 
                    value={loteCodigo}
                    onChange={(e) => setLoteCodigo(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label fw-semibold small">Producto</label>
                  <select 
                    className="form-select form-select-sm"
                    value={productoSeleccionado}
                    onChange={(e) => setProductoSeleccionado(e.target.value)}
                  >
                    <option value="Queso Costeño Bloque 500g">Queso Costeño Bloque 500g</option>
                    <option value="Queso Costeño Picado 1000g">Queso Costeño Picado 1000g</option>
                    <option value="Queso Mozzarella Tajado 250g">Queso Mozzarella Tajado 250g</option>
                    <option value="Queso Mozzarella Bloque 2500g">Queso Mozzarella Bloque 2500g</option>
                  </select>
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label fw-semibold small">pH Medido</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={phValor}
                    onChange={(e) => setPhValor(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label fw-semibold small">Humedad (%)</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={humedadValor}
                    onChange={(e) => setHumedadValor(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label fw-semibold small">Estado Dictamen</label>
                  <select 
                    className="form-select form-select-sm fw-bold"
                    value={estadoLiberacion}
                    onChange={(e) => setEstadoLiberacion(e.target.value)}
                  >
                    <option value="Aprobado y Liberado">Aprobado y Liberado</option>
                    <option value="En Cuarentena / Pendiente Lab">En Cuarentena / Pendiente Lab</option>
                    <option value="Rechazado / No Conforme">Rechazado / No Conforme</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Observaciones y Verificación de Rotulado Res. 5109</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Ej: Empaque sin fuga de vacío, rotulado con fecha de vencimiento clara"
                  value={observacionesInput}
                  onChange={(e) => setObservacionesInput(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarFormularioLiberacion(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-info text-white px-3 fw-semibold">
                  <i className="bi bi-save me-1"></i> Guardar Dictamen FOPD-15-01
                </button>
              </div>
            </form>
          )}

          {/* Tabla de Registros */}
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0" style={{ fontSize: '12.5px' }}>
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Código de Lote</th>
                  <th>Producto</th>
                  <th>Laboratorio (pH / Humedad)</th>
                  <th>Dictamen Microbiológico</th>
                  <th>Estado Dictamen</th>
                  <th>Responsable Q.A.</th>
                </tr>
              </thead>
              <tbody>
                {registrosLiberacion.map(r => (
                  <tr key={r.id}>
                    <td>{r.fecha}</td>
                    <td className="fw-bold text-info">{r.lote}</td>
                    <td className="fw-bold text-dark">{r.producto}</td>
                    <td className="small">pH: <strong>{r.phPrueba}</strong> | Hum: <strong>{r.humedad}</strong></td>
                    <td className="small text-muted">{r.microbiologico}</td>
                    <td>
                      <span className={`badge ${r.estado.includes('Aprobado') ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="small">{r.responsable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Lector Completo del Documento PDF (Q-PD-15) Formateado en Hoja Limpia ISO */}
      {mostrarTextoCompleto && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '18px' }}>
              <div className="modal-header bg-info text-white border-0" style={{ borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-file-pdf-fill"></i> Documento Oficial PDF: Procedimiento para la Liberación de Productos Terminados
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarTextoCompleto(false)}></button>
              </div>

              <div className="modal-body p-4 bg-light" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
                <div className="bg-white p-5 shadow-sm rounded-3 border mx-auto" style={{ maxWidth: '920px' }}>
                  {/* Encabezado Oficial ISO del Documento */}
                  <table className="table table-bordered align-middle text-center mb-4 small border-secondary">
                    <tbody>
                      <tr>
                        <td width="20%" className="fw-bold text-info fs-5 align-middle">LÁCTEOS RÍO GRANDE</td>
                        <td width="60%" className="fw-bold align-middle text-uppercase">
                          PROCEDIMIENTO PARA LA LIBERACIÓN DE PRODUCTOS TERMINADOS Y CONTROL DE LOTES
                        </td>
                        <td width="20%" className="text-start small align-middle">
                          <strong>CÓDIGO:</strong> Q-PD-15<br/>
                          <strong>VERSIÓN:</strong> 01<br/>
                          <strong>VIGENCIA:</strong> 16/10/2020
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Sección 1: Objetivo y Alcance */}
                  <div className="mb-4">
                    <h5 className="fw-bold text-info border-bottom pb-1 font-heading">1. OBJETIVO</h5>
                    <p className="text-dark mb-3" style={{ textAlign: 'justify' }}>
                      Dar a conocer los elementos fundamentales a considerar y el buen desempeño de la liberación de lotes de los productos procesados, empacados y comercializados por la empresa Lácteos Río Grande SAS.
                    </p>

                    <h5 className="fw-bold text-info border-bottom pb-1 font-heading">2. ALCANCE Y RESPONSABILIDADES</h5>
                    <p className="text-dark mb-2" style={{ textAlign: 'justify' }}>
                      El procedimiento aplica a todos los procesos y controles realizados desde la recepción de las materias primas hasta la entrega de producto terminado en Lácteos Río Grande SAS.
                    </p>
                    <ul className="text-dark small">
                      <li><strong>2.1. Jefe de Producción / Analista de Laboratorio:</strong> Responsable de la vigencia del documento y el control de implementación de todos los POES.</li>
                      <li><strong>2.2. Analista Q.A. / Calidad:</strong> Responsable de realizar todos los controles y generar los registros para garantizar la trazabilidad.</li>
                      <li><strong>2.3. Manipuladores de Alimentos:</strong> Cumplimiento estricto de los controles definidos en los planes de calidad.</li>
                    </ul>
                  </div>

                  {/* Sección 3: Definiciones */}
                  <div className="mb-4">
                    <h5 className="fw-bold text-info border-bottom pb-1 font-heading">3. DEFINICIONES NORMATIVAS (RESOLUCIÓN 5109)</h5>
                    <div className="row g-2 text-dark small">
                      <div className="col-12 col-md-6"><strong>Contenido Neto:</strong> Cantidad de producto sin considerar la masa del empaque.</div>
                      <div className="col-12 col-md-6"><strong>Fecha de Duración Mínima:</strong> Fecha límite para máxima calidad organoléptica.</div>
                      <div className="col-12 col-md-6"><strong>Lote:</strong> Cantidad de unidades producidas en condiciones esencialmente iguales.</div>
                      <div className="col-12 col-md-6"><strong>Trazabilidad:</strong> Capacidad para seguir la historia del alimento desde el origen.</div>
                    </div>
                  </div>

                  {/* Tabla 2 Oficial: Matriz de Control e Inspección en Recepción */}
                  <div className="my-4">
                    <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-table me-2 text-info"></i>Tabla de Control de Recepción de Insumos y Materia Prima</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle small mb-0 bg-white">
                        <thead className="table-dark">
                          <tr>
                            <th>Etapa / Ruta</th>
                            <th>Control Realizado</th>
                            <th>Frecuencia</th>
                            <th>Parámetros de Calidad</th>
                            <th>Registro Oficial</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="fw-bold">Recepción Leche Cruda</td>
                            <td>Prueba de Alcohol, Acidez, Grasa, Densidad, Antibióticos</td>
                            <td>Diario (Cada Carro Cister)</td>
                            <td>Acidez: 14-18°D | Temp: &lt; 10°C | Alcohol: Negativo</td>
                            <td><span className="badge bg-secondary">Q-FR-25 Registro Ruta</span></td>
                          </tr>
                          <tr>
                            <td className="fw-bold">Recepciones Insumos / Empaque</td>
                            <td>Inspección de sello, certificación de grado alimenticio, vida útil</td>
                            <td>Cada Despacho</td>
                            <td>FT-01 Ficha Técnica de Empaque</td>
                            <td><span className="badge bg-secondary">Q-FR-21 Control Insumos</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tabla de Rutas de Trazabilidad: Queso Costeño y Mozzarella */}
                  <div className="my-4">
                    <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-diagram-3-fill me-2 text-info"></i>Matriz de Puntos Críticos y Trazabilidad por Producto</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle small mb-0 bg-white">
                        <thead className="table-light">
                          <tr>
                            <th>Producto</th>
                            <th>Etapa del Proceso</th>
                            <th>Temperatura / Parámetro Crítico</th>
                            <th>Tiempo / Especificación</th>
                            <th>Registro de Control</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td rowSpan="3" className="fw-bold align-middle bg-light">Queso Costeño</td>
                            <td>Pasteurización</td>
                            <td>72°C +/- 1°C</td>
                            <td>15 segundos (Flujo continuo)</td>
                            <td>FOR-PT-02 Graficador</td>
                          </tr>
                          <tr>
                            <td>Cuajado y Salado</td>
                            <td>32°C - 35°C | Sal: 2.0% - 2.5%</td>
                            <td>Reposo: 35 min | Salado: 15 min</td>
                            <td>FOPD-15-01 Marmita</td>
                          </tr>
                          <tr>
                            <td>Almacenamiento Frío</td>
                            <td>0°C a 4°C +/- 2°C</td>
                            <td>Temperatura máxima 6°C</td>
                            <td>FOR-CF-03 Control Frío</td>
                          </tr>
                          <tr>
                            <td rowSpan="3" className="fw-bold align-middle bg-light">Queso Mozzarella</td>
                            <td>Inoculación y Cuajado</td>
                            <td>38°C - 42°C</td>
                            <td>Inoculo: 5 min | Reposo: 35 min</td>
                            <td>FOPD-15-01 Marmita</td>
                          </tr>
                          <tr>
                            <td>Hilado y Salmuera</td>
                            <td>Agua: 75°C-80°C | Salmuera: 18-20°Bé</td>
                            <td>Enfriamiento: 4h a 2°C-4°C</td>
                            <td>Control Salmuera</td>
                          </tr>
                          <tr>
                            <td>Empaque y Cuarto Frío</td>
                            <td>Empaque al Vacío | Temp: 0°C a 4°C</td>
                            <td>Tajado Max 10°C | Bloque Max 6°C</td>
                            <td>FOPD-15-01 Liberación</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tabla 11 Oficial: Control de Registros */}
                  <div className="my-4">
                    <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-folder-check me-2 text-info"></i>Tabla 10: Control de Registros y Tiempos de Archivo</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle small mb-0 bg-white">
                        <thead className="table-light">
                          <tr>
                            <th>Código del Registro</th>
                            <th>Ubicación del Archivo</th>
                            <th>Responsable</th>
                            <th>Tiempo de Retención</th>
                            <th>Disposición Final</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>Q-FR-25 Control Leche Cruda</strong></td>
                            <td>Carpeta Manual de Calidad</td>
                            <td>Analista de Laboratorio</td>
                            <td>1 Año</td>
                            <td>Reciclaje</td>
                          </tr>
                          <tr>
                            <td><strong>Q-FR-26 Control Producto Terminado</strong></td>
                            <td>Carpeta Control de Proceso</td>
                            <td>Jefe de Producción</td>
                            <td>1 Año (Vida Útil + 6 meses)</td>
                            <td>Reciclaje</td>
                          </tr>
                          <tr>
                            <td><strong>Q-FR-21 Control de Despachos</strong></td>
                            <td>Oficina de Logística</td>
                            <td>Auxiliar de Despachos</td>
                            <td>1 Año</td>
                            <td>Reciclaje</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 p-3 bg-light" style={{ borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
                <button type="button" className="btn btn-info text-white btn-sm px-4 fw-bold" onClick={() => setMostrarTextoCompleto(false)}>
                  Entendido / Cerrar Lector Q-PD-15
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
