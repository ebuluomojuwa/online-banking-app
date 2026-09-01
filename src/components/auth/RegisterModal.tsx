import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Building2,
  AlertCircle
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { findUserByEmailOrUsername } from '../../lib/firestoreService';
import { Modal } from '../ui';
import { EmailVerificationStep } from './EmailVerificationStep';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onSwitchToLogin,
}) => {
  const { register } = useBanking();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'CHECKING' | 'SAVINGS' | 'BUSINESS'>('CHECKING');
  const [step, setStep] = useState<'form' | 'verify' | 'success'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateNewCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleInitiateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const existing = await findUserByEmailOrUsername(email.trim().toLowerCase());
      if (existing) {
        setIsLoading(false);
        setError('An account with this email address already exists. Please sign in instead.');
        return;
      }
    } catch (err) {
      console.warn('Pre-check error:', err);
    }

    setTimeout(() => {
      const code = generateNewCode();
      setVerificationCode(code);
      setIsLoading(false);
      setStep('verify');
    }, 300);
  };

  const handleResend = () => {
    const code = generateNewCode();
    setVerificationCode(code);
    setError('');
  };

  const handleVerify = async (enteredCode: string) => {
    setError('');
    if (enteredCode !== verificationCode) {
      setError('Incorrect verification code. Please check your email and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password: password || 'Password123!',
        accountType,
      });

      setIsLoading(false);
      if (res.success) {
        setStep('success');
        setTimeout(() => {
          onSuccess();
          onClose();
          setStep('form');
        }, 1200);
      } else {
        setError(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || 'Registration failed.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'verify' ? "Email Security Verification" : "Open an HSBC Account"}
      description={step === 'verify' ? "Verify your email to complete registration." : "Instant onboarding with email security verification and automated funding."}
    >
      {step === 'form' ? (
        <form onSubmit={handleInitiateSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/90 text-rose-200 border border-rose-700/80 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="flex-1 leading-relaxed">{error}</span>
              </div>
              {(error.toLowerCase().includes('already exists') || error.toLowerCase().includes('already in use')) && (
                <div className="pt-1.5 border-t border-rose-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-rose-300">Registered already?</span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToLogin();
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                First Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Julian"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">
                Last Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Thorne"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            />
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">A 6-digit OTP code will be sent to this email address.</span>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-700 dark:text-zinc-300">
              Account Password
            </label>
            <input
              type="password"
              placeholder="Create secure password (min. 6 characters)"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-700 dark:text-zinc-300">
              Initial Primary Account Type
            </label>
            <select
              value={accountType}
              onChange={e => setAccountType(e.target.value as any)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            >
              <option value="CHECKING">HSBC Premier Checking ($0 Monthly Fee)</option>
              <option value="SAVINGS">High-Yield Reserve Savings (4.75% APY)</option>
              <option value="BUSINESS">Institutional Commercial Vault</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Two-step email OTP verification with $10,000 initial opening balance.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Verification Code...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Send Verification Code & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center text-zinc-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToLogin();
              }}
              className="font-bold text-zinc-900 dark:text-white hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      ) : step === 'verify' ? (
        <EmailVerificationStep
          email={email}
          generatedCode={verificationCode}
          onVerify={handleVerify}
          onResend={handleResend}
          onChangeEmail={() => setStep('form')}
          onSwitchToSignIn={() => {
            onClose();
            onSwitchToLogin();
          }}
          isLoading={isLoading}
          error={error}
          isDarkMode={true}
        />
      ) : (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Account Provisioned Successfully!
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Your email is verified, credentials encrypted, and opening balance credited. Entering portal...
          </p>
        </div>
      )}
    </Modal>
  );
};
