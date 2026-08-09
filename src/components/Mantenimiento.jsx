import React, { useState } from 'react';
import { canUserDownloadProcedure, canUserEditDocument } from '../lib/permissions';

export default function Mantenimiento({ tenantId = 'tenant-opt-01', userRole = 'super-admin' }) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);
  const [mostrarRegistroForm, setMostrarRegistroForm] = useState(false);
  const [equipoSeleccionadoTab, setEquipoSeleccionadoTab] = useState('motobomba');
  const [alertaExito, setAlertaExito] = useState(false);

  // Lista de registros de mantenimiento realizados
  const [registrosMantenimiento, setRegistrosMantenimiento] = useState([
    {
      id: 1,
      fecha: '2026-08-01',
      equipo: 'Motobomba Recepción GX 120',
      tipo: 'Preventivo',
      actividad: 'Comprobación de fugas de aceite/gasolina, ajuste de pernos y revisión de elemento de filtro de aire.',
      tecnico: 'Téc. Mateo Morales',
      repuestos: 'Aceite 10W-30 (0.6Q), Sello mecánico',
      estado: 'Operativo'
    },
    {
      id: 2,
      fecha: '2026-08-05',
      equipo: 'Cuarto Frío de Choque 5HP',
      tipo: 'Preventivo',
      actividad: 'Limpieza de serpentines evaporadores con hidrolavadora, inspección de presostatos y controlador MT 512.',
      tecnico: 'Ing. Mateo Morales / FrigoServicios',
      repuestos: 'Ninguno',
      estado: 'Operativo'
    },
    {
      id: 3,
      fecha: '2026-08-07',
      equipo: 'Hiladora de Queso 3HP',
      tipo: 'Correctivo',
      actividad: 'Reemplazo de potenciómetro de velocidad de aspas en tablero comandado por variador LG.',
      tecnico: 'Téc. Mateo Morales',
      repuestos: 'Potenciómetro graduador 10k Ohm',
      estado: 'Operativo'
    }
  ]);

  // Formulario nuevo registro FOPME-002
  const [nuevoEquipo, setNuevoEquipo] = useState('Motobomba Recepción GX 120');
  const [nuevoTipo, setNuevoTipo] = useState('Preventivo');
  const [nuevaActividad, setNuevaActividad] = useState('');
  const [nuevoTecnico, setNuevoTecnico] = useState('');
  const [nuevosRepuestos, setNuevosRepuestos] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('Operativo');

  const canDownloadPDF = canUserDownloadProcedure(userRole);

  const handleCrearRegistro = (e) => {
    e.preventDefault();
    if (!nuevaActividad.trim()) return;

    const nuevo = {
      id: Date.now(),
      fecha: new Date().toISOString().split('T')[0],
      equipo: nuevoEquipo,
      tipo: nuevoTipo,
      actividad: nuevaActividad.trim(),
      tecnico: nuevoTecnico.trim() || 'Téc. Mateo Morales',
      repuestos: nuevosRepuestos.trim() || 'Sin repuestos',
      estado: nuevoEstado
    };

    setRegistrosMantenimiento(prev => [nuevo, ...prev]);
    setNuevaActividad('');
    setNuevosRepuestos('');
    setMostrarRegistroForm(false);
    setAlertaExito(true);
    setTimeout(() => setAlertaExito(false), 4000);
  };

  // Fichas técnicas completas extraídas palabra por palabra del documento Word
  const equiposDetalle = {
    motobomba: {
      nombre: 'Motobomba Honda GX 120 (Recepción de Leche)',
      especificaciones: [
        'Modelo: GX 120 (Eje de toma de fuerza tipo S)',
        'Dimensiones (Longitud x Anchura x Altura): 297 x 341 x 318 mm',
        'Peso en seco: 13 Kg',
        'Tipo de motor: 4 tiempos, válvulas en cabeza, monocilíndrico',
        'Cilindrada: 119 cm³',
        'Potencia máxima: 2,9 kW a 3.600 RPM',
        'Torsión máxima: 7,4 N.m a 2.500 RPM',
        'Capacidad de aceite de motor: 0,60 Quarts',
        'Capacidad del depósito de combustible: 2,5 Quarts',
        'Consumo de combustible: 313 g/kWh (230 g/PSh)',
        'Sistema de enfriamiento: Aire forzado | Sistema encendido: Magneto transistorizado'
      ],
      accionamiento: [
        '1. Girar la válvula del combustible a la posición "ON".',
        '2. Mover la palanca del acelerador un poco hacia la izquierda.',
        '3. Girar la palanca del estrangulador a la posición cerrada.',
        '4. Girar el interruptor del motor a la posición "ON".',
        '5. Tirar un poco de la empuñadura del arrancador hasta notar resistencia, y luego tirar con fuerza.',
        '6. Girar la palanca del estrangulador a la posición abierta.',
        '7. Ajustar la palanca del acelerador a la velocidad deseada.'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Comprobación visual de fugas de aceite o gasolina. Verificar protectores, cubiertas, tuercas y pernos. Comprobar nivel de combustible y elemento del filtro de aire.' },
        { frec: 'SEMANAL', act: 'Extraer el polvo o la suciedad excesiva en torno al silenciador y arrancador. Comprobar nivel de aceite del motor.' },
        { frec: 'SEMESTRAL', act: 'Cambio de sello mecánico para evitar derrames de leche.' }
      ],
      recomendaciones: 'Mantener apartado de materiales inflamables. No fumar cerca. Suministrar combustible y mantenimiento siempre con el equipo apagado.'
    },
    electrobomba: {
      nombre: 'Electrobomba de Agua / Suero (Cuajado)',
      especificaciones: [
        'Potencia: 1500W (2 HP)',
        'Eficiencia energética: 71.9%',
        'Velocidad de giro: 3.450 RPM',
        'Voltaje de operación: 110 / 220 V',
        'Frecuencia: 60 Hz'
      ],
      accionamiento: [
        '1. Conectar a la red eléctrica.',
        '2. Presionar el botón verde de encendido en la caja de control.',
        '3. Nota: Presionar el botón rojo para detener el equipo inmediatamente.'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Comprobar que la velocidad y caudal correspondan a la salida. Examinar bridas para detectar fugas, fisuras u oxidación.' },
        { frec: 'SEMANAL', act: 'Comprobar puntos de montaje. Inspeccionar sello mecánico, acoplamientos y filtros. Limpiar ventilaciones del motor.' },
        { frec: 'SEMESTRAL', act: 'Lubricación de cojinetes. Comprobar elevación respecto a la base. Cambiar acoplamientos del motor.' }
      ],
      recomendaciones: 'Realizar mantenimiento frecuente para evitar pérdidas de eficiencia. Operar y realizar mantenimiento siempre con el equipo apagado.'
    },
    hiladoras: {
      nombre: 'Hiladora de Queso (Sección Hilado)',
      especificaciones: [
        'Construcción: Acero inoxidable 304 en contacto con alimentos; acero 430 en cámaras de vapor y aire caliente.',
        'Acople de transmisión: Cadena y piñones paso 50.',
        'Capacidad: 1.600 Litros de leche cuajada.',
        'Sistema de agitación: Paletas y cuchillas de corte.',
        'Motor reductor: Marca SITI de 3 HP con 3 N.m de torque.',
        'Control eléctrico: Caja de controles comandada por variador de frecuencia marca LS (LG).'
      ],
      accionamiento: [
        '1. Colocar el aspa dentro de la máquina y asegurarla con los tornillos.',
        '2. Cerrar el orificio de salida de queso caliente con la tapa y abrazadera.',
        '3. Abrir las válvulas de vapor.',
        '4. Encender desde el interruptor del tablero de control.',
        '5. Variar la velocidad del aspa girando el potenciómetro.'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Ejecutar POES de limpieza y desinfección. Inspeccionar aspas por fisuras o roturas.' },
        { frec: 'SEMANAL', act: 'Revisar conexiones eléctricas, limpiar tablero, inspeccionar conductos y válvulas de vapor.' },
        { frec: 'MENSUAL', act: 'Limpiar depósitos de grasa en la tapa del ventilador del motor. Controlar retenes, V-rings, chumaceras y variadores de frecuencia.' }
      ],
      recomendaciones: 'Para desmontaje interno del motor usar personal calificado. En caso de fallo del potenciómetro, usar regulador auxiliar de volumen mientras se repone el original.'
    },
    moldeadora: {
      nombre: 'Moldeadora Industrial de Queso',
      especificaciones: [
        'Material: Acero inoxidable 304 y plástico industrial sanitario.',
        'Dimensiones: 170 cm largo x 90 cm ancho x 165 cm alto.',
        'Capacidad de tolva: 250 kg | Dosificación: 400g a 2.500g.',
        'Alimentación: 220V trifásico | Potencia: 3 HP.',
        'Tracción: Motorreductor sinfín-corona y piñones externos.',
        'Inyección: Tornillos paralelos tipo sinfín | Producción: 8 a 20 unidades/minuto.'
      ],
      accionamiento: [
        '1. Instalar los tornillos sinfín en la tolva en sus ejes marcados.',
        '2. Colocar piezas de centro, empaque, tapa brida y apretar mariposas simultáneamente.',
        '3. Energizar switch de muletilla y encender variador.',
        '4. Ajustar potenciómetro de velocidad y temporizador de dosificado.'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Ejecutar procedimiento POES de limpieza y desinfección.' },
        { frec: 'SEMANAL', act: 'Limpiar tablero de control, revisar mangueras de aire neumático y cables de alimentación. Lavado con desincrustante.' },
        { frec: 'MENSUAL', act: 'Eliminar depósitos de grasa del ventilador del motor, verificar rodamientos, retenes y lubricar chumaceras.' }
      ],
      recomendaciones: 'Si los cilindros dosificadores presentan dificultad de movimiento, revisar el compresor de aire y mangueras por pérdidas de presión.'
    },
    cuartos_frios: {
      nombre: 'Cuartos Fríos (Choque 5HP y Almacenamiento 7.5HP)',
      especificaciones: [
        'Cuarto de Choque: 212 x 356 x 200 cm, Poliuretano 35%, Evaporador 14.500 BTU, Condensador 5 HP con motor 1/3 HP.',
        'Cuarto Almacenamiento: 530 x 250 x 240 cm, Evaporador 24.000 BTU, Condensador 7.5 HP con 2 motores axiales de 1/2 HP.',
        'Controles: Tablero metálico con controladores digitales Fullgauge MT 512, relés térmicos y protectores de voltaje.'
      ],
      accionamiento: [
        '1. Verificar conexiones eléctricas.',
        '2. Encender unidad condensadora girando la perilla izquierda (luz piloto roja).',
        '3. Encender evaporadores girando la perilla derecha (luz piloto verde).'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Limpieza y desinfección del área. Registro continuo de temperatura en bitácora.' },
        { frec: 'SEMANAL', act: 'Lavado de serpentines evaporadores con hidrolavadora. Ajustar setpoint de temperatura.' },
        { frec: 'MENSUAL', act: 'Limpieza de tablero eléctrico, serpentines, sensores, tuberías y contactos electrónicos.' },
        { frec: 'TRIMESTRAL', act: 'Verificación de tarjetas electrónicas, lubricación de chumaceras, limpieza de drenajes y recarga de gas refrigerante.' }
      ],
      recomendaciones: 'Mantener puertas y cortinas plásticas cerradas. En caso de congelamiento del evaporador, apagar la condensadora para efectuar deshielo manual.'
    },
    caldera: {
      nombre: 'Caldera Pirotubular 60 BHP (Generación de Vapor)',
      especificaciones: [
        'Tipo: Pirotubular de 3 pasos automática.',
        'Capacidad: 60 BHP | Eficiencia térmica: 97%.',
        'Combustible: Gas Licuado de Petróleo (GLP).',
        'Accesorios: Quemador de 1.200.000 BTU, presostato de control, manómetro, controlador L91.',
        'Tanque de agua: 1.200 Litros | Bomba de agua: 3 HP, 3.450 RPM, 220V.'
      ],
      accionamiento: [
        '1. Abrir válvula de suministro de gas GLP.',
        '2. Verificar que el tanque de agua de 1.200L esté lleno y abrir válvulas de paso.',
        '3. Encender bomba de agua (perilla superior izquierda del tablero a la derecha).',
        '4. Encender quemador (perilla superior derecha a la derecha para modo automático).'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Limpieza del área. Purgar la caldera abriendo la válvula roja de la columna de agua y la válvula trasera hasta que el agua salga clara.' },
        { frec: 'SEMANAL', act: 'Limpieza externa del cuerpo de la caldera.' },
        { frec: 'SEMESTRAL', act: 'Limpieza interna de tuberías pirotubulares, revisión de fugas, mantenimiento de quemador y calibración de controles por técnico experto.' }
      ],
      recomendaciones: 'El mantenimiento semestral debe ser ejecutado exclusivamente por un técnico especialista en calderas de vapor.'
    },
    planta_electrica: {
      nombre: 'Planta Eléctrica Cummins 80 KVA (Respaldo de Energía)',
      especificaciones: [
        'Motor: Cummins 4BTA3.9-G2, 4 cilindros en línea, 4 tiempos, turbocargado.',
        'Potencia Standby: 99 BHP (73,9 kW) a 1.800 RPM | Gobernador electrónico.',
        'Capacidad lubricante: 2.9 galones | Capacidad refrigerante radiador: 5 galones.',
        'Generador: Marca Marathon sincrónico, 80 KVA, 3 fases, 12 hilos, factor de potencia 0.8, 60 Hz, eficiencia 92%.'
      ],
      accionamiento: [
        '1. MODO MANUAL: Presionar el botón "MANUAL" y mantener oprimido el botón verde hasta encender.',
        '2. MODO AUTOMÁTICO: Presionar el botón "AUTO" (luz piloto roja encendida). Recomendado para conmutación automática ante cortes de red.'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Limpieza externa y del área perimetral de la planta.' },
        { frec: 'SEMANAL', act: 'Suministrar combustible ACPM. Encender 10 minutos para descarte de fallos si no ha habido cortes.' },
        { frec: 'MENSUAL', act: 'Cambio de aceite lubricante, sustitución de filtros de combustible y aire, y revisión del radiador.' }
      ],
      recomendaciones: 'Asegurar ventilación suficiente para evacuar calor y gases de escape. Evitar sobrecargar la planta por encima del régimen máximo nominal.'
    },
    compresor: {
      nombre: 'Compresor de Aire Neumático 2HP',
      especificaciones: [
        'Presión de trabajo: 80 - 120 PSI | Tanque calderín: 170 Litros.',
        'Potencia: 750W (2 HP) | Velocidad: 3.440 RPM | Voltaje: 220/440V 60Hz.',
        'Equipamiento: Válvula de emergencia, manómetros dobles y regulador de presión.'
      ],
      accionamiento: [
        '1. Enchufar a red eléctrica y conectar manguera neumática.',
        '2. Halar hacia arriba la perilla roja de arranque en el presostato.',
        '3. El funcionamiento es automático comandado por el presostato.'
      ],
      mantenimiento: [
        { frec: 'DIARIA', act: 'Revisar nivel de aceite del elemento de bombeo. Verificar estado de polea y válvula antirretorno.' },
        { frec: 'SEMANAL', act: 'Sacudir elemento del filtro de aire. Purgar la humedad acumulada abriendo la válvula inferior del calderín.' },
        { frec: 'QUINCENAL', act: 'Cambio de aceite lubricante del motor y limpieza exterior.' }
      ],
      recomendaciones: 'Desconectar siempre de la corriente antes de realizar mantenimientos. No operar cerca de líquidos inflamables.'
    }
  };

  // Función de impresión PDF Oficial ISO
  const handlePrintDocumentoOficial = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>MAN-PME-001 - Programa de Mantenimiento de Equipos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; line-height: 1.5; font-size: 12px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .header-table td { border: 1px solid #334155; padding: 8px; text-align: center; font-size: 11px; }
          .header-title { font-size: 13px; font-weight: bold; text-transform: uppercase; }
          h2 { color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-top: 20px; font-size: 14px; }
          .section-title { font-weight: bold; background: #f1f5f9; padding: 6px; margin-top: 15px; border-left: 4px solid #0284c7; }
          table.data-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          table.data-table th, table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 11px; }
          table.data-table th { background: #e2e8f0; font-weight: bold; }
          .footer-signatures { margin-top: 40px; width: 100%; border-collapse: collapse; }
          .footer-signatures td { border: none; text-align: center; padding-top: 40px; font-size: 11px; }
          .line { border-top: 1px solid #475569; width: 80%; margin: 0 auto 4px auto; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td width="20%"><strong style="font-size:16px; color:#0284c7;">OCA ONE</strong><br/>Sistema HACCP / ISO 22000</td>
            <td width="60%" class="header-title">
              PROGRAMA DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO DE EQUIPOS E INSTRUMENTOS DE MEDICIÓN
            </td>
            <td width="20%">
              <strong>CÓDIGO:</strong> MAN-PME-001<br/>
              <strong>VERSIÓN:</strong> 3.0.0<br/>
              <strong>FECHA:</strong> 06/07/2022
            </td>
          </tr>
        </table>

        <div class="section-title">1. INTRODUCCIÓN Y OBJETIVO</div>
        <p>El mantenimiento industrial (preventivo y correctivo) es un conjunto de acciones encaminadas a la funcionalidad y durabilidad de la maquinaria, equipos e instalaciones, de tal manera que permanezcan sirviendo en óptimas condiciones y se detecten fallas a tiempo.</p>
        <p><strong>Objetivo:</strong> Establecer el procedimiento para llevar a cabo el mantenimiento de los equipos para lograr confiabilidad, funcionalidad y durabilidad de los equipos y evitar retrasos en la producción.</p>
        <p><strong>Alcance:</strong> Aplica a todos los equipos e instrumentos de medición que son necesarios para llevar a cabo el cumplimiento de los procesos en la planta.</p>

        <div class="section-title">2. DEFINICIONES GENERALES</div>
        <ul>
          <li><strong>Disponibilidad:</strong> Probabilidad de que el equipo esté en servicio o presto para operar cuando sea requerido.</li>
          <li><strong>Fiabilidad:</strong> Probabilidad de que el equipo opere correctamente durante un período determinado.</li>
          <li><strong>Mantenimiento Preventivo:</strong> Inspección periódica de los equipos de la planta para descubrir las condiciones que conducen a paros imprevistos de producción o desgaste perjudicial.</li>
          <li><strong>Mantenimiento Correctivo:</strong> Corregir los defectos observados en los equipos o instalaciones; consiste en localizar fallos y reparar.</li>
        </ul>

        <div class="section-title">3. PROCEDIMIENTOS DE MANTENIMIENTO PREVENTIVO Y CORRECTIVO</div>
        <p><strong>Preventivo:</strong> Limpieza pre-operacional diaria, revisión semanal con fichas de datos y desmontaje mensual de partes accesibles para extractores y ventiladores. Los equipos complejos (caldera, cuartos fríos, hiladoras) son intervenidos por personal calificado.</p>
        <p><strong>Correctivo:</strong> 1. Evaluar el daño. 2. Analizar causas. 3. Corregir causas. 4. Reparar/ajustar/cambiar piezas defectuosas. 5. Ejecutar pruebas y ajustes finales.</p>

        <div class="section-title">4. REGISTRO Y FORMATO ASOCIADO</div>
        <p>Las actividades de mantenimiento realizadas a los equipos quedan registradas de forma obligatoria en la bitácora <strong>FOPME-002 (FORMATO DE MANTENIMIENTO REALIZADO A EQUIPOS Y MAQUINARIA)</strong>.</p>

        <table class="footer-signatures">
          <tr>
            <td width="50%">
              <div class="line"></div>
              <strong>Elaboró / Revisó:</strong><br/>
              Téc. Mateo Morales / Líder Mantenimiento
            </td>
            <td width="50%">
              <div class="line"></div>
              <strong>Aprobó:</strong><br/>
              Ing. Carlos Gómez / Director de Calidad
            </td>
          </tr>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  // Función de impresión del Formato Blanco FOPME-002
  const handlePrintFormatoBlanco = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>FOPME-002 - Formato de Mantenimiento Realizado a Equipos</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 25px; color: #0f172a; line-height: 1.4; font-size: 11px; }
          .header-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .header-table td { border: 1px solid #334155; padding: 6px; text-align: center; }
          .meta-box { border: 1px solid #cbd5e1; padding: 8px; margin-bottom: 15px; background: #f8fafc; }
          table.log-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          table.log-table th, table.log-table td { border: 1px solid #475569; padding: 8px; text-align: left; }
          table.log-table th { background: #e2e8f0; font-weight: bold; text-transform: uppercase; font-size: 10px; }
          .empty-row { height: 35px; }
          .footer-signature { margin-top: 50px; width: 100%; border-collapse: collapse; }
          .footer-signature td { text-align: center; border: none; }
          .line { border-top: 1px solid #000; width: 75%; margin: 0 auto 4px auto; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td width="20%"><strong style="font-size:15px; color:#0284c7;">OCA ONE</strong><br/>Control de Calidad</td>
            <td width="60%"><strong style="font-size:13px; text-transform:uppercase;">FORMATO DE REGISTRO DE MANTENIMIENTO REALIZADO A EQUIPOS Y MAQUINARIA</strong></td>
            <td width="20%"><strong>CÓDIGO:</strong> FOPME-002<br/><strong>VERSIÓN:</strong> 2.0.0</td>
          </tr>
        </table>

        <div class="meta-box">
          <table width="100%" style="border:none;">
            <tr>
              <td><strong>Planta / Empresa:</strong> ____________________________</td>
              <td><strong>Área Operativa:</strong> ____________________________</td>
              <td><strong>Fecha de Inspección:</strong> ____ / ____ / 2026</td>
            </tr>
          </table>
        </div>

        <table class="log-table">
          <thead>
            <tr>
              <th width="15%">Equipo / Código</th>
              <th width="12%">Tipo Intervención</th>
              <th width="35%">Descripción de Actividad Realizada</th>
              <th width="18%">Repuestos / Insumos Usados</th>
              <th width="10%">Estado Final</th>
              <th width="10%">Técnico / Firma</th>
            </tr>
          </thead>
          <tbody>
            ${[1,2,3,4,5,6,7,8,9,10].map(() => `
              <tr class="empty-row">
                <td></td><td></td><td></td><td></td><td></td><td></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table class="footer-signature">
          <tr>
            <td width="50%">
              <div class="line"></div>
              <strong>Firma del Técnico de Mantenimiento</strong>
            </td>
            <td width="50%">
              <div class="line"></div>
              <strong>Firma / V°B° Supervisor de Calidad</strong>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  const eqActivo = equiposDetalle[equipoSeleccionadoTab] || equiposDetalle.motobomba;

  return (
    <div className="fade-in-view">
      {/* Alerta de Registro Exitoso */}
      {alertaExito && (
        <div className="alert alert-success alert-dismissible fade show shadow border-0 mb-4" role="alert" style={{ borderRadius: '10px' }}>
          <strong><i className="bi bi-check-circle-fill me-2"></i>¡Registro de Mantenimiento Guardado!</strong> La intervención técnica ha sido indexada en la bitácora FOPME-002 del establecimiento.
          <button type="button" className="btn-close" onClick={() => setAlertaExito(false)}></button>
        </div>
      )}

      {/* Encabezado Principal Módulo de Mantenimiento */}
      <div className="d-flex align-items-center justify-content-between p-3 mb-4 rounded-3 border bg-body shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-indigo" style={{ width: '44px', height: '44px', fontSize: '22px' }}>
            <i className="bi bi-tools"></i>
          </div>
          <div>
            <div className="fw-bold font-heading text-dark" style={{ fontSize: '17px' }}>Módulo de Mantenimiento de Equipos e Maquinaria (MAN-PME)</div>
            <div className="text-muted small">Gestión completa de procedimientos, especificaciones técnicas, accionamientos y registros FOPME-002.</div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
            onClick={() => setMostrarTextoCompleto(true)}
          >
            <i className="bi bi-file-earmark-text"></i> 📖 Leer Documento Completo Word
          </button>
          <button 
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2"
            onClick={() => setMostrarHistorial(true)}
          >
            <i className="bi bi-clock-history"></i> Historial de Versiones
          </button>
        </div>
      </div>

      <div className="d-flex flex-column gap-4">
        
        {/* BLOQUE 1: Procedimiento Oficial ISO (MAN-PME-001) */}
        <div className="card gipa-card p-4 border-0 shadow-sm border-top border-5 border-primary">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="badge bg-primary-subtle text-primary me-2 fw-semibold">MAN-PME-001</span>
              <span className="badge bg-success-subtle text-success">Versión 3.0.0 Vigente</span>
            </div>
            {canDownloadPDF ? (
              <button 
                className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2 fw-semibold"
                onClick={handlePrintDocumentoOficial}
              >
                <i className="bi bi-file-earmark-pdf-fill text-danger"></i> Previsualizar / Descargar PDF Oficial ISO
              </button>
            ) : (
              <button className="btn btn-outline-secondary btn-sm disabled" title="Descarga restringida por rol (Solo Super Administrador)">
                <i className="bi bi-lock-fill me-1"></i> Descarga Restringida por Rol
              </button>
            )}
          </div>

          <h4 className="fw-bold font-heading text-dark mb-2">
            Programa de Mantenimiento Preventivo y Correctivo de Equipos e Instrumentos
          </h4>
          <p className="text-muted small mb-3">
            Manual maestro extraído directamente del documento Word oficial del establecimiento. Contiene los parámetros operativos, secuencia de encendido (accionamiento) y programas de inspección.
          </p>

          {/* Navegación por Pestañas de Equipos */}
          <div className="mb-3">
            <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-cpu me-2 text-primary"></i>Seleccionar Ficha Técnica de Equipo:</h6>
            <div className="d-flex flex-wrap gap-1 bg-light p-2 rounded-3 border">
              {[
                { id: 'motobomba', label: 'Motobomba Recepción' },
                { id: 'electrobomba', label: 'Electrobomba Cuajado' },
                { id: 'hiladoras', label: 'Hiladoras' },
                { id: 'moldeadora', label: 'Moldeadora' },
                { id: 'cuartos_frios', label: 'Cuartos Fríos' },
                { id: 'caldera', label: 'Caldera 60 BHP' },
                { id: 'planta_electrica', label: 'Planta Eléctrica 80 KVA' },
                { id: 'compresor', label: 'Compresor 2HP' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`btn btn-sm ${equipoSeleccionadoTab === tab.id ? 'btn-primary fw-bold shadow-sm' : 'btn-outline-secondary border-0'}`}
                  onClick={() => setEquipoSeleccionadoTab(tab.id)}
                  style={{ borderRadius: '8px', fontSize: '12px' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ficha Detallada del Equipo Seleccionado */}
          <div className="border rounded-3 p-4 bg-body shadow-sm fade-in-view">
            <h5 className="fw-bold text-primary font-heading mb-3 border-bottom pb-2">
              <i className="bi bi-gear-fill me-2"></i>{eqActivo.nombre}
            </h5>

            <div className="row g-4">
              {/* Columna 1: Especificaciones Técnicas */}
              <div className="col-12 col-md-6 border-end">
                <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-card-list me-2 text-info"></i>Especificaciones Técnicas:</h6>
                <ul className="list-unstyled text-muted small mb-3">
                  {eqActivo.especificaciones.map((esp, i) => (
                    <li key={i} className="mb-1 d-flex align-items-start">
                      <i className="bi bi-check2-circle text-success me-2 mt-1"></i>
                      <span>{esp}</span>
                    </li>
                  ))}
                </ul>

                <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-play-circle me-2 text-success"></i>Secuencia de Accionamiento (Encendido):</h6>
                <div className="bg-light p-3 rounded-3 border mb-3 text-dark small">
                  {eqActivo.accionamiento.map((acc, i) => (
                    <div key={i} className="mb-1">{acc}</div>
                  ))}
                </div>
              </div>

              {/* Columna 2: Frecuencia de Mantenimiento y Recomendaciones */}
              <div className="col-12 col-md-6">
                <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-calendar-check me-2 text-warning"></i>Plan de Mantenimiento Preventivo:</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm table-bordered align-middle mb-0" style={{ fontSize: '12px' }}>
                    <thead className="table-light">
                      <tr>
                        <th width="25%">Frecuencia</th>
                        <th>Actividad a Ejecutar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eqActivo.mantenimiento.map((m, i) => (
                        <tr key={i}>
                          <td><span className="badge bg-primary-subtle text-primary fw-bold">{m.frec}</span></td>
                          <td className="text-muted">{m.act}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-shield-exclamation me-2 text-danger"></i>Recomendaciones de Seguridad Operativa:</h6>
                <div className="alert alert-warning py-2 px-3 small border-warning border-opacity-50 mb-0 rounded-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{eqActivo.recomendaciones}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BLOQUE 2: Formatos Imprimibles y Bitácora Digital FOPME-002 */}
        <div className="card gipa-card p-4 border-0 shadow-sm">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="card-title font-heading mb-1 text-dark">
                <i className="bi bi-printer-fill text-success me-2"></i>Formatos Imprimibles y Bitácora Digital (FOPME-002)
              </h4>
              <p className="text-muted small mb-0">Descarga la plantilla vacía o registra las intervenciones técnicas ejecutadas.</p>
            </div>
            
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-outline-success d-flex align-items-center gap-2"
                onClick={handlePrintFormatoBlanco}
              >
                <i className="bi bi-printer"></i> Imprimir Formato Blanco (FOPME-002)
              </button>
              
              <button 
                className="btn btn-sm btn-success d-flex align-items-center gap-2"
                onClick={() => setMostrarRegistroForm(prev => !prev)}
              >
                <i className="bi bi-plus-circle"></i> {mostrarRegistroForm ? 'Cerrar Formulario' : 'Diligenciar Formato Mantenimiento'}
              </button>
            </div>
          </div>

          {/* Formulario de Diligenciamiento */}
          {mostrarRegistroForm && (
            <form onSubmit={handleCrearRegistro} className="border p-4 rounded-3 bg-light bg-opacity-50 mb-4 fade-in-view" style={{ fontSize: '13px' }}>
              <h5 className="fw-bold text-success font-heading mb-3">
                <i className="bi bi-journal-plus me-2"></i>Registrar Mantenimiento Realizado a Equipo
              </h5>
              <div className="row g-3 mb-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Equipo / Maquinaria</label>
                  <select 
                    className="form-select form-select-sm"
                    value={nuevoEquipo}
                    onChange={(e) => setNuevoEquipo(e.target.value)}
                  >
                    <option value="Motobomba Recepción GX 120">Motobomba Recepción GX 120</option>
                    <option value="Electrobomba Cuajado 2HP">Electrobomba Cuajado 2HP</option>
                    <option value="Hiladora de Queso 3HP">Hiladora de Queso 3HP</option>
                    <option value="Moldeadora Industrial 250kg">Moldeadora Industrial 250kg</option>
                    <option value="Plancha Selladora Baquelita">Plancha Selladora Baquelita</option>
                    <option value="Cuarto Frío de Choque 5HP">Cuarto Frío de Choque 5HP</option>
                    <option value="Cuarto Frío Producto Terminado 7.5HP">Cuarto Frío Producto Terminado 7.5HP</option>
                    <option value="Caldera Pirotubular 60 BHP">Caldera Pirotubular 60 BHP</option>
                    <option value="Planta Eléctrica Cummins 80 KVA">Planta Eléctrica Cummins 80 KVA</option>
                    <option value="Compresor de Aire 2HP">Compresor de Aire 2HP</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Tipo de Intervención</label>
                  <select 
                    className="form-select form-select-sm"
                    value={nuevoTipo}
                    onChange={(e) => setNuevoTipo(e.target.value)}
                  >
                    <option value="Preventivo">Preventivo (Programado)</option>
                    <option value="Correctivo">Correctivo (Reparación)</option>
                    <option value="Emergencia">Reparación de Emergencia</option>
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-semibold small">Estado del Equipo</label>
                  <select 
                    className="form-select form-select-sm"
                    value={nuevoEstado}
                    onChange={(e) => setNuevoEstado(e.target.value)}
                  >
                    <option value="Operativo">Operativo (100% Funcional)</option>
                    <option value="En Pruebas">En Pruebas Operativas</option>
                    <option value="Fuera de Servicio">Fuera de Servicio / Averiado</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold small">Descripción de la Actividad Realizada</label>
                <textarea 
                  className="form-control form-control-sm" 
                  rows="2"
                  placeholder="Ej: Cambio de lubricante del cárter, purga de condensados y ajuste de bandas del motor..."
                  value={nuevaActividad}
                  onChange={(e) => setNuevaActividad(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Repuestos e Insumos Utilizados</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Filtro de aceite, empacadura teflón 3/4"
                    value={nuevosRepuestos}
                    onChange={(e) => setNuevosRepuestos(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold small">Técnico / Responsable de Ejecución</label>
                  <input 
                    type="text" 
                    className="form-control form-control-sm" 
                    placeholder="Ej: Téc. Mateo Morales"
                    value={nuevoTecnico}
                    onChange={(e) => setNuevoTecnico(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setMostrarRegistroForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-sm btn-success px-3">
                  <i className="bi bi-save me-1"></i> Guardar Registro FOPME-002
                </button>
              </div>
            </form>
          )}

          {/* Tabla de Bitácora Digital */}
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0" style={{ fontSize: '13px' }}>
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Equipo / Maquinaria</th>
                  <th>Tipo</th>
                  <th>Actividad Realizada</th>
                  <th>Repuestos Utilizados</th>
                  <th>Técnico</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {registrosMantenimiento.map(reg => (
                  <tr key={reg.id}>
                    <td className="fw-semibold text-muted" style={{ fontSize: '12px' }}>{reg.fecha}</td>
                    <td className="fw-bold text-dark">{reg.equipo}</td>
                    <td>
                      <span className={`badge ${reg.tipo === 'Preventivo' ? 'bg-primary-subtle text-primary' : 'bg-warning-subtle text-warning-emphasis'}`}>
                        {reg.tipo}
                      </span>
                    </td>
                    <td>{reg.actividad}</td>
                    <td className="small text-muted">{reg.repuestos}</td>
                    <td>{reg.tecnico}</td>
                    <td>
                      <span className={`badge ${reg.estado === 'Operativo' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                        <i className={`bi ${reg.estado === 'Operativo' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-1`}></i>
                        {reg.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Lector Completo del Documento Word (MAN-PME-001) */}
      {mostrarTextoCompleto && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '18px' }}>
              <div className="modal-header bg-dark text-white border-0" style={{ borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }}>
                <h5 className="modal-title font-heading fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-file-word-fill text-primary"></i> Documento Oficial Word: MAN - PME PROGRAMA DE MANTENIMIENTO DE EQUIPOS
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarTextoCompleto(false)}></button>
              </div>
              <div className="modal-body p-4 bg-body" style={{ fontSize: '13.5px', lineHeight: '1.6' }}>
                <div className="border p-4 rounded-3 bg-white shadow-sm">
                  <div className="text-center border-bottom pb-3 mb-4">
                    <h3 className="fw-bold font-heading text-dark">PROGRAMA DE MANTENIMIENTO DE EQUIPOS</h3>
                    <div className="badge bg-primary px-3 py-2 fs-6">CÓDIGO: MAN-PME-001 | VERSIÓN: 3.0.0</div>
                  </div>

                  <h5 className="fw-bold text-primary border-bottom pb-1">1. INTRODUCCIÓN</h5>
                  <p>El mantenimiento industrial (preventivo y correctivo) es un conjunto de acciones encaminadas a la funcionalidad y durabilidad de la maquinaria, equipos e instalaciones, de tal manera que permanezcan sirviendo en óptimas condiciones y se detecten fallas a tiempo.</p>
                  <p>En la actualidad, gracias al desarrollo de nuevas tecnologías, el uso de diferentes técnicas de inspección para el mantenimiento industrial de equipos es algo común. Dichas técnicas permiten un estudio estadístico de los parámetros más importantes para conocer la condición operacional de cada equipo. Al realizar el monitoreo continuo, recolectando datos sobre el estado de los equipos, es posible predecir el momento para realizar paradas programadas y así reducir el número de intervenciones necesarias para cada equipo, garantizando una mayor continuidad del proceso productivo.</p>

                  <h5 className="fw-bold text-primary border-bottom pb-1 mt-4">2. OBJETIVO Y ALCANCE</h5>
                  <p><strong>Objetivo:</strong> Establecer el procedimiento para llevar a cabo el mantenimiento de los equipos para lograr confiabilidad, funcionalidad y durabilidad de los equipos y evitar retrasos en la producción.</p>
                  <p><strong>Alcance:</strong> Este programa aplica para todos los equipos e instrumentos de medición que son necesarios para llevar a cabo el cumplimiento de los procesos en la planta.</p>

                  <h5 className="fw-bold text-primary border-bottom pb-1 mt-4">3. DEFINICIONES</h5>
                  <ul>
                    <li><strong>Disponibilidad:</strong> Probabilidad de que el equipo esté en servicio o presto para operar cuando sea requerido.</li>
                    <li><strong>Fiabilidad:</strong> Probabilidad de que el equipo o la máquina opere correctamente durante un período determinado de tiempo.</li>
                    <li><strong>Mantenibilidad:</strong> Capacidad de un equipo de ser llevado a su funcionamiento regular mediante tareas de mantenimiento necesarias.</li>
                    <li><strong>Mantenimiento Correctivo:</strong> Corregir los defectos observados en los equipos o instalaciones; es la forma más básica de mantenimiento y consiste en localizar fallos y corregirlos o repararlos.</li>
                    <li><strong>Mantenimiento Preventivo:</strong> Inspección periódica de los equipos de la planta para descubrir las condiciones que conducen a paros imprevistos de producción o desgaste perjudicial. Corregir dichas condiciones aun cuando se encuentre en una fase inicial.</li>
                    <li><strong>Reparaciones de Emergencia:</strong> Son aquellas que deben ejecutarse inmediatamente para prevenir pérdidas de producción, averías serias en los equipos o para corregir peligros.</li>
                  </ul>

                  <h5 className="fw-bold text-primary border-bottom pb-1 mt-4">4. MANTENIMIENTO PREVENTIVO Y CORRECTIVO</h5>
                  <p><strong>Procedimiento Preventivo:</strong> Limpieza pre-operacional diaria, revisión semanal con fichas de datos y desmontaje mensual de partes accesibles para extractores y ventiladores. Los equipos complejos (caldera, cuartos fríos, hiladoras) son intervenidos por personal calificado.</p>
                  <p><strong>Procedimiento Correctivo:</strong> 1. Evaluar el daño causado. 2. Analizar causas de la falla. 3. Corregir las causas. 4. Reparar, ajustar o cambiar piezas defectuosas. 5. Ejecutar pruebas y ajustes finales.</p>
                </div>
              </div>
              <div className="modal-footer border-top-0 p-3 bg-light" style={{ borderBottomLeftRadius: '18px', borderBottomRightRadius: '18px' }}>
                <button type="button" className="btn btn-primary btn-sm px-4 fw-bold" onClick={() => setMostrarTextoCompleto(false)}>
                  Entendido / Cerrar Lector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Historial de Versiones ISO */}
      {mostrarHistorial && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="modal-header bg-primary text-white border-0" style={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <h5 className="modal-title font-heading fw-bold">
                  <i className="bi bi-clock-history me-2"></i>Historial de Versiones - MAN-PME-001
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setMostrarHistorial(false)}></button>
              </div>
              <div className="modal-body p-4">
                <div className="alert alert-info py-2 px-3 small border-0 mb-3" style={{ borderRadius: '8px' }}>
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Trazabilidad de cambios según los requisitos de auditoría ISO 9001, ISO 22000 y BPM.
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle border mb-0" style={{ fontSize: '13px' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Versión</th>
                        <th>Fecha</th>
                        <th>Solicitante / Cargo</th>
                        <th>Descripción del Cambio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span className="badge bg-secondary">v1.0.0</span></td>
                        <td>12 / 01 / 2016</td>
                        <td>Jefe de Calidad</td>
                        <td>Creación inicial del programa de mantenimiento de equipos de la planta.</td>
                      </tr>
                      <tr>
                        <td><span className="badge bg-secondary">v2.0.0</span></td>
                        <td>25 / 08 / 2019</td>
                        <td>Jefe de Calidad</td>
                        <td>Actualización de procedimientos e inclusión de fichas técnicas de electrobombas y moldeadora.</td>
                      </tr>
                      <tr>
                        <td><span className="badge bg-primary">v3.0.0</span></td>
                        <td>06 / 07 / 2022</td>
                        <td>Jefe de Calidad / Mantenimiento</td>
                        <td>Actualización General con parámetros de caldera pirotubular 60 BHP y generador Cummins 80 KVA.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-top-0 p-3 bg-light" style={{ borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMostrarHistorial(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
