import React, { useState } from 'react';
import { MessageSquarePlus, Search, Folder, Zap, Plus, Image as ImageIcon, Edit3, Globe, Mic, AlertCircle } from 'lucide-react';

export default function Chat() {
  const [showWarning, setShowWarning] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: 'var(--user-bg)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Sidebar */}
      <div style={{ width: 260, backgroundColor: 'var(--user-sidebar)', display: 'flex', flexDirection: 'column', borderRight: '1px solid #333' }}>
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 12px', borderRadius: 8, flex: 1 }}>
            <span style={{ width: 24, height: 24, backgroundColor: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, fontSize: 12, fontWeight: 'bold' }}>
              KY
            </span>
          </div>
          <button style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer' }}>
            <MessageSquarePlus size={20} />
          </button>
        </div>

        <div style={{ padding: '0 16px' }}>
          <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', fontSize: 14, borderRadius: 8 }}>
            <MessageSquarePlus size={16} /> Nouvelle discussion
          </button>
        </div>

        <div style={{ marginTop: 24, padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', color: '#b4b4b4', fontSize: 13, cursor: 'pointer' }}>
            <Search size={16} /> Rechercher...
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', color: '#ececec', fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
            <Folder size={16} /> Projects
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{ padding: '8px 28px', fontSize: 11, color: '#b4b4b4', fontWeight: 600, letterSpacing: 1 }}>GPTS</div>
        </div>

        <div style={{ position: 'relative', marginTop: 'auto' }}>
          
          {/* Profile Modal Popover */}
          {showProfile && (
            <div style={{ position: 'absolute', bottom: 70, left: 16, backgroundColor: '#2f2f2f', padding: 20, borderRadius: 12, width: 300, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 100, border: '1px solid #444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'bold' }}>KY</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>Nom de l'utilisateur</div>
                  <div style={{ fontSize: 13, color: '#b4b4b4' }}>user@gmail.com</div>
                </div>
              </div>
              <div style={{ backgroundColor: '#1c1c1c', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#b4b4b4', marginBottom: 4 }}>Type d'abonnement</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#e8a87c' }}>GPT Business</div>
              </div>
              <button 
                style={{ width: '100%', padding: '10px', backgroundColor: 'var(--admin-accent)', border: 'none', color: '#000', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }} 
                onClick={() => {
                  setShowProfile(false);
                  setShowManageModal(true);
                }}
              >
                Gérer l'abonnement
              </button>
            </div>
          )}

          {/* Manage Modal Centered */}
          {showManageModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(2px)' }}>
              <div style={{ backgroundColor: '#212121', border: '1px solid #333', padding: 32, borderRadius: 16, width: 500, color: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Détails de l'abonnement
                  <button onClick={() => setShowManageModal(false)} style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: 18 }}>✕</button>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, backgroundColor: '#2f2f2f', padding: 20, borderRadius: 12, border: '1px solid #444' }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#a3a3a3', marginBottom: 4 }}>Forfait</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>GPT Business</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#a3a3a3', marginBottom: 4 }}>Nombre de comptes</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>500 utilisateurs</div>
                  </div>

                  <div>
                    <div style={{ fontSize: 12, color: '#a3a3a3', marginBottom: 4 }}>Date d'expiration</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>30 / 05 / 2027 (1 an)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#a3a3a3', marginBottom: 4 }}>Mensualité</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>25 € / mois</div>
                  </div>

                  <div style={{ gridColumn: 'span 2', padding: '12px 0', borderTop: '1px solid #333', borderBottom: '1px solid #333', marginTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#a3a3a3' }}>Montant total payé</span>
                      <span style={{ fontSize: 18, fontWeight: 700 }}>150 000 €</span>
                    </div>
                  </div>

                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                    <div style={{ padding: '4px 8px', backgroundColor: '#fff', color: '#000', borderRadius: 4, fontSize: 12, fontWeight: 800, fontStyle: 'italic' }}>VISA</div>
                    <div style={{ fontSize: 14, color: '#ececec', letterSpacing: 1 }}>•••• •••• •••• 4620</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                  <button onClick={() => setShowManageModal(false)} style={{ padding: '10px 24px', backgroundColor: '#333', border: 'none', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Fermer</button>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: 16, borderTop: '1px solid #333' }}>
            <div onClick={() => setShowProfile(!showProfile)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 'bold' }}>
                KY
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Nom de l'utilisateur...</div>
                <div style={{ fontSize: 12, color: '#b4b4b4' }}>GPT Business</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Warning Banner for Subscription/Tokens */}
        {showWarning && (
          <div style={{ backgroundColor: '#f59e0b', color: '#000', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <AlertCircle size={18} />
            Attention : Votre abonnement expire dans 3 jours. Veuillez contacter l'administrateur pour le renouveler.
            <button onClick={() => setShowWarning(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>
        )}

        {/* Top Navbar */}
        <div style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#ececec', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            ChatGPT <span style={{ fontSize: 12, color: '#b4b4b4' }}>▼</span>
          </div>
        </div>

        {/* Chat Area Center */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
          <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 40 }}>Où commence-t-on ?</h2>

          <div style={{ width: '100%', maxWidth: 720 }}>
            {/* Input Box */}
            <div style={{ backgroundColor: 'var(--user-input-bg)', borderRadius: 24, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #444' }}>
              <button style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex' }}><Plus size={20} /></button>
              <input 
                type="text" 
                placeholder="Demander n'importe quoi" 
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: 16, outline: 'none' }}
              />
              <button style={{ background: 'transparent', border: 'none', color: '#ececec', cursor: 'pointer', display: 'flex' }}><Mic size={20} /></button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                <ImageIcon size={14} /> Créer une image
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                <Edit3 size={14} /> Écrire ou modifier
              </button>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', backgroundColor: 'var(--user-input-bg)', border: '1px solid #444', borderRadius: 999, color: '#ececec', fontSize: 13, cursor: 'pointer' }}>
                <Globe size={14} /> Rechercher quelque chose
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div style={{ textAlign: 'center', padding: '16px', fontSize: 11, color: '#555' }}>
          ChatGPT peut faire des erreurs. Vérifiez les informations importantes.
        </div>
      </div>
    </div>
  );
}
