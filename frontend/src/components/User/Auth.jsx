import React, { useState } from 'react';
import { Zap, Eye, EyeOff, Globe } from 'lucide-react';

export default function Auth({ isRtl, setIsRtl, onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const trans = {
    brand: isRtl ? 'نيكسس AI' : 'SaaS Nexus',
    sub: isRtl ? 'مستقبل الذكاء الاصطناعي للمؤسسات.' : 'The future of enterprise intelligence.',
    welcome: isRtl ? 'مرحباً بك مجدداً' : 'Welcome back',
    emailLabel: isRtl ? 'البريد الإلكتروني' : 'Email address',
    emailPlace: 'name@company.com',
    passLabel: isRtl ? 'كلمة المرور' : 'Password',
    forgot: isRtl ? 'نسيت كلمة المرور؟' : 'Forgot password?',
    signInBtn: isRtl ? 'تسجيل الدخول' : 'Sign In',
    or: isRtl ? 'أو' : 'OR',
    google: 'Google',
    microsoft: 'Microsoft',
    noAccount: isRtl ? 'ليس لديك حساب؟' : "Don't have an account?",
    signUp: isRtl ? 'سجل الآن' : 'Sign up',
    privacy: isRtl ? 'الخصوصية' : 'Privacy',
    terms: isRtl ? 'الشروط' : 'Terms',
    contact: isRtl ? 'اتصل بنا' : 'Contact',
    switchLang: isRtl ? 'English' : 'العربية (RTL)'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Top right language switch */}
      <button onClick={() => setIsRtl(!isRtl)} style={styles.langBtn}>
        <Globe size={14} />
        {trans.switchLang}
      </button>

      {/* Brand Header */}
      <div style={styles.brandBox}>
        <div style={styles.logo}>
          <Zap size={24} color="#FFFFFF" fill="#FFFFFF" />
        </div>
        <h1 style={styles.brandName}>{trans.brand}</h1>
        <p style={styles.brandSub}>{trans.sub}</p>
      </div>

      {/* Login Card */}
      <div style={styles.card}>
        <h2 style={{
          ...styles.welcomeText,
          fontFamily: isRtl ? 'var(--font-ar)' : 'var(--font-en)'
        }}>
          {trans.welcome}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email input */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>{trans.emailLabel}</label>
            <input
              type="email"
              placeholder={trans.emailPlace}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                ...styles.input,
                textAlign: isRtl ? 'right' : 'left'
              }}
            />
          </div>

          {/* Password input */}
          <div style={styles.inputGroup}>
            <div style={{ ...styles.passHeader, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <label style={styles.label}>{trans.passLabel}</label>
              <span style={styles.forgotLink}>{trans.forgot}</span>
            </div>
            <div style={styles.passInputWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  ...styles.input,
                  paddingRight: isRtl ? '16px' : '44px',
                  paddingLeft: isRtl ? '44px' : '16px',
                  textAlign: isRtl ? 'right' : 'left'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  ...styles.eyeBtn,
                  right: isRtl ? 'auto' : '12px',
                  left: isRtl ? '12px' : 'auto'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button type="submit" style={styles.submitBtn}>
            {trans.signInBtn}
          </button>
        </form>

        {/* OR Divider */}
        <div style={{ ...styles.dividerRow, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>{trans.or}</span>
          <div style={styles.dividerLine} />
        </div>

        {/* Social Buttons */}
        <div style={styles.socialRow}>
          <button onClick={onLogin} style={styles.socialBtn}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={styles.socialIcon} />
            <span>{trans.google}</span>
          </button>
          <button onClick={onLogin} style={styles.socialBtn}>
            <img src="https://www.svgrepo.com/show/512521/microsoft.svg" alt="Microsoft" style={styles.socialIcon} />
            <span>{trans.microsoft}</span>
          </button>
        </div>

        {/* Footer info inside card */}
        <p style={styles.cardFooter}>
          {trans.noAccount} <span style={styles.signUpLink}>{trans.signUp}</span>
        </p>
      </div>

      {/* Footer links */}
      <div style={styles.footerLinks}>
        <span>{trans.privacy}</span>
        <span>{trans.terms}</span>
        <span>{trans.contact}</span>
      </div>
      <p style={styles.copyright}>© 2024 SAAS NEXUS ENTERPRISE</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 50% 0%, #151e36 0%, #090d16 70%)',
    padding: '40px 20px',
    position: 'relative',
  },
  langBtn: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  brandBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  logo: {
    width: '48px',
    height: '48px',
    background: '#000000',
    border: '2px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
  },
  brandName: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.5px',
  },
  brandSub: {
    fontSize: '13px',
    color: '#9CA3AF',
  },
  card: {
    background: 'rgba(18, 25, 43, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(10px)',
  },
  welcomeText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '24px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#9CA3AF',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#FFFFFF',
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#2563EB',
    }
  },
  passHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
  },
  forgotLink: {
    color: '#3B82F6',
    cursor: 'pointer',
  },
  passInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  eyeBtn: {
    position: 'absolute',
    background: 'transparent',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    background: '#FFFFFF',
    color: '#000000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s',
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    margin: '20px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#4B5563',
  },
  socialRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '20px',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  socialIcon: {
    width: '16px',
    height: '16px',
  },
  cardFooter: {
    fontSize: '13px',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  signUpLink: {
    color: '#3B82F6',
    fontWeight: '600',
    cursor: 'pointer',
  },
  footerLinks: {
    display: 'flex',
    gap: '24px',
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '40px',
    cursor: 'pointer',
  },
  copyright: {
    fontSize: '10px',
    color: '#4B5563',
    marginTop: '12px',
    letterSpacing: '0.5px',
  }
};
