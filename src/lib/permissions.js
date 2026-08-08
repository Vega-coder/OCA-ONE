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
    allowedViews: ['procedimientos', 'dashboard', 'saneamiento', 'variables', 'capa', 'trazabilidad', 'alergenos-recall', 'capacitaciones']
  },
  {
    id: 'control-calidad',
    nombre: 'Control de Calidad',
    badgeClass: 'bg-info text-dark',
    icon: 'bi-patch-check-fill',
    descripcion: 'Consultar control de calidad, diligenciar formatos y consultar fichas técnicas / MSDS (Sin descarga de procedimientos).',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: true,
    allowedViews: ['procedimientos', 'dashboard', 'saneamiento', 'capa', 'alergenos-recall']
  },
  {
    id: 'produccion',
    nombre: 'Producción',
    badgeClass: 'bg-success',
    icon: 'bi-gear-wide-connected',
    descripcion: 'Consultar manuales de producción y diligenciar formatos y cronogramas de producción (Sin descarga de procedimientos).',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: false,
    allowedViews: ['variables', 'trazabilidad', 'dashboard']
  },
  {
    id: 'operativo',
    nombre: 'Operativo',
    badgeClass: 'bg-warning text-dark',
    icon: 'bi-person-badge-fill',
    descripcion: 'Consultar etapas de producción, diligenciar formatos de producción y descargar formatos en blanco (Sin edición).',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: false,
    canViewMSDS: false,
    allowedViews: ['variables', 'saneamiento', 'trazabilidad']
  },
  {
    id: 'mantenimiento',
    nombre: 'Mantenimiento',
    badgeClass: 'bg-indigo text-white',
    icon: 'bi-tools',
    descripcion: 'Consultar calibración/mantenimiento, fichas técnicas, diligenciar órdenes y cronogramas de mantenimiento.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: true,
    allowedViews: ['variables', 'capa', 'dashboard']
  },
  {
    id: 'logistica',
    nombre: 'Logística, Abastecimiento y Despachos',
    badgeClass: 'bg-secondary',
    icon: 'bi-truck',
    descripcion: 'Consultar logística, consultar/descargar órdenes de compra y diligenciar formatos de despacho.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: false,
    allowedViews: ['trazabilidad', 'alergenos-recall', 'dashboard']
  },
  {
    id: 'sg-sst',
    nombre: 'SG-SST',
    badgeClass: 'bg-danger',
    icon: 'bi-heart-pulse-fill',
    descripcion: 'Consultar SG-SST, diligenciar/descargar formatos y cronogramas de seguridad y salud en el trabajo.',
    canDownloadProcedures: false,
    canEditDocuments: false,
    canFillFormats: true,
    canEditFormats: false,
    canDownloadFormats: true,
    canViewFichasTecnicas: true,
    canViewMSDS: true,
    allowedViews: ['capacitaciones', 'dashboard']
  }
];

export function getRoleDefinition(roleId) {
  return ROLES_DEFINITIONS.find(r => r.id === roleId) || ROLES_DEFINITIONS[0];
}

export function canUserDownloadProcedure(roleId) {
  const role = getRoleDefinition(roleId);
  return role.canDownloadProcedures;
}

export function canUserEditDocument(roleId) {
  const role = getRoleDefinition(roleId);
  return role.canEditDocuments;
}

export function isViewAllowedForRole(viewId, roleId) {
  const role = getRoleDefinition(roleId);
  return role.allowedViews ? role.allowedViews.includes(viewId) : true;
}
