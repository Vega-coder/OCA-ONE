-- ============================================================
-- ARQUITECTURA MULTI-TENANT ROLES, PERMISOS Y VISTAS DINÁMICAS EN DB (OCA ONE)
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla de Roles con Permisos y Vistas Permitidas en JSONB (100% Dinámico desde DB)
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  badge_class TEXT DEFAULT 'bg-secondary',
  icon TEXT DEFAULT 'bi-person',
  descripcion TEXT NOT NULL,
  can_download_procedures BOOLEAN DEFAULT false,
  can_edit_documents BOOLEAN DEFAULT false,
  can_fill_formats BOOLEAN DEFAULT true,
  can_edit_formats BOOLEAN DEFAULT false,
  can_download_formats BOOLEAN DEFAULT true,
  can_view_fichas_tecnicas BOOLEAN DEFAULT true,
  can_view_msds BOOLEAN DEFAULT true,
  allowed_views JSONB DEFAULT '[]'::jsonb
);

INSERT INTO roles (
  id, nombre, badge_class, icon, descripcion, 
  can_download_procedures, can_edit_documents, can_fill_formats, can_edit_formats, 
  can_download_formats, can_view_fichas_tecnicas, can_view_msds, allowed_views
) VALUES
('super-admin', 'Super Administrador', 'bg-primary', 'bi-shield-lock-fill', 'Acceso total sin restricciones a todos los módulos. Administrador del programa.', true, true, true, true, true, true, true, '["procedimientos", "dashboard", "saneamiento", "variables", "capa", "trazabilidad", "alergenos-recall", "capacitaciones"]'::jsonb),
('control-calidad', 'Control de Calidad', 'bg-info text-dark', 'bi-patch-check-fill', 'Consultar control de calidad, diligenciar formatos y consultar fichas técnicas / MSDS (Sin descarga de procedimientos).', false, false, true, false, true, true, true, '["procedimientos", "dashboard", "saneamiento", "capa", "alergenos-recall"]'::jsonb),
('produccion', 'Producción', 'bg-success', 'bi-gear-wide-connected', 'Consultar manuales de producción y diligenciar formatos y cronogramas de producción (Sin descarga de procedimientos).', false, false, true, false, true, true, false, '["variables", "trazabilidad", "dashboard"]'::jsonb),
('operativo', 'Operativo', 'bg-warning text-dark', 'bi-person-badge-fill', 'Consultar etapas de producción, diligenciar formatos de producción y descargar formatos en blanco (Sin edición).', false, false, true, false, true, false, false, '["variables", "saneamiento", "trazabilidad"]'::jsonb),
('mantenimiento', 'Mantenimiento', 'bg-indigo text-white', 'bi-tools', 'Consultar calibración/mantenimiento, fichas técnicas, diligenciar órdenes y cronogramas de mantenimiento.', false, false, true, false, true, true, true, '["variables", "capa", "dashboard"]'::jsonb),
('logistica', 'Logística, Abastecimiento y Despachos', 'bg-secondary', 'bi-truck', 'Consultar logística, consultar/descargar órdenes de compra y diligenciar formatos de despacho.', false, false, true, false, true, true, false, '["trazabilidad", "alergenos-recall", "dashboard"]'::jsonb),
('sg-sst', 'SG-SST', 'bg-danger', 'bi-heart-pulse-fill', 'Consultar SG-SST, diligenciar/descargar formatos y cronogramas de seguridad y salud en el trabajo.', false, false, true, false, true, true, true, '["capacitaciones", "dashboard"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  badge_class = EXCLUDED.badge_class,
  icon = EXCLUDED.icon,
  descripcion = EXCLUDED.descripcion,
  can_download_procedures = EXCLUDED.can_download_procedures,
  can_edit_documents = EXCLUDED.can_edit_documents,
  can_fill_formats = EXCLUDED.can_fill_formats,
  can_edit_formats = EXCLUDED.can_edit_formats,
  can_download_formats = EXCLUDED.can_download_formats,
  can_view_fichas_tecnicas = EXCLUDED.can_view_fichas_tecnicas,
  can_view_msds = EXCLUDED.can_view_msds,
  allowed_views = EXCLUDED.allowed_views;

-- 2. Tabla de Usuarios del Sistema con Rol Asignado
CREATE TABLE IF NOT EXISTS usuarios (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  rol_id TEXT NOT NULL REFERENCES roles(id),
  cargo TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO usuarios (id, tenant_id, nombre, email, rol_id, cargo) VALUES
('usr-01', 'tenant-opt-01', 'Ing. Carlos Gómez', 'carlos.gomez@optimus.com', 'super-admin', 'Director General de Calidad'),
('usr-02', 'tenant-opt-01', 'Ana Martínez', 'ana.martinez@optimus.com', 'control-calidad', 'Supervisora de Calidad'),
('usr-03', 'tenant-opt-01', 'Javier Castillo', 'javier.castillo@optimus.com', 'produccion', 'Jefe de Planta'),
('usr-04', 'tenant-opt-01', 'Mateo Morales', 'mateo.m@optimus.com', 'mantenimiento', 'Líder de Mantenimiento'),
('usr-05', 'tenant-opt-01', 'Sofía Rodríguez', 'sofia.r@optimus.com', 'sg-sst', 'Coordinadora SG-SST')
ON CONFLICT (id) DO NOTHING;

-- 3. Tabla de Historial de Versiones Documentales (Trazabilidad ISO 9001 / HACCP)
CREATE TABLE IF NOT EXISTS version_history (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  procedimiento_id BIGINT REFERENCES procedimientos(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  version TEXT NOT NULL,
  fecha_cambio DATE DEFAULT CURRENT_DATE,
  responsable TEXT NOT NULL,
  descripcion_cambio TEXT NOT NULL,
  contenido_backup JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS y políticas
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE version_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir todo a anon en roles" ON roles;
DROP POLICY IF EXISTS "Permitir todo a anon en usuarios" ON usuarios;
DROP POLICY IF EXISTS "Permitir todo a anon en version_history" ON version_history;

CREATE POLICY "Permitir todo a anon en roles" ON roles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo a anon en version_history" ON version_history FOR ALL USING (true) WITH CHECK (true);
