import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Saneamiento from './components/Saneamiento';
import VariablesCriticas from './components/VariablesCriticas';
import Trazabilidad from './components/Trazabilidad';
import Capacitaciones from './components/Capacitaciones';
import Capa from './components/Capa';
import AllergenRecall from './components/AllergenRecall';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('OCA-theme') || 'light');
  
  // Base de datos de Saneamiento
  const [registrosSaneamiento, setRegistrosSaneamiento] = useState(() => {
    const saved = localStorage.getItem('OCA-saneamiento');
    return saved ? JSON.parse(saved) : [
      { id: 1, fecha: '2026-07-15', hora: '06:30', area: 'Cuarto FrÃ­o 1', supervisor: 'Carlos GÃ³mez', tipo: 'Pre-operacional', producto: 'Cloro 200ppm', conforme: true, observacion: 'Cumple sin novedades' },
      { id: 2, fecha: '2026-07-15', hora: '13:00', area: 'LÃ­nea de Envasado A', supervisor: 'Ana MartÃ­nez', tipo: 'Rutinaria', producto: 'Amonio Cuaternario', conforme: true, observacion: 'Limpieza intermedia' },
      { id: 3, fecha: '2026-07-15', hora: '18:00', area: 'AlmacÃ©n MP', supervisor: 'Diana PÃ©rez', tipo: 'Profunda', producto: 'Detergente Neutro', conforme: true, observacion: 'Lavado general' },
      { id: 4, fecha: '2026-07-14', hora: '22:00', area: 'Cuarto FrÃ­o 2', supervisor: 'Carlos GÃ³mez', tipo: 'Profunda', producto: 'Cloro 200ppm', conforme: false, observacion: 'Presencia de residuos en desagÃ¼e. Se requiere repetir.' }
    ];
  });

  // Base de datos de Variables CrÃ­ticas (PCC)
  const [medicionesVariables, setMedicionesVariables] = useState(() => {
    const saved = localStorage.getItem('OCA-variables');
    return saved ? JSON.parse(saved) : [
      { id: 1, fecha: '2026-07-15', hora: '08:00', punto: 'CÃ¡mara RefrigeraciÃ³n 1', temperatura: 4.2, ph: null, supervisor: 'Carlos GÃ³mez', estado: 'Normal', comentario: 'Equipo operando estable.' },
      { id: 2, fecha: '2026-07-15', hora: '10:00', punto: 'Pasteurizador B', temperatura: 72.5, ph: 6.62, supervisor: 'Ana MartÃ­nez', estado: 'Normal', comentario: 'PasteurizaciÃ³n de leche entera.' },
      { id: 3, fecha: '2026-07-15', hora: '12:00', punto: 'Silaje de Materia Prima', temperatura: 5.1, ph: 6.65, supervisor: 'Diana PÃ©rez', estado: 'Normal', comentario: 'Lote L-LECHE-102 recibido.' },
      { id: 4, fecha: '2026-07-15', hora: '14:30', punto: 'CÃ¡mara RefrigeraciÃ³n 1', temperatura: 9.8, ph: null, supervisor: 'Carlos GÃ³mez', estado: 'Alerta', comentario: 'Apertura prolongada de puerta por carga. Alerta automÃ¡tica.' }
    ];
  });

  // Base de datos de Manipuladores
  const [manipuladores, setManipuladores] = useState(() => {
    const saved = localStorage.getItem('OCA-manipuladores');
    return saved ? JSON.parse(saved) : [
      { id: 1, nombre: 'Javier Castillo', cargo: 'Operario de Envasado', carnetBpm: 'Vigente', controlMedico: 'Apto', capacitacionProgreso: 92 },
      { id: 2, nombre: 'Marta Solano', cargo: 'Operaria de Mezclas', carnetBpm: 'Vigente', controlMedico: 'Apto', capacitacionProgreso: 85 },
      { id: 3, nombre: 'Luis Fernando Ruiz', cargo: 'Auxiliar de AlmacÃ©n', carnetBpm: 'Vence Pronto', controlMedico: 'Apto', capacitacionProgreso: 78 },
      { id: 4, nombre: 'Andrea Quintero', cargo: 'Operaria de Limpieza', carnetBpm: 'Vigente', controlMedico: 'Apto', capacitacionProgreso: 100 },
      { id: 5, nombre: 'Jorge Restrepo', cargo: 'Operario de Pasteurizado', carnetBpm: 'Vencido', controlMedico: 'Pendiente', capacitacionProgreso: 45 }
    ];
  });

  // Base de datos de Acciones CAPA (Desviaciones)
  const [accionesCapa, setAccionesCapa] = useState(() => {
    const saved = localStorage.getItem('OCA-capa');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        origen: 'Saneamiento', 
        fecha: '2026-07-14', 
        hora: '22:00', 
        hallazgo: 'Saneamiento fallido en Cuarto FrÃ­o 2: Presencia de residuos orgÃ¡nicos en desagÃ¼e.', 
        responsable: 'Carlos GÃ³mez', 
        estado: 'Abierto', 
        causaRaiz: '', 
        planAccion: '', 
        fechaCierre: '', 
        supervisorCierre: '' 
      }
    ];
  });

  // Base de datos de registros de cambio de alÃ©rgenos
  const [registrosAlergenos, setRegistrosAlergenos] = useState(() => {
    const saved = localStorage.getItem('OCA-alergenos');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        fecha: '2026-07-15', 
        hora: '07:30', 
        linea: 'LÃ­nea de Envasado A', 
        alergenoPrevio: 'ManÃ­', 
        alergenoObjetivo: 'Ninguno (Libre de alÃ©rgenos)', 
        tipoPrueba: 'Lateral Flow (Hisopado rÃ¡pido)', 
        resultado: 'Negativo (LÃ­nea Liberada)', 
        supervisor: 'Carlos GÃ³mez' 
      }
    ];
  });

  // Persistencia de los estados en localStorage
  useEffect(() => {
    localStorage.setItem('OCA-saneamiento', JSON.stringify(registrosSaneamiento));
  }, [registrosSaneamiento]);

  useEffect(() => {
    localStorage.setItem('OCA-variables', JSON.stringify(medicionesVariables));
  }, [medicionesVariables]);

  useEffect(() => {
    localStorage.setItem('OCA-manipuladores', JSON.stringify(manipuladores));
  }, [manipuladores]);

  useEffect(() => {
    localStorage.setItem('OCA-capa', JSON.stringify(accionesCapa));
  }, [accionesCapa]);

  useEffect(() => {
    localStorage.setItem('OCA-alergenos', JSON.stringify(registrosAlergenos));
  }, [registrosAlergenos]);

  // Manejo del tema (Modo Claro / Modo Oscuro)
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('OCA-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Agregar registros y autogenerar Tickets CAPA ante fallas o alertas
  const handleAgregarSaneamiento = (nuevoRegistro) => {
    const id = Date.now();
    setRegistrosSaneamiento(prev => [...prev, { id, ...nuevoRegistro }]);

    // Si no es conforme, se genera automÃ¡ticamente una no conformidad en el mÃ³dulo CAPA
    if (!nuevoRegistro.conforme) {
      setAccionesCapa(prev => [
        ...prev,
        {
          id: Date.now() + 10,
          origen: 'Saneamiento',
          fecha: nuevoRegistro.fecha,
          hora: nuevoRegistro.hora,
          hallazgo: `Saneamiento fallido en ${nuevoRegistro.area}: ${nuevoRegistro.observacion}`,
          responsable: nuevoRegistro.supervisor,
          estado: 'Abierto',
          causaRaiz: '',
          planAccion: '',
          fechaCierre: '',
          supervisorCierre: ''
        }
      ]);
    }
  };

  const handleAgregarVariable = (nuevaMedicion) => {
    const id = Date.now();
    setMedicionesVariables(prev => [...prev, { id, ...nuevaMedicion }]);

    // Si la variable estÃ¡ en estado de Alerta, genera automÃ¡ticamente un CAPA
    if (nuevaMedicion.estado === 'Alerta') {
      setAccionesCapa(prev => [
        ...prev,
        {
          id: Date.now() + 20,
          origen: 'Variables CrÃ­ticas',
          fecha: nuevaMedicion.fecha,
          hora: nuevaMedicion.hora,
          hallazgo: `DesviaciÃ³n en ${nuevaMedicion.punto}: Valor registrado de ${nuevaMedicion.temperatura}Â°C ${nuevaMedicion.ph ? `| pH ${nuevaMedicion.ph}` : ''}. Comentario: ${nuevaMedicion.comentario}`,
          responsable: nuevaMedicion.supervisor,
          estado: 'Abierto',
          causaRaiz: '',
          planAccion: '',
          fechaCierre: '',
          supervisorCierre: ''
        }
      ]);
    }
  };

  const handleResolverCapa = (id, resolucion) => {
    setAccionesCapa(prev => prev.map(capa => {
      if (capa.id === id) {
        return {
          ...capa,
          estado: 'Cerrado',
          causaRaiz: resolucion.causaRaiz,
          planAccion: resolucion.planAccion,
          fechaCierre: new Date().toISOString().split('T')[0],
          supervisorCierre: resolucion.supervisorCierre
        };
      }
      return capa;
    }));
  };

  const handleAgregarAlergeno = (nuevoAlergeno) => {
    setRegistrosAlergenos(prev => [
      ...prev,
      { id: Date.now(), ...nuevoAlergeno }
    ]);
  };

  const handleAgregarManipulador = (nuevoMan) => {
    setManipuladores(prev => [...prev, { id: Date.now(), ...nuevoMan }]);
  };

  // Calcular alertas activas para el centro de notificaciones
  const alertasActivas = [];

  // Agregar alertas si hay CAPA pendientes abiertos
  accionesCapa.forEach(capa => {
    if (capa.estado === 'Abierto') {
      alertasActivas.push({
        id: `capa-${capa.id}`,
        tipo: 'danger',
        mensaje: `CAPA Abierta: ${capa.hallazgo.substring(0, 60)}...`,
        fecha: capa.fecha
      });
    }
  });

  // Agregar alertas de personal vencido
  manipuladores.forEach(man => {
    if (man.carnetBpm === 'Vencido') {
      alertasActivas.push({
        id: `man-${man.id}`,
        tipo: 'warning',
        mensaje: `Carnet BPM vencido para ${man.nombre}`,
        fecha: 'Urgente'
      });
    }
  });

  return (
    <div className="container-fluid p-0 d-flex">
      {/* Sidebar de NavegaciÃ³n */}
      <aside className="OCA-sidebar d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: '280px' }}>
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-4 fw-extrabold text-success me-2">
            <i className="bi bi-shield-check"></i>
          </span>
          <span className="fs-4 fw-bold tracking-tight">OCA <span className="text-success fw-normal">ONE</span></span>
        </div>
        <hr className="bg-secondary" />
        
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'dashboard' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'saneamiento' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('saneamiento')}
            >
              <i className="bi bi-bucket me-2"></i> Saneamiento e Higiene
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'variables' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('variables')}
            >
              <i className="bi bi-thermometer-half me-2"></i> Variables CrÃ­ticas
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'capa' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('capa')}
            >
              <i className="bi bi-clipboard-x me-2"></i> Acciones CAPA
              {accionesCapa.filter(c => c.estado === 'Abierto').length > 0 && (
                <span className="badge bg-danger ms-2">
                  {accionesCapa.filter(c => c.estado === 'Abierto').length}
                </span>
              )}
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'trazabilidad' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('trazabilidad')}
            >
              <i className="bi bi-bezier2 me-2"></i> Trazabilidad de Lotes
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'alergenos-recall' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('alergenos-recall')}
            >
              <i className="bi bi-shield-exclamation me-2"></i> AlÃ©rgenos y Retiros
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'capacitaciones' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('capacitaciones')}
            >
              <i className="bi bi-people me-2"></i> Manipuladores y BPM
            </button>
          </li>
        </ul>
        <hr className="bg-secondary" />
        <div className="text-secondary small">
          <p className="mb-1"><i className="bi bi-building me-1"></i> Optimus LatinoamÃ©rica</p>
          <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>v2.0.0 - EdiciÃ³n Profesional</p>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-grow-1 min-vh-100 d-flex flex-column" style={{ overflowY: 'auto' }}>
        {/* Cabecera */}
        <header className="navbar navbar-expand-lg border-bottom px-4 py-3 bg-body-tertiary sticky-top">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-0 text-capitalize font-heading">
              {currentView === 'dashboard' && 'Dashboard de Calidad e Inocuidad'}
              {currentView === 'saneamiento' && 'Plan de Saneamiento e Higiene'}
              {currentView === 'variables' && 'Monitoreo de Variables CrÃ­ticas (PCC)'}
              {currentView === 'capa' && 'GestiÃ³n de Acciones Correctivas (CAPA)'}
              {currentView === 'trazabilidad' && 'Trazabilidad de Lotes'}
              {currentView === 'alergenos-recall' && 'Control de AlÃ©rgenos y Simulador de Retiro'}
              {currentView === 'capacitaciones' && 'Control de Manipuladores y BPM'}
            </h1>
            
            <div className="d-flex align-items-center ms-auto">
              {/* Tema claro/oscuro */}
              <button 
                className="btn btn-outline-secondary me-3 border-0 rounded-circle" 
                onClick={toggleTheme}
                title="Cambiar tema"
                style={{ width: '40px', height: '40px', padding: '0' }}
              >
                {theme === 'light' ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill text-warning"></i>}
              </button>

              {/* Alertas */}
              <div className="dropdown me-3">
                <button 
                  className="btn btn-outline-secondary position-relative border-0 rounded-circle"
                  style={{ width: '40px', height: '40px', padding: '0' }}
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <i className="bi bi-bell-fill"></i>
                  {alertasActivas.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger badge-pulse" style={{ fontSize: '10px' }}>
                      {alertasActivas.length}
                    </span>
                  )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow p-2" style={{ width: '320px', borderRadius: '12px' }}>
                  <li className="dropdown-header border-bottom pb-2 fw-bold text-dark">Alertas de Planta</li>
                  {alertasActivas.length === 0 ? (
                    <li className="text-center py-3 text-muted">
                      <i className="bi bi-check2-circle text-success fs-3 d-block mb-1"></i>
                      Sin alertas activas en planta.
                    </li>
                  ) : (
                    alertasActivas.map(al => (
                      <li key={al.id} className="my-1">
                        <div className="alert alert-danger py-2 px-3 mb-0 border-0 rounded-3" style={{ fontSize: '12.5px' }}>
                          <div>{al.mensaje}</div>
                          <div className="text-muted small mt-1"><i className="bi bi-clock me-1"></i>{al.fecha}</div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Perfil */}
              <div className="d-flex align-items-center border-start ps-3">
                <div className="text-end me-2 d-none d-md-block">
                  <div className="fw-bold" style={{ fontSize: '14px' }}>Ing. Carlos G.</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Director de Calidad</div>
                </div>
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                  CG
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Vistas DinÃ¡micas */}
        <div className="flex-grow-1 p-4 bg-light bg-opacity-10 fade-in-view">
          {currentView === 'dashboard' && (
            <Dashboard 
              saneamiento={registrosSaneamiento} 
              variables={medicionesVariables} 
              manipuladores={manipuladores} 
              alertas={alertasActivas}
              accionesCapa={accionesCapa}
              onNavigate={setCurrentView}
            />
          )}
          {currentView === 'saneamiento' && (
            <Saneamiento 
              registros={registrosSaneamiento} 
              onAgregar={handleAgregarSaneamiento}
            />
          )}
          {currentView === 'variables' && (
            <VariablesCriticas 
              mediciones={medicionesVariables} 
              onAgregar={handleAgregarVariable}
            />
          )}
          {currentView === 'capa' && (
            <Capa 
              acciones={accionesCapa} 
              onResolver={handleResolverCapa}
            />
          )}
          {currentView === 'trazabilidad' && (
            <Trazabilidad />
          )}
          {currentView === 'alergenos-recall' && (
            <AllergenRecall 
              registros={registrosAlergenos} 
              onAgregar={handleAgregarAlergeno}
            />
          )}
          {currentView === 'capacitaciones' && (
            <Capacitaciones 
              manipuladores={manipuladores}
              onAgregar={handleAgregarManipulador}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="footer mt-auto py-3 border-top bg-body-tertiary">
          <div className="container-fluid px-4 d-flex justify-content-between align-items-center text-muted small">
            <span>&copy; 2026 OCA ONE. EdiciÃ³n Profesional - Optimus LatinoamÃ©rica.</span>
            <span>Seguridad Alimentaria: HACCP / ISO 22000 / BRCGS / IFS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;

