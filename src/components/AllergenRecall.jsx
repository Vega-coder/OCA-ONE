import React, { useState } from 'react';

function AllergenRecall({ registros, onAgregar }) {
  // Estados para Control de Alérgenos
  const [linea, setLinea] = useState('Línea de Envasado A');
  const [alergenoPrevio, setAlergenoPrevio] = useState('Maní');
  const [alergenoObjetivo, setAlergenoObjetivo] = useState('Ninguno (Libre de alérgenos)');
  const [tipoPrueba, setTipoPrueba] = useState('Lateral Flow (Hisopado rápido)');
  const [resultado, setResultado] = useState('Negativo (Línea Liberada)');
  const [supervisor, setSupervisor] = useState('Carlos Gómez');
  const [alertaExito, setAlertaExito] = useState(false);

  // Estados para Simulador de Mock Recall
  const [loteSimulado, setLoteSimulado] = useState('L-LECHE-001');
  const [simulando, setSimulando] = useState(false);
  const [simulacionCompletada, setSimulacionCompletada] = useState(false);
  const [progresoBarra, setProgresoBarra] = useState(0);

  const handleSubmitAlergeno = (e) => {
    e.preventDefault();

    const nuevo = {
      linea,
      alergenoPrevio,
      alergenoObjetivo,
      tipoPrueba,
      resultado,
      supervisor
    };

    const hoy = new Date();
    const fecha = hoy.toISOString().split('T')[0];
    const hora = hoy.toTimeString().split(' ')[0].substring(0, 5);

    onAgregar({
      fecha,
      hora,
      ...nuevo
    });

    setAlertaExito(true);
    setTimeout(() => setAlertaExito(false), 4000);
  };

  const ejecutarSimulacro = () => {
    setSimulando(true);
    setSimulacionCompletada(false);
    setProgresoBarra(0);

    // Simular progreso de búsqueda de lotes, materias primas y facturas
    const interval = setInterval(() => {
      setProgresoBarra(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimulando(false);
          setSimulacionCompletada(true);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  // Datos detallados para el simulador de Mock Recall
  const reportesRecall = {
    'L-LECHE-001': {
      producto: 'Yogurt Entero de Fresa (Presentación 1000g)',
      produccion: {
        materiaPrimaUsada: 'Lote Leche R-LECH-892 (5,000 Litros)',
        aditivoClave: 'Cultivo Láctico L-CULT-902 | Fresa L-FRES-55',
        totalProducido: '4,800 Botellas',
        fechaProduccion: '2026-07-13',
      },
      conciliacion: {
        enStock: '1,200 Botellas (25.0%)',
        despachado: '3,600 Botellas (75.0%)',
        mermaProceso: '0 Botellas (0.0%)',
        porcentajeConciliado: '100.0%',
      },
      distribucion: [
        { cliente: 'Supermercados Éxito S.A.', factura: 'FA-98201', cantidad: '1,500 Botellas', contacto: '+57 300 456 7890', estado: 'Localizado y Bloqueado' },
        { cliente: 'Olímpica S.A. Barranquilla', factura: 'FA-98208', cantidad: '1,100 Botellas', contacto: '+57 301 987 6543', estado: 'Localizado y Bloqueado' },
        { cliente: 'Carulla Bogotá Norte', factura: 'FA-98314', cantidad: '1,000 Botellas', contacto: '+57 312 654 0987', estado: 'Localizado y Bloqueado' }
      ],
      rendimiento: {
        tiempoEjecucion: '1 min 12s',
        limitePermitido: '2 Horas',
        eficaciaRetiro: '100.0% (Éxito absoluto)',
      }
    },
    'L-QUESO-202': {
      producto: 'Queso Campesino Premium (Bloque 500g)',
      produccion: {
        materiaPrimaUsada: 'Lote Leche R-LECH-889 (2,500 Litros)',
        aditivoClave: 'Cuajo L-CUAJ-88 | Sal Marina L-SAL-12',
        totalProducido: '1,000 Bloques',
        fechaProduccion: '2026-07-12',
      },
      conciliacion: {
        enStock: '450 Bloques (45.0%)',
        despachado: '550 Bloques (55.0%)',
        mermaProceso: '0 Bloques (0.0%)',
        porcentajeConciliado: '100.0%',
      },
      distribucion: [
        { cliente: 'Cencosud / Jumbo Cali', factura: 'FA-97503', cantidad: '300 Bloques', contacto: '+57 315 222 1100', estado: 'Localizado y Bloqueado' },
        { cliente: 'Alkosto Medellín', factura: 'FA-97512', cantidad: '250 Bloques', contacto: '+57 320 888 9900', estado: 'Localizado y Bloqueado' }
      ],
      rendimiento: {
        tiempoEjecucion: '0 min 58s',
        limitePermitido: '2 Horas',
        eficaciaRetiro: '100.0% (Éxito absoluto)',
      }
    }
  };

  const recallSeleccionado = reportesRecall[loteSimulado];

  return (
    <div className="fade-in-view">
      <div className="row g-4">
        {/* Panel 1: Gestión de Alérgenos (Lado Izquierdo) */}
        <div className="col-12 col-xl-6">
          <div className="card OCA-card p-4 border-0 h-100">
            <h4 className="card-title font-heading mb-3"><i className="bi bi-egg-fried text-warning me-2"></i>Monitoreo de Alérgenos</h4>
            <p className="text-muted small">Registra los hisopados rápidos (Lateral Flow) o pruebas ELISA realizados en las superficies de la línea después del lavado y antes del cambio de lote para garantizar la ausencia de contaminación cruzada.</p>
            <hr className="my-3" />

            {alertaExito && (
              <div className="alert alert-success border-0 py-2 px-3 mb-3 small" style={{ borderRadius: '8px' }}>
                <i className="bi bi-check-circle-fill me-2"></i>Prueba de alérgenos registrada con éxito.
              </div>
            )}

            <form onSubmit={handleSubmitAlergeno} className="mb-4">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Línea de Producción</label>
                  <select className="form-select" value={linea} onChange={(e) => setLinea(e.target.value)} required>
                    <option value="Línea de Envasado A">Línea de Envasado A</option>
                    <option value="Línea de Pasteurizado">Línea de Pasteurizado</option>
                    <option value="Línea de Quesería">Línea de Quesería</option>
                    <option value="Zona de Mezclas">Zona de Mezclas</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Alérgeno Previo en la Línea</label>
                  <select className="form-select" value={alergenoPrevio} onChange={(e) => setAlergenoPrevio(e.target.value)} required>
                    <option value="Maní">Maní (Cacahuate)</option>
                    <option value="Gluten">Gluten (Trigo/Avena)</option>
                    <option value="Lactosa">Lactosa (Leche entera)</option>
                    <option value="Huevo">Huevo (Lecitina / Albúmina)</option>
                    <option value="Soya">Soya</option>
                    <option value="Ninguno (Línea limpia)">Ninguno / Línea Sanitizada</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Alérgeno del Producto a Fabricar</label>
                  <select className="form-select" value={alergenoObjetivo} onChange={(e) => setAlergenoObjetivo(e.target.value)} required>
                    <option value="Ninguno (Libre de alérgenos)">Ninguno (Libre de alérgenos)</option>
                    <option value="Lactosa">Lactosa (Yogurt/Queso estándar)</option>
                    <option value="Gluten">Gluten (Añadido de cereales)</option>
                    <option value="Maní">Maní (Adición de semillas)</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Método de Prueba</label>
                  <select className="form-select" value={tipoPrueba} onChange={(e) => setTipoPrueba(e.target.value)} required>
                    <option value="Lateral Flow (Hisopado rápido)">Lateral Flow (Hisopado de Superficie)</option>
                    <option value="ELISA Test (Laboratorio)">ELISA Test (Laboratorio cuantitativo)</option>
                    <option value="Proteína Total (Hisopo reactivo)">Proteína Total (Verificación de enjuague)</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Resultado de Limpieza</label>
                  <select className="form-select" value={resultado} onChange={(e) => setResultado(e.target.value)} required>
                    <option value="Negativo (Línea Liberada)">Negativo (Sin alérgeno - Línea Liberada)</option>
                    <option value="Positivo (Contaminación - Re-lavar)">Positivo (Alérgeno presente - REQUIERE RE-LAVADO)</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Supervisor Evaluador</label>
                  <input type="text" className="form-control" value={supervisor} onChange={(e) => setSupervisor(e.target.value)} required />
                </div>
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-shield-check-fill me-1"></i> Firmar Liberación de Alérgenos
                </button>
              </div>
            </form>

            {/* Historial de Alérgenos */}
            <h5 className="fw-semibold text-muted small uppercase mb-3">Historial de Liberaciones</h5>
            <div className="table-responsive" style={{ maxHeight: '200px' }}>
              <table className="table table-sm table-hover align-middle" style={{ fontSize: '12.5px' }}>
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Línea</th>
                    <th>Alérgeno Previo</th>
                    <th>Resultado</th>
                    <th>Firma</th>
                  </tr>
                </thead>
                <tbody>
                  {[...registros].reverse().map(reg => (
                    <tr key={reg.id}>
                      <td>{reg.fecha}</td>
                      <td className="fw-medium">{reg.linea}</td>
                      <td>{reg.alergenoPrevio}</td>
                      <td>
                        {reg.resultado.includes('Negativo') ? (
                          <span className="badge bg-success-subtle text-success">Negativo</span>
                        ) : (
                          <span className="badge bg-danger-subtle text-danger badge-pulse">Positivo</span>
                        )}
                      </td>
                      <td className="text-muted">{reg.supervisor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel 2: Simulador de Retiro (Mock Recall) (Lado Derecho) */}
        <div className="col-12 col-xl-6">
          <div className="card OCA-card p-4 border-0 h-100 d-flex flex-column">
            <h4 className="card-title font-heading mb-3"><i className="bi bi-bezier2 text-primary me-2"></i>Simulador de Retiro de Producto (Mock Recall)</h4>
            <p className="text-muted small">Exigencia HACCP obligatoria para auditorías GFSI (BRC/IFS/SQF). Simula el retiro de un lote del mercado en tiempo real, cruzando inventarios de materia prima, producto en cuarentena y facturación a clientes.</p>
            <hr className="my-3" />

            <div className="row g-2 mb-3">
              <div className="col">
                <select className="form-select" value={loteSimulado} onChange={(e) => {
                  setLoteSimulado(e.target.value);
                  setSimulacionCompletada(false);
                }}>
                  <option value="L-LECHE-001">Lote: L-LECHE-001 (Yogurt de Fresa)</option>
                  <option value="L-QUESO-202">Lote: L-QUESO-202 (Queso Campesino)</option>
                </select>
              </div>
              <div className="col-auto">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={ejecutarSimulacro}
                  disabled={simulando}
                >
                  {simulando ? (
                    <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Simulando...</span>
                  ) : (
                    <span><i className="bi bi-play-fill me-1"></i>Iniciar Simulacro</span>
                  )}
                </button>
              </div>
            </div>

            {simulando && (
              <div className="my-auto py-5 text-center">
                <h6 className="fw-bold mb-3 text-secondary">Rastreando lote y facturas en tiempo real...</h6>
                <div className="progress mx-auto" style={{ width: '80%', height: '10px' }}>
                  <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style={{ width: `${progresoBarra}%` }}></div>
                </div>
              </div>
            )}

            {!simulando && !simulacionCompletada && (
              <div className="text-center my-auto py-5 text-muted bg-light bg-opacity-25 rounded-3 border">
                <i className="bi bi-stopwatch display-3 text-secondary opacity-25 d-block mb-2"></i>
                <h6 className="fw-semibold">Simulador Listo</h6>
                <p className="mb-0 small text-muted">Selecciona un lote y haz clic en "Iniciar Simulacro" para verificar la velocidad de tu rastreabilidad.</p>
              </div>
            )}

            {simulacionCompletada && recallSeleccionado && (
              <div className="flex-grow-1 d-flex flex-column">
                <div className="alert alert-success border-0 py-2 px-3 rounded-3 mb-3 d-flex justify-content-between align-items-center">
                  <span className="fw-semibold"><i className="bi bi-check-circle-fill me-2"></i>SIMULACRO EXITOSO (100% CONCILIADO)</span>
                  <span className="badge bg-success">{recallSeleccionado.rendimiento.eficaciaRetiro}</span>
                </div>

                {/* Reporte de Balance de Masas */}
                <div className="row g-2 mb-3">
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-2 bg-body">
                      <strong className="d-block small text-muted">Producto Evaluado</strong>
                      <span className="small fw-bold text-dark">{recallSeleccionado.producto}</span>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="border rounded p-2 bg-body">
                      <strong className="d-block small text-muted">Materia Prima Usada</strong>
                      <span className="small text-dark" style={{ fontSize: '11.5px' }}>{recallSeleccionado.produccion.materiaPrimaUsada}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-2 bg-body">
                      <strong className="d-block small text-muted">Total Producido</strong>
                      <span className="small fw-bold text-dark">{recallSeleccionado.produccion.totalProducido}</span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-2 bg-body">
                      <strong className="d-block small text-muted">Reconciliación de Masas</strong>
                      <span className="small fw-bold text-success"><i className="bi bi-check2 me-1"></i>{recallSeleccionado.conciliacion.porcentajeConciliado}</span>
                    </div>
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="p-2 border bg-light bg-opacity-25 rounded text-center">
                      <div className="small text-muted">En Bodega (Stock)</div>
                      <h5 className="mb-0 fw-bold">{recallSeleccionado.conciliacion.enStock.split(' ')[0]}</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 border bg-light bg-opacity-25 rounded text-center">
                      <div className="small text-muted">Despachado a Clientes</div>
                      <h5 className="mb-0 fw-bold text-primary">{recallSeleccionado.conciliacion.despachado.split(' ')[0]}</h5>
                    </div>
                  </div>
                </div>

                {/* Lista de clientes a contactar en caso de emergencia */}
                <h6 className="fw-semibold small uppercase text-muted mb-2"><i className="bi bi-telephone-outbound me-1"></i>Destinos de Distribución (Clientes a Contactar)</h6>
                <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '180px' }}>
                  {recallSeleccionado.distribucion.map((dist, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center p-2 mb-1 border rounded bg-body small" style={{ fontSize: '12px' }}>
                      <div>
                        <strong>{dist.cliente}</strong>
                        <div className="text-muted" style={{ fontSize: '11px' }}>Factura: {dist.factura} | Cantidad: {dist.cantidad}</div>
                      </div>
                      <div className="text-end">
                        <span className="badge bg-success-subtle text-success mb-1 d-block">{dist.estado}</span>
                        <code className="text-dark d-block">{dist.contacto}</code>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tiempos de Auditoría */}
                <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center small text-muted">
                  <span>Tiempo total de respuesta: <strong>{recallSeleccionado.rendimiento.tiempoEjecucion}</strong></span>
                  <span>Límite de norma GFSI: <strong>{recallSeleccionado.rendimiento.limitePermitido}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllergenRecall;

