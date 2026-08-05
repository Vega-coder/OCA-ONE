-- ============================================================
-- ARQUITECTURA MULTI-TENANT (MULTI-EMPRESA/INQUILINOS) PARA OCA ONE
-- Basada en patrón Tenant Isolation por tenant_id
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla Principal de Empresas / Inquilinos (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  nit TEXT,
  plan TEXT DEFAULT 'Edición Profesional',
  logo_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar empresas demo iniciales
INSERT INTO tenants (id, nombre, nit, plan, activo) VALUES
('tenant-opt-01', 'Optimus Latinoamérica', '900.123.456-7', 'Edición Profesional', true),
('tenant-lacteos-02', 'Lácteos del Valle S.A.S.', '800.987.654-1', 'Plan Gold HACCP', true),
('tenant-carnes-03', 'Frigoríficos y Procesados Norte', '901.456.789-3', 'Enterprise', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de Procedimientos (Control Documental ISO)
CREATE TABLE IF NOT EXISTS procedimientos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
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

-- 3. Tabla de Formatos Imprimibles (Plantillas en Blanco)
CREATE TABLE IF NOT EXISTS formatos_imprimibles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
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

-- 4. Tabla de Bitácora de Saneamiento e Higiene
CREATE TABLE IF NOT EXISTS registros_saneamiento (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
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

-- 5. Tabla de Acciones Correctivas (CAPA)
CREATE TABLE IF NOT EXISTS acciones_capa (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
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

-- 6. Tabla de Registro de Alérgenos (Hisopados)
CREATE TABLE IF NOT EXISTS registros_alergenos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  linea TEXT NOT NULL,
  alergeno_evaluado TEXT NOT NULL,
  resultado TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabla de Manipuladores y BPM
CREATE TABLE IF NOT EXISTS manipuladores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  cedula TEXT NOT NULL,
  cargo TEXT NOT NULL,
  fecha_examen DATE NOT NULL,
  carnet_bpm TEXT NOT NULL DEFAULT 'Vigente',
  fecha_capacitacion DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabla de Mediciones de Variables Críticas (PCC)
CREATE TABLE IF NOT EXISTS mediciones_variables (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  hora TIME NOT NULL DEFAULT CURRENT_TIME,
  variable TEXT NOT NULL,
  valor NUMERIC NOT NULL,
  unidad TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'Normal',
  operador TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) en todas las tablas
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formatos_imprimibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_saneamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE acciones_capa ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_alergenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE manipuladores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediciones_variables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir todo a anon en tenants" ON tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en procedimientos" ON procedimientos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en formatos" ON formatos_imprimibles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en saneamiento" ON registros_saneamiento FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en capa" ON acciones_capa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en alergenos" ON registros_alergenos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en manipuladores" ON manipuladores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en mediciones" ON mediciones_variables FOR ALL USING (true) WITH CHECK (true);

-- SEED DATA PARA TENANT OPTIMUS LATINOAMÉRICA (tenant-opt-01)
INSERT INTO procedimientos (tenant_id, codigo, titulo, categoria, version, fecha_aprobacion, responsable, aprobado, objetivo, alcance, responsables_doc, definiciones, desarrollo, registros_control, control_cambios) VALUES
('tenant-opt-01', 'POES-PLG-001', 'Procedimiento Operativo de Control de Plagas', 'Control de Plagas', '2.0.0', '2026-01-10', 'Carlos Gómez', 'Carlos Gómez', 'Establecer medidas de control de plagas.', 'Toda la planta.', 'Empresa subcontratista.', 'Vector: Transmisor.', '1. INSPECCIÓN SEMANAL.', '[]'::jsonb, '[]'::jsonb),
('tenant-opt-01', 'POES-LIM-003', 'Plan Maestro de Limpieza y Desinfección', 'Limpieza y Desinfección', '3.1.0', '2026-05-20', 'Carlos Gómez', 'Carlos Gómez', 'Higienización de equipos y superficies.', 'Líneas de envasado A y B.', 'Operarios y supervisores.', 'POES: Sanitización.', '1. DOSIFICACIÓN DE CLORO 200 PPM.', '[]'::jsonb, '[]'::jsonb);

INSERT INTO registros_saneamiento (tenant_id, fecha, hora, area, tipo, producto, supervisor, conforme, observacion) VALUES
('tenant-opt-01', '2026-08-05', '06:30', 'Cuarto Frío 1', 'Pre-operacional', 'Cloro 200ppm', 'Carlos Gómez', true, 'Operatividad OK');

-- SEED DATA PARA TENANT LÁCTEOS DEL VALLE (tenant-lacteos-02)
INSERT INTO procedimientos (tenant_id, codigo, titulo, categoria, version, fecha_aprobacion, responsable, aprobado, objetivo, alcance, responsables_doc, definiciones, desarrollo, registros_control, control_cambios) VALUES
('tenant-lacteos-02', 'POES-LAC-010', 'Procedimiento de Limpieza CIP de Pasteurizadores', 'Limpieza y Desinfección', '1.0.0', '2026-04-01', 'Ing. María López', 'Ing. María López', 'Lavado CIP en circuito cerrado.', 'Planta de pasteurización.', 'Técnicos de turno.', 'CIP: Clean in Place.', '1. CIRCULACIÓN ÁCIDA Y ALCALINA.', '[]'::jsonb, '[]'::jsonb);

INSERT INTO registros_saneamiento (tenant_id, fecha, hora, area, tipo, producto, supervisor, conforme, observacion) VALUES
('tenant-lacteos-02', '2026-08-05', '07:00', 'Pasteurizador Tetrapak 1', 'CIP Alcalino', 'Soda Cáustica 2%', 'Ing. María López', true, 'Conductividad correcta');
