// ============================================================
// REGLAS DE NEGOCIO Y LÍMITES CRÍTICOS (HACCP) - DOMAIN RULES
// ============================================================

/**
 * Evalúa si una medición de variable crítica está en estado Normal o Alerta
 */
export function evaluateCriticalVariable(punto, temperatura, ph = null) {
  if (punto === 'Cámara Refrigeración 1') {
    return temperatura > 8.0 ? 'Alerta' : 'Normal';
  } 
  if (punto === 'Cámara Congelación 2') {
    return temperatura > -15.0 ? 'Alerta' : 'Normal';
  } 
  if (punto === 'Pasteurizador B') {
    if (temperatura < 72.0) return 'Alerta';
    if (ph !== null && (ph < 6.4 || ph > 6.9)) return 'Alerta';
    return 'Normal';
  } 
  if (punto === 'Silaje de Materia Prima') {
    if (temperatura > 10.0) return 'Alerta';
    if (ph !== null && (ph < 6.5 || ph > 6.8)) return 'Alerta';
    return 'Normal';
  }
  
  return 'Normal';
}

/**
 * Crea una acción CAPA automática ante una no conformidad
 */
export function createAutoCapaAction(origen, fecha, hora, hallazgo, responsable) {
  return {
    id: Date.now() + Math.floor(Math.random() * 100),
    origen,
    fecha,
    hora,
    hallazgo,
    responsable,
    estado: 'Abierto',
    causaRaiz: '',
    planAccion: '',
    fechaCierre: '',
    supervisorCierre: ''
  };
}
