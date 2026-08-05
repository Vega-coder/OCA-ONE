import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Saneamiento from './components/Saneamiento';
import VariablesCriticas from './components/VariablesCriticas';
import Trazabilidad from './components/Trazabilidad';
import Capacitaciones from './components/Capacitaciones';
import Capa from './components/Capa';
import AllergenRecall from './components/AllergenRecall';
import Procedimientos from './components/Procedimientos';
import {
  fetchTenantsFromDb,
  saveTenantToDb,
  fetchProcedimientosFromDb,
  saveProcedimientoToDb,
  fetchSaneamientoFromDb,
  saveSaneamientoToDb,
  fetchCapaFromDb,
  updateCapaInDb,
  fetchAlergenosFromDb,
  saveAlergenoToDb,
  fetchManipuladoresFromDb,
  saveManipuladorToDb,
  fetchMedicionesFromDb,
  saveMedicionToDb
} from './lib/dataService';

function App() {
  const [currentView, setCurrentView] = useState('procedimientos');
  const [theme, setTheme] = useState(() => localStorage.getItem('OCA-theme-v4') || 'light');
  const [isProcedimientosOpen, setIsProcedimientosOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Limpieza y Desinfección');
  const [expandedCategories, setExpandedCategories] = useState({
    'Limpieza y Desinfección': true,
    'Control de Plagas': false,
    'Residuos Sólidos y Líquidos': false,
    'Agua Potable': false
  });
  
  // Estado Multi-Tenant (Inquilinos / Empresas Clientes)
  const [tenants, setTenants] = useState([
    { id: 'tenant-opt-01', nombre: 'Optimus Latinoamérica', nit: '900.123.456-7', plan: 'Edición Profesional' },
    { id: 'tenant-lacteos-02', nombre: 'Lácteos del Valle S.A.S.', nit: '800.987.654-1', plan: 'Plan Gold HACCP' },
    { id: 'tenant-carnes-03', nombre: 'Frigoríficos y Procesados Norte', nit: '901.456.789-3', plan: 'Enterprise' }
  ]);
  const [activeTenant, setActiveTenant] = useState(() => {
    const saved = localStorage.getItem('OCA-active-tenant-v1');
    return saved ? JSON.parse(saved) : { id: 'tenant-opt-01', nombre: 'Optimus Latinoamérica', nit: '900.123.456-7', plan: 'Edición Profesional' };
  });

  const [mostrarCrearTenant, setMostrarCrearTenant] = useState(false);
  const [nuevoTenantNombre, setNuevoTenantNombre] = useState('');
  const [nuevoTenantNit, setNuevoTenantNit] = useState('');
  const [nuevoTenantPlan, setNuevoTenantPlan] = useState('Edición Profesional');

  // Base de datos dinámica de Procedimientos (Control Documental ISO)
  const [procedimientos, setProcedimientos] = useState([]);
  const [registrosSaneamiento, setRegistrosSaneamiento] = useState([]);
  const [medicionesVariables, setMedicionesVariables] = useState([]);
  const [manipuladores, setManipuladores] = useState([]);
  const [accionesCapa, setAccionesCapa] = useState([]);
  const [registrosAlergenos, setRegistrosAlergenos] = useState([]);

  // Carga inicial y cambio dinámico según el tenant activo
  useEffect(() => {
    async function syncFromSupabase() {
      const dbTenants = await fetchTenantsFromDb();
      if (dbTenants && dbTenants.length > 0) setTenants(dbTenants);

      const dbProcs = await fetchProcedimientosFromDb(activeTenant.id);
      if (dbProcs) setProcedimientos(dbProcs);

      const dbSaneamiento = await fetchSaneamientoFromDb(activeTenant.id);
      if (dbSaneamiento) setRegistrosSaneamiento(dbSaneamiento);

      const dbCapa = await fetchCapaFromDb(activeTenant.id);
      if (dbCapa) setAccionesCapa(dbCapa);

      const dbAlergenos = await fetchAlergenosFromDb(activeTenant.id);
      if (dbAlergenos) setRegistrosAlergenos(dbAlergenos);

      const dbMan = await fetchManipuladoresFromDb(activeTenant.id);
      if (dbMan) setManipuladores(dbMan);

      const dbMed = await fetchMedicionesFromDb(activeTenant.id);
      if (dbMed) setMedicionesVariables(dbMed);
    }

    syncFromSupabase();
  }, [activeTenant.id]);

  useEffect(() => {
    localStorage.setItem('OCA-active-tenant-v1', JSON.stringify(activeTenant));
  }, [activeTenant]);

  useEffect(() => {
    localStorage.setItem('OCA-procedimientos-v5', JSON.stringify(procedimientos));
  }, [procedimientos]);

  useEffect(() => {
    localStorage.setItem('OCA-saneamiento-v4', JSON.stringify(registrosSaneamiento));
  }, [registrosSaneamiento]);

  useEffect(() => {
    localStorage.setItem('OCA-variables-v4', JSON.stringify(medicionesVariables));
  }, [medicionesVariables]);

  useEffect(() => {
    localStorage.setItem('OCA-manipuladores-v4', JSON.stringify(manipuladores));
  }, [manipuladores]);

  useEffect(() => {
    localStorage.setItem('OCA-capa-v4', JSON.stringify(accionesCapa));
  }, [accionesCapa]);

  useEffect(() => {
    localStorage.setItem('OCA-alergenos-v4', JSON.stringify(registrosAlergenos));
  }, [registrosAlergenos]);

  // Manejo del tema (Modo Claro / Modo Oscuro)
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('OCA-theme-v4', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCrearTenant = async (e) => {
    e.preventDefault();
    if (!nuevoTenantNombre.trim()) return;

    const nuevo = {
      id: `tenant-${Date.now()}`,
      nombre: nuevoTenantNombre.trim(),
      nit: nuevoTenantNit.trim() || 'Sin NIT',
      plan: nuevoTenantPlan,
      activo: true
    };

    setTenants(prev => [...prev, nuevo]);
    setActiveTenant(nuevo);
    saveTenantToDb(nuevo);
    setNuevoTenantNombre('');
    setNuevoTenantNit('');
    setMostrarCrearTenant(false);
  };

  // Agregar registros y autogenerar Tickets CAPA ante fallas o alertas
  const handleAgregarSaneamiento = async (nuevoRegistro) => {
    const id = Date.now();
    setRegistrosSaneamiento(prev => [...prev, { id, ...nuevoRegistro }]);
    saveSaneamientoToDb(nuevoRegistro, activeTenant.id);

    if (!nuevoRegistro.conforme) {
      const nuevaCapa = {
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
      };
      setAccionesCapa(prev => [...prev, nuevaCapa]);
    }
  };

  const handleAgregarVariable = async (nuevaMedicion) => {
    const id = Date.now();
    setMedicionesVariables(prev => [...prev, { id, ...nuevaMedicion }]);
    saveMedicionToDb(nuevaMedicion, activeTenant.id);

    if (nuevaMedicion.estado === 'Alerta') {
      const nuevaCapa = {
        id: Date.now() + 20,
        origen: 'Variables Críticas',
        fecha: nuevaMedicion.fecha,
        hora: nuevaMedicion.hora,
        hallazgo: `Desviación en ${nuevaMedicion.punto}: Valor registrado de ${nuevaMedicion.temperatura}°C. Comentario: ${nuevaMedicion.comentario}`,
        responsable: nuevaMedicion.supervisor,
        estado: 'Abierto',
        causaRaiz: '',
        planAccion: '',
        fechaCierre: '',
        supervisorCierre: ''
      };
      setAccionesCapa(prev => [...prev, nuevaCapa]);
    }
  };

  const handleResolverCapa = async (id, resolucion) => {
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

    updateCapaInDb(id, {
      causaRaiz: resolucion.causaRaiz,
      planAccion: resolucion.planAccion,
      responsable: resolucion.supervisorCierre,
      estado: 'Cerrado',
      fechaCierre: new Date().toISOString().split('T')[0]
    });
  };

  const handleAgregarAlergeno = async (nuevoAlergeno) => {
    setRegistrosAlergenos(prev => [
      ...prev,
      { id: Date.now(), ...nuevoAlergeno }
    ]);
    saveAlergenoToDb(nuevoAlergeno, activeTenant.id);
  };

  const handleAgregarManipulador = async (nuevoMan) => {
    setManipuladores(prev => [...prev, { id: Date.now(), ...nuevoMan }]);
    saveManipuladorToDb(nuevoMan, activeTenant.id);
  };

  const handleAgregarProcedimiento = async (nuevoProc) => {
    const item = {
      id: Date.now(),
      fechaAprobacion: new Date().toISOString().split('T')[0],
      ...nuevoProc
    };
    setProcedimientos(prev => [...prev, item]);
    saveProcedimientoToDb(item, activeTenant.id);
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
      {/* Sidebar de Navegación */}
      <aside className="gipa-sidebar d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: '280px' }}>
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <div className="icon-badge icon-badge-emerald me-2" style={{ width: '36px', height: '36px' }}>
            <i className="bi bi-shield-check fs-5"></i>
          </div>
          <span className="fs-4 fw-bold tracking-tight">OCA <span className="text-success fw-normal">ONE</span></span>
        </div>
        <hr className="bg-secondary opacity-25" />
        
        <ul className="nav nav-pills flex-column mb-auto">
          {/* Procedimientos y Archivos (DE PRIMERO) */}
          <li className="nav-item mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex justify-content-between align-items-center ${currentView === 'procedimientos' ? 'active' : 'text-white'}`}
              onClick={() => {
                setCurrentView('procedimientos');
                setIsProcedimientosOpen(!isProcedimientosOpen);
              }}
            >
              <span className="d-flex align-items-center">
                <div className="icon-badge icon-badge-cyan me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                  <i className="bi bi-folder2-open"></i>
                </div>
                Procedimientos y Archivos
              </span>
              <i className={`bi bi-chevron-down arrow-rotate ${isProcedimientosOpen ? 'rotated' : ''}`} style={{ fontSize: '12px' }}></i>
            </button>
            
            {/* Nivel 2: Categorías Desplegables */}
            {isProcedimientosOpen && (
              <ul className="sidebar-submenu">
                {[
                  { name: 'Limpieza y Desinfección', icon: 'bi-droplet-fill', badgeStyle: 'icon-badge-sky' },
                  { name: 'Control de Plagas', icon: 'bi-bug-fill', badgeStyle: 'icon-badge-amber' },
                  { name: 'Residuos Sólidos y Líquidos', icon: 'bi-trash-fill', badgeStyle: 'icon-badge-emerald' },
                  { name: 'Agua Potable', icon: 'bi-water', badgeStyle: 'icon-badge-indigo' }
                ].map(cat => {
                  const isCatExpanded = expandedCategories[cat.name];
                  return (
                    <li key={cat.name} className="mb-1">
                      <button 
                        className={`nav-link-sub w-100 btn border-0 text-start d-flex justify-content-between align-items-center ${currentView === 'procedimientos' && activeCategory === cat.name ? 'fw-bold' : ''}`}
                        onClick={() => {
                          setCurrentView('procedimientos');
                          setActiveCategory(cat.name);
                          setExpandedCategories(prev => ({
                            ...prev,
                            [cat.name]: !prev[cat.name]
                          }));
                        }}
                      >
                        <span className="d-flex align-items-center">
                          <div className={`icon-badge ${cat.badgeStyle} me-2`} style={{ width: '22px', height: '22px', fontSize: '11px' }}>
                            <i className={`bi ${cat.icon}`}></i>
                          </div>
                          {cat.name}
                        </span>
                        <i className={`bi bi-chevron-down arrow-rotate ${isCatExpanded ? 'rotated' : ''}`} style={{ fontSize: '10px' }}></i>
                      </button>
                      
                      {/* Nivel 3: Sub-submenú (Sólo la subcategoría Procedimiento) */}
                      {isCatExpanded && (
                        <ul className="sidebar-sub-submenu">
                          <li>
                            <button
                              className={`nav-link-sub-sub w-100 btn border-0 text-start d-flex align-items-center ${currentView === 'procedimientos' && activeCategory === cat.name ? 'active-sub-sub' : 'text-white'}`}
                              onClick={() => {
                                setCurrentView('procedimientos');
                                setActiveCategory(cat.name);
                              }}
                            >
                              <i className="bi bi-file-earmark-pdf me-2 text-danger"></i> Procedimiento
                            </button>
                          </li>
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'dashboard' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <div className="icon-badge icon-badge-cyan me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                <i className="bi bi-grid-1x2-fill"></i>
              </div>
              Dashboard
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'saneamiento' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('saneamiento')}
            >
              <div className="icon-badge icon-badge-emerald me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                <i className="bi bi-droplet-half"></i>
              </div>
              Saneamiento e Higiene
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'variables' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('variables')}
            >
              <div className="icon-badge icon-badge-indigo me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                <i className="bi bi-sliders"></i>
              </div>
              Variables Críticas
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex align-items-center justify-content-between ${currentView === 'capa' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('capa')}
            >
              <span className="d-flex align-items-center">
                <div className="icon-badge icon-badge-rose me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                  <i className="bi bi-patch-exclamation-fill"></i>
                </div>
                Acciones CAPA
              </span>
              {accionesCapa.filter(c => c.estado === 'Abierto').length > 0 && (
                <span className="badge bg-danger ms-2">
                  {accionesCapa.filter(c => c.estado === 'Abierto').length}
                </span>
              )}
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'trazabilidad' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('trazabilidad')}
            >
              <div className="icon-badge icon-badge-amber me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                <i className="bi bi-diagram-3-fill"></i>
              </div>
              Trazabilidad de Lotes
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'alergenos-recall' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('alergenos-recall')}
            >
              <div className="icon-badge icon-badge-rose me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              Alérgenos y Retiros
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'capacitaciones' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('capacitaciones')}
            >
              <div className="icon-badge icon-badge-sky me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                <i className="bi bi-person-badge-fill"></i>
              </div>
              Manipuladores y BPM
            </button>
          </li>
        </ul>
        <hr className="bg-secondary opacity-25" />
        <div className="text-secondary small">
          <p className="mb-1 fw-bold text-white"><i className="bi bi-building me-1 text-success"></i> {activeTenant.nombre}</p>
          <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>NIT: {activeTenant.nit} | {activeTenant.plan}</p>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-grow-1 min-vh-100 d-flex flex-column" style={{ overflowY: 'auto' }}>
        {/* Cabecera */}
        <header className="navbar navbar-expand-lg border-bottom px-4 py-3 bg-body-tertiary sticky-top">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-0 text-capitalize font-heading">
              {currentView === 'procedimientos' && 'Control Documental de Saneamiento y Calidad'}
              {currentView === 'dashboard' && 'Dashboard de Calidad e Inocuidad'}
              {currentView === 'saneamiento' && 'Plan de Saneamiento e Higiene'}
              {currentView === 'variables' && 'Monitoreo de Variables Críticas (PCC)'}
              {currentView === 'capa' && 'Gestión de Acciones Correctivas (CAPA)'}
              {currentView === 'trazabilidad' && 'Trazabilidad de Lotes'}
              {currentView === 'alergenos-recall' && 'Control de Alérgenos y Simulador de Retiro'}
              {currentView === 'capacitaciones' && 'Control de Manipuladores y BPM'}
            </h1>
            
            <div className="d-flex align-items-center ms-auto">
              {/* Selector Multi-Tenant de Empresa */}
              <div className="dropdown me-3">
                <button 
                  className="btn btn-sm btn-outline-success dropdown-toggle d-flex align-items-center gap-2 px-3 py-2 fw-semibold" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ borderRadius: '10px' }}
                >
                  <i className="bi bi-building-fill text-success"></i>
                  <span>{activeTenant.nombre}</span>
                  <span className="badge bg-success-subtle text-success ms-1" style={{ fontSize: '10px' }}>{activeTenant.plan}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow p-2" style={{ width: '280px', borderRadius: '12px' }}>
                  <li className="dropdown-header fw-bold text-dark border-bottom pb-2">Seleccionar Inquilino / Empresa</li>
                  {tenants.map(t => (
                    <li key={t.id}>
                      <button 
                        className={`dropdown-item d-flex justify-content-between align-items-center py-2 rounded-2 ${activeTenant.id === t.id ? 'active fw-bold' : ''}`}
                        onClick={() => setActiveTenant(t)}
                      >
                        <div>
                          <div style={{ fontSize: '13px' }}>{t.nombre}</div>
                          <small className="text-muted" style={{ fontSize: '10px' }}>NIT: {t.nit}</small>
                        </div>
                        {activeTenant.id === t.id && <i className="bi bi-check-circle-fill ms-2"></i>}
                      </button>
                    </li>
                  ))}
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-success fw-semibold d-flex align-items-center gap-2 py-2"
                      onClick={() => setMostrarCrearTenant(true)}
                    >
                      <i className="bi bi-plus-circle"></i> Registrar Nueva Empresa (Inquilino)
                    </button>
                  </li>
                </ul>
              </div>

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

        {/* Vistas Dinámicas */}
        <div className="flex-grow-1 p-4 bg-light bg-opacity-10 fade-in-view">
          {currentView === 'procedimientos' && (
            <Procedimientos 
              procedimientos={procedimientos} 
              onAgregar={handleAgregarProcedimiento}
              saneamientoLogs={registrosSaneamiento}
              alergenosLogs={registrosAlergenos}
              carpetaActiva={activeCategory}
              setCarpetaActiva={setActiveCategory}
            />
          )}
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

        {/* Modal de Registro de Nueva Empresa / Inquilino */}
        {mostrarCrearTenant && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
                <div className="modal-header bg-success text-white border-0" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                  <h5 className="modal-title font-heading fw-bold">
                    <i className="bi bi-building-add me-2"></i>Registrar Nueva Empresa (Inquilino)
                  </h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarCrearTenant(false)}></button>
                </div>
                <form onSubmit={handleCrearTenant}>
                  <div className="modal-body p-4">
                    <p className="text-muted small mb-3">
                      Crea un espacio de trabajo aislado (Multi-Tenant) para un nuevo cliente o planta. Todas sus listas de control, POES y bitácoras estarán 100% segregados.
                    </p>
                    <div className="mb-3">
                      <label className="form-label fw-semibold small">Nombre de la Empresa o Planta</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej: Alimentos Procesados del Caribe S.A.S." 
                        value={nuevoTenantNombre}
                        onChange={(e) => setNuevoTenantNombre(e.target.value)}
                        required
                      />
                    </div>
                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label fw-semibold small">NIT / Identificación Fiscal</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Ej: 901.888.777-2" 
                          value={nuevoTenantNit}
                          onChange={(e) => setNuevoTenantNit(e.target.value)}
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label fw-semibold small">Plan Licenciado</label>
                        <select 
                          className="form-select" 
                          value={nuevoTenantPlan} 
                          onChange={(e) => setNuevoTenantPlan(e.target.value)}
                        >
                          <option value="Edición Profesional">Edición Profesional</option>
                          <option value="Plan Gold HACCP">Plan Gold HACCP</option>
                          <option value="Enterprise Multi-Planta">Enterprise Multi-Planta</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-top-0 p-3 bg-light" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setMostrarCrearTenant(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-success btn-sm px-3">
                      <i className="bi bi-check-circle me-1"></i> Crear Inquilino y Activar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer mt-auto py-3 border-top bg-body-tertiary">
          <div className="container-fluid px-4 d-flex justify-content-between align-items-center text-muted small">
            <span>&copy; 2026 OCA ONE. Multi-Tenant SaaS Engine - {activeTenant.nombre}.</span>
            <span>Seguridad Alimentaria: HACCP / ISO 22000 / BRCGS / IFS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
