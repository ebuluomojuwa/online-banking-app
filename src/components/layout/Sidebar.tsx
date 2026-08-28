import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  CreditCard, 
  PiggyBank, 
  Receipt, 
  FileText, 
  ShieldCheck, 
  LifeBuoy, 
  Settings, 
  TrendingUp, 
  Users, 
  AlertOctagon, 
  ClipboardList, 
  BarChart3, 
  Sparkles,
  Zap,
  Lock,
  LogOut,
  Landmark
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { currentUser, unreadNotificationCount, logout } = useBanking();

  const isAdminRole = currentUser.role === 'ADMIN' || currentUser.role === 'SUPER_ADMIN';

  // Customer Navigation Links
  const customerNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'transfers', label: 'Transfer Money', icon: ArrowLeftRight },
    { id: 'bills', label: 'Bills & Payees', icon: Receipt },
    { id: 'cards', label: 'Cards & Limits', icon: CreditCard },
    { id: 'savings', label: 'Savings Goals', icon: PiggyBank },
    { id: 'loans', label: 'Loans & Calculator', icon: Landmark },
    { id: 'statements', label: 'Statements', icon: FileText },
    { id: 'security', label: 'Security Center', icon: ShieldCheck },
    { id: 'support', label: 'Support Desk', icon: LifeBuoy },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Admin Navigation Links
  const adminNavItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Admin Command', icon: LayoutDashboard },
    { id: 'admin-customers', label: 'Customer Directory', icon: Users },
    { id: 'admin-transactions', label: 'Transaction Audit', icon: ArrowLeftRight },
    { id: 'admin-fraud', label: 'Fraud & Risk Alerts', icon: AlertOctagon, badge: '3 Alerts' },
    { id: 'admin-audit', label: 'System Audit Logs', icon: ClipboardList },
    { id: 'dashboard', label: 'Switch to Customer View', icon: Sparkles },
  ];

  const items = isAdminRole && currentView.startsWith('admin-') ? adminNavItems : customerNavItems;

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#38080E] bg-[#0E0103] h-[calc(100vh-5.5rem)] sticky top-[5.5rem] py-6 px-4 justify-between transition-colors">
      <div className="space-y-6">
        {/* Portal Switch Indicator or Account Security Box */}
        <div className="px-1">
          {isAdminRole && currentView.startsWith('admin-') ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Admin Command
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-rose-300/60 mt-1">
                Institutional audit & compliance engine active.
              </p>
            </div>
          ) : (
            <div className="bg-[#1C0407] p-4 rounded-2xl border border-[#38080E]">
              <div className="text-xs text-rose-300/70 mb-1 font-medium">Account Security</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-emerald-400">92% Secure</span>
                <div className="w-14 h-1.5 bg-[#0E0103] rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {items.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-rose-500/20 text-white border border-rose-500/40 shadow-xs font-semibold'
                    : 'text-rose-300/70 hover:text-white hover:bg-[#1C0407]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-rose-400/60'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Quick Actions */}
      <div className="pt-4 border-t border-[#38080E] space-y-2">
        {isAdminRole && !currentView.startsWith('admin-') && (
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Switch to Admin View
          </button>
        )}

        <button
          onClick={() => {
            logout();
            onNavigate('home');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

function SendHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}
