import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Saneamiento from './components/Saneamiento';
import VariablesCriticas from './components/VariablesCriticas';
import Trazabilidad from './components/Trazabilidad';
import Capacitaciones from './components/Capacitaciones';
import Capa from './components/Capa';
import AllergenRecall from './components/AllergenRecall';
import Procedimientos from './components/Procedimientos';

function App() {
  const [currentView, setCurrentView] = useState('procedimientos');
  const [theme, setTheme] = useState(() => localStorage.getItem('OCA-theme-v4') || 'light');
  const [isProcedimientosOpen, setIsProcedimientosOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Limpieza y Desinfección');
  const [expandedCategories, setExpandedCategories] = useState({
    'Limpieza y Desinfección': true,
    'Control de Plagas': false,
    'Residuos Sólidos y Líquidos': false,
    'Agua Potable': false
  });
  
  // Base de datos de Procedimientos (Control Documental) con estructura ISO
  const [procedimientos, setProcedimientos] = useState(() => {
    const saved = localStorage.getItem('OCA-procedimientos-v5');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        codigo: 'POES-PLG-001',
        titulo: 'Procedimiento Operativo de Control de Plagas',
        categoria: 'Control de Plagas',
        version: '2.0.0',
        fechaAprobacion: '2026-01-10',
        responsable: 'Carlos Gómez',
        objetivo: 'Establecer las medidas preventivas y correctivas necesarias para evitar la proliferación de insectos, roedores y otras plagas en la planta de proceso.',
        alcance: 'Aplica a todas las áreas internas, externas, almacenes de materia prima y producto terminado.',
        responsablesDoc: 'Empresa subcontratista de control de vectores y el supervisor de calidad.',
        definiciones: 'Vector: Animal que puede transmitir enfermedades o contaminar alimentos.\nCebadero: Caja segura que contiene cebo rodenticida de forma controlada.',
        desarrollo: '1. INSPECCIÓN:\n- El supervisor revisará semanalmente los 15 cebaderos numerados y registrará el consumo de cebo.\n- Se mantendrán activas las trampas de luz UV en zona de empaque.\n\n2. ACCIÓN CORRECTIVA:\n- Ante cualquier avistamiento de plagas, se llamará a la empresa contratista externa para realizar una fumigación de refuerzo en menos de 24 horas.',
        registrosControl: [
          { nombre: 'Planilla de Monitoreo de Estaciones de Cebado', codigo: 'F-PLG-01', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Enero 2026 Version 2.0.0', descripcion: 'Actualización general de cebaderos externos', responsable: 'Carlos Gómez' }
        ]
      },
      {
        id: 2,
        codigo: 'POES-RES-002',
        titulo: 'Manual de Gestión de Residuos Sólidos y Líquidos',
        categoria: 'Residuos Sólidos y Líquidos',
        version: '1.2.0',
        fechaAprobacion: '2026-03-15',
        responsable: 'Carlos Gómez',
        objetivo: 'Normar el correcto manejo, separación en la fuente y disposición final de los residuos generados durante el procesamiento de alimentos.',
        alcance: 'Aplica a todas las áreas operativas, bodegas y zona de efluentes.',
        responsablesDoc: 'Auxiliares de almacén, personal de limpieza y dirección ambiental.',
        definiciones: 'Residuo Orgánico: Resto biodegradable de origen vegetal o animal.\nManifiesto: Documento legal que acredita la correcta disposición final.',
        desarrollo: '1. CLASIFICACIÓN:\n- Orgánicos: Canecas Verdes.\n- Plásticos e Inertes: Canecas Grises.\n- Peligrosos o Químicos: Canecas Rojas.\n\n2. DISPOSICIÓN DE ACEITES:\n- Queda prohibido verter grasas en los sumideros de lavado. Deben almacenarse en bidones plásticos y entregarse al proveedor Ecograses S.A.',
        registrosControl: [
          { nombre: 'Bitácora Diaria de Retiro de Residuos', codigo: 'F-RES-01', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Marzo 2026 Version 1.2.0', descripcion: 'Inclusión de entrega de aceites quemados', responsable: 'Carlos Gómez' }
        ]
      },
      {
        id: 3,
        codigo: 'POES-LIM-003',
        titulo: 'Plan Maestro de Limpieza y Desinfección',
        categoria: 'Limpieza y Desinfección',
        version: '3.1.0',
        fechaAprobacion: '2026-05-20',
        responsable: 'Carlos Gómez',
        objetivo: 'Garantizar que todos los equipos, utensilios e infraestructura de la planta estén limpios y desinfectados antes y durante la producción para evitar la contaminación física, química o biológica.',
        alcance: 'Aplica a todas las salas de proceso, zona de empaque, tolvas, mezcladoras, líneas de envasado A y B, y áreas comunes de la planta.',
        responsablesDoc: 'Operarios de limpieza, supervisores de producción y el director de aseguramiento de calidad.',
        definiciones: 'Sanitización: Reducción del número de microorganismos a un nivel seguro.\nPOES: Procedimientos Operativos Estandarizados de Sanitización.\nDesinfectante: Insumo químico formulado para eliminar patógenos.',
        desarrollo: '1. DOSIFICACIONES PERMITIDAS:\n- Cloro: 200 ppm para superficies de contacto directo.\n- Amonio Cuaternario: 400 ppm para paredes y techos.\n- Ácido Peracético: 150 ppm para enjuague de tuberías.\n\n2. PROCEDIMIENTO PASO A PASO:\n- Limpieza Pre-operacional: Lavado completo y cepillado antes de iniciar el turno.\n- Limpieza Rutinaria: Limpieza rápida ante derrames a lo largo de la producción.\n- Limpieza Profunda: Higienización profunda con desinfección al final de la jornada de trabajo.',
        registrosControl: [
          { nombre: 'Registro de Inspección Diaria de L&D', codigo: 'Q-FR-18', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' },
          { nombre: 'Registro de Preparación de Sustancias Químicas', codigo: 'Q-FR-16', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Enero 2024 Version 1', descripcion: 'Creación del documento', responsable: 'Ing. Luis Salcedo' },
          { fecha: 'Mayo 2026 Version 3.1.0', descripcion: 'Actualización de dosificación de cloro a 200ppm', responsable: 'Carlos Gómez' }
        ]
      },
      {
        id: 4,
        codigo: 'POES-AGU-004',
        titulo: 'Procedimiento de Control y Potabilidad de Agua',
        categoria: 'Agua Potable',
        version: '1.0.0',
        fechaAprobacion: '2026-02-05',
        responsable: 'Carlos Gómez',
        objetivo: 'Asegurar que el agua utilizada en la limpieza y elaboración de los alimentos sea microbiológica y fisicoquímicamente apta para consumo humano.',
        alcance: 'Aplica a toda la red de agua potable interna, tanques de almacenamiento y salidas en salas de proceso.',
        responsablesDoc: 'Supervisor de laboratorio y líder de mantenimiento.',
        definiciones: 'Cloro Libre Residual: Cantidad de cloro activo en agua para desinfección.\nPotabilidad: Propiedad del agua que la hace apta para consumo sin riesgo.',
        desarrollo: '1. MONITOREO DIARIO:\n- Se medirá diariamente el cloro libre residual (Rango aceptable: 0.3 a 2.0 ppm) y el pH (Rango: 6.5 a 8.5).\n\n2. MANTENIMIENTO TANQUES:\n- Los tanques deben lavarse y desinfectarse de manera obligatoria cada seis (6) meses por una empresa autorizada.',
        registrosControl: [
          { nombre: 'Planilla Diaria de Medición de Cloro y pH', codigo: 'F-AGU-01', responsable: 'Aseguramiento de Calidad', retencion: '1 año', destino: 'Destrucción' }
        ],
        controlCambios: [
          { fecha: 'Febrero 2026 Version 1.0.0', descripcion: 'Creación del documento', responsable: 'Carlos Gómez' }
        ]
      }
    ];
  });

  // Base de datos de Saneamiento
  const [registrosSaneamiento, setRegistrosSaneamiento] = useState(() => {
    const saved = localStorage.getItem('OCA-saneamiento-v4');
    return saved ? JSON.parse(saved) : [
      { id: 1, fecha: '2026-07-15', hora: '06:30', area: 'Cuarto Frío 1', supervisor: 'Carlos Gómez', tipo: 'Pre-operacional', producto: 'Cloro 200ppm', conforme: true, observacion: 'Cumple sin novedades' },
      { id: 2, fecha: '2026-07-15', hora: '13:00', area: 'Línea de Envasado A', supervisor: 'Ana Martínez', tipo: 'Rutinaria', producto: 'Amonio Cuaternario', conforme: true, observacion: 'Limpieza intermedia' },
      { id: 3, fecha: '2026-07-15', hora: '18:00', area: 'Almacén MP', supervisor: 'Diana Pérez', tipo: 'Profunda', producto: 'Detergente Neutro', conforme: true, observacion: 'Lavado general' },
      { id: 4, fecha: '2026-07-14', hora: '22:00', area: 'Cuarto Frío 2', supervisor: 'Carlos Gómez', tipo: 'Profunda', producto: 'Cloro 200ppm', conforme: false, observacion: 'Presencia de residuos en desagüe. Se requiere repetir.' }
    ];
  });

  // Base de datos de Variables Críticas (PCC)
  const [medicionesVariables, setMedicionesVariables] = useState(() => {
    const saved = localStorage.getItem('OCA-variables-v4');
    return saved ? JSON.parse(saved) : [
      { id: 1, fecha: '2026-07-15', hora: '08:00', punto: 'Cámara Refrigeración 1', temperatura: 4.2, ph: null, supervisor: 'Carlos Gómez', estado: 'Normal', comentario: 'Equipo operando estable.' },
      { id: 2, fecha: '2026-07-15', hora: '10:00', punto: 'Pasteurizador B', temperatura: 72.5, ph: 6.62, supervisor: 'Ana Martínez', estado: 'Normal', comentario: 'Pasteurización de leche entera.' },
      { id: 3, fecha: '2026-07-15', hora: '12:00', punto: 'Silaje de Materia Prima', temperatura: 5.1, ph: 6.65, supervisor: 'Diana Pérez', estado: 'Normal', comentario: 'Lote L-LECHE-102 recibido.' },
      { id: 4, fecha: '2026-07-15', hora: '14:30', punto: 'Cámara Refrigeración 1', temperatura: 9.8, ph: null, supervisor: 'Carlos Gómez', estado: 'Alerta', comentario: 'Apertura prolongada de puerta por carga. Alerta automática.' }
    ];
  });

  // Base de datos de Manipuladores
  const [manipuladores, setManipuladores] = useState(() => {
    const saved = localStorage.getItem('OCA-manipuladores-v4');
    return saved ? JSON.parse(saved) : [
      { id: 1, nombre: 'Javier Castillo', cargo: 'Operario de Envasado', carnetBpm: 'Vigente', controlMedico: 'Apto', capacitacionProgreso: 92 },
      { id: 2, nombre: 'Marta Solano', cargo: 'Operaria de Mezclas', carnetBpm: 'Vigente', controlMedico: 'Apto', capacitacionProgreso: 85 },
      { id: 3, nombre: 'Luis Fernando Ruiz', cargo: 'Auxiliar de Almacén', carnetBpm: 'Vence Pronto', controlMedico: 'Apto', capacitacionProgreso: 78 },
      { id: 4, nombre: 'Andrea Quintero', cargo: 'Operaria de Limpieza', carnetBpm: 'Vigente', controlMedico: 'Apto', capacitacionProgreso: 100 },
      { id: 5, nombre: 'Jorge Restrepo', cargo: 'Operario de Pasteurizado', carnetBpm: 'Vencido', controlMedico: 'Pendiente', capacitacionProgreso: 45 }
    ];
  });

  // Base de datos de Acciones CAPA (Desviaciones)
  const [accionesCapa, setAccionesCapa] = useState(() => {
    const saved = localStorage.getItem('OCA-capa-v4');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        origen: 'Saneamiento', 
        fecha: '2026-07-14', 
        hora: '22:00', 
        hallazgo: 'Saneamiento fallido en Cuarto Frío 2: Presencia de residuos orgánicos en desagüe.', 
        responsable: 'Carlos Gómez', 
        estado: 'Abierto', 
        causaRaiz: '', 
        planAccion: '', 
        fechaCierre: '', 
        supervisorCierre: '' 
      }
    ];
  });

  // Base de datos de registros de cambio de alérgenos
  const [registrosAlergenos, setRegistrosAlergenos] = useState(() => {
    const saved = localStorage.getItem('OCA-alergenos-v4');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        fecha: '2026-07-15', 
        hora: '07:30', 
        linea: 'Línea de Envasado A', 
        alergenoPrevio: 'Maní', 
        alergenoObjetivo: 'Ninguno (Libre de alérgenos)', 
        tipoPrueba: 'Lateral Flow (Hisopado rápido)', 
        resultado: 'Negativo (Línea Liberada)', 
        supervisor: 'Carlos Gómez' 
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('OCA-procedimientos-v5', JSON.stringify(procedimientos));
  }, [procedimientos]);

  useEffect(() => {
    localStorage.setItem('OCA-saneamiento-v4', JSON.stringify(registrosSaneamiento));
  }, [registrosSaneamiento]);

  useEffect(() => {
    localStorage.setItem('OCA-variables-v4', JSON.stringify(medicionesVariables));
  }, [medicionesVariables]);

  useEffect(() => {
    localStorage.setItem('OCA-manipuladores-v4', JSON.stringify(manipuladores));
  }, [manipuladores]);

  useEffect(() => {
    localStorage.setItem('OCA-capa-v4', JSON.stringify(accionesCapa));
  }, [accionesCapa]);

  useEffect(() => {
    localStorage.setItem('OCA-alergenos-v4', JSON.stringify(registrosAlergenos));
  }, [registrosAlergenos]);

  // Manejo del tema (Modo Claro / Modo Oscuro)
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('OCA-theme-v4', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Agregar registros y autogenerar Tickets CAPA ante fallas o alertas
  const handleAgregarSaneamiento = (nuevoRegistro) => {
    const id = Date.now();
    setRegistrosSaneamiento(prev => [...prev, { id, ...nuevoRegistro }]);

    // Si no es conforme, se genera automáticamente una no conformidad en el módulo CAPA
    if (!nuevoRegistro.conforme) {
      setAccionesCapa(prev => [
        ...prev,
        {
          id: Date.now() + 10,
          origen: 'Saneamiento',
          fecha: nuevoRegistro.fecha,
          hora: nuevoRegistro.hora,
          hallazgo: `Saneamiento fallido en ${nuevoRegistro.area}: ${nuevoRegistro.observacion}`,
          responsable: nuevoRegistro.supervisor,
          estado: 'Abierto',
          causaRaiz: '',
          planAccion: '',
          fechaCierre: '',
          supervisorCierre: ''
        }
      ]);
    }
  };

  const handleAgregarVariable = (nuevaMedicion) => {
    const id = Date.now();
    setMedicionesVariables(prev => [...prev, { id, ...nuevaMedicion }]);

    // Si la variable está en estado de Alerta, genera automáticamente un CAPA
    if (nuevaMedicion.estado === 'Alerta') {
      setAccionesCapa(prev => [
        ...prev,
        {
          id: Date.now() + 20,
          origen: 'Variables Críticas',
          fecha: nuevaMedicion.fecha,
          hora: nuevaMedicion.hora,
          hallazgo: `Desviación en ${nuevaMedicion.punto}: Valor registrado de ${nuevaMedicion.temperatura}°C ${nuevaMedicion.ph ? `| pH ${nuevaMedicion.ph}` : ''}. Comentario: ${nuevaMedicion.comentario}`,
          responsable: nuevaMedicion.supervisor,
          estado: 'Abierto',
          causaRaiz: '',
          planAccion: '',
          fechaCierre: '',
          supervisorCierre: ''
        }
      ]);
    }
  };

  const handleResolverCapa = (id, resolucion) => {
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
  };

  const handleAgregarAlergeno = (nuevoAlergeno) => {
    setRegistrosAlergenos(prev => [
      ...prev,
      { id: Date.now(), ...nuevoAlergeno }
    ]);
  };

  const handleAgregarManipulador = (nuevoMan) => {
    setManipuladores(prev => [...prev, { id: Date.now(), ...nuevoMan }]);
  };

  const handleAgregarProcedimiento = (nuevoProc) => {
    setProcedimientos(prev => [
      ...prev,
      {
        id: Date.now(),
        fechaAprobacion: new Date().toISOString().split('T')[0],
        ...nuevoProc
      }
    ]);
  };

  // Calcular alertas activas para el centro de notificaciones
  const alertasActivas = [];

  // Agregar alertas si hay CAPA pendientes abiertos
  accionesCapa.forEach(capa => {
    if (capa.estado === 'Abierto') {
      alertasActivas.push({
        id: `capa-${capa.id}`,
        tipo: 'danger',
        mensaje: `CAPA Abierta: ${capa.hallazgo.substring(0, 60)}...`,
        fecha: capa.fecha
      });
    }
  });

  // Agregar alertas de personal vencido
  manipuladores.forEach(man => {
    if (man.carnetBpm === 'Vencido') {
      alertasActivas.push({
        id: `man-${man.id}`,
        tipo: 'warning',
        mensaje: `Carnet BPM vencido para ${man.nombre}`,
        fecha: 'Urgente'
      });
    }
  });

  return (
    <div className="container-fluid p-0 d-flex">
      {/* Sidebar de Navegación */}
      <aside className="gipa-sidebar d-flex flex-column flex-shrink-0 p-3 text-white" style={{ width: '280px' }}>
        <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-4 fw-extrabold text-success me-2">
            <i className="bi bi-shield-check"></i>
          </span>
          <span className="fs-4 fw-bold tracking-tight">OCA <span className="text-success fw-normal">ONE</span></span>
        </div>
        <hr className="bg-secondary" />
        
        <ul className="nav nav-pills flex-column mb-auto">
          {/* Procedimientos y Archivos (DE PRIMERO) */}
          <li className="nav-item mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 d-flex justify-content-between align-items-center ${currentView === 'procedimientos' ? 'active' : 'text-white'}`}
              onClick={() => {
                setCurrentView('procedimientos');
                setIsProcedimientosOpen(!isProcedimientosOpen);
              }}
            >
              <span>
                <i className="bi bi-folder2-open me-2"></i> Procedimientos y Archivos
              </span>
              <i className={`bi bi-chevron-down arrow-rotate ${isProcedimientosOpen ? 'rotated' : ''}`} style={{ fontSize: '12px' }}></i>
            </button>
            
            {/* Nivel 2: Categorías Desplegables */}
            {isProcedimientosOpen && (
              <ul className="sidebar-submenu">
                {[
                  { name: 'Limpieza y Desinfección', icon: 'bi-droplet-fill text-info' },
                  { name: 'Control de Plagas', icon: 'bi-bug-fill text-warning' },
                  { name: 'Residuos Sólidos y Líquidos', icon: 'bi-trash-fill text-success' },
                  { name: 'Agua Potable', icon: 'bi-water text-primary' }
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
                        <span>
                          <i className={`bi ${cat.icon} me-2`}></i> {cat.name}
                        </span>
                        <i className={`bi bi-chevron-down arrow-rotate ${isCatExpanded ? 'rotated' : ''}`} style={{ fontSize: '10px' }}></i>
                      </button>
                      
                      {/* Nivel 3: Sub-submenú (Sólo la subcategoría Procedimiento) */}
                      {isCatExpanded && (
                        <ul className="sidebar-sub-submenu">
                          <li>
                            <button
                              className={`nav-link-sub-sub w-100 btn border-0 text-start ${currentView === 'procedimientos' && activeCategory === cat.name ? 'active-sub-sub' : 'text-white'}`}
                              onClick={() => {
                                setCurrentView('procedimientos');
                                setActiveCategory(cat.name);
                              }}
                            >
                              <i className="bi bi-file-earmark-pdf me-1"></i> Procedimiento
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
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'dashboard' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'saneamiento' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('saneamiento')}
            >
              <i className="bi bi-bucket me-2"></i> Saneamiento e Higiene
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'variables' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('variables')}
            >
              <i className="bi bi-thermometer-half me-2"></i> Variables Críticas
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'capa' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('capa')}
            >
              <i className="bi bi-clipboard-x me-2"></i> Acciones CAPA
              {accionesCapa.filter(c => c.estado === 'Abierto').length > 0 && (
                <span className="badge bg-danger ms-2">
                  {accionesCapa.filter(c => c.estado === 'Abierto').length}
                </span>
              )}
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'trazabilidad' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('trazabilidad')}
            >
              <i className="bi bi-bezier2 me-2"></i> Trazabilidad de Lotes
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'alergenos-recall' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('alergenos-recall')}
            >
              <i className="bi bi-shield-exclamation me-2"></i> Alérgenos y Retiros
            </button>
          </li>
          <li className="mb-1">
            <button 
              className={`nav-link text-start w-100 btn border-0 ${currentView === 'capacitaciones' ? 'active' : 'text-white'}`}
              onClick={() => setCurrentView('capacitaciones')}
            >
              <i className="bi bi-people me-2"></i> Manipuladores y BPM
            </button>
          </li>
        </ul>
        <hr className="bg-secondary" />
        <div className="text-secondary small">
          <p className="mb-1"><i className="bi bi-building me-1"></i> Optimus Latinoamérica</p>
          <p className="mb-0 text-muted" style={{ fontSize: '11px' }}>v2.0.0 - Edición Profesional</p>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-grow-1 min-vh-100 d-flex flex-column" style={{ overflowY: 'auto' }}>
        {/* Cabecera */}
        <header className="navbar navbar-expand-lg border-bottom px-4 py-3 bg-body-tertiary sticky-top">
          <div className="container-fluid p-0">
            <h1 className="h3 mb-0 text-capitalize font-heading">
              {currentView === 'procedimientos' && 'Control Documental de Saneamiento y Calidad'}
              {currentView === 'dashboard' && 'Dashboard de Calidad e Inocuidad'}
              {currentView === 'saneamiento' && 'Plan de Saneamiento e Higiene'}
              {currentView === 'variables' && 'Monitoreo de Variables Críticas (PCC)'}
              {currentView === 'capa' && 'Gestión de Acciones Correctivas (CAPA)'}
              {currentView === 'trazabilidad' && 'Trazabilidad de Lotes'}
              {currentView === 'alergenos-recall' && 'Control de Alérgenos y Simulador de Retiro'}
              {currentView === 'capacitaciones' && 'Control de Manipuladores y BPM'}
            </h1>
            
            <div className="d-flex align-items-center ms-auto">
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
                  <li className="dropdown-header border-bottom pb-2 fw-bold text-dark">Alertas de Planta</li>
                  {alertasActivas.length === 0 ? (
                    <li className="text-center py-3 text-muted">
                      <i className="bi bi-check2-circle text-success fs-3 d-block mb-1"></i>
                      Sin alertas activas en planta.
                    </li>
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

              {/* Perfil */}
              <div className="d-flex align-items-center border-start ps-3">
                <div className="text-end me-2 d-none d-md-block">
                  <div className="fw-bold" style={{ fontSize: '14px' }}>Ing. Carlos G.</div>
                  <div className="text-muted" style={{ fontSize: '12px' }}>Director de Calidad</div>
                </div>
                <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                  CG
                </div>
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

        {/* Footer */}
        <footer className="footer mt-auto py-3 border-top bg-body-tertiary">
          <div className="container-fluid px-4 d-flex justify-content-between align-items-center text-muted small">
            <span>&copy; 2026 OCA ONE. Edición Profesional - Optimus Latinoamérica.</span>
            <span>Seguridad Alimentaria: HACCP / ISO 22000 / BRCGS / IFS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
