// ============================================================
// MOTOR DE ROLES Y PERMISOS DE ACCESO (RBAC) - OCA ONE
// ============================================================

export const ROLES_DEFINITIONS = [
  {
    id: 'super-admin',
    nombre: 'Super Administrador',
    badgeClass: 'bg-primary',
    icon: 'bi-shield-lock-fill',
    descripcion: 'Acceso total sin restricciones a todos los módulos. Administrador del programa.',
    canDownloadProcedures: true,
    canEditDocuments: true,
    canFillFormats: true,
    canEditFormats: true,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: true,
    allowedViews: ['procedimientos', 'mantenimiento', 'sg-sst', 'liberacion-lotes', 'recepcion-materias-primas', 'produccion-modulo', 'logistica-modulo', 'dashboard', 'saneamiento', 'variables', 'capa', 'trazabilidad', 'alergenos-recall', 'capacitaciones'],
    writeAccessModules: ['*']
  },
  {
    id: 'control-calidad',
    nombre: 'Control de Calidad',
    badgeClass: 'bg-info text-dark',
    icon: 'bi-patch-check-fill',
    descripcion: 'Gestión total de Control de Calidad y consulta (read-only) de los demás módulos de la planta.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: true,
    allowedViews: ['procedimientos', 'mantenimiento', 'sg-sst', 'liberacion-lotes', 'recepcion-materias-primas', 'produccion-modulo', 'logistica-modulo', 'dashboard', 'saneamiento', 'variables', 'capa', 'trazabilidad', 'alergenos-recall', 'capacitaciones'],
    writeAccessModules: ['procedimientos', 'saneamiento', 'capa', 'alergenos-recall', 'variables', 'capacitaciones']
  },
  {
    id: 'produccion',
    nombre: 'Producción',
    badgeClass: 'bg-success',
    icon: 'bi-gear-wide-connected',
    descripcion: 'Gestión total del Módulo de Producción (Liberación Lotes Q-PD-15) y consulta (read-only) de Calidad y Mantenimiento.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: false,
    allowedViews: ['procedimientos', 'mantenimiento', 'sg-sst', 'liberacion-lotes', 'recepcion-materias-primas', 'produccion-modulo', 'logistica-modulo', 'variables', 'trazabilidad', 'dashboard'],
    writeAccessModules: ['liberacion-lotes', 'produccion-modulo', 'variables', 'trazabilidad']
  },
  {
    id: 'mantenimiento',
    nombre: 'Mantenimiento',
    badgeClass: 'bg-indigo text-white',
    icon: 'bi-tools',
    descripcion: 'Gestión total del Módulo Mantenimiento Equipos (FOPME-002) y consulta (read-only) de Calidad y Producción.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: true,
    allowedViews: ['procedimientos', 'mantenimiento', 'sg-sst', 'liberacion-lotes', 'recepcion-materias-primas', 'produccion-modulo', 'logistica-modulo', 'variables', 'capa', 'dashboard'],
    writeAccessModules: ['mantenimiento']
  },
  {
    id: 'logistica',
    nombre: 'Logística, Abastecimiento y Despachos',
    badgeClass: 'bg-secondary',
    icon: 'bi-truck',
    descripcion: 'Gestión total del Módulo Logística (Recepción Primas Q-PD-13) y consulta (read-only) de Calidad y Producción.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: false,
    allowedViews: ['procedimientos', 'mantenimiento', 'sg-sst', 'liberacion-lotes', 'recepcion-materias-primas', 'produccion-modulo', 'logistica-modulo', 'trazabilidad', 'alergenos-recall', 'dashboard'],
    writeAccessModules: ['recepcion-materias-primas', 'logistica-modulo', 'trazabilidad']
  },
  {
    id: 'sg-sst',
    nombre: 'SG-SST',
    badgeClass: 'bg-danger',
    icon: 'bi-heart-pulse-fill',
    descripcion: 'Gestión total de Seguridad y Salud en el Trabajo (GTC 45) y consulta (read-only) de Calidad y Mantenimiento.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: true,
    allowedViews: ['procedimientos', 'mantenimiento', 'sg-sst', 'liberacion-lotes', 'recepcion-materias-primas', 'produccion-modulo', 'logistica-modulo', 'capacitaciones', 'dashboard'],
    writeAccessModules: ['sg-sst', 'capacitaciones']
  },
  {
    id: 'operativo',
    nombre: 'Operativo',
    badgeClass: 'bg-warning text-dark',
    icon: 'bi-person-badge-fill',
    descripcion: 'Diligenciamiento operativo y consulta (read-only) de procedimientos y manuales de planta.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: false,
    canViewMSDS: false,
    allowedViews: ['procedimientos', 'mantenimiento', 'sg-sst', 'liberacion-lotes', 'recepcion-materias-primas', 'produccion-modulo', 'logistica-modulo', 'variables', 'saneamiento', 'trazabilidad'],
    writeAccessModules: ['variables', 'saneamiento']
  }
];

export function getRoleDefinition(roleId, rolesList = null) {
  const source = rolesList && rolesList.length > 0 ? rolesList : ROLES_DEFINITIONS;
  return source.find(r => r.id === roleId) || source[0] || ROLES_DEFINITIONS[0];
}

export function canUserDownloadProcedure(roleId, rolesList = null) {
  const role = getRoleDefinition(roleId, rolesList);
  return role ? role.canDownloadProcedures : false;
}

export function canUserEditDocument(roleId, rolesList = null) {
  const role = getRoleDefinition(roleId, rolesList);
  return role ? role.canEditDocuments : false;
}

export function isViewAllowedForRole(viewId, roleId, rolesList = null) {
  const role = getRoleDefinition(roleId, rolesList);
  return role && role.allowedViews ? role.allowedViews.includes(viewId) : true;
}

export function canUserWriteInModule(roleId, moduleId, rolesList = null) {
  const role = getRoleDefinition(roleId, rolesList);
  if (!role) return false;
  if (role.id === 'super-admin') return true;
  if (!role.writeAccessModules) return false;
  return role.writeAccessModules.includes(moduleId) || role.writeAccessModules.includes('*');
}
