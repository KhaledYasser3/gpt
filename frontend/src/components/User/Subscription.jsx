import React from 'react';
import { Check, ArrowRight, Building, HelpCircle } from 'lucide-react';

export default function Subscription({ isRtl }) {
  const trans = {
    badge: isRtl ? 'جاري مراجعة الطلب' : 'Verification in Progress',
    title: isRtl ? 'في انتظار مراجعة الدفع' : 'Waiting for Payment Review',
    desc: isRtl
      ? 'لقد تم استلام مستند التحويل البنكي الخاص بك لـ "خطة نيكسس السنوية". يقوم فريقنا المالي حالياً بالتحقق من المعاملة مع البنك.'
      : 'Your wire transfer for the Nexus Enterprise Annual Plan has been received. Our financial team is currently validating the transaction with the bank.',
    progressText: isRtl ? 'جاري التحقق...' : 'Processing Verification',
    startDateLabel: isRtl ? 'تاريخ البدء المطلوب' : 'Requested Start Date',
    renewalDateLabel: isRtl ? 'تاريخ التجديد المتوقع' : 'Renewal Date',
    tierTitle: isRtl ? 'الفئة المقدرة: بروفيشينال مؤسسات' : 'Estimated Tier: Enterprise Pro',
    feat1: isRtl ? 'وصول غير محدود لـ APIs' : 'Unlimited API Endpoints',
    feat2: isRtl ? 'دعم فني مخصص 24/7' : '24/7 Dedicated Support',
    feat3: isRtl ? 'سجلات تدقيق متقدمة' : 'Advanced Audit Logs',
    helpTitle: isRtl ? 'هل تحتاج إلى مساعدة؟' : 'Need assistance?',
    helpLink: isRtl ? 'تحدث مع مدير حسابك المخصص' : 'Talk to your account manager',
    billingTitle: isRtl ? 'الجهة المفوترة' : 'Billing Entity',
    billingCompany: 'Nexus Global Solutions Ltd.',
    billingAddress: '128 Innovation Way, Suite 400\nSan Francisco, CA 94107',
    billingVat: 'VAT: GB123456789',
    promoTitle: isRtl ? 'نموك، بأتمتة كاملة.' : 'Your growth, automated.',
    promoDesc: isRtl 
      ? 'قم بزيادة سرعة أعمالك مع محرك التوسع التنبئي المتقدم من نيكسس.'
      : 'Scale your enterprise with Nexus\'s predictive scaling engine.'
  };

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Top Toolbar */}
      <div style={{ ...styles.topToolbar, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
        <div style={styles.actionButtons}>
          <button style={styles.btnPrimary}>+ {isRtl ? 'طلب اشتراك جديد' : 'Request Subscription'}</button>
          <button style={styles.btnSecondary}>{isRtl ? 'سجل المدفوعات' : 'Payment History'}</button>
        </div>
        <span style={styles.updateTime}>{isRtl ? 'آخر تحديث: ٢٤ أكتوبر ٢٠٢٣' : 'Last Updated: Oct 24, 2023'}</span>
      </div>

      {/* Main Grid */}
      <div style={styles.dashboardGrid}>
        
        {/* Left Side: Main progress */}
        <div style={styles.mainStateCard}>
          <div style={styles.stateCardHeader}>
            <span style={styles.verificationBadge}>
              {trans.badge}
            </span>
          </div>

          <div style={{ ...styles.stateCardContent, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            {/* Description */}
            <div style={{
              ...styles.stateText,
              textAlign: isRtl ? 'right' : 'left',
              alignItems: isRtl ? 'flex-end' : 'flex-start'
            }}>
              <h2 style={styles.stateTitle}>{trans.title}</h2>
              <p style={styles.stateDesc}>{trans.desc}</p>

              <div style={{ ...styles.datesRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <div style={styles.dateItem}>
                  <span style={styles.dateLabel}>{trans.startDateLabel}</span>
                  <span style={styles.dateValue}>Nov 01, 2023</span>
                </div>
                <div style={styles.dateItem}>
                  <span style={styles.dateLabel}>{trans.renewalDateLabel}</span>
                  <span style={styles.dateValue}>Oct 31, 2024</span>
                </div>
              </div>
            </div>

            {/* Circular Progress */}
            <div style={styles.progressContainer}>
              <div style={styles.circleOuter}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="transparent" stroke="#2563EB" strokeWidth="8"
                          strokeDasharray="314" strokeDashoffset="78.5" strokeLinecap="round" />
                </svg>
                <div style={styles.circleInner}>
                  <span style={styles.percentageText}>75%</span>
                </div>
              </div>
              <span style={styles.progressSubtext}>{trans.progressText}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Tier & Contact */}
        <div style={styles.rightCards}>
          {/* Estimated Tier */}
          <div style={styles.tierCard}>
            <span style={styles.tierBadge}>ESTIMATED TIER</span>
            <h3 style={styles.tierTitle}>{trans.tierTitle}</h3>
            
            <div style={styles.tierFeatures}>
              <div style={{ ...styles.featItem, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <div style={styles.checkmarkBox}>
                  <Check size={12} color="#10B981" />
                </div>
                <span>{trans.feat1}</span>
              </div>
              
              <div style={{ ...styles.featItem, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <div style={styles.checkmarkBox}>
                  <Check size={12} color="#10B981" />
                </div>
                <span>{trans.feat2}</span>
              </div>

              <div style={{ ...styles.featItem, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <div style={styles.checkmarkBox}>
                  <Check size={12} color="#10B981" />
                </div>
                <span>{trans.feat3}</span>
              </div>
            </div>
          </div>

          {/* Account manager support */}
          <div style={{ ...styles.helpCard, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.helpIconBox}>
              <HelpCircle size={20} color="#3B82F6" />
            </div>
            <div style={{ ...styles.helpMeta, textAlign: isRtl ? 'right' : 'left' }}>
              <span style={styles.helpLabel}>{trans.helpTitle}</span>
              <span style={styles.helpLink}>{trans.helpLink}</span>
            </div>
            <ArrowRight size={16} color="#6B7280" style={{
              marginLeft: 'auto',
              transform: isRtl ? 'rotate(180deg)' : 'none'
            }} />
          </div>
        </div>

        {/* Bottom Card Left: Billing Entity */}
        <div style={styles.billingCard}>
          <div style={{ ...styles.billingHeader, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <Building size={16} color="#3B82F6" />
            <h4 style={styles.billingTitle}>{trans.billingTitle}</h4>
          </div>
          <div style={{ ...styles.billingContent, textAlign: isRtl ? 'right' : 'left' }}>
            <p style={styles.billingCompany}>{trans.billingCompany}</p>
            <p style={styles.billingAddress}>{trans.billingAddress}</p>
            <p style={styles.billingVat}>{trans.billingVat}</p>
          </div>
        </div>

        {/* Bottom Card Right: Graphical Promo */}
        <div style={styles.promoCard}>
          <div style={styles.promoOverlay}>
            <h3 style={styles.promoHeading}>{trans.promoTitle}</h3>
            <p style={styles.promoDesc}>{trans.promoDesc}</p>
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
  topToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  actionButtons: {
    display: 'flex',
    gap: '12px',
  },
  btnPrimary: {
    padding: '10px 18px',
    background: '#000000',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSecondary: {
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    color: '#E5E7EB',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  updateTime: {
    fontSize: '11px',
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '24px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  mainStateCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  stateCardHeader: {
    display: 'flex',
  },
  verificationBadge: {
    padding: '4px 12px',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '9999px',
    color: '#F59E0B',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  stateCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  stateText: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  stateTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.5px',
  },
  stateDesc: {
    fontSize: '14px',
    color: '#9CA3AF',
    lineHeight: '1.6',
    maxWidth: '420px',
  },
  datesRow: {
    display: 'flex',
    gap: '32px',
    marginTop: '16px',
  },
  dateItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  dateLabel: {
    fontSize: '10px',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600',
  },
  dateValue: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  circleOuter: {
    position: 'relative',
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    position: 'absolute',
    width: '90px',
    height: '90px',
    background: '#121A2B',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  percentageText: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressSubtext: {
    fontSize: '11px',
    color: '#9CA3AF',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  rightCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  tierCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: 'linear-gradient(225deg, #090e17 0%, rgba(15,20,36,0.6) 100%)',
  },
  tierBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#3B82F6',
    letterSpacing: '1.5px',
  },
  tierTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  tierFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },
  featItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    color: '#D1D5DB',
    fontWeight: '500',
  },
  checkmarkBox: {
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: 'rgba(255,255,255,0.1)'
    }
  },
  helpIconBox: {
    width: '40px',
    height: '40px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  helpMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  helpLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helpLink: {
    fontSize: '11px',
    color: '#9CA3AF',
  },
  billingCard: {
    background: 'rgba(20, 26, 38, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '24px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  billingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  billingTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  billingContent: {
    fontSize: '13px',
    color: '#9CA3AF',
    lineHeight: '1.6',
  },
  billingCompany: {
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '4px',
  },
  billingAddress: {
    whiteSpace: 'pre-line',
  },
  billingVat: {
    marginTop: '8px',
    fontWeight: '600',
    color: '#D1D5DB',
  },
  promoCard: {
    borderRadius: '24px',
    background: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80") center/cover no-repeat',
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
  },
  promoOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(9,13,22,0.4) 0%, rgba(9,13,22,0.95) 100%)',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  promoHeading: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  promoDesc: {
    fontSize: '12px',
    color: '#9CA3AF',
    lineHeight: '1.5',
  }
};
