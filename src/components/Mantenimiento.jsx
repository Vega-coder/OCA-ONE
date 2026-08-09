import React, { useState } from 'react';
import { canUserDownloadProcedure, canUserEditDocument } from '../lib/permissions';

export default function Mantenimiento({ tenantId = 'tenant-opt-01', userRole = 'super-admin' }) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarRegistroForm, setMostrarRegistroForm] = useState(false);
  const [alertaExito, setAlertaExito] = useState(false);

  // Lista de registros de mantenimiento realizados
  const [registrosMantenimiento, setRegistrosMantenimiento] = useState([
    {
      id: 1,
      fecha: '2026-08-01',
      equipo: 'Motobomba Recepción GX 120',
      tipo: 'Preventivo',
      actividad: 'Cambio de sello mecánico y revisión de fugas de aceite. Limpieza de silenciador.',
      tecnico: 'Téc. Mateo Morales',
      repuestos: 'Sello mecánico 3/4", Aceite 10W-30 0.6Q',
      estado: 'Operativo'
    },
    {
      id: 2,
      fecha: '2026-08-05',
      equipo: 'Cuarto Frío de Choque 5HP',
      tipo: 'Preventivo',
      actividad: 'Limpieza de serpentines evaporadores con hidrolavadora, ajuste de presostato de alta y baja.',
      tecnico: 'Ing. Mateo Morales / FrigoServicios',
      repuestos: 'Ninguno',
      estado: 'Operativo'
    },
    {
      id: 3,
      fecha: '2026-08-07',
      equipo: 'Hiladora de Queso 3HP',
      tipo: 'Correctivo',
      actividad: 'Reemplazo de potenciómetro de control de velocidad de aspas en caja de control LG.',
      tecnico: 'Téc. Mateo Morales',
      repuestos: 'Potenciómetro industrial 10k Ohm',
      estado: 'Operativo'
    }
  ]);

  // Formulario nuevo registro
  const [nuevoEquipo, setNuevoEquipo] = useState('Motobomba Recepción GX 120');
  const [nuevoTipo, setNuevoTipo] = useState('Preventivo');
  const [nuevaActividad, setNuevaActividad] = useState('');
  const [nuevoTecnico, setNuevoTecnico] = useState('');
  const [nuevosRepuestos, setNuevosRepuestos] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('Operativo');

  const canDownloadPDF = canUserDownloadProcedure(userRole);
  const canEdit = canUserEditDocument(userRole);

  const handleCrearRegistro = (e) => {
    e.preventDefault();
    if (!nuevaActividad.trim()) return;

    const nuevo = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      equipo: nuevoEquipo,
      tipo: nuevoTipo,
      actividad: nuevaActividad.trim(),
      tecnico: nuevoTecnico.trim() || 'Téc. Mateo Morales',
      repuestos: nuevosRepuestos.trim() || 'Sin repuestos',
      estado: nuevoEstado
    };

    setRegistrosMantenimiento(prev => [nuevo, ...prev]);
    setNuevaActividad('');
    setNuevosRepuestos('');
    setMostrarRegistroForm(false);
    setAlertaExito(true);
    setTimeout(() => setAlertaExito(false), 4000);
  };

  // Función de impresión PDF Oficial ISO
  const handlePrintDocumentoOficial = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>MAN-PME-001 - Programa de Mantenimiento de Equipos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.5; font-size: 13px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .header-table td { border: 1px solid #334155; padding: 8px; text-align: center; font-size: 11px; }
          .header-title { font-size: 14px; font-weight: bold; text-transform: uppercase; }
          h2 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-top: 20px; font-size: 15px; }
          .section-title { font-weight: bold; background: #f1f5f9; padding: 6px; margin-top: 15px; border-left: 4px solid #0284c7; }
          table.data-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          table.data-table th, table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 11px; }
          table.data-table th { background: #e2e8f0; font-weight: bold; }
          .badge-clean { font-weight: bold; color: #0284c7; }
          .footer-signatures { margin-top: 40px; width: 100%; border-collapse: collapse; }
          .footer-signatures td { border: none; text-align: center; padding-top: 40px; font-size: 11px; }
          .line { border-top: 1px solid #475569; width: 80%; margin: 0 auto 4px auto; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td width="20%"><strong style="font-size:16px; color:#0284c7;">OCA ONE</strong><br/>Sistema HACCP / ISO 22000</td>
            <td width="60%" class="header-title">
              PROGRAMA DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE EQUIPOS E INSTRUMENTOS DE MEDICIÓN
            </td>
            <td width="20%">
              <strong>CÓDIGO:</strong> MAN-PME-001<br/>
              <strong>VERSIÓN:</strong> 3.0.0<br/>
              <strong>FECHA:</strong> 06/07/2022
            </td>
          </tr>
        </table>

        <div class="section-title">1. INTRODUCCIÓN Y OBJETIVO</div>
        <p><strong>Objetivo:</strong> Establecer el procedimiento para llevar a cabo el mantenimiento preventivo y correctivo de los equipos e instrumentos de medición para lograr la máxima confiabilidad, funcionalidad, durabilidad y evitar paros no programados en el proceso productivo.</p>
        <p><strong>Alcance:</strong> Aplica a todos los equipos, herramientas e instrumentos de medición involucrados en las operaciones del establecimiento alimentario.</p>

        <div class="section-title">2. DEFINICIONES</div>
        <ul>
          <li><strong>Mantenimiento Preventivo:</strong> Inspección periódica programada de los equipos para descubrir y corregir condiciones que conducen a paros imprevistos o desgaste prematuro.</li>
          <li><strong>Mantenimiento Correctivo:</strong> Acción para reparar defectos o fallos observados en los equipos o instalaciones para restituir su funcionamiento normal.</li>
          <li><strong>Fiabilidad y Disponibilidad:</strong> Capacidad técnica de un equipo para funcionar de forma continua y segura cuando es requerido.</li>
        </ul>

        <div class="section-title">3. FRECUENCIAS DE MANTENIMIENTO PREVENTIVO</div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Área Operativa</th>
              <th>Equipo / Maquinaria</th>
              <th>Especificación / Capacidad</th>
              <th>Frecuencia Mantenimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Recepción de Leche</td><td>Motobomba GX 120</td><td>2.9 kW, 119 cm³, Monocilíndrico 4 tiempos</td><td>Diaria, Semanal, Semestral</td></tr>
            <tr><td>Cuajado</td><td>Electrobomba 2HP</td><td>1500W, 3450 RPM, 110/220V</td><td>Diaria, Semanal, Semestral</td></tr>
            <tr><td>Hilado</td><td>Hiladoras de Queso</td><td>Acero Inox 304, Motorreductor SITI 3HP</td><td>Diaria, Semanal, Mensual</td></tr>
            <tr><td>Moldeo</td><td>Moldeadora Industrial</td><td>Tolva 250kg, Dosificación 400g-2500g, 220V</td><td>Diaria, Semanal, Mensual</td></tr>
            <tr><td>Moldeo</td><td>Ventiladores / Extractores</td><td>26" 7800CFM / 14" 1700 RPM 1/8HP</td><td>Semanal / Diaria</td></tr>
            <tr><td>Empaque</td><td>Plancha Selladora Baquelita</td><td>1200W 120V, Cuerpo en Baquelita / Aluminio</td><td>Diaria, Mensual</td></tr>
            <tr><td>Cuartos Fríos</td><td>Cuarto de Choque (5 HP)</td><td>Poliuretano, Evaporador 14500 BTU, Condensador 5HP</td><td>Diaria, Semanal, Mensual, Trimestral</td></tr>
            <tr><td>Cuartos Fríos</td><td>Cuarto Almacenamiento (7.5 HP)</td><td>Evaporador 24000 BTU, Condensador 7.5HP</td><td>Diaria, Semanal, Mensual, Trimestral</td></tr>
            <tr><td>Servicios / Térmico</td><td>Caldera Pirotubular 60 BHP</td><td>Pirotubular 3 pasos, 97% Efic, Quemador 1.2M BTU</td><td>Diaria, Semanal, Semestral</td></tr>
            <tr><td>Servicios / Energía</td><td>Planta Eléctrica Cummins 80 KVA</td><td>Motor 4BTA3.9-G2 4 Tiempos, Alternador Marathon</td><td>Diaria, Semanal, Mensual</td></tr>
            <tr><td>Servicios / Neumático</td><td>Compresor de Aire 2HP</td><td>80-120 PSI, Tanque 170L, 3440 RPM 220/440V</td><td>Diaria, Semanal, Quincenal</td></tr>
          </tbody>
        </table>

        <div class="section-title">4. PROCEDIMIENTO DE EJECUCIÓN DEL MANTENIMIENTO</div>
        <p><strong>Mantenimiento Preventivo:</strong> Incluye limpieza diaria pre-operacional, revisión semanal de protectores, lubricación de cojinetes, inspección mensual de tablero de control y variadores de frecuencia, y desincrustación periódica.</p>
        <p><strong>Mantenimiento Correctivo:</strong> Evaluar la falla, analizar causa raíz, reparar o cambiar piezas defectuosas y ejecutar pruebas finales antes de liberar el equipo a producción.</p>

        <div class="section-title">5. FORMATO DE REGISTRO ASOCIADO</div>
        <p>Todas las intervenciones técnicas quedan asentadas de forma obligatoria en el formato oficial <strong>FOPME-002 (Formato de Mantenimiento Realizado a Equipos y Maquinaria)</strong>.</p>

        <table class="footer-signatures">
          <tr>
            <td width="50%">
              <div class="line"></div>
              <strong>Elaboró / Revisó:</strong><br/>
              Téc. Mateo Morales / Líder Mantenimiento
            </td>
            <td width="50%">
              <div class="line"></div>
              <strong>Aprobó:</strong><br/>
              Ing. Carlos Gómez / Director de Calidad
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

  // Función de impresión del Formato en Blanco FOPME-002
  const handlePrintFormatoBlanco = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>FOPME-002 - Formato de Mantenimiento Realizado a Equipos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 25px; color: #0f172a; line-height: 1.4; font-size: 11px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .header-table td { border: 1px solid #334155; padding: 6px; text-align: center; }
          .meta-box { border: 1px solid #cbd5e1; padding: 8px; margin-bottom: 15px; background: #f8fafc; }
          table.log-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          table.log-table th, table.log-table td { border: 1px solid #475569; padding: 8px; text-align: left; }
          table.log-table th { background: #e2e8f0; font-weight: bold; text-transform: uppercase; font-size: 10px; }
          .empty-row { height: 35px; }
          .footer-signature { margin-top: 50px; width: 100%; border-collapse: collapse; }
          .footer-signature td { text-align: center; border: none; }
          .line { border-top: 1px solid #000; width: 75%; margin: 0 auto 4px auto; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td width="20%"><strong style="font-size:15px; color:#0284c7;">OCA ONE</strong><br/>Control de Calidad</td>
            <td width="60%"><strong style="font-size:13px; text-transform:uppercase;">FORMATO DE REGISTRO DE MANTENIMIENTO REALIZADO A EQUIPOS Y MAQUINARIA</strong></td>
            <td width="20%"><strong>CÓDIGO:</strong> FOPME-002<br/><strong>VERSIÓN:</strong> 2.0.0</td>
          </tr>
        </table>

        <div class="meta-box">
          <table width="100%" style="border:none;">
            <tr>
              <td><strong>Planta / Empresa:</strong> ____________________________</td>
              <td><strong>Área Operativa:</strong> ____________________________</td>
              <td><strong>Fecha de Inspección:</strong> ____ / ____ / 2026</td>
            </tr>
          </table>
        </div>

        <table class="log-table">
          <thead>
            <tr>
              <th width="15%">Equipo / Código</th>
              <th width="12%">Tipo Intervención</th>
              <th width="35%">Descripción de Actividad Realizada</th>
              <th width="18%">Repuestos / Insumos Usados</th>
              <th width="10%">Estado Final</th>
              <th width="10%">Técnico / Firma</th>
            </tr>
          </thead>
          <tbody>
            ${[1,2,3,4,5,6,7,8,9,10].map(() => `
              <tr class="empty-row">
                <td></td><td></td><td></td><td></td><td></td><td></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="footer-signature">
          <tr>
            <td width="50%">
              <div class="line"></div>
              <strong>Firma del Técnico de Mantenimiento</strong>
            </td>
            <td width="50%">
              <div class="line"></div>
              <strong>Firma / V°B° Supervisor de Calidad</strong>
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
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-check-circle-fill me-2"></i>¡Registro de Mantenimiento Guardado!</strong> La intervención técnica ha sido indexada en la bitácora FOPME-002 del establecimiento.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)}></button>
        </div>
      )}

      {/* Banner Encabezado Módulo Mantenimiento */}
      <div className="d-flex align-items-center justify-content-between p-3 mb-4 rounded-3 border bg-body shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-indigo" style={{ width: '44px', height: '44px', fontSize: '22px' }}>
            <i className="bi bi-tools"></i>
          </div>
          <div>
            <div className="fw-bold font-heading text-dark" style={{ fontSize: '17px' }}>Módulo de Mantenimiento de Equipos e Maquinaria (MAN-PME)</div>
            <div className="text-muted small">Gestión unificada de Mantenimiento Preventivo, Correctivo y Calibración ISO 22000 / HACCP.</div>
          </div>
        </div>
        <button 
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
          onClick={() => setMostrarHistorial(true)}
        >
          <i className="bi bi-clock-history"></i> Historial de Versiones
        </button>
      </div>

      <div className="d-flex flex-column gap-4">
        
        {/* BLOQUE 1: Procedimiento Oficial ISO (MAN-PME-001) */}
        <div className="card gipa-card p-4 border-0 shadow-sm border-top border-5 border-primary">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="badge bg-primary-subtle text-primary me-2 fw-semibold">MAN-PME-001</span>
              <span className="badge bg-success-subtle text-success">Versión 3.0.0 Vigente</span>
            </div>
            {canDownloadPDF ? (
              <button 
                className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2 fw-semibold"
                onClick={handlePrintDocumentoOficial}
              >
                <i className="bi bi-file-earmark-pdf-fill text-danger"></i> Previsualizar / Descargar PDF Oficial ISO
              </button>
            ) : (
              <button className="btn btn-outline-secondary btn-sm disabled" title="Descarga restringida por rol (Solo Super Administrador)">
                <i className="bi bi-lock-fill me-1"></i> Descarga Restringida por Rol
              </button>
            )}
          </div>

          <h4 className="fw-bold font-heading text-dark mb-2">
            Programa de Mantenimiento Preventivo y Correctivo de Equipos e Instrumentos
          </h4>
          <p className="text-muted small mb-3">
            Establece los lineamientos técnicos para el mantenimiento preventivo, limpieza profunda, inspección periódica y reparación correctiva de maquinaria de proceso y servicios auxiliares.
          </p>

          <div className="row g-3 bg-body-tertiary p-3 rounded-3 mb-3 border">
            <div className="col-12 col-md-3">
              <small className="text-muted d-block">Fecha Aprobación:</small>
              <strong className="text-dark">06 / Julio / 2022</strong>
            </div>
            <div className="col-12 col-md-3">
              <small className="text-muted d-block">Elaborado por:</small>
              <strong className="text-dark">Jefe de Calidad / Mantenimiento</strong>
            </div>
            <div className="col-12 col-md-3">
              <small className="text-muted d-block">Alcance:</small>
              <strong className="text-dark">Toda la Planta Procesadora</strong>
            </div>
            <div className="col-12 col-md-3">
              <small className="text-muted d-block">Formato de Registro:</small>
              <strong className="text-primary">FOPME-002</strong>
            </div>
          </div>

          {/* Frecuencias de Mantenimiento por Equipo */}
          <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-list-task me-2 text-primary"></i>Tabla de Frecuencia y Equipos Registrados</h6>
          <div className="table-responsive">
            <table className="table table-sm table-hover align-middle border mb-0" style={{ fontSize: '12.5px' }}>
              <thead className="table-light">
                <tr>
                  <th>Área Operativa</th>
                  <th>Equipo / Maquinaria</th>
                  <th>Capacidad / Especificación</th>
                  <th>Frecuencia Mantenimiento</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Recepción de Leche</td><td className="fw-bold">Motobomba GX 120</td><td>Motor 4 Tiempos 2.9kW 119cm³</td><td>Diaria, Semanal, Semestral</td></tr>
                <tr><td>Cuajado</td><td className="fw-bold">Electrobomba 2HP</td><td>1500W 3450 RPM 110/220V</td><td>Diaria, Semanal, Semestral</td></tr>
                <tr><td>Hilado</td><td className="fw-bold">Hiladoras de Queso</td><td>Acero Inox 304, Motorreductor SITI 3HP</td><td>Diaria, Semanal, Mensual</td></tr>
                <tr><td>Moldeo</td><td className="fw-bold">Moldeadora Industrial</td><td>Tolva 250kg, Dosificación 400g-2500g</td><td>Diaria, Semanal, Mensual</td></tr>
                <tr><td>Empaque</td><td className="fw-bold">Plancha Selladora Baquelita</td><td>1200W 120V, Cuerpo en Baquelita</td><td>Diaria, Mensual</td></tr>
                <tr><td>Cuartos Fríos</td><td className="fw-bold">Cuarto de Choque / Almacenamiento</td><td>Unidades 5HP y 7.5HP, Evaporadores BTU</td><td>Diaria, Semanal, Mensual, Trimestral</td></tr>
                <tr><td>Servicios Térmicos</td><td className="fw-bold">Caldera Pirotubular 60 BHP</td><td>3 Pasos, 97% Eficiencia, Quemador 1.2M BTU</td><td>Diaria, Semanal, Semestral</td></tr>
                <tr><td>Servicios Energía</td><td className="fw-bold">Planta Eléctrica Cummins 80 KVA</td><td>Motor 4BTA3.9-G2, Alternador Marathon</td><td>Diaria, Semanal, Mensual</td></tr>
                <tr><td>Servicios Neumáticos</td><td className="fw-bold">Compresor de Aire 2HP</td><td>80-120 PSI, Tanque 170 Litros</td><td>Diaria, Semanal, Quincenal</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BLOQUE 2: Formatos Imprimibles y Bitácora Digital FOPME-002 */}
        <div className="card gipa-card p-4 border-0 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="card-title font-heading mb-1 text-dark">
                <i className="bi bi-printer-fill text-success me-2"></i>Formatos Imprimibles y Bitácora Digital (FOPME-002)
              </h4>
              <p className="text-muted small mb-0">Descarga la plantilla vacía o registra las intervenciones técnicas ejecutadas.</p>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-outline-success d-flex align-items-center gap-2"
                onClick={handlePrintFormatoBlanco}
              >
                <i className="bi bi-printer"></i> Imprimir Formato Blanco (FOPME-002)
              </button>
              
              <button 
                className="btn btn-sm btn-success d-flex align-items-center gap-2"
                onClick={() => setMostrarRegistroForm(prev => !prev)}
              >
                <i className="bi bi-plus-circle"></i> {mostrarRegistroForm ? 'Cerrar Formulario' : 'Diligenciar Formato Mantenimiento'}
              </button>
            </div>
          </div>

          {/* Formulario de Diligenciamiento */}
          {mostrarRegistroForm && (
            <form onSubmit={handleCrearRegistro} className="border p-4 rounded-3 bg-light bg-opacity-50 mb-4 fade-in-view" style={{ fontSize: '13px' }}>
              <h5 className="fw-bold text-success font-heading mb-3">
                <i className="bi bi-journal-plus me-2"></i>Registrar Mantenimiento Realizado a Equipo
              </h5>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Equipo / Maquinaria</label>
                  <select 
                    className="form-select form-select-sm"
                    value={nuevoEquipo}
                    onChange={(e) => setNuevoEquipo(e.target.value)}
                  >
                    <option value="Motobomba Recepción GX 120">Motobomba Recepción GX 120</option>
                    <option value="Electrobomba Cuajado 2HP">Electrobomba Cuajado 2HP</option>
                    <option value="Hiladora de Queso 3HP">Hiladora de Queso 3HP</option>
                    <option value="Moldeadora Industrial 250kg">Moldeadora Industrial 250kg</option>
                    <option value="Plancha Selladora Baquelita">Plancha Selladora Baquelita</option>
                    <option value="Cuarto Frío de Choque 5HP">Cuarto Frío de Choque 5HP</option>
                    <option value="Cuarto Frío Producto Terminado 7.5HP">Cuarto Frío Producto Terminado 7.5HP</option>
                    <option value="Caldera Pirotubular 60 BHP">Caldera Pirotubular 60 BHP</option>
                    <option value="Planta Eléctrica Cummins 80 KVA">Planta Eléctrica Cummins 80 KVA</option>
                    <option value="Compresor de Aire 2HP">Compresor de Aire 2HP</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Tipo de Intervención</label>
                  <select 
                    className="form-select form-select-sm"
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
                  >
                    <option value="Preventivo">Preventivo (Programado)</option>
                    <option value="Correctivo">Correctivo (Reparación)</option>
                    <option value="Emergencia">Reparación de Emergencia</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Estado del Equipo</label>
                  <select 
                    className="form-select form-select-sm"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                  >
                    <option value="Operativo">Operativo (100% Funcional)</option>
                    <option value="En Pruebas">En Pruebas Operativas</option>
                    <option value="Fuera de Servicio">Fuera de Servicio / Averiado</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Descripción de la Actividad Realizada</label>
                <textarea 
                  className="form-control form-control-sm" 
                  rows="2"
                  placeholder="Ej: Cambio de lubricante del cárter, purga de condensados y ajuste de bandas del motor..."
                  value={nuevaActividad}
                  onChange={(e) => setNuevaActividad(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Repuestos e Insumos Utilizados</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Filtro de aceite, empacadura teflón 3/4"
                    value={nuevosRepuestos}
                    onChange={(e) => setNuevosRepuestos(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Técnico / Responsable de Ejecución</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Téc. Mateo Morales"
                    value={nuevoTecnico}
                    onChange={(e) => setNuevoTecnico(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarRegistroForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success px-3">
                  <i className="bi bi-save me-1"></i> Guardar Registro FOPME-002
                </button>
              </div>
            </form>
          )}

          {/* Tabla de Bitácora Digital */}
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0" style={{ fontSize: '13px' }}>
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Equipo / Maquinaria</th>
                  <th>Tipo</th>
                  <th>Actividad Realizada</th>
                  <th>Repuestos Utilizados</th>
                  <th>Técnico</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {registrosMantenimiento.map(reg => (
                  <tr key={reg.id}>
                    <td className="fw-semibold text-muted" style={{ fontSize: '12px' }}>{reg.fecha}</td>
                    <td className="fw-bold text-dark">{reg.equipo}</td>
                    <td>
                      <span className={`badge ${reg.tipo === 'Preventivo' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning-emphasis'}`}>
                        {reg.tipo}
                      </span>
                    </td>
                    <td>{reg.actividad}</td>
                    <td className="small text-muted">{reg.repuestos}</td>
                    <td>{reg.tecnico}</td>
                    <td>
                      <span className={`badge ${reg.estado === 'Operativo' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        <i className={`bi ${reg.estado === 'Operativo' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-1`}></i>
                        {reg.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Historial de Versiones ISO */}
      {mostrarHistorial && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-primary text-white border-0" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <h5 className="modal-title font-heading fw-bold">
                  <i className="bi bi-clock-history me-2"></i>Historial de Versiones - MAN-PME-001
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarHistorial(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info py-2 px-3 small border-0 mb-3" style={{ borderRadius: '8px' }}>
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Trazabilidad de cambios según los requisitos de auditoría ISO 9001, ISO 22000 y BPM.
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle border mb-0" style={{ fontSize: '13px' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Versión</th>
                        <th>Fecha</th>
                        <th>Solicitante / Cargo</th>
                        <th>Descripción del Cambio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="badge bg-secondary">v1.0.0</span></td>
                        <td>12 / 01 / 2016</td>
                        <td>Jefe de Calidad</td>
                        <td>Creación inicial del programa de mantenimiento de equipos de la planta.</td>
                      </tr>
                      <tr>
                        <td><span className="badge bg-secondary">v2.0.0</span></td>
                        <td>25 / 08 / 2019</td>
                        <td>Jefe de Calidad</td>
                        <td>Actualización de procedimientos e inclusión de fichas técnicas de electrobombas y moldeadora.</td>
                      </tr>
                      <tr>
                        <td><span className="badge bg-primary">v3.0.0</span></td>
                        <td>06 / 07 / 2022</td>
                        <td>Jefe de Calidad / Mantenimiento</td>
                        <td>Actualización General con parámetros de caldera pirotubular 60 BHP y generador Cummins 80 KVA.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-top-0 p-3 bg-light" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMostrarHistorial(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
