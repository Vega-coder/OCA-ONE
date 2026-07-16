import React, { useState } from 'react';

function Capacitaciones({ manipuladores, onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('Operario de Envasado');
  const [carnetBpm, setCarnetBpm] = useState('Vigente');
  const [controlMedico, setControlMedico] = useState('Apto');
  const [capacitacionProgreso, setCapacitacionProgreso] = useState('80');
  const [alertaExito, setAlertaExito] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevo = {
      nombre: nombre.trim(),
      cargo,
      carnetBpm,
      controlMedico,
      capacitacionProgreso: parseInt(capacitacionProgreso) || 0
    };

    onAgregar(nuevo);
    setNombre('');
    setCapacitacionProgreso('80');
    setAlertaExito(true);

    setTimeout(() => {
      setAlertaExito(false);
    }, 4000);
  };

  return (
    <div className="fade-in-view">
      {/* Alerta de Registro Exitoso */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-person-check-fill me-2"></i>¡Manipulador registrado!</strong> El operario ha sido registrado en la planta y asignado a su plan de capacitaciones BPM.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)} aria-label="Close"></button>
        </div>
      )}

      <div className="row g-4">
        {/* Formulario de registro (Izquierda) */}
        <div className="col-12 col-lg-4">
          <div className="card OCA-card p-4 border-0">
            <h4 className="card-title font-heading mb-3"><i className="bi bi-person-plus text-success me-2"></i>Registrar Manipulador</h4>
            <p className="text-muted small">Registra nuevos operarios de planta para llevar control de sus exámenes médicos y progreso de capacitación obligatoria exigida por el INVIMA.</p>
            <hr className="my-3 text-secondary" />

            <form onSubmit={handleSubmit}>
              {/* Nombre completo */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Nombre Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Ej: Juan Pérez Martínez" 
                  required 
                />
              </div>

              {/* Cargo */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Cargo u Operación</label>
                <select className="form-select" value={cargo} onChange={(e) => setCargo(e.target.value)} required>
                  <option value="Operario de Envasado">Operario de Envasado</option>
                  <option value="Operario de Mezclas">Operario de Mezclas</option>
                  <option value="Operario de Pasteurizado">Operario de Pasteurizado</option>
                  <option value="Auxiliar de Almacén">Auxiliar de Almacén</option>
                  <option value="Operario de Limpieza">Operario de Limpieza</option>
                  <option value="Supervisor de Calidad">Supervisor de Calidad</option>
                </select>
              </div>

              {/* Estado Carnet BPM */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Carnet de Manipulación BPM</label>
                <select className="form-select" value={carnetBpm} onChange={(e) => setCarnetBpm(e.target.value)} required>
                  <option value="Vigente">Vigente (Al día)</option>
                  <option value="Vence Pronto">Vence Pronto (Menos de 30 días)</option>
                  <option value="Vencido">Vencido (Requiere renovación)</option>
                </select>
              </div>

              {/* Estado Control Médico */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Control Médico de Salud</label>
                <select className="form-select" value={controlMedico} onChange={(e) => setControlMedico(e.target.value)} required>
                  <option value="Apto">Apto (Sin restricciones)</option>
                  <option value="No Apto">No Apto (Incapacidad / Afección cutánea o respiratoria)</option>
                  <option value="Pendiente">Pendiente por agendar examen</option>
                </select>
              </div>

              {/* Progreso de Capacitación */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Progreso de Capacitación BPM ({capacitacionProgreso}%)</label>
                <input 
                  type="range" 
                  className="form-range" 
                  min="0" 
                  max="100" 
                  value={capacitacionProgreso} 
                  onChange={(e) => setCapacitacionProgreso(e.target.value)} 
                />
              </div>

              {/* Botón de envío */}
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary py-2">
                  <i className="bi bi-user-plus me-1"></i> Añadir Operario
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Listado de Operarios (Derecha) */}
        <div className="col-12 col-lg-8">
          <div className="card OCA-card p-4 border-0 h-100">
            <h4 className="card-title font-heading mb-4"><i className="bi bi-people text-success me-2"></i>Control de Manipuladores y Capacitación Anual</h4>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nombre / Cargo</th>
                    <th>Estado Médico</th>
                    <th>Carnet BPM</th>
                    <th>Curso BPM (IA SKOOL)</th>
                  </tr>
                </thead>
                <tbody>
                  {manipuladores.map(man => (
                    <tr key={man.id}>
                      <td>
                        <div className="fw-semibold text-dark">{man.nombre}</div>
                        <div className="text-muted small">{man.cargo}</div>
                      </td>
                      <td>
                        {man.controlMedico === 'Apto' && (
                          <span className="badge bg-success-subtle text-success py-1 px-2 d-inline-flex align-items-center">
                            <i className="bi bi-heartpulse-fill me-1"></i> Apto
                          </span>
                        )}
                        {man.controlMedico === 'Pendiente' && (
                          <span className="badge bg-warning-subtle text-warning py-1 px-2 d-inline-flex align-items-center">
                            <i className="bi bi-hourglass-split me-1"></i> Pendiente
                          </span>
                        )}
                        {man.controlMedico === 'No Apto' && (
                          <span className="badge bg-danger-subtle text-danger py-1 px-2 d-inline-flex align-items-center">
                            <i className="bi bi-heart-break-fill me-1"></i> No Apto
                          </span>
                        )}
                      </td>
                      <td>
                        {man.carnetBpm === 'Vigente' && (
                          <span className="badge bg-success py-1 px-2">Vigente</span>
                        )}
                        {man.carnetBpm === 'Vence Pronto' && (
                          <span className="badge bg-warning text-dark py-1 px-2">Vence Pronto</span>
                        )}
                        {man.carnetBpm === 'Vencido' && (
                          <span className="badge bg-danger py-1 px-2 badge-pulse">Vencido</span>
                        )}
                      </td>
                      <td style={{ width: '220px' }}>
                        <div className="d-flex align-items-center">
                          <span className="small fw-semibold text-dark me-2">{man.capacitacionProgreso}%</span>
                          <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px' }}>
                            <div 
                              className={`progress-bar rounded ${
                                man.capacitacionProgreso >= 80 
                                  ? 'bg-success' 
                                  : man.capacitacionProgreso >= 50 
                                  ? 'bg-warning' 
                                  : 'bg-danger'
                              }`} 
                              role="progressbar" 
                              style={{ width: `${man.capacitacionProgreso}%` }} 
                              aria-valuenow={man.capacitacionProgreso} 
                              aria-valuemin="0" 
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-top bg-light bg-opacity-25 p-3 rounded-3 border">
              <h6 className="fw-bold text-dark mb-2"><i className="bi bi-info-circle-fill text-info me-1"></i>Requisito de Capacitación Anual (BPM)</h6>
              <p className="text-muted mb-0 small">
                Todo manipulador de alimentos debe cursar un mínimo de **10 horas anuales** de capacitación en higiene de alimentos. La integración con **IA SKOOL** sincroniza este progreso automáticamente en el perfil de cada empleado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Capacitaciones;

