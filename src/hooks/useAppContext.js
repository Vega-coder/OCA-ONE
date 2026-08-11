import { useState, useEffect, useCallback } from 'react';
import {
  loadInitialCompanyData,
  executeAddSanitationRecord,
  executeAddCriticalVariableRecord,
  executeResolveCapaTicket,
  executeCreateNewTenant
} from '../application/useCases';
import {
  saveProcedimientoToDb,
  saveAlergenoToDb,
  saveManipuladorToDb,
  fetchRolesFromDb,
  fetchUsuariosFromDb
} from '../lib/dataService';
import { getRoleDefinition, ROLES_DEFINITIONS } from '../lib/permissions';

export function useAppEngine() {
  const [currentView, setCurrentView] = useState('procedimientos');
  const [theme, setTheme] = useState(() => localStorage.getItem('OCA-theme-v4') || 'light');
  
  // Usuario Autenticado Real
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('OCA-current-user-v1');
    return saved ? JSON.parse(saved) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    const savedUser = localStorage.getItem('OCA-current-user-v1');
    if (savedUser) {
      try { return JSON.parse(savedUser).rolId || 'super-admin'; } catch { return 'super-admin'; }
    }
    return localStorage.getItem('OCA-user-role-v1') || 'super-admin';
  });

  const [rolesList, setRolesList] = useState(ROLES_DEFINITIONS);
  const [usuariosDb, setUsuariosDb] = useState([]);
  const [isProcedimientosOpen, setIsProcedimientosOpen] = useState(true);
  const [isMantenimientoOpen, setIsMantenimientoOpen] = useState(true);
  const [isSstOpen, setIsSstOpen] = useState(true);
  const [isLiberacionLotesOpen, setIsLiberacionLotesOpen] = useState(true);
  const [isRecepcionMateriasPrimasOpen, setIsRecepcionMateriasPrimasOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Limpieza y Desinfección');
  const [expandedCategories, setExpandedCategories] = useState({
    'Limpieza y Desinfección': true,
    'Control de Plagas': false,
    'Residuos Sólidos y Líquidos': false,
    'Agua Potable': false,
    'Equipos de Producción': true,
    'Servicios Auxiliares': false,
    'Frío y Ventilación': false
  });

  // Cargar Roles y Usuarios dinámicos desde Supabase DB
  useEffect(() => {
    async function loadDbAuth() {
      const [dbRoles, dbUsers] = await Promise.all([
        fetchRolesFromDb(),
        fetchUsuariosFromDb()
      ]);
      if (dbRoles && dbRoles.length > 0) setRolesList(dbRoles);
      if (dbUsers && dbUsers.length > 0) setUsuariosDb(dbUsers);
    }
    loadDbAuth();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserRole(user.rolId || 'super-admin');
    localStorage.setItem('OCA-current-user-v1', JSON.stringify(user));
    localStorage.setItem('OCA-user-role-v1', user.rolId || 'super-admin');
    
    // Asignar empresa si el usuario pertenece a un tenant específico
    if (user.tenantId) {
      const matchingTenant = tenants.find(t => t.id === user.tenantId);
      if (matchingTenant) setActiveTenant(matchingTenant);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('OCA-current-user-v1');
  };

  // Estado Multi-Tenant
  const [industrias, setIndustrias] = useState([]);
  const [tenants, setTenants] = useState([
    { id: 'tenant-opt-01', nombre: 'Optimus Latinoamérica', nit: '900.123.456-7', plan: 'Edición Profesional', industriaId: 'ind-lacteos' },
    { id: 'tenant-lacteos-02', nombre: 'Lácteos del Valle S.A.S.', nit: '800.987.654-1', plan: 'Plan Gold HACCP', industriaId: 'ind-lacteos' },
    { id: 'tenant-carnes-03', nombre: 'Frigoríficos y Procesados Norte', nit: '901.456.789-3', plan: 'Enterprise', industriaId: 'ind-carnicos' }
  ]);
  const [activeTenant, setActiveTenant] = useState(() => {
    const saved = localStorage.getItem('OCA-active-tenant-v1');
    return saved ? JSON.parse(saved) : { id: 'tenant-opt-01', nombre: 'Optimus Latinoamérica', nit: '900.123.456-7', plan: 'Edición Profesional', industriaId: 'ind-lacteos' };
  });

  const [tiendas, setTiendas] = useState([]);
  const [activeTienda, setActiveTienda] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);

  // Entidades principales
  const [procedimientos, setProcedimientos] = useState([]);
  const [registrosSaneamiento, setRegistrosSaneamiento] = useState([]);
  const [medicionesVariables, setMedicionesVariables] = useState([]);
  const [manipuladores, setManipuladores] = useState([]);
  const [accionesCapa, setAccionesCapa] = useState([]);
  const [registrosAlergenos, setRegistrosAlergenos] = useState([]);

  const [mostrarCrearTenant, setMostrarCrearTenant] = useState(false);
  const [nuevoTenantNombre, setNuevoTenantNombre] = useState('');
  const [nuevoTenantNit, setNuevoTenantNit] = useState('');
  const [nuevoTenantPlan, setNuevoTenantPlan] = useState('Edición Profesional');

  // Redirección de vista si la vista actual no está permitida para el rol seleccionado
  useEffect(() => {
    const roleDef = getRoleDefinition(userRole, rolesList);
    if (roleDef && roleDef.allowedViews && !roleDef.allowedViews.includes(currentView)) {
      setCurrentView(roleDef.allowedViews[0] || 'procedimientos');
    }
  }, [userRole, currentView, rolesList]);

  // Sincronización limpia desde el Caso de Uso de Aplicación
  const syncCompanyData = useCallback(async () => {
    const data = await loadInitialCompanyData(activeTenant.id);
    if (data.industrias.length > 0) setIndustrias(data.industrias);
    if (data.tenants.length > 0) setTenants(data.tenants);
    if (data.tiendas.length > 0) {
      setTiendas(data.tiendas);
      setActiveTienda(data.tiendas[0]);
    }
    if (data.departamentos.length > 0) setDepartamentos(data.departamentos);
    if (data.procedimientos) setProcedimientos(data.procedimientos);
    if (data.saneamiento) setRegistrosSaneamiento(data.saneamiento);
    if (data.accionesCapa) setAccionesCapa(data.accionesCapa);
    if (data.alergenos) setRegistrosAlergenos(data.alergenos);
    if (data.manipuladores) setManipuladores(data.manipuladores);
    if (data.mediciones) setMedicionesVariables(data.mediciones);
  }, [activeTenant.id]);

  useEffect(() => {
    syncCompanyData();
  }, [syncCompanyData]);

  // Persistencia de configuraciones
  useEffect(() => {
    localStorage.setItem('OCA-active-tenant-v1', JSON.stringify(activeTenant));
  }, [activeTenant]);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('OCA-theme-v4', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

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
    executeCreateNewTenant(nuevo);
    setNuevoTenantNombre('');
    setNuevoTenantNit('');
    setMostrarCrearTenant(false);
  };

  const handleAgregarSaneamiento = async (nuevoRegistro) => {
    const { autoCapa } = await executeAddSanitationRecord(nuevoRegistro, activeTenant.id);
    setRegistrosSaneamiento(prev => [...prev, { id: Date.now(), ...nuevoRegistro }]);
    if (autoCapa) setAccionesCapa(prev => [...prev, autoCapa]);
  };

  const handleAgregarVariable = async (nuevaMedicion) => {
    const { autoCapa } = await executeAddCriticalVariableRecord(nuevaMedicion, activeTenant.id);
    setMedicionesVariables(prev => [...prev, { id: Date.now(), ...nuevaMedicion }]);
    if (autoCapa) setAccionesCapa(prev => [...prev, autoCapa]);
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

    executeResolveCapaTicket(id, {
      causaRaiz: resolucion.causaRaiz,
      planAccion: resolucion.planAccion,
      responsable: resolucion.supervisorCierre,
      estado: 'Cerrado',
      fechaCierre: new Date().toISOString().split('T')[0]
    });
  };

  const handleAgregarAlergeno = async (nuevoAlergeno) => {
    setRegistrosAlergenos(prev => [...prev, { id: Date.now(), ...nuevoAlergeno }]);
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

  const alertasActivas = [
    ...registrosSaneamiento.filter(r => !r.conforme).map(r => ({
      id: `san-${r.id}`,
      tipo: 'Saneamiento Fallido',
      mensaje: `Inspección No Conforme en ${r.area}: ${r.observacion}`,
      fecha: `${r.fecha} ${r.hora}`
    })),
    ...medicionesVariables.filter(v => v.estado === 'Alerta').map(v => ({
      id: `var-${v.id}`,
      tipo: 'Desviación de Límite Crítico',
      mensaje: `Alerta en ${v.punto}: ${v.temperatura}°C`,
      fecha: `${v.fecha} ${v.hora}`
    })),
    ...accionesCapa.filter(c => c.estado === 'Abierto').map(c => ({
      id: `capa-${c.id}`,
      tipo: 'Acción CAPA Pendiente',
      mensaje: `${c.origen}: ${c.hallazgo}`,
      fecha: c.fecha
    }))
  ];

  return {
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
    roleDefinition: getRoleDefinition(userRole, rolesList),
    isProcedimientosOpen,
    setIsProcedimientosOpen,
    isMantenimientoOpen,
    setIsMantenimientoOpen,
    isSstOpen,
    setIsSstOpen,
    isLiberacionLotesOpen,
    setIsLiberacionLotesOpen,
    isRecepcionMateriasPrimasOpen,
    setIsRecepcionMateriasPrimasOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    activeCategory,
    setActiveCategory,
    expandedCategories,
    setExpandedCategories,
    tenants,
    activeTenant,
    setActiveTenant,
    tiendas,
    activeTienda,
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
  };
}
