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
  SlidersHorizontal
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';
import { NovaLogo } from '../common/NovaLogo';

interface NavbarProps {
  onOpenSearch: () => void;
  onNavigate: (view: string) => void;
  onGoToLanding?: () => void;
  currentView?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onNavigate, onGoToLanding, currentView = 'dashboard' }) => {
  const { 
    currentUser, 
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
    markAllNotificationsRead
  } = useBanking();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const recentNotifications = notifications.slice(0, 4);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E0103]/95 backdrop-blur-md border-b border-[#38080E] transition-colors">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'home')}
            className="flex items-center text-left group focus:outline-none"
          >
            <NovaLogo size="md" />
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
                    {(currentUser.firstName || 'Private')} {(currentUser.lastName || 'Client')}
                  </div>
                  <div className="text-[10px] text-rose-300/70 font-medium uppercase tracking-wider">
                    {currentUser.role === 'ADMIN' ? 'ADMIN' : 'PRIVATE CLIENT'}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white font-bold text-xs shadow-xs border border-rose-400/30">
                  {(currentUser.firstName || 'P').charAt(0)}{(currentUser.lastName || 'C').charAt(0)}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-rose-400 hidden md:block" />
              </button>

              {/* User Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-[#200508] rounded-3xl shadow-2xl border border-[#38080E] py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-5 py-2 border-b border-[#38080E]">
                    <p className="text-xs font-bold text-white">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-[11px] text-rose-300/70 font-mono">@{currentUser.username || 'client'}</p>
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

    </header>
  );
};
