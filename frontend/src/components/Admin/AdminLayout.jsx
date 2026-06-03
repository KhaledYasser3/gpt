import React, { useState } from 'react';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout({ children, currentUser, onLogout }) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const activeItem = location.pathname.includes('dashboard') ? 'dashboard' : 'users';

  const menuItems = [
    { id: 'dashboard', label: 'Statistiques', icon: <LayoutDashboard size={18} />, path: '/admin/dashboard' },
    { id: 'users', label: 'Gestion des Utilisateurs', icon: <Users size={18} />, path: '/admin/users' },
  ];

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.substring(0, 2).toUpperCase();
  };

  const adminName = currentUser?.full_name || currentUser?.username || 'Administrateur';

  // Modal Styles
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
  const modalStyle = { backgroundColor: '#111', border: '1px solid #333', padding: 32, borderRadius: 16, width: 380, textAlign: 'center', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' };
  const cancelBtnStyle = { flex: 1, padding: '12px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 500 };
  const primaryBtnStyle = { flex: 1, padding: '12px', background: '#ef4444', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 600 };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: 'var(--admin-bg)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <div className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, padding: '0 8px' }}>
          <div style={{ width: 36, height: 36, backgroundColor: 'var(--admin-accent-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
            <div style={{ width: 16, height: 16, border: '2px solid currentColor', borderRadius: 4 }}></div>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--admin-accent)', letterSpacing: 0.5 }}>Admin Panel</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Gestion Système</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {menuItems.map(item => (
            <div 
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`admin-nav-item ${activeItem === item.id ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>

        {/* Admin Profile & Logout */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 12 }}>{getInitials(adminName)}</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{adminName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Administrateur</div>
            </div>
          </div>
          
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px', background: 'transparent', border: '1px solid #333', color: '#ef4444', borderRadius: 12, cursor: 'pointer', fontWeight: 500, justifyContent: 'center' }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="main-content" style={{ padding: 32, flex: 1, overflowY: 'auto' }}>
        {children}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Déconnexion</h2>
            <p style={{ color: '#a3a3a3', fontSize: 14, marginBottom: 24 }}>
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowLogoutConfirm(false)} style={cancelBtnStyle}>Annuler</button>
              <button onClick={() => { setShowLogoutConfirm(false); onLogout(); }} style={primaryBtnStyle}>Oui, déconnecter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
