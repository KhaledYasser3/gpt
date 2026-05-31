import React, { useState } from 'react';
import { CreditCard, Wallet, ShieldCheck, Headphones, Upload, Check } from 'lucide-react';

export default function Checkout({ isRtl, onSubmitReceipt }) {
  const [method, setMethod] = useState('paypal'); // 'paypal' or 'vodafone'
  const [vodafoneNumber, setVodafoneNumber] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);

  const trans = {
    title: isRtl ? 'إتمام عملية الدفع' : 'Complete Payment Process',
    sub: isRtl 
      ? 'اختر وسيلة الدفع المناسبة لك لإتمام اشتراكك في Nexus Enterprise.'
      : 'Choose the suitable payment method to complete your subscription to Nexus Enterprise.',
    paypalTitle: 'PayPal',
    paypalSub: isRtl ? 'دفع سريع وآمن عبر حسابك العالمي' : 'Fast and secure international payment',
    vodafoneTitle: 'Vodafone Cash',
    vodafoneSub: isRtl ? 'التحويل المباشر عبر المحفظة الإلكترونية' : 'Direct mobile wallet transfer (Egypt)',
    summaryTitle: isRtl ? 'ملخص الطلب' : 'Order Summary',
    planName: isRtl ? 'خطة Nexus Enterprise' : 'Nexus Enterprise Plan',
    tax: isRtl ? 'الضريبة (14%)' : 'Tax (14%)',
    total: isRtl ? 'الإجمالي' : 'Total',
    securityBadge: isRtl 
      ? 'جميع المعاملات مشفرة ومحمية بمعايير PCI-DSS العالمية'
      : 'All transactions are encrypted and secured under global PCI-DSS standards',
    supportTitle: isRtl ? 'دعم فني 24/7' : '24/7 Dedicated Support',
    supportDesc: isRtl
      ? 'اشترك الآن واحصل على وصول مباشر لمدير حسابات مخصص لمساعدتك.'
      : 'Subscribe now and gain instant access to a dedicated account manager.',
    paypalContinueTitle: isRtl ? 'المتابعة عبر PayPal' : 'Continue via PayPal',
    paypalContinueDesc: isRtl
      ? 'سيتم توجيهك إلى صفحة الدفع الخاصة بـ PayPal لتأكيد العملية بأمان.'
      : 'You will be redirected to PayPal payment page to confirm the transaction securely.',
    paypalBtn: isRtl ? 'دفع بواسطة PayPal' : 'Pay with PayPal',
    vodafoneContinueTitle: isRtl ? 'المتابعة عبر فودافون كاش' : 'Continue via Vodafone Cash',
    vodafoneContinueDesc: isRtl
      ? 'يرجى تحويل المبلغ إلى الرقم 01012345678، ثم كتابة رقم محفظتك ورفع إيصال التحويل بالأسفل:'
      : 'Please transfer the amount to 01012345678, enter your wallet number, and upload the transfer receipt below:',
    walletLabel: isRtl ? 'رقم محفظة فودافون كاش المرسل منها' : 'Sender Vodafone Cash Number',
    uploadBtn: isRtl ? 'رفع صورة إيصال التحويل' : 'Upload Transfer Receipt Image',
    submitReceiptBtn: isRtl ? 'تقديم إيصال الدفع للمراجعة' : 'Submit Receipt for Review'
  };

  const handleFileUpload = () => {
    setFileUploaded(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitReceipt();
  };

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Main Body */}
      <div style={styles.mainLayout}>
        {/* Left Side: Forms */}
        <div style={styles.formSection}>
          <h2 style={styles.sectionTitle}>{trans.title}</h2>
          <p style={styles.sectionSub}>{trans.sub}</p>

          {/* Payment options */}
          <div style={{ ...styles.cardsRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            {/* PayPal */}
            <div
              onClick={() => setMethod('paypal')}
              style={{
                ...styles.methodCard,
                ...(method === 'paypal' ? styles.methodCardActive : {})
              }}
            >
              <div style={styles.cardIconBoxBlue}>
                <CreditCard size={24} color="#3B82F6" />
              </div>
              <h3 style={styles.methodTitle}>{trans.paypalTitle}</h3>
              <p style={styles.methodDesc}>{trans.paypalSub}</p>
            </div>

            {/* Vodafone Cash */}
            <div
              onClick={() => setMethod('vodafone')}
              style={{
                ...styles.methodCard,
                ...(method === 'vodafone' ? styles.methodCardActive : {})
              }}
            >
              <div style={styles.cardIconBoxRed}>
                <Wallet size={24} color="#EF4444" />
              </div>
              <h3 style={styles.methodTitle}>{trans.vodafoneTitle}</h3>
              <p style={styles.methodDesc}>{trans.vodafoneSub}</p>
            </div>
          </div>

          {/* Details based on selection */}
          {method === 'paypal' ? (
            <div style={styles.actionCard}>
              <h3 style={styles.actionCardTitle}>{trans.paypalContinueTitle}</h3>
              <p style={styles.actionCardDesc}>{trans.paypalContinueDesc}</p>
              <button onClick={onSubmitReceipt} style={styles.paypalBtn}>
                {trans.paypalBtn}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.actionCard}>
              <h3 style={styles.actionCardTitle}>{trans.vodafoneContinueTitle}</h3>
              <p style={styles.actionCardDesc}>{trans.vodafoneContinueDesc}</p>
              
              <div style={styles.inputsContainer}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>{trans.walletLabel}</label>
                  <input
                    type="text"
                    placeholder="010XXXXXXXX"
                    value={vodafoneNumber}
                    onChange={(e) => setVodafoneNumber(e.target.value)}
                    required
                    style={{
                      ...styles.inputField,
                      textAlign: isRtl ? 'right' : 'left'
                    }}
                  />
                </div>

                <div style={styles.uploadBox}>
                  <button type="button" onClick={handleFileUpload} style={styles.uploadInnerBtn}>
                    {fileUploaded ? <Check size={18} color="#10B981" /> : <Upload size={18} />}
                    {trans.uploadBtn}
                  </button>
                  {fileUploaded && <span style={styles.uploadSuccessText}>{isRtl ? 'تم رفع إيصال الدفع بنجاح!' : 'Receipt uploaded successfully!'}</span>}
                </div>

                <button type="submit" disabled={!fileUploaded} style={styles.submitReceiptBtn}>
                  {trans.submitReceiptBtn}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Sidebar info */}
        <div style={styles.checkoutSidebar}>
          {/* Order Summary */}
          <div style={styles.summaryCard}>
            <h3 style={{
              ...styles.summaryHeader,
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              paddingBottom: '12px',
              marginBottom: '16px',
              fontFamily: isRtl ? 'var(--font-ar)' : 'var(--font-en)'
            }}>
              {trans.summaryTitle}
            </h3>
            
            <div style={{ ...styles.summaryRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <span>{trans.planName}</span>
              <span>$299.00</span>
            </div>
            
            <div style={{ ...styles.summaryRow, flexDirection: isRtl ? 'row-reverse' : 'row', margin: '12px 0' }}>
              <span>{trans.tax}</span>
              <span>$41.86</span>
            </div>

            <div style={{
              ...styles.totalRow,
              flexDirection: isRtl ? 'row-reverse' : 'row',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '16px',
              marginTop: '16px'
            }}>
              <span>{trans.total}</span>
              <span style={styles.totalAmount}>$340.86</span>
            </div>

            <div style={{
              ...styles.securityBadge,
              flexDirection: isRtl ? 'row-reverse' : 'row',
              background: 'rgba(255,255,255,0.02)',
              border: '1px dashed rgba(255,255,255,0.08)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <ShieldCheck size={20} color="#3B82F6" style={isRtl ? { marginLeft: '8px' } : { marginRight: '8px' }} />
              <span style={styles.securityText}>{trans.securityBadge}</span>
            </div>
          </div>

          {/* Premium features widget */}
          <div style={styles.supportCard}>
            <div style={styles.supportHeader}>
              <Headphones size={20} color="#60A5FA" />
              <h4 style={styles.supportTitle}>{trans.supportTitle}</h4>
            </div>
            <p style={styles.supportDesc}>{trans.supportDesc}</p>
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
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '32px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  sectionSub: {
    fontSize: '14px',
    color: '#9CA3AF',
    marginBottom: '28px',
  },
  cardsRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  methodCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  methodCardActive: {
    background: 'rgba(37, 99, 235, 0.05)',
    borderColor: '#3B82F6',
    boxShadow: '0 0 20px rgba(37, 99, 235, 0.1)',
  },
  cardIconBoxBlue: {
    width: '48px',
    height: '48px',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconBoxRed: {
    width: '48px',
    height: '48px',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  methodDesc: {
    fontSize: '12px',
    color: '#9CA3AF',
    lineHeight: '1.4',
  },
  actionCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  actionCardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  actionCardDesc: {
    fontSize: '13px',
    color: '#9CA3AF',
    lineHeight: '1.6',
  },
  paypalBtn: {
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
    width: '100%',
    maxWidth: '240px',
    alignSelf: 'center',
    marginTop: '12px',
    boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
  },
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginTop: '8px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#D1D5DB',
  },
  inputField: {
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#2563EB'
    }
  },
  uploadBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  uploadInnerBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px dashed rgba(255,255,255,0.15)',
    borderRadius: '8px',
    color: '#E5E7EB',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
  uploadSuccessText: {
    fontSize: '12px',
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'center',
  },
  submitReceiptBtn: {
    padding: '14px',
    background: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
    transition: 'all 0.2s',
    ':disabled': {
      background: 'rgba(255,255,255,0.05)',
      color: '#6B7280',
      cursor: 'not-allowed',
      boxShadow: 'none',
      border: '1px solid rgba(255,255,255,0.05)'
    }
  },
  checkoutSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  summaryCard: {
    background: 'rgba(20, 26, 38, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
  },
  summaryHeader: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#9CA3AF',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalAmount: {
    fontSize: '20px',
    color: '#3B82F6',
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  securityText: {
    fontSize: '11px',
    color: '#9CA3AF',
    lineHeight: '1.4',
  },
  supportCard: {
    background: 'rgba(30, 41, 59, 0.4)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  supportHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  supportTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  supportDesc: {
    fontSize: '12px',
    color: '#9CA3AF',
    lineHeight: '1.6',
  }
};
