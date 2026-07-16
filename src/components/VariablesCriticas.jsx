import React, { useState } from 'react';

function VariablesCriticas({ mediciones, onAgregar }) {
  const [punto, setPunto] = useState('CÃ¡mara RefrigeraciÃ³n 1');
  const [tempInput, setTempInput] = useState('');
  const [phInput, setPhInput] = useState('');
  const [supervisor, setSupervisor] = useState('Carlos GÃ³mez');
  const [comentario, setComentario] = useState('');
  const [alertaExito, setAlertaExito] = useState(false);
  const [filtroPunto, setFiltroPunto] = useState('Todos');

  // Determinar si el punto seleccionado requiere pH
  const requierePh = punto === 'Silaje de Materia Prima' || punto === 'Pasteurizador B';

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parsear valores
    const temperatura = parseFloat(tempInput);
    const ph = phInput !== '' ? parseFloat(phInput) : null;

    // LÃ³gica de validaciÃ³n de lÃ­mites crÃ­ticos para generar la Alerta automÃ¡tica
    let estado = 'Normal';
    
    if (punto === 'CÃ¡mara RefrigeraciÃ³n 1') {
      if (temperatura > 8.0) estado = 'Alerta'; // MÃ¡x 8Â°C
    } else if (punto === 'CÃ¡mara CongelaciÃ³n 2') {
      if (temperatura > -15.0) estado = 'Alerta'; // MÃ¡x -15Â°C (por ejemplo, -10Â°C es muy caliente)
    } else if (punto === 'Pasteurizador B') {
      if (temperatura < 72.0) estado = 'Alerta'; // MÃ­nimo 72Â°C para pasteurizar
      if (ph && (ph < 6.4 || ph > 6.9)) estado = 'Alerta';
    } else if (punto === 'Silaje de Materia Prima') {
      if (temperatura > 10.0) estado = 'Alerta'; // Control refrigerado materia prima
      if (ph && (ph < 6.5 || ph > 6.8)) estado = 'Alerta'; // Rango leche fresca
    }

    const hoy = new Date();
    const fecha = hoy.toISOString().split('T')[0];
    const hora = hoy.toTimeString().split(' ')[0].substring(0, 5);

    const nuevo = {
      fecha,
      hora,
      punto,
      temperatura,
      ph,
      supervisor,
      estado,
      comentario: comentario.trim() || 'MediciÃ³n conforme.'
    };

    onAgregar(nuevo);
    setTempInput('');
    setPhInput('');
    setComentario('');
    setAlertaExito(true);

    // Ocultar alerta
    setTimeout(() => {
      setAlertaExito(false);
    }, 4500);
  };

  // Filtrar mediciones
  const medicionesFiltradas = mediciones.filter(m => {
    return filtroPunto === 'Todos' || m.punto === filtroPunto;
  });

  return (
    <div className="fade-in-view">
      {/* Alerta Guardada */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-shield-check me-2"></i>Â¡Variable guardada con Ã©xito!</strong> La mediciÃ³n ha sido indexada en el sistema. El sistema analizÃ³ el lÃ­mite crÃ­tico de forma automÃ¡tica.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)} aria-label="Close"></button>
        </div>
      )}

      {/* LÃ­mites de Puntos de Control CrÃ­tico */}
      <div className="card OCA-card p-4 border-0 mb-4 bg-light bg-opacity-25">
        <h5 className="fw-bold font-heading mb-3"><i className="bi bi-info-circle text-info me-2"></i>LÃ­mites CrÃ­ticos de Seguridad Alimentaria (HACCP)</h5>
        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 border-start border-3 border-success bg-body">
              <strong className="d-block small">CÃ¡mara RefrigeraciÃ³n 1</strong>
              <span className="small text-muted">Temperatura &le; 8.0 Â°C</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 border-start border-3 border-success bg-body">
              <strong className="d-block small">CÃ¡mara CongelaciÃ³n 2</strong>
              <span className="small text-muted">Temperatura &le; -15.0 Â°C</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 border-start border-3 border-success bg-body">
              <strong className="d-block small">Pasteurizador B</strong>
              <span className="small text-muted">Temp. &ge; 72.0 Â°C | pH 6.4 - 6.9</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 border-start border-3 border-success bg-body">
              <strong className="d-block small">Silaje Materia Prima</strong>
              <span className="small text-muted">Temp. &le; 8.0 Â°C | pH 6.5 - 6.8</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Formulario de Nueva MediciÃ³n */}
        <div className="col-12 col-lg-4">
          <div className="card OCA-card p-4 border-0">
            <h4 className="card-title font-heading mb-3"><i className="bi bi-plus-circle text-success me-2"></i>Registrar MediciÃ³n PCC</h4>
            <p className="text-muted small">Registra los controles directos sobre los Puntos de Control CrÃ­tico (PCC). El sistema evaluarÃ¡ el estado instantÃ¡neamente.</p>
            <hr className="my-3 text-secondary" />

            <form onSubmit={handleSubmit}>
              {/* Punto de Control */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Punto de Control CrÃ­tico</label>
                <select className="form-select" value={punto} onChange={(e) => {
                  setPunto(e.target.value);
                  setTempInput('');
                  setPhInput('');
                }} required>
                  <option value="CÃ¡mara RefrigeraciÃ³n 1">CÃ¡mara RefrigeraciÃ³n 1</option>
                  <option value="CÃ¡mara CongelaciÃ³n 2">CÃ¡mara CongelaciÃ³n 2</option>
                  <option value="Pasteurizador B">Pasteurizador B</option>
                  <option value="Silaje de Materia Prima">Silaje de Materia Prima</option>
                </select>
              </div>

              {/* Temperatura */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Temperatura (Â°C)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  className="form-control" 
                  value={tempInput} 
                  onChange={(e) => setTempInput(e.target.value)} 
                  placeholder="Ej: 4.2 o -18.5"
                  required 
                />
              </div>

              {/* pH (Opcional segÃºn el punto) */}
              {requierePh && (
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Nivel de Acidez (pH)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    className="form-control" 
                    value={phInput} 
                    onChange={(e) => setPhInput(e.target.value)} 
                    placeholder="Ej: 6.62"
                    required 
                  />
                </div>
              )}

              {/* Supervisor */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Responsable de MediciÃ³n</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={supervisor} 
                  onChange={(e) => setSupervisor(e.target.value)} 
                  required 
                />
              </div>

              {/* Comentarios */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">AcciÃ³n Correctiva / Comentario</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  value={comentario} 
                  onChange={(e) => setComentario(e.target.value)}
                  placeholder="Escribir si se aplicaron correcciones por desvÃ­os..."
                ></textarea>
              </div>

              {/* Enviar */}
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary py-2">
                  <i className="bi bi-bookmark-plus me-1"></i> Confirmar MediciÃ³n
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tabla de Historial */}
        <div className="col-12 col-lg-8">
          <div className="card OCA-card p-4 border-0 h-100">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
              <h4 className="card-title font-heading mb-0"><i className="bi bi-clock-history text-success me-2"></i>Monitoreo y Desviaciones</h4>
              
              {/* Filtros */}
              <select className="form-select form-select-sm" style={{ width: '220px' }} value={filtroPunto} onChange={(e) => setFiltroPunto(e.target.value)}>
                <option value="Todos">Todos los Puntos</option>
                <option value="CÃ¡mara RefrigeraciÃ³n 1">CÃ¡mara RefrigeraciÃ³n 1</option>
                <option value="CÃ¡mara CongelaciÃ³n 2">CÃ¡mara CongelaciÃ³n 2</option>
                <option value="Pasteurizador B">Pasteurizador B</option>
                <option value="Silaje de Materia Prima">Silaje de Materia Prima</option>
              </select>
            </div>

            {/* Tabla */}
            <div className="table-responsive flex-grow-1" style={{ maxHeight: '550px' }}>
              <table className="table table-hover align-middle">
                <thead className="table-light sticky-top">
                  <tr>
                    <th>Fecha/Hora</th>
                    <th>Punto PCC</th>
                    <th>Temperatura</th>
                    <th>Acidez (pH)</th>
                    <th>Operario</th>
                    <th>Estado</th>
                    <th>Comentarios</th>
                  </tr>
                </thead>
                <tbody>
                  {medicionesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted">
                        <i className="bi bi-info-circle fs-3 d-block mb-2"></i>
                        Sin mediciones para el punto de control seleccionado.
                      </td>
                    </tr>
                  ) : (
                    // Mostrar de mÃ¡s nuevo a mÃ¡s viejo
                    [...medicionesFiltradas].reverse().map(med => (
                      <tr key={med.id}>
                        <td>
                          <div className="fw-semibold text-dark">{med.fecha}</div>
                          <div className="text-muted small">{med.hora}</div>
                        </td>
                        <td><span className="fw-medium">{med.punto}</span></td>
                        <td>
                          <span className={`fw-bold ${med.estado === 'Alerta' ? 'text-danger' : 'text-dark'}`}>
                            {med.temperatura} Â°C
                          </span>
                        </td>
                        <td>
                          {med.ph !== null ? (
                            <span className="fw-medium">{med.ph}</span>
                          ) : (
                            <span className="text-muted small">-</span>
                          )}
                        </td>
                        <td className="small text-muted">{med.supervisor}</td>
                        <td>
                          {med.estado === 'Normal' ? (
                            <span className="badge bg-success-subtle text-success py-1 px-2 d-inline-flex align-items-center">
                              <i className="bi bi-check-circle-fill me-1"></i> Seguro
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger py-1 px-2 d-inline-flex align-items-center badge-pulse">
                              <i className="bi bi-exclamation-octagon-fill me-1"></i> Alerta PCC
                            </span>
                          )}
                        </td>
                        <td className="small text-muted text-wrap" style={{ maxWidth: '180px' }}>
                          {med.comentario}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-muted small mt-3">
              * El sistema genera una alerta instantÃ¡nea en rojo si los parÃ¡metros exceden los lÃ­mites crÃ­ticos fijados en el manual HACCP de la empresa.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VariablesCriticas;

