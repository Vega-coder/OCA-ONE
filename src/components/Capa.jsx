import React, { useState } from 'react';

function Capa({ acciones, onResolver }) {
  const [ticketActivo, setTicketActivo] = useState(null);
  const [causaRaiz, setCausaRaiz] = useState('Error de Operación / Mano de obra');
  const [planAccion, setPlanAccion] = useState('');
  const [supervisorCierre, setSupervisorCierre] = useState('Carlos Gómez');
  const [alertaExito, setAlertaExito] = useState(false);

  const handleResolverCapa = (e, id) => {
    e.preventDefault();
    
    if (!planAccion.trim()) {
      alert("Por favor describe el plan de acción correctiva aplicado.");
      return;
    }

    onResolver(id, {
      causaRaiz,
      planAccion: planAccion.trim(),
      supervisorCierre
    });

    setPlanAccion('');
    setTicketActivo(null);
    setAlertaExito(true);

    setTimeout(() => {
      setAlertaExito(false);
    }, 4000);
  };

  const abiertas = acciones.filter(c => c.estado === 'Abierto');
  const cerradas = acciones.filter(c => c.estado === 'Cerrado');

  return (
    <div className="fade-in-view">
      {/* Alerta de Cierre Exitoso */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-check-circle-fill me-2"></i>Â¡Acción CAPA Cerrada y Verificada!</strong> La desviación ha sido resuelta y los registros históricos han sido firmados digitalmente.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)} aria-label="Close"></button>
        </div>
      )}

      {/* Introducción explicativa */}
      <div className="card OCA-card p-4 border-0 mb-4 bg-light bg-opacity-25">
        <h5 className="fw-bold font-heading mb-2"><i className="bi bi-shield-exclamation text-danger me-2"></i>No Conformidades y CAPA (Corrective and Preventive Actions)</h5>
        <p className="text-muted mb-0 small">
          El módulo CAPA es un requisito regulatorio crítico (INVIMA / FDA). Captura desviaciones operativas en tiempo real y obliga al equipo de calidad a diagnosticar la causa raíz y proponer planes correctivos antes de dar el cierre a la no conformidad.
        </p>
      </div>

      <div className="row g-4">
        {/* Acciones CAPA Abiertas (Izquierda) */}
        <div className="col-12 col-lg-6">
          <div className="card OCA-card p-4 border-0 h-100">
            <h4 className="card-title font-heading mb-4 text-danger"><i className="bi bi-folder-plus me-2"></i>Desviaciones Activas ({abiertas.length})</h4>

            {abiertas.length === 0 ? (
              <div className="text-center py-5 my-auto text-muted">
                <i className="bi bi-emoji-smile display-3 text-success opacity-50 d-block mb-3"></i>
                <h5 className="fw-semibold text-success">Â¡Todo al día!</h5>
                <p className="mb-0">No hay no conformidades abiertas. Todas las alertas previas han sido cerradas y verificadas.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '600px' }}>
                {abiertas.map(capa => (
                  <div key={capa.id} className="border rounded-3 p-3 bg-body shadow-sm">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-danger-subtle text-danger">Origen: {capa.origen}</span>
                      <span className="small text-muted"><i className="bi bi-clock me-1"></i>{capa.fecha} {capa.hora}</span>
                    </div>
                    <p className="fw-semibold text-dark mb-2" style={{ fontSize: '14px' }}>{capa.hallazgo}</p>
                    <div className="small text-muted mb-3">Reportado por: <strong>{capa.responsable}</strong></div>
                    
                    {ticketActivo === capa.id ? (
                      // Formulario de Cierre Inline
                      <form onSubmit={(e) => handleResolverCapa(e, capa.id)} className="border-top pt-3 mt-3">
                        <h6 className="fw-bold text-success mb-3"><i className="bi bi-check2-square me-1"></i>Formulario de Acciones Correctivas</h6>
                        
                        {/* Causa Raíz */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold small">Análisis de Causa Raíz</label>
                          <select className="form-select form-select-sm" value={causaRaiz} onChange={(e) => setCausaRaiz(e.target.value)} required>
                            <option value="Error de Operación / Mano de obra">Mano de obra (Error de Operación / Omisión)</option>
                            <option value="Falla Mecánica de Equipo / Maquinaria">Maquinaria (Falla Mecánica / Eléctrica / Calibración)</option>
                            <option value="Falta de Limpieza o Mal Método">Método (Falta de Higiene / Procedimiento inadecuado)</option>
                            <option value="Variación o Falla de Materia Prima">Material (Defectos en Materia Prima / Insumos)</option>
                            <option value="Fallas de Energía o Clima Externo">Medio Ambiente (Cortes de luz / Humedad / Clima)</option>
                          </select>
                        </div>

                        {/* Plan de Acción */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold small">Plan de Acción Implementado (CAPA)</label>
                          <textarea 
                            className="form-control form-control-sm" 
                            rows="3" 
                            value={planAccion} 
                            onChange={(e) => setPlanAccion(e.target.value)}
                            placeholder="Detalla las medidas tomadas (ej. re-lavado, calibración, cuarentena del lote, etc.)"
                            required
                          ></textarea>
                        </div>

                        {/* Verificador */}
                        <div className="mb-3">
                          <label className="form-label fw-semibold small">Supervisor que autoriza el cierre</label>
                          <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            value={supervisorCierre} 
                            onChange={(e) => setSupervisorCierre(e.target.value)} 
                            required 
                          />
                        </div>

                        <div className="d-flex gap-2 justify-content-end">
                          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setTicketActivo(null)}>
                            Cancelar
                          </button>
                          <button type="submit" className="btn btn-sm btn-success">
                            Cerrar y Firmar Ticket
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="d-grid">
                        <button className="btn btn-outline-danger btn-sm" onClick={() => {
                          setTicketActivo(capa.id);
                          setPlanAccion('');
                        }}>
                          <i className="bi bi-shield-fill-check me-1"></i> Resolver Desviación
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acciones CAPA Cerradas e Historial (Derecha) */}
        <div className="col-12 col-lg-6">
          <div className="card OCA-card p-4 border-0 h-100">
            <h4 className="card-title font-heading mb-4 text-success"><i className="bi bi-folder-check me-2"></i>Historial de Desviaciones Cerradas ({cerradas.length})</h4>

            {cerradas.length === 0 ? (
              <div className="text-center py-5 my-auto text-muted">
                <i className="bi bi-archive-fill display-3 text-secondary opacity-25 d-block mb-3"></i>
                <h5 className="fw-semibold">Sin registros cerrados</h5>
                <p className="mb-0">Aún no se han cerrado tickets de no conformidad en este período.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '600px' }}>
                {[...cerradas].reverse().map(capa => (
                  <div key={capa.id} className="border rounded-3 p-3 bg-light bg-opacity-25 shadow-sm border-success border-opacity-25">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-success-subtle text-success">Cerrado</span>
                      <span className="small text-muted"><i className="bi bi-check-circle me-1"></i>Cierre: {capa.fechaCierre}</span>
                    </div>
                    
                    <div className="fw-semibold text-dark mb-1" style={{ fontSize: '13.5px' }}>{capa.hallazgo}</div>
                    <div className="small text-muted mb-2">Reportado por: {capa.responsable} | Origen: {capa.origen}</div>
                    
                    <hr className="my-2" />
                    
                    <div className="bg-body p-2 rounded small" style={{ fontSize: '12.5px' }}>
                      <div className="mb-1"><span className="fw-bold text-success"><i className="bi bi-funnel-fill me-1"></i>Causa Raíz:</span> {capa.causaRaiz}</div>
                      <div><span className="fw-bold text-success"><i className="bi bi-clipboard2-check-fill me-1"></i>Plan Aplicado:</span> {capa.planAccion}</div>
                    </div>
                    
                    <div className="text-end text-muted mt-2" style={{ fontSize: '11px' }}>
                      Verificado por: <strong>{capa.supervisorCierre}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Capa;

