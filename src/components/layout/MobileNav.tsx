import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  CreditCard, 
  Menu, 
  X, 
  Receipt, 
  PiggyBank, 
  Landmark, 
  FileText, 
  ShieldCheck, 
  LifeBuoy, 
  Settings, 
  SendHorizontal,
  Sparkles,
  LogOut
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, onNavigate }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { currentUser, logout } = useBanking();
  const isAdmin = currentUser.role === 'ADMIN';

  const mainBottomTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'accounts', label: 'Accounts', icon: Wallet },
    { id: 'transfers', label: 'Transfer', icon: SendHorizontal },
    { id: 'cards', label: 'Cards', icon: CreditCard },
  ];

  const fullNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'accounts', label: 'All Accounts & Vaults', icon: Wallet },
    { id: 'transactions', label: 'Transaction Activity', icon: ArrowLeftRight },
    { id: 'transfers', label: 'Send & Wire Money', icon: SendHorizontal },
    { id: 'bills', label: 'Bill Payments', icon: Receipt },
    { id: 'cards', label: 'Virtual & Physical Cards', icon: CreditCard },
    { id: 'savings', label: 'Savings Goals', icon: PiggyBank },
    { id: 'loans', label: 'Loans & Amortization', icon: Landmark },
    { id: 'statements', label: 'Monthly Statements', icon: FileText },
    { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
    { id: 'support', label: 'Support & Chat', icon: LifeBuoy },
    { id: 'profile', label: 'Account Settings', icon: Settings },
  ];

  const adminItems = [
    { id: 'admin-overview', label: 'Admin Command', icon: LayoutDashboard },
    { id: 'admin-customers', label: 'Customer Directory', icon: Settings },
    { id: 'admin-transactions', label: 'Transaction Control', icon: ArrowLeftRight },
    { id: 'admin-fraud', label: 'Fraud Alerts', icon: ShieldCheck },
    { id: 'admin-support', label: 'Support Queue', icon: LifeBuoy },
    { id: 'admin-audit', label: 'Audit Logs', icon: FileText },
    { id: 'admin-reports', label: 'Reports', icon: Landmark },
  ];

  return (
    <>
      {/* Fixed Bottom Navigation for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E0103]/95 backdrop-blur-lg border-t border-[#38080E] px-3 py-2 flex items-center justify-around">
        {mainBottomTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive 
                  ? 'text-rose-400 font-semibold' 
                  : 'text-rose-300/60 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            drawerOpen 
              ? 'text-rose-400 font-semibold' 
              : 'text-rose-300/60 hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-1">Menu</span>
        </button>
      </div>

      {/* Slide-over Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity" 
            onClick={() => setDrawerOpen(false)} 
          />

          <div className="relative ml-auto w-4/5 max-w-sm h-full bg-[#140204] border-l border-[#38080E] p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#38080E]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-rose-500/20">
                    N
                  </div>
                  <span className="font-semibold text-sm text-white">NOVA BANK</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-xl text-rose-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1">
                <div className="text-[10px] font-bold text-rose-400/70 uppercase tracking-wider px-3 mb-2">
                  {isAdmin && currentView.startsWith('admin-') ? 'Admin Operations' : 'Banking Services'}
                </div>

                {(isAdmin && currentView.startsWith('admin-') ? adminItems : fullNavItems).map(item => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-rose-500/20 text-white font-semibold border border-rose-500/40'
                          : 'text-rose-300/70 hover:bg-[#1C0407]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : ''}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {isAdmin && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onNavigate(currentView.startsWith('admin-') ? 'dashboard' : 'admin-overview');
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    {currentView.startsWith('admin-') ? 'Switch to Customer View' : 'Switch to Admin Console'}
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#38080E]">
              <button
                onClick={() => {
                  logout();
                  setDrawerOpen(false);
                  onNavigate('home');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
