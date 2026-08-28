import React, { useState } from 'react';
import { 
  Shield, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Eye, 
  EyeOff, 
  LogOut, 
  User, 
  ChevronDown, 
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (view: string) => void;
  onGoToLanding?: () => void;
  currentView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onNavigate, onGoToLanding, currentView = 'dashboard' }) => {
  const { 
    currentUser, 
    allUsers, 
    switchUser, 
    isAuthenticated, 
    logout, 
    hideBalances, 
    toggleHideBalances, 
    theme, 
    setTheme, 
    isDarkMode,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    resetAllDemoData
  } = useBanking();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const recentNotifications = notifications.slice(0, 4);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E0103]/95 backdrop-blur-md border-b border-[#38080E] transition-colors">
      {/* Top Demo Banner */}
      <div className="bg-[#0B0102] text-rose-300/80 text-xs px-4 py-1.5 flex items-center justify-between border-b border-[#38080E]/80">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold tracking-widest text-emerald-400 uppercase text-[10px]">
              SYSTEM OPERATIONAL
            </span>
            <span className="hidden sm:inline text-rose-300/60">
              • Simulated Financial Prototype
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetAllDemoData}
              className="text-[11px] text-rose-300/70 hover:text-white transition-colors underline underline-offset-2 flex items-center gap-1"
              title="Reset all balances and mock records to initial state"
            >
              Reset Seed
            </button>
            <div className="h-3 w-px bg-[#38080E]" />
            <button
              onClick={() => setShowRoleSwitcher(prev => !prev)}
              className="text-[11px] font-medium text-rose-200 hover:text-emerald-400 transition-colors flex items-center gap-1.5 bg-[#1C0407] px-2 py-0.5 rounded-lg border border-[#38080E]"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Persona: <strong className="text-white">{currentUser.firstName} ({currentUser.role})</strong></span>
              <ChevronDown className="w-3 h-3 text-rose-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-white">
                  NOVA BANK
                </h1>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  PREMIER
                </span>
              </div>
            </div>
          </button>

          {/* Navigation Links for Public View */}
          {!isAuthenticated && (
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-rose-300/70">
              <button onClick={() => onNavigate('home')} className={currentView === 'home' ? 'text-white font-semibold' : 'hover:text-white transition-colors'}>Home</button>
              <button onClick={() => onNavigate('personal')} className={currentView === 'personal' ? 'text-white font-semibold' : 'hover:text-white transition-colors'}>Personal</button>
              <button onClick={() => onNavigate('business')} className={currentView === 'business' ? 'text-white font-semibold' : 'hover:text-white transition-colors'}>Business</button>
              <button onClick={() => onNavigate('cards-info')} className={currentView === 'cards-info' ? 'text-white font-semibold' : 'hover:text-white transition-colors'}>Cards</button>
              <button onClick={() => onNavigate('security-info')} className={currentView === 'security-info' ? 'text-white font-semibold' : 'hover:text-white transition-colors'}>Security</button>
            </nav>
          )}
        </div>

        {/* Center / Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Global Search Bar Trigger */}
          {isAuthenticated && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-3 px-4 py-2 bg-[#1C0407] hover:bg-[#25060A] text-rose-300/70 rounded-full text-xs transition-all border border-[#38080E] w-36 sm:w-72 justify-between focus:outline-none focus:border-rose-500"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-rose-400/60" />
                <span className="truncate">Search transactions, beneficiaries...</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono text-rose-300 bg-[#0E0103] rounded border border-[#38080E]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Hide/Show Balance Toggle */}
          {isAuthenticated && (
            <button
              onClick={toggleHideBalances}
              className="p-2 text-rose-300/70 hover:text-white rounded-xl hover:bg-[#1C0407] transition-colors"
              title={hideBalances ? 'Show balances' : 'Hide balances for privacy'}
              aria-label="Toggle balance visibility"
            >
              {hideBalances ? <EyeOff className="w-5 h-5 text-amber-400" /> : <Eye className="w-5 h-5" />}
            </button>
          )}

          {/* Dark/Light Mode Toggle */}
          <button
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            className="p-2 text-rose-300/70 hover:text-white rounded-xl hover:bg-[#1C0407] transition-colors"
            title={`Switch to ${isDarkMode ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-rose-300" />}
          </button>

          {/* Notifications Dropdown */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifMenu(prev => !prev);
                  setShowUserMenu(false);
                }}
                className="relative p-2 text-rose-300/70 hover:text-white rounded-xl hover:bg-[#1C0407] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-[#0E0103] rounded-full" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#200508] rounded-3xl shadow-2xl border border-[#38080E] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-5 pb-3 border-b border-[#38080E] flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white">Notifications</h4>
                      <p className="text-xs text-rose-300/70">{unreadNotificationCount} unread alerts</p>
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={() => markAllNotificationsRead()}
                        className="text-xs text-emerald-400 hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#38080E]/60">
                    {recentNotifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkUrl) {
                            onNavigate(notif.linkUrl.replace('/dashboard/', ''));
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-[#2B070B] cursor-pointer transition-colors flex gap-3 ${
                          !notif.isRead ? 'bg-[#28060A]' : ''
                        }`}
                      >
                        <div className="mt-1">
                          {notif.type === 'TRANSFER' && <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />}
                          {notif.type === 'SECURITY' && <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />}
                          {notif.type === 'PAYMENT' && <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />}
                          {notif.type === 'CARD' && <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />}
                          {notif.type === 'SYSTEM' && <span className="w-2 h-2 rounded-full bg-rose-300/50 inline-block" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{notif.title}</p>
                          <p className="text-xs text-rose-300/80 line-clamp-2 mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-rose-400/60 mt-1 block">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pt-3 border-t border-[#38080E] text-center">
                    <button
                      onClick={() => {
                        onNavigate('notifications');
                        setShowNotifMenu(false);
                      }}
                      className="text-xs font-semibold text-rose-200 hover:text-white"
                    >
                      View all notification records
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Profile Dropdown or Auth Button */}
          {isAuthenticated ? (
            <div className="relative border-l border-[#38080E] pl-4 sm:pl-6">
              <button
                onClick={() => {
                  setShowUserMenu(prev => !prev);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#1C0407] transition-colors focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-semibold text-white leading-tight">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-[10px] text-rose-300/70 font-bold uppercase tracking-wider">
                    {currentUser.role === 'ADMIN' ? 'ADMIN COMMAND' : 'PREMIER CLIENT'}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-xs border border-rose-400/30">
                  {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-rose-400 hidden md:block" />
              </button>

              {/* User Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-[#200508] rounded-3xl shadow-2xl border border-[#38080E] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-5 py-2 border-b border-[#38080E]">
                    <p className="text-xs font-bold text-white">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-[11px] text-rose-300/70 truncate">{currentUser.email}</p>
                    <div className="mt-2">
                      <Badge variant={currentUser.role === 'ADMIN' ? 'warning' : 'secondary'}>
                        {currentUser.role}
                      </Badge>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-5 py-2 text-left text-xs text-rose-200 hover:bg-[#2B070B] flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-rose-400" />
                      Profile & Settings
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('security');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-5 py-2 text-left text-xs text-rose-200 hover:bg-[#2B070B] flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-rose-400" />
                      Security Center
                    </button>
                    {currentUser.role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          onNavigate('admin-dashboard');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-5 py-2 text-left text-xs font-semibold text-amber-400 hover:bg-amber-500/10 flex items-center gap-2"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                        Admin Console
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#38080E] px-2">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        onNavigate('home');
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-xs font-semibold text-rose-200 hover:bg-[#1C0407] rounded-xl transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-5 py-2 text-xs font-bold text-[#140204] bg-rose-500 hover:bg-rose-600 rounded-2xl transition-colors shadow-lg shadow-rose-500/20"
              >
                Open Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Role Switcher Modal */}
      {showRoleSwitcher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#200508] rounded-3xl p-6 shadow-2xl border border-[#38080E]">
            <div className="flex items-center justify-between pb-3 border-b border-[#38080E]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white">Persona Switcher</h3>
              </div>
              <button 
                onClick={() => setShowRoleSwitcher(false)}
                className="text-rose-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-rose-300/80 mt-2 mb-4">
              Select any pre-configured fictional persona to evaluate banking, card controls, or institutional audit workflows:
            </p>

            <div className="space-y-2.5">
              {allUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setShowRoleSwitcher(false);
                    if (user.role === 'ADMIN') {
                      onNavigate('admin-dashboard');
                    } else {
                      onNavigate('dashboard');
                    }
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    user.id === currentUser.id
                      ? 'border-rose-500/50 bg-rose-500/15 shadow-xs'
                      : 'border-[#38080E] hover:bg-[#2B070B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold text-xs">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </span>
                        {user.id === currentUser.id && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        )}
                      </div>
                      <span className="text-xs text-rose-300/70">{user.email}</span>
                    </div>
                  </div>
                  <Badge variant={user.role === 'ADMIN' ? 'warning' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
