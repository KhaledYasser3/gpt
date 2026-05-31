import React from 'react';
import { Bell, Globe, Search, ArrowLeft, HelpCircle } from 'lucide-react';

export default function Header({
  title,
  breadcrumbs,
  isRtl,
  setIsRtl,
  role,
  onBack
}) {
  const translations = {
    search: isRtl ? 'بحث في البيانات...' : 'Search analytics...',
    support: isRtl ? 'الدعم الفني' : 'Support',
    docs: isRtl ? 'المستندات' : 'Docs',
    changelog: isRtl ? 'التحديثات' : 'Changelog',
    feedback: isRtl ? 'الآراء والملاحظات' : 'Feedback'
  };

  return (
    <div style={{
      ...styles.header,
      flexDirection: isRtl ? 'row-reverse' : 'row'
    }}>
      {/* Left side: Breadcrumbs and Title */}
      <div style={{
        ...styles.leftSection,
        alignItems: isRtl ? 'flex-end' : 'flex-start',
        textAlign: isRtl ? 'right' : 'left'
      }}>
        {breadcrumbs && (
          <span style={styles.breadcrumbs}>
            {breadcrumbs}
          </span>
        )}
        <div style={{ ...styles.titleRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          {onBack && (
            <button onClick={onBack} style={styles.backBtn}>
              <ArrowLeft size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </button>
          )}
          <h1 style={{
            ...styles.title,
            fontFamily: isRtl ? 'var(--font-ar)' : 'var(--font-en)'
          }}>
            {title}
          </h1>
        </div>
      </div>

      {/* Right side: Actions / Search */}
      <div style={{
        ...styles.rightSection,
        flexDirection: isRtl ? 'row-reverse' : 'row'
      }}>
        {/* Search bar (primarily in Admin Dashboard) */}
        {role === 'admin' && (
          <div style={{
            ...styles.searchBox,
            flexDirection: isRtl ? 'row-reverse' : 'row'
          }}>
            <Search size={16} color="#6B7280" />
            <input
              type="text"
              placeholder={translations.search}
              style={{
                ...styles.searchInput,
                textAlign: isRtl ? 'right' : 'left',
                fontFamily: isRtl ? 'var(--font-ar)' : 'var(--font-en)'
              }}
            />
          </div>
        )}

        {/* Action links */}
        <div style={{ ...styles.linksRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <span style={styles.link}>{translations.docs}</span>
          <span style={styles.link}>{translations.support}</span>
          <span style={styles.link}>{translations.changelog}</span>
          <button style={styles.feedbackBtn}>{translations.feedback}</button>
        </div>

        {/* Global toggles */}
        <div style={{ ...styles.iconRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          {/* Language toggle */}
          <button onClick={() => setIsRtl(!isRtl)} style={styles.iconBtn} title="Switch Language">
            <Globe size={18} />
          </button>

          {/* Notifications */}
          <div style={styles.notificationWrapper}>
            <button style={styles.iconBtn}>
              <Bell size={18} />
            </button>
            <div style={styles.badgeDot} />
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    height: '70px',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(9, 13, 22, 0.4)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    flexShrink: 0,
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  breadcrumbs: {
    fontSize: '11px',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '2px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  backBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.05)',
      color: '#FFFFFF'
    }
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: '-0.3px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '8px 12px',
    gap: '8px',
    width: '240px',
  },
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: '#F3F4F6',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  },
  linksRow: {
    display: 'none', // Will show on desktop view
    '@media (min-width: 1024px)': {
      display: 'flex',
    },
    alignItems: 'center',
    gap: '16px',
  },
  link: {
    fontSize: '13px',
    color: '#9CA3AF',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      color: '#FFFFFF'
    }
  },
  feedbackBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '6px 12px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconBtn: {
    background: 'transparent',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      background: 'rgba(255,255,255,0.05)',
      color: '#FFFFFF'
    }
  },
  notificationWrapper: {
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: '6px',
    right: '8px',
    width: '8px',
    height: '8px',
    background: '#EF4444',
    borderRadius: '50%',
    border: '2px solid #090D16',
  }
};
