import React, { useState, useEffect } from 'react';
import { canUserDownloadProcedure, canUserEditDocument } from '../lib/permissions';

export default function Mantenimiento({ tenantId = 'tenant-opt-01', userRole = 'super-admin', carpetaActiva, setCarpetaActiva }) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [mostrarTextoCompleto, setMostrarTextoCompleto] = useState(false);
  const [mostrarRegistroForm, setMostrarRegistroForm] = useState(false);
  const [equipoSeleccionadoTab, setEquipoSeleccionadoTab] = useState('motobomba');
  const [alertaExito, setAlertaExito] = useState(false);

  // Sincronizar selección desde el Sidebar
  useEffect(() => {
    if (!carpetaActiva) return;
    const mapaTabs = {
      'Motobomba Recepción GX 120': 'motobomba',
      'Electrobomba Cuajado 2HP': 'electrobomba',
      'Hiladoras de Queso 3HP': 'hiladoras',
      'Moldeadora Industrial 250kg': 'moldeadora',
      'Caldera Pirotubular 60 BHP': 'caldera',
      'Planta Eléctrica Cummins 80 KVA': 'planta_electrica',
      'Compresor 2HP (Área Neumática)': 'compresor',
      'Cuartos Fríos (5HP y 7.5HP)': 'cuartos_frios',
      'Ventiladores Industriales 26"': 'ventiladores',
      'Extractores de Aire 14"': 'extractores',
      'Plancha Selladora Baquelita': 'plancha_selladora'
    };

    if (mapaTabs[carpetaActiva]) {
      setEquipoSeleccionadoTab(mapaTabs[carpetaActiva]);
    } else if (carpetaActiva === 'FOPME-002') {
      setMostrarRegistroForm(true);
    }
  }, [carpetaActiva]);

  // Registros de mantenimiento realizados (FOPME-002)
  const [registrosMantenimiento, setRegistrosMantenimiento] = useState([
    {
      id: 1,
      fecha: '2026-08-01',
      equipo: 'Motobomba Recepción GX 120',
      tipo: 'Preventivo',
      actividad: 'Comprobación del estado general del motor en busca de signos de fugas de aceite o gasolina. Ajuste de pernos y revisión de filtro de aire.',
      tecnico: 'Téc. Mateo Morales',
      repuestos: 'Aceite 10W-30 (0.6Q), Sello mecánico',
      estado: 'Operativo'
    },
    {
      id: 2,
      fecha: '2026-08-05',
      equipo: 'Cuarto Frío de Choque 5HP',
      tipo: 'Preventivo',
      actividad: 'Limpieza de serpentines evaporadores con hidrolavadora hasta retirar exceso de hielo. Inspección de presostato y relés térmicos.',
      tecnico: 'Ing. Mateo Morales / FrigoServicios',
      repuestos: 'Ninguno',
      estado: 'Operativo'
    },
    {
      id: 3,
      fecha: '2026-08-07',
      equipo: 'Hiladoras de Queso 3HP',
      tipo: 'Correctivo',
      actividad: 'Reemplazo de potenciómetro en tablero comandado por variador LS. Inspección de retenes, V-rings y chumaceras.',
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

  // Base de datos de equipos con texto 100% literal extraído de las 13 tablas del documento Word original
  const equiposDetalle = {
    motobomba: {
      nombre: 'Motobomba Honda GX 120 (Recepción de Leche)',
      imagen: '/images/mantenimiento/image2.png',
      descripcionWord: 'Motobomba Honda GX 120 de alta confiabilidad con eje de toma de fuerza tipo S, diseñada para trasvase pre-operacional en la recepción de leche cruda.',
      especificaciones: [
        'Modelo: GX 120 (eje de la toma de fuerza tipo S)',
        'Dimensiones (Longitud x Anchura x Altura): 297 x 341 x 318 mm',
        'Peso en seco: 13 Kg',
        'Tipo de motor: 4 tiempos, válvulas en cabeza, monocilíndrico',
        'Cilindrada: 119 cm³',
        'Potencia máx.: 2,9 kW a 3600 min⁻¹ (rpm)',
        'Torsión máx.: 7,4 N.m a 2500 min⁻¹ (rpm)',
        'Capacidad de aceite de motor: 0,60 Q',
        'Capacidad del depósito de combustible: 2,5 Q',
        'Consumo de combustible: 313 g/kWh (230 g/PSh)',
        'Sistema de enfriamiento: aire forzado',
        'Sistema de encendido: magneto transistorizado'
      ],
      accionamiento: [
        '1. Girar la válvula del combustible a la posición ON.',
        '2. Mover la palanca del estrangulador a la posición CERRADO para arrancar en frío.',
        '3. Mover la palanca del acelerador un poco hacia la izquierda.',
        '4. Girar el interruptor del motor a la posición ON.',
        '5. Tirar ligeramente de la empuñadura del arrancador hasta notar resistencia, y luego tirar con fuerza.',
        '6. A medida que el motor se caliente, girar gradualmente la palanca del estrangulador hacia la posición ABIERTO.',
        '7. Ajustar la palanca del acelerador para obtener la velocidad del motor deseada.'
      ],
      notaAccionamiento: 'NOTA: No tire de la empuñadura del arrancador de golpe mientras el motor esté en marcha para evitar daños en el mecanismo de arranque.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Comprobación del estado general del motor. Mirar en busca de signos de fugas de aceite o gasolina. Comprobar que no hay protectores, cubiertas, tuercas y pernos sueltos o apretados de forma inadecuada. Mirar el nivel del combustible. Mirar el elemento del filtro de aire.' },
        { frec: 'SEMANAL', act: 'Extraer el polvo o la suciedad acumulada alrededor del silenciador y arrancador. Comprobar nivel de aceite del motor.' },
        { frec: 'SEMESTRAL', act: 'Cambio de sello para evitar derrames de leche.' }
      ],
      recomendaciones: 'Mantener apartado de materiales inflamables. No fumar cerca del equipo. Suministrar combustible y ejecutar mantenimiento siempre con el motor apagado y en frío.'
    },
    electrobomba: {
      nombre: 'Electrobomba 2HP (Área de Cuajado)',
      imagen: '/images/mantenimiento/image3.png',
      descripcionWord: 'Electrobomba centrífuga de alta eficiencia para impulsión de agua tratada y suero lácteo en los tanques de cuajado.',
      especificaciones: [
        'Potencia de 1500W',
        '2 HP',
        'Eficiencia energética: 71.9%',
        'Revoluciones: 3450 RPM',
        'Voltaje: 110/220 V',
        'Frecuencia: 60 HZ'
      ],
      accionamiento: [
        '1. Conectar a una corriente eléctrica.',
        '2. Presionar el botón de color verde que se encuentra en la caja de control.'
      ],
      notaAccionamiento: 'Nota: Presionar el botón de color rojo para apagar o parar el equipo.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Comprobar que la velocidad de la bomba de agua se corresponde con la salida. Examinar las bridas para detectar fugas, fisuras, oxidación.' },
        { frec: 'SEMANAL', act: 'Comprobar que los puntos de montaje son seguros. Inspeccionar el sello mecánico. Inspeccionar los acoplamientos y filtros de la bomba. Inspeccionar y limpiar las ventilaciones del motor.' },
        { frec: 'SEMESTRAL', act: 'Lubricación de cojinetes. Comprobar si hay signos de que la elevación de la bomba respecto a la base haya cambiado. Cambiar acoplamientos del motor.' }
      ],
      recomendaciones: 'Realizar un mantenimiento frecuente es una manera de garantizar la eficiencia y prevenir pérdidas imprevistas. Operar y realizar mantenimiento siempre con el equipo apagado.'
    },
    hiladoras: {
      nombre: 'Hiladoras de Queso (Área de Hilado)',
      imagen: '/images/mantenimiento/image4.png',
      descripcionWord: 'Equipo industrial elaborado en acero inoxidable tipo 304 en partes de contacto con alimentos y tipo 430 en cámaras de vapor y aire caliente.',
      especificaciones: [
        'Elaborado en acero inoxidable tipo 304 en las partes que hacen contacto con los alimentos y partes exteriores, tipo 430 en las cámaras de aire caliente y cámara de vapor.',
        'Barras redondas de acero inoxidable tipo 304 calibre 5/16".',
        'Acople de cadena y piñones paso 50 para conectar eje reductor con eje principal de la máquina.',
        'Capacidad de 1600L de leche cuajada.',
        'Sistema de agitación con paletas y cuchillas.',
        'Motor reductor marca SITI de 3 HP con 3 newton/metro de torque.',
        'Caja de controles comandada por variador de frecuencia marca LS.'
      ],
      accionamiento: [
        '1. Colocar el aspa dentro de la máquina y asegurarla adecuadamente con los tornillos.',
        '2. Cerrar el orificio de salida del queso caliente colocándole la tapa y ajustando la abrazadera.',
        '3. Abrir las válvulas de vapor.',
        '4. Encender desde el suiche que se encuentra en el tablero de control.',
        '5. Se le da la velocidad requerida al aspa girando la perilla del potenciómetro.'
      ],
      notaAccionamiento: 'NOTA: Si falla el potenciómetro, utilizar el potenciómetro de regulado de volumen de la tarjeta electrónica mientras se instala el repuesto original.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Realizar procedimiento de limpieza y desinfección de acuerdo con el programa POES. Inspeccionar el estado de las aspas.' },
        { frec: 'SEMANAL', act: 'Revisar las conexiones eléctricas. Limpiar el tablero de control. Inspeccionar conductos y válvulas por donde transita el vapor.' },
        { frec: 'MENSUAL', act: 'MOTOR: Eliminar los depósitos de grasa y suciedad en la tapa del ventilador para garantizar el flujo de aire fresco y evitar el sobrecalentamiento. Controlar retenes y V-rings, chumaceras y tarjetas de variador.' }
      ],
      recomendaciones: 'Si es necesario desmontar el motor y acceder a sus partes internas, esta tarea debe llevarse a cabo por personal altamente cualificado.'
    },
    moldeadora: {
      nombre: 'Moldeadora Industrial 250kg (Área de Moldeo)',
      imagen: '/images/mantenimiento/image5.jpeg',
      descripcionWord: 'Moldeadora automática fabricada en acero inoxidable 304 con dosificación de 400g a 2500g y sistema de inyección mediante tornillos paralelos sinfín.',
      especificaciones: [
        'Material de fabricación: Acero inoxidable tipo 304 y plástico industrial sanitario',
        'Dimensiones: Largo 170cm x ancho 90cm x 165cm',
        'Capacidad de la tolva: 250kg',
        'Capacidad dosificadora: 400g a 2500g',
        'Voltaje: 220V trifásico',
        'Potencia: 3HP',
        'Tracción: Motorreductor sinfín corona y piñones externos.',
        'Sistema de inyección y agitación: Tornillos paralelos tipo sinfín.',
        'Capacidad de producción: 8 a 20 unidades por minuto dependiendo la cantidad a dosificar.'
      ],
      accionamiento: [
        '1. Colocar los tornillos dentro de la tolva y se conectan con los respectivos ejes, teniendo en cuenta la marcación que tiene cada eje y cada tornillo.',
        '2. Colocar las piezas de centro, empaque, tapa brida y se aprietan las mariposas al mismo tiempo para que entre pareja la pieza.',
        '3. Energizar el switch de muletilla y encender el variador.',
        '4. Con el potenciómetro se le da la velocidad requerida y con el temporizador la dosificación.'
      ],
      notaAccionamiento: 'NOTA: Si los cilindros dosificadores presentan resistencia o trabamiento, verificar la presión del compresor neumático de aire.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Realizar procedimiento de limpieza y desinfección de acuerdo al programa POES.' },
        { frec: 'SEMANAL', act: 'Limpiar el tablero de control y verificar que no queden materiales o sustancias extrañas que puedan interferir en su buen funcionamiento. Mangueras de aire neumático y cables de alimentación. Lavado con desincrustante.' },
        { frec: 'MENSUAL', act: 'MOTOR: Eliminar los depósitos de grasa y suciedad en la tapa del ventilador. Inspeccionar rodamientos, retenes y lubricar chumaceras.' }
      ],
      recomendaciones: 'Si es necesario desmontar el motor y acceder a sus partes internas, esta tarea debe llevarse a cabo por personal altamente cualificado.'
    },
    ventiladores: {
      nombre: 'Ventiladores Industriales 26" (Área de Moldeo)',
      imagen: '/images/mantenimiento/image6.jpeg',
      descripcionWord: 'Ventilador metálico oscilante de 26 pulgadas y 7800 CFM de caudal para circulación continua de aire en salas de proceso.',
      especificaciones: [
        'Metálico',
        'Diámetro: 26 pulgadas',
        'Potencia: 230W',
        'Motor: durable y alta potencia',
        'Velocidades: 3',
        'Oscilación: 90°',
        'Trabajo pesado: operación continua',
        'Caudal: 7800CFM',
        'Número de aspas: 3'
      ],
      accionamiento: [
        '1. Enchufar a una corriente eléctrica.',
        '2. Mover el control de velocidad de acuerdo a su necesidad: los números 0, 1, 2, 3 corresponden a apagado, bajo, medio y alto respectivamente.'
      ],
      notaAccionamiento: 'NOTA: Mantener el rejillado de protección limpio para asegurar el caudal nominal de 7800 CFM.',
      mantenimiento: [
        { frec: 'SEMANAL', act: 'Realizar procedimiento de limpieza. Revisar conexión eléctrica.' }
      ],
      recomendaciones: 'Encender únicamente cuando se vaya a usar. Desconectar al terminar la jornada laboral. Realizar el procedimiento de limpieza con el equipo apagado.'
    },
    extractores: {
      nombre: 'Extractores de Aire 14" (Área de Moldeo)',
      imagen: '/images/mantenimiento/image6.jpeg',
      descripcionWord: 'Extractor de aire metálico de 14 pulgadas para evacuación de vapor y humedad ambiental.',
      especificaciones: [
        'Metálico',
        'Medida: 14 pulgadas, 35 cm',
        'Caudal: 580 cm³/h',
        'Potencia: 1/8HP',
        'RPM: 1700'
      ],
      accionamiento: [
        '1. Mover el suiche del taco hacia arriba (ON).'
      ],
      notaAccionamiento: 'NOTA: Esperar hasta que se seque completamente antes de encenderlo tras labores de aseo.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Realizar procedimiento de limpieza y desinfección. Ver A-Z Programa de limpieza y desinfección. Inspeccionar conexión eléctrica.' }
      ],
      recomendaciones: 'Apagar al terminar la jornada laboral. Realizar el procedimiento de limpieza con el equipo apagado. Esperar hasta que se seque para encenderlo.'
    },
    plancha_selladora: {
      nombre: 'Plancha Selladora en Baquelita (Empaque)',
      imagen: '/images/mantenimiento/image7.png',
      descripcionWord: 'Plancha termose selladora fabricada en baquelita con suela de aluminio térmico y protector anti-incendio.',
      especificaciones: [
        'Potencia: 1200 Watts, 120 Vac 60 Hz.',
        'Su cuerpo está fabricado en baquelita, el cual permite que el usuario lo pueda manipular con tranquilidad, ya que no alcanza altas temperaturas.',
        'Cuenta con una suela de planchado en aluminio completamente pulida.',
        'Tiene un cable de alimentación con una longitud de 1.8 metros.',
        'Cuenta con un dispositivo de seguridad interior que evita incendio y el daño del producto cuando el controlador de temperatura se dañe.'
      ],
      accionamiento: [
        '1. Conectar a tomas en buenas condiciones.',
        '2. Graduar la temperatura en el termostato según el calibre del empaque.'
      ],
      notaAccionamiento: 'NOTA: No dejar la suela de aluminio sobre superficies combustibles mientras se encuentre energizada.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Realizar procedimiento de limpieza y desinfección.' },
        { frec: 'MENSUAL', act: 'Cambiar el teflón. Inspeccionar cableado eléctrico.' }
      ],
      recomendaciones: 'No sumergir en agua el cuerpo principal. Conectar solo a tomas en buenas condiciones. Desconectar al terminar.'
    },
    cuartos_frios: {
      nombre: 'Cuartos Fríos (Choque 5HP y Almacenamiento 7.5HP)',
      imagen: '/images/mantenimiento/image8.jpeg',
      descripcionWord: 'Sistemas de refrigeración industrial con aislamiento en poliuretano e inyección de frío para maduración y conservación de queso.',
      especificaciones: [
        'Cuarto de choque: Está fabricado en modulación inyectada en poliuretano al 35% de aislamiento térmico de densidad de alto rendimiento con unas medidas de 212 x 356 x 200cm. Cuenta con un evaporador de 14.500 BTU y una unidad condensadora de 5 HP con motor del ventilador de 1/3 HP.',
        'Cuarto de almacenamiento producto terminado: Fabricado en poliuretano con medidas de 530 x 250 x 240cm. Cuenta con un evaporador de 24.000 BTU y una unidad condensadora de 7.5 HP con dos motores de ventilador axiales de 1/2 HP.',
        'Cuadros metálicos con termostatos digitales Fullgauge MT 512 y relés térmicos.'
      ],
      accionamiento: [
        '1. Verificar las conexiones eléctricas.',
        '2. Cuarto de almacenamiento: Encender la unidad condensadora girando la perilla que se encuentra al lado izquierdo (al encenderlo se ilumina un bombillo de color rojo).',
        '3. Encender los evaporadores girando la perilla del lado derecho (se ilumina un bombillo verde).'
      ],
      notaAccionamiento: 'NOTA: En caso de congelamiento en el serpentín evaporador, apagar la condensadora y mantener el evaporador encendido para deshielo forzado.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Realizar procedimiento de limpieza y desinfección. Tomar registro de temperatura.' },
        { frec: 'SEMANAL', act: 'Limpiar los evaporadores con la hidrolavadora, hasta retirar el exceso de hielo producido.' },
        { frec: 'MENSUAL', act: 'Limpiar el tablero de control. Limpiar e inspeccionar los serpentines. Inspeccionar presostato, sensores de temperatura y lubricar los motores si es necesario. Ajustar los contactos del solenoide. Inspeccionar la tubería por si hay fugas.' },
        { frec: 'TRIMESTRAL', act: 'Verificar todas las tarjetas electrónicas incluyendo los variadores. Lubricación de chumaceras. Limpieza de tubería de drenaje. Revisiones de aceite mediante mirilla: Confirmar que los niveles de aceite estén a la mitad de la mirilla.' }
      ],
      recomendaciones: 'Mantener las puertas herméticamente cerradas. Evitar obstruir la circulación de aire de las colmenas evaporadoras.'
    },
    caldera: {
      nombre: 'Caldera Pirotubular 60 BHP (Servicios Térmicos)',
      imagen: '/images/mantenimiento/image9.png',
      descripcionWord: 'Caldera Pirotubular: agua dentro de la caldera y llama dentro de los tubos. De tres pasos. Automática.',
      especificaciones: [
        'Caldera Pirotubular: agua dentro de la caldera y llama dentro de los tubos.',
        'De tres pasos | Automática',
        'Capacidad: 60 BHP',
        'Eficiencia térmica: 97%',
        'Combustible: gas licuado de petróleo (GLP).',
        'Un manómetro',
        'Un presurector: control de presión.',
        'Un L91: controla el sistema de modificación de la máquina.',
        'Quemador de 1.200.000 BTU',
        'Tanque de agua con capacidad de 1200 litros.',
        'Bomba de agua: Capacidad 3HP, 220V, Eficiencia 82,5%, RPM 3450'
      ],
      accionamiento: [
        '1. Abrir válvula de gas.',
        '2. Verificar que el tanque del agua esté lleno.',
        '3. Abrir válvulas de paso del agua.',
        '4. Encender la bomba de agua: mover hacia la derecha la perilla que se encuentra en la parte superior izquierda del tablero.',
        '5. Encender el quemador: mover hacia la derecha la perilla que se encuentra en la parte superior derecha del tablero.'
      ],
      notaAccionamiento: 'Nota: Las dos perillas se mueven hacia el lado derecho para que la máquina trabaje de manera automática.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Realizar procedimiento de limpieza a su alrededor. Purgar antes de encender: Abrir la válvula de color rojo que se encuentra en la columna de agua, dejar abierta hasta que salga agua clara, hacer el mismo proceso con la válvula, también de color rojo, que se encuentra en la parte trasera de la caldera.' },
        { frec: 'SEMANAL', act: 'Realizar procedimiento de limpieza en la parte externa.' },
        { frec: 'SEMESTRAL', act: 'Limpiar tubería. Verificar si hay fugas. Revisar sistema de control. Realizar limpieza del quemador.' }
      ],
      recomendaciones: 'El mantenimiento semestral lo debe realizar un experto en manejo de calderas.'
    },
    planta_electrica: {
      nombre: 'Planta Eléctrica Cummins 80 KVA (Respaldo de Energía)',
      imagen: '/images/mantenimiento/image10.jpeg',
      descripcionWord: 'Grupo electrógeno con motor diésel Cummins 4BTA3.9-G2 y alternador Marathon de 80 KVA para respaldo automático de la planta.',
      especificaciones: [
        'Características motor: Marca Cummins, Motor 4BTA3.9-G2, Cilindros: 4 en línea, Tiempos: 4, Desplazamiento: 3,9, Velocidad de giro: 1800 RPM, Potencia Standby: 73,9 Kw (99,0 bhp), Tipo de gobernador: electrónico, Aspiración: Turbocargado/Post Enfriado, Diámetro: 102mm, Carrera: 120mm, Capacidad lubricante: 2,9 gal, Capacidad refrigerante del radiador: 5 gal, Tipo de aire: seco.',
        'Características generador (alternador): Marca Marathon, Tipo: sincrónico, Potencia Standby: 80 Kva, Fases: 3, Conexión: 12 hilos, Factor potencia: 0,8, Frecuencia: 60, Número de polos: 4, Tipo de breaker: Termomagnético, Sistema de excitación: Autoexcitado, Eficiencia: 92%.'
      ],
      accionamiento: [
        'MODO MANUAL: Oprimir el botón MANUAL. Mantener oprimido el botón verde hasta que encienda el equipo.',
        'MODO AUTOMÁTICO: Presionar el botón AUTO, inmediatamente se enciende un led de color rojo.',
        'Es recomendable mantener la planta en modo automático, de esta manera los demás equipos seguirán trabajando de forma normal en caso de que no haya energía eléctrica.'
      ],
      notaAccionamiento: 'NOTA: Mantener el selector en modo AUTO para garantizar la transferencia automática de energía durante cortes del servicio público.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Realizar procedimiento de limpieza en la parte externa de la planta y a su alrededor.' },
        { frec: 'SEMANAL', act: 'Agregar combustible (ACPM). Prender en caso de que no haya sido utilizada para descartar fallas.' },
        { frec: 'MENSUAL', act: 'Cambio de aceite lubricante. Cambio de filtros de combustible y de aire. Revisión de radiador.' }
      ],
      recomendaciones: 'Instalar en un lugar de fácil acceso y buenas condiciones de iluminación para facilitar las operaciones de mantenimiento. Es importante asegurarse de que la planta eléctrica disponga de suficiente ventilación para mantenerlo refrigerado y eliminar el exceso de emanaciones gaseosas y de calor producidas por la combustión del motor. Sobrecarga de la planta eléctrica: NO se debe sobrecargar la planta eléctrica una vez que esté funcionando, aunque están diseñados para soportar condiciones de sobrecarga por un tiempo breve durante el arranque. Si una planta eléctrica funciona durante mucho tiempo en condiciones de sobrecarga (Es decir, a un régimen por encima del régimen máximo de su capacidad) podrán ocurrir varias cosas, como: Recalentamiento del sistema de refrigeración, Recalentamiento de las bobinas del alternador, Disminución de la viscosidad del aceite (Espesor) con la resultante pérdida de presión del aceite, Reducción de la vida útil de la planta eléctrica.'
    },
    compresor: {
      nombre: 'Compresor 2HP (Área Neumática)',
      imagen: '/images/mantenimiento/image11.jpeg',
      descripcionWord: 'Compresor de 80-120psi de presión con tanque de 170 litros de capacidad. Cuenta con un motor de trabajo directo lubricado con aceite para aumentar la vida útil y un par de manómetros junto a un regulador de presión que permite conocer y cambiar sus respectivos niveles.',
      especificaciones: [
        'Potencia de 750W',
        '2HP',
        'Válvula de emergencia.',
        'Eficiencia energética: 75.2%',
        'Revoluciones 3440 rpm',
        'Voltaje: 220/440',
        'Frecuencia 60HZ'
      ],
      accionamiento: [
        '1. Enchufar a una corriente eléctrica.',
        '2. Conectar la manguera de aire.',
        '3. Halar hacia arriba el botón de arranque (perilla de color rojo que se encuentra en la parte superior del presostato).'
      ],
      notaAccionamiento: 'NOTA: El funcionamiento del compresor es completamente automático y es controlado por el interruptor de presión que hace que pare cuando la presión en el receptor de aire alcanza el nivel máximo y vuelve a arrancar cuando baja a un nivel menor.',
      mantenimiento: [
        { frec: 'DIARIA', act: 'Revisar el nivel de aceite del elemento de bombeo antes de cada uso. Verificar si la polea está en buenas condiciones, de lo contrario, debe ser cambiada por otra. Inspeccionar la válvula de anti retorno, si hay fugas se debe reparar o cambiar.' },
        { frec: 'SEMANAL', act: 'Abrir el recipiente del filtro, extraerlo y sacudirlo para remover la suciedad acumulada en éste. Extraer el aire comprimido remanente en el depósito o calderín. Este proceso se realiza desenroscando la válvula de purga que se encuentra en la parte inferior del calderín.' },
        { frec: 'QUINCENAL', act: 'Cambiar el aceite, para que éste preserve sus características lubricantes que le permitan al motor funcionar con adecuada potencia. Realizar procedimiento de limpieza en la parte externa, como tanque, motor y algunos accesorios, teniendo la máxima precaución y evitar que se filtre algún líquido en su parte interna.' }
      ],
      recomendaciones: 'No realizar las labores de mantenimiento del compresor de aire sin antes desconectarlo de la corriente eléctrica. Evitar que el agua o líquidos inflamables entren en contacto con el motor del compresor de aire. No ubicar objetos inflamables cerca del compresor. No operar en espacios cerrados ni cercanos a llamas y bien ventilados.'
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

        <div class="section-title">CONTROL DE CAMBIOS</div>
        <table class="data-table">
          <thead><tr><th>Versión</th><th>Descripción del Cambio</th><th>Solicitante (Cargo)</th><th>Fecha</th></tr></thead>
          <tbody>
            <tr><td>01</td><td>Creación del documento</td><td>Jefe de calidad</td><td>12/01/2016</td></tr>
            <tr><td>02</td><td>Actualización de procedimientos de mantenimiento equipos</td><td>Jefe de calidad</td><td>25/08/2019</td></tr>
            <tr><td>03</td><td>Actualización General</td><td>Jefe de calidad</td><td>06/07/2022</td></tr>
          </tbody>
        </table>

        <div class="section-title">1. INTRODUCCIÓN, OBJETIVO Y ALCANCE</div>
        <p>El mantenimiento industrial (preventivo y correctivo) es un conjunto de acciones encaminadas a la funcionalidad y durabilidad de la maquinaria, equipos e instalaciones. <strong>Objetivo:</strong> Establecer el procedimiento para lograr confiabilidad y durabilidad de los equipos. <strong>Alcance:</strong> Aplica a todos los equipos e instrumentos de medición de la planta.</p>

        <div class="section-title">2. TABLA DE FRECUENCIA DE MANTENIMIENTO DE EQUIPOS</div>
        <table class="data-table">
          <thead><tr><th>Área Operativa</th><th>Equipo / Instalación</th><th>Frecuencia Mantenimiento</th></tr></thead>
          <tbody>
            <tr><td>RECEPCIÓN DE LECHE</td><td>Motobomba Honda GX 120</td><td>Diaria, Semanal y Semestral</td></tr>
            <tr><td>CUAJADO</td><td>Electrobomba 2HP</td><td>Diaria, Semanal y Semestral</td></tr>
            <tr><td>HILADO</td><td>Hiladoras de Queso 3HP</td><td>Diaria, Semanal y Mensual</td></tr>
            <tr><td>MOLDEO</td><td>Moldeadora Industrial 250kg</td><td>Diaria, Semanal y Mensual</td></tr>
            <tr><td>MOLDEO</td><td>Ventiladores 26" / Extractores 14"</td><td>Semanal / Diaria</td></tr>
            <tr><td>EMPAQUE</td><td>Plancha Selladora Baquelita</td><td>Diaria y Mensual</td></tr>
            <tr><td>CUARTOS FRÍOS</td><td>Cuarto Choque 5HP / Almacenamiento 7.5HP</td><td>Diaria, Semanal, Mensual, Trimestral</td></tr>
            <tr><td>OTRAS ÁREAS</td><td>Caldera Pirotubular 60 BHP</td><td>Diaria, Semanal y Semestral</td></tr>
            <tr><td>OTRAS ÁREAS</td><td>Planta Eléctrica Cummins 80 KVA</td><td>Diaria, Semanal y Mensual</td></tr>
            <tr><td>OTRAS ÁREAS</td><td>Compresor de Aire 2HP</td><td>Diaria, Semanal y Quincenal</td></tr>
          </tbody>
        </table>

        <div class="section-title">3. REGISTROS ASOCIADOS</div>
        <p>Las intervenciones técnicas quedan asentadas de forma obligatoria en la bitácora <strong>FOPME-002 (FORMATO DE MANTENIMIENTO REALIZADO A EQUIPOS Y MAQUINARIA)</strong>.</p>

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
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 mb-4 rounded-3 border bg-body shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div className="icon-badge icon-badge-indigo" style={{ width: '44px', height: '44px', fontSize: '22px' }}>
            <i className="bi bi-tools"></i>
          </div>
          <div>
            <div className="fw-bold font-heading text-dark" style={{ fontSize: '17px' }}>Módulo de Mantenimiento de Equipos e Maquinaria (MAN-PME)</div>
            <div className="text-muted small">Gestión completa de procedimientos, imágenes oficiales, especificidades técnicas y registros FOPME-002.</div>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
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
        <div className="card gipa-card p-3 p-md-4 border-0 shadow-sm border-top border-5 border-primary">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
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
            Manual maestro extraído directamente del documento Word oficial. Selecciona la pestaña de cada equipo para visualizar su fotografía oficial, descripción extensa, especificaciones y recomendaciones.
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
                { id: 'ventiladores', label: 'Ventiladores 26"' },
                { id: 'extractores', label: 'Extractores 14"' },
                { id: 'plancha_selladora', label: 'Plancha Selladora' },
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

            {eqActivo.imagen && (
              <div className="text-center mb-3 p-3 bg-white rounded-3 border">
                <img src={eqActivo.imagen} alt={eqActivo.nombre} style={{ maxHeight: '220px', objectFit: 'contain' }} className="img-fluid rounded" />
              </div>
            )}

            {eqActivo.descripcionWord && (
              <div className="p-3 mb-3 bg-white rounded border text-dark small" style={{ textAlign: 'justify', borderLeft: '4px solid #0284c7' }}>
                {eqActivo.descripcionWord}
              </div>
            )}

            <div className="row g-4">
              {/* Columna 1: Especificaciones Técnicas */}
              <div className="col-12 col-md-6 border-end">
                <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-card-list me-2 text-info"></i>Especificaciones Técnicas:</h6>
                <ul className="list-unstyled text-muted small mb-3 ps-2">
                  {eqActivo.especificaciones.map((esp, i) => (
                    <li key={i} className="mb-1 d-flex align-items-start">
                      <i className="bi bi-check2-circle text-success me-2 mt-1"></i>
                      <span>{esp}</span>
                    </li>
                  ))}
                </ul>

                <h6 className="fw-bold text-dark font-heading mb-2"><i className="bi bi-play-circle me-2 text-success"></i>Secuencia de Accionamiento (Encendido):</h6>
                <div className="bg-light p-3 rounded-3 border mb-2 text-dark small">
                  {eqActivo.accionamiento.map((acc, i) => (
                    <div key={i} className="mb-1">{acc}</div>
                  ))}
                </div>
                {eqActivo.notaAccionamiento && (
                  <div className="alert alert-info p-2 small border-0 mb-3" style={{ fontSize: '11.5px', lineHeight: '1.4' }}>
                    <i className="bi bi-info-circle-fill me-1"></i>{eqActivo.notaAccionamiento}
                  </div>
                )}
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
                    <option value="Ventiladores Industriales 26">Ventiladores Industriales 26"</option>
                    <option value="Extractores de Aire 14">Extractores de Aire 14"</option>
                    <option value="Plancha Selladora Baquelita">Plancha Selladora Baquelita</option>
                    <option value="Cuarto Frío de Choque 5HP">Cuarto Frío de Choque 5HP</option>
                    <option value="Cuarto Frío Producto Terminado 7.5HP">Cuarto Frío Producto Terminado 7.5HP</option>
                    <option value="Caldera Pirotubular 60 BHP">Caldera Pirotubular 60 BHP</option>
                    <option value="Planta Eléctrica Cummins 80 KVA">Planta Eléctrica Cummins 80 KVA</option>
                    <option value="Compresor 2HP (Área Neumática)">Compresor 2HP (Área Neumática)</option>
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

                  {/* 1. TABLA DE CONTROL DE CAMBIOS */}
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark font-heading mb-2">
                      <i className="bi bi-clock-history me-2 text-primary"></i>CONTROL DE CAMBIOS DEL DOCUMENTO
                    </h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle mb-0" style={{ fontSize: '12px' }}>
                        <thead className="table-light">
                          <tr>
                            <th width="10%">Versión</th>
                            <th width="45%">Descripción del Cambio</th>
                            <th width="25%">Solicitante (Cargo)</th>
                            <th width="20%">Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><span className="badge bg-secondary">01</span></td>
                            <td>Creación del documento</td>
                            <td>Jefe de calidad</td>
                            <td>12/01/2016</td>
                          </tr>
                          <tr>
                            <td><span className="badge bg-secondary">02</span></td>
                            <td>Actualización de procedimientos de mantenimiento equipos</td>
                            <td>Jefe de calidad</td>
                            <td>25/08/2019</td>
                          </tr>
                          <tr>
                            <td><span className="badge bg-primary">03</span></td>
                            <td>Actualización General</td>
                            <td>Jefe de calidad</td>
                            <td>06/07/2022</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 2. SECCIONES DEL TEXTO MAESTRO */}
                  <div className="mb-4">
                    <h5 className="fw-bold text-primary font-heading border-bottom pb-1 mb-2">1. INTRODUCCIÓN</h5>
                    <p className="text-dark" style={{ textAlign: 'justify' }}>
                      El mantenimiento industrial (preventivo y correctivo) es un conjunto de acciones encaminadas a la funcionalidad y durabilidad de la maquinaria, equipos e instalaciones, de tal manera que permanezcan sirviendo en óptimas condiciones y se detecten fallas a tiempo.
                    </p>
                    <p className="text-dark" style={{ textAlign: 'justify' }}>
                      En la actualidad, gracias al desarrollo de nuevas tecnologías, el uso de diferentes técnicas de inspección para el mantenimiento industrial de equipos es algo común. Dichas técnicas permiten un estudio estadístico de los parámetros más importantes para conocer la condición operacional de cada equipo. Al realizar el monitoreo continuo, recolectando datos sobre el estado de los equipos, es posible predecir el momento para realizar paradas programadas y así reducir el número de intervenciones necesarias para cada equipo, garantizando una mayor continuidad del proceso productivo.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold text-primary font-heading border-bottom pb-1 mb-2">2. OBJETIVO Y ALCANCE</h5>
                    <p className="mb-1 text-dark"><strong>OBJETIVO:</strong> Establecer el procedimiento para llevar a cabo el mantenimiento de los equipos para lograr confiabilidad, funcionalidad y durabilidad de los equipos y evitar retrasos en la producción.</p>
                    <p className="mb-0 text-dark"><strong>ALCANCE:</strong> Este programa aplica para todos los equipos e instrumentos de medición que son necesarios para llevar a cabo el cumplimiento de los procesos en la planta.</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold text-primary font-heading border-bottom pb-1 mb-2">3. DEFINICIONES</h5>
                    <ul className="text-dark">
                      <li><strong>Disponibilidad:</strong> Probabilidad de que el equipo esté en servicio o presto para operar cuando sea requerido.</li>
                      <li><strong>Fiabilidad:</strong> Probabilidad de que el equipo o la máquina opere correctamente durante un período determinado de tiempo.</li>
                      <li><strong>Mantenibilidad:</strong> Capacidad de un equipo de ser llevado a su funcionamiento regular mediante tareas de mantenimiento necesarias.</li>
                      <li><strong>Mantenimiento Correctivo:</strong> Corregir los defectos observados en los equipos o instalaciones, es la forma más básica de mantenimiento y consiste en localizar fallos y corregirlos o repararlos.</li>
                      <li><strong>Mantenimiento Preventivo:</strong> Inspección periódica de los equipos de la planta, para descubrir las condiciones que conducen a paros imprevistos de producción o desgaste perjudicial. Corregir dichas condiciones aun cuando se encuentre en una fase inicial.</li>
                      <li><strong>Reparaciones de Emergencia:</strong> Son aquellas que deben ejecutarse inmediatamente para prevenir pérdidas de producción, averías serias en los equipos o para corregir peligros.</li>
                      <li><strong>Reparaciones Normales:</strong> Son la mayoría de los trabajos de mantenimiento. Se programan tomando en cuenta los requerimientos de producción y la disponibilidad de la fuerza de trabajo y mantenimiento.</li>
                      <li><strong>Reparaciones de Urgencia:</strong> Aquellas que durante la programación normal deben terminarse lo antes posible.</li>
                      <li><strong>Verificación o Inspección:</strong> Consiste en hacer un examen minucioso en forma visual y mediante elementos de medición de cada una de las partes y componentes del equipo con el fin de comprobar que el estado de funcionamiento es el óptimo.</li>
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h5 className="fw-bold text-primary font-heading border-bottom pb-1 mb-2">4. RESPONSABILIDADES Y PROCEDIMIENTOS</h5>
                    <p className="text-dark">Los procesos de mantenimiento de equipos están a cargo de los operarios delegados por el jefe de producción o responsable del funcionamiento de toda la empresa; si la situación no tiene solución se contrata una persona externa.</p>
                    
                    <h6 className="fw-bold text-dark font-heading mt-3">MANTENIMIENTO PREVENTIVO:</h6>
                    <ul className="text-dark">
                      <li>Limpieza de equipos de acuerdo a lo previsto en el manual de limpieza y desinfección de forma periódica (diario), brindando una alerta temprana en caso de observar alguna anomalía.</li>
                      <li>Revisión Periódica (Inspección Semanal) de todos los equipos existentes, diligenciando las fichas de datos básicos.</li>
                      <li>Desmontaje periódico (mensual) en la mayor cantidad de partes posibles para extractores y ventiladores. Para bombas, hiladoras, caldera y cuartos fríos no se deben desmontar por el grado de dificultad de su estructura y deben ser revisados por un profesional calificado.</li>
                    </ul>

                    <h6 className="fw-bold text-dark font-heading mt-3">MANTENIMIENTO CORRECTIVO:</h6>
                    <ol className="text-dark">
                      <li>Evaluar el daño causado por la falla.</li>
                      <li>Analizar la o las causas de la falla.</li>
                      <li>Corregir las causas.</li>
                      <li>Reparar, ajustar o cambiar las piezas defectuosas.</li>
                      <li>Hacer pruebas y ajustes finales necesarios.</li>
                    </ol>
                  </div>

                  {/* 3. TABLA 2. FRECUENCIA DE MANTENIMIENTO DE EQUIPOS */}
                  <div className="mb-5">
                    <h5 className="fw-bold text-primary font-heading border-bottom pb-1 mb-2">5. TABLA 2. FRECUENCIA DE MANTENIMIENTO DE EQUIPOS</h5>
                    <div className="table-responsive">
                      <table className="table table-sm table-striped table-bordered align-middle mb-0" style={{ fontSize: '12.5px' }}>
                        <thead className="table-dark">
                          <tr>
                            <th width="25%">ÁREA OPERATIVA</th>
                            <th width="40%">EQUIPOS E INSTALACIONES</th>
                            <th width="35%">FRECUENCIA DE MANTENIMIENTO</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td>RECEPCIÓN DE LECHE</td><td className="fw-bold">Motobomba</td><td>Diaria, Semanal y Semestral</td></tr>
                          <tr><td>CUAJADO</td><td className="fw-bold">Electrobomba</td><td>Diaria, Semanal y Semestral</td></tr>
                          <tr><td>HILADO</td><td className="fw-bold">Hiladoras</td><td>Diaria, Semanal y Mensual</td></tr>
                          <tr><td>MOLDEO</td><td className="fw-bold">Moldeadora</td><td>Diaria, Semanal y Mensual</td></tr>
                          <tr><td>MOLDEO</td><td className="fw-bold">Ventiladores</td><td>Semanal</td></tr>
                          <tr><td>MOLDEO</td><td className="fw-bold">Extractores</td><td>Semanal</td></tr>
                          <tr><td>EMPAQUE</td><td className="fw-bold">Plancha Selladora</td><td>Diaria y Mensual</td></tr>
                          <tr><td>CUARTOS FRÍOS</td><td className="fw-bold">Cuarto de choque</td><td>Diaria, Semanal, Mensual y Trimestral</td></tr>
                          <tr><td>CUARTOS FRÍOS</td><td className="fw-bold">Cuarto almacenamiento producto terminado</td><td>Diaria, Semanal, Mensual y Trimestral</td></tr>
                          <tr><td>OTRAS ÁREAS</td><td className="fw-bold">Caldera Pirotubular</td><td>Diaria, Semanal y Semestral</td></tr>
                          <tr><td>OTRAS ÁREAS</td><td className="fw-bold">Planta eléctrica Cummins</td><td>Diaria, Semanal y Mensual</td></tr>
                          <tr><td>OTRAS ÁREAS</td><td className="fw-bold">Compresor de Aire 2HP</td><td>Diaria, Semanal y Quincenal</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 4. PROGRAMA DETALLADO POR EQUIPO CON FOTOGRAFÍAS */}
                  <h5 className="fw-bold text-primary font-heading border-bottom pb-2 mb-4">6. FICHAS TÉCNICAS Y PROGRAMAS OPERATIVOS POR EQUIPO</h5>
                  
                  {Object.keys(equiposDetalle).map((key, index) => {
                    const eq = equiposDetalle[key];
                    return (
                      <div key={key} className="card p-3 mb-4 border rounded-3 bg-light bg-opacity-25 shadow-sm">
                        <h5 className="fw-bold font-heading text-dark border-bottom pb-2 mb-3 d-flex justify-content-between align-items-center">
                          <span><span className="badge bg-primary me-2">{index + 1}</span>{eq.nombre}</span>
                        </h5>

                        {eq.imagen && (
                          <div className="text-center mb-3 p-3 bg-white rounded border shadow-sm">
                            <img src={eq.imagen} alt={eq.nombre} style={{ maxHeight: '240px', objectFit: 'contain' }} className="img-fluid rounded" />
                          </div>
                        )}

                        {eq.descripcionWord && (
                          <div className="p-3 mb-3 bg-white rounded border text-dark small" style={{ textAlign: 'justify', borderLeft: '4px solid #0284c7' }}>
                            {eq.descripcionWord}
                          </div>
                        )}

                        <div className="row g-3">
                          <div className="col-12 col-md-6 border-end">
                            <h6 className="fw-bold text-dark small"><i className="bi bi-gear-wide me-1 text-primary"></i> ESPECIFICACIONES:</h6>
                            <ul className="small text-muted mb-3 ps-3">
                              {eq.especificaciones.map((e, idx) => <li key={idx}>{e}</li>)}
                            </ul>
                            <h6 className="fw-bold text-dark small"><i className="bi bi-play-circle me-1 text-success"></i> ACCIONAMIENTO:</h6>
                            <div className="bg-white p-2 rounded border small text-dark mb-2">
                              {eq.accionamiento.map((a, idx) => <div key={idx}>{a}</div>)}
                            </div>
                            {eq.notaAccionamiento && (
                              <div className="alert alert-info p-2 small border-0 mb-2" style={{ fontSize: '11.5px', lineHeight: '1.4' }}>
                                <i className="bi bi-info-circle-fill me-1"></i>{eq.notaAccionamiento}
                              </div>
                            )}
                          </div>
                          <div className="col-12 col-md-6">
                            <h6 className="fw-bold text-dark small"><i className="bi bi-wrench me-1 text-warning"></i> PROGRAMA DE MANTENIMIENTO:</h6>
                            <table className="table table-sm table-bordered bg-white small mb-3">
                              <thead>
                                <tr><th>FRECUENCIA</th><th>ACTIVIDAD</th></tr>
                              </thead>
                              <tbody>
                                {eq.mantenimiento.map((m, idx) => (
                                  <tr key={idx}>
                                    <td><span className="badge bg-primary-subtle text-primary">{m.frec}</span></td>
                                    <td className="text-muted">{m.act}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="alert alert-warning p-2 small mb-0 rounded-2">
                              <strong><i className="bi bi-shield-exclamation me-1"></i>RECOMENDACIONES:</strong> {eq.recomendaciones}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-top pt-4 mt-4 text-dark">
                    <h5 className="fw-bold text-primary font-heading mb-2">7. REGISTROS Y ANEXOS</h5>
                    <p className="mb-1"><strong>REGISTROS:</strong> Las actividades de mantenimiento realizadas a los equipos de la planta quedan registradas en <strong>FOPME-002: FORMATO DE MANTENIMIENTO REALIZADO A EQUIPOS Y MAQUINARIA</strong>.</p>
                    <p className="mb-0"><strong>ANEXOS:</strong> Anexo 1 (Manual de instrucciones para el uso y mantenimiento de motores eléctricos) y Anexo 2 (Manual de soluciones a fallos y posibles causas de caja de control de máquinas hiladoras).</p>
                  </div>
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
