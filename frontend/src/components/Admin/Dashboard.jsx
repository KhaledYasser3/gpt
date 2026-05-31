import React from 'react';
import { Calendar, Download, MoreVertical, TrendingUp, TrendingDown, Users, FileText, DollarSign } from 'lucide-react';

export default function Dashboard({ isRtl, onNavigateToRequest, onNavigateToReview }) {
  const trans = {
    title: isRtl ? 'نظرة عامة على لوحة التحكم' : 'Dashboard Overview',
    desc: isRtl 
      ? 'أهلاً بك مجدداً. إليك ما يحدث عبر نظامك اليوم.'
      : 'Welcome back. Here\'s what\'s happening across your instances today.',
    last30: isRtl ? 'آخر 30 يوم' : 'Last 30 Days',
    export: isRtl ? 'تصدير البيانات' : 'Export Data',
    totalUsers: isRtl ? 'إجمالي المستخدمين' : 'TOTAL USERS',
    pendingReqs: isRtl ? 'الطلبات المعلقة' : 'PENDING REQUESTS',
    revenue: isRtl ? 'الإيرادات الشهيرة (MRR)' : 'REVENUE (MRR)',
    tableTitle: isRtl ? 'تحديثات الاشتراكات' : 'Subscription Updates',
    viewAll: isRtl ? 'عرض جميع السجلات' : 'View All Records'
  };

  const updates = [
    {
      name: 'Alex Riviera',
      email: 'alex.r@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=60',
      prev: 'Standard Monthly',
      next: 'Enterprise Annual',
      date: 'Oct 24, 2024',
      status: 'completed'
    },
    {
      name: 'Sarah Chen',
      email: 's.chen@corp.com',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=60',
      prev: 'Trial',
      next: 'Pro Monthly',
      date: 'Oct 23, 2024',
      status: 'completed'
    },
    {
      name: 'Marcus Wright',
      email: 'm.wright@nexus.io',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=60',
      prev: 'Enterprise Monthly',
      next: 'Canceled',
      date: 'Oct 22, 2024',
      status: 'processing'
    }
  ];

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Top action row */}
      <div style={{ ...styles.actionRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <div style={{ ...styles.headerTexts, textAlign: isRtl ? 'right' : 'left' }}>
          <h2 style={styles.title}>{trans.title}</h2>
          <p style={styles.desc}>{trans.desc}</p>
        </div>
        <div style={{ ...styles.buttonsRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <button style={styles.datePickerBtn}>
            <Calendar size={14} />
            <span>{trans.last30}</span>
          </button>
          <button style={styles.exportBtn}>
            <Download size={14} />
            <span>{trans.export}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div style={styles.metricsGrid}>
        {/* Card 1: TOTAL USERS */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.cardMetaRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.iconBoxBlue}>
              <Users size={16} color="#3B82F6" />
            </div>
            <span style={styles.percentUp}>
              +12.5%
              <TrendingUp size={12} />
            </span>
          </div>
          <span style={styles.metricLabel}>{trans.totalUsers}</span>
          <span style={styles.metricValue}>24,892</span>
          {/* Sparkline line SVG */}
          <div style={styles.sparkline}>
            <svg viewBox="0 0 100 30" width="100%" height="30">
              <path d="M0,25 Q15,5 30,20 T60,10 T90,15 T100,5" fill="none" stroke="#3B82F6" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 2: PENDING REQUESTS */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.cardMetaRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.iconBoxYellow}>
              <FileText size={16} color="#F59E0B" />
            </div>
            <span style={styles.percentDown}>
              -4.2%
              <TrendingDown size={12} />
            </span>
          </div>
          <span style={styles.metricLabel}>{trans.pendingReqs}</span>
          <span style={styles.metricValue}>182</span>
          {/* Sparkline line SVG */}
          <div style={styles.sparkline}>
            <svg viewBox="0 0 100 30" width="100%" height="30">
              <path d="M0,10 Q20,25 40,15 T70,25 T100,10" fill="none" stroke="#EF4444" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 3: MRR */}
        <div style={styles.metricCard}>
          <div style={{ ...styles.cardMetaRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.iconBoxBlue}>
              <DollarSign size={16} color="#3B82F6" />
            </div>
            <span style={styles.percentUp}>
              +28.1%
              <TrendingUp size={12} />
            </span>
          </div>
          <span style={styles.metricLabel}>{trans.revenue}</span>
          <span style={styles.metricValue}>$142,500</span>
          {/* Sparkline line SVG */}
          <div style={styles.sparkline}>
            <svg viewBox="0 0 100 30" width="100%" height="30">
              <path d="M0,28 Q20,20 40,18 T75,5 T100,8" fill="none" stroke="#3B82F6" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Subscription updates table section */}
      <div style={styles.tableSection}>
        <div style={{ ...styles.tableHeader, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <h3 style={styles.tableTitle}>{trans.tableTitle}</h3>
          <span style={styles.viewAllLink}>{trans.viewAll}</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={{ ...styles.table, textAlign: isRtl ? 'right' : 'left' }}>
            <thead>
              <tr style={{ ...styles.thRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <th>{isRtl ? 'المستخدم' : 'USER'}</th>
                <th>{isRtl ? 'الخطة السابقة' : 'PREVIOUS PLAN'}</th>
                <th>{isRtl ? 'الخطة الجديدة' : 'NEW PLAN'}</th>
                <th>{isRtl ? 'تاريخ التغيير' : 'CHANGE DATE'}</th>
                <th>{isRtl ? 'الحالة' : 'STATUS'}</th>
                <th style={{ textAlign: 'center' }}></th>
              </tr>
            </thead>
            <tbody>
              {updates.map((up, idx) => (
                <tr
                  key={idx}
                  style={styles.trRow}
                  onClick={up.name === 'Alex Riviera' ? onNavigateToRequest : onNavigateToReview}
                >
                  <td>
                    <div style={{ ...styles.userCell, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                      <img src={up.avatar} alt={up.name} style={styles.tableAvatar} />
                      <div style={styles.userMeta}>
                        <span style={styles.userName}>{up.name}</span>
                        <span style={styles.userEmail}>{up.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={styles.planCell}>{up.prev}</td>
                  <td style={{
                    ...styles.planCell,
                    color: up.next === 'Canceled' ? '#EF4444' : '#3B82F6',
                    fontWeight: up.next !== 'Canceled' ? '600' : 'normal'
                  }}>
                    {up.next}
                  </td>
                  <td style={styles.planCell}>{up.date}</td>
                  <td>
                    <span style={{
                      ...styles.statusBadge,
                      background: up.status === 'completed' ? 'rgba(59,130,246,0.1)' : 'rgba(239,68,68,0.1)',
                      color: up.status === 'completed' ? '#3B82F6' : '#EF4444',
                      border: up.status === 'completed' ? '1px solid rgba(59,130,246,0.2)' : '1px solid rgba(239,68,68,0.2)'
                    }}>
                      {up.status === 'completed' ? 'COMPLETED' : 'PROCESSING'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button style={styles.actionBtn}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTexts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.5px',
  },
  desc: {
    fontSize: '14px',
    color: '#9CA3AF',
  },
  buttonsRow: {
    display: 'flex',
    gap: '12px',
  },
  datePickerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: '#000000',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  metricCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  cardMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  iconBoxBlue: {
    width: '32px',
    height: '32px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxYellow: {
    width: '32px',
    height: '32px',
    background: 'rgba(245, 158, 11, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentUp: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#10B981',
  },
  percentDown: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#EF4444',
  },
  metricLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '16px',
  },
  sparkline: {
    height: '30px',
  },
  tableSection: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewAllLink: {
    fontSize: '13px',
    color: '#3B82F6',
    cursor: 'pointer',
    fontWeight: '600',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thRow: {
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '12px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: '0.5px',
    'th': {
      padding: '12px 16px',
    }
  },
  trRow: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      background: 'rgba(255,255,255,0.02)'
    }
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
  },
  tableAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: '11px',
    color: '#6B7280',
  },
  planCell: {
    fontSize: '13px',
    color: '#D1D5DB',
    padding: '14px 16px',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    padding: '8px',
  }
};
