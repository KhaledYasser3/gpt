import React, { useState } from 'react';
import { Save, Shield, Settings, Info, DollarSign, Wallet } from 'lucide-react';

export default function SettingsView({ isRtl }) {
  const [paypalEmail, setPaypalEmail] = useState('billing@nexus-corp.com');
  const [vodafoneNumber, setVodafoneNumber] = useState('01012345678');
  const [taxRate, setTaxRate] = useState('14');
  const [tokenLimit, setTokenLimit] = useState('500,000');

  const trans = {
    title: isRtl ? 'إعدادات النظام' : 'System Settings',
    desc: isRtl 
      ? 'إدارة خيارات الدفع والضرائب وحدود استخدام الـ API للنظام بالكامل.'
      : 'Configure system-wide payment options, taxes, and API token constraints.',
    saveBtn: isRtl ? 'حفظ الإعدادات' : 'Save Configurations',
    paypalLabel: isRtl ? 'حساب استقبال PayPal (البريد الإلكتروني)' : 'PayPal Merchant Email',
    vodafoneLabel: isRtl ? 'رقم استقبال فودافون كاش' : 'Vodafone Cash Receiving Number',
    taxLabel: isRtl ? 'نسبة الضريبة المضافة (%)' : 'Standard VAT Rate (%)',
    tokenLabel: isRtl ? 'الحد الافتراضي لرموز الذكاء الاصطناعي (Tokens)' : 'Default Monthly Token Ceiling',
    infoBox: isRtl
      ? 'تنبيه: سيتم تطبيق هذه الإعدادات مباشرة على شاشات الدفع والمتابعة للمستخدمين.'
      : 'Notice: These parameters dictate what values are displayed on client checkout interfaces.'
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert(isRtl ? 'تم حفظ الإعدادات بنجاح!' : 'Settings successfully updated!');
  };

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      
      {/* Header */}
      <div style={{ ...styles.headerText, textAlign: isRtl ? 'right' : 'left' }}>
        <h2 style={styles.title}>{trans.title}</h2>
        <p style={styles.desc}>{trans.desc}</p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} style={styles.formCard}>
        <div style={styles.fieldsGrid}>
          
          {/* PayPal */}
          <div style={styles.inputGroup}>
            <div style={{ ...styles.labelRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <DollarSign size={16} color="#3B82F6" />
              <label style={styles.label}>{trans.paypalLabel}</label>
            </div>
            <input
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              style={{
                ...styles.inputField,
                textAlign: isRtl ? 'right' : 'left'
              }}
            />
          </div>

          {/* Vodafone Cash */}
          <div style={styles.inputGroup}>
            <div style={{ ...styles.labelRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <Wallet size={16} color="#EF4444" />
              <label style={styles.label}>{trans.vodafoneLabel}</label>
            </div>
            <input
              type="text"
              value={vodafoneNumber}
              onChange={(e) => setVodafoneNumber(e.target.value)}
              style={{
                ...styles.inputField,
                textAlign: isRtl ? 'right' : 'left'
              }}
            />
          </div>

          {/* Tax rate */}
          <div style={styles.inputGroup}>
            <div style={{ ...styles.labelRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <Settings size={16} color="#9CA3AF" />
              <label style={styles.label}>{trans.taxLabel}</label>
            </div>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              style={{
                ...styles.inputField,
                textAlign: isRtl ? 'right' : 'left'
              }}
            />
          </div>

          {/* Default tokens */}
          <div style={styles.inputGroup}>
            <div style={{ ...styles.labelRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <Shield size={16} color="#10B981" />
              <label style={styles.label}>{trans.tokenLabel}</label>
            </div>
            <input
              type="text"
              value={tokenLimit}
              onChange={(e) => setTokenLimit(e.target.value)}
              style={{
                ...styles.inputField,
                textAlign: isRtl ? 'right' : 'left'
              }}
            />
          </div>

        </div>

        {/* Info card banner */}
        <div style={{ ...styles.infoBanner, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <Info size={20} color="#3B82F6" style={{ flexShrink: 0 }} />
          <p style={{ ...styles.infoText, textAlign: isRtl ? 'right' : 'left' }}>{trans.infoBox}</p>
        </div>

        {/* Action Button */}
        <button type="submit" style={styles.saveBtn}>
          <Save size={16} />
          {trans.saveBtn}
        </button>
      </form>

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
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '28px',
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
  formCard: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '36px',
    maxWidth: '850px',
    width: '100%',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  fieldsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#E5E7EB',
  },
  inputField: {
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#FFFFFF',
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#2563EB'
    }
  },
  infoBanner: {
    background: 'rgba(59, 130, 246, 0.05)',
    border: '1px dashed rgba(59, 130, 246, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    gap: '12px',
  },
  infoText: {
    fontSize: '12px',
    color: '#D1D5DB',
    lineHeight: '1.5',
  },
  saveBtn: {
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
    alignSelf: 'flex-start',
    boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
  }
};
