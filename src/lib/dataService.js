import { supabase } from './supabaseClient';

// ============================================================
// SERVICIO DE DATOS MULTI-TENANT (MULTI-INQUILINO/EMPRESA)
// ============================================================

// --- 0. GESTIÓN DE EMPRESAS / TENANTS ---
export async function fetchTenantsFromDb() {
  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
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
      nombre: tenant.nombre,
      nit: tenant.nit || 'Sin NIT',
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

// --- 1. PROCEDIMIENTOS (Filtrado por tenant_id) ---
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
    return null;
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

// --- 2. FORMATOS IMPRIMIBLES ---
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

// --- 3. REGISTROS DE SANEAMIENTO ---
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

// --- 4. ACCIONES CAPA ---
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

// --- 5. ALÉRGENOS ---
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

// --- 6. MANIPULADORES Y BPM ---
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

// --- 7. MEDICIONES DE VARIABLES CRÍTICAS ---
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
