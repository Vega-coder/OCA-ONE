import React, { useState } from 'react';

function Procedimientos({ procedimientos, onAgregar, saneamientoLogs, alergenosLogs }) {
  const [carpetaActiva, setCarpetaActiva] = useState('Limpieza y Desinfección');
  const [procSeleccionado, setProcSeleccionado] = useState(null);
  const [mostrarCrearForm, setMostrarCrearForm] = useState(false);

  // Estados del Formulario para Crear Procedimiento
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Limpieza y Desinfección');
  const [nuevaVersion, setNuevaVersion] = useState('1.0.0');
  const [nuevoResponsable, setNuevoResponsable] = useState('Carlos Gómez');
  const [nuevoContenido, setNuevoContenido] = useState('');
  const [alertaExito, setAlertaExito] = useState(false);

  const carpetas = [
    { nombre: 'Limpieza y Desinfección', icono: 'bi-droplet-fill', color: 'text-info', desc: 'POES y bitácora de higiene general.' },
    { nombre: 'Control de Plagas', icono: 'bi-bug-fill', color: 'text-warning', desc: 'Planes preventivos y certificados de control.' },
    { nombre: 'Residuos Sólidos y Líquidos', icono: 'bi-trash-fill', color: 'text-success', desc: 'Disposición de residuos y aceites.' },
    { nombre: 'Agua Potable', icono: 'bi-water', color: 'text-primary', desc: 'Análisis de cloro, pH y lavado de tanques.' }
  ];

  // Datos mock de evidencias de soporte (Plagas, Residuos, Agua)
  const evidenciasSoporte = {
    'Control de Plagas': [
      { id: 101, documento: 'Certificado de Control de Vectores #209', fecha: '2026-07-01', proveedor: 'Plagas Limpias SAS', estado: 'Conforme (Vence: 2026-08-01)' },
      { id: 102, documento: 'Ficha Técnica del Cebo Raticida Roden-Kill', fecha: '2026-05-12', proveedor: 'Químicos del Campo', estado: 'Aprobado (Uso Alimentario)' }
    ],
    'Residuos Sólidos y Líquidos': [
      { id: 201, documento: 'Manifiesto de Disposición de Aceites #AC-908', fecha: '2026-07-10', proveedor: 'EcoGrasas S.A.', estado: 'Recibido 120 Litros' },
      { id: 202, documento: 'Acta de Retiro de Residuos Especiales #55', fecha: '2026-07-05', proveedor: 'Limpieza Total ESP', estado: 'Conforme (350 Kg)' }
    ],
    'Agua Potable': [
      { id: 301, documento: 'Certificado de Lavado y Desinfección de Tanques', fecha: '2026-06-15', proveedor: 'Tanques Sanos', estado: 'Vigente (Vence: 2026-12-15)' },
      { id: 302, documento: 'Análisis Microbiológico de Red Interna', fecha: '2026-06-20', proveedor: 'Lab de Aguas de Antioquia', estado: 'Apto (Agua Potable)' }
    ]
  };

  const handleCrearProcedimiento = (e) => {
    e.preventDefault();

    if (!nuevoTitulo.trim() || !nuevoContenido.trim()) {
      alert("Por favor rellena el título y las instrucciones del procedimiento.");
      return;
    }

    const nuevo = {
      titulo: nuevoTitulo.trim(),
      categoria: nuevaCategoria,
      version: nuevaVersion,
      responsable: nuevoResponsable,
      contenido: nuevoContenido.trim()
    };

    onAgregar(nuevo);
    setNuevoTitulo('');
    setNuevoContenido('');
    setMostrarCrearForm(false);
    setAlertaExito(true);

    setTimeout(() => {
      setAlertaExito(false);
    }, 4000);
  };

  // Filtrar procedimientos en la carpeta activa
  const procedimientosEnCarpeta = procedimientos.filter(p => p.categoria === carpetaActiva);

  return (
    <div className="fade-in-view">
      {/* Alerta de Creación Exitosa */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-file-earmark-check-fill me-2"></i>¡Procedimiento creado con éxito!</strong> El documento ha sido indexado en su carpeta y está disponible para auditorías.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)} aria-label="Close"></button>
        </div>
      )}

      {/* Grid de Carpetas del Plan de Saneamiento */}
      <div className="row g-4 mb-4">
        {carpetas.map(folder => (
          <div key={folder.nombre} className="col-12 col-md-6 col-lg-3">
            <button 
              className={`card gipa-card p-3 w-100 text-start border-0 h-100 transition-all ${
                carpetaActiva === folder.nombre ? 'border border-success bg-success bg-opacity-10 shadow' : ''
              }`}
              onClick={() => {
                setCarpetaActiva(folder.nombre);
                setMostrarCrearForm(false);
              }}
            >
              <div className="d-flex align-items-center mb-2">
                <i className={`bi ${folder.icono} ${folder.color} fs-2 me-3`}></i>
                <h6 className="fw-bold font-heading mb-0 text-dark" style={{ fontSize: '15px' }}>{folder.nombre}</h6>
              </div>
              <p className="text-muted small mb-0 mt-2" style={{ fontSize: '12px' }}>
                {folder.desc}
              </p>
            </button>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Procedimientos y Documentos de la Carpeta (Columna Izquierda) */}
        <div className="col-12 col-lg-7">
          <div className="card gipa-card p-4 border-0 h-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="card-title font-heading mb-0">
                <i className="bi bi-folder-fill text-warning me-2"></i>Documentos en: {carpetaActiva}
              </h4>
              <button 
                className="btn btn-sm btn-outline-success"
                onClick={() => setMostrarCrearForm(prev => !prev)}
              >
                {mostrarCrearForm ? (
                  <span><i className="bi bi-x-circle me-1"></i> Cerrar Editor</span>
                ) : (
                  <span><i className="bi bi-plus-circle me-1"></i> Redactar POES</span>
                )}
              </button>
            </div>

            {mostrarCrearForm ? (
              // Formulario para Crear / Redactar un procedimiento
              <form onSubmit={handleCrearProcedimiento} className="border p-3 rounded bg-light bg-opacity-25 fade-in-view">
                <h5 className="fw-bold font-heading text-success mb-3"><i className="bi bi-file-earmark-plus me-1"></i>Redactar Nuevo Procedimiento (POES)</h5>
                
                {/* Título */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Título del Documento</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={nuevoTitulo} 
                    onChange={(e) => setNuevoTitulo(e.target.value)} 
                    placeholder="Ej: Manual de desratización y fumigación" 
                    required 
                  />
                </div>

                <div className="row g-2 mb-3">
                  {/* Categoría */}
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold small">Categoría del Plan</label>
                    <select className="form-select form-select-sm" value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} required>
                      <option value="Limpieza y Desinfección">Limpieza y Desinfección</option>
                      <option value="Control de Plagas">Control de Plagas</option>
                      <option value="Residuos Sólidos y Líquidos">Residuos Sólidos y Líquidos</option>
                      <option value="Agua Potable">Agua Potable</option>
                    </select>
                  </div>
                  
                  {/* Versión */}
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-semibold small">Versión</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm text-center" 
                      value={nuevaVersion} 
                      onChange={(e) => setNuevaVersion(e.target.value)} 
                      placeholder="1.0.0" 
                      required 
                    />
                  </div>

                  {/* Responsable */}
                  <div className="col-6 col-md-3">
                    <label className="form-label fw-semibold small">Responsable</label>
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      value={nuevoResponsable} 
                      onChange={(e) => setNuevoResponsable(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {/* Contenido */}
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Contenido del Procedimiento (Instrucciones)</label>
                  <textarea 
                    className="form-control form-control-sm font-monospace" 
                    rows="8" 
                    value={nuevoContenido} 
                    onChange={(e) => setNuevoContenido(e.target.value)}
                    placeholder="Escribe el manual detallado (Objetivo, Alcance, Instrucciones paso a paso, Controles...)"
                    style={{ fontSize: '13px' }}
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarCrearForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-sm btn-success">
                    <i className="bi bi-save me-1"></i> Publicar Documento
                  </button>
                </div>
              </form>
            ) : (
              // Listado de Procedimientos
              <div className="d-flex flex-column gap-3">
                {procedimientosEnCarpeta.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-file-earmark-lock display-3 text-secondary opacity-25 d-block mb-2"></i>
                    No hay manuales de procedimiento cargados en esta carpeta.
                  </div>
                ) : (
                  procedimientosEnCarpeta.map(proc => (
                    <div key={proc.id} className="border rounded-3 p-3 bg-body shadow-sm d-flex justify-content-between align-items-center">
                      <div>
                        <div className="d-flex align-items-center mb-1">
                          <span className="badge bg-secondary-subtle text-secondary me-2">{proc.codigo}</span>
                          <span className="badge bg-success-subtle text-success">V.{proc.version}</span>
                        </div>
                        <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>{proc.titulo}</h5>
                        <div className="text-muted small">Aprobado el: {proc.fechaAprobacion} | Supervisor: {proc.responsable}</div>
                      </div>
                      <div>
                        <button 
                          className="btn btn-sm btn-success d-flex align-items-center gap-1"
                          onClick={() => setProcSeleccionado(proc)}
                        >
                          <i className="bi bi-file-earmark-pdf"></i> Ver PDF
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Evidencias y Registros (Columna Derecha) */}
        <div className="col-12 col-lg-5">
          <div className="card gipa-card p-4 border-0 h-100">
            <h4 className="card-title font-heading mb-4 text-success">
              <i className="bi bi-journal-text me-2"></i>Evidencias y Registros Asociados
            </h4>
            <p className="text-muted small">Registros reales de planta que respaldan la ejecución física de este procedimiento específico ante auditorías.</p>

            {carpetaActiva === 'Limpieza y Desinfección' ? (
              // Para Limpieza y Desinfección, mostramos los logs reales de saneamiento
              <div className="table-responsive">
                <table className="table table-sm table-hover align-middle" style={{ fontSize: '12.5px' }}>
                  <thead className="table-light">
                    <tr>
                      <th>Fecha</th>
                      <th>Área</th>
                      <th>Estado</th>
                      <th>Supervisor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {saneamientoLogs.slice(-6).reverse().map(log => (
                      <tr key={log.id}>
                        <td>{log.fecha}</td>
                        <td className="fw-semibold">{log.area}</td>
                        <td>
                          {log.conforme ? (
                            <span className="badge bg-success-subtle text-success">Conforme</span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger">Falla</span>
                          )}
                        </td>
                        <td className="text-muted">{log.supervisor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Para los demás carpetas, cargamos los datos de evidencias mock
              <div className="d-flex flex-column gap-2">
                {evidenciasSoporte[carpetaActiva]?.map(ev => (
                  <div key={ev.id} className="p-3 border rounded-3 bg-light bg-opacity-25 d-flex justify-content-between align-items-center">
                    <div>
                      <strong className="text-dark d-block small" style={{ fontSize: '13px' }}>{ev.documento}</strong>
                      <span className="text-muted small" style={{ fontSize: '11px' }}>Fecha: {ev.fecha} | Org: {ev.proveedor}</span>
                    </div>
                    <span className="badge bg-success-subtle text-success small">{ev.estado}</span>
                  </div>
                )) || (
                  <div className="text-center py-4 text-muted small">
                    Sin registros de soporte en línea.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visor Modal de PDF Simulado */}
      {procSeleccionado && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              
              {/* Cabecera del Visor */}
              <div className="modal-header bg-dark text-white py-2 px-3 justify-content-between">
                <h6 className="mb-0"><i className="bi bi-file-earmark-pdf text-danger me-2"></i>Visor de Documentos Oficiales (POES)</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setProcSeleccionado(null)} aria-label="Close"></button>
              </div>

              {/* Cuerpo del PDF */}
              <div className="modal-body p-4 bg-secondary bg-opacity-10 d-flex justify-content-center">
                
                {/* Hoja de Calidad A4 */}
                <div 
                  className="bg-white text-dark shadow-lg p-5 w-100" 
                  style={{ 
                    minHeight: '800px', 
                    maxWidth: '700px', 
                    fontFamily: 'serif', 
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                >
                  
                  {/* Encabezado Formal de Calidad */}
                  <table className="table table-bordered mb-4 text-center align-middle" style={{ fontSize: '11px', fontFamily: 'sans-serif' }}>
                    <tbody>
                      <tr>
                        <td rowSpan="3" style={{ width: '25%' }} className="fw-bold fs-6 text-success">
                          OCA ONE
                        </td>
                        <td rowSpan="3" style={{ width: '45%' }} className="fw-bold">
                          SISTEMA DE GESTIÓN DE CALIDAD E INOCUIDAD
                        </td>
                        <td style={{ width: '30%' }}><strong>Código:</strong> {procSeleccionado.codigo}</td>
                      </tr>
                      <tr>
                        <td><strong>Versión:</strong> {procSeleccionado.version}</td>
                      </tr>
                      <tr>
                        <td><strong>Página:</strong> 1 de 1</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Título Principal */}
                  <div className="text-center mb-4 mt-2">
                    <h3 className="fw-bold text-dark font-heading uppercase" style={{ fontSize: '20px', fontFamily: 'sans-serif' }}>
                      {procSeleccionado.titulo}
                    </h3>
                    <div className="small text-muted mt-1" style={{ fontFamily: 'sans-serif' }}>
                      Área: Plan de Saneamiento Básico | Categoría: {procSeleccionado.categoria}
                    </div>
                  </div>

                  <hr className="mb-4" />

                  {/* Cuerpo de Texto del Procedimiento */}
                  <div style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
                    {procSeleccionado.contenido}
                  </div>

                  {/* Firmas de Aprobación al pie de página */}
                  <div className="row mt-5 pt-5 text-center" style={{ fontFamily: 'sans-serif', fontSize: '12px' }}>
                    <div className="col-6">
                      <div className="border-top mx-auto" style={{ width: '180px' }}></div>
                      <div className="mt-1"><strong>Elaborado por:</strong></div>
                      <div className="text-muted">{procSeleccionado.responsable}</div>
                    </div>
                    <div className="col-6">
                      <div className="border-top mx-auto" style={{ width: '180px' }}></div>
                      <div className="mt-1"><strong>Aprobado por:</strong></div>
                      <div className="text-muted">{procSeleccionado.responsable}</div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Botones de acción del Modal */}
              <div className="modal-footer justify-content-between">
                <span className="small text-muted"><i className="bi bi-info-circle me-1"></i>Este documento cuenta con firma digital y es inmutable.</span>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setProcSeleccionado(null)}>Cerrar</button>
                  <button type="button" className="btn btn-success btn-sm" onClick={() => window.print()}>
                    <i className="bi bi-printer me-1"></i> Imprimir / PDF
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Procedimientos;
