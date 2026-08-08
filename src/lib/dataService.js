import { supabase } from './supabaseClient';

// ============================================================
// SERVICIO DE DATOS MULTI-TENANT (EMPRESA, SUCURSAL/TIENDA, DEPARTAMENTO E INDUSTRIA)
// ============================================================

// --- 0. CATÁLOGO DE INDUSTRIAS ---
export async function fetchIndustriasFromDb() {
  try {
    const { data, error } = await supabase
      .from('industrias')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.warn('Supabase fetchIndustrias warning:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error('Error fetching industrias:', err);
    return null;
  }
}

// --- 1. GESTIÓN DE EMPRESAS / TENANTS ---
export async function fetchTenantsFromDb() {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*, industrias(nombre)')
      .order('nombre', { ascending: true });

    if (error) {
      console.warn('Supabase fetchTenants warning:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error('Error fetching tenants:', err);
    return null;
  }
}

export async function saveTenantToDb(tenant) {
  try {
    const payload = {
      id: tenant.id || `tenant-${Date.now()}`,
      industria_id: tenant.industriaId || 'ind-lacteos',
      nombre: tenant.nombre,
      nit: tenant.nit || 'Sin NIT',
      ciudad: tenant.ciudad || 'Bogotá D.C.',
      plan: tenant.plan || 'Edición Profesional',
      activo: true
    };

    const { data, error } = await supabase
      .from('tenants')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveTenant warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving tenant:', err);
    return null;
  }
}

// --- 2. GESTIÓN DE TIENDAS / PLANTAS / SUCURSALES ---
export async function fetchTiendasFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('tiendas')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('nombre', { ascending: true });

    if (error) {
      console.warn('Supabase fetchTiendas warning:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error('Error fetching tiendas:', err);
    return null;
  }
}

export async function saveTiendaToDb(tienda, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      id: tienda.id || `store-${Date.now()}`,
      tenant_id: tenantId,
      nombre: tienda.nombre,
      codigo_tienda: tienda.codigoTienda || 'PLT-01',
      ciudad: tienda.ciudad || 'Bogotá D.C.',
      direccion: tienda.direccion || ''
    };

    const { data, error } = await supabase
      .from('tiendas')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveTienda warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving tienda:', err);
    return null;
  }
}

// --- 3. GESTIÓN DE DEPARTAMENTOS / ÁREAS ---
export async function fetchDepartamentosFromDb(tenantId = 'tenant-opt-01', tiendaId = null) {
  try {
    let query = supabase.from('departamentos').select('*').eq('tenant_id', tenantId);
    if (tiendaId) query = query.eq('tienda_id', tiendaId);

    const { data, error } = await query.order('nombre', { ascending: true });

    if (error) {
      console.warn('Supabase fetchDepartamentos warning:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error('Error fetching departamentos:', err);
    return null;
  }
}

export async function saveDepartamentoToDb(dep, tenantId = 'tenant-opt-01', tiendaId = 'store-opt-main') {
  try {
    const payload = {
      id: dep.id || `dep-${Date.now()}`,
      tenant_id: tenantId,
      tienda_id: tiendaId,
      nombre: dep.nombre,
      descripcion: dep.descripcion || ''
    };

    const { data, error } = await supabase
      .from('departamentos')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveDepartamento warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving departamento:', err);
    return null;
  }
}

// --- 4. PROCEDIMIENTOS (Filtrado por tenant_id) ---
export async function fetchProcedimientosFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('procedimientos')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetchProcedimientos warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        tiendaId: item.tienda_id,
        departamentoId: item.departamento_id,
        codigo: item.codigo,
        titulo: item.titulo,
        categoria: item.categoria,
        version: item.version,
        fechaAprobacion: item.fecha_aprobacion,
        responsable: item.responsable,
        aprobado: item.aprobado,
        objetivo: item.objetivo,
        alcance: item.alcance,
        responsablesDoc: item.responsables_doc,
        definiciones: item.definiciones,
        desarrollo: item.desarrollo,
        registrosControl: item.registros_control || [],
        controlCambios: item.control_cambios || []
      }));
    }
    
    // Retornar base oficial POES por defecto para que cualquier inquilino tenga sus manuales
    return [
      {
        id: 1,
        tenantId,
        codigo: 'POES-PLG-001',
        titulo: 'Procedimiento Operativo de Control de Plagas',
        categoria: 'Control de Plagas',
        version: '2.0.0',
        fechaAprobacion: '2026-01-10',
        responsable: 'Carlos Gómez',
        aprobado: 'Carlos Gómez',
        objetivo: 'Establecer las medidas preventivas y correctivas necesarias para evitar la proliferación de insectos, roedores y otras plagas en la planta de proceso.',
        alcance: 'Aplica a todas las áreas internas, externas, almacenes de materia prima y producto terminado.',
        responsablesDoc: 'Empresa subcontratista de control de vectores y el supervisor de calidad.',
        definiciones: 'Vector: Animal que puede transmitir enfermedades o contaminar alimentos.',
        desarrollo: '1. INSPECCIÓN:\n- El supervisor revisará semanalmente los 15 cebaderos numerados.',
        registrosControl: [
          { nombre: 'Planilla de Monitoreo de Estaciones de Cebado', codigo: 'F-PLG-01', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Enero 2026 Version 2.0.0', descripcion: 'Actualización general de cebaderos externos', responsable: 'Carlos Gómez' }
        ]
      },
      {
        id: 2,
        tenantId,
        codigo: 'POES-RES-002',
        titulo: 'Manual de Gestión de Residuos Sólidos y Líquidos',
        categoria: 'Residuos Sólidos y Líquidos',
        version: '1.2.0',
        fechaAprobacion: '2026-03-15',
        responsable: 'Carlos Gómez',
        aprobado: 'Carlos Gómez',
        objetivo: 'Normar el correcto manejo, separación en la fuente y disposición final de los residuos generados.',
        alcance: 'Aplica a todas las áreas operativas, bodegas y zona de efluentes.',
        responsablesDoc: 'Auxiliares de almacén, personal de limpieza y dirección ambiental.',
        definiciones: 'Residuo Orgánico: Resto biodegradable de origen vegetal o animal.',
        desarrollo: '1. CLASIFICACIÓN:\n- Orgánicos: Canecas Verdes.\n- Plásticos: Canecas Grises.',
        registrosControl: [
          { nombre: 'Bitácora Diaria de Retiro de Residuos', codigo: 'F-RES-01', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Marzo 2026 Version 1.2.0', descripcion: 'Inclusión de entrega de aceites quemados', responsable: 'Carlos Gómez' }
        ]
      },
      {
        id: 3,
        tenantId,
        codigo: 'POES-LIM-003',
        titulo: 'Plan Maestro de Limpieza y Desinfección',
        categoria: 'Limpieza y Desinfección',
        version: '3.1.0',
        fechaAprobacion: '2026-05-20',
        responsable: 'Carlos Gómez',
        aprobado: 'Carlos Gómez',
        objetivo: 'Garantizar que todos los equipos, utensilios e infraestructura estén limpios y desinfectados.',
        alcance: 'Aplica a todas las salas de proceso, envasado A y B.',
        responsablesDoc: 'Operarios de limpieza y supervisores.',
        definiciones: 'Sanitización: Reducción del número de microorganismos a un nivel seguro.',
        desarrollo: '1. DOSIFICACIONES PERMITIDAS:\n- Cloro: 200 ppm para superficies de contacto directo.',
        registrosControl: [
          { nombre: 'Registro de Inspección Diaria de L&D', codigo: 'Q-FR-18', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Mayo 2026 Version 3.1.0', descripcion: 'Actualización de dosificación de cloro a 200ppm', responsable: 'Carlos Gómez' }
        ]
      },
      {
        id: 4,
        tenantId,
        codigo: 'POES-AGU-004',
        titulo: 'Procedimiento de Control y Potabilidad de Agua',
        categoria: 'Agua Potable',
        version: '1.0.0',
        fechaAprobacion: '2026-02-05',
        responsable: 'Carlos Gómez',
        aprobado: 'Carlos Gómez',
        objetivo: 'Asegurar que el agua utilizada sea apta para consumo humano.',
        alcance: 'Aplica a toda la red interna de agua potable.',
        responsablesDoc: 'Supervisor de laboratorio y mantenimiento.',
        definiciones: 'Cloro Libre Residual: Cantidad de cloro activo en agua.',
        desarrollo: '1. MONITOREO DIARIO: Medir cloro libre (0.3 a 2.0 ppm) y pH (6.5 a 8.5).',
        registrosControl: [
          { nombre: 'Planilla Diaria de Cloro y pH', codigo: 'F-AGU-01', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Febrero 2026 Version 1.0.0', descripcion: 'Creación del documento', responsable: 'Carlos Gómez' }
        ]
      }
    ];
  } catch (err) {
    console.error('Error fetching procedimientos:', err);
    return null;
  }
}

export async function saveProcedimientoToDb(proc, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      tenant_id: tenantId,
      codigo: proc.codigo,
      titulo: proc.titulo,
      categoria: proc.categoria,
      version: proc.version || '1.0.0',
      fecha_aprobacion: proc.fechaAprobacion || new Date().toISOString().split('T')[0],
      responsable: proc.responsable,
      aprobado: proc.aprobado,
      objetivo: proc.objetivo,
      alcance: proc.alcance,
      responsables_doc: proc.responsablesDoc,
      definiciones: proc.definiciones,
      desarrollo: proc.desarrollo,
      registros_control: proc.registrosControl || [],
      control_cambios: proc.controlCambios || []
    };

    const { data, error } = await supabase
      .from('procedimientos')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveProcedimiento warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving procedimiento:', err);
    return null;
  }
}

// --- 5. FORMATOS IMPRIMIBLES ---
export async function fetchFormatosFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('formatos_imprimibles')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetchFormatos warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        codigo: item.codigo,
        titulo: item.titulo,
        categoria: item.categoria,
        version: item.version,
        responsable: item.responsable,
        columnas: item.columnas || [],
        filasVacias: item.filas_vacias || 10,
        nota: item.nota
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching formatos:', err);
    return null;
  }
}

export async function saveFormatoToDb(formato, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      id: formato.id || `f-custom-${Date.now()}`,
      tenant_id: tenantId,
      codigo: formato.codigo,
      titulo: formato.titulo,
      categoria: formato.categoria,
      version: formato.version || '1.0.0',
      responsable: formato.responsable || 'Carlos Gómez',
      columnas: formato.columnas || [],
      filas_vacias: formato.filasVacias || 10,
      nota: formato.nota
    };

    const { data, error } = await supabase
      .from('formatos_imprimibles')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveFormato warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving formato:', err);
    return null;
  }
}

// --- 6. REGISTROS DE SANEAMIENTO ---
export async function fetchSaneamientoFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('registros_saneamiento')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetchSaneamiento warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        fecha: item.fecha,
        hora: item.hora,
        area: item.area,
        tipo: item.tipo,
        producto: item.producto,
        supervisor: item.supervisor,
        conforme: item.conforme,
        observacion: item.observacion
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching saneamiento:', err);
    return null;
  }
}

export async function saveSaneamientoToDb(registro, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      tenant_id: tenantId,
      fecha: registro.fecha || new Date().toISOString().split('T')[0],
      hora: registro.hora || new Date().toTimeString().split(' ')[0].substring(0, 5),
      area: registro.area,
      tipo: registro.tipo,
      producto: registro.producto,
      supervisor: registro.supervisor,
      conforme: registro.conforme,
      observacion: registro.observacion
    };

    const { data, error } = await supabase
      .from('registros_saneamiento')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveSaneamiento warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving saneamiento:', err);
    return null;
  }
}

// --- 7. ACCIONES CAPA ---
export async function fetchCapaFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('acciones_capa')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetchCapa warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        fecha: item.fecha,
        hallazgo: item.hallazgo,
        origen: item.origen,
        causaRaiz: item.causa_raiz,
        planAccion: item.plan_accion,
        responsable: item.responsable,
        estado: item.estado,
        fechaCierre: item.fecha_cierre
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching CAPA:', err);
    return null;
  }
}

export async function updateCapaInDb(id, updates) {
  try {
    const payload = {
      causa_raiz: updates.causaRaiz,
      plan_accion: updates.planAccion,
      responsable: updates.responsable,
      estado: updates.estado,
      fecha_cierre: updates.fechaCierre
    };

    const { data, error } = await supabase
      .from('acciones_capa')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) {
      console.warn('Supabase updateCapa warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error updating CAPA:', err);
    return null;
  }
}

// --- 8. ALÉRGENOS ---
export async function fetchAlergenosFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('registros_alergenos')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetchAlergenos warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        fecha: item.fecha,
        linea: item.linea,
        alergenoEvaluado: item.alergeno_evaluado,
        resultado: item.resultado,
        supervisor: item.supervisor
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching alergenos:', err);
    return null;
  }
}

export async function saveAlergenoToDb(reg, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      tenant_id: tenantId,
      fecha: reg.fecha || new Date().toISOString().split('T')[0],
      linea: reg.linea,
      alergeno_evaluado: reg.alergenoEvaluado,
      resultado: reg.resultado,
      supervisor: reg.supervisor
    };

    const { data, error } = await supabase
      .from('registros_alergenos')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveAlergeno warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving alergeno:', err);
    return null;
  }
}

// --- 9. MANIPULADORES Y BPM ---
export async function fetchManipuladoresFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('manipuladores')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetchManipuladores warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        nombre: item.nombre,
        cedula: item.cedula,
        cargo: item.cargo,
        fechaExamen: item.fecha_examen,
        carnetBpm: item.carnet_bpm,
        fechaCapacitacion: item.fecha_capacitacion
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching manipuladores:', err);
    return null;
  }
}

export async function saveManipuladorToDb(man, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      tenant_id: tenantId,
      nombre: man.nombre,
      cedula: man.cedula,
      cargo: man.cargo,
      fecha_examen: man.fechaExamen,
      carnet_bpm: man.carnetBpm || 'Vigente',
      fecha_capacitacion: man.fechaCapacitacion
    };

    const { data, error } = await supabase
      .from('manipuladores')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveManipulador warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving manipulador:', err);
    return null;
  }
}

// --- 10. MEDICIONES DE VARIABLES CRÍTICAS ---
export async function fetchMedicionesFromDb(tenantId = 'tenant-opt-01') {
  try {
    const { data, error } = await supabase
      .from('mediciones_variables')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetchMediciones warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        tenantId: item.tenant_id,
        fecha: item.fecha,
        hora: item.hora,
        variable: item.variable,
        valor: item.valor,
        unidad: item.unidad,
        estado: item.estado,
        operador: item.operador
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching mediciones:', err);
    return null;
  }
}

export async function saveMedicionToDb(med, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      tenant_id: tenantId,
      fecha: med.fecha || new Date().toISOString().split('T')[0],
      hora: med.hora || new Date().toTimeString().split(' ')[0].substring(0, 5),
      variable: med.variable,
      valor: med.valor,
      unidad: med.unidad,
      estado: med.estado || 'Normal',
      operador: med.operador
    };

    const { data, error } = await supabase
      .from('mediciones_variables')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveMedicion warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving medicion:', err);
    return null;
  }
}

// --- 11. HISTORIAL DE VERSIONES DOCUMENTALES (TRAZABILIDAD ISO / HACCP) ---
export async function fetchVersionHistoryFromDb(tenantId = 'tenant-opt-01', codigo = null) {
  try {
    let query = supabase.from('version_history').select('*').eq('tenant_id', tenantId);
    if (codigo) query = query.eq('codigo', codigo);

    const { data, error } = await query.order('id', { ascending: false });

    if (error) {
      console.warn('Supabase fetchVersionHistory warning:', error.message);
      return null;
    }
    return data || null;
  } catch (err) {
    console.error('Error fetching version history:', err);
    return null;
  }
}

export async function saveVersionHistoryToDb(ver, tenantId = 'tenant-opt-01') {
  try {
    const payload = {
      tenant_id: tenantId,
      procedimiento_id: ver.procedimientoId || null,
      codigo: ver.codigo,
      titulo: ver.titulo,
      version: ver.version,
      fecha_cambio: ver.fechaCambio || new Date().toISOString().split('T')[0],
      responsable: ver.responsable || 'Carlos Gómez',
      descripcion_cambio: ver.descripcionCambio,
      contenido_backup: ver.contenidoBackup || {}
    };

    const { data, error } = await supabase
      .from('version_history')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveVersionHistory warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving version history:', err);
    return null;
  }
}

// --- 12. ROLES Y PERMISOS DINÁMICOS DE BASE DE DATOS (RBAC) ---
export async function fetchRolesFromDb() {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetchRoles warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(item => ({
        id: item.id,
        nombre: item.nombre,
        badgeClass: item.badge_class || 'bg-secondary',
        icon: item.icon || 'bi-person',
        descripcion: item.descripcion,
        canDownloadProcedures: item.can_download_procedures,
        canEditDocuments: item.can_edit_documents,
        canFillFormats: item.can_fill_formats,
        canEditFormats: item.can_edit_formats,
        canDownloadFormats: item.can_download_formats,
        canViewFichasTecnicas: item.can_view_fichas_tecnicas,
        canViewMSDS: item.can_view_msds,
        allowedViews: item.allowed_views || []
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching roles:', err);
    return null;
  }
}

export async function saveRoleToDb(role) {
  try {
    const payload = {
      id: role.id,
      nombre: role.nombre,
      badge_class: role.badgeClass || 'bg-secondary',
      icon: role.icon || 'bi-person',
      descripcion: role.descripcion,
      can_download_procedures: role.canDownloadProcedures,
      can_edit_documents: role.canEditDocuments,
      can_fill_formats: role.canFillFormats,
      can_edit_formats: role.canEditFormats,
      can_download_formats: role.canDownloadFormats,
      can_view_fichas_tecnicas: role.canViewFichasTecnicas,
      can_view_msds: role.canViewMSDS,
      allowed_views: role.allowedViews || []
    };

    const { data, error } = await supabase
      .from('roles')
      .upsert([payload])
      .select();

    if (error) {
      console.warn('Supabase saveRole warning:', error.message);
      return null;
    }
    return data ? data[0] : null;
  } catch (err) {
    console.error('Error saving role:', err);
    return null;
  }
}

// --- 13. AUTENTICACIÓN Y GESTIÓN DE USUARIOS REALES EN DB ---
export async function fetchUsuariosFromDb() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.warn('Supabase fetchUsuarios warning:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(u => ({
        id: u.id,
        tenantId: u.tenant_id,
        nombre: u.nombre,
        email: u.email,
        rolId: u.rol_id,
        cargo: u.cargo || 'Usuario del Sistema',
        activo: u.activo
      }));
    }
    return null;
  } catch (err) {
    console.error('Error fetching usuarios:', err);
    return null;
  }
}

export async function authenticateUserInDb(email, password = '123456') {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !data) {
      console.warn('Usuario no encontrado en Supabase:', email);
      return null;
    }

    return {
      id: data.id,
      tenantId: data.tenant_id,
      nombre: data.nombre,
      email: data.email,
      rolId: data.rol_id,
      cargo: data.cargo || 'Usuario del Sistema'
    };
  } catch (err) {
    console.error('Error authenticating user:', err);
    return null;
  }
}


