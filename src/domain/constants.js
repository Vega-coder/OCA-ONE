// ============================================================
// CONSTANTES Y CONFIGURACIONES DE DOMINIO - OCA ONE
// ============================================================

export const CATEGORIAS_CALIDAD = [
  { name: 'Limpieza y Desinfección', icon: 'bi-droplet-fill', badgeStyle: 'icon-badge-sky' },
  { name: 'Control de Plagas', icon: 'bi-bug-fill', badgeStyle: 'icon-badge-amber' },
  { name: 'Residuos Sólidos y Líquidos', icon: 'bi-trash-fill', badgeStyle: 'icon-badge-emerald' },
  { name: 'Agua Potable', icon: 'bi-water', badgeStyle: 'icon-badge-indigo' }
];

export const PRODUCTOS_DESINFECTANTES = [
  { id: 'cloro', nombre: 'Cloro (200 ppm)', dosis: '200 ppm' },
  { id: 'amonio', nombre: 'Amonio Cuaternario (5ta Gen)', dosis: '150 ppm' },
  { id: 'peracetico', nombre: 'Ácido Peracético (150 ppm)', dosis: '150 ppm' },
  { id: 'detergente', nombre: 'Detergente Neutro Industrial', dosis: '10%' },
  { id: 'agua_caliente', nombre: 'Agua a Alta Temperatura (>80°C)', dosis: '>80°C' }
];

export const TIPOS_LIMPIEZA = [
  { id: 'pre-operacional', nombre: 'Pre-operacional (Antes de producir)' },
  { id: 'rutinaria', nombre: 'Rutinaria (Durante el proceso)' },
  { id: 'profunda', nombre: 'Profunda (Cierre de jornada)' }
];
