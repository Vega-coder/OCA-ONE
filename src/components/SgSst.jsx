import React, { useState, useEffect } from 'react';
import { canUserDownloadProcedure } from '../lib/permissions';
import { SST_FULL_PARAGRAPHS, SST_FULL_TABLES } from '../domain/sstFullText';

export default function SgSst({ tenantId = 'tenant-opt-01', userRole = 'super-admin', carpetaActiva, setCarpetaActiva }) {
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState('metodologia');
  const [mostrarInspeccionForm, setMostrarInspeccionForm] = useState(false);
  const [alertaExito, setAlertaExito] = useState(false);

  // Matriz de Peligros y Evaluaciones SG-SST
  const [matrizPeligros, setMatrizPeligros] = useState([
    {
      id: 1,
      area: 'Recepción de Leche',
      peligro: 'Biológico - Leche Cruda / Salpicaduras',
      efecto: 'Infección dermopatológica / Alergia',
      controlesExistentes: 'Uso de guantes de nitrilo, monogafas y delantal impermeable',
      nivelDeficiencia: 2,
      nivelExposicion: 3,
      nivelProbabilidad: 6, // ND x NE
      nivelConsecuencia: 25,
      nivelRiesgo: 150, // NP x NC
      aceptabilidad: 'II - Aceptable con Control',
      medidaIntervencion: 'Controles de Ingeniería: Instalación de acoples rápidos antigoteo en mangueras de recepción.'
    },
    {
      id: 2,
      area: 'Hilado de Queso',
      peligro: 'Físico - Quemadura por Vapor / Agua Caliente',
      efecto: 'Quemadura de 1° o 2° grado en extremidades',
      controlesExistentes: 'Aislamiento térmico en tuberías, delantales de carnaza y guantes térmicos 50cm',
      nivelDeficiencia: 6,
      nivelExposicion: 3,
      nivelProbabilidad: 18,
      nivelConsecuencia: 60,
      nivelRiesgo: 1080,
      aceptabilidad: 'I - No Aceptable / Intervención Inmediata',
      medidaIntervencion: 'Sustitución: Instalación de válvulas solenoides automáticas de corte de vapor.'
    },
    {
      id: 3,
      area: 'Moldeo y Prensa',
      peligro: 'Biomecánico - Movimiento Repetitivo y Sobre-esfuerzo',
      efecto: 'Desórdenes músculo-esqueléticos / Lumbalgia',
      controlesExistentes: 'Pausas activas de 10 min cada 2 horas, fajas lumbares de apoyo',
      nivelDeficiencia: 2,
      nivelExposicion: 4,
      nivelProbabilidad: 8,
      nivelConsecuencia: 25,
      nivelRiesgo: 200,
      aceptabilidad: 'II - Aceptable con Control',
      medidaIntervencion: 'Controles Administrativos: Rotación periódica de personal entre empaque y moldeo.'
    },
    {
      id: 4,
      area: 'Servicios / Caldera',
      peligro: 'Físico - Ruido continuo y Presión de Vapor GLP',
      efecto: 'Hipoacusia neurosensorial / Explosión por sobrepresión',
      controlesExistentes: 'Protectores auditivos de copa NRR 25dB, presostatos de alta seguridad',
      nivelDeficiencia: 6,
      nivelExposicion: 2,
      nivelProbabilidad: 12,
      nivelConsecuencia: 100,
      nivelRiesgo: 1200,
      aceptabilidad: 'I - No Aceptable',
      medidaIntervencion: 'Mantenimiento Semestral especializado por técnico certificado en calderas pirotubulares.'
    }
  ]);

  // Formulario de inspección de seguridad
  const [nuevaArea, setNuevaArea] = useState('Producción / Cuajado');
  const [nuevoPeligro, setNuevoPeligro] = useState('');
  const [nuevoEfecto, setNuevoEfecto] = useState('');
  const [nuevoControl, setNuevoControl] = useState('');

  const canDownloadPDF = canUserDownloadProcedure(userRole);

  // Sincronización desde el menú desplegable del Sidebar
  useEffect(() => {
    if (!carpetaActiva) return;
    const mapaSecciones = {
      'Definiciones y Alcance': 'definiciones',
      'Metodología GTC 45': 'metodologia',
      'Matriz de 8 Pasos': 'pasos',
      'Matriz de Peligros': 'matriz',
      'Lista de Chequeo': 'inspeccion'
    };
    if (mapaSecciones[carpetaActiva]) {
      setSeccionActiva(mapaSecciones[carpetaActiva]);
    }
  }, [carpetaActiva]);

  const handleCrearInspeccion = (e) => {
    e.preventDefault();
    if (!nuevoPeligro.trim()) return;

    const nuevo = {
      id: Date.now(),
      area: nuevaArea,
      peligro: nuevoPeligro.trim(),
      efecto: nuevoEfecto.trim() || 'Afectación a la salud del colaborador',
      controlesExistentes: nuevoControl.trim() || 'EPP básico (Botas, Tapabocas, Casco)',
      nivelDeficiencia: 2,
      nivelExposicion: 3,
      nivelProbabilidad: 6,
      nivelConsecuencia: 25,
      nivelRiesgo: 150,
      aceptabilidad: 'II - Aceptable con Control',
      medidaIntervencion: 'Capacitación en autocuidado y verificación de uso obligatorio de EPP.'
    };

    setMatrizPeligros(prev => [nuevo, ...prev]);
    setNuevoPeligro('');
    setNuevoEfecto('');
    setNuevoControl('');
    setMostrarInspeccionForm(false);
    setAlertaExito(true);
    setTimeout(() => setAlertaExito(false), 4000);
  };

  // Función de Impresión de PDF Oficial ISO SG-SST
  const handlePrintDocumentoOficial = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>SST-PRO-001 - Procedimiento de Identificación de Peligros y Control de Riesgos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.5; font-size: 12px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .header-table td { border: 1px solid #334155; padding: 8px; text-align: center; font-size: 11px; }
          .header-title { font-size: 13px; font-weight: bold; text-transform: uppercase; }
          .section-title { font-weight: bold; background: #fee2e2; color: #991b1b; padding: 6px; margin-top: 15px; border-left: 4px solid #dc2626; }
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
            <td width="20%"><strong style="font-size:16px; color:#dc2626;">OCA ONE</strong><br/>Sistema SG-SST / ISO 45001</td>
            <td width="60%" class="header-title">
              PROCEDIMIENTO DE IDENTIFICACIÓN DE PELIGROS, EVALUACIÓN, VALORACIÓN Y DETERMINACIÓN DE CONTROL DE RIESGOS E IMPACTOS
            </td>
            <td width="20%">
              <strong>CÓDIGO:</strong> SST-PRO-001<br/>
              <strong>VERSIÓN:</strong> 2.0.0<br/>
              <strong>FECHA:</strong> 11/08/2026
            </td>
          </tr>
        </table>

        <div class="section-title">1. OBJETO Y ALCANCE</div>
        <p><strong>OBJETO:</strong> Establecer los requerimientos y elementos básicos a considerar para la identificación de peligros, evaluación, valoración y determinación de control de riesgo e impactos, con la finalidad de minimizar la ocurrencia de eventos que puedan resultar con lesiones a los trabajadores, a terceros, daños materiales o impacto ambiental.</p>
        <p><strong>ALCANCE:</strong> Aplica a toda actividad ejecutada o contratada en los centros de trabajo de la empresa.</p>

        <div class="section-title">2. PASOS DEL PROCEDIMIENTO DE VALORACIÓN GTC 45 / ISO 45001</div>
        <ol>
          <li><strong>Entrada de Información:</strong> Describir las actividades rutinarias y no rutinarias por puestos de trabajo.</li>
          <li><strong>Identificación de Peligros:</strong> Clasificación por factores físicos, químicos, biológicos, biomecánicos, psicosociales, de seguridad y naturales.</li>
          <li><strong>Identificación de Controles Existentes:</strong> Verificación de controles en la fuente, medio e individuo.</li>
          <li><strong>Evaluación del Riesgo:</strong> Nivel de Deficiencia (ND) x Nivel de Exposición (NE) = Nivel de Probabilidad (NP). Nivel de Consecuencia (NC) x NP = Nivel de Riesgo (NR).</li>
          <li><strong>Valoración y Aceptabilidad:</strong> Categorías I (No Aceptable), II (No Aceptable/Aceptable con Control), III (Aceptable), IV (Aceptable).</li>
          <li><strong>Jerarquía de Controles:</strong> 1. Eliminación, 2. Sustitución, 3. Controles de Ingeniería, 4. Controles Administrativos / Señalización, 5. Equipos de Protección Personal (EPP).</li>
        </ol>

        <div class="section-title">3. MATRIZ DE PELIGROS IDENTIFICADOS EN PLANTA</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Área</th>
              <th>Peligro Identificado</th>
              <th>Efecto Posible</th>
              <th>Controles Existentes</th>
              <th>Aceptabilidad del Riesgo</th>
            </tr>
          </thead>
          <tbody>
            ${matrizPeligros.map(p => `
              <tr>
                <td><strong>${p.area}</strong></td>
                <td>${p.peligro}</td>
                <td>${p.efecto}</td>
                <td>${p.controlesExistentes}</td>
                <td><strong>${p.aceptabilidad}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="footer-signatures">
          <tr>
            <td width="50%">
              <div class="line"></div>
              <strong>Elaboró / Revisó:</strong><br/>
              Ing. Mateo Morales / Responsable SG-SST
            </td>
            <td width="50%">
              <div class="line"></div>
              <strong>Aprobó:</strong><br/>
              Gerencia General / COPASST
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
      {/* Alerta de Creación Exitosa */}
      {alertaExito && (
        <div className="alert alert-danger alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-shield-check me-2"></i>¡Inspección SG-SST Guardada!</strong> La identificación de peligro ha sido indexada exitosamente en la Matriz de Riesgos.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)}></button>
        </div>
      )}

      {/* Banner Encabezado Módulo SG-SST */}
      <div className="d-flex align-items-center justify-content-between p-3 mb-4 rounded-3 border bg-body shadow-sm border-start border-5 border-danger">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-rose" style={{ width: '44px', height: '44px', fontSize: '22px' }}>
            <i className="bi bi-heart-pulse-fill"></i>
          </div>
          <div>
            <div className="fw-bold font-heading text-dark" style={{ fontSize: '17px' }}>
              Módulo SG-SST - Identificación de Peligros y Control de Riesgos (SST-PRO-001)
            </div>
            <div className="text-muted small">
              Gestión integral de Seguridad y Salud en el Trabajo según Decreto 1072, GTC 45 e ISO 45001.
            </div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2 fw-semibold"
            onClick={() => setMostrarTextoCompleto(true)}
          >
            <i className="bi bi-file-earmark-text-fill"></i> 📖 Leer Documento Completo Word
          </button>
          {canDownloadPDF && (
            <button 
              className="btn btn-sm btn-danger d-flex align-items-center gap-2 fw-semibold"
              onClick={handlePrintDocumentoOficial}
            >
              <i className="bi bi-printer-fill"></i> PDF Oficial SG-SST
            </button>
          )}
        </div>
      </div>

      {/* Botones de Navegación por Secciones */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {[
          { id: 'definiciones', label: '1. Objeto, Alcance y Definiciones', icon: 'bi-book' },
          { id: 'metodologia', label: '2. Metodología GTC 45 / ISO 45001', icon: 'bi-calculator' },
          { id: 'pasos', label: '3. Matriz de 8 Pasos del Procedimiento', icon: 'bi-diagram-3' },
          { id: 'matriz', label: '4. Matriz Interactiva de Peligros en Planta', icon: 'bi-shield-exclamation' }
        ].map(btn => (
          <button
            key={btn.id}
            className={`btn btn-sm ${seccionActiva === btn.id ? 'btn-danger fw-bold shadow-sm' : 'btn-outline-secondary'}`}
            onClick={() => setSeccionActiva(btn.id)}
            style={{ borderRadius: '8px', fontSize: '12.5px' }}
          >
            <i className={`bi ${btn.icon} me-1`}></i> {btn.label}
          </button>
        ))}
      </div>

      {/* VISTA 1: DEFINICIONES Y ALCANCE */}
      {seccionActiva === 'definiciones' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-danger mb-3 border-bottom pb-2">
            <i className="bi bi-bookmark-fill me-2"></i>1. Objeto, Alcance y Definiciones Clave
          </h4>
          <div className="row g-3 text-dark small mb-3">
            <div className="col-12 col-md-6 border-end">
              <h6 className="fw-bold text-dark"><i className="bi bi-target me-1 text-danger"></i> OBJETO:</h6>
              <p style={{ textAlign: 'justify' }}>
                Establecer los requerimientos y elementos básicos a considerar para la identificación de peligros, evaluación, valoración y determinación de control de riesgo e impactos, con la finalidad de minimizar la ocurrencia de eventos que puedan resultar con lesiones a los trabajadores, a terceros, daños materiales o impacto ambiental en la organización.
              </p>
            </div>
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark"><i className="bi bi-compass me-1 text-danger"></i> ALCANCE:</h6>
              <p style={{ textAlign: 'justify' }}>
                Aplica a toda actividad ejecutada o contratada en todos los centros de trabajo de la empresa, abarcando actividades rutinarias y no rutinarias de colaboradores, contratistas y visitantes.
              </p>
            </div>
          </div>

          <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-journal-text me-2 text-danger"></i>Glosario y Definiciones Normativas:</h6>
          <div className="row g-2">
            {[
              { t: 'Peligro', d: 'Fuente, situación o acto con potencial de causar daño en la salud de los trabajadores, deterioro de equipos o instalaciones.' },
              { t: 'Riesgo', d: 'Combinación de la probabilidad de que ocurra un evento o exposición peligrosa y la severidad de la lesión o enfermedad.' },
              { t: 'Acto Inseguro', d: 'Comportamiento inapropiado realizado por un trabajador que facilita la ocurrencia de un accidente o incidente.' },
              { t: 'Condición Insegura', d: 'Situación en el entorno de trabajo caracterizada por la presencia de riesgos no controlados.' },
              { t: 'Accidente de Trabajo', d: 'Suceso repentino que sobreviene por causa o con ocasión del trabajo y produce lesión orgánica, perturbación funcional o invalidez.' },
              { t: 'Enfermedad Laboral', d: 'Contraída como resultado de la exposición a factores de riesgo inherentes a la actividad laboral.' }
            ].map((def, idx) => (
              <div key={idx} className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-3 border h-100">
                  <strong className="text-danger d-block mb-1">{def.t}:</strong>
                  <span className="text-muted small">{def.d}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 2: METODOLOGÍA DE EVALUACIÓN GTC 45 */}
      {seccionActiva === 'metodologia' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-danger mb-3 border-bottom pb-2">
            <i className="bi bi-calculator me-2"></i>2. Criterios de Evaluación y Valoración del Riesgo (GTC 45)
          </h4>
          <p className="text-muted small mb-3">
            La valoración del riesgo se basa en la fórmula estandarizada: <strong>Nivel de Riesgo (NR) = Nivel de Probabilidad (NP) x Nivel de Consecuencia (NC)</strong>, donde <strong>NP = Nivel de Deficiencia (ND) x Nivel de Exposición (NE)</strong>.
          </p>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark font-heading mb-2">Tabla de Nivel de Deficiencia (ND):</h6>
              <table className="table table-sm table-bordered align-middle small mb-0">
                <thead className="table-light">
                  <tr><th>Nivel</th><th>Valor</th><th>Significado</th></tr>
                </thead>
                <tbody>
                  <tr><td>Muy Alto (MA)</td><td><span className="badge bg-danger">10</span></td><td>Se han detectado peligros que significan la posibilidad de incidentes o consecuencias muy graves.</td></tr>
                  <tr><td>Alto (A)</td><td><span className="badge bg-warning text-dark">6</span></td><td>Se han detectado algunos peligros que pueden dar lugar a consecuencias significativas.</td></tr>
                  <tr><td>Medio (M)</td><td><span className="badge bg-info text-dark">2</span></td><td>Se han detectado peligros de menor gravedad o la eficacia de los controles es parcial.</td></tr>
                </tbody>
              </table>
            </div>

            <div className="col-12 col-md-6">
              <h6 className="fw-bold text-dark font-heading mb-2">Tabla de Nivel de Exposición (NE):</h6>
              <table className="table table-sm table-bordered align-middle small mb-0">
                <thead className="table-light">
                  <tr><th>Nivel</th><th>Valor</th><th>Significado</th></tr>
                </thead>
                <tbody>
                  <tr><td>Continua (EC)</td><td><span className="badge bg-danger">4</span></td><td>La situación de exposición se presenta sin interrupción durante la jornada laboral.</td></tr>
                  <tr><td>Frecuente (EF)</td><td><span className="badge bg-warning text-dark">3</span></td><td>La situación de exposición se presenta varias veces en la jornada por tiempos cortos.</td></tr>
                  <tr><td>Ocasional (EO)</td><td><span className="badge bg-info text-dark">2</span></td><td>La situación de exposición se presenta alguna vez en la jornada laboral.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <h6 className="fw-bold text-dark font-heading mb-2">Jerarquía de Medidas de Intervención (Control de Riesgos):</h6>
          <div className="d-flex flex-column gap-2">
            {[
              { num: '1', title: 'ELIMINACIÓN', desc: 'Modificar el diseño para eliminar el peligro (ej. eliminar uso de químicos nocivos).', bg: 'bg-danger text-white' },
              { num: '2', title: 'SUSTITUCIÓN', desc: 'Reemplazar el material o proceso peligroso por uno de menor riesgo (ej. sustituir limpiadores solventes por biodegradables).', bg: 'bg-warning text-dark' },
              { num: '3', title: 'CONTROLES DE INGENIERÍA', desc: 'Aislamiento físico, guardas de seguridad, sistemas de ventilación y paradas de emergencia.', bg: 'bg-primary text-white' },
              { num: '4', title: 'CONTROLES ADMINISTRATIVOS', desc: 'Señalización, advertencias, rotación de personal, procedimientos seguros de trabajo y capacitaciones.', bg: 'bg-info text-dark' },
              { num: '5', title: 'EQUIPOS DE PROTECCIÓN PERSONAL (EPP)', desc: 'Suministro de cascos, monogafas, calzado dieléctrico, guantes y protección auditiva.', bg: 'bg-secondary text-white' }
            ].map(j => (
              <div key={j.num} className="d-flex align-items-center gap-3 p-2 border rounded-3 bg-body">
                <span className={`badge ${j.bg} p-2 rounded-circle`} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{j.num}</span>
                <div>
                  <strong className="text-dark small me-2">{j.title}:</strong>
                  <span className="text-muted small">{j.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: MATRIZ DE 8 PASOS */}
      {seccionActiva === 'pasos' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <h4 className="fw-bold font-heading text-danger mb-3 border-bottom pb-2">
            <i className="bi bi-diagram-3 me-2"></i>3. Pasos del Procedimiento de Identificación de Peligros
          </h4>

          <div className="row g-3">
            {[
              { step: '1', t: 'Entrada de Información', d: 'Describir detalladamente cada actividad ejecutada (Rutinaria / No Rutinaria) y visitar las instalaciones.' },
              { step: '2', t: 'Identificación de Peligros', d: 'Identificar factores físicos, químicos, biológicos, biomecánicos, psicosociales, de seguridad y ambientales.' },
              { step: '3', t: 'Controles Existentes', d: 'Verificar las medidas implementadas en la fuente, en el medio de transmisión y en los colaboradores.' },
              { step: '4', t: 'Evaluación del Riesgo', d: 'Calcular los niveles ND, NE, NP, NC y determinar el Nivel de Riesgo (NR = NP x NC).' },
              { step: '5', t: 'Valoración del Riesgo', d: 'Categorizar el riesgo en Aceptable (III-IV) o No Aceptable (I-II) según cumplimiento normativo.' },
              { step: '6', t: 'Criterios de Intervención', d: 'Determinar número de expuestos, peor consecuencia posible y existencia de requisito legal.' },
              { step: '7', t: 'Medidas de Control', d: 'Aplicar la jerarquía: Eliminación, Sustitución, Ingeniería, Administrativos y EPP.' },
              { step: '8', t: 'Seguimiento y Auditoría', d: 'Actualización anual de la matriz de riesgos y tras cualquier incidente o cambio de proceso.' }
            ].map(p => (
              <div key={p.step} className="col-12 col-md-6">
                <div className="p-3 border rounded-3 bg-body h-100">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-danger rounded-pill fs-6">Paso {p.step}</span>
                    <strong className="text-dark font-heading">{p.t}</strong>
                  </div>
                  <p className="text-muted small mb-0">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 4: MATRIZ INTERACTIVA DE PELIGROS */}
      {seccionActiva === 'matriz' && (
        <div className="card gipa-card p-4 border-0 shadow-sm mb-4 fade-in-view">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold font-heading text-danger mb-1">
                <i className="bi bi-shield-exclamation me-2"></i>4. Matriz de Peligros e Intervenciones en Planta
              </h4>
              <p className="text-muted small mb-0">Inspecciones activas registradas en los diferentes puestos de trabajo.</p>
            </div>
            <button 
              className="btn btn-sm btn-danger d-flex align-items-center gap-2 fw-semibold"
              onClick={() => setMostrarInspeccionForm(prev => !prev)}
            >
              <i className="bi bi-plus-circle"></i> {mostrarInspeccionForm ? 'Cerrar Formulario' : 'Registrar Nueva Inspección SST'}
            </button>
          </div>

          {/* Formulario de Inspección SST */}
          {mostrarInspeccionForm && (
            <form onSubmit={handleCrearInspeccion} className="border p-4 rounded-3 bg-light bg-opacity-50 mb-4 fade-in-view" style={{ fontSize: '13px' }}>
              <h5 className="fw-bold text-danger font-heading mb-3">
                <i className="bi bi-journal-plus me-2"></i>Nueva Inspección de Seguridad en Planta
              </h5>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Área o Puesto de Trabajo</label>
                  <select 
                    className="form-select form-select-sm"
                    value={nuevaArea}
                    onChange={(e) => setNuevaArea(e.target.value)}
                  >
                    <option value="Recepción de Leche">Recepción de Leche</option>
                    <option value="Cuajado y Filtrado">Cuajado y Filtrado</option>
                    <option value="Hilado de Queso">Hilado de Queso</option>
                    <option value="Moldeo y Prensa">Moldeo y Prensa</option>
                    <option value="Empaque y Sellado">Empaque y Sellado</option>
                    <option value="Cuartos Fríos">Cuartos Fríos</option>
                    <option value="Servicios / Caldera">Servicios / Caldera</option>
                    <option value="Mantenimiento de Planta">Mantenimiento de Planta</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Peligro Identificado</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Físico - Piso húmedo / Resbalón"
                    value={nuevoPeligro}
                    onChange={(e) => setNuevoPeligro(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Posible Consecuencia o Efecto</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Caída a mismo nivel / Contusión"
                    value={nuevoEfecto}
                    onChange={(e) => setNuevoEfecto(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Controles Existentes en la Planta</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  placeholder="Ej: Uso de calzado antideslizante con puntera de seguridad"
                  value={nuevoControl}
                  onChange={(e) => setNuevoControl(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarInspeccionForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-danger px-3 fw-semibold">
                  <i className="bi bi-save me-1"></i> Guardar Registro en Matriz
                </button>
              </div>
            </form>
          )}

          {/* Tabla de Matriz */}
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0" style={{ fontSize: '12.5px' }}>
              <thead className="table-light">
                <tr>
                  <th>Área Operativa</th>
                  <th>Peligro Identificado</th>
                  <th>Efecto / Consecuencia</th>
                  <th>Controles Existentes</th>
                  <th>Nivel Riesgo (NR)</th>
                  <th>Aceptabilidad</th>
                  <th>Medida de Intervención</th>
                </tr>
              </thead>
              <tbody>
                {matrizPeligros.map(item => (
                  <tr key={item.id}>
                    <td className="fw-bold text-dark">{item.area}</td>
                    <td><span className="badge bg-secondary">{item.peligro}</span></td>
                    <td className="small text-muted">{item.efecto}</td>
                    <td className="small">{item.controlesExistentes}</td>
                    <td className="fw-bold text-center">{item.nivelRiesgo}</td>
                    <td>
                      <span className={`badge ${item.aceptabilidad.includes('No Aceptable') ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {item.aceptabilidad}
                      </span>
                    </td>
                    <td className="small text-dark">{item.medidaIntervencion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Lector Completo del Documento Word (SST-PRO-001) */}
      {mostrarTextoCompleto && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '18px' }}>
              <div className="modal-header bg-danger text-white border-0" style={{ borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-file-word-fill"></i> Documento Oficial Word: Procedimiento Identificación de Peligros y Control de Riesgos
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarTextoCompleto(false)}></button>
              </div>
              <div className="modal-body p-4 bg-body" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
                <div className="border p-4 rounded-3 bg-white shadow-sm">
                  <div className="text-center border-bottom pb-3 mb-4">
                    <h3 className="fw-bold font-heading text-dark">PROCEDIMIENTO DE IDENTIFICACIÓN DE PELIGROS Y CONTROL DE RIESGOS</h3>
                    <div className="badge bg-danger px-3 py-2 fs-6">CÓDIGO: SST-PRO-001 | NORMA: GTC 45 / ISO 45001</div>
                  </div>

                  {/* Renderizado Completo Párrafo por Párrafo del Word */}
                  {SST_FULL_PARAGRAPHS.map((pText, idx) => {
                    const cleanText = pText.trim();
                    const isHeader = [
                      'OBJETO', 'ALCANCE', 'DEFINICIONES Y ABREVIATURAS', 'DESCRIPCION',
                      'CONDICIONES GENERALES', 'PASOS DEL PROCEDIMIENTO', 'MATRIZ DE IDENTIFICACION DE PELIGROS',
                      'EVALUACION DEL RIESGO', 'VALORACION DEL RIESGO', 'JERARQUIA DE CONTROLES'
                    ].some(h => cleanText.toUpperCase().startsWith(h));

                    if (isHeader) {
                      return (
                        <h5 key={idx} className="fw-bold text-danger border-bottom pb-1 mt-4 font-heading">
                          <i className="bi bi-bookmark-fill me-2 text-danger"></i>{cleanText}
                        </h5>
                      );
                    }

                    return (
                      <p key={idx} className="mb-2 text-dark" style={{ textAlign: 'justify' }}>
                        {cleanText}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer border-top-0 p-3 bg-light" style={{ borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
                <button type="button" className="btn btn-danger btn-sm px-4 fw-bold" onClick={() => setMostrarTextoCompleto(false)}>
                  Entendido / Cerrar Lector SG-SST
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
