import React, { useState, useEffect } from 'react';
import { canUserDownloadProcedure, canUserWriteInModule } from '../lib/permissions';
import { RECEPCION_MATERIAS_PRIMAS_TEXT, RECEPCION_MATERIAS_PRIMAS_TABLES } from '../domain/recepcionMateriasPrimasFullText';

export default function RecepcionMateriasPrimas({ tenantId = 'tenant-opt-01', userRole = 'super-admin', carpetaActiva, setCarpetaActiva }) {
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('fisicoquimico');
  const [mostrarFormularioRecepcion, setMostrarFormularioRecepcion] = useState(false);
  const [alertaExito, setAlertaExito] = useState(false);

  // Registros de Recepción de Leche en Plataforma (Q-FR-25)
  const [registrosRecepcion, setRegistrosRecepcion] = useState([
    {
      id: 1,
      fecha: '2026-08-11',
      proveedor: 'Ruta 01 - Hato San José (Don Pedro Gómez)',
      volumen: '3.400 Litros',
      temperatura: '6.5°C',
      acidez: 0.15, // % ácido láctico
      densidad: 1.0315,
      pruebaAlcohol: '75% v/v - Negativa (Sin grumos)',
      antibioticos: 'Ausente (Prueba rápida Beta-lactámicos Negativa)',
      organoleptico: 'Conforme (Color blanco cremoso, olor característico)',
      responsable: 'Oscar Serrano / Analista Q.A.',
      dictamen: 'Aceptado y Tanqueado'
    },
    {
      id: 2,
      fecha: '2026-08-11',
      proveedor: 'Ruta 03 - Vereda La Esmeralda',
      volumen: '1.800 Litros',
      temperatura: '11.2°C',
      acidez: 0.19, // Fuera de rango (>0.17%)
      densidad: 1.0285,
      pruebaAlcohol: '75% v/v - Positiva (Presencia de grumos)',
      antibioticos: 'Ausente',
      organoleptico: 'Olor acidificado',
      responsable: 'Oscar Serrano / Analista Q.A.',
      dictamen: 'Rechazado (Exceso Acidez y Temp)'
    }
  ]);

  // Formulario nuevo registro
  const [proveedorInput, setProveedorInput] = useState('Ruta 02 - Hato El Recuerdo');
  const [volumenInput, setVolumenInput] = useState('2.500 Litros');
  const [temperaturaInput, setTemperaturaInput] = useState('7.0');
  const [acidezInput, setAcidezInput] = useState('0.16');
  const [densidadInput, setDensidadInput] = useState('1.031');
  const [antibioticosInput, setAntibioticosInput] = useState('Ausente');
  const [dictamenInput, setDictamenInput] = useState('Aceptado y Tanqueado');

  const canDownloadPDF = canUserDownloadProcedure(userRole);

  // Sincronización desde el menú del Sidebar
  useEffect(() => {
    if (!carpetaActiva) return;
    const mapaSecciones = {
      'Objetivo y Responsabilidades': 'objetivo',
      'Parámetros Fisicoquímicos': 'fisicoquimico',
      'Criterios Microbiológicos': 'microbiologico',
      'Recepción de Empaques': 'empaques',
      'Formato Plataforma Q-FR-25': 'plataforma'
    };
    if (mapaSecciones[carpetaActiva]) {
      setSeccionActiva(mapaSecciones[carpetaActiva]);
    }
  }, [carpetaActiva]);

  const handleCrearRecepcion = (e) => {
    e.preventDefault();
    if (!proveedorInput.trim()) return;

    const acidezNum = parseFloat(acidezInput) || 0.15;
    const tempNum = parseFloat(temperaturaInput) || 7.0;
    const esRechazado = acidezNum > 0.17 || tempNum > 10.0 || antibioticosInput === 'Presente';

    const nuevo = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      proveedor: proveedorInput.trim(),
      volumen: volumenInput.trim(),
      temperatura: `${tempNum}°C`,
      acidez: acidezNum,
      densidad: parseFloat(densidadInput) || 1.031,
      pruebaAlcohol: esRechazado ? 'Positiva (Grumos)' : '75% v/v - Negativa',
      antibioticos: antibioticosInput,
      organoleptico: esRechazado ? 'Parámetros fuera de especificación' : 'Conforme (Normal)',
      responsable: 'Oscar Serrano / Analista Q.A.',
      dictamen: esRechazado ? 'Rechazado' : dictamenInput
    };

    setRegistrosRecepcion(prev => [nuevo, ...prev]);
    setProveedorInput('');
    setMostrarFormularioRecepcion(false);
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
        <title>Q-PD-13 - Procedimiento para la Recepción de Materias Primas e Insumos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.5; font-size: 12px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .header-table td { border: 1px solid #334155; padding: 8px; text-align: center; font-size: 11px; }
          .header-title { font-size: 13px; font-weight: bold; text-transform: uppercase; }
          .section-title { font-weight: bold; background: #ecfdf5; color: #047857; padding: 6px; margin-top: 15px; border-left: 4px solid #10b981; }
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
            <td width="20%"><strong style="font-size:16px; color:#10b981;">OCA ONE</strong><br/>Lácteos Río Grande SAS</td>
            <td width="60%" class="header-title">
              PROCEDIMIENTO PARA LA RECEPCIÓN DE MATERIAS PRIMAS E INSUMOS
            </td>
            <td width="20%">
              <strong>CÓDIGO:</strong> Q-PD-13<br/>
              <strong>VERSIÓN:</strong> 01<br/>
              <strong>VIGENCIA:</strong> 16/10/2020
            </td>
          </tr>
        </table>

        <div class="section-title">1. OBJETIVO Y ALCANCE</div>
        <p><strong>OBJETIVO:</strong> Garantizar la conformidad de las materias primas e insumos que se compran y reciben mediante muestreo y verificación de calidad.</p>
        <p><strong>ALCANCE:</strong> Aplica desde la recepción de leche cruda y materiales de empaque e insumos hasta el almacenamiento y despacho; bajo el Decreto 3075/1997 y Res. 2674/2013.</p>

        <div class="section-title">2. ESPECIFICACIONES FISICOQUÍMICAS DE LECHE CRUDA (RES. 000017 DE 2012)</div>
        <table class="data-table">
          <thead>
            <tr><th>Parámetro / Unidad</th><th>Valor Especificado</th><th>Límite Permisible</th></tr>
          </thead>
          <tbody>
            <tr><td>Grasa % m/v mínimo</td><td>3.00%</td><td>Mínimo 3.0%</td></tr>
            <tr><td>Extracto Seco Total % m/m</td><td>11.30%</td><td>Mínimo 11.30%</td></tr>
            <tr><td>Acidez (% Ácido Láctico)</td><td>0.13 - 0.17%</td><td>Máximo 0.17%</td></tr>
            <tr><td>Densidad 15/15°C g/ml</td><td>1.030 - 1.033</td><td>1.030 a 1.033</td></tr>
            <tr><td>Prueba de Alcohol 75% v/v</td><td>Negativa</td><td>Sin grumos</td></tr>
            <tr><td>Antibióticos / Adulterantes</td><td>Ausencia Total</td><td>Cero tolerancia</td></tr>
          </tbody>
        </table>

        <div class="section-title">3. REGISTROS DE CONTROL EN PLATAFORMA (Q-FR-25)</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Proveedor / Ruta</th>
              <th>Volumen</th>
              <th>Temp / Acidez</th>
              <th>Antibióticos</th>
              <th>Dictamen Final</th>
            </tr>
          </thead>
          <tbody>
            ${registrosRecepcion.map(r => `
              <tr>
                <td>${r.fecha}</td>
                <td><strong>${r.proveedor}</strong></td>
                <td>${r.volumen}</td>
                <td>${r.temperatura} | Acidez: ${r.acidez}%</td>
                <td>${r.antibioticos}</td>
                <td><strong>${r.dictamen}</strong></td>
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
          <strong><i className="bi bi-check-circle-fill me-2"></i>¡Control de Recepción Registrado!</strong> El análisis Q-FR-25 ha sido indexado en la bitácora de plataforma.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)}></button>
        </div>
      )}

      {/* Banner Encabezado Módulo Recepción Materias Primas */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 mb-4 rounded-3 border bg-body shadow-sm border-start border-5 border-success">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-emerald" style={{ width: '44px', height: '44px', fontSize: '22px' }}>
            <i className="bi bi-truck-front-fill"></i>
          </div>
          <div>
            <div className="fw-bold font-heading text-dark" style={{ fontSize: '17px' }}>
              Módulo de Recepción de Materias Primas e Insumos (Q-PD-13)
            </div>
            <div className="text-muted small">
              Verificación de acopio de leche cruda, empaques e insumos bajo Res. 2674/2013 y Res. 017/2012.
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <span className="badge bg-light text-dark border px-3 py-2 fw-semibold" style={{ fontSize: '12px' }}>
            <i className="bi bi-folder-fill me-1 text-warning"></i> Carpeta: {carpetaActiva || 'Recepción Primas (Q-PD-13)'}
          </span>
          <button 
            className="btn btn-sm btn-outline-success d-flex align-items-center gap-2 fw-semibold"
            onClick={() => setMostrarTextoCompleto(true)}
          >
            <i className="bi bi-file-earmark-pdf-fill"></i> 📖 Leer Documento Completo PDF
          </button>
          {canDownloadPDF && (
            <button 
              className="btn btn-sm btn-success text-white d-flex align-items-center gap-2 fw-semibold"
              onClick={handlePrintDocumentoOficial}
            >
              <i className="bi bi-printer-fill"></i> PDF Oficial Q-PD-13
            </button>
          )}
        </div>
      </div>

      {/* Navegación por Secciones */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {[
          { id: 'objetivo', label: '1. Objetivo y Responsabilidades', icon: 'bi-bullseye' },
          { id: 'fisicoquimico', label: '2. Parámetros Fisicoquímicos Leche', icon: 'bi-droplet-half' },
          { id: 'microbiologico', label: '3. Criterios Microbiológicos y Muestreo', icon: 'bi-bug-fill' },
          { id: 'empaques', label: '4. Recepción de Empaques e Insumos', icon: 'bi-box-seam' },
          { id: 'plataforma', label: '5. Formato Plataforma (Q-FR-25)', icon: 'bi-journal-check' }
        ].map(btn => (
          <button
            key={btn.id}
            className={`btn btn-sm ${seccionActiva === btn.id ? 'btn-success text-white fw-bold shadow-sm' : 'btn-outline-secondary'}`}
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
          <h4 className="fw-bold font-heading text-success mb-3 border-bottom pb-2">
            <i className="bi bi-bookmark-check-fill me-2"></i>1. Objetivo, Alcance y Matriz de Responsabilidades
          </h4>
          <div className="row g-3 text-dark small mb-3">
            <div className="col-12 col-md-6 border-end">
              <h6 className="fw-bold text-dark"><i className="bi bi-target me-1 text-success"></i> 1. OBJETIVO:</h6>
              <p style={{ textAlign: 'justify' }}>
                Garantizar la conformidad de las materias primas e insumos que se compran y reciben mediante el muestreo y verificación de los requisitos de calidad estandarizados para su recepción.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark"><i className="bi bi-compass me-1 text-success"></i> 2. ALCANCE:</h6>
              <p style={{ textAlign: 'justify' }}>
                Aplica desde la recepción de la leche cruda y materiales de empaque e insumos hasta el almacenamiento y despacho del producto terminado, regulado por el Decreto 3075/1997 y la Resolución 2674 de 2013.
              </p>
            </div>
          </div>

          <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-person-check-fill me-2 text-success"></i>Responsabilidades por Cargo:</h6>
          <div className="row g-3">
            {[
              { r: '3.1. Aseguramiento de Calidad', d: 'Define todos los procedimientos operativos estandarizados, los documenta, implementa y les hace seguimiento.' },
              { r: '3.2. Analista de Laboratorio / Jefe de Producción', d: 'Realizar y hacer cumplir todos los controles planificados para garantizar el cumplimiento de BPM.' },
              { r: '3.3. Manipuladores de Alimentos', d: 'Cumplir con todos los lineamientos dados en los POES y direccionados por su superior.' }
            ].map((resp, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="p-3 bg-light rounded-3 border h-100">
                  <strong className="text-success d-block mb-1">{resp.r}:</strong>
                  <span className="text-muted small">{resp.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: PARÁMETROS FISICOQUÍMICOS LECHE CRUDA */}
      {seccionActiva === 'fisicoquimico' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-success mb-3 border-bottom pb-2">
            <i className="bi bi-droplet-half me-2"></i>2. Especificaciones Fisicoquímicas de Leche Cruda
          </h4>
          <p className="text-muted small mb-3">
            Valores estándar obligatorios de recepción en plataforma según Resolución 000017 de 2012 y Res. 2310 de 1986.
          </p>

          <div className="table-responsive mb-4">
            <table className="table table-bordered align-middle small mb-0">
              <thead className="table-dark text-center">
                <tr>
                  <th>Parámetro Tecnológico</th>
                  <th>Valor Mínimo</th>
                  <th>Valor Máximo</th>
                  <th>Criterio de Tolerancia</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { p: 'Grasa (% m/v)', min: '3.00%', max: '-------', c: 'Rechazo si < 3.0%' },
                  { p: 'Extracto Seco Total (EST % m/m)', min: '11.30%', max: '-------', c: 'Rechazo si < 11.30%' },
                  { p: 'Extracto Seco Desengrasado (ESD % m/m)', min: '8.30%', max: '-------', c: 'Rechazo si < 8.30%' },
                  { p: 'Acidez (% Ácido Láctico)', min: '0.13%', max: '0.17%', c: 'Rechazo inmediato si > 0.17%' },
                  { p: 'Densidad a 15/15°C (g/ml)', min: '1.030', max: '1.033', c: 'Fuera de rango indica aguado o desnatado' },
                  { p: 'Índice Crioscópico (°H)', min: '-0.550', max: '-0.530', c: 'Determinación de adición de agua' },
                  { p: 'Estabilidad Proteica (Prueba Alcohol)', min: '75% v/v', max: 'Sin grumos', c: 'Coagulación indica acidez o inestabilidad' },
                  { p: 'Antibióticos (Beta-lactámicos/Tetraciclinas)', min: 'Ausencia', max: 'Ausencia', c: 'Cero Tolerancia (Rechazo inmediato de ruta)' },
                  { p: 'Neutralizantes (Soda Cáustica / Carbonatos)', min: 'Ausencia', max: 'Ausencia', c: 'Fraude / Rechazo' },
                  { p: 'Conservantes (Peróxido de Hidrógeno)', min: 'Ausencia', max: 'Ausencia', c: 'Fraude / Rechazo' }
                ].map((row, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-dark">{row.p}</td>
                    <td className="text-center fw-semibold">{row.min}</td>
                    <td className="text-center">{row.max}</td>
                    <td><span className="badge bg-secondary">{row.c}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 3: CRITERIOS MICROBIOLÓGICOS Y MUESTREO */}
      {seccionActiva === 'microbiologico' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-success mb-3 border-bottom pb-2">
            <i className="bi bi-bug-fill me-2"></i>3. Criterios Microbiológicos y Plan de Muestreo
          </h4>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark font-heading mb-2">Límites Microbiológicos Permisibles:</h6>
              <table className="table table-sm table-bordered align-middle small mb-0">
                <thead className="table-light">
                  <tr><th>Materia Prima / Insumo</th><th>Microorganismo</th><th>Límite Permisible</th></tr>
                </thead>
                <tbody>
                  <tr><td rowSpan="1" className="fw-bold bg-light">Leche Cruda</td><td>Recuento Mesófilos</td><td><span className="badge bg-warning text-dark">Máx. 700.000 UFC/ml</span></td></tr>
                  <tr><td rowSpan="5" className="fw-bold bg-light">Empaques y Envases</td><td>Recuento Mesófilos</td><td>10 UFC/ml</td></tr>
                  <tr><td>Coliformes Totales</td><td>&lt; 3 NMP/ml</td></tr>
                  <tr><td>Coliformes Fecales</td><td>&lt; 3 NMP/ml</td></tr>
                  <tr><td>Staphylococcus aureus (+)</td><td>&lt; 100 UFC/ml</td></tr>
                  <tr><td>Mohos y Levaduras</td><td>&lt; 10 UFC/ml</td></tr>
                </tbody>
              </table>
            </div>

            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark font-heading mb-2">Protocolo de Toma de Muestra (POES):</h6>
              <ul className="text-dark small">
                <li><strong>Agitación previa:</strong> Agitar el tanque o cantina durante 5 minutos para homogenizar la grasa antes del muestreo.</li>
                <li><strong>Frascos estériles:</strong> Recipientes con cierre hermético etiquetados con fecha, hora, proveedor y volumen.</li>
                <li><strong>Conservación:</strong> Mantener refrigerada la muestra entre 2°C y 4°C para envío al laboratorio externo contratado.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VISTA 4: RECEPCIÓN DE EMPAQUES E INSUMOS */}
      {seccionActiva === 'empaques' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-success mb-3 border-bottom pb-2">
            <i className="bi bi-box-seam me-2"></i>4. Recepción y Control de Materiales de Empaque
          </h4>

          <div className="row g-3">
            {[
              { t: 'Inspección Sanitaria del Vehículo', d: 'El vehículo transportador de empaques debe estar limpio, seco y libre de sustancias químicas u olores extraños.' },
              { t: 'Certificados de Calidad e Inocuidad', d: 'Exigir certificado de aptitud para contacto directo con alimentos (Resolución 683/2012) por cada lote de bolsas.' },
              { t: 'Verificación de Integridad del Sello', d: 'Comprobar resistencia mecánica del polietileno al vacío y ausencia de perforaciones o suciedad.' },
              { t: 'Almacenamiento y Estibado', d: 'Almacenar en bodega sobre estibas plásticas, a 15cm del piso y separadas de paredes.' }
            ].map((item, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 border h-100">
                  <strong className="text-success d-block mb-1">{item.t}:</strong>
                  <span className="text-muted small">{item.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BLOQUE 2: Formatos Imprimibles y Registro Plataforma (Q-FR-25) */}
      <div className="card gipa-card p-4 border-0 shadow-sm mb-4 border-top border-5 border-success">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="card-title font-heading mb-1 text-dark">
              <i className="bi bi-printer-fill text-success me-2"></i>Formatos Imprimibles, Registros Asociados
            </h4>
            <p className="text-muted small mb-0">Descarga la plantilla vacía o registra análisis físico-químicos en la bitácora Q-FR-25.</p>
          </div>
          
          <div className="d-flex gap-2 align-items-center">
            {canUserWriteInModule(userRole, 'recepcion-materias-primas') ? (
              <button 
                className="btn btn-sm btn-success text-white d-flex align-items-center gap-2 fw-semibold"
                onClick={() => {
                  setSeccionActiva('plataforma');
                  setMostrarFormularioRecepcion(true);
                }}
              >
                <i className="bi bi-plus-circle"></i> {mostrarFormularioRecepcion ? 'Cerrar Formulario' : '➕ Registrar Recepción de Leche (Q-FR-25)'}
              </button>
            ) : (
              <span className="badge bg-secondary text-white px-3 py-2 d-flex align-items-center gap-1">
                <i className="bi bi-lock-fill text-warning"></i> Modo Consulta Inter-Áreas (Solo Lectura)
              </span>
            )}
          </div>
        </div>

        {/* Ficha resumen del formato */}
        <div className="border p-3 rounded-3 bg-light d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <span className="badge bg-success me-2">Q-FR-25</span>
            <span className="badge bg-secondary">Plantilla Registro Plataforma</span>
            <h6 className="fw-bold text-dark font-heading mt-2 mb-1">Formato Registro Control Físico-Químico por Ruta</h6>
            <span className="text-muted small"><i className="bi bi-info-circle me-1"></i>Muestreo de acidez, grasa, densidad y prueba de alcohol en recepción.</span>
          </div>
          <button 
            className="btn btn-sm btn-outline-success d-flex align-items-center gap-2"
            onClick={() => setSeccionActiva('plataforma')}
          >
            <i className="bi bi-journal-check"></i> Ver Bitácora Plataforma Q-FR-25
          </button>
        </div>
      </div>

      {/* VISTA 5: FORMATO PLATAFORMA Q-FR-25 */}
      {seccionActiva === 'plataforma' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold font-heading text-success mb-1">
                <i className="bi bi-journal-check me-2"></i>5. Registro Control Físico-Químico por Ruta (Q-FR-25)
              </h4>
              <p className="text-muted small mb-0">Formato oficial de recepción diaria de leche cruda en plataforma.</p>
            </div>
            {canUserWriteInModule(userRole, 'recepcion-materias-primas') ? (
              <button 
                className="btn btn-sm btn-success text-white d-flex align-items-center gap-2 fw-semibold"
                onClick={() => setMostrarFormularioRecepcion(prev => !prev)}
              >
                <i className="bi bi-plus-circle"></i> {mostrarFormularioRecepcion ? 'Cerrar Formulario' : 'Registrar Recepción de Leche'}
              </button>
            ) : (
              <span className="badge bg-secondary text-white px-3 py-2 d-flex align-items-center gap-1" title="Visualizando en modo consulta inter-áreas">
                <i className="bi bi-lock-fill text-warning"></i> Modo Consulta Inter-Áreas (Solo Lectura)
              </span>
            )}
          </div>

          {/* Formulario de Recepción */}
          {mostrarFormularioRecepcion && (
            <form onSubmit={handleCrearRecepcion} className="border p-4 rounded-3 bg-light bg-opacity-50 mb-4 fade-in-view" style={{ fontSize: '13px' }}>
              <h5 className="fw-bold text-success font-heading mb-3">
                <i className="bi bi-journal-plus me-2"></i>Nuevo Registro de Análisis en Plataforma (Q-FR-25)
              </h5>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Proveedor / Ruta de Acopio</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={proveedorInput}
                    onChange={(e) => setProveedorInput(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label fw-semibold small">Volumen (L)</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={volumenInput}
                    onChange={(e) => setVolumenInput(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label fw-semibold small">Temp (°C)</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={temperaturaInput}
                    onChange={(e) => setTemperaturaInput(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label fw-semibold small">Acidez (% Ác. Láctico)</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={acidezInput}
                    onChange={(e) => setAcidezInput(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-2">
                  <label className="form-label fw-semibold small">Densidad (g/ml)</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={densidadInput}
                    onChange={(e) => setDensidadInput(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Prueba Antibióticos</label>
                  <select 
                    className="form-select form-select-sm"
                    value={antibioticosInput}
                    onChange={(e) => setAntibioticosInput(e.target.value)}
                  >
                    <option value="Ausente">Ausente (Aprobado)</option>
                    <option value="Presente">Presente (Rechazo Inmediato)</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Dictamen Final</label>
                  <select 
                    className="form-select form-select-sm fw-bold"
                    value={dictamenInput}
                    onChange={(e) => setDictamenInput(e.target.value)}
                  >
                    <option value="Aceptado y Tanqueado">Aceptado y Tanqueado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarFormularioRecepcion(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success text-white px-3 fw-semibold">
                  <i className="bi bi-save me-1"></i> Guardar Análisis Q-FR-25
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
                  <th>Proveedor / Ruta</th>
                  <th>Volumen</th>
                  <th>Fisicoquímico (Temp / Acidez / Den)</th>
                  <th>Antibióticos</th>
                  <th>Organoléptico</th>
                  <th>Dictamen</th>
                  <th>Analista</th>
                </tr>
              </thead>
              <tbody>
                {registrosRecepcion.map(r => (
                  <tr key={r.id}>
                    <td>{r.fecha}</td>
                    <td className="fw-bold text-dark">{r.proveedor}</td>
                    <td>{r.volumen}</td>
                    <td className="small">Temp: <strong>{r.temperatura}</strong> | Acid: <strong>{r.acidez}%</strong> | Den: <strong>{r.densidad}</strong></td>
                    <td><span className={`badge ${r.antibioticos === 'Ausente' ? 'bg-success' : 'bg-danger'}`}>{r.antibioticos}</span></td>
                    <td className="small text-muted">{r.organoleptico}</td>
                    <td>
                      <span className={`badge ${r.dictamen.includes('Aceptado') ? 'bg-success' : 'bg-danger'}`}>
                        {r.dictamen}
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

      {/* Modal Lector Completo del Documento PDF (Q-PD-13) en Formato Hoja ISO Limpia */}
      {mostrarTextoCompleto && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '18px' }}>
              <div className="modal-header bg-success text-white border-0" style={{ borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-file-pdf-fill"></i> Documento Oficial PDF: Procedimiento para la Recepción de Materias Primas e Insumos
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarTextoCompleto(false)}></button>
              </div>

              <div className="modal-body p-4 bg-light" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
                <div className="bg-white p-5 shadow-sm rounded-3 border mx-auto" style={{ maxWidth: '920px' }}>
                  {/* Encabezado Oficial ISO del Documento */}
                  <table className="table table-bordered align-middle text-center mb-4 small border-secondary">
                    <tbody>
                      <tr>
                        <td width="20%" className="fw-bold text-success fs-5 align-middle">LÁCTEOS RÍO GRANDE</td>
                        <td width="60%" className="fw-bold align-middle text-uppercase">
                          PROCEDIMIENTO PARA LA RECEPCIÓN DE MATERIAS PRIMAS E INSUMOS
                        </td>
                        <td width="20%" className="text-start small align-middle">
                          <strong>CÓDIGO:</strong> Q-PD-13<br/>
                          <strong>VERSIÓN:</strong> 01<br/>
                          <strong>VIGENCIA:</strong> 16/10/2020
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Sección 1: Objetivo y Alcance */}
                  <div className="mb-4">
                    <h5 className="fw-bold text-success border-bottom pb-1 font-heading">1. OBJETIVO</h5>
                    <p className="text-dark mb-3" style={{ textAlign: 'justify' }}>
                      Garantizar la conformidad de las materias primas e insumos que se compran y reciben mediante el muestreo y verificación de los requisitos de calidad estandarizados para su recepción.
                    </p>

                    <h5 className="fw-bold text-success border-bottom pb-1 font-heading">2. ALCANCE Y RESPONSABILIDADES</h5>
                    <p className="text-dark mb-2" style={{ textAlign: 'justify' }}>
                      Aplica desde la recepción de la materia prima leche y materiales de empaque e insumos hasta el almacenamiento y despacho del producto terminado, regulado por el Decreto 3075/1997 y la Resolución 2674 de 2013.
                    </p>
                    <ul className="text-dark small">
                      <li><strong>3.1 Aseguramiento de Calidad:</strong> Define todos los POES, los documenta, implementa y hace seguimiento.</li>
                      <li><strong>3.2 Analista de Laboratorio / Jefe de Producción:</strong> Realiza y hace cumplir todos los controles de BPM.</li>
                      <li><strong>3.3 Manipuladores de Alimentos:</strong> Cumplimiento de los lineamientos del manual de inocuidad.</li>
                    </ul>
                  </div>

                  {/* Tabla 3 Oficial: Especificaciones Fisicoquímicas Leche Cruda */}
                  <div className="my-4">
                    <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-droplet-fill me-2 text-success"></i>Tabla 3: Requisitos Fisicoquímicos Obligatorios Leche Cruda</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle small mb-0 bg-white">
                        <thead className="table-dark">
                          <tr>
                            <th>Parámetro / Unidad</th>
                            <th>Especificación Mínima</th>
                            <th>Especificación Máxima</th>
                            <th>Límite de Aceptación</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>Grasa (% m/v)</td><td>3.00%</td><td>-------</td><td>&ge; 3.0%</td></tr>
                          <tr><td>Extracto Seco Total (% m/m)</td><td>11.30%</td><td>-------</td><td>&ge; 11.30%</td></tr>
                          <tr><td>Extracto Seco Desengrasado (% m/m)</td><td>8.30%</td><td>-------</td><td>&ge; 8.30%</td></tr>
                          <tr><td>Acidez (% Ácido Láctico)</td><td>0.13%</td><td>0.17%</td><td>0.13% a 0.17%</td></tr>
                          <tr><td>Densidad a 15/15°C (g/ml)</td><td>1.030</td><td>1.033</td><td>1.030 a 1.033</td></tr>
                          <tr><td>Prueba de Alcohol (75% v/v)</td><td>Ausencia de grumos</td><td>Ausencia de grumos</td><td>Negativa</td></tr>
                          <tr><td>Antibióticos / Conservantes</td><td>Ausencia</td><td>Ausencia</td><td>Ausencia Estricta</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tabla 4 Oficial: Criterios Microbiológicos */}
                  <div className="my-4">
                    <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-bug-fill me-2 text-success"></i>Tabla 4: Criterios Microbiológicos Permisibles</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle small mb-0 bg-white">
                        <thead className="table-light">
                          <tr>
                            <th>Materia Prima / Insumo</th>
                            <th>Microorganismo Evaluado</th>
                            <th>Valor Permisible</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>Leche Cruda</td><td>Recuento de Mesófilos</td><td><span className="badge bg-warning text-dark">Máx. 700.000 UFC/ml</span></td></tr>
                          <tr><td rowSpan="5">Empaques y Envases</td><td>Mesófilos</td><td>10 UFC/ml</td></tr>
                          <tr><td>Coliformes Totales</td><td>&lt; 3 NMP/ml</td></tr>
                          <tr><td>Coliformes Fecales</td><td>&lt; 3 NMP/ml</td></tr>
                          <tr><td>Staphylococcus aureus (+)</td><td>&lt; 100 UFC/ml</td></tr>
                          <tr><td>Mohos y Levaduras</td><td>&lt; 10 UFC/ml</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tabla 10 Oficial: Control de Registros */}
                  <div className="my-4">
                    <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-folder-check me-2 text-success"></i>Tabla 10: Control de Registros de Recepción</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle small mb-0 bg-white">
                        <thead className="table-light">
                          <tr>
                            <th>Registro</th>
                            <th>Código</th>
                            <th>Ubicación</th>
                            <th>Responsable</th>
                            <th>Tiempo Retención</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>Control Físico-Químico Leche Cruda</td><td><strong>Q-FR-25</strong></td><td>Carpeta Proceso</td><td>Analista Laboratorio</td><td>1 Año</td></tr>
                          <tr><td>Control de Recepción de Insumos</td><td><strong>Q-FR-20</strong></td><td>Bodega / Calidad</td><td>Analista Laboratorio</td><td>1 Año</td></tr>
                          <tr><td>Almacenamiento de Materias Primas</td><td><strong>Q-FR-22</strong></td><td>Carpeta Proceso</td><td>Analista Laboratorio</td><td>1 Año</td></tr>
                          <tr><td>Cronograma Visitas Proveedores</td><td><strong>Q-CR-09</strong></td><td>Gestión Calidad</td><td>Jefe de Calidad</td><td>1 Año</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top-0 p-3 bg-light" style={{ borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
                <button type="button" className="btn btn-success text-white btn-sm px-4 fw-bold" onClick={() => setMostrarTextoCompleto(false)}>
                  Entendido / Cerrar Lector Q-PD-13
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
