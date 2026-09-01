import React, { useState } from 'react';
import { 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Check, 
  X,
  Loader2
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface ChangePasswordFormProps {
  onSuccessCallback?: () => void;
  className?: string;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSuccessCallback,
  className = ''
}) => {
  const { changePassword, currentUser } = useBanking();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Requirement Checks
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isDifferentFromCurrent = currentPassword.length > 0 && newPassword.length > 0 && currentPassword !== newPassword;

  const isFormValid = hasMinLength && hasLetter && hasNumber && passwordsMatch && currentPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword.trim()) {
      setErrorMessage('Please enter your current password.');
      return;
    }

    if (!newPassword.trim()) {
      setErrorMessage('Please enter your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    if (!hasMinLength) {
      setErrorMessage('New password must be at least 8 characters long.');
      return;
    }

    if (!hasLetter || !hasNumber) {
      setErrorMessage('New password must contain both letters and numbers.');
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage('New password cannot be identical to your current password.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await changePassword(currentPassword, newPassword, confirmPassword);
      setIsLoading(false);

      if (result.success) {
        setSuccessMessage('Your password has been changed successfully and updated in Firebase Authentication.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onSuccessCallback?.();
      } else {
        setErrorMessage(result.error || 'Failed to update password. Please check your current password.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(err?.message || 'An unexpected error occurred while updating your password.');
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {errorMessage && (
        <div 
          id="change-password-error-alert"
          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-rose-200">Unable to Change Password</span>
            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div 
          id="change-password-success-alert"
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-3 animate-in fade-in duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block text-emerald-200">Password Updated Successfully</span>
            <p className="mt-0.5 leading-relaxed">{successMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="current-password-input"
              className="text-xs font-bold text-rose-200/90 tracking-wide uppercase"
            >
              Current Password
            </label>
            <span className="text-[11px] text-rose-400/60">Required for verification</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400/60">
              <Key className="w-4 h-4" />
            </div>
            <input
              id="current-password-input"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              required
              disabled={isLoading}
              className="w-full pl-10 pr-10 py-3 bg-[#0E0103] border border-[#38080E] text-rose-100 placeholder-rose-400/40 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              id="toggle-current-password-visibility"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-rose-400/60 hover:text-rose-200 transition-colors"
              tabIndex={-1}
            >
              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password & Confirm Password Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* New Password */}
          <div className="space-y-1.5">
            <label 
              htmlFor="new-password-input"
              className="text-xs font-bold text-rose-200/90 tracking-wide uppercase"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400/60">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="new-password-input"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 bg-[#0E0103] border border-[#38080E] text-rose-100 placeholder-rose-400/40 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                id="toggle-new-password-visibility"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-rose-400/60 hover:text-rose-200 transition-colors"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label 
              htmlFor="confirm-password-input"
              className="text-xs font-bold text-rose-200/90 tracking-wide uppercase"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400/60">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirm-password-input"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-10 py-3 bg-[#0E0103] border border-[#38080E] text-rose-100 placeholder-rose-400/40 rounded-xl text-xs focus:outline-none focus:border-rose-500 transition-colors disabled:opacity-50"
              />
              <button
                type="button"
                id="toggle-confirm-password-visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-rose-400/60 hover:text-rose-200 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Password Requirements Checklist */}
        <div className="p-4 rounded-2xl bg-[#0E0103] border border-[#38080E] space-y-2.5">
          <div className="text-[11px] font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            Password Security Requirements
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              {hasMinLength ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-rose-500/40 shrink-0" />
              )}
              <span className={hasMinLength ? 'text-emerald-300' : 'text-rose-400/60'}>
                Minimum 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2">
              {hasLetter && hasNumber ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-rose-500/40 shrink-0" />
              )}
              <span className={hasLetter && hasNumber ? 'text-emerald-300' : 'text-rose-400/60'}>
                Contains letters & numbers
              </span>
            </div>

            <div className="flex items-center gap-2">
              {passwordsMatch ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-rose-500/40 shrink-0" />
              )}
              <span className={passwordsMatch ? 'text-emerald-300' : 'text-rose-400/60'}>
                Passwords match
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isDifferentFromCurrent ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-rose-500/40 shrink-0" />
              )}
              <span className={isDifferentFromCurrent ? 'text-emerald-300' : 'text-rose-400/60'}>
                Different from current password
              </span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-rose-400/60 hidden sm:block">
            Protected with Firebase Authentication & PBKDF2 / SHA-256
          </div>
          <button
            type="submit"
            id="submit-change-password-btn"
            disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating via Firebase...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
