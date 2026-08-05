-- ============================================================
-- SCRIPT DE CREACIÓN DE TABLAS Y SEED DATA EN SUPABASE (OCA ONE)
-- Copia y ejecuta este script completo en el SQL Editor de tu Supabase
-- ============================================================

-- 1. Tabla de Procedimientos (Control Documental ISO)
CREATE TABLE IF NOT EXISTS procedimientos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  codigo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  fecha_aprobacion DATE DEFAULT CURRENT_DATE,
  responsable TEXT NOT NULL,
  aprobado TEXT,
  objetivo TEXT,
  alcance TEXT,
  responsables_doc TEXT,
  definiciones TEXT,
  desarrollo TEXT,
  registros_control JSONB DEFAULT '[]'::jsonb,
  control_cambios JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Formatos Imprimibles (Plantillas en Blanco)
CREATE TABLE IF NOT EXISTS formatos_imprimibles (
  id TEXT PRIMARY KEY,
  codigo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0.0',
  responsable TEXT NOT NULL,
  columnas JSONB DEFAULT '[]'::jsonb,
  filas_vacias INT DEFAULT 10,
  nota TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Bitácora de Saneamiento e Higiene
CREATE TABLE IF NOT EXISTS registros_saneamiento (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME NOT NULL DEFAULT CURRENT_TIME,
  area TEXT NOT NULL,
  tipo TEXT NOT NULL,
  producto TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  conforme BOOLEAN NOT NULL DEFAULT true,
  observacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Acciones Correctivas (CAPA)
CREATE TABLE IF NOT EXISTS acciones_capa (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hallazgo TEXT NOT NULL,
  origen TEXT NOT NULL,
  causa_raiz TEXT,
  plan_accion TEXT,
  responsable TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Abierto',
  fecha_cierre DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Registro de Alérgenos (Hisopados)
CREATE TABLE IF NOT EXISTS registros_alergenos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  linea TEXT NOT NULL,
  alergeno_evaluado TEXT NOT NULL,
  resultado TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla de Manipuladores y BPM
CREATE TABLE IF NOT EXISTS manipuladores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre TEXT NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  cargo TEXT NOT NULL,
  fecha_examen DATE NOT NULL,
  carnet_bpm TEXT NOT NULL DEFAULT 'Vigente',
  fecha_capacitacion DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabla de Mediciones de Variables Críticas (PCC)
CREATE TABLE IF NOT EXISTS mediciones_variables (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME NOT NULL DEFAULT CURRENT_TIME,
  variable TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  unidad TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Normal',
  operador TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) y permitir lectura/escritura pública con Anon Key
ALTER TABLE procedimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formatos_imprimibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_saneamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE acciones_capa ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_alergenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE manipuladores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediciones_variables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a anon en procedimientos" ON procedimientos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en formatos" ON formatos_imprimibles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en saneamiento" ON registros_saneamiento FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en capa" ON acciones_capa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en alergenos" ON registros_alergenos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en manipuladores" ON manipuladores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en mediciones" ON mediciones_variables FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED DATA INICIAL PARA POBLAR LA BASE DE DATOS SUPABASE
-- ============================================================

INSERT INTO procedimientos (codigo, titulo, categoria, version, fecha_aprobacion, responsable, aprobado, objetivo, alcance, responsables_doc, definiciones, desarrollo, registros_control, control_cambios) VALUES
('POES-PLG-001', 'Procedimiento Operativo de Control de Plagas', 'Control de Plagas', '2.0.0', '2026-01-10', 'Carlos Gómez', 'Carlos Gómez', 'Establecer las medidas preventivas y correctivas necesarias para evitar la proliferación de plagas.', 'Aplica a todas las áreas internas y externas de la planta.', 'Empresa contratista de vectores y supervisor de calidad.', 'Vector: Animal que transmite enfermedades.', '1. INSPECCIÓN: Revisión semanal de 15 estaciones de cebado.', '[{"nombre":"Planilla de Monitoreo de Estaciones","codigo":"F-PLG-01","responsable":"Calidad"}]'::jsonb, '[{"fecha":"Enero 2026 Versión 2.0.0","descripcion":"Actualización general de cebaderos","responsable":"Carlos Gómez"}]'::jsonb),

('POES-RES-002', 'Manual de Gestión de Residuos Sólidos y Líquidos', 'Residuos Sólidos y Líquidos', '1.2.0', '2026-03-15', 'Carlos Gómez', 'Carlos Gómez', 'Normar la separación en la fuente y disposición final de residuos.', 'Aplica a todas las áreas operativas y efluentes.', 'Auxiliares de almacén y personal de limpieza.', 'Manifiesto: Documento legal de disposición.', '1. CLASIFICACIÓN: Orgánicos (Canecas Verdes), Plásticos (Grises).', '[{"nombre":"Bitácora Diaria de Retiro de Residuos","codigo":"F-RES-01","responsable":"Calidad"}]'::jsonb, '[{"fecha":"Marzo 2026 Versión 1.2.0","descripcion":"Inclusión de entrega de aceites","responsable":"Carlos Gómez"}]'::jsonb),

('POES-LIM-003', 'Plan Maestro de Limpieza y Desinfección', 'Limpieza y Desinfección', '3.1.0', '2026-05-20', 'Carlos Gómez', 'Carlos Gómez', 'Garantizar que equipos y utensilios estén higienizados.', 'Aplica a salas de proceso y líneas de envasado A y B.', 'Operarios de limpieza y supervisor de calidad.', 'POES: Procedimientos Operativos Estandarizados.', '1. DOSIFICACIONES: Cloro 200 ppm para contacto directo.', '[{"nombre":"Inspección Diaria L&D","codigo":"Q-FR-18","responsable":"Calidad"}]'::jsonb, '[{"fecha":"Mayo 2026 Versión 3.1.0","descripcion":"Actualización de dosificación","responsable":"Carlos Gómez"}]'::jsonb),

('POES-AGU-004', 'Procedimiento de Control y Potabilidad de Agua', 'Agua Potable', '1.0.0', '2026-02-05', 'Carlos Gómez', 'Carlos Gómez', 'Asegurar que el agua procesada sea apta para consumo humano.', 'Aplica a red interna y tanques de almacenamiento.', 'Supervisor de laboratorio y mantenimiento.', 'Cloro Residual: Nivel activo de desinfectante.', '1. MONITOREO DIARIO: Medir cloro libre (0.3 a 2.0 ppm) y pH (6.5 a 8.5).', '[{"nombre":"Planilla Diaria de Cloro y pH","codigo":"F-AGU-01","responsable":"Calidad"}]'::jsonb, '[{"fecha":"Febrero 2026 Versión 1.0.0","descripcion":"Creación del documento","responsable":"Carlos Gómez"}]'::jsonb);

INSERT INTO formatos_imprimibles (id, codigo, titulo, categoria, version, responsable, columnas, filas_vacias, nota) VALUES
('f-lim', 'F-LIM-01', 'Formato de Inspección y Registro de Higiene Diario', 'Limpieza y Desinfección', '1.0.0', 'Carlos Gómez', '["Área o Equipo", "Tipo de Limpieza", "Químico Utilizado", "Estado (Conforme/No Conforme)", "Firma Operador"]'::jsonb, 10, 'Rellenar diariamente al inicio y cierre de jornada.'),
('f-plg', 'F-PLG-01', 'Planilla de Monitoreo de Estaciones de Cebado Externas', 'Control de Plagas', '1.0.2', 'Carlos Gómez', '["Nº Estación", "Ubicación Planta", "Consumo Cebo (%)", "Estado Físico Trampa", "Operario Firma"]'::jsonb, 15, 'Inspeccionar semanalmente todas las estaciones.'),
('f-res', 'F-RES-01', 'Bitácora Diaria de Clasificación y Retiro de Residuos', 'Residuos Sólidos y Líquidos', '1.1.0', 'Carlos Gómez', '["Fecha", "Tipo de Residuo", "Cantidad (Kg/L)", "Operario Entrega", "Firma Receptor"]'::jsonb, 10, 'Registrar cada retiro de basuras y despachos de aceites.'),
('f-agu', 'F-AGU-01', 'Planilla Diaria de Medición de Cloro Libre y pH', 'Agua Potable', '1.0.0', 'Carlos Gómez', '["Día del Mes", "Cloro Libre (ppm)", "pH", "Hora Registro", "Firma Supervisor"]'::jsonb, 15, 'Medir en la salida del tanque principal.');

INSERT INTO registros_saneamiento (fecha, hora, area, tipo, producto, supervisor, conforme, observacion) VALUES
('2026-08-01', '06:30', 'Cuarto Frío 1', 'Pre-operacional', 'Cloro 200ppm', 'Carlos Gómez', true, 'Cumple sin novedades'),
('2026-08-01', '13:00', 'Línea de Envasado A', 'Rutinaria', 'Amonio Cuaternario', 'Carlos Gómez', true, 'Limpieza intermedia'),
('2026-08-02', '18:00', 'Pasteurizador B', 'Profunda', 'Ácido Peracético', 'Carlos Gómez', true, 'Cierre de lote');

INSERT INTO acciones_capa (fecha, hallazgo, origen, causa_raiz, plan_accion, responsable, estado, fecha_cierre) VALUES
('2026-08-01', 'Concentración de cloro residual por debajo del rango (0.1 ppm en tanque principal)', 'Variables Críticas', 'Descalibración en la bomba dosificadora automática', 'Ajuste manual e inspección técnica por mantenimiento', 'Ing. Pedro R.', 'Cerrado', '2026-08-02'),
('2026-08-03', 'Presencia de condensación excesiva en Techo de Cuarto Frío 2', 'Auditoría Interna', NULL, NULL, 'Carlos Gómez', 'Abierto', NULL);

INSERT INTO registros_alergenos (fecha, linea, alergeno_evaluado, resultado, supervisor) VALUES
('2026-08-01', 'Línea de Mezclas 1', 'Soya / Glúten', 'Negativo (Limpio)', 'Carlos Gómez'),
('2026-08-02', 'Envasado A', 'Proteína de Leche', 'Negativo (Limpio)', 'Ana Martínez');

INSERT INTO manipuladores (nombre, cedula, cargo, fecha_examen, carnet_bpm, fecha_capacitacion) VALUES
('Juan Pérez', '1032456789', 'Operario de Envasado', '2026-01-15', 'Vigente', '2026-02-10'),
('María Rodríguez', '1018987654', 'Líder de Limpieza', '2026-03-20', 'Vigente', '2026-03-22'),
('Luis Salcedo', '98765432', 'Técnico de Mantenimiento', '2025-06-10', 'Vencido', '2025-06-15');

INSERT INTO mediciones_variables (fecha, hora, variable, valor, unidad, estado, operador) VALUES
('2026-08-05', '07:00', 'Temperatura Pasteurización', 85.5, '°C', 'Normal', 'Juan Pérez'),
('2026-08-05', '07:15', 'Cloro Libre Residual', 1.2, 'ppm', 'Normal', 'María Rodríguez'),
('2026-08-05', '07:30', 'pH Agua de Red', 7.2, 'pH', 'Normal', 'María Rodríguez');
