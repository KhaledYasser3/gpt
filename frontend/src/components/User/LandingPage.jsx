import React from 'react';
import { Zap, Shield, Sparkles, Send, Laptop, ArrowRight, CheckCircle } from 'lucide-react';

export default function LandingPage({ isRtl, onStart }) {
  const trans = {
    badge: isRtl ? 'نظام الذكاء الاصطناعي للمؤسسات' : 'Enterprise AI Intelligence',
    titleMain: isRtl ? 'نيكسس AI: تمكين الذكاء' : 'Nexus AI: Powering',
    titleSub: isRtl ? 'العابر للحدود' : 'Intelligence Across Borders',
    heroDesc: isRtl 
      ? 'اختبر مستقبل اتخاذ القرارات في المؤسسات. يدمج نيكسس بين النماذج اللغوية الضخمة فائقة الأداء والمعرفة المحلية باللغة العربية لتحويل سير عمل شركتك.'
      : 'Experience the future of enterprise decision-making. Nexus combines high-performance LLMs with localized Arabic understanding to transform your business workflows.',
    btnRequest: isRtl ? 'طلب الاشتراك' : 'Request Subscription',
    btnExplore: isRtl ? 'استكشف المزايا' : 'Explore Features',
    featuresTitle: isRtl ? 'إمكانيات غير محدودة' : 'Limitless Capabilities',
    featuresSub: isRtl ? 'أداء عالمي، دقة محلية' : 'Global performance, localized precision',
    card1Badge: isRtl ? 'فئة المؤسسات' : 'Enterprise Grade',
    card1Title: isRtl ? 'بنية تحتية آمنة' : 'Secure Infrastructure',
    card1Desc: isRtl 
      ? 'خيارات نشر محلي أو سحابة خاصة مع تشفير متكامل للبيانات من البداية للنهاية.'
      : 'On-premise or private cloud deployment options with end-to-end encryption.',
    card2Title: isRtl ? 'رؤى فورية' : 'Real-time Insight',
    card2Desc: isRtl ? 'زمن استجابة أقل من 100 مللي ثانية للاستعلامات.' : 'Sub-100ms latency for all queries.',
    card3Title: isRtl ? 'معالجة لغات متقدمة (عربي/إنجليزي)' : 'Advanced NLP (Arabic/English)',
    card3Desc: isRtl
      ? 'تتفوق نماذجنا الخاصة في فهم اللهجات العربية الدقيقة إلى جانب الفهم التام للغة الإنجليزية.'
      : 'Our proprietary model excels in understanding nuanced Arabic dialects alongside perfect English comprehension.',
    pricingBadge: isRtl ? 'باقة إمباير بريس' : 'Enterprise Plan',
    pricingTitle: isRtl ? 'تسعير مخصص لكل مؤسسة' : 'Custom Pricing for Each Enterprise',
    pricingDesc: isRtl
      ? 'لا توجد خطط ثابتة. قدم طلب اشتراك الآن وسيقوم فريقنا بدراسة متطلباتك وإرسال عرض سعر مخصص يناسب احتياجاتك بدقة.'
      : 'No fixed plans. Submit a subscription request and our team will analyze your requirements and send a customized offer.',
    pricingBtn: isRtl ? 'تقديم طلب اشتراك مخصص' : 'Request Custom Subscription',
    pricingFeat1: isRtl ? 'دعم فني متكامل' : 'Integrated Technical Support',
    pricingFeat2: isRtl ? 'تخصيص كامل للنظام' : 'Full System Customization',
    pricingFeat3: isRtl ? 'أعلى معايير الأمان' : 'Highest Security Standards',
    joinHeading: isRtl 
      ? 'انضم إلى أكثر من 500 مؤسسة تستخدم نيكسس AI لسد الفجوة بين البيانات العالمية والذكاء المحلي.'
      : 'Join 500+ enterprises using Nexus AI to bridge the gap between global data and local intelligence.',
    emailPlace: isRtl ? 'أدخل بريدك الإلكتروني' : 'Enter your email address',
    btnQuote: isRtl ? 'اطلب عرض سعر' : 'Get a Quote'
  };

  return (
    <div style={{ ...styles.container, direction: isRtl ? 'rtl' : 'ltr' }}>
      {/* Top Header */}
      <div style={styles.topHeader}>
        <div style={styles.logoRow}>
          <Zap size={22} color="#3B82F6" fill="#3B82F6" />
          <span style={styles.logoText}>SaaS Nexus</span>
        </div>
        <div style={styles.topLinks}>
          <span>Docs</span>
          <span>Support</span>
          <span>Changelog</span>
          <button onClick={onStart} style={styles.loginNavBtn}>
            {isRtl ? 'تسجيل الدخول' : 'Sign In'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.heroText}>
          <div style={styles.badgeRow}>
            <span style={styles.heroBadge}>
              <Sparkles size={12} />
              {trans.badge}
            </span>
          </div>
          <h1 style={styles.heroHeading}>
            {trans.titleMain} <span style={styles.gradientText}>{trans.titleSub}</span>
          </h1>
          <p style={styles.heroDesc}>{trans.heroDesc}</p>
          <div style={styles.heroButtons}>
            <button onClick={onStart} style={styles.primaryBtn}>
              {trans.btnRequest}
              <ArrowRight size={16} style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
            </button>
            <button style={styles.secondaryBtn}>{trans.btnExplore}</button>
          </div>
        </div>

        {/* Laptop Preview Graphic (Glassmorphism Mockup) */}
        <div style={styles.heroGraphic}>
          <div style={styles.laptopFrame}>
            <div style={styles.laptopScreen}>
              <div style={styles.mockupHeader}>
                <div style={styles.mockupDots}>
                  <div style={{ ...styles.mockupDot, background: '#EF4444' }} />
                  <div style={{ ...styles.mockupDot, background: '#F59E0B' }} />
                  <div style={{ ...styles.mockupDot, background: '#10B981' }} />
                </div>
                <div style={styles.mockupUrl}>nexus-ai-dashboard.com</div>
              </div>
              <div style={styles.mockupContent}>
                <div style={styles.mockSidebar}>
                  <div style={styles.mockSidebarItemActive} />
                  <div style={styles.mockSidebarItem} />
                  <div style={styles.mockSidebarItem} />
                </div>
                <div style={styles.mockMain}>
                  <div style={styles.mockHeader} />
                  <div style={styles.mockGrid}>
                    <div style={styles.mockWidget}>
                      <div style={styles.mockLineShort} />
                      <div style={styles.mockChartBig} />
                    </div>
                    <div style={styles.mockWidget}>
                      <div style={styles.mockLineShort} />
                      <div style={styles.mockChartSmall} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.laptopKeyboard} />
          </div>
        </div>
      </div>

      {/* Limitless Capabilities Title */}
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{trans.featuresTitle}</h2>
        <p style={styles.sectionSub}>{trans.featuresSub}</p>
      </div>

      {/* Grid Features */}
      <div style={styles.featuresGrid}>
        {/* Card 1 */}
        <div style={styles.featureCard1}>
          <div style={styles.cardHeader}>
            <Shield size={20} color="#3B82F6" />
            <span style={styles.cardBadge}>{trans.card1Badge}</span>
          </div>
          <h3 style={styles.cardTitle}>{trans.card1Title}</h3>
          <p style={styles.cardDesc}>{trans.card1Desc}</p>
        </div>

        {/* Card 2 */}
        <div style={styles.featureCard2}>
          <div style={styles.cardHeader}>
            <Zap size={20} color="#10B981" />
          </div>
          <h3 style={styles.cardTitle}>{trans.card2Title}</h3>
          <p style={styles.cardDesc}>{trans.card2Desc}</p>
        </div>

        {/* Card 3 (Large NLP Card) */}
        <div style={styles.nlpCard}>
          <div style={styles.nlpTextContent}>
            <div style={styles.nlpIconBox}>
              <Sparkles size={22} color="#FFFFFF" />
            </div>
            <h3 style={styles.cardTitle}>{trans.card3Title}</h3>
            <p style={styles.cardDesc}>{trans.card3Desc}</p>
          </div>
          {/* Futuristic abstract rendering mockup */}
          <div style={styles.nlpGraphic}>
            <div style={styles.glowingCore} />
            <div style={styles.orbitingRing1} />
            <div style={styles.orbitingRing2} />
          </div>
        </div>
      </div>

      {/* Custom Pricing Section */}
      <div style={styles.pricingSection}>
        <div style={styles.pricingCard}>
          <span style={styles.pricingBadge}>{trans.pricingBadge}</span>
          <h2 style={styles.pricingTitle}>{trans.pricingTitle}</h2>
          <p style={styles.pricingDesc}>{trans.pricingDesc}</p>
          <button onClick={onStart} style={styles.pricingBtn}>
            {trans.pricingBtn}
          </button>
          
          <div style={{ ...styles.pricingFeatures, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <div style={styles.priceFeatItem}>
              <CheckCircle size={16} color="#10B981" />
              <span>{trans.pricingFeat1}</span>
            </div>
            <div style={styles.priceFeatItem}>
              <CheckCircle size={16} color="#10B981" />
              <span>{trans.pricingFeat2}</span>
            </div>
            <div style={styles.priceFeatItem}>
              <CheckCircle size={16} color="#10B981" />
              <span>{trans.pricingFeat3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div style={styles.footerBanner}>
        <p style={styles.footerJoinHeading}>{trans.joinHeading}</p>
        <div style={{ ...styles.footerForm, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
          <input type="email" placeholder={trans.emailPlace} style={styles.footerInput} />
          <button onClick={onStart} style={styles.footerBtn}>
            {trans.btnQuote}
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 80px',
    background: 'radial-gradient(circle at 50% 0%, #17223b 0%, #090d16 60%)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '64px',
  },
  topHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  topLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    fontSize: '14px',
    color: '#9CA3AF',
    cursor: 'pointer',
  },
  loginNavBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
    ':hover': {
      background: 'rgba(255,255,255,0.12)'
    }
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '40px',
    alignItems: 'center',
    minHeight: '480px',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  badgeRow: {
    display: 'flex',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 14px',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '9999px',
    color: '#60A5FA',
    fontSize: '12px',
    fontWeight: '600',
  },
  heroHeading: {
    fontSize: '44px',
    fontWeight: '800',
    lineHeight: '1.2',
    color: '#FFFFFF',
    letterSpacing: '-1px',
  },
  gradientText: {
    background: 'linear-gradient(90deg, #60A5FA 0%, #3B82F6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroDesc: {
    fontSize: '16px',
    color: '#9CA3AF',
    lineHeight: '1.6',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
  },
  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.35)',
    transition: 'all 0.2s',
  },
  secondaryBtn: {
    padding: '14px 28px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  heroGraphic: {
    display: 'flex',
    justifyContent: 'center',
  },
  laptopFrame: {
    width: '100%',
    maxWidth: '420px',
    background: '#1F2937',
    padding: '8px',
    borderRadius: '16px 16px 0 0',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
  },
  laptopScreen: {
    background: '#090D16',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    height: '240px',
  },
  mockupHeader: {
    height: '24px',
    background: 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  mockupDots: {
    display: 'flex',
    gap: '6px',
  },
  mockupDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  mockupUrl: {
    fontSize: '9px',
    color: '#4B5563',
    fontFamily: 'monospace',
  },
  mockupContent: {
    flex: 1,
    display: 'flex',
  },
  mockSidebar: {
    width: '32px',
    background: 'rgba(255,255,255,0.02)',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '12px',
    gap: '8px',
  },
  mockSidebarItem: {
    width: '12px',
    height: '12px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '3px',
  },
  mockSidebarItemActive: {
    width: '12px',
    height: '12px',
    background: '#2563EB',
    borderRadius: '3px',
  },
  mockMain: {
    flex: 1,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mockHeader: {
    height: '14px',
    background: 'rgba(255,255,255,0.05)',
    width: '60%',
    borderRadius: '3px',
  },
  mockGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    flex: 1,
  },
  mockWidget: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: '6px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mockLineShort: {
    height: '6px',
    background: 'rgba(255,255,255,0.05)',
    width: '40%',
    borderRadius: '2px',
  },
  mockChartBig: {
    flex: 1,
    background: 'linear-gradient(180deg, rgba(37,99,235,0.1) 0%, transparent 100%)',
    borderRadius: '4px',
    border: '1px solid rgba(37,99,235,0.2)',
  },
  mockChartSmall: {
    flex: 1,
    background: 'linear-gradient(180deg, rgba(16,185,129,0.1) 0%, transparent 100%)',
    borderRadius: '4px',
    border: '1px solid rgba(16,185,129,0.2)',
  },
  laptopKeyboard: {
    height: '8px',
    background: '#374151',
    borderRadius: '0 0 16px 16px',
  },
  sectionHeader: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sectionSub: {
    fontSize: '15px',
    color: '#9CA3AF',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '24px',
  },
  featureCard1: {
    background: 'rgba(20, 26, 38, 0.4)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#3B82F6',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#9CA3AF',
    lineHeight: '1.6',
  },
  featureCard2: {
    background: 'rgba(20, 26, 38, 0.4)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    background: 'linear-gradient(225deg, #090e17 0%, rgba(15, 20, 36, 0.6) 100%)',
  },
  nlpCard: {
    gridColumn: 'span 2',
    background: 'rgba(20, 26, 38, 0.4)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '32px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
    alignItems: 'center',
  },
  nlpTextContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  nlpIconBox: {
    width: '40px',
    height: '40px',
    background: '#2563EB',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
  },
  nlpGraphic: {
    height: '180px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.03)',
    overflow: 'hidden',
  },
  glowingCore: {
    width: '48px',
    height: '48px',
    background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)',
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)',
    borderRadius: '50%',
    position: 'absolute',
  },
  orbitingRing1: {
    width: '100px',
    height: '100px',
    border: '1px dashed rgba(255,255,255,0.1)',
    borderRadius: '50%',
    position: 'absolute',
  },
  orbitingRing2: {
    width: '140px',
    height: '140px',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '50%',
    position: 'absolute',
  },
  pricingSection: {
    display: 'flex',
    justifyContent: 'center',
  },
  pricingCard: {
    background: 'rgba(25, 33, 54, 0.5)',
    border: '2px solid rgba(37, 99, 235, 0.3)',
    borderRadius: '24px',
    padding: '48px',
    maxWidth: '750px',
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    boxShadow: '0 16px 40px rgba(37, 99, 235, 0.08)',
  },
  pricingBadge: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#60A5FA',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    background: 'rgba(59, 130, 246, 0.15)',
    padding: '6px 14px',
    borderRadius: '9999px',
  },
  pricingTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pricingDesc: {
    fontSize: '15px',
    color: '#9CA3AF',
    lineHeight: '1.6',
    maxWidth: '540px',
  },
  pricingBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '12px',
    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
  },
  pricingFeatures: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  priceFeatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#D1D5DB',
    fontWeight: '500',
  },
  footerBanner: {
    background: 'rgba(20, 26, 38, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '24px',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    textAlign: 'center',
  },
  footerJoinHeading: {
    fontSize: '18px',
    color: '#D1D5DB',
    fontWeight: '500',
    maxWidth: '620px',
    lineHeight: '1.6',
  },
  footerForm: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '480px',
  },
  footerInput: {
    flex: 1,
    padding: '14px 18px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: '#FFFFFF',
    outline: 'none',
    fontSize: '14px',
  },
  footerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 24px',
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer',
  }
};
