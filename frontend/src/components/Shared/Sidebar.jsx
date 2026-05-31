import React from 'react';
import { MessageSquare, LayoutDashboard, CreditCard, Users, Settings, HelpCircle, LogOut, Zap } from 'lucide-react';

export default function Sidebar({
  role,
  activeItem,
  onNavigate,
  isRtl,
  userState
}) {
  const translations = {
    brand: isRtl ? 'نظام نيكسس' : 'SaaS Nexus',
    brandSub: isRtl ? 'إدارة المؤسسات' : 'Enterprise Admin',
    newChat: isRtl ? 'محادثة جديدة' : 'New Chat',
    dashboard: isRtl ? 'لوحة التحكم' : 'Dashboard',
    subscriptions: isRtl ? 'الاشتراكات' : 'Subscriptions',
    userManagement: isRtl ? 'إدارة المستخدمين' : 'User Management',
    settings: isRtl ? 'الإعدادات' : 'Settings',
    upgrade: isRtl ? 'ترقية الخطة' : 'Upgrade Plan',
    help: isRtl ? 'المساعدة' : 'Help',
    signOut: isRtl ? 'تسجيل الخروج' : 'Sign Out',
    adminTitle: isRtl ? 'أمين النظام' : 'Alex Rivera',
    adminSub: isRtl ? 'مدير الحسابات' : 'Enterprise Admin',
    currentUsage: isRtl ? 'الاستخدام الحالي' : 'Current Usage'
  };

  const menuItems = role === 'admin'
    ? [
        { id: 'dashboard', label: translations.dashboard, icon: LayoutDashboard },
        { id: 'request_detail', label: translations.subscriptions, icon: CreditCard },
        { id: 'payment_review', label: isRtl ? 'مراجعة الدفع' : 'Payment Review', icon: Users },
        { id: 'settings', label: translations.settings, icon: Settings },
      ]
    : [
        { id: 'chat', label: translations.newChat, icon: MessageSquare, actionBtn: true },
        { id: 'dashboard', label: translations.dashboard, icon: LayoutDashboard },
        { id: 'subscription', label: translations.subscriptions, icon: CreditCard },
        { id: 'settings', label: translations.settings, icon: Settings },
      ];

  return (
    <div style={{
      ...styles.sidebar,
      borderRight: isRtl ? 'none' : '1px solid var(--border-color)',
      borderLeft: isRtl ? '1px solid var(--border-color)' : 'none',
    }}>
      {/* Brand Header */}
      <div style={styles.brandContainer}>
        <div style={styles.brandIcon}>
          <Zap size={18} color="#FFFFFF" fill="#FFFFFF" />
        </div>
        <div style={styles.brandText}>
          <h2 style={styles.brandTitle}>{translations.brand}</h2>
          <span style={styles.brandSub}>{translations.brandSub}</span>
        </div>
      </div>

      {/* Navigation menu */}
      <div style={styles.menuList}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          if (item.actionBtn) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={styles.newChatBtn}
              >
                <MessageSquare size={16} />
                {item.label}
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.menuItemActive : {}),
                flexDirection: isRtl ? 'row-reverse' : 'row'
              }}
            >
              <Icon size={18} style={isRtl ? { marginLeft: '12px' } : { marginRight: '12px' }} />
              <span style={isRtl ? styles.arText : styles.enText}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Upgrade widget (Only for User role, especially active ones) */}
      {role === 'user' && (
        <div style={styles.upgradeWidget}>
          <div style={styles.usageText}>
            <span>{translations.currentUsage}</span>
            <span>75%</span>
          </div>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: '75%' }} />
          </div>
          <button style={styles.upgradeBtn}>{translations.upgrade}</button>
        </div>
      )}

      {/* Sidebar Footer */}
      <div style={styles.footer}>
        {/* User Info */}
        <div style={{ ...styles.userInfo, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=60"
            alt="Profile"
            style={styles.avatar}
          />
          <div style={{ ...styles.userMeta, textAlign: isRtl ? 'right' : 'left' }}>
            <h4 style={styles.userName}>{translations.adminTitle}</h4>
            <span style={styles.userRole}>{translations.adminSub}</span>
          </div>
        </div>

        <button style={{ ...styles.footerBtn, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <HelpCircle size={16} style={isRtl ? { marginLeft: '8px' } : { marginRight: '8px' }} />
          <span>{translations.help}</span>
        </button>

        <button style={{ ...styles.footerBtn, flexDirection: isRtl ? 'row-reverse' : 'row', color: '#EF4444' }}>
          <LogOut size={16} style={isRtl ? { marginLeft: '8px' } : { marginRight: '8px' }} />
          <span>{translations.signOut}</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    background: 'rgba(9, 13, 22, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    flexShrink: 0,
    zIndex: 100,
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '28px',
    paddingLeft: '8px',
  },
  brandIcon: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(29, 78, 216, 0.4)',
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.3px',
  },
  brandSub: {
    fontSize: '10px',
    fontWeight: '500',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  newChatBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
    marginBottom: '16px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#9CA3AF',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    width: '100%',
  },
  menuItemActive: {
    background: 'rgba(37, 99, 235, 0.15)',
    color: '#3B82F6',
    fontWeight: '600',
  },
  arText: {
    fontFamily: 'var(--font-ar)',
    fontWeight: '600',
  },
  enText: {
    fontFamily: 'var(--font-en)',
  },
  upgradeWidget: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '20px',
  },
  usageText: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#9CA3AF',
    marginBottom: '8px',
    fontWeight: '500',
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '12px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
    borderRadius: '3px',
  },
  upgradeBtn: {
    width: '100%',
    padding: '8px',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '4px 8px',
    marginBottom: '8px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.1)',
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: '11px',
    color: '#9CA3AF',
  },
  footerBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    padding: '6px 8px',
    width: '100%',
  }
};
