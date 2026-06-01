import React, { useState } from 'react';
import Auth from './components/User/Auth';
import Chat from './components/User/Chat';
import AdminLayout from './components/Admin/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import Users from './components/Admin/Users';

export default function App() {
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [userState, setUserState] = useState('login'); // 'login' or 'chat'
  const [adminState, setAdminState] = useState('users'); // 'dashboard' or 'users'

  // Temporary toggler for demonstration
  const handleToggleRole = () => {
    setRole(r => r === 'user' ? 'admin' : 'user');
  };

  if (role === 'user') {
    if (userState === 'login') {
      return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
          <button onClick={handleToggleRole} style={{ position: 'absolute', top: 16, right: 16, zIndex: 100, background: '#333', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Switch to Admin</button>
          <Auth onLogin={() => setUserState('chat')} />
        </div>
      );
    }
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <button onClick={handleToggleRole} style={{ position: 'absolute', top: 16, right: 16, zIndex: 100, background: '#333', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Switch to Admin</button>
        <Chat />
      </div>
    );
  }

  // Admin routing
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <button onClick={handleToggleRole} style={{ position: 'absolute', top: 16, right: 16, zIndex: 100, background: '#333', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Switch to User</button>
      <AdminLayout activeItem={adminState} onNavigate={setAdminState}>
        {adminState === 'dashboard' ? <Dashboard /> : <Users />}
      </AdminLayout>
    </div>
  );
}
