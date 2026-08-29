import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Modal } from '../ui';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToRegister,
}) => {
  const { allUsers, login, switchUser } = useBanking();
  const [identifier, setIdentifier] = useState('gregoriolind');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const result = login(identifier, password);
      if (result.success) {
        setIsLoading(false);
        onSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    }, 450);
  };

  const handleQuickPersona = (user: typeof allUsers[0]) => {
    setIdentifier(user.username || user.email);
    setPassword(user.password || 'Password123!');
    const result = login(user.username || user.email, user.password || 'Password123!');
    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In to HSBC Online Banking"
      description="Enter your username or email address and password to access your personalized customer dashboard."
    >
      <div className="space-y-4 text-xs">
        {/* Quick Demo Persona Access */}
        <div className="p-3.5 bg-[#1C0407] rounded-2xl border border-[#38080E] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-300/80 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> One-Click Customer Sign In:
            </div>
            <span className="text-[10px] text-rose-400/60 font-mono">Password: Password123!</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allUsers.slice(0, 6).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickPersona(u)}
                className="p-2 rounded-xl bg-[#0E0103] hover:bg-[#25060A] border border-[#38080E] hover:border-rose-500/50 text-left transition-all group"
              >
                <div className="flex items-center gap-2">
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.firstName} className="w-6 h-6 rounded-full object-cover border border-[#38080E]" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-rose-900/60 flex items-center justify-center text-[10px] font-bold text-rose-200">
                      {u.firstName[0]}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-rose-100 group-hover:text-white truncate text-[11px]">
                      {u.firstName} {u.lastName}
                    </div>
                    <div className="text-[9px] text-rose-400/70 truncate">
                      @{u.username || u.email.split('@')[0]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/80 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="block font-bold text-rose-200 text-xs">
              Username or Email Address
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-rose-400/60" />
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. gregoriolind or gregorio.lind@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-[#1C0407] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-rose-200 text-xs">
                Password
              </label>
              <span className="text-[10px] text-rose-400/70">Encrypted 256-bit TLS</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-rose-400/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter account password"
                required
                className="w-full pl-9 pr-10 py-2.5 bg-[#1C0407] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-3 text-rose-400/60 hover:text-rose-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Credentials...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-rose-300/70">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="font-bold text-rose-200 hover:text-white underline underline-offset-2 ml-1"
            >
              Register for Online Banking
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
