import React, { useState } from 'react';
import { Search, UserPlus, Users as UsersIcon, CheckCircle, Hourglass, Ban, Edit2 } from 'lucide-react';

export default function Users() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [users, setUsers] = useState([
    {
      id: 1,
      email: 'jean.dupont@entreprise.fr',
      status: 'ACTIF',
      expireDate: '15 Oct 2024',
      daysLeft: 182,
      tokensUsed: 450000,
      tokensLimit: 1000000,
      initials: 'JD'
    },
    {
      id: 2,
      email: 'marianne.leroy@tech.io',
      status: 'SUSPENDU',
      expireDate: '12 Avr 2024',
      daysLeft: 0,
      tokensUsed: 2100000,
      tokensLimit: 2000000,
      initials: 'ML'
    },
    {
      id: 3,
      email: 's.rodriguez@nexus.ai',
      status: 'EXPIRÉ',
      expireDate: '01 Mai 2024',
      daysLeft: 0,
      tokensUsed: 980000,
      tokensLimit: 1000000,
      initials: 'SR'
    },
    {
      id: 4,
      email: 'amine.aziz@global.com',
      status: 'ACTIF',
      expireDate: '22 Dec 2024',
      daysLeft: 249,
      tokensUsed: 8200000,
      tokensLimit: 10000000,
      initials: 'AA'
    }
  ]);

  const renderProgressBar = (used, limit) => {
    const percentage = Math.min((used / limit) * 100, 100);
    const isOverLimit = used >= limit;

    return (
      <div style={{ width: 140 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#a3a3a3', marginBottom: 4 }}>
          <span>{(used / 1000000).toFixed(1)}M utilisés</span>
          <span>{(limit / 1000000).toFixed(1)}M limite</span>
        </div>
        <div style={{ width: '100%', height: 4, backgroundColor: '#333', borderRadius: 2 }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: isOverLimit ? 'var(--status-suspended)' : 'var(--status-active)',
            borderRadius: 2
          }}></div>
        </div>
      </div>
    );
  };

  const renderStatus = (status) => {
    let color, bgColor;
    if (status === 'ACTIF') {
      color = 'var(--status-active)';
      bgColor = 'var(--status-active-bg)';
    } else if (status === 'SUSPENDU') {
      color = 'var(--status-suspended)';
      bgColor = 'var(--status-suspended-bg)';
    } else {
      color = 'var(--status-expired)';
      bgColor = 'var(--status-expired-bg)';
    }

    return (
      <span style={{ color, fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4, border: `1px solid ${color}`, backgroundColor: bgColor }}>
        {status}
      </span>
    );
  };

  // Common Modal Styles
  const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
  const modalStyle = { backgroundColor: '#111', border: '1px solid #333', padding: 32, borderRadius: 16, width: 440, color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' };
  const modalHeaderStyle = { fontSize: 20, fontWeight: 600, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const closeBtnStyle = { background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 18 };
  const labelStyle = { display: 'block', fontSize: 13, color: '#a3a3a3', marginBottom: 6 };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, backgroundColor: '#000', border: '1px solid #333', color: '#fff', outline: 'none', colorScheme: 'dark' };
  const cancelBtnStyle = { flex: 1, padding: '12px', background: 'transparent', border: '1px solid #333', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 500 };
  const primaryBtnStyle = { flex: 1, padding: '12px', background: 'var(--admin-accent)', border: 'none', color: '#000', borderRadius: 8, cursor: 'pointer', fontWeight: 600 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Gestion des Utilisateurs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Supervisez et gérez les accès des membres de Nexus AI.</p>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              style={{ padding: '10px 16px 10px 36px', borderRadius: 8, backgroundColor: '#111', border: '1px solid #333', color: '#fff', fontSize: 13, outline: 'none', width: 250 }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{ display: 'flex', gap: 8 }}>
            <UserPlus size={16} /> Créer un utilisateur
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
            <UsersIcon size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Total Utilisateurs</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>1,284</div>
          </div>
        </div>

        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: 'var(--status-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-active)' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--status-active)', marginBottom: 2 }}>Actifs</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>1,120</div>
          </div>
        </div>

        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: 'var(--status-expired-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-expired)' }}>
            <Hourglass size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Expirant bientôt</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>45</div>
          </div>
        </div>

        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: 'var(--status-suspended-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-suspended)' }}>
            <Ban size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Suspendus</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>12</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #333', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr', gap: 16, fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: 0.5 }}>
          <div>EMAIL</div>
          <div>STATUT</div>
          <div>DATE D'EXPIRATION</div>
          <div>JOURS RESTANTS</div>
          <div>CONSOMMATION JETONS</div>
          <div style={{ textAlign: 'right' }}>ACTIONS</div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {users.map(user => (
            <div key={user.id} style={{ padding: '16px 24px', borderBottom: '1px solid #2a2a2a', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr', gap: 16, alignItems: 'center', fontSize: 13 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>
                  {user.initials}
                </div>
                <div style={{ fontWeight: 600 }}>{user.email}</div>
              </div>

              <div>{renderStatus(user.status)}</div>

              <div>{user.expireDate}</div>

              <div style={{ color: user.daysLeft === 0 ? 'var(--status-suspended)' : 'inherit' }}>
                {user.daysLeft > 0 ? `${user.daysLeft} jours` : 'Passé'}
              </div>

              <div>{renderProgressBar(user.tokensUsed, user.tokensLimit)}</div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                {user.status === 'EXPIRÉ' ? (
                  <button className="btn btn-outline" onClick={() => setConfirmAction({ type: 'renew', userId: user.id })} style={{ padding: '4px 12px', fontSize: 11 }}>RENOUVELER</button>
                ) : (
                  <>
                    <button onClick={() => setEditUser(user)} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}><Edit2 size={16} /></button>
                    <button onClick={() => setConfirmAction({ type: 'suspend', userId: user.id })} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}><Ban size={16} /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#a3a3a3' }}>
          <div>Affichage de 1-4 sur 1,284 utilisateurs</div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={{ padding: '6px 12px', background: '#111', border: '1px solid #333', color: '#a3a3a3', borderRadius: 6, cursor: 'pointer' }}>&lt;</button>
            <button style={{ padding: '6px 12px', background: 'var(--admin-accent-bg)', border: `1px solid var(--admin-accent)`, color: 'var(--admin-accent)', borderRadius: 6, cursor: 'pointer' }}>1</button>
            <button style={{ padding: '6px 12px', background: '#111', border: '1px solid #333', color: '#a3a3a3', borderRadius: 6, cursor: 'pointer' }}>2</button>
            <button style={{ padding: '6px 12px', background: '#111', border: '1px solid #333', color: '#a3a3a3', borderRadius: 6, cursor: 'pointer' }}>3</button>
            <button style={{ padding: '6px 12px', background: '#111', border: '1px solid #333', color: '#a3a3a3', borderRadius: 6, cursor: 'pointer' }}>&gt;</button>
          </div>
        </div>
      </div>

      {/* 1. Create User Modal */}
      {isCreateModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={modalHeaderStyle}>
              Créer un nouvel utilisateur
              <button onClick={() => setIsCreateModalOpen(false)} style={closeBtnStyle}>✕</button>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Adresse e-mail</label>
                <input type="email" placeholder="email@exemple.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <input type="password" placeholder="••••••••" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Limite de jetons (Tokens)</label>
                <input type="number" placeholder="Ex: 1000000" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date d'expiration</label>
                  <input type="date" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setIsCreateModalOpen(false)} style={cancelBtnStyle}>Annuler</button>
                <button onClick={() => setIsCreateModalOpen(false)} style={primaryBtnStyle}>Créer l'utilisateur</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Edit User Modal */}
      {editUser && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={modalHeaderStyle}>
              Modifier l'utilisateur
              <button onClick={() => setEditUser(null)} style={closeBtnStyle}>✕</button>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>
                Abonné : <strong style={{ color: '#fff' }}>{editUser.email}</strong>
              </div>
              <div>
                <label style={labelStyle}>Nouvelle limite de jetons (Tokens)</label>
                <input type="number" defaultValue={editUser.tokensLimit} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Date d'expiration</label>
                  <input type="date" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setEditUser(null)} style={cancelBtnStyle}>Annuler</button>
                <button onClick={() => setEditUser(null)} style={primaryBtnStyle}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Confirm Renew/Suspend Modal */}
      {confirmAction && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalStyle, width: 380, textAlign: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Confirmation</h2>
            <p style={{ color: '#a3a3a3', fontSize: 14, marginBottom: 24 }}>
              {confirmAction.type === 'renew' 
                ? "Êtes-vous sûr de vouloir renouveler l'abonnement de cet utilisateur ?" 
                : "Êtes-vous sûr de vouloir suspendre cet utilisateur ?"}
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setConfirmAction(null)} style={cancelBtnStyle}>Non, annuler</button>
              <button onClick={() => setConfirmAction(null)} style={{ ...primaryBtnStyle, backgroundColor: confirmAction.type === 'suspend' ? '#ef4444' : 'var(--admin-accent)' }}>
                Oui, confirmer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
