import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  KeyRound,
  Check
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { findUserByEmailOrUsername } from '../../lib/firestoreService';
import { NovaLogo } from '../common/NovaLogo';
import { EmailVerificationStep } from './EmailVerificationStep';

interface AuthGatewayProps {
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({
  initialMode = 'signin',
  onSuccess,
}) => {
  const { login, register } = useBanking();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Sign In State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInError, setSignInError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Sign Up State
  const [signupStage, setSignupStage] = useState<'form' | 'verify' | 'success'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAccountType, setRegAccountType] = useState<'CHECKING' | 'SAVINGS' | 'BUSINESS'>('CHECKING');
  const [regError, setRegError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const generateNewCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');
    setIsSigningIn(true);

    try {
      const res = await login(identifier, password);
      setIsSigningIn(false);
      if (res.success) {
        onSuccess?.();
      } else {
        setSignInError(res.error || 'Invalid credentials. Please check your username and password.');
      }
    } catch (err: any) {
      setIsSigningIn(false);
      setSignInError(err?.message || 'Invalid credentials. Please try again.');
    }
  };

  const handleInitiateSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    
    if (!regFirstName.trim() || !regLastName.trim() || !regEmail.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }

    // Basic email format check
    if (!regEmail.includes('@') || !regEmail.includes('.')) {
      setRegError('Please enter a valid email address.');
      return;
    }

    if (regPassword && regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    setIsRegistering(true);

    try {
      // Check if this email is already registered in Firestore
      const existingUser = await findUserByEmailOrUsername(regEmail.trim().toLowerCase());
      if (existingUser) {
        setIsRegistering(false);
        setRegError('An account with this email address already exists. Please sign in instead.');
        return;
      }
    } catch (err) {
      console.warn('Pre-check error:', err);
    }

    setTimeout(() => {
      const code = generateNewCode();
      setVerificationCode(code);
      setVerifyError('');
      setIsRegistering(false);
      setSignupStage('verify');
    }, 300);
  };

  const handleResendCode = () => {
    const code = generateNewCode();
    setVerificationCode(code);
    setVerifyError('');
  };

  const handleVerifyCode = async (enteredCode: string) => {
    setVerifyError('');
    if (enteredCode !== verificationCode) {
      setVerifyError('Incorrect verification code. Please check your email and try again.');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await register({
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        email: regEmail.trim(),
        username: regUsername.trim() || regEmail.split('@')[0],
        password: regPassword || 'Password123!',
        accountType: regAccountType,
      });

      setIsVerifying(false);

      if (res.success) {
        setSignupStage('success');
        setTimeout(() => {
          onSuccess?.();
        }, 1200);
      } else {
        setVerifyError(res.error || 'Failed to complete registration.');
      }
    } catch (err: any) {
      setIsVerifying(false);
      setVerifyError(err?.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#140204] text-[#FFF1F2] flex flex-col justify-between selection:bg-rose-500 selection:text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-rose-900/20 via-rose-950/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-rose-600/10 blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-600/10 blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Top Header */}
      <header className="border-b border-[#38080E] bg-[#0E0103]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NovaLogo size="md" />
          </div>
          <div className="flex items-center gap-2 text-xs text-rose-300/80 bg-[#1C0407] px-3 py-1.5 rounded-full border border-[#38080E]">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-medium hidden xs:inline">Secure 256-Bit SSL Encrypted</span>
            <span className="text-[11px] font-medium xs:hidden">Secure SSL</span>
          </div>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-[#1C0407]/90 border border-[#38080E] rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Safe Browsing Demo Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs flex items-start gap-2.5 text-left">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-amber-200">Interactive Portfolio Demonstration</div>
              <div className="text-[11px] text-amber-300/80 leading-relaxed">
                This portal is an interactive simulation and does not collect real banking credentials, passwords, or personal data. Use demo accounts or sample values.
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#0E0103] rounded-2xl border border-[#38080E]">
            <button
              id="tab-sign-in"
              type="button"
              onClick={() => {
                setMode('signin');
                setSignInError('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                mode === 'signin'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-300/70 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Sign In
            </button>
            <button
              id="tab-sign-up"
              type="button"
              onClick={() => {
                setMode('signup');
                setRegError('');
              }}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                mode === 'signup'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-rose-300/70 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Open Account (Sign Up)
            </button>
          </div>

          {/* SIGN IN VIEW */}
          {mode === 'signin' && (
            <div className="space-y-5">
              <div className="text-left space-y-1">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Welcome to Nova Demo Banking
                </h1>
                <p className="text-xs text-rose-300/70 leading-relaxed">
                  Enter test credentials to explore the customer dashboard simulation.
                </p>
              </div>

              {/* Quick autofill helper */}
              <button
                type="button"
                onClick={() => {
                  setIdentifier('gregorio.lind@example.com');
                  setPassword('Password123!');
                }}
                className="w-full py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 font-bold text-xs rounded-xl transition-colors border border-amber-500/30 flex items-center justify-center gap-1.5"
              >
                <span>Fill Demo Credentials (Gregorio Lind)</span>
              </button>

              {signInError && (
                <div className="p-3 rounded-xl bg-rose-950/80 text-rose-300 border border-rose-800/80 flex items-center gap-2 text-xs animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{signInError}</span>
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="block font-bold text-rose-200 text-xs">
                    Demo Username or Email Address
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-rose-400/60" />
                    <input
                      id="signin-identifier"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="e.g. gregoriolind or name@example.com"
                      required
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-rose-200 text-xs">
                      Demo Password
                    </label>
                    <span className="text-[10px] text-rose-400/60 font-mono">Demo Session</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-rose-400/60" />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter demo password"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs transition-colors"
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
                  id="btn-submit-signin"
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
                >
                  {isSigningIn ? (
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
              </form>

              <div className="pt-2 text-center text-xs text-rose-300/70">
                Don't have an account yet?{' '}
                <button
                  id="link-switch-to-signup"
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setRegError('');
                  }}
                  className="font-bold text-rose-200 hover:text-white underline underline-offset-2 ml-1"
                >
                  Open Demo Account
                </button>
              </div>
            </div>
          )}

          {/* SIGN UP / REGISTER VIEW */}
          {mode === 'signup' && (
            <div className="space-y-5">
              {signupStage === 'success' ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">
                      Demo Account Provisioned Successfully!
                    </h3>
                    <p className="text-xs text-rose-300/70 max-w-xs mx-auto">
                      Demo identity verified, $10,000 opening test credit applied. Entering simulated banking portal...
                    </p>
                  </div>
                </div>
              ) : signupStage === 'verify' ? (
                <EmailVerificationStep
                  email={regEmail}
                  generatedCode={verificationCode}
                  onVerify={handleVerifyCode}
                  onResend={handleResendCode}
                  onChangeEmail={() => setSignupStage('form')}
                  onSwitchToSignIn={() => {
                    setIdentifier(regEmail);
                    if (regPassword) setPassword(regPassword);
                    setMode('signin');
                    setSignupStage('form');
                    setSignInError('');
                  }}
                  isLoading={isVerifying}
                  error={verifyError}
                  isDarkMode={true}
                />
              ) : (
                <>
                  <div className="text-left space-y-1">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                      Open a Nova Demo Account
                    </h1>
                    <p className="text-xs text-rose-300/70 leading-relaxed">
                      Interactive digital onboarding with simulated email verification and test balance.
                    </p>
                  </div>

                  {regError && (
                    <div className="p-3.5 rounded-xl bg-rose-950/90 text-rose-200 border border-rose-700/80 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="flex-1 leading-relaxed">{regError}</span>
                      </div>
                      {(regError.toLowerCase().includes('already exists') || regError.toLowerCase().includes('already in use')) && (
                        <div className="pt-1.5 border-t border-rose-800/60 flex items-center justify-between">
                          <span className="text-[11px] text-rose-300">Have an account?</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIdentifier(regEmail);
                              if (regPassword) setPassword(regPassword);
                              setMode('signin');
                              setRegError('');
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <span>Sign In Instead</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <form onSubmit={handleInitiateSignUp} className="space-y-3.5 text-left">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-rose-200 text-xs">
                          First Name *
                        </label>
                        <input
                          id="signup-firstname"
                          type="text"
                          required
                          placeholder="e.g. Julian"
                          value={regFirstName}
                          onChange={e => setRegFirstName(e.target.value)}
                          className="w-full p-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-rose-200 text-xs">
                          Last Name *
                        </label>
                        <input
                          id="signup-lastname"
                          type="text"
                          required
                          placeholder="e.g. Thorne"
                          value={regLastName}
                          onChange={e => setRegLastName(e.target.value)}
                          className="w-full p-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-rose-200 text-xs">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-3 text-rose-400/60" />
                        <input
                          id="signup-email"
                          type="email"
                          required
                          placeholder="julian.thorne@example.com"
                          value={regEmail}
                          onChange={e => setRegEmail(e.target.value)}
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          className="w-full pl-9 pr-4 py-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
                        />
                      </div>
                      <span className="text-[10px] text-rose-400/60">A 6-digit verification code will be sent to this email.</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-rose-200 text-xs">
                          Username
                        </label>
                        <input
                          id="signup-username"
                          type="text"
                          placeholder="e.g. julianthorne"
                          value={regUsername}
                          onChange={e => setRegUsername(e.target.value)}
                          autoCapitalize="none"
                          autoCorrect="off"
                          spellCheck={false}
                          className="w-full p-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-rose-200 text-xs">
                          Password
                        </label>
                        <input
                          id="signup-password"
                          type="password"
                          placeholder="Min. 8 characters"
                          value={regPassword}
                          onChange={e => setRegPassword(e.target.value)}
                          className="w-full p-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block font-bold text-rose-200 text-xs">
                        Primary Account Type
                      </label>
                      <select
                        id="signup-account-type"
                        value={regAccountType}
                        onChange={e => setRegAccountType(e.target.value as any)}
                        className="w-full p-2.5 bg-[#0E0103] border border-[#38080E] rounded-xl text-white focus:outline-none focus:border-rose-500 text-xs"
                      >
                        <option value="CHECKING">Nova Premier Checking (Demo - $0 Fee + $10,000 Opening Credit)</option>
                        <option value="SAVINGS">High-Yield Reserve Savings (Demo 4.75% APY)</option>
                        <option value="BUSINESS">Commercial Executive Vault (Demo)</option>
                      </select>
                    </div>

                    <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 flex items-center gap-2 text-emerald-300 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Two-step email OTP verification with $10,000 opening demo balance.</span>
                    </div>

                    <button
                      id="btn-submit-signup"
                      type="submit"
                      disabled={isRegistering}
                      className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
                    >
                      {isRegistering ? (
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
                  </form>

                  <div className="pt-2 text-center text-xs text-rose-300/70">
                    Already registered with Nova Demo?{' '}
                    <button
                      id="link-switch-to-signin"
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setSignInError('');
                        setSignupStage('form');
                      }}
                      className="font-bold text-rose-200 hover:text-white underline underline-offset-2 ml-1"
                    >
                      Sign In
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Credentials */}
      <footer className="border-t border-[#38080E] bg-[#0E0103]/80 px-6 py-4 text-center text-xs text-rose-400/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Nova Digital Banking • Interactive Demonstration Sandbox</span>
          <span>Simulation Showcase • No Real Financial Services</span>
        </div>
      </footer>
    </div>
  );
};
