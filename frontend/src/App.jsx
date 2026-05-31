import React, { useState } from 'react';
import DemoController from './components/DemoController';
import Sidebar from './components/Shared/Sidebar';
import Header from './components/Shared/Header';

// User views
import LandingPage from './components/User/LandingPage';
import Auth from './components/User/Auth';
import Checkout from './components/User/Checkout';
import Subscription from './components/User/Subscription';
import Chat from './components/User/Chat';

// Admin views
import Dashboard from './components/Admin/Dashboard';
import RequestDetail from './components/Admin/RequestDetail';
import PaymentReview from './components/Admin/PaymentReview';
import SettingsView from './components/Admin/Settings';

export default function App() {
  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [userState, setUserState] = useState('landing'); // 'landing', 'login', 'checkout', 'waiting', 'chat'
  const [adminState, setAdminState] = useState('dashboard'); // 'dashboard', 'request_detail', 'payment_review', 'settings'
  const [isRtl, setIsRtl] = useState(false);

  // Dynamic values depending on current route/role
  let activeViewport = null;
  let pageTitle = '';
  let breadcrumbs = '';
  let activeSidebarItem = '';

  const handleNavigateUser = (targetState) => {
    setUserState(targetState);
  };

  const handleNavigateAdmin = (targetState) => {
    setAdminState(targetState);
  };

  // State Routing Machine
  if (role === 'user') {
    activeSidebarItem = userState;
    switch (userState) {
      case 'landing':
        activeViewport = (
          <LandingPage
            isRtl={isRtl}
            onStart={() => setUserState('login')}
          />
        );
        break;
      case 'login':
        activeViewport = (
          <Auth
            isRtl={isRtl}
            setIsRtl={setIsRtl}
            onLogin={() => setUserState('checkout')}
          />
        );
        break;
      case 'checkout':
        pageTitle = isRtl ? 'إتمام عملية الدفع' : 'Payment Processing';
        breadcrumbs = isRtl ? 'المستخدم / الدفع المباشر' : 'User / Direct Checkout';
        activeViewport = (
          <Checkout
            isRtl={isRtl}
            onSubmitReceipt={() => setUserState('waiting')}
          />
        );
        break;
      case 'waiting':
        pageTitle = isRtl ? 'الاشتراكات والمدفوعات' : 'Subscriptions';
        breadcrumbs = isRtl ? 'لوحة التحكم / الاشتراكات المعلقة' : 'Dashboard / Active Subscriptions';
        activeViewport = (
          <Subscription
            isRtl={isRtl}
          />
        );
        break;
      case 'chat':
        pageTitle = isRtl ? 'مساعد نيكسس الذكي' : 'SaaS Nexus Chatbot';
        breadcrumbs = isRtl ? 'المحادثة الذكية / منصة العمل' : 'AI Assistant / Chat Workspace';
        activeViewport = (
          <Chat
            isRtl={isRtl}
          />
        );
        break;
      default:
        setUserState('landing');
    }
  } else {
    // Admin Role
    activeSidebarItem = adminState;
    switch (adminState) {
      case 'dashboard':
        pageTitle = isRtl ? 'لوحة تحكم الإدارة' : 'Dashboard Overview';
        breadcrumbs = isRtl ? 'المشرف / الإحصائيات' : 'Admin / Overview';
        activeViewport = (
          <Dashboard
            isRtl={isRtl}
            onNavigateToRequest={() => setAdminState('request_detail')}
            onNavigateToReview={() => setAdminState('payment_review')}
          />
        );
        break;
      case 'request_detail':
        pageTitle = isRtl ? 'مراجعة طلبات الاشتراك' : 'Subscription Offers';
        breadcrumbs = isRtl ? 'الاشتراكات / تفاصيل الطلب' : 'Subscriptions / Manage Request';
        activeViewport = (
          <RequestDetail
            isRtl={isRtl}
            onSendOffer={() => alert(isRtl ? 'تم إرسال عرض السعر للمستخدم بنجاح!' : 'Custom offer successfully submitted to user!')}
          />
        );
        break;
      case 'payment_review':
        pageTitle = isRtl ? 'التحقق من إيصالات التحويل' : 'Document Verification';
        breadcrumbs = isRtl ? 'المستندات والمالية / مراجعة الدفع' : 'Financial Logs / Verify Bank Receipt';
        activeViewport = (
          <PaymentReview
            isRtl={isRtl}
            onApprove={() => alert(isRtl ? 'تم اعتماد الدفع وتنشيط حساب العميل!' : 'Transaction approved! Customer account is now active.')}
            onReject={(reason) => alert(isRtl ? `تم رفض طلب التحويل. السبب: ${reason}` : `Transaction declined. Reason: ${reason}`)}
          />
        );
        break;
      case 'settings':
        pageTitle = isRtl ? 'إعدادات النظام المتقدمة' : 'Global Settings';
        breadcrumbs = isRtl ? 'النظام / خيارات التهيئة' : 'System / Advanced Config';
        activeViewport = (
          <SettingsView
            isRtl={isRtl}
          />
        );
        break;
      default:
        setAdminState('dashboard');
    }
  }

  // Define if viewport should show standard dashboard layout (Header & Sidebar)
  const isFullPage = role === 'user' && (userState === 'landing' || userState === 'login');

  return (
    <div className="app-container" dir={isRtl ? 'rtl' : 'ltr'}>
      {isFullPage ? (
        // Visitor landing page or Auth flow does not have dashboard sidebars
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeViewport}
        </div>
      ) : (
        // Standard Dashboard Layout
        <>
          <Sidebar
            role={role}
            activeItem={activeSidebarItem}
            onNavigate={role === 'user' ? handleNavigateUser : handleNavigateAdmin}
            isRtl={isRtl}
            userState={userState}
          />
          
          <div className="main-content">
            <Header
              title={pageTitle}
              breadcrumbs={breadcrumbs}
              isRtl={isRtl}
              setIsRtl={setIsRtl}
              role={role}
              onBack={
                role === 'admin' && adminState !== 'dashboard' 
                  ? () => setAdminState('dashboard') 
                  : role === 'user' && userState !== 'chat' && userState !== 'checkout' && userState !== 'waiting'
                  ? () => setUserState('chat')
                  : null
              }
            />
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 70px)', overflowY: 'auto' }}>
              {activeViewport}
            </div>
          </div>
        </>
      )}

      {/* Floating Demo Toggler */}
      <DemoController
        role={role}
        setRole={setRole}
        userState={userState}
        setUserState={setUserState}
        adminState={adminState}
        setAdminState={setAdminState}
        isRtl={isRtl}
        setIsRtl={setIsRtl}
      />
    </div>
  );
}
