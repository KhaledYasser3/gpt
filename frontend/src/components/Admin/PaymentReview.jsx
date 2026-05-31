import React, { useState } from 'react';
import { Check, X, ShieldAlert, Download, ZoomIn, FileText, User } from 'lucide-react';

export default function PaymentReview({ isRtl, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState('');

  const trans = {
    breadcrumbs: isRtl ? 'الاشتراكات / مراجعة المستندات' : 'Subscriptions / Review Documents',
    title: isRtl ? 'مراجعة إثبات الدفع' : 'Payment Proof Review',
    userName: isRtl ? 'أحمد محمد العلي' : 'Ahmed Mohamed Al-Ali',
    userId: 'USR-99281#',
    planLabel: isRtl ? 'الباقة المختارة' : 'Selected Plan',
    planVal: isRtl ? 'الباقة الاحترافية (سنوي)' : 'Professional Plan (Annual)',
    amountLabel: isRtl ? 'المبلغ المستحق' : 'Amount Due',
    amountVal: isRtl ? '1,200 ريال' : '1,200 SAR',
    uploadDate: isRtl 
      ? 'تاريخ الرفع 24 أكتوبر 2023 - 10:30 صباحاً'
      : 'Uploaded: Oct 24, 2023 - 10:30 AM',
    actionTitle: isRtl ? 'اتخاذ إجراء' : 'Take Action',
    rejectLabel: isRtl ? 'ملاحظات / سبب الرفض (اختياري)' : 'Rejection Reason / Notes (Optional)',
    rejectPlace: isRtl ? 'اكتب سبب الرفض هنا ليتم إرساله للمستخدم...' : 'Write reason for rejection here...',
    btnApprove: isRtl ? 'اعتماد الدفع وتفعيل الحساب' : 'Approve Payment & Activate',
    btnReject: isRtl ? 'رفض الطلب' : 'Reject Request',
    securityAlert: isRtl
      ? 'تنبيه أمني: يرجى التأكد من مطابقة "رقم المرجع" المكتوب في الإيصال مع كشف الحساب البنكي الخاص بالشركة قبل الاعتماد.'
      : 'Security Alert: Please ensure the reference number on the receipt matches the corporate bank statement before approving.',
    receiptHeader: isRtl ? 'صورة إيصال التحويل البنكي' : 'Bank Transfer Receipt Image'
  };

  const handleApprove = () => {
    onApprove(rejectReason);
  };

  const handleReject = () => {
    onReject(rejectReason);
  };

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Breadcrumbs Row */}
      <span style={{ ...styles.breadcrumbs, textAlign: isRtl ? 'right' : 'left' }}>
        {trans.breadcrumbs}
      </span>

      {/* Title */}
      <h2 style={{ ...styles.sectionTitle, textAlign: isRtl ? 'right' : 'left' }}>
        {trans.title}
      </h2>

      {/* Main Grid */}
      <div style={styles.reviewGrid}>
        
        {/* Left column: Action & details sidebar */}
        <div style={styles.actionSidebar}>
          
          {/* User & Info details card */}
          <div style={styles.detailsCard}>
            <div style={{ ...styles.userRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <div style={styles.avatarCircle}>
                <User size={20} color="#3B82F6" />
              </div>
              <div style={{ ...styles.userMeta, textAlign: isRtl ? 'right' : 'left' }}>
                <h4 style={styles.userName}>{trans.userName}</h4>
                <span style={styles.userId}>{trans.userId}</span>
              </div>
            </div>

            <div style={{
              ...styles.detailRow,
              flexDirection: isRtl ? 'row-reverse' : 'row',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: '14px',
              marginTop: '14px'
            }}>
              <span style={styles.detailLabel}>{trans.planLabel}</span>
              <span style={styles.planBadge}>{trans.planVal}</span>
            </div>

            <div style={{ ...styles.detailRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <span style={styles.detailLabel}>{trans.amountLabel}</span>
              <span style={styles.amountText}>{trans.amountVal}</span>
            </div>

            <div style={{ ...styles.dateRow, textAlign: isRtl ? 'right' : 'left' }}>
              <span>{trans.uploadDate}</span>
            </div>
          </div>

          {/* Action form card */}
          <div style={styles.actionsCard}>
            <h3 style={{ ...styles.cardTitle, textAlign: isRtl ? 'right' : 'left' }}>{trans.actionTitle}</h3>
            
            <div style={styles.inputGroup}>
              <label style={{ ...styles.label, textAlign: isRtl ? 'right' : 'left' }}>{trans.rejectLabel}</label>
              <textarea
                placeholder={trans.rejectPlace}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{
                  ...styles.textarea,
                  textAlign: isRtl ? 'right' : 'left'
                }}
              />
            </div>

            <div style={styles.actionButtons}>
              <button onClick={handleApprove} style={styles.approveBtn}>
                <Check size={16} />
                <span>{trans.btnApprove}</span>
              </button>
              <button onClick={handleReject} style={styles.rejectBtn}>
                <X size={16} />
                <span>{trans.btnReject}</span>
              </button>
            </div>
          </div>

          {/* Security Alert Note */}
          <div style={{ ...styles.alertCard, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <ShieldAlert size={24} color="#F59E0B" style={{ flexShrink: 0 }} />
            <p style={{ ...styles.alertText, textAlign: isRtl ? 'right' : 'left' }}>{trans.securityAlert}</p>
          </div>

        </div>

        {/* Right column: Image preview card */}
        <div style={styles.previewCard}>
          <div style={{ ...styles.previewHeader, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={{ ...styles.receiptTitle, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <FileText size={18} color="#9CA3AF" />
              <span>{trans.receiptHeader}</span>
            </div>
            <div style={{ ...styles.controlsRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <button style={styles.headerIconBtn}><Download size={16} /></button>
              <button style={styles.headerIconBtn}><ZoomIn size={16} /></button>
            </div>
          </div>

          {/* Realistic Receipt Canvas Rendering */}
          <div style={styles.canvasContainer}>
            <div style={styles.paperReceipt}>
              <div style={styles.receiptLine} />
              <div style={styles.receiptTitleContainer}>
                <h3 style={styles.receiptBankName}>SAUDI NATIONAL BANK</h3>
                <span style={styles.receiptType}>TRANSACTION RECEIPT</span>
              </div>

              <div style={styles.receiptDivider} />

              <table style={styles.receiptTable}>
                <tbody>
                  <tr>
                    <td>Transaction ID</td>
                    <td style={styles.receiptValue}>SNB-991209148</td>
                  </tr>
                  <tr>
                    <td>Date & Time</td>
                    <td style={styles.receiptValue}>24 Oct 2023 - 10:28 AM</td>
                  </tr>
                  <tr>
                    <td>Sender Name</td>
                    <td style={styles.receiptValue}>AHMED M AL-ALI</td>
                  </tr>
                  <tr>
                    <td>Beneficiary</td>
                    <td style={styles.receiptValue}>NEXUS CORP LTD</td>
                  </tr>
                  <tr>
                    <td>Account Number</td>
                    <td style={styles.receiptValue}>•••• •••• •••• 9821</td>
                  </tr>
                </tbody>
              </table>

              <div style={styles.receiptDivider} />

              <div style={styles.receiptTotalContainer}>
                <span style={styles.receiptTotalLabel}>TOTAL AMOUNT</span>
                <span style={styles.receiptTotalAmount}>1,200.00 SAR</span>
              </div>

              <div style={styles.receiptDivider} />

              <div style={styles.receiptFooter}>
                <span>STATUS: SUCCESSFUL</span>
                <span>Thank you for banking with us.</span>
              </div>
            </div>
          </div>
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
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '28px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  actionSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  detailsCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  avatarCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userId: {
    fontSize: '11px',
    color: '#9CA3AF',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    marginBottom: '10px',
  },
  detailLabel: {
    color: '#9CA3AF',
  },
  planBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#3B82F6',
  },
  amountText: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dateRow: {
    fontSize: '11px',
    color: '#6B7280',
    marginTop: '12px',
  },
  actionsCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardTitle: {
    fontSize: '16px',
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
  textarea: {
    width: '100%',
    height: '80px',
    padding: '12px 16px',
    fontSize: '13px',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#FFFFFF',
    outline: 'none',
    resize: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#2563EB'
    }
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  approveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(37,99,235,0.25)',
  },
  rejectBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '10px',
    color: '#EF4444',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
  },
  alertCard: {
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px dashed rgba(245, 158, 11, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
  },
  alertText: {
    fontSize: '11px',
    color: '#D1D5DB',
    lineHeight: '1.5',
  },
  previewCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  controlsRow: {
    display: 'flex',
    gap: '8px',
  },
  headerIconBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    color: '#9CA3AF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  canvasContainer: {
    flex: 1,
    minHeight: '400px',
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px',
  },
  paperReceipt: {
    width: '100%',
    maxWidth: '320px',
    background: '#FAFAFA',
    color: '#1C1917',
    padding: '28px',
    borderRadius: '4px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    fontFamily: 'monospace',
    fontSize: '11px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transform: 'rotate(-1deg)',
  },
  receiptLine: {
    height: '4px',
    background: '#1D4ED8',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  receiptTitleContainer: {
    textAlign: 'center',
    marginBottom: '16px',
  },
  receiptBankName: {
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '0.5px',
    color: '#0F172A',
  },
  receiptType: {
    fontSize: '9px',
    color: '#64748B',
    fontWeight: '700',
  },
  receiptDivider: {
    borderTop: '1px dashed #CBD5E1',
    margin: '12px 0',
  },
  receiptTable: {
    width: '100%',
    borderCollapse: 'collapse',
    'tr': {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '6px 0',
    }
  },
  receiptValue: {
    fontWeight: '700',
    textAlign: 'right',
  },
  receiptTotalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
  },
  receiptTotalLabel: {
    fontWeight: '700',
    color: '#475569',
  },
  receiptTotalAmount: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0F172A',
  },
  receiptFooter: {
    textAlign: 'center',
    fontSize: '8px',
    color: '#64748B',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '8px',
  }
};
