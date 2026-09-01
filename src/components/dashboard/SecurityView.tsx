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
import { ChangePasswordForm } from './ChangePasswordForm';

export const SecurityView: React.FC = () => {
  const { currentUser } = useBanking();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [passkeysEnabled, setPasskeysEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  // Active Sessions
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Apple MacBook Pro M3 Max', location: 'New York, USA', ip: '192.0.2.45', current: true, lastActive: 'Just now' },
    { id: 'sess-2', device: 'Apple iPhone 16 Pro (HSBC App)', location: 'New York, USA', ip: '198.51.100.12', current: false, lastActive: '2 hours ago' },
    { id: 'sess-3', device: 'iPad Pro 13-inch', location: 'Boston, USA', ip: '203.0.113.88', current: false, lastActive: '3 days ago' },
  ]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Security & Authentication
          </h1>
          <p className="text-xs text-rose-300/70 mt-1">
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
        <div className="bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Two-Factor Authentication (2FA)
              </h3>
              <p className="text-xs text-rose-300/70">
                Time-based One-Time Passwords (TOTP)
              </p>
            </div>
          </div>

          <p className="text-xs text-rose-300/80 leading-relaxed">
            Requires an authenticator app (e.g. Google Authenticator or 1Password) whenever logging in from untrusted IP ranges or authorizing wire transfers.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Enabled on Authenticator App
            </span>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className="text-xs font-semibold text-rose-300 hover:text-white hover:underline"
            >
              {twoFactorEnabled ? 'Reconfigure' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Passkeys & Biometrics */}
        <div className="bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-950/60 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                FIDO2 Passkeys & Biometrics
              </h3>
              <p className="text-xs text-rose-300/70">
                Touch ID, Face ID & Windows Hello
              </p>
            </div>
          </div>

          <p className="text-xs text-rose-300/80 leading-relaxed">
            Sign in cryptographically without passwords using your device secure enclave and biometric sensor.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> 2 Passkeys Registered
            </span>
            <button
              onClick={() => setPasskeysEnabled(!passkeysEnabled)}
              className="text-xs font-semibold text-rose-300 hover:text-white hover:underline"
            >
              + Add Key
            </button>
          </div>
        </div>
      </div>

      {/* Password & Security Preferences */}
      <div className="bg-[#1C0407] rounded-3xl border border-[#38080E] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#38080E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Password & Security Credentials
              </h2>
              <p className="text-xs text-rose-300/70">
                Manage your master password with Firebase Authentication verification
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#38080E] text-xs">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-white block">Master Account Password</span>
              <span className="text-rose-400/70 text-[11px]">
                {currentUser.lastPasswordChange 
                  ? `Last changed on ${new Date(currentUser.lastPasswordChange).toLocaleDateString()}` 
                  : 'Secured with Firebase Authentication (PBKDF2 / SHA-256)'}
              </span>
            </div>
            <button
              id="open-change-password-modal-btn"
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors self-start sm:self-auto"
            >
              Change Password
            </button>
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Instant Login Alerts</span>
              <span className="text-rose-400/70 text-[11px]">Receive push notification & email for new logins</span>
            </div>
            <input
              type="checkbox"
              checked={loginAlertsEnabled}
              onChange={() => setLoginAlertsEnabled(!loginAlertsEnabled)}
              className="accent-rose-500 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="py-4 flex items-center justify-between">
            <div>
              <span className="font-semibold text-white block">Large Transaction Approvals</span>
              <span className="text-rose-400/70 text-[11px]">Require biometric approval for transfers over $50,000</span>
            </div>
            <input
              type="checkbox"
              checked={biometricEnabled}
              onChange={() => setBiometricEnabled(!biometricEnabled)}
              className="accent-rose-500 w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Active Device Sessions */}
      <div className="bg-[#1C0407] rounded-3xl border border-[#38080E] shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">
              Active Authorized Sessions
            </h2>
            <p className="text-xs text-rose-300/70">
              Devices currently authenticated to your HSBC digital banking portal
            </p>
          </div>

          <button
            onClick={() => setSessions(prev => prev.filter(s => s.current))}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline self-start sm:self-auto"
          >
            Revoke All Other Sessions
          </button>
        </div>

        <div className="divide-y divide-[#38080E]">
          {sessions.map(sess => (
            <div key={sess.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0E0103] border border-[#38080E] flex items-center justify-center text-rose-300">
                  {sess.device.includes('iPhone') ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{sess.device}</span>
                    {sess.current && (
                      <Badge variant="success" className="text-[10px] py-0 px-1.5">
                        Current Session
                      </Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-rose-400/70">
                    {sess.location} • IP {sess.ip} • {sess.lastActive}
                  </span>
                </div>
              </div>

              {!sess.current && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="p-1.5 text-rose-400/60 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
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
          title="Change Account Password"
          description="Enter your current credentials and choose a new password meeting security requirements."
        >
          <ChangePasswordForm onSuccessCallback={() => {
            setTimeout(() => {
              setShowPasswordModal(false);
            }, 1800);
          }} />
        </Modal>
      )}
    </div>
  );
};
