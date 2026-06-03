import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users as UsersIcon, CheckCircle, Hourglass, Ban, Edit2, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'renew' | 'delete', user: User }
  const [renewForm, setRenewForm] = useState({ end_date: '', tokens_to_add: '' });
  
  // Forms state
  const [createForm, setCreateForm] = useState({ full_name: '', username: '', email: '', password: '', token_limit: '', start_date: '', end_date: '' });
  const [editForm, setEditForm] = useState({ tokens_limit: '', end_date: '' });
  
  const [createError, setCreateError] = useState('');
  const [editError, setEditError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getUsers();
      if (res && res.users) {
        setUsers(res.users.filter(u => String(u.role).toUpperCase() !== 'ADMIN'));
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    setCreateError('');
    if (!createForm.full_name || !createForm.username || !createForm.email || !createForm.password || !createForm.token_limit || !createForm.start_date || !createForm.end_date) {
      setCreateError('Veuillez remplir tous les champs.');
      return;
    }
    
    const startDate = new Date(createForm.start_date);
    const endDate = new Date(createForm.end_date);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setCreateError('Dates invalides. Veuillez vérifier le format.');
      return;
    }
    if (startDate > endDate) {
      setCreateError("La date d'expiration doit être postérieure à la date de début.");
      return;
    }

    try {
      await api.admin.createUser({
        ...createForm,
        token_limit: parseInt(createForm.token_limit),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
      setIsCreateModalOpen(false);
      setCreateForm({ full_name: '', username: '', email: '', password: '', token_limit: '', start_date: '', end_date: '' });
      loadUsers();
    } catch (e) {
      setCreateError(e.message || 'Erreur lors de la création.');
    }
  };

  const handleEditUser = async () => {
    setEditError('');
    try {
      if (editForm.tokens_limit !== editUser.subscription?.token_limit) {
        const diff = parseInt(editForm.tokens_limit) - (editUser.subscription?.token_limit || 0);
        if (!isNaN(diff) && diff !== 0) {
          await api.admin.addTokens(editUser.id, diff);
        }
      }
      if (editForm.end_date) {
        await api.admin.renewUser(editUser.id, new Date(editForm.end_date).toISOString());
      }
      setEditUser(null);
      loadUsers();
    } catch (e) {
      setEditError(e.message || 'Erreur lors de la mise à jour.');
    }
  };

  const handleConfirmAction = async () => {
    setConfirmError('');
    try {
      if (confirmAction.type === 'delete') {
        await api.admin.deleteUser(confirmAction.user.id);
      } else if (confirmAction.type === 'renew') {
        // Renew end_date if provided
        if (renewForm.end_date) {
          await api.admin.renewUser(confirmAction.user.id, new Date(renewForm.end_date).toISOString());
        }
        // Add tokens if provided
        const tokensToAdd = parseInt(renewForm.tokens_to_add);
        if (!isNaN(tokensToAdd) && tokensToAdd > 0) {
          await api.admin.addTokens(confirmAction.user.id, tokensToAdd);
        }
        if (!renewForm.end_date && !(parseInt(renewForm.tokens_to_add) > 0)) {
          setConfirmError('Veuillez renseigner au moins une valeur (date ou jetons).');
          return;
        }
      }
      setConfirmAction(null);
      setRenewForm({ end_date: '', tokens_to_add: '' });
      loadUsers();
    } catch (e) {
      setConfirmError(e.message || "Erreur lors de l'opération.");
    }
  };

  const getDaysLeft = (endDateStr) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr);
    const now = new Date();
    const diffTime = end - now;
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const formatTokens = (n) => {
    if (!n && n !== 0) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const renderProgressBar = (used = 0, limit = 1) => {
    if (limit <= 0) limit = 1;
    const percentage = Math.min((used / limit) * 100, 100);
    const isOverLimit = used >= limit;
    const remainingPct = Math.max(0, 100 - percentage).toFixed(0);

    return (
      <div style={{ width: 160 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#a3a3a3', marginBottom: 4 }}>
          <span>{formatTokens(used)} utilisés</span>
          <span style={{ color: isOverLimit ? 'var(--status-suspended)' : '#10b981' }}>{remainingPct}% restant</span>
        </div>
        <div style={{ width: '100%', height: 5, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: isOverLimit ? 'var(--status-suspended)' : percentage >= 80 ? '#f59e0b' : 'var(--status-active)',
            borderRadius: 3,
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        <div style={{ fontSize: 10, color: '#555', marginTop: 3 }}>
          {formatTokens(limit)} limite totale
        </div>
      </div>
    );
  };

  const renderStatus = (user) => {
    const daysLeft = getDaysLeft(user.subscription?.end_date);
    const tokensUsed = user.subscription?.tokens_used || 0;
    const tokenLimit = user.subscription?.token_limit || 0;
    const isTokensExhausted = tokenLimit > 0 && tokensUsed >= tokenLimit;
    
    let status = 'ACTIF';
    let color = 'var(--status-active)';
    let bgColor = 'var(--status-active-bg)';

    if (!user.is_active) {
      status = 'SUSPENDU';
      color = 'var(--status-suspended)';
      bgColor = 'var(--status-suspended-bg)';
    } else if (daysLeft === 0 || isTokensExhausted) {
      status = 'EXPIRÉ';
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

  const isUserExpired = (u) => {
    const daysLeft = getDaysLeft(u.subscription?.end_date);
    const tokensUsed = u.subscription?.tokens_used || 0;
    const tokenLimit = u.subscription?.token_limit || 0;
    const isTokensExhausted = tokenLimit > 0 && tokensUsed >= tokenLimit;
    return daysLeft === 0 || isTokensExhausted;
  };

  const activeUsersCount = users.filter(u => !isUserExpired(u) && u.is_active).length;
  const expiredUsersCount = users.filter(u => isUserExpired(u)).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Gestion des Utilisateurs</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Supervisez et gérez les accès des membres.</p>
        </div>

        <div style={{ display: 'flex', gap: 16 }}>
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
            <div style={{ fontSize: 22, fontWeight: 700 }}>{users.length}</div>
          </div>
        </div>
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: 'var(--status-active-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-active)' }}>
            <CheckCircle size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--status-active)', marginBottom: 2 }}>Actifs</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{activeUsersCount}</div>
          </div>
        </div>
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px' }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, backgroundColor: 'var(--status-expired-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--status-expired)' }}>
            <Hourglass size={22} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>Expirés</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{expiredUsersCount}</div>
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
          {loading ? (
             <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>Chargement...</div>
          ) : users.map(user => {
            const daysLeft = getDaysLeft(user.subscription?.end_date);
            const tokensUsed = user.subscription?.tokens_used || 0;
            const tokenLimit = user.subscription?.token_limit || 0;
            const isTokensExhausted = tokenLimit > 0 && tokensUsed >= tokenLimit;
            const isExpired = daysLeft === 0 || isTokensExhausted;

            return (
              <div key={user.id} style={{ padding: '16px 24px', borderBottom: '1px solid #2a2a2a', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr', gap: 16, alignItems: 'center', fontSize: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 'bold' }}>
                    {getInitials(user.full_name || user.username)}
                  </div>
                  <div style={{ fontWeight: 600 }}>{user.email}</div>
                </div>

                <div>{renderStatus(user)}</div>

                <div>{user.subscription?.end_date ? new Date(user.subscription.end_date).toLocaleDateString() : 'N/A'}</div>

                <div style={{ color: isExpired ? 'var(--status-suspended)' : 'inherit' }}>
                  {daysLeft > 0 ? `${daysLeft} jours` : 'Passé'}
                </div>

                <div>{renderProgressBar(user.subscription?.tokens_used, user.subscription?.token_limit)}</div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                  {isExpired ? (
                    <button className="btn btn-outline" onClick={() => setConfirmAction({ type: 'renew', user })} style={{ padding: '4px 12px', fontSize: 11 }}>RENOUVELER</button>
                  ) : (
                    <>
                      <button onClick={() => {
                        setEditUser(user);
                        setEditForm({ tokens_limit: user.subscription?.token_limit || 0, end_date: user.subscription?.end_date ? user.subscription.end_date.split('T')[0] : '' });
                      }} style={{ background: 'transparent', border: 'none', color: '#a3a3a3', cursor: 'pointer' }}><Edit2 size={16} /></button>
                      <button onClick={() => setConfirmAction({ type: 'delete', user })} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 1. Create User Modal */}
      {isCreateModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={modalHeaderStyle}>
              Créer un utilisateur
              <button onClick={() => { setIsCreateModalOpen(false); setCreateError(''); }} style={closeBtnStyle}>✕</button>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {createError && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <AlertCircle size={16} />
                  {createError}
                </div>
              )}
              <div>
                <label style={labelStyle}>Nom complet</label>
                <input type="text" placeholder="John Doe" style={inputStyle} value={createForm.full_name} onChange={e => setCreateForm({...createForm, full_name: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Nom d'utilisateur</label>
                  <input type="text" placeholder="johndoe1" style={inputStyle} value={createForm.username} onChange={e => setCreateForm({...createForm, username: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>E-mail</label>
                  <input type="email" placeholder="email@exemple.com" style={inputStyle} value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mot de passe</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" style={inputStyle} value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#888', cursor: 'pointer', display: 'flex', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Limite de jetons</label>
                <input type="number" placeholder="1000000" style={inputStyle} value={createForm.token_limit} onChange={e => setCreateForm({...createForm, token_limit: e.target.value})} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Date de début</label>
                  <input type="date" style={inputStyle} value={createForm.start_date} onChange={e => setCreateForm({...createForm, start_date: e.target.value})} />
                </div>
                <div>
                  <label style={labelStyle}>Date d'expiration</label>
                  <input type="date" style={inputStyle} value={createForm.end_date} onChange={e => setCreateForm({...createForm, end_date: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setIsCreateModalOpen(false)} style={cancelBtnStyle}>Annuler</button>
                <button onClick={handleCreateUser} style={primaryBtnStyle}>Créer l'utilisateur</button>
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
              <button onClick={() => { setEditUser(null); setEditError(''); }} style={closeBtnStyle}>✕</button>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {editError && (
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <AlertCircle size={16} />
                  {editError}
                </div>
              )}
              <div style={{ color: '#a3a3a3', fontSize: 14 }}>
                Utilisateur : <strong style={{ color: '#fff' }}>{editUser.email}</strong>
              </div>
              <div>
                <label style={labelStyle}>Nouvelle limite de jetons (Tokens)</label>
                <input type="number" value={editForm.tokens_limit} onChange={e => setEditForm({...editForm, tokens_limit: e.target.value})} style={inputStyle} />
                <span style={{ fontSize: 11, color: '#888' }}>La différence sera ajoutée ou soustraite de la limite actuelle.</span>
              </div>
              <div>
                <label style={labelStyle}>Date d'expiration</label>
                <input type="date" value={editForm.end_date} onChange={e => setEditForm({...editForm, end_date: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button onClick={() => setEditUser(null)} style={cancelBtnStyle}>Annuler</button>
                <button onClick={handleEditUser} style={primaryBtnStyle}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Confirm Renew/Delete Modal */}
      {confirmAction && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalStyle, width: confirmAction.type === 'renew' ? 440 : 380, textAlign: confirmAction.type === 'renew' ? 'left' : 'center' }}>
            <h2 style={{ ...modalHeaderStyle, textAlign: 'left' }}>
              {confirmAction.type === 'renew' ? 'Renouveler l\'abonnement' : 'Confirmer la suppression'}
              <button onClick={() => { setConfirmAction(null); setRenewForm({ end_date: '', tokens_to_add: '' }); setConfirmError(''); }} style={closeBtnStyle}>✕</button>
            </h2>
            {confirmError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <AlertCircle size={16} />
                {confirmError}
              </div>
            )}

            {confirmAction.type === 'renew' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ color: '#a3a3a3', fontSize: 14 }}>
                  Utilisateur : <strong style={{ color: '#fff' }}>{confirmAction.user.email}</strong>
                </div>
                <div style={{ backgroundColor: '#1a1a1a', borderRadius: 8, padding: 12, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: '#888' }}>Tokens utilisés :</span>
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>{confirmAction.user.subscription?.tokens_used || 0} / {confirmAction.user.subscription?.token_limit || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#888' }}>Expiration actuelle :</span>
                    <span style={{ color: '#f59e0b', fontWeight: 600 }}>{confirmAction.user.subscription?.end_date ? new Date(confirmAction.user.subscription.end_date).toLocaleDateString() : 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Nouvelle date d'expiration</label>
                  <input
                    type="date"
                    value={renewForm.end_date}
                    onChange={e => setRenewForm({ ...renewForm, end_date: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Jetons à ajouter</label>
                  <input
                    type="number"
                    placeholder="ex: 5000"
                    value={renewForm.tokens_to_add}
                    onChange={e => setRenewForm({ ...renewForm, tokens_to_add: e.target.value })}
                    style={inputStyle}
                    min="0"
                  />
                  <span style={{ fontSize: 11, color: '#666', marginTop: 4, display: 'block' }}>Laissez vide pour ne pas modifier les jetons</span>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button onClick={() => { setConfirmAction(null); setRenewForm({ end_date: '', tokens_to_add: '' }); }} style={cancelBtnStyle}>Annuler</button>
                  <button onClick={handleConfirmAction} style={primaryBtnStyle}>Renouveler</button>
                </div>
              </div>
            ) : (
              <>
                <p style={{ color: '#a3a3a3', fontSize: 14, marginBottom: 24 }}>
                  Êtes-vous sûr de vouloir supprimer <strong style={{ color: '#fff' }}>{confirmAction.user.email}</strong> définitivement ?
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setConfirmAction(null)} style={cancelBtnStyle}>Non, annuler</button>
                  <button onClick={handleConfirmAction} style={{ ...primaryBtnStyle, backgroundColor: '#ef4444', color: '#fff' }}>Oui, supprimer</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
