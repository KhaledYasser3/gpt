import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings } from 'lucide-react';

export default function AdminLayout({ children, activeItem, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'Gestion des Utilisateurs', icon: <Users size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: 'var(--admin-bg)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <div className="admin-sidebar">
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
              onClick={() => onNavigate(item.id)}
              className={`admin-nav-item ${activeItem === item.id ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>



        {/* Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, padding: 12, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12 }}>JM</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Jean-Michel Admin</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Super Utilisateur</div>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="main-content" style={{ padding: 32 }}>
        {children}
      </div>
    </div>
  );
}
