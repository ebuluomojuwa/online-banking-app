import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  Laptop, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  LogOut, 
  Fingerprint, 
  Globe, 
  Clock,
  RefreshCw
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge, Modal } from '../ui';

export const SecurityView: React.FC = () => {
  const { currentUser } = useBanking();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passkeysEnabled, setPasskeysEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  // Active Sessions
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Apple MacBook Pro M3 Max', location: 'New York, USA', ip: '192.0.2.45', current: true, lastActive: 'Just now' },
    { id: 'sess-2', device: 'Apple iPhone 16 Pro (Nova App)', location: 'New York, USA', ip: '198.51.100.12', current: false, lastActive: '2 hours ago' },
    { id: 'sess-3', device: 'iPad Pro 13-inch', location: 'Boston, USA', ip: '203.0.113.88', current: false, lastActive: '3 days ago' },
  ]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordSuccess('Password successfully updated with 256-bit hashing!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordSuccess('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Security & Authentication
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage biometric Passkeys, Multi-Factor Authentication, and active device sessions
          </p>
        </div>

        <Badge variant="success">
          <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Hardware Security Key (FIDO2)
        </Badge>
      </div>

      {/* Security Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Multi-Factor Authentication Card */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Time-based One-Time Passwords (TOTP)
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Requires an authenticator app (e.g. Google Authenticator or 1Password) whenever logging in from untrusted IP ranges or authorizing wire transfers.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Enabled on Authenticator App
            </span>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              {twoFactorEnabled ? 'Reconfigure' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Passkeys & Biometrics */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                FIDO2 Passkeys & Biometrics
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Touch ID, Face ID & Windows Hello
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Sign in cryptographically without passwords using your device secure enclave and biometric sensor.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 2 Passkeys Registered
            </span>
            <button
              onClick={() => alert('Passkey WebAuthn prompt simulated')}
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:underline"
            >
              + Add Key
            </button>
          </div>
        </div>
      </div>

      {/* Password & Security Preferences */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 space-y-5">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
          Password & Alert Preferences
        </h2>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Master Account Password</span>
              <span className="text-zinc-500 text-[11px]">Last changed 3 months ago (Argon2id Hash)</span>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-semibold"
            >
              Change Password
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Instant Login Alerts</span>
              <span className="text-zinc-500 text-[11px]">Receive push notification & email for new logins</span>
            </div>
            <input
              type="checkbox"
              checked={loginAlertsEnabled}
              onChange={() => setLoginAlertsEnabled(!loginAlertsEnabled)}
              className="accent-emerald-600 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">Large Transaction Approvals</span>
              <span className="text-zinc-500 text-[11px]">Require biometric approval for transfers over $5,000</span>
            </div>
            <input
              type="checkbox"
              checked={biometricEnabled}
              onChange={() => setBiometricEnabled(!biometricEnabled)}
              className="accent-emerald-600 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
              Active Authorized Sessions
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Devices currently authenticated to your Nova banking portal
            </p>
          </div>

          <button
            onClick={() => setSessions(prev => prev.filter(s => s.current))}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
          >
            Revoke All Other Sessions
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {sessions.map(sess => (
            <div key={sess.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                  {sess.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{sess.device}</span>
                    {sess.current && (
                      <Badge variant="success" className="text-[10px] py-0 px-1.5">
                        Current Session
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    {sess.location} • IP {sess.ip} • {sess.lastActive}
                  </span>
                </div>
              </div>

              {!sess.current && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  title="Revoke Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <Modal
          isOpen={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          title="Change Portal Password"
          description="Enter your current credentials and choose a high-entropy password."
        >
          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            {passwordError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">{passwordSuccess}</span>
              </div>
            )}

            {!passwordSuccess && (
              <>
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    placeholder="Min 8 characters"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat new password"
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold"
                  >
                    Update Password
                  </button>
                </div>
              </>
            )}
          </form>
        </Modal>
      )}
    </div>
  );
};
