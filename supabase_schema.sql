-- ============================================================
-- SCRIPT DE CREACIÓN DE TABLAS EN SUPABASE PARA OCA ONE
-- Ejecutar este script en el SQL Editor de tu proyecto Supabase
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
