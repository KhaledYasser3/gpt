import React, { useState, useEffect } from 'react';
import { Download, Users, CheckCircle, Calendar, Cpu } from 'lucide-react';
import { api } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    tokensUsed: 0,
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.admin.getUsers();
        if (res && res.users) {
          const nonAdminUsers = res.users.filter(u => String(u.role).toUpperCase() !== 'ADMIN');
          const total = nonAdminUsers.length;
          
          const now = new Date();
          const active = nonAdminUsers.filter(u => u.is_active && (!u.subscription?.end_date || new Date(u.subscription.end_date) > now)).length;
          const expired = nonAdminUsers.filter(u => u.subscription?.end_date && new Date(u.subscription.end_date) <= now).length;
          const tokensUsed = nonAdminUsers.reduce((sum, u) => sum + (u.subscription?.tokens_used || 0), 0);
          
          const recentUsers = [...nonAdminUsers].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 3);
          
          setStats({ total, active, expired, tokensUsed, recentUsers });
        }
      } catch (e) {
        console.error('Error fetching stats:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatTokens = (tokens) => {
    if (tokens >= 1000000) return (tokens / 1000000).toFixed(1) + 'M';
    if (tokens >= 1000) return (tokens / 1000).toFixed(1) + 'K';
    return tokens;
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return 'Récemment';
    const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (seconds < 60) return `Il y a ${seconds} secondes`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Il y a ${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours} heures`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days} jours`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Statistiques</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Vue d'ensemble de la plateforme en temps réel.</p>
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', gap: 8 }}>
          <Download size={16} /> Exporter Rapport
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Chargement des statistiques...</div>
      ) : (
        <>
          {/* Top Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                  <Users size={20} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Utilisateurs totaux</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.total}</div>
            </div>

            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '4px solid var(--status-active)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--status-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-active)' }}>
                  <CheckCircle size={20} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Utilisateurs actifs</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.active}</div>
            </div>

            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--admin-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
                  <Calendar size={20} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Utilisateurs expirés</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{stats.expired}</div>
            </div>

            <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
                  <Cpu size={20} />
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Consommation totale</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{formatTokens(stats.tokensUsed)} <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>jetons</span></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, flex: 1 }}>
            <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              [ Graphique d'utilisation mensuelle - Bientôt disponible ]
            </div>
            <div className="admin-card">
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Derniers Utilisateurs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {stats.recentUsers.length === 0 && <div style={{ color: '#888', fontSize: 13 }}>Aucun utilisateur récent.</div>}
                {stats.recentUsers.map((u, i) => (
                  <div key={u.id} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: i === 0 ? '#3b82f6' : 'var(--status-active)', marginTop: 6 }}></div>
                    <div>
                      <div style={{ fontSize: 13, color: '#fff' }}>{u.full_name || u.username || u.email}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{getTimeAgo(u.created_at)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
