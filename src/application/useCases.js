// ============================================================
// CASOS DE USO (APPLICATION LAYER - CLEAN ARCHITECTURE)
// ============================================================

import {
  fetchIndustriasFromDb,
  fetchTenantsFromDb,
  saveTenantToDb,
  fetchTiendasFromDb,
  fetchDepartamentosFromDb,
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
} from '../lib/dataService';

import { evaluateCriticalVariable, createAutoCapaAction } from '../domain/rules';

export async function loadInitialCompanyData(activeTenantId) {
  const [
    industrias,
    tenants,
    tiendas,
    departamentos,
    procedimientos,
    saneamiento,
    accionesCapa,
    alergenos,
    manipuladores,
    mediciones
  ] = await Promise.all([
    fetchIndustriasFromDb(),
    fetchTenantsFromDb(),
    fetchTiendasFromDb(activeTenantId),
    fetchDepartamentosFromDb(activeTenantId),
    fetchProcedimientosFromDb(activeTenantId),
    fetchSaneamientoFromDb(activeTenantId),
    fetchCapaFromDb(activeTenantId),
    fetchAlergenosFromDb(activeTenantId),
    fetchManipuladoresFromDb(activeTenantId),
    fetchMedicionesFromDb(activeTenantId)
  ]);

  return {
    industrias: industrias || [],
    tenants: tenants || [],
    tiendas: tiendas || [],
    departamentos: departamentos || [],
    procedimientos: procedimientos || [],
    saneamiento: saneamiento || [],
    accionesCapa: accionesCapa || [],
    alergenos: alergenos || [],
    manipuladores: manipuladores || [],
    mediciones: mediciones || []
  };
}

export async function executeAddSanitationRecord(recordData, activeTenantId) {
  const saved = await saveSaneamientoToDb(recordData, activeTenantId);
  let autoCapa = null;

  if (!recordData.conforme) {
    autoCapa = createAutoCapaAction(
      'Saneamiento',
      recordData.fecha,
      recordData.hora,
      `Saneamiento fallido en ${recordData.area}: ${recordData.observacion}`,
      recordData.supervisor
    );
  }

  return { saved, autoCapa };
}

export async function executeAddCriticalVariableRecord(variableData, activeTenantId) {
  const estado = evaluateCriticalVariable(variableData.punto, variableData.temperatura, variableData.ph);
  const dataToSave = { ...variableData, estado };

  const saved = await saveMedicionToDb(dataToSave, activeTenantId);
  let autoCapa = null;

  if (estado === 'Alerta') {
    autoCapa = createAutoCapaAction(
      'Variables Críticas',
      variableData.fecha,
      variableData.hora,
      `Desviación en ${variableData.punto}: Valor registrado de ${variableData.temperatura}°C. Comentario: ${variableData.comentario}`,
      variableData.supervisor
    );
  }

  return { saved, autoCapa };
}

export async function executeResolveCapaTicket(ticketId, resolucionData) {
  return await updateCapaInDb(ticketId, resolucionData);
}

export async function executeCreateNewTenant(tenantData) {
  return await saveTenantToDb(tenantData);
}
