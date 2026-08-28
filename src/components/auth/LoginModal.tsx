import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Fingerprint,
  User
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
  const { users, switchUser } = useBanking();
  const [email, setEmail] = useState('eleanor.vance@example.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Find matching user or fallback to first user
      const matchedUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (matchedUser) {
        switchUser(matchedUser.id);
        setIsLoading(false);
        onSuccess();
        onClose();
      } else {
        // Log in as default customer
        switchUser(users[0]?.id || 'usr-1');
        setIsLoading(false);
        onSuccess();
        onClose();
      }
    }, 600);
  };

  const handleQuickPersona = (userId: string) => {
    switchUser(userId);
    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In to Nova Banking"
      description="Access your personal accounts, business treasury, or admin console."
    >
      <div className="space-y-5 text-xs">
        {/* Quick Demo Persona Access */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 space-y-2">
          <div className="flex items-center gap-1.5 text-zinc-500 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Sign In:
          </div>
          <div className="grid grid-cols-3 gap-2">
            {users.map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickPersona(u.id)}
                className="p-2 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-left hover:border-zinc-400 dark:hover:border-zinc-400 transition-all text-[11px]"
              >
                <div className="font-bold text-zinc-900 dark:text-white truncate">{u.firstName}</div>
                <div className="text-[9px] text-zinc-400 uppercase font-semibold">{u.role}</div>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <span className="text-[10px] text-zinc-400">Demo Auth Enabled</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Verifying Security Token...' : 'Secure Sign In'}
          </button>

          <div className="pt-2 text-center text-zinc-500">
            Don't have an account yet?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToRegister();
              }}
              className="font-bold text-zinc-900 dark:text-white hover:underline"
            >
              Open New Account
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
