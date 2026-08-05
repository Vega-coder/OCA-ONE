-- ============================================================
-- ARQUITECTURA MULTI-TENANT CON EMPRESA, SUCURSAL/TIENDA, DEPARTAMENTO E INDUSTRIA (OCA ONE)
-- Basado en el modelo de dominio Systime - IDEMPOTENTE (DROP POLICY IF EXISTS)
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Catálogo de Industrias (Sectores Alimentos & Bebidas)
CREATE TABLE IF NOT EXISTS industrias (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true
);

INSERT INTO industrias (id, nombre, descripcion) VALUES
('ind-lacteos', 'Lácteos y Derivados', 'Procesamiento de leche, quesos, yogures y helados.'),
('ind-carnicos', 'Cárnicos y Embutidos', 'Desposte, embutidos, chorizos y enlatados cárnicos.'),
('ind-bebidas', 'Bebidas y Licores', 'Embotellado de jugos, aguas, refrescos y licores.'),
('ind-panaderia', 'Panadería y Cereales', 'Molinería, galletas, panificados y pastas.'),
('ind-fruver', 'Frutas y Hortalizas (Fruver)', 'Selección, lavado, pulpas y empaque de vegetales.')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabla de Empresas / Inquilinos (Tenants)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY,
  industria_id TEXT REFERENCES industrias(id),
  nombre TEXT NOT NULL,
  nit TEXT,
  pais TEXT DEFAULT 'Colombia',
  ciudad TEXT DEFAULT 'Bogotá D.C.',
  direccion TEXT,
  telefono TEXT,
  email TEXT,
  plan TEXT DEFAULT 'Edición Profesional',
  logo_url TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO tenants (id, industria_id, nombre, nit, ciudad, plan) VALUES
('tenant-opt-01', 'ind-lacteos', 'Optimus Latinoamérica', '900.123.456-7', 'Bogotá D.C.', 'Edición Profesional'),
('tenant-lacteos-02', 'ind-lacteos', 'Lácteos del Valle S.A.S.', '800.987.654-1', 'Cali', 'Plan Gold HACCP'),
('tenant-carnes-03', 'ind-carnicos', 'Frigoríficos y Procesados Norte', '901.456.789-3', 'Medellín', 'Enterprise Multi-Planta')
ON CONFLICT (id) DO NOTHING;

-- 3. Tabla de Tiendas / Plantas / Sucursales (CompanyStores)
CREATE TABLE IF NOT EXISTS tiendas (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  codigo_tienda TEXT,
  ciudad TEXT,
  direccion TEXT,
  telefono TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO tiendas (id, tenant_id, nombre, codigo_tienda, ciudad) VALUES
('store-opt-main', 'tenant-opt-01', 'Planta Principal Bogotá', 'PLT-01', 'Bogotá D.C.'),
('store-opt-med', 'tenant-opt-01', 'Planta Procesadora Medellín', 'PLT-02', 'Medellín'),
('store-lac-cali', 'tenant-lacteos-02', 'Planta Industrial Yumbo', 'PLT-YUM', 'Yumbo')
ON CONFLICT (id) DO NOTHING;

-- 4. Tabla de Departamentos / Áreas por Tienda (CompanyStoreDepartments)
CREATE TABLE IF NOT EXISTS departamentos (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT NOT NULL REFERENCES tiendas(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO departamentos (id, tenant_id, tienda_id, nombre, descripcion) VALUES
('dep-opt-01', 'tenant-opt-01', 'store-opt-main', 'Cuartos Fríos y Refrigeración', 'Cámaras de conservación 1 y 2'),
('dep-opt-02', 'tenant-opt-01', 'store-opt-main', 'Líneas de Envasado A y B', 'Zona de embotellado y termoformado'),
('dep-opt-03', 'tenant-opt-01', 'store-opt-main', 'Laboratorio de Calidad y Microbiología', 'Hisopados y fisicoquímicos'),
('dep-lac-01', 'tenant-lacteos-02', 'store-lac-cali', 'Pasteurización CIP', 'Circuito cerrado CIP')
ON CONFLICT (id) DO NOTHING;

-- 5. Tabla de Procedimientos (Control Documental ISO)
CREATE TABLE IF NOT EXISTS procedimientos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT REFERENCES tiendas(id),
  departamento_id TEXT REFERENCES departamentos(id),
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

-- 6. Tabla de Formatos Imprimibles (Plantillas en Blanco)
CREATE TABLE IF NOT EXISTS formatos_imprimibles (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT REFERENCES tiendas(id),
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

-- 7. Tabla de Bitácora de Saneamiento e Higiene
CREATE TABLE IF NOT EXISTS registros_saneamiento (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT REFERENCES tiendas(id),
  departamento_id TEXT REFERENCES departamentos(id),
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

-- 8. Tabla de Acciones Correctivas (CAPA)
CREATE TABLE IF NOT EXISTS acciones_capa (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT REFERENCES tiendas(id),
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

-- 9. Tabla de Registro de Alérgenos (Hisopados)
CREATE TABLE IF NOT EXISTS registros_alergenos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT REFERENCES tiendas(id),
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  linea TEXT NOT NULL,
  alergeno_evaluado TEXT NOT NULL,
  resultado TEXT NOT NULL,
  supervisor TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabla de Manipuladores y BPM
CREATE TABLE IF NOT EXISTS manipuladores (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT REFERENCES tiendas(id),
  departamento_id TEXT REFERENCES departamentos(id),
  nombre TEXT NOT NULL,
  cedula TEXT NOT NULL,
  cargo TEXT NOT NULL,
  fecha_examen DATE NOT NULL,
  carnet_bpm TEXT NOT NULL DEFAULT 'Vigente',
  fecha_capacitacion DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Tabla de Mediciones de Variables Críticas (PCC)
CREATE TABLE IF NOT EXISTS mediciones_variables (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant-opt-01' REFERENCES tenants(id) ON DELETE CASCADE,
  tienda_id TEXT REFERENCES tiendas(id),
  departamento_id TEXT REFERENCES departamentos(id),
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
ALTER TABLE industrias ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE procedimientos ENABLE ROW LEVEL SECURITY;
ALTER TABLE formatos_imprimibles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_saneamiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE acciones_capa ENABLE ROW LEVEL SECURITY;
ALTER TABLE registros_alergenos ENABLE ROW LEVEL SECURITY;
ALTER TABLE manipuladores ENABLE ROW LEVEL SECURITY;
ALTER TABLE mediciones_variables ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas previas si ya existen para evitar el error 42710 (policy already exists)
DROP POLICY IF EXISTS "Permitir todo a anon en industrias" ON industrias;
DROP POLICY IF EXISTS "Permitir todo a anon en tenants" ON tenants;
DROP POLICY IF EXISTS "Permitir todo a anon en tiendas" ON tiendas;
DROP POLICY IF EXISTS "Permitir todo a anon en departamentos" ON departamentos;
DROP POLICY IF EXISTS "Permitir todo a anon en procedimientos" ON procedimientos;
DROP POLICY IF EXISTS "Permitir todo a anon en formatos" ON formatos_imprimibles;
DROP POLICY IF EXISTS "Permitir todo a anon en saneamiento" ON registros_saneamiento;
DROP POLICY IF EXISTS "Permitir todo a anon en capa" ON acciones_capa;
DROP POLICY IF EXISTS "Permitir todo a anon en alergenos" ON registros_alergenos;
DROP POLICY IF EXISTS "Permitir todo a anon en manipuladores" ON manipuladores;
DROP POLICY IF EXISTS "Permitir todo a anon en mediciones" ON mediciones_variables;

-- Crear las políticas de acceso sin duplicación
CREATE POLICY "Permitir todo a anon en industrias" ON industrias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en tenants" ON tenants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en tiendas" ON tiendas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en departamentos" ON departamentos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en procedimientos" ON procedimientos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en formatos" ON formatos_imprimibles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en saneamiento" ON registros_saneamiento FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en capa" ON acciones_capa FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en alergenos" ON registros_alergenos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en manipuladores" ON manipuladores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en mediciones" ON mediciones_variables FOR ALL USING (true) WITH CHECK (true);
