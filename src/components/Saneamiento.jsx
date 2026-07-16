import React, { useState } from 'react';

function Saneamiento({ registros, onAgregar }) {
  const [area, setArea] = useState('Cuarto Frío 1');
  const [tipo, setTipo] = useState('Rutinaria');
  const [producto, setProducto] = useState('Cloro 200ppm');
  const [supervisor, setSupervisor] = useState('Carlos Gómez');
  const [conforme, setConforme] = useState(true);
  const [observacion, setObservacion] = useState('');
  const [filtroArea, setFiltroArea] = useState('Todos');
  const [filtroConforme, setFiltroConforme] = useState('Todos');
  const [alertaExito, setAlertaExito] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Obtener fecha y hora actuales en Colombia
    const hoy = new Date();
    const fecha = hoy.toISOString().split('T')[0];
    const hora = hoy.toTimeString().split(' ')[0].substring(0, 5);

    const nuevo = {
      fecha,
      hora,
      area,
      tipo,
      producto,
      supervisor,
      conforme,
      observacion: observacion.trim() || 'Sin observaciones adicionales.'
    };

    onAgregar(nuevo);
    setObservacion('');
    setAlertaExito(true);

    // Ocultar alerta después de 4 segundos
    setTimeout(() => {
      setAlertaExito(false);
    }, 4000);
  };

  // Filtrar registros
  const registrosFiltrados = registros.filter(reg => {
    const coincideArea = filtroArea === 'Todos' || reg.area === filtroArea;
    const coincideConforme = filtroConforme === 'Todos' || 
      (filtroConforme === 'Si' && reg.conforme) || 
      (filtroConforme === 'No' && !reg.conforme);
    return coincideArea && coincideConforme;
  });

  return (
    <div className="fade-in-view">
      {/* Alerta de Éxito */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-check-circle-fill me-2"></i>¡Registro guardado con éxito!</strong> El log de saneamiento ha sido añadido al historial y guardado de manera inmutable.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)} aria-label="Close"></button>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario de Registro (Columna Izquierda) */}
        <div className="col-12 col-lg-4">
          <div className="card OCA-card p-4 border-0">
            <h4 className="card-title font-heading mb-3"><i className="bi bi-file-earmark-plus text-success me-2"></i>Nuevo Registro de Higiene</h4>
            <p className="text-muted small">Registra las acciones de limpieza e higiene ejecutadas en planta para asegurar el cumplimiento BPM.</p>
            <hr className="my-3 text-secondary" />

            <form onSubmit={handleSubmit}>
              {/* Área */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Área o Equipo</label>
                <select className="form-select" value={area} onChange={(e) => setArea(e.target.value)} required>
                  <option value="Cuarto Frío 1">Cuarto Frío 1</option>
                  <option value="Cuarto Frío 2">Cuarto Frío 2</option>
                  <option value="Línea de Envasado A">Línea de Envasado A</option>
                  <option value="Pasteurizador B">Pasteurizador B</option>
                  <option value="Almacén MP">Almacén MP</option>
                  <option value="Zona de Mezclas">Zona de Mezclas</option>
                </select>
              </div>

              {/* Tipo de limpieza */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Tipo de Limpieza</label>
                <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                  <option value="Pre-operacional">Pre-operacional (Antes de producir)</option>
                  <option value="Rutinaria">Rutinaria (Durante el proceso)</option>
                  <option value="Profunda">Profunda (Cierre de jornada)</option>
                </select>
              </div>

              {/* Producto Químico */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Desinfectante / Agente Químico</label>
                <select className="form-select" value={producto} onChange={(e) => setProducto(e.target.value)} required>
                  <option value="Cloro 200ppm">Cloro (200 ppm)</option>
                  <option value="Amonio Cuaternario">Amonio Cuaternario (5ta Gen)</option>
                  <option value="Ácido Peracético">Ácido Peracético (150 ppm)</option>
                  <option value="Detergente Neutro">Detergente Neutro Industrial</option>
                  <option value="Ninguno / Agua caliente">Agua a Alta Temperatura (&gt;80°C)</option>
                </select>
              </div>

              {/* Supervisor */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Supervisor / Firmante</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={supervisor} 
                  onChange={(e) => setSupervisor(e.target.value)} 
                  placeholder="Nombre del supervisor" 
                  required 
                />
              </div>

              {/* Estado de Conformidad */}
              <div className="mb-3">
                <label className="form-label fw-semibold small d-block">Estado de Inocuidad</label>
                <div className="form-check form-switch p-0 d-flex align-items-center">
                  <input 
                    className="form-check-input ms-0 me-2" 
                    type="checkbox" 
                    id="conformeSwitch" 
                    checked={conforme} 
                    onChange={(e) => setConforme(e.target.checked)}
                    style={{ width: '2.5em', height: '1.25em' }}
                  />
                  <label className="form-check-label fw-bold text-success" htmlFor="conformeSwitch">
                    {conforme ? (
                      <span className="text-success"><i className="bi bi-shield-check me-1"></i>Conforme (Cumple BPM)</span>
                    ) : (
                      <span className="text-danger"><i className="bi bi-shield-slash me-1"></i>No Conforme (Requiere Repetir)</span>
                    )}
                  </label>
                </div>
              </div>

              {/* Observación */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Observaciones / Evidencia</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  value={observacion} 
                  onChange={(e) => setObservacion(e.target.value)}
                  placeholder="Detalles sobre suciedad, enjuague o hallazgos..."
                ></textarea>
              </div>

              {/* Botón enviar */}
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary py-2">
                  <i className="bi bi-check-lg me-1"></i> Firmar y Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Historial de Registros (Columna Derecha) */}
        <div className="col-12 col-lg-8">
          <div className="card OCA-card p-4 border-0 h-100">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
              <h4 className="card-title font-heading mb-0"><i className="bi bi-calendar-check text-success me-2"></i>Historial de Inspecciones BPM</h4>
              
              {/* Filtros */}
              <div className="d-flex gap-2">
                <select className="form-select form-select-sm" style={{ width: '150px' }} value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
                  <option value="Todos">Todas las Áreas</option>
                  <option value="Cuarto Frío 1">Cuarto Frío 1</option>
                  <option value="Cuarto Frío 2">Cuarto Frío 2</option>
                  <option value="Línea de Envasado A">Línea de Envasado A</option>
                  <option value="Pasteurizador B">Pasteurizador B</option>
                  <option value="Almacén MP">Almacén MP</option>
                </select>
                <select className="form-select form-select-sm" style={{ width: '130px' }} value={filtroConforme} onChange={(e) => setFiltroConforme(e.target.value)}>
                  <option value="Todos">Todos</option>
                  <option value="Si">Conforme</option>
                  <option value="No">No Conforme</option>
                </select>
              </div>
            </div>

            {/* Tabla */}
            <div className="table-responsive flex-grow-1" style={{ maxHeight: '550px' }}>
              <table className="table table-hover align-middle">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Fecha/Hora</th>
                    <th>Área</th>
                    <th>Tipo</th>
                    <th>Producto</th>
                    <th>Supervisor</th>
                    <th>Estado</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="bi bi-info-circle fs-3 d-block mb-2"></i>
                        No se encontraron registros que coincidan con los filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    // Mostrar de más nuevo a más viejo
                    [...registrosFiltrados].reverse().map(reg => (
                      <tr key={reg.id}>
                        <td>
                          <div className="fw-semibold text-dark">{reg.fecha}</div>
                          <div className="text-muted small">{reg.hora}</div>
                        </td>
                        <td><span className="fw-medium">{reg.area}</span></td>
                        <td><span className="badge bg-secondary-subtle text-secondary">{reg.tipo}</span></td>
                        <td><code className="text-dark" style={{ fontSize: '11.5px' }}>{reg.producto}</code></td>
                        <td className="small text-muted">{reg.supervisor}</td>
                        <td>
                          {reg.conforme ? (
                            <span className="badge bg-success-subtle text-success py-1 px-2 d-inline-flex align-items-center">
                              <i className="bi bi-patch-check-fill me-1"></i> Conforme
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger py-1 px-2 d-inline-flex align-items-center">
                              <i className="bi bi-patch-exclamation-fill me-1"></i> Falla
                            </span>
                          )}
                        </td>
                        <td className="small text-muted text-wrap" style={{ maxWidth: '180px' }}>
                          {reg.observacion}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-muted small mt-3">
              * Cumple con las exigencias del INVIMA (Resolución 2674 del 2013) y la COFEPRIS para la bitácora obligatoria.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Saneamiento;

