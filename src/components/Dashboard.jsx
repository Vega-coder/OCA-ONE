import React from 'react';

function Dashboard({ saneamiento, variables, manipuladores, alertas, accionesCapa, onNavigate }) {
  // Cálculos de métricas
  const totalSaneamiento = saneamiento.length;
  const conformesSaneamiento = saneamiento.filter(r => r.conforme).length;
  const cumplimientoSaneamiento = totalSaneamiento > 0 
    ? ((conformesSaneamiento / totalSaneamiento) * 100).toFixed(1) 
    : '100';

  const totalVariables = variables.length;
  const alertasVariables = variables.filter(v => v.estado === 'Alerta').length;
  
  const totalCapa = accionesCapa.length;
  const abiertasCapa = accionesCapa.filter(c => c.estado === 'Abierto').length;

  const totalManipuladores = manipuladores.length;
  const vigentesBpm = manipuladores.filter(m => m.carnetBpm === 'Vigente').length;
  const cumplimientoPersonal = totalManipuladores > 0
    ? ((vigentesBpm / totalManipuladores) * 100).toFixed(1)
    : '100';

  return (
    <div className="fade-in-view">
      {/* Banner de Bienvenida */}
      <div className="card border-0 bg-success text-white p-4 mb-4 rounded-3 shadow-sm position-relative overflow-hidden">
        <div className="position-relative z-1" style={{ zIndex: 2 }}>
          <h2 className="display-6 fw-bold font-heading mb-1">Â¡Buen día, Carlos!</h2>
          <p className="mb-0 opacity-90 fs-5">
            Planta operando bajo estándares HACCP. Tienes <strong>{abiertasCapa}</strong> Acciones Correctivas (CAPA) abiertas que requieren verificación.
          </p>
        </div>
        <div className="position-absolute end-0 top-0 bottom-0 opacity-10 d-none d-lg-block" style={{ width: '400px', background: 'radial-gradient(circle, #fff 10%, transparent 80%)', transform: 'scale(2) translate(50px, -50px)' }}></div>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="row g-4 mb-4">
        {/* Tarjeta Saneamiento */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card OCA-card p-3 h-100 border-0">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 bg-success bg-opacity-10 text-success p-3 me-3 fs-3">
                <i className="bi bi-bucket-fill"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0 small uppercase fw-bold">Bitácora Saneamiento</h6>
                <h3 className="mb-0 fw-bold font-heading">{cumplimientoSaneamiento}%</h3>
              </div>
            </div>
            <div className="text-secondary small mt-auto">
              <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i>{conformesSaneamiento}</span> de {totalSaneamiento} conformes.
            </div>
          </div>
        </div>

        {/* Tarjeta Variables Críticas */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card OCA-card p-3 h-100 border-0">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 bg-info bg-opacity-10 text-info p-3 me-3 fs-3">
                <i className="bi bi-activity"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0 small uppercase fw-bold">Control Variables</h6>
                <h3 className="mb-0 fw-bold font-heading">{totalVariables}</h3>
              </div>
            </div>
            <div className="text-secondary small mt-auto">
              {alertasVariables > 0 ? (
                <span className="text-danger fw-bold"><i className="bi bi-exclamation-triangle-fill me-1"></i>{alertasVariables} Desviaciones</span>
              ) : (
                <span className="text-success fw-bold"><i className="bi bi-shield-check me-1"></i>Puntos Críticos seguros</span>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta Acciones CAPA */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card OCA-card p-3 h-100 border-0">
            <div className="d-flex align-items-center mb-3">
              <div className={`rounded-3 p-3 me-3 fs-3 ${abiertasCapa > 0 ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>
                <i className="bi bi-clipboard-x-fill"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0 small uppercase fw-bold">Acciones CAPA</h6>
                <h3 className="mb-0 fw-bold font-heading">{abiertasCapa}</h3>
              </div>
            </div>
            <div className="text-secondary small mt-auto">
              {abiertasCapa > 0 ? (
                <span className="text-danger fw-bold"><i className="bi bi-exclamation-circle-fill me-1"></i>Pendientes de cierre</span>
              ) : (
                <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Todo cerrado al 100%</span>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta Manipuladores de Alimentos */}
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card OCA-card p-3 h-100 border-0">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-3 me-3 fs-3">
                <i className="bi bi-people-fill"></i>
              </div>
              <div>
                <h6 className="text-muted mb-0 small uppercase fw-bold">BPM Manipuladores</h6>
                <h3 className="mb-0 fw-bold font-heading">{cumplimientoPersonal}%</h3>
              </div>
            </div>
            <div className="text-secondary small mt-auto">
              <span className="text-primary fw-bold">{vigentesBpm}</span> de {totalManipuladores} al día.
            </div>
          </div>
        </div>
      </div>

      {/* Cuerpo del Dashboard */}
      <div className="row g-4">
        {/* Monitoreo PCC */}
        <div className="col-12 col-lg-8">
          <div className="card OCA-card p-4 border-0 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="card-title font-heading mb-0">Puntos de Control Crítico (PCC) - Tiempo Real</h4>
              <button className="btn btn-sm btn-outline-success border-0" onClick={() => onNavigate('variables')}>
                Ver detalles <i className="bi bi-arrow-right-short"></i>
              </button>
            </div>
            
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 bg-light bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold small">Cámara Refrigeración 1</span>
                    <span className="badge bg-success-subtle text-success">Normal</span>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <span className="display-6 fw-bold font-heading text-dark me-1">4.2</span>
                    <span className="text-muted fs-5">Â°C</span>
                  </div>
                  <div className="text-muted small mt-2">Límite crítico: &le; 8.0Â°C</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 bg-light bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold small">Pasteurizador Línea B</span>
                    <span className="badge bg-success-subtle text-success">Normal</span>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <span className="display-6 fw-bold font-heading text-dark me-1">72.5</span>
                    <span className="text-muted fs-5">Â°C</span>
                  </div>
                  <div className="text-muted small mt-2">Límite crítico: &ge; 72.0Â°C (15s)</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 bg-light bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold small">Silaje de Materia Prima</span>
                    <span className="badge bg-success-subtle text-success">Normal</span>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <span className="display-6 fw-bold font-heading text-dark me-1">6.62</span>
                    <span className="text-muted fs-5">pH</span>
                  </div>
                  <div className="text-muted small mt-2">Rango aceptable: 6.5 - 6.8 pH</div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="border rounded-3 p-3 bg-light bg-opacity-25">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold small">Cámara Congelación 2</span>
                    <span className="badge bg-success-subtle text-success">Normal</span>
                  </div>
                  <div className="d-flex align-items-baseline">
                    <span className="display-6 fw-bold font-heading text-dark me-1">-18.5</span>
                    <span className="text-muted fs-5">Â°C</span>
                  </div>
                  <div className="text-muted small mt-2">Límite crítico: &le; -15.0Â°C</div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top">
              <h6 className="fw-semibold text-muted mb-3"><i className="bi bi-clock-history me-1"></i> Historial de Cumplimiento (Últimas 5 horas)</h6>
              <div className="d-flex align-items-end justify-content-between px-3" style={{ height: '120px' }}>
                <div className="text-center w-100">
                  <div className="bg-success rounded-top mx-auto" style={{ height: '90px', width: '24px' }}></div>
                  <span className="small text-muted" style={{ fontSize: '11px' }}>17:00</span>
                </div>
                <div className="text-center w-100">
                  <div className="bg-success rounded-top mx-auto" style={{ height: '95px', width: '24px' }}></div>
                  <span className="small text-muted" style={{ fontSize: '11px' }}>18:00</span>
                </div>
                <div className="text-center w-100">
                  <div className="bg-danger rounded-top mx-auto" style={{ height: '60px', width: '24px' }}></div>
                  <span className="small text-muted" style={{ fontSize: '11px' }}>19:00</span>
                </div>
                <div className="text-center w-100">
                  <div className="bg-success rounded-top mx-auto" style={{ height: '88px', width: '24px' }}></div>
                  <span className="small text-muted" style={{ fontSize: '11px' }}>20:00</span>
                </div>
                <div className="text-center w-100">
                  <div className="bg-success rounded-top mx-auto" style={{ height: '98px', width: '24px' }}></div>
                  <span className="small text-muted" style={{ fontSize: '11px' }}>21:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas y Acciones Directas */}
        <div className="col-12 col-lg-4">
          <div className="card OCA-card p-4 border-0 h-100 d-flex flex-column">
            <h4 className="card-title font-heading mb-3">Auditoría y Acciones CAPA</h4>
            
            <div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: '350px' }}>
              {abiertasCapa > 0 ? (
                <div className="mb-4">
                  <h6 className="text-danger fw-bold small uppercase mb-2">Desviaciones CAPA Pendientes</h6>
                  {accionesCapa.filter(c => c.estado === 'Abierto').map(capa => (
                    <div key={capa.id} className="d-flex align-items-start border-start border-3 border-danger ps-2 py-2 mb-2 bg-danger-subtle bg-opacity-50 rounded-end">
                      <div className="me-2 text-danger fs-5 mt-1"><i className="bi bi-shield-slash-fill"></i></div>
                      <div className="w-100">
                        <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>{capa.hallazgo}</div>
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <span className="small text-muted" style={{ fontSize: '11px' }}><i className="bi bi-clock me-1"></i>{capa.fecha}</span>
                          <button className="btn btn-xs btn-danger py-0 px-2 small" style={{ fontSize: '11px' }} onClick={() => onNavigate('capa')}>
                            Resolver <i className="bi bi-arrow-right-short"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted bg-light bg-opacity-25 rounded-3 mb-4 border">
                  <i className="bi bi-patch-check-fill text-success fs-2 d-block mb-1"></i>
                  <span className="small fw-semibold d-block text-dark">CAPA al día</span>
                  <span className="small text-muted" style={{ fontSize: '11px' }}>No hay desviaciones abiertas pendientes de plan de acción.</span>
                </div>
              )}

              <div>
                <h6 className="text-muted fw-bold small uppercase mb-2">Accesos Directos a Auditoría</h6>
                <div className="d-grid gap-2">
                  <button className="btn btn-light text-start btn-sm" onClick={() => onNavigate('alergenos-recall')}>
                    <i className="bi bi-shield-exclamation text-warning me-2"></i> Control de Alérgenos
                  </button>
                  <button className="btn btn-light text-start btn-sm" onClick={() => onNavigate('alergenos-recall')}>
                    <i className="bi bi-bezier2 text-primary me-2"></i> Iniciar Simulacro de Retiro
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-3 border-top">
              <h6 className="fw-semibold small mb-2 text-muted">Acción Operativa Rápida</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-success text-start" onClick={() => onNavigate('saneamiento')}>
                  <i className="bi bi-plus-circle-dotted me-2"></i> Registrar Saneamiento BPM
                </button>
                <button className="btn btn-outline-success text-start" onClick={() => onNavigate('variables')}>
                  <i className="bi bi-plus-circle-dotted me-2"></i> Registrar Medición de Temp/pH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

