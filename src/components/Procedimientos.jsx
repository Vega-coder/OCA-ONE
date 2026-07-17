import React, { useState, useEffect } from 'react';

function Procedimientos({ 
  procedimientos, 
  onAgregar, 
  carpetaActiva, 
  setCarpetaActiva
}) {
  const [procSeleccionado, setProcSeleccionado] = useState(null);
  const [formSeleccionado, setFormSeleccionado] = useState(null);
  
  // Mostrar formulario correspondiente
  const [mostrarCrearPoes, setMostrarCrearPoes] = useState(false);
  const [mostrarCrearFormato, setMostrarCrearFormato] = useState(false);

  // Estados del Formulario para Crear Procedimiento (POES)
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('Limpieza y Desinfección');
  const [nuevaVersion, setNuevaVersion] = useState('1.0.0');
  const [nuevoResponsable, setNuevoResponsable] = useState('Carlos Gómez');
  const [nuevoContenido, setNuevoContenido] = useState('');
  
  // Estados del Formulario para Crear Formato de Registro
  const [regTitulo, setRegTitulo] = useState('');
  const [regCodigo, setRegCodigo] = useState('');
  const [regVersion, setRegVersion] = useState('1.0.0');
  const [regColumnas, setRegColumnas] = useState('Fecha, Detalle, Conforme, Firma');
  const [regFilas, setRegFilas] = useState(10);
  const [regNota, setRegNota] = useState('');

  const [alertaExito, setAlertaExito] = useState(false);
  const [alertaRegExito, setAlertaRegExito] = useState(false);

  // Base de datos de Formatos/Plantillas de Registros en Blanco (Imprimibles) con persistencia en localStorage
  const [formatosImprimibles, setFormatosImprimibles] = useState(() => {
    const saved = localStorage.getItem('OCA-formatos-v4');
    return saved ? JSON.parse(saved) : [
      {
        id: 'f-lim',
        codigo: 'F-LIM-01',
        titulo: 'Formato de Inspección y Registro de Higiene Diario',
        categoria: 'Limpieza y Desinfección',
        version: '1.0.0',
        responsable: 'Carlos Gómez',
        columnas: ['Área o Equipo', 'Tipo de Limpieza', 'Químico Utilizado', 'Estado (Conforme / No Conforme)', 'Firma Operador'],
        filasVacias: 10,
        nota: 'Rellenar diariamente al inicio y cierre de cada jornada de producción en planta.'
      },
      {
        id: 'f-plg',
        codigo: 'F-PLG-01',
        titulo: 'Planilla de Monitoreo de Estaciones de Cebado Externas',
        categoria: 'Control de Plagas',
        version: '1.0.2',
        responsable: 'Carlos Gómez',
        columnas: ['Nº Estación', 'Ubicación Planta', 'Consumo Cebo (%)', 'Estado Físico Trampa', 'Operario Firma'],
        filasVacias: 15,
        nota: 'Inspeccionar semanalmente todas las estaciones periféricas numeradas.'
      },
      {
        id: 'f-res',
        codigo: 'F-RES-01',
        titulo: 'Bitácora Diaria de Clasificación y Retiro de Residuos',
        categoria: 'Residuos Sólidos y Líquidos',
        version: '1.1.0',
        responsable: 'Carlos Gómez',
        columnas: ['Fecha', 'Tipo de Residuo (Org/Plast/Pelig)', 'Cantidad (Kg / Litros)', 'Operario Entrega', 'Firma Receptor'],
        filasVacias: 10,
        nota: 'Registrar cada retiro de basuras y despachos de aceites quemados al proveedor.'
      },
      {
        id: 'f-agu',
        codigo: 'F-AGU-01',
        titulo: 'Planilla Diaria de Medición de Cloro Libre y pH',
        categoria: 'Agua Potable',
        version: '1.0.0',
        responsable: 'Carlos Gómez',
        columnas: ['Día del Mes', 'Cloro Libre (ppm) [0.3 - 2.0]', 'pH [6.5 - 8.5]', 'Hora Registro', 'Firma Supervisor'],
        filasVacias: 15,
        nota: 'Medir en la salida del tanque principal antes de iniciar las operaciones.'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('OCA-formatos-v4', JSON.stringify(formatosImprimibles));
  }, [formatosImprimibles]);

  const handleCrearProcedimiento = (e) => {
    e.preventDefault();

    if (!nuevoTitulo.trim() || !nuevoContenido.trim()) {
      alert("Por favor rellena el título y las instrucciones del procedimiento.");
      return;
    }

    const nuevo = {
      titulo: nuevoTitulo.trim(),
      categoria: carpetaActiva,
      version: nuevaVersion,
      responsable: nuevoResponsable,
      contenido: nuevoContenido.trim()
    };

    onAgregar(nuevo);
    setNuevoTitulo('');
    setNuevoContenido('');
    setMostrarCrearPoes(false);
    setAlertaExito(true);

    setTimeout(() => {
      setAlertaExito(false);
    }, 4000);
  };

  const handleCrearFormatoRegistro = (e) => {
    e.preventDefault();

    if (!regTitulo.trim() || !regCodigo.trim() || !regColumnas.trim()) {
      alert("Por favor rellena todos los campos requeridos para el formato.");
      return;
    }

    // Convertir columnas comma-separated a array de strings
    const colsArray = regColumnas.split(',').map(col => col.trim());

    const nuevoFormato = {
      id: `f-custom-${Date.now()}`,
      codigo: regCodigo.trim().toUpperCase(),
      titulo: regTitulo.trim(),
      categoria: carpetaActiva,
      version: regVersion,
      responsable: 'Carlos Gómez',
      columnas: colsArray,
      filasVacias: parseInt(regFilas) || 10,
      nota: regNota.trim() || 'Registrar las actividades según los estándares del plan de saneamiento.'
    };

    setFormatosImprimibles(prev => [...prev, nuevoFormato]);
    setRegTitulo('');
    setRegCodigo('');
    setRegColumnas('Fecha, Detalle, Conforme, Firma');
    setRegNota('');
    setMostrarCrearFormato(false);
    setAlertaRegExito(true);

    setTimeout(() => {
      setAlertaRegExito(false);
    }, 4000);
  };

  // Filtrar procedimientos en la categoría activa
  const procedimientosEnCarpeta = procedimientos.filter(p => p.categoria === carpetaActiva);

  // Filtrar formatos vacíos en la categoría activa
  const formatosEnCarpeta = formatosImprimibles.filter(f => f.categoria === carpetaActiva);

  return (
    <div className="fade-in-view">
      {/* Alerta de Creación Exitosa de Procedimiento */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-file-earmark-check-fill me-2"></i>¡Procedimiento creado con éxito!</strong> El documento ha sido indexado en su carpeta y está disponible para auditorías.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)} aria-label="Close"></button>
        </div>
      )}

      {/* Alerta de Creación Exitosa de Formato de Registro */}
      {alertaRegExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-file-earmark-check-fill me-2"></i>¡Formato de Registro Creado!</strong> La nueva plantilla de registro imprimible se ha agregado a la base de datos de control documental.
          <button type="button" className="btn-close" onClick={() => setAlertaRegExito(false)} aria-label="Close"></button>
        </div>
      )}

      <div className="d-flex flex-column gap-4">
        
        {/* Card de Manuales POES */}
        <div className="card gipa-card p-4 border-0 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div>
              <h4 className="card-title font-heading mb-1 text-dark">
                <i className="bi bi-file-earmark-pdf-fill text-danger me-2"></i>Procedimientos en: {carpetaActiva}
              </h4>
              <p className="text-muted small mb-0">Listado oficial de manuales POES y especificaciones de calidad vigentes.</p>
            </div>
            
            {/* CONDICIONAL DE BOTÓN SUPERIOR: 
                - Limpieza y Desinfección -> Redactar POES
                - Otros -> Redactar Registro
            */}
            {carpetaActiva === 'Limpieza y Desinfección' ? (
              <button 
                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                onClick={() => {
                  setMostrarCrearPoes(prev => !prev);
                  setMostrarCrearFormato(false);
                }}
              >
                {mostrarCrearPoes ? (
                  <span><i className="bi bi-x-circle me-1"></i> Cerrar Editor</span>
                ) : (
                  <span><i className="bi bi-plus-circle me-1"></i> Redactar POES</span>
                )}
              </button>
            ) : (
              <button 
                className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                onClick={() => {
                  setMostrarCrearFormato(prev => !prev);
                  setMostrarCrearPoes(false);
                }}
              >
                {mostrarCrearFormato ? (
                  <span><i className="bi bi-x-circle me-1"></i> Cerrar Formulario</span>
                ) : (
                  <span><i className="bi bi-plus-circle me-1"></i> Redactar Registro</span>
                )}
              </button>
            )}
          </div>

          {/* Formulario 1: Redactar POES (Solo disponible para Limpieza y Desinfección) */}
          {mostrarCrearPoes && carpetaActiva === 'Limpieza y Desinfección' && (
            <form onSubmit={handleCrearProcedimiento} className="border p-4 rounded bg-light bg-opacity-25 fade-in-view mb-3">
              <h5 className="fw-bold font-heading text-success mb-3"><i className="bi bi-file-earmark-plus me-1"></i>Redactar Nuevo Procedimiento (POES)</h5>
              
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
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Categoría del Plan</label>
                  <input type="text" className="form-control form-control-sm bg-secondary bg-opacity-10 text-muted" value={carpetaActiva} disabled />
                </div>
                
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
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarCrearPoes(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success">
                  <i className="bi bi-save me-1"></i> Publicar Documento
                </button>
              </div>
            </form>
          )}

          {/* Formulario 2: Redactar Registro (Disponible para las demás categorías) */}
          {mostrarCrearFormato && (
            <form onSubmit={handleCrearFormatoRegistro} className="border p-4 rounded bg-light bg-opacity-25 fade-in-view mb-3">
              <h5 className="fw-bold font-heading text-success mb-3"><i className="bi bi-file-earmark-plus me-1"></i>Diseñar Nuevo Formato de Registro Vacío</h5>
              
              <div className="row g-2 mb-3">
                <div className="col-12 col-md-8">
                  <label className="form-label fw-semibold small">Título del Formato de Registro</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={regTitulo} 
                    onChange={(e) => setRegTitulo(e.target.value)} 
                    placeholder="Ej: Planilla de Control de Cebaderos Perimetrales" 
                    required 
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Código de Calidad</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    value={regCodigo} 
                    onChange={(e) => setRegCodigo(e.target.value)} 
                    placeholder="Ej: F-PLG-02" 
                    required 
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Categoría Asociada</label>
                  <input type="text" className="form-control form-control-sm bg-secondary bg-opacity-10 text-muted" value={carpetaActiva} disabled />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label fw-semibold small">Versión</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm text-center" 
                    value={regVersion} 
                    onChange={(e) => setRegVersion(e.target.value)} 
                    placeholder="1.0.0" 
                    required 
                  />
                </div>
                <div className="col-6 col-md-3">
                  <label className="form-label fw-semibold small">Cantidad de Filas en Blanco</label>
                  <input 
                    type="number" 
                    className="form-control form-control-sm text-center" 
                    value={regFilas} 
                    onChange={(e) => setRegFilas(e.target.value)} 
                    min="5"
                    max="30"
                    required 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Columnas de la Tabla (Separadas por comas)</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={regColumnas} 
                  onChange={(e) => setRegColumnas(e.target.value)} 
                  placeholder="Ej: Estación #, Cebo Consumido, Trampa Activa, Firma Supervisor" 
                  required 
                />
                <div className="form-text text-muted" style={{ fontSize: '11px' }}>Ingresa los nombres de las columnas que el operario rellenará en la hoja física, separados por comas.</div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Instrucciones / Notas al Pie de Página</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  value={regNota} 
                  onChange={(e) => setRegNota(e.target.value)} 
                  placeholder="Ej: Controlar en cada turno de empaque y despachos." 
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarCrearFormato(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success">
                  <i className="bi bi-save me-1"></i> Crear y Guardar Formato
                </button>
              </div>
            </form>
          )}

          {/* Listado de Procedimientos */}
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
                    <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '16px' }}>{proc.titulo}</h5>
                    <div className="text-muted small">Aprobado el: {proc.fechaAprobacion} | Supervisor: {proc.responsable}</div>
                  </div>
                  <div>
                    <button 
                      className="btn btn-success d-flex align-items-center gap-1"
                      onClick={() => setProcSeleccionado(proc)}
                    >
                      <i className="bi bi-file-earmark-pdf"></i> Ver PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SECCIÓN: Plantillas y Formatos Imprimibles (Registros Asociados) */}
        <div className="card gipa-card p-4 border-0 shadow-sm border-top border-5 border-success">
          <h4 className="card-title font-heading mb-1 text-success">
            <i className="bi bi-printer-fill me-2"></i>Plantillas y Formatos Imprimibles (Registros Asociados)
          </h4>
          <p className="text-muted small mb-4">Descarga e imprime los formatos oficiales vacíos para registrar manualmente las actividades en planta.</p>

          <div className="d-flex flex-column gap-3">
            {formatosEnCarpeta.length === 0 ? (
              <div className="text-center py-4 text-muted">
                Sin formatos imprimibles cargados para esta carpeta.
              </div>
            ) : (
              formatosEnCarpeta.map(form => (
                <div key={form.id} className="border rounded-3 p-3 bg-body d-flex justify-content-between align-items-center hover-shadow transition-all">
                  <div>
                    <div className="d-flex align-items-center mb-1">
                      <span className="badge bg-success-subtle text-success me-2">{form.codigo}</span>
                      <span className="badge bg-dark-subtle text-dark">Plantilla Vacía</span>
                    </div>
                    <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '15px' }}>{form.titulo}</h5>
                    <p className="text-muted mb-0 small"><i className="bi bi-info-circle me-1"></i>{form.nota}</p>
                  </div>
                  <div>
                    <button 
                      className="btn btn-outline-success d-flex align-items-center gap-1"
                      onClick={() => setFormSeleccionado(form)}
                    >
                      <i className="bi bi-printer"></i> Previsualizar / Imprimir PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Visor Modal de PDF Simulado (Para Procedimientos Textuales) */}
      {procSeleccionado && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="modal-header bg-dark text-white py-2 px-3 justify-content-between">
                <h6 className="mb-0"><i className="bi bi-file-earmark-pdf text-danger me-2"></i>Visor de Documentos Oficiales (POES)</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setProcSeleccionado(null)} aria-label="Close"></button>
              </div>

              <div className="modal-body p-4 bg-secondary bg-opacity-10 d-flex justify-content-center">
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
                  
                  {/* Encabezado */}
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

                  {/* Título */}
                  <div className="text-center mb-4 mt-2">
                    <h3 className="fw-bold text-dark font-heading uppercase" style={{ fontSize: '20px', fontFamily: 'sans-serif' }}>
                      {procSeleccionado.titulo}
                    </h3>
                    <div className="small text-muted mt-1" style={{ fontFamily: 'sans-serif' }}>
                      Área: Plan de Saneamiento Básico | Categoría: {procSeleccionado.categoria}
                    </div>
                  </div>

                  <hr className="mb-4" />

                  {/* Contenido */}
                  <div style={{ whiteSpace: 'pre-wrap', textAlign: 'justify' }}>
                    {procSeleccionado.contenido}
                  </div>

                  {/* Firmas */}
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

      {/* Visor Modal de PDF Simulado (Para PLANTILLAS VACÍAS DE REGISTRO) */}
      {formSeleccionado && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
              <div className="modal-header bg-dark text-white py-2 px-3 justify-content-between">
                <h6 className="mb-0"><i className="bi bi-printer text-success me-2"></i>Plantilla de Registro en Blanco (Imprimible)</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setFormSeleccionado(null)} aria-label="Close"></button>
              </div>

              <div className="modal-body p-4 bg-secondary bg-opacity-10 d-flex justify-content-center">
                <div 
                  className="bg-white text-dark shadow-lg p-5 w-100" 
                  style={{ 
                    minHeight: '800px', 
                    maxWidth: '700px', 
                    fontFamily: 'sans-serif', 
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}
                >
                  
                  {/* Encabezado Formal de Calidad */}
                  <table className="table table-bordered mb-4 text-center align-middle" style={{ fontSize: '10px' }}>
                    <tbody>
                      <tr>
                        <td rowSpan="3" style={{ width: '25%' }} className="fw-bold fs-6 text-success">
                          OCA ONE
                        </td>
                        <td rowSpan="3" style={{ width: '45%' }} className="fw-bold">
                          FORMATO OFICIAL DE REGISTRO SANITARIO
                        </td>
                        <td style={{ width: '30%' }}><strong>Código:</strong> {formSeleccionado.codigo}</td>
                      </tr>
                      <tr>
                        <td><strong>Versión:</strong> {formSeleccionado.version}</td>
                      </tr>
                      <tr>
                        <td><strong>Página:</strong> 1 de 1</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Título */}
                  <div className="text-center mb-3">
                    <h4 className="fw-bold text-dark uppercase mb-1" style={{ fontSize: '16px' }}>
                      {formSeleccionado.titulo}
                    </h4>
                    <p className="text-muted mb-0 small">Programa de Control: {formSeleccionado.categoria}</p>
                  </div>

                  {/* Datos de Cabecera para Rellenar a Mano */}
                  <div className="row g-2 mb-4 p-2 border bg-light bg-opacity-50 rounded" style={{ fontSize: '11px' }}>
                    <div className="col-4"><strong>Fecha Fis. Registro:</strong> ________________</div>
                    <div className="col-4"><strong>Línea / Turno:</strong> _______________</div>
                    <div className="col-4"><strong>Supervisor Responsable:</strong> _________</div>
                  </div>

                  {/* Tabla con Filas Vacías para escribir con Lapicero */}
                  <table className="table table-bordered mb-4 align-middle">
                    <thead>
                      <tr className="table-light text-center" style={{ fontSize: '10px' }}>
                        {formSeleccionado.columnas.map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: formSeleccionado.filasVacias }).map((_, rowIndex) => (
                        <tr key={rowIndex} style={{ height: '35px' }}>
                          {formSeleccionado.columnas.map((_, colIndex) => (
                            <td key={colIndex}>
                              {/* Celdas especiales según columnas */}
                              {formSeleccionado.id === 'f-plg' && colIndex === 0 && (
                                <div className="text-center fw-bold text-muted">{rowIndex + 1}</div>
                              )}
                              {formSeleccionado.id === 'f-agu' && colIndex === 0 && (
                                <div className="text-center fw-bold text-muted">{rowIndex + 1}</div>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <p className="small text-muted mb-4" style={{ fontSize: '10px' }}>
                    * <strong>Nota de Calidad:</strong> {formSeleccionado.nota} Asegurar de archivar este documento una vez sea firmado por el supervisor evaluador.
                  </p>

                  {/* Firmas de Aprobación en Blanco */}
                  <div className="row mt-5 pt-3 text-center" style={{ fontSize: '11px' }}>
                    <div className="col-6">
                      <div className="border-top mx-auto" style={{ width: '150px' }}></div>
                      <div className="mt-1"><strong>Firma Operador Ejecutor</strong></div>
                    </div>
                    <div className="col-6">
                      <div className="border-top mx-auto" style={{ width: '150px' }}></div>
                      <div className="mt-1"><strong>Firma Supervisor de Calidad</strong></div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="modal-footer justify-content-between">
                <span className="small text-muted"><i className="bi bi-info-circle me-1"></i>Imprime este formato para rellenarlo a mano en la planta.</span>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFormSeleccionado(null)}>Cerrar</button>
                  <button type="button" className="btn btn-success btn-sm" onClick={() => window.print()}>
                    <i className="bi bi-printer me-1"></i> Imprimir Formato
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
