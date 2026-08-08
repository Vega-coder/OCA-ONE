import React, { useState } from 'react';

export default function Login({ onLogin, usuariosDemo = [] }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  const defaultUsers = usuariosDemo.length > 0 ? usuariosDemo : [
    { id: 'usr-01', email: 'carlos.gomez@optimus.com', nombre: 'Ing. Carlos Gómez', rolId: 'super-admin', tenantId: 'tenant-opt-01', cargo: 'Director General de Calidad' },
    { id: 'usr-02', email: 'ana.martinez@optimus.com', nombre: 'Dra. Ana Martínez', rolId: 'control-calidad', tenantId: 'tenant-opt-01', cargo: 'Supervisora de Inocuidad' },
    { id: 'usr-03', email: 'javier.castillo@optimus.com', nombre: 'Ing. Javier Castillo', rolId: 'produccion', tenantId: 'tenant-lacteos-02', cargo: 'Jefe de Planta Lácteos' },
    { id: 'usr-04', email: 'mateo.m@optimus.com', nombre: 'Téc. Mateo Morales', rolId: 'mantenimiento', tenantId: 'tenant-lacteos-02', cargo: 'Líder de Mantenimiento' },
    { id: 'usr-05', email: 'sofia.r@optimus.com', nombre: 'Lic. Sofía Rodríguez', rolId: 'sg-sst', tenantId: 'tenant-carnes-03', cargo: 'Coordinadora SG-SST' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorLogin('');
    setCargando(true);

    setTimeout(() => {
      // Buscar usuario coincidente por email
      const userFound = defaultUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      
      if (userFound) {
        onLogin(userFound);
      } else if (email.trim().length > 3) {
        // Permitir inicio de sesión flexible para cuentas personalizadas
        const customUser = {
          id: `usr-custom-${Date.now()}`,
          email: email.trim(),
          nombre: email.split('@')[0].toUpperCase(),
          rolId: 'super-admin',
          tenantId: 'tenant-opt-01',
          cargo: 'Usuario Registrado'
        };
        onLogin(customUser);
      } else {
        setErrorLogin('Credenciales inválidas. Por favor ingrese un correo válido.');
      }
      setCargando(false);
    }, 500);
  };

  const handleQuickLogin = (usr) => {
    setEmail(usr.email);
    setPassword('123456');
    onLogin(usr);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div className="card border-0 shadow-lg text-white" style={{
        maxWidth: '460px',
        width: '100%',
        borderRadius: '24px',
        background: 'rgba(30, 41, 59, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div className="card-body p-4 p-md-5">
          {/* Logo y Encabezado */}
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center justify-content-center bg-success bg-gradient rounded-circle mb-3 shadow" style={{ width: '64px', height: '64px', fontSize: '30px' }}>
              <i className="bi bi-shield-check text-white"></i>
            </div>
            <h2 className="font-heading fw-bold tracking-tight text-white mb-1">OCA ONE</h2>
            <p className="text-secondary small mb-0">Plataforma SaaS de Control de Calidad e Inocuidad</p>
          </div>

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit}>
            {errorLogin && (
              <div className="alert alert-danger py-2 px-3 small border-0 mb-3 rounded-3 fade-in-view">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>{errorLogin}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label text-light small fw-semibold">Correo Electrónico Corporativo</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input 
                  type="email" 
                  className="form-control bg-dark text-white border-secondary" 
                  placeholder="ejemplo@empresa.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label text-light small fw-semibold">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input 
                  type="password" 
                  className="form-control bg-dark text-white border-secondary" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-success bg-gradient w-100 py-2.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              disabled={cargando}
              style={{ borderRadius: '12px', fontSize: '15px' }}
            >
              {cargando ? (
                <span><span className="spinner-border spinner-border-sm me-2"></span> Autenticando...</span>
              ) : (
                <span><i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión</span>
              )}
            </button>
          </form>

          <hr className="my-4 border-secondary opacity-25" />

          {/* Accesos Rápidos de Simulación de Usuario y Rol */}
          <div>
            <label className="form-label text-secondary small fw-bold text-uppercase d-block mb-2 text-center" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
              <i className="bi bi-person-badge me-1"></i> Acceso Rápido Demo (Usuarios Reales en DB)
            </label>

            <div className="d-flex flex-column gap-2">
              {defaultUsers.map(usr => (
                <button
                  key={usr.id}
                  type="button"
                  className="btn btn-outline-light btn-sm text-start d-flex align-items-center justify-content-between py-2 px-3 border-secondary"
                  onClick={() => handleQuickLogin(usr)}
                  style={{ borderRadius: '10px', fontSize: '12.5px', background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                      {usr.nombre.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <div className="fw-semibold text-white">{usr.nombre}</div>
                      <small className="text-secondary" style={{ fontSize: '10px' }}>{usr.email}</small>
                    </div>
                  </div>
                  <span className="badge bg-success-subtle text-success border border-success border-opacity-25" style={{ fontSize: '10px' }}>
                    {usr.rolId}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card-footer border-0 bg-transparent text-center text-secondary small pb-4" style={{ fontSize: '11.5px' }}>
          Seguridad Alimentaria e Inocuidad HACCP / ISO 22000 &copy; 2026 OCA ONE
        </div>
      </div>
    </div>
  );
}
