import React from 'react';
import { Download, Users, CheckCircle, Calendar, Cpu } from 'lucide-react';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Tableau de bord de l'Administrateur</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Vue d'ensemble de la plateforme Nexus AI en temps réel.</p>
        </div>
        <button className="btn btn-outline" style={{ display: 'flex', gap: 8 }}>
          <Download size={16} /> Exporter Rapport
        </button>
      </div>

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
              <Users size={20} />
            </div>
            <span style={{ fontSize: 12, background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: 99 }}>+12% ce mois</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Utilisateurs totaux</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>12,842</div>
        </div>

        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '4px solid var(--status-active)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--status-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-active)' }}>
              <CheckCircle size={20} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--status-active)' }}>En Ligne: 1,402</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Utilisateurs actifs</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>8,521</div>
        </div>

        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'var(--admin-accent-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
              <Calendar size={20} />
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Utilisateurs expirés</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>432</div>
        </div>

        <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-accent)' }}>
              <Cpu size={20} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Capacité: 85%</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>Consommation totale</div>
          <div style={{ fontSize: 28, fontWeight: 700 }}>8.4M <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--text-secondary)' }}>jetons</span></div>
        </div>
      </div>

      {/* Simplified Layout Placeholder to match general feel without deep analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, flex: 1 }}>
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          [ Graphique d'utilisation mensuelle (Jetons) ]
        </div>
        <div className="admin-card">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Activité Récente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3b82f6', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: 13, color: '#fff' }}>Nouvel utilisateur inscrit</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Il y a 2 minutes • Marc Dupont</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--status-expired)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: 13, color: '#fff' }}>Abonnement renouvelé</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Il y a 1 heure • Automatique</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--status-active)', marginTop: 6 }}></div>
              <div>
                <div style={{ fontSize: 13, color: '#fff' }}>Quota augmenté</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Il y a 5 heures • Marie Curie</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
