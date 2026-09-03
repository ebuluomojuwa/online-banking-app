import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Eye,
  EyeOff, 
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
  const { login } = useBanking();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(identifier, password);
      if (result.success) {
        setIsLoading(false);
        onSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In to Nova Demo Banking"
      description="Interactive demonstration sandbox. Please do NOT enter real banking or sensitive personal credentials."
    >
      <div className="space-y-4 text-xs">
        {/* Safe Browsing Demo Notice & Credential Auto-Fill */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-center justify-between gap-2">
          <span>💡 <strong>Demo Portal:</strong> Use test accounts. Do not use real bank passwords.</span>
          <button
            type="button"
            onClick={() => {
              setIdentifier('gregorio.lind@example.com');
              setPassword('Password123!');
            }}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold rounded-lg text-[11px] transition-colors border border-amber-500/30 shrink-0"
          >
            Fill Demo
          </button>
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
              Demo Username or Email Address
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-rose-400/60" />
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. gregoriolind or gregorio.lind@example.com"
                required
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-full pl-9 pr-4 py-2.5 bg-[#1C0407] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-bold text-rose-200 text-xs">
                Password
              </label>
              <span className="text-[10px] text-rose-400/70">Demo Session Auth</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-rose-400/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Demo password (e.g. Password123!)"
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
                <span>Sign In to Demo Portal</span>
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
              Open Demo Account
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
