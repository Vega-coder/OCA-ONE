import React from 'react';
import Dashboard from './components/Dashboard';
import Saneamiento from './components/Saneamiento';
import VariablesCriticas from './components/VariablesCriticas';
import Trazabilidad from './components/Trazabilidad';
import Capacitaciones from './components/Capacitaciones';
import Capa from './components/Capa';
import AllergenRecall from './components/AllergenRecall';
import Procedimientos from './components/Procedimientos';
import Mantenimiento from './components/Mantenimiento';
import Login from './components/Login';
import { useAppEngine } from './hooks/useAppContext';
import { ROLES_DEFINITIONS, isViewAllowedForRole } from './lib/permissions';

function App() {
  const {
    currentUser,
    usuariosDb,
    handleLogin,
    handleLogout,
    currentView,
    setCurrentView,
    theme,
    toggleTheme,
    userRole,
    setUserRole,
    rolesList,
    roleDefinition,
    isProcedimientosOpen,
    setIsProcedimientosOpen,
    activeCategory,
    setActiveCategory,
    expandedCategories,
    setExpandedCategories,
    tenants,
    activeTenant,
    setActiveTenant,
    departamentos,
    procedimientos,
    registrosSaneamiento,
    medicionesVariables,
    manipuladores,
    accionesCapa,
    registrosAlergenos,
    alertasActivas,
    mostrarCrearTenant,
    setMostrarCrearTenant,
    nuevoTenantNombre,
    setNuevoTenantNombre,
    nuevoTenantNit,
    setNuevoTenantNit,
    nuevoTenantPlan,
    setNuevoTenantPlan,
    handleCrearTenant,
    handleAgregarSaneamiento,
    handleAgregarVariable,
    handleResolverCapa,
    handleAgregarAlergeno,
    handleAgregarManipulador,
    handleAgregarProcedimiento
  } = useAppEngine();

  // Si no hay sesión activa, renderizar la pantalla de Login
  if (!currentUser) {
    return <Login onLogin={handleLogin} usuariosDemo={usuariosDb} />;
  }

  return (
    <div className="d-flex min-vh-100 bg-body font-sans">
      {/* Sidebar Lateral */}
      <aside className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white shadow-lg" style={{ width: '280px', minHeight: '100vh', zIndex: 1000 }}>
        {/* Brand Header */}
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-2 py-2">
          <div className="icon-badge icon-badge-teal me-2" style={{ width: '36px', height: '36px', fontSize: '18px' }}>
            <i className="bi bi-shield-check"></i>
          </div>
          <div>
            <span className="fs-4 font-heading fw-bold tracking-tight text-white d-block" style={{ lineHeight: '1.1' }}>OCA ONE</span>
            <small className="text-secondary" style={{ fontSize: '10.5px' }}>Plataforma SaaS de Inocuidad</small>
          </div>
        </div>

        <hr className="bg-secondary opacity-25" />
        
        <ul className="nav nav-pills flex-column mb-auto">
          {/* Módulo Control de Calidad */}
          {isViewAllowedForRole('procedimientos', userRole, rolesList) && (
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
                    <i className="bi bi-patch-check-fill"></i>
                  </div>
                  Control de Calidad
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
                        
                        {/* Nivel 3: Sub-submenú */}
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
          )}

          {/* Módulo Mantenimiento de Equipos */}
          {isViewAllowedForRole('mantenimiento', userRole, rolesList) && (
            <li className="mb-1">
              <button 
                className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'mantenimiento' ? 'active' : 'text-white'}`}
                onClick={() => setCurrentView('mantenimiento')}
              >
                <div className="icon-badge icon-badge-indigo me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                  <i className="bi bi-tools"></i>
                </div>
                Mantenimiento de Equipos
              </button>
            </li>
          )}

          {/* Módulo Dashboard */}
          {isViewAllowedForRole('dashboard', userRole, rolesList) && (
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
          )}

          {/* Módulo Saneamiento e Higiene */}
          {isViewAllowedForRole('saneamiento', userRole, rolesList) && (
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
          )}

          {/* Módulo Variables Críticas */}
          {isViewAllowedForRole('variables', userRole, rolesList) && (
            <li className="mb-1">
              <button 
                className={`nav-link text-start w-100 btn border-0 d-flex align-items-center ${currentView === 'variables' ? 'active' : 'text-white'}`}
                onClick={() => setCurrentView('variables')}
              >
                <div className="icon-badge icon-badge-indigo me-2" style={{ width: '28px', height: '28px', fontSize: '13px' }}>
                  <i className="bi bi-sliders"></i>
                </div>
                Variables Críticas (PCC)
              </button>
            </li>
          )}

          {/* Módulo Acciones CAPA */}
          {isViewAllowedForRole('capa', userRole, rolesList) && (
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
          )}

          {/* Módulo Trazabilidad */}
          {isViewAllowedForRole('trazabilidad', userRole, rolesList) && (
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
          )}

          {/* Módulo Alérgenos y Retiros */}
          {isViewAllowedForRole('alergenos-recall', userRole, rolesList) && (
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
          )}

          {/* Módulo Manipuladores y BPM */}
          {isViewAllowedForRole('capacitaciones', userRole, rolesList) && (
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
          )}
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
              {currentView === 'procedimientos' && 'Módulo de Control de Calidad - Procedimientos, POES y Archivos'}
              {currentView === 'mantenimiento' && 'Módulo de Mantenimiento Preventivo y Correctivo de Equipos'}
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

              {/* Selector de Rol del Usuario (RBAC) */}
              <div className="dropdown me-3">
                <button 
                  className={`btn btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 py-2 fw-semibold text-white ${roleDefinition.badgeClass}`} 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  style={{ borderRadius: '10px' }}
                  title="Cambiar rol para simular permisos"
                >
                  <i className={`bi ${roleDefinition.icon}`}></i>
                  <span>{roleDefinition.nombre}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow p-2" style={{ width: '310px', borderRadius: '12px' }}>
                  <li className="dropdown-header fw-bold text-dark border-bottom pb-2">Seleccionar Rol del Usuario (RBAC)</li>
                  {rolesList.map(r => (
                    <li key={r.id}>
                      <button 
                        className={`dropdown-item d-flex align-items-start gap-2 py-2 rounded-2 ${userRole === r.id ? 'active fw-bold' : ''}`}
                        onClick={() => {
                          setUserRole(r.id);
                          localStorage.setItem('OCA-user-role-v1', r.id);
                        }}
                      >
                        <i className={`bi ${r.icon} mt-1`}></i>
                        <div>
                          <div style={{ fontSize: '13px' }}>{r.nombre}</div>
                          <small className="text-muted d-block" style={{ fontSize: '10.5px', whiteSpace: 'normal', lineHeight: '1.2' }}>{r.descripcion}</small>
                        </div>
                      </button>
                    </li>
                  ))}
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
                  <li className="dropdown-header fw-bold text-dark border-bottom pb-2">
                    Notificaciones de Calidad ({alertasActivas.length})
                  </li>
                  {alertasActivas.length === 0 ? (
                    <li className="p-3 text-center text-muted small">No hay alertas críticas en este momento.</li>
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

              {/* Perfil del Usuario Autenticado */}
              <div className="dropdown border-start ps-3">
                <button 
                  className="btn border-0 p-0 d-flex align-items-center dropdown-toggle text-start" 
                  type="button" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <div className="text-end me-2 d-none d-md-block">
                    <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>{currentUser.nombre}</div>
                    <div className="text-muted" style={{ fontSize: '11.5px' }}>{currentUser.cargo || roleDefinition.nombre}</div>
                  </div>
                  <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px', fontSize: '14px' }}>
                    {currentUser.nombre ? currentUser.nombre.split(' ').map(n => n[0]).join('').substring(0, 2) : 'US'}
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow p-2" style={{ width: '260px', borderRadius: '12px' }}>
                  <li className="dropdown-header border-bottom pb-2">
                    <div className="fw-bold text-dark">{currentUser.nombre}</div>
                    <small className="text-muted">{currentUser.email}</small>
                  </li>
                  <li className="pt-2">
                    <span className={`badge ${roleDefinition.badgeClass} w-100 py-1.5`} style={{ fontSize: '11px' }}>
                      <i className={`bi ${roleDefinition.icon} me-1`}></i> Rol: {roleDefinition.nombre}
                    </span>
                  </li>
                  <li><hr className="dropdown-divider my-2" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger fw-semibold d-flex align-items-center gap-2 py-2 rounded-2"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                    </button>
                  </li>
                </ul>
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
              tenantId={activeTenant.id}
              userRole={userRole}
            />
          )}
          {currentView === 'mantenimiento' && (
            <Mantenimiento 
              tenantId={activeTenant.id} 
              userRole={userRole} 
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
              departamentos={departamentos}
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
            <span>&copy; 2026 OCA ONE. Clean Architecture Engine - {activeTenant.nombre}.</span>
            <span>Seguridad Alimentaria: HACCP / ISO 22000 / BRCGS / IFS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
