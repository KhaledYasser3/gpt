import React, { useState } from 'react';
import { Send, FileText, User, Mail, Calendar, CheckSquare, ShieldAlert } from 'lucide-react';

export default function RequestDetail({ isRtl, onSendOffer }) {
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState('299.00');
  const [notes, setNotes] = useState('');
  
  const trans = {
    breadcrumbs: isRtl ? 'الاشتراكات / إدارة طلب الاشتراك' : 'Subscriptions / Manage Request',
    requestId: isRtl ? 'تفاصيل طلب الاشتراك SR-9921#' : 'Subscription Request Details SR-9921#',
    title: isRtl ? 'إدارة الطلبات' : 'Request Management',
    userDetailsTitle: isRtl ? 'تفاصيل المستخدم' : 'User Information',
    userName: isRtl ? 'أحمد محمود' : 'Ahmed Mahmoud',
    userEmail: 'ahmed.m@nexus-corp.com',
    userJoined: isRtl ? 'تاريخ التسجيل: ٢٤ أكتوبر ٢٠٢٤' : 'Joined: Oct 24, 2024',
    userNotesTitle: isRtl ? 'ملاحظات المستخدم' : 'User Notes',
    userNotesVal: isRtl 
      ? 'نحن مهتمون بخطة المؤسسات لعدد 50 مستخدماً. نحتاج إلى ميزات تسجيل الدخول الموحد (SSO) ودعم فني مخصص على مدار الساعة. هل هناك خصم متاح للعقود السنوية؟'
      : 'We are interested in the enterprise plan for 50 users. We need single sign-on (SSO) features and 24/7 dedicated support. Is there a discount for annual contracts?',
    planTitle: isRtl ? 'الخطة المطلوبة' : 'Requested Plan',
    planVal: isRtl ? 'باقة المؤسسات - تخصيص كامل' : 'Enterprise Plan - Full Customization',
    statusTitle: isRtl ? 'حالة الطلب' : 'Request Status',
    statusVal: isRtl ? 'قيد المراجعة' : 'Under Review',
    prepareTitle: isRtl ? 'تجهيز العرض' : 'Prepare Offer',
    priceLabel: isRtl ? 'السعر المقترح (شهرياً)' : 'Proposed Monthly Price',
    notesLabel: isRtl ? 'ملاحظات الإدارة (اختياري)' : 'Admin Notes (Optional)',
    notesPlace: isRtl ? 'اكتب تفاصيل إضافية حول هذا العرض...' : 'Write extra details about this offer...',
    btnSend: isRtl ? 'إرسال العرض للمستخدم' : 'Send Offer to User',
    btnDraft: isRtl ? 'حفظ كمسودة' : 'Save as Draft',
    footerText: isRtl 
      ? 'سيتم إرسال إشعار بالبريد الإلكتروني فور الضغط على إرسال العرض.'
      : 'An email notification will be sent automatically upon clicking Send Offer.'
  };

  const handleSend = (e) => {
    e.preventDefault();
    onSendOffer({ currency, price, notes });
  };

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Breadcrumbs Row */}
      <span style={{ ...styles.breadcrumbs, textAlign: isRtl ? 'right' : 'left' }}>
        {trans.breadcrumbs}
      </span>

      {/* Title */}
      <h2 style={{ ...styles.sectionTitle, textAlign: isRtl ? 'right' : 'left' }}>
        {trans.requestId}
      </h2>

      {/* Main Grid */}
      <div style={styles.detailGrid}>
        
        {/* Left main info cards */}
        <div style={styles.infoCardsWrapper}>
          
          {/* User Info card */}
          <div style={{ ...styles.card, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.avatarCircle}>
              <User size={24} color="#3B82F6" />
            </div>
            <div style={{ ...styles.userMetadata, textAlign: isRtl ? 'right' : 'left' }}>
              <h3 style={styles.cardHeader}>{trans.userDetailsTitle}</h3>
              <p style={styles.userNameText}>{trans.userName}</p>
              <p style={styles.userEmailText}>{trans.userEmail}</p>
              <p style={styles.userJoinedText}>{trans.userJoined}</p>
            </div>
          </div>

          {/* Requested Plan card */}
          <div style={{ ...styles.card, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.avatarCircle}>
              <FileText size={24} color="#10B981" />
            </div>
            <div style={{ ...styles.userMetadata, textAlign: isRtl ? 'right' : 'left' }}>
              <h3 style={styles.cardHeader}>{trans.planTitle}</h3>
              <p style={styles.planNameText}>{trans.planVal}</p>
            </div>
          </div>

          {/* Status card */}
          <div style={{ ...styles.card, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.avatarCircle}>
              <ShieldAlert size={24} color="#F59E0B" />
            </div>
            <div style={{ ...styles.userMetadata, textAlign: isRtl ? 'right' : 'left' }}>
              <h3 style={styles.cardHeader}>{trans.statusTitle}</h3>
              <span style={styles.statusBadgeOrange}>{trans.statusVal}</span>
            </div>
          </div>

          {/* User Notes card */}
          <div style={{
            ...styles.cardFull,
            textAlign: isRtl ? 'right' : 'left'
          }}>
            <h3 style={{ ...styles.cardHeader, marginBottom: '12px' }}>{trans.userNotesTitle}</h3>
            <p style={styles.userNotesText}>{trans.userNotesVal}</p>
          </div>

        </div>

        {/* Right side Prepare Offer Form Panel */}
        <form onSubmit={handleSend} style={styles.prepareOfferCard}>
          <h3 style={{
            ...styles.prepareHeader,
            textAlign: isRtl ? 'right' : 'left',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}>
            {trans.prepareTitle}
          </h3>

          {/* Price input */}
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, textAlign: isRtl ? 'right' : 'left' }}>{trans.priceLabel}</label>
            <div style={{ ...styles.priceInputWrapper, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={styles.currencySelect}
              >
                <option value="USD">USD ($)</option>
                <option value="SAR">SAR (ريال)</option>
                <option value="EGP">EGP (ج.م)</option>
              </select>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{
                  ...styles.priceInput,
                  textAlign: isRtl ? 'right' : 'left'
                }}
              />
            </div>
          </div>

          {/* Admin Notes */}
          <div style={styles.inputGroup}>
            <label style={{ ...styles.label, textAlign: isRtl ? 'right' : 'left' }}>{trans.notesLabel}</label>
            <textarea
              placeholder={trans.notesPlace}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                ...styles.textarea,
                textAlign: isRtl ? 'right' : 'left'
              }}
            />
          </div>

          {/* Action buttons */}
          <div style={styles.formActions}>
            <button type="submit" style={styles.sendBtn}>
              <Send size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
              {trans.btnSend}
            </button>
            <button type="button" style={styles.draftBtn}>
              {trans.btnDraft}
            </button>
          </div>

          {/* Info footnote */}
          <p style={styles.footerNote}>{trans.footerText}</p>
        </form>

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
  breadcrumbs: {
    fontSize: '11px',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.5px',
    marginBottom: '28px',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '24px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  infoCardsWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  card: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  cardFull: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  },
  avatarCircle: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMetadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  cardHeader: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  userNameText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userEmailText: {
    fontSize: '13px',
    color: '#9CA3AF',
  },
  userJoinedText: {
    fontSize: '12px',
    color: '#4B5563',
  },
  planNameText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: '4px',
  },
  statusBadgeOrange: {
    padding: '4px 12px',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '9999px',
    color: '#F59E0B',
    fontSize: '11px',
    fontWeight: '700',
    width: 'fit-content',
    marginTop: '6px',
  },
  userNotesText: {
    fontSize: '14px',
    color: '#D1D5DB',
    lineHeight: '1.6',
    whiteSpace: 'pre-line',
  },
  prepareOfferCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  prepareHeader: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#9CA3AF',
  },
  priceInputWrapper: {
    display: 'flex',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  currencySelect: {
    background: 'rgba(255,255,255,0.02)',
    border: 'none',
    borderRight: '1px solid rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '600',
    padding: '12px',
    outline: 'none',
    cursor: 'pointer',
  },
  priceInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '14px',
    padding: '12px 16px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    height: '110px',
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#FFFFFF',
    outline: 'none',
    resize: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#2563EB',
    }
  },
  formActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '12px',
  },
  sendBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '14px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
  },
  draftBtn: {
    padding: '14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  footerNote: {
    fontSize: '11px',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: '1.4',
  }
};
