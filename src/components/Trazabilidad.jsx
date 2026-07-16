import React, { useState } from 'react';

function Trazabilidad() {
  const [buscarLote, setBuscarLote] = useState('');
  const [loteEncontrado, setLoteEncontrado] = useState(null);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  // Base de datos de lotes para trazabilidad simulada
  const baseLotes = {
    'L-LECHE-001': {
      producto: 'Yogurt Entero de Fresa (PresentaciÃ³n 1000g)',
      lote: 'L-LECHE-001',
      fechaCreacion: '2026-07-15',
      estado: 'Entregado a DistribuciÃ³n',
      arbol: [
        {
          fase: '1. RecepciÃ³n de Materia Prima (Leche)',
          fecha: '2026-07-13 06:10',
          detalles: 'Leche entera fresca recibida de Hacienda El Recreo. Lote proveedor: R-LECH-892 (5,000 Litros).',
          controles: 'Temperatura: 3.8 Â°C | pH: 6.65 (Aprobado)',
          encargado: 'Carlos GÃ³mez'
        },
        {
          fase: '2. PasteurizaciÃ³n e InoculaciÃ³n',
          fecha: '2026-07-13 14:00',
          detalles: 'Tratamiento tÃ©rmico a 72.5Â°C por 15 segundos. AdiciÃ³n de cultivo lÃ¡ctico Lote CULT-902.',
          controles: 'Temperatura pasteurizaciÃ³n: 72.8 Â°C (Conforme) | pH de mezcla: 4.60 post fermentaciÃ³n',
          encargado: 'Ana MartÃ­nez'
        },
        {
          fase: '3. Envasado y Sellado',
          fecha: '2026-07-14 09:30',
          detalles: 'DosificaciÃ³n con pulpa de fresa Lote FRES-55. Envasado en botellas PET de 1000g.',
          controles: 'Detector de metales: Conforme | Sellado tÃ©rmico: HermÃ©tico',
          encargado: 'Javier Castillo (Operario) / Carlos GÃ³mez (Supervisor)'
        },
        {
          fase: '4. Cuarto FrÃ­o y DistribuciÃ³n',
          fecha: '2026-07-15 05:00',
          detalles: 'Almacenamiento en CÃ¡mara FrigorÃ­fica 1 para estabilizaciÃ³n de coÃ¡gulo y despacho.',
          controles: 'Temperatura cÃ¡mara: 4.0 Â°C (Seguro) | Despacho: CamiÃ³n refrigerado placa TXX-090 (Temp: 3.5Â°C)',
          encargado: 'Luis Fernando Ruiz'
        }
      ]
    },
    'L-QUESO-202': {
      producto: 'Queso Campesino Premium (Bloque 500g)',
      lote: 'L-QUESO-202',
      fechaCreacion: '2026-07-14',
      estado: 'Almacenado en Planta',
      arbol: [
        {
          fase: '1. RecepciÃ³n de Materia Prima',
          fecha: '2026-07-12 07:15',
          detalles: 'Leche cruda recolectada. Lote proveedor: R-LECH-889 (2,500 Litros) de Hacienda San Juan.',
          controles: 'Temperatura: 4.2 Â°C | pH: 6.60',
          encargado: 'Carlos GÃ³mez'
        },
        {
          fase: '2. CoagulaciÃ³n y Corte de Cuajada',
          fecha: '2026-07-12 11:30',
          detalles: 'AdiciÃ³n de cuajo lÃ­quido Lote CUAJ-88. Corte de cuajada en cubos de 1cm.',
          controles: 'Temperatura de cuajado: 34 Â°C | Tiempo de cuajado: 35 min',
          encargado: 'Marta Solano'
        },
        {
          fase: '3. Prensado y Salado',
          fecha: '2026-07-12 15:45',
          detalles: 'Moldeado y prensado neumÃ¡tico a 15 psi. AdiciÃ³n de sal marina Lote SAL-12.',
          controles: 'PresiÃ³n: Conforme | Porcentaje de sal: 1.5% (Aceptable)',
          encargado: 'Marta Solano'
        },
        {
          fase: '4. Empaque al VacÃ­o y MaduraciÃ³n',
          fecha: '2026-07-13 10:00',
          detalles: 'Empacado en bolsas termoencogibles de barrera al vacÃ­o.',
          controles: 'VacÃ­o: 99.8% de eficiencia (Excelente) | Temperatura de conservaciÃ³n: 4.5Â°C',
          encargado: 'Andrea Quintero'
        }
      ]
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const query = buscarLote.trim().toUpperCase();
    if (baseLotes[query]) {
      setLoteEncontrado(baseLotes[query]);
    } else {
      setLoteEncontrado(null);
    }
    setBusquedaRealizada(true);
  };

  const usarLoteRapido = (lote) => {
    setBuscarLote(lote);
    setLoteEncontrado(baseLotes[lote]);
    setBusquedaRealizada(true);
  };

  return (
    <div className="fade-in-view">
      <div className="row g-4">
        {/* Panel de BÃºsqueda (Columna Izquierda) */}
        <div className="col-12 col-lg-4">
          <div className="card OCA-card p-4 border-0">
            <h4 className="card-title font-heading mb-3"><i className="bi bi-search text-success me-2"></i>Rastreo de Lotes</h4>
            <p className="text-muted small">Ingresa el identificador de lote impreso en el empaque o en la orden de recepciÃ³n para obtener la trazabilidad ascendente y descendente del producto.</p>
            
            <form onSubmit={handleBuscar} className="mb-4">
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: L-LECHE-001" 
                  value={buscarLote} 
                  onChange={(e) => setBuscarLote(e.target.value)} 
                  required
                />
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-search"></i> Buscar
                </button>
              </div>
            </form>

            <h6 className="fw-semibold text-muted small uppercase mb-2">Lotes de Prueba Activos</h6>
            <div className="d-grid gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary text-start btn-sm" 
                onClick={() => usarLoteRapido('L-LECHE-001')}
              >
                <i className="bi bi-tag-fill text-success me-2"></i><strong>L-LECHE-001</strong> (Yogurt Fresa 1000g)
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary text-start btn-sm" 
                onClick={() => usarLoteRapido('L-QUESO-202')}
              >
                <i className="bi bi-tag-fill text-success me-2"></i><strong>L-QUESO-202</strong> (Queso Campesino 500g)
              </button>
            </div>

            <hr className="my-4 text-secondary" />

            <div className="bg-light bg-opacity-25 rounded-3 p-3 border">
              <h6 className="fw-semibold mb-2 text-dark small"><i className="bi bi-shield-check text-success me-1"></i>Trazabilidad a un clic (HACCP)</h6>
              <p className="text-muted mb-0" style={{ fontSize: '12px' }}>
                OCA ONE unifica las planillas de recepciÃ³n, planillas de pasteurizaciÃ³n, registros de envasado e informes de despacho en un Ãºnico hilo lÃ³gico digital.
              </p>
            </div>
          </div>
        </div>

        {/* VisualizaciÃ³n del Ãrbol de Trazabilidad (Columna Derecha) */}
        <div className="col-12 col-lg-8">
          <div className="card OCA-card p-4 border-0 h-100">
            {!busquedaRealizada && (
              <div className="text-center py-5 my-auto text-muted">
                <i className="bi bi-bezier2 display-1 text-success opacity-25 d-block mb-3"></i>
                <h5 className="fw-semibold">Buscador de Trazabilidad Activo</h5>
                <p className="mb-0">Realiza una bÃºsqueda de lote para desplegar la lÃ­nea de vida del producto.</p>
              </div>
            )}

            {busquedaRealizada && !loteEncontrado && (
              <div className="alert alert-warning border-0 p-4 shadow-sm rounded-3 text-center my-auto">
                <i className="bi bi-exclamation-triangle-fill text-warning fs-1 d-block mb-2"></i>
                <h5 className="fw-bold">Lote No Encontrado</h5>
                <p className="mb-3">El lote "{buscarLote}" no se encuentra registrado en la base de datos de esta planta. Verifica el cÃ³digo e intenta nuevamente.</p>
                <div className="small text-muted">Prueba usando los botones rÃ¡pidos de la columna izquierda.</div>
              </div>
            )}

            {busquedaRealizada && loteEncontrado && (
              <div>
                {/* Encabezado del Lote */}
                <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-4 gap-2">
                  <div>
                    <span className="badge bg-success mb-2">Lote Identificado</span>
                    <h3 className="font-heading mb-0 text-dark">{loteEncontrado.producto}</h3>
                    <div className="text-muted mt-1 small">CÃ³digo Lote: <strong>{loteEncontrado.lote}</strong> | Creado el: {loteEncontrado.fechaCreacion}</div>
                  </div>
                  <div className="text-end">
                    <span className="badge bg-success-subtle text-success fs-6 py-2 px-3 border border-success border-opacity-25 rounded-pill">
                      <i className="bi bi-check2-all me-1"></i> {loteEncontrado.estado}
                    </span>
                  </div>
                </div>

                {/* Ãrbol de Trazabilidad */}
                <div className="timeline-tree">
                  {loteEncontrado.arbol.map((nodo, index) => (
                    <div key={index} className="timeline-node">
                      <div className="card border-0 bg-light bg-opacity-25 shadow-sm p-3 mb-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="fw-bold text-success mb-0">{nodo.fase}</h6>
                          <span className="small text-muted"><i className="bi bi-clock me-1"></i>{nodo.fecha}</span>
                        </div>
                        <p className="mb-2 text-dark" style={{ fontSize: '13.5px' }}>{nodo.detalles}</p>
                        
                        <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top gap-2" style={{ fontSize: '12px' }}>
                          <span className="text-secondary">
                            <i className="bi bi-activity text-info me-1"></i><strong>Controles:</strong> {nodo.controles}
                          </span>
                          <span className="text-secondary">
                            <i className="bi bi-person text-secondary me-1"></i><strong>Firma:</strong> {nodo.encargado}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trazabilidad;

