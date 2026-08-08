// ============================================================
// ENTIDADES DE DOMINIO (CLEAN ARCHITECTURE) - OCA ONE
// ============================================================

export function createTenantEntity(data) {
  return {
    id: data.id || `tenant-${Date.now()}`,
    industriaId: data.industria_id || data.industriaId || 'ind-lacteos',
    nombre: data.nombre || 'Empresa Inquilino',
    nit: data.nit || 'Sin NIT',
    pais: data.pais || 'Colombia',
    ciudad: data.ciudad || 'Bogotá D.C.',
    direccion: data.direccion || '',
    plan: data.plan || 'Edición Profesional',
    activo: data.activo !== undefined ? data.activo : true
  };
}

export function createProcedureEntity(data) {
  return {
    id: data.id || Date.now(),
    tenantId: data.tenant_id || data.tenantId || 'tenant-opt-01',
    tiendaId: data.tienda_id || data.tiendaId || null,
    departamentoId: data.departamento_id || data.departamentoId || null,
    codigo: data.codigo || 'POES-GEN-001',
    titulo: data.titulo || 'Procedimiento Operativo Estandarizado',
    categoria: data.categoria || 'Limpieza y Desinfección',
    version: data.version || '1.0.0',
    fechaAprobacion: data.fecha_aprobacion || data.fechaAprobacion || new Date().toISOString().split('T')[0],
    responsable: data.responsable || 'Carlos Gómez',
    aprobado: data.aprobado || 'Carlos Gómez',
    objetivo: data.objetivo || '',
    alcance: data.alcance || '',
    responsablesDoc: data.responsables_doc || data.responsablesDoc || '',
    definiciones: data.definiciones || '',
    desarrollo: data.desarrollo || '',
    registrosControl: data.registros_control || data.registrosControl || [],
    controlCambios: data.control_cambios || data.controlCambios || []
  };
}

export function createSanitationRecordEntity(data) {
  return {
    id: data.id || Date.now(),
    tenantId: data.tenant_id || data.tenantId || 'tenant-opt-01',
    fecha: data.fecha || new Date().toISOString().split('T')[0],
    hora: data.hora || new Date().toTimeString().split(' ')[0].substring(0, 5),
    area: data.area || 'Cuarto Frío 1',
    tipo: data.tipo || 'Rutinaria',
    producto: data.producto || 'Cloro 200ppm',
    supervisor: data.supervisor || 'Carlos Gómez',
    conforme: data.conforme !== undefined ? data.conforme : true,
    observacion: data.observacion || 'Sin observaciones'
  };
}
