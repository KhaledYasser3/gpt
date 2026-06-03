import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Auth from './components/User/Auth';
import Chat from './components/User/Chat';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import Users from './components/Admin/Users';

function TitleUpdater() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/admin/dashboard')) {
      document.title = 'Statistiques | Admin Panel';
    } else if (location.pathname.startsWith('/admin/users')) {
      document.title = 'Utilisateurs | Admin Panel';
    } else if (location.pathname.startsWith('/chat')) {
      document.title = 'Chat | AI Chat SaaS';
    } else {
      document.title = 'Connexion | AI Chat SaaS';
    }
  }, [location]);
  return null;
}

function AppRoutes({ currentUser, handleLogin, handleLogout }) {
  const userRole = currentUser?.role ? String(currentUser.role).toUpperCase() : '';
  const isAdmin = userRole === 'ADMIN' || userRole.includes('ADMIN');

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/chat" replace />;
    return children;
  };

  return (
    <>
      <TitleUpdater />
      <Routes>
        <Route path="/login" element={
          currentUser ? <Navigate to={isAdmin ? "/admin/users" : "/chat"} replace /> : <Auth onLogin={handleLogin} />
        } />

        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat currentUser={currentUser} onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminLayout currentUser={currentUser} onLogout={handleLogout}>
              <Users />
            </AdminLayout>
          </AdminRoute>
        } />

        <Route path="/admin/dashboard" element={
          <AdminRoute>
            <AdminLayout currentUser={currentUser} onLogout={handleLogout}>
              <Dashboard />
            </AdminLayout>
          </AdminRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (data) => {
    setCurrentUser(data.user);
    localStorage.setItem('currentUser', JSON.stringify(data.user));
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff' }}>Loading...</div>;

  return (
    <BrowserRouter>
      <AppRoutes currentUser={currentUser} handleLogin={handleLogin} handleLogout={handleLogout} />
    </BrowserRouter>
  );
}
