import React, { useState } from 'react';
import { Mail, Lock, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { api } from '../../services/api';

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.auth.login(email, password);
      if (response && response.user) {
        onLogin(response);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ color: '#fff' }}>chatGPT</span>
        </h1>
        <p style={{ color: '#a3a3a3', fontSize: 16 }}>The future of enterprise intelligence.</p>
      </div>

      {/* Login Card */}
      <div style={{ backgroundColor: '#1c1c1c', padding: '40px', borderRadius: 16, width: '100%', maxWidth: 420, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 32 }}>Bon retour</h2>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px', borderRadius: 8, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 14, color: '#a3a3a3', marginBottom: 8 }}>Adresse e-mail</label>
            <input 
              type="email" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: 8, backgroundColor: '#000', border: '1px solid #333', color: '#fff', fontSize: 15, outline: 'none' }}
            />
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <label style={{ fontSize: 14, color: '#a3a3a3' }}>Mot de passe</label>
              <a href="#" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}>Mot de passe oublié ?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, backgroundColor: '#000', border: '1px solid #333', color: '#fff', fontSize: 15, outline: 'none' }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer', display: 'flex', padding: 0 }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', borderRadius: 8, backgroundColor: '#fff', color: '#000', fontSize: 16, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 10, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        {/* OR Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: '#666', fontSize: 12 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: '#333' }}></div>
          <span style={{ padding: '0 12px' }}>OR</span>
          <div style={{ flex: 1, height: 1, backgroundColor: '#333' }}></div>
        </div>

        {/* SSO Buttons */}
        <div style={{ display: 'flex', gap: 16 }}>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', backgroundColor: '#000', border: '1px solid #333', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
            <span style={{ width: 16, height: 16, backgroundColor: '#fff', borderRadius: '50%' }}></span> Google
          </button>
          <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', backgroundColor: '#000', border: '1px solid #333', borderRadius: 8, color: '#fff', cursor: 'pointer' }}>
            <span style={{ width: 16, height: 16, backgroundColor: '#00a4ef' }}></span> Microsoft
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#a3a3a3' }}>
          Vous n'avez pas de compte ? <a href="#" style={{ color: '#3b82f6', textDecoration: 'none' }}>S'inscrire</a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', gap: 24, marginTop: 40, fontSize: 12, color: '#666' }}>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Privacy</a>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Terms</a>
        <a href="#" style={{ color: '#666', textDecoration: 'none' }}>Contact</a>
      </div>
      <div style={{ marginTop: 16, fontSize: 11, color: '#555' }}>
        © 2024 SAAS NEXUS ENTERPRISE
      </div>
    </div>
  );
}
