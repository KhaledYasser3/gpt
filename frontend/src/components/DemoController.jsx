import React from 'react';
import { Shield, User, Globe, Activity } from 'lucide-react';

export default function DemoController({
  role,
  setRole,
  userState,
  setUserState,
  adminState,
  setAdminState,
  isRtl,
  setIsRtl
}) {
  return (
    <div style={styles.floatingPanel}>
      <div style={styles.header}>
        <Activity size={16} color="#3B82F6" style={{ marginRight: '6px' }} />
        <span style={styles.title}>AI Chat SaaS - Demo Controller</span>
      </div>
      
      <div style={styles.controlsGroup}>
        {/* Role Toggler */}
        <div style={styles.controlBox}>
          <span style={styles.label}>Active Role:</span>
          <div style={styles.btnGroup}>
            <button
              onClick={() => setRole('user')}
              style={{
                ...styles.toggleBtn,
                ...(role === 'user' ? styles.activeBtn : {})
              }}
            >
              <User size={13} />
              User Portal
            </button>
            <button
              onClick={() => setRole('admin')}
              style={{
                ...styles.toggleBtn,
                ...(role === 'admin' ? styles.activeBtn : {})
              }}
            >
              <Shield size={13} />
              Admin Portal
            </button>
          </div>
        </div>

        {/* State Selection */}
        <div style={styles.controlBox}>
          <span style={styles.label}>Simulated Screen / State:</span>
          {role === 'user' ? (
            <select
              value={userState}
              onChange={(e) => setUserState(e.target.value)}
              style={styles.select}
            >
              <option value="landing">1. Landing Page (Visitor)</option>
              <option value="login">2. Login / Register Screen</option>
              <option value="checkout">3. Checkout / Select Payment</option>
              <option value="waiting">4. Waiting for Payment Review</option>
              <option value="chat">5. Active AI Chat Workspace</option>
            </select>
          ) : (
            <select
              value={adminState}
              onChange={(e) => setAdminState(e.target.value)}
              style={styles.select}
            >
              <option value="dashboard">1. Dashboard Overview</option>
              <option value="request_detail">2. Prepare Offer (Ahmed Mahmoud)</option>
              <option value="payment_review">3. Payment Review (Ahmed Al-Ali)</option>
              <option value="settings">4. General Settings</option>
            </select>
          )}
        </div>

        {/* LTR / RTL toggle */}
        <div style={styles.controlBox}>
          <span style={styles.label}>Language:</span>
          <button
            onClick={() => setIsRtl(!isRtl)}
            style={{
              ...styles.toggleBtn,
              width: '120px',
              justifyContent: 'center'
            }}
          >
            <Globe size={13} />
            {isRtl ? 'English (LTR)' : 'العربية (RTL)'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  floatingPanel: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    background: 'rgba(10, 15, 30, 0.95)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.15)',
    padding: '12px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    backdropFilter: 'blur(10px)',
    width: '90%',
    maxWidth: '850px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '6px',
    marginBottom: '4px',
  },
  title: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: 'monospace'
  },
  controlsGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px'
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#D1D5DB'
  },
  btnGroup: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '2px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#9CA3AF',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeBtn: {
    color: '#FFFFFF',
    background: '#2563EB',
    boxShadow: '0 2px 10px rgba(37, 99, 235, 0.3)'
  },
  select: {
    padding: '6px 12px',
    fontSize: '12px',
    background: '#1A2338',
    color: '#F3F4F6',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    outline: 'none',
    cursor: 'pointer'
  }
};
