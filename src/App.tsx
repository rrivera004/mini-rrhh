// src/App.tsx

import type { ReactNode } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate
} from 'react-router-dom';

import Header from './layout/Header';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import ProtectedRoute from './components/ProtectedRoute';
import type { User } from './types';


// Layout con Header PARA páginas autenticadas
function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const role = localStorage.getItem('userRole') as User['role'] | null;
  const name = localStorage.getItem('userName') || '';

  const user = role
    ? { id: 1, name, email: '', role, token: '' } as User
    : undefined;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header user={user} onLogout={handleLogout} />
      <main>{children}</main>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Ruta pública */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/empleados"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EmployeesPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirigir raíz según autenticación */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: '100vh',
                background: '#f8fafc',
                textAlign: 'center',
                padding: '80px'
              }}
            >
              <h2 style={{ color: '#1e293b' }}>
                404 - Página no encontrada
              </h2>

              <Link to="/dashboard">
                Volver al inicio
              </Link>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;