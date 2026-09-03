import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Lock, 
  Globe, 
  Zap, 
  Building2, 
  CheckCircle2, 
  Smartphone,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { NovaLogo } from '../common/NovaLogo';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onEnterDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin, onOpenRegister, onEnterDemo }) => {
  // Public APY Growth Calculator state
  const [calcDeposit, setCalcDeposit] = useState(25000);
  const [calcYears, setCalcYears] = useState(3);
  const apyRate = 0.0475;

  const futureValue = calcDeposit * Math.pow(1 + apyRate / 12, calcYears * 12);
  const interestEarned = futureValue - calcDeposit;

  return (
    <div className="min-h-screen bg-[#140204] text-[#FFF1F2] transition-colors">
      {/* Public Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0E0103]/90 backdrop-blur-md border-b border-[#38080E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NovaLogo size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-semibold text-rose-200 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onOpenRegister}
              className="px-4 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-xs hover:bg-rose-600 transition-all flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-500/15 via-amber-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C0407] border border-[#38080E] text-xs font-medium text-rose-200 shadow-2xs animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="tracking-wide text-xs">Next-Generation Private Digital Banking</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Banking, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-rose-400">
                beautifully simple.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-rose-200/80 max-w-2xl mx-auto font-normal leading-relaxed">
              Experience the pinnacle of international financial technology. High-yield liquidity, instant cross-border routing, and zero-liability security in one unified portal.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onEnterDemo}
              className="px-7 py-3.5 rounded-2xl bg-rose-500 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:bg-rose-600 transition-all flex items-center gap-2"
            >
              Launch Customer Portal <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenRegister}
              className="px-7 py-3.5 rounded-2xl bg-[#200508] border border-[#38080E] text-white text-sm font-semibold hover:bg-[#2B070B] shadow-xs transition-all"
            >
              Open New Account
            </button>
          </div>

          {/* Key Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-[#38080E] text-left">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">4.75%</span>
              <span className="text-xs text-rose-300/70 block mt-0.5">High-Yield APY Compounding</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">$0.00</span>
              <span className="text-xs text-rose-300/70 block mt-0.5">Account Maintenance Fees</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">&lt; 1 Sec</span>
              <span className="text-xs text-rose-300/70 block mt-0.5">Instant Peer Clearing</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-white">FIDO2</span>
              <span className="text-xs text-rose-300/70 block mt-0.5">Passkey Hardware Auth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="py-20 bg-[#1A0306] border-y border-[#38080E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Institutional Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Engineered for absolute clarity and control
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#200508] border border-[#38080E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Automated Wealth Vaults</h3>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                Set milestones for major life purchases. Ring-fence liquidity and earn compound interest without lockup penalties.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#200508] border border-[#38080E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Nova Premier Cards</h3>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                Precision-milled physical cards and disposable virtual card numbers with instant in-app freeze controls and NFC toggles.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#200508] border border-[#38080E] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Zero-Interchange Global Wire</h3>
              <p className="text-xs text-rose-300/80 leading-relaxed">
                Send ACH, domestic Fedwire, and SWIFT international payments directly at real interbank exchange rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Interactive APY Calculator */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#200508] via-[#160305] to-[#200508] text-white p-8 sm:p-12 rounded-3xl border border-[#38080E] shadow-2xl space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" /> High-Yield APY Calculator
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Calculate your wealth accumulation
            </h2>
            <p className="text-xs text-rose-300/70">
              See how your reserves grow with Nova's 4.75% APY compounding rate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-rose-300/70">Initial Deposit:</span>
                  <strong className="text-white text-sm font-mono">${calcDeposit.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="200000"
                  step="1000"
                  value={calcDeposit}
                  onChange={e => setCalcDeposit(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-rose-300/70">Investment Horizon:</span>
                  <strong className="text-white text-sm font-mono">{calcYears} Years</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={calcYears}
                  onChange={e => setCalcYears(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Projection Box */}
            <div className="bg-[#140204] p-6 rounded-2xl border border-[#38080E] space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-300/70 tracking-wider block">
                  Projected Balance in {calcYears} Years
                </span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                  ${futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="flex justify-between text-xs pt-3 border-t border-[#38080E] text-rose-300/70">
                <span>Estimated Total Interest Earned:</span>
                <strong className="text-white font-mono">+${interestEarned.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>

              <button
                onClick={onEnterDemo}
                className="w-full py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-colors shadow-xs"
              >
                Open High-Yield Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E0103] border-t border-[#38080E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <NovaLogo size="sm" />
            <p className="text-xs text-rose-300/70">
              Next-Generation Digital Banking & Wealth Management
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#38080E] text-[11px] text-rose-300/60">
            <p>© {new Date().getFullYear()} Nova Financial Technologies. Member FDIC. Equal Housing Lender.</p>
            <p>Investment products are not FDIC insured • May lose value • No bank guarantee.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
