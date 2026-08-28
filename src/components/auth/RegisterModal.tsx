import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  Building2
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Modal } from '../ui';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('CHECKING');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep(1);
      }, 1200);
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Open a Nova Bank Account"
      description="Instant onboarding with automated KYC identity verification."
    >
      {step === 1 ? (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-zinc-700 dark:text-zinc-300">
              Initial Primary Account Type
            </label>
            <select
              value={accountType}
              onChange={e => setAccountType(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            >
              <option value="CHECKING">Nova Premier Checking ($0 Monthly Fee)</option>
              <option value="SAVINGS">High-Yield Reserve Savings (4.75% APY)</option>
              <option value="BUSINESS">Institutional Commercial Vault</option>
            </select>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Simulated instant identity pass with $10,000 initial prototype opening balance.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Issuing Vault Credentials...' : 'Complete Account Registration'}
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
      ) : (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            Account Provisioned Successfully!
          </h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">
            Your credentials have been encrypted and routing numbers generated. Entering portal...
          </p>
        </div>
      )}
    </Modal>
  );
};
