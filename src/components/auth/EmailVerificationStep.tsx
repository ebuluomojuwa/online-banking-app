import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCw, 
  Check, 
  Copy, 
  AlertCircle, 
  Edit3,
  Inbox,
  Sparkles,
  Lock
} from 'lucide-react';

interface EmailVerificationStepProps {
  email: string;
  generatedCode: string;
  onVerify: (enteredCode: string) => void;
  onResend: () => void;
  onChangeEmail: () => void;
  onSwitchToSignIn?: () => void;
  isLoading?: boolean;
  error?: string;
  isDarkMode?: boolean;
}

export const EmailVerificationStep: React.FC<EmailVerificationStepProps> = ({
  email,
  generatedCode,
  onVerify,
  onResend,
  onChangeEmail,
  onSwitchToSignIn,
  isLoading = false,
  error = '',
  isDarkMode = true,
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [showSimulatedEmail, setShowSimulatedEmail] = useState(true);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleDigitChange = (index: number, value: string) => {
    // Only keep last char if typing multiple
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length > 1) {
      // Pasted a full code
      const pastedDigits = cleaned.slice(0, 6).split('');
      const nextDigits = [...digits];
      pastedDigits.forEach((d, i) => {
        if (i < 6) nextDigits[i] = d;
      });
      setDigits(nextDigits);
      
      const lastIndex = Math.min(pastedDigits.length - 1, 5);
      inputRefs.current[lastIndex]?.focus();

      if (pastedDigits.length === 6) {
        onVerify(pastedDigits.join(''));
      }
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    setDigits(nextDigits);

    // Auto advance focus
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify if all 6 filled
    if (cleaned && index === 5) {
      const fullCode = nextDigits.join('');
      if (fullCode.length === 6) {
        onVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const nextDigits = [...digits];
      pastedData.split('').forEach((d, i) => {
        nextDigits[i] = d;
      });
      setDigits(nextDigits);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();

      if (pastedData.length === 6) {
        onVerify(pastedData);
      }
    }
  };

  const handleAutofill = () => {
    const codeDigits = generatedCode.split('');
    setDigits(codeDigits);
    onVerify(generatedCode);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResendClick = () => {
    if (countdown === 0) {
      onResend();
      setCountdown(45);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const isComplete = digits.every(d => d.length === 1);

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200 text-left">
      {/* Header Info */}
      <div className="space-y-1.5 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-zinc-900'} tracking-tight`}>
          Verify Your Email Address
        </h2>
        <p className={`text-xs ${isDarkMode ? 'text-rose-300/80' : 'text-zinc-600'} max-w-xs mx-auto leading-relaxed`}>
          We have generated a 6-digit verification code and dispatched it to:
        </p>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-950/40 dark:bg-rose-950/60 border border-rose-800/60 rounded-full text-xs font-mono font-medium text-rose-300">
          <Mail className="w-3.5 h-3.5 text-rose-400" />
          <span>{email}</span>
          <button
            type="button"
            onClick={onChangeEmail}
            title="Edit email address"
            className="ml-1 text-rose-400 hover:text-white p-0.5"
          >
            <Edit3 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Simulated Live Email Inbox Dispatch Preview */}
      {showSimulatedEmail && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-950/80 to-[#220409] border border-rose-700/50 shadow-md space-y-2.5 relative">
          <div className="flex items-center justify-between border-b border-rose-800/40 pb-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-rose-200">
              <Inbox className="w-3.5 h-3.5 text-rose-400" />
              <span>Incoming Email Notification</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono uppercase">
                Delivered
              </span>
            </div>
            <span className="text-[10px] text-rose-400/60 font-mono">Just now</span>
          </div>

          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between text-rose-300/90 text-[11px]">
              <span><strong>From:</strong> Nova Demo Security &lt;demo@novabank.demo&gt;</span>
              <span><strong>To:</strong> {email}</span>
            </div>
            <div className="text-[10px] text-amber-400/90 font-medium">
              Simulation Sandbox OTP (No actual email is sent):
            </div>
            <div className="p-2 rounded-xl bg-black/40 border border-rose-800/30 flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] text-rose-400/80 font-medium">Your One-Time Passcode (OTP):</div>
                <div className="text-base font-mono font-black tracking-widest text-white mt-0.5">
                  {generatedCode}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutofill}
                  className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Autofill</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/90 text-rose-200 border border-rose-700/80 space-y-2 text-xs animate-in fade-in duration-150">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
          {(error.toLowerCase().includes('already exists') || error.toLowerCase().includes('already in use') || error.toLowerCase().includes('email-already')) && onSwitchToSignIn && (
            <div className="pt-1 border-t border-rose-800/60 flex items-center justify-between">
              <span className="text-[11px] text-rose-300">Registered already?</span>
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Sign In to Account</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 6 Digit Inputs */}
      <div className="space-y-2">
        <label className={`block text-center font-bold text-xs ${isDarkMode ? 'text-rose-200' : 'text-zinc-700'}`}>
          Enter 6-Digit Code
        </label>
        <div className="flex justify-center items-center gap-2 sm:gap-2.5" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={el => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleDigitChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-xl border focus:outline-none transition-all ${
                isDarkMode 
                  ? 'bg-[#0E0103] text-white border-[#38080E] focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'bg-zinc-50 text-zinc-900 border-zinc-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Verification Action Button */}
      <button
        id="btn-verify-signup-code"
        type="button"
        disabled={!isComplete || isLoading}
        onClick={() => onVerify(digits.join(''))}
        className={`w-full py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
          isComplete && !isLoading
            ? 'bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white shadow-rose-950/50 cursor-pointer'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Validating Code & Creating Account...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>Verify & Complete Registration</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Resend Code & Back */}
      <div className="flex items-center justify-between text-xs pt-1">
        <button
          type="button"
          onClick={onChangeEmail}
          className="text-rose-400/80 hover:text-white flex items-center gap-1 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Details</span>
        </button>

        <button
          type="button"
          disabled={countdown > 0}
          onClick={handleResendClick}
          className={`flex items-center gap-1 transition-colors ${
            countdown > 0 
              ? 'text-rose-400/50 cursor-not-allowed' 
              : 'text-rose-300 hover:text-white font-bold'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${countdown > 0 ? '' : 'text-rose-400'}`} />
          <span>
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend Code'}
          </span>
        </button>
      </div>
    </div>
  );
};
