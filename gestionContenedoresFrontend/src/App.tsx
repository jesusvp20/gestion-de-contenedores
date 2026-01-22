import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import Contenedores from './pages/Contenedores';
import Ubicaciones from './pages/Ubicaciones';
import Clientes from './pages/Clientes';
import Movimientos from './pages/Movimientos';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './App.css';

// Componente para proteger rutas
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('auth_token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [cold, setCold] = React.useState<{attempt: number; delayMs: number} | null>(null);
  React.useEffect(() => {
    const onCold = (e: Event) => {
      const ce = e as CustomEvent<{attempt: number; delayMs: number}>;
      setCold(ce.detail);
    };
    const onRecovered = () => setCold(null);
    window.addEventListener('backend:coldstart', onCold as EventListener);
    window.addEventListener('backend:recovered', onRecovered);
    return () => {
      window.removeEventListener('backend:coldstart', onCold as EventListener);
      window.removeEventListener('backend:recovered', onRecovered);
    };
  }, []);
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Ping silencioso para mantener caliente el backend
      import('./services/apiClient').then(({ default: client }) => {
        client.get('/health', { headers: { 'x-cache-bypass': 'true', 'x-silent': 'true' } }).catch(() => void 0);
      });
    }, 11 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Router>
      {cold && (
        <div className="cold-overlay">
          <div className="cold-box">
            <div className="cold-title">Conectando con el servidor...</div>
            <div className="cold-sub">
              Intento {cold.attempt} • Próximo reintento en {Math.round(cold.delayMs / 1000)}s
            </div>
          </div>
        </div>
      )}
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="contenedores" element={<Contenedores />} />
          <Route path="ubicaciones" element={<Ubicaciones />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="movimientos" element={<Movimientos />} />
        </Route>

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
