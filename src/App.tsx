import React, { useState } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

// Public & Auth Views
import { AuthGateway } from './components/auth/AuthGateway';
import { LandingPage } from './components/public/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';

// Customer Views
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TransactionsView } from './components/dashboard/TransactionsView';
import { TransfersView } from './components/dashboard/TransfersView';
import { CardsView } from './components/dashboard/CardsView';
import { SavingsGoalsView } from './components/dashboard/SavingsGoalsView';
import { LoansView } from './components/dashboard/LoansView';
import { BillPaymentsView } from './components/dashboard/BillPaymentsView';
import { AccountsDetailView } from './components/dashboard/AccountsDetailView';
import { StatementsView } from './components/dashboard/StatementsView';
import { SecurityView } from './components/dashboard/SecurityView';
import { SupportView } from './components/dashboard/SupportView';
import { ProfileSettingsView } from './components/dashboard/ProfileSettingsView';

// Admin Views
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { AdminCustomersView } from './components/admin/AdminCustomersView';
import { AdminTransactionsView } from './components/admin/AdminTransactionsView';
import { AdminFraudAlertsView } from './components/admin/AdminFraudAlertsView';
import { AdminAuditLogsView } from './components/admin/AdminAuditLogsView';

const BankingAppInner: React.FC = () => {
  const { currentUser, role, isAuthenticated, isAuthLoading } = useBanking();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [isLandingMode, setIsLandingMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);

  // Show sleek loading state while verifying Firebase Authentication session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#140204] text-[#FFF1F2] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
        <div className="text-xs text-rose-300/80 font-medium tracking-wide">
          Verifying Nova Demo Session...
        </div>
      </div>
    );
  }

  // When unauthenticated, require user to sign in or register before getting into the app
  if (!isAuthenticated) {
    if (isLandingMode) {
      return (
        <>
          <LandingPage
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onEnterDemo={() => setIsLoginOpen(true)}
          />
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSuccess={() => {
              setIsLandingMode(false);
              setCurrentView('dashboard');
            }}
            onSwitchToRegister={() => {
              setIsLoginOpen(false);
              setIsRegisterOpen(true);
            }}
          />
          <RegisterModal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
            onSuccess={() => {
              setIsLandingMode(false);
              setCurrentView('dashboard');
            }}
            onSwitchToLogin={() => {
              setIsRegisterOpen(false);
              setIsLoginOpen(true);
            }}
          />
        </>
      );
    }

    return (
      <AuthGateway
        initialMode="signin"
        onSuccess={() => {
          setIsLandingMode(false);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  // If authenticated and user clicked to view landing page
  if (isLandingMode) {
    return (
      <LandingPage
        onOpenLogin={() => setIsLandingMode(false)}
        onOpenRegister={() => setIsLandingMode(false)}
        onEnterDemo={() => setIsLandingMode(false)}
      />
    );
  }

  // Render internal authenticated dashboard views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardOverview onNavigate={setCurrentView} />;
      case 'transactions':
        return <TransactionsView />;
      case 'transfers':
        return <TransfersView />;
      case 'cards':
        return <CardsView />;
      case 'savings':
        return <SavingsGoalsView />;
      case 'loans':
        return <LoansView />;
      case 'bills':
        return <BillPaymentsView />;
      case 'accounts':
        return <AccountsDetailView />;
      case 'statements':
        return <StatementsView />;
      case 'security':
        return <SecurityView />;
      case 'support':
        return <SupportView />;
      case 'settings':
        return <ProfileSettingsView />;

      // Admin views
      case 'admin-dashboard':
        return <AdminDashboardView onNavigate={setCurrentView} />;
      case 'admin-customers':
        return <AdminCustomersView onNavigate={setCurrentView} />;
      case 'admin-transactions':
        return <AdminTransactionsView />;
      case 'admin-fraud':
        return <AdminFraudAlertsView />;
      case 'admin-audit':
        return <AdminAuditLogsView />;

      default:
        return <DashboardOverview onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#140204] text-[#FFF1F2] flex flex-col font-sans transition-colors">
      {/* Top Main Navigation Bar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={setCurrentView}
        onGoToLanding={() => setIsLandingMode(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        {/* Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 min-w-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Customer Banking Footer Bar */}
      <footer className="border-t border-[#38080E] bg-[#0E0103]/80 px-6 sm:px-10 py-3 flex items-center justify-between text-xs text-rose-300/70 transition-colors">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-rose-200">256-Bit SSL Encrypted Connection</span>
        </div>
        <div className="text-[11px] text-rose-400/80 hidden sm:block">
          Nova Financial Technologies • Member FDIC • Equal Housing Lender
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-400/90 text-[11px] font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Verified Secure Session
          </span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation & Action Drawer */}
      <MobileNav currentView={currentView} onNavigate={setCurrentView} />

      {/* Global Quick Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setCurrentView}
      />
    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <BankingAppInner />
    </BankingProvider>
  );
}
