import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Sliders, 
  ShieldCheck, 
  Globe2, 
  Wifi, 
  ShoppingCart, 
  Eye, 
  EyeOff, 
  Plus, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Card } from '../../types';
import { Badge, Modal } from '../ui';

export const CardsView: React.FC = () => {
  const { cards, currentUser, toggleFreezeCard, updateCardLimits, replaceCard } = useBanking();
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [showCvv, setShowCvv] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [cardToReplace, setCardToReplace] = useState<Card | null>(null);

  const userCards = cards.filter(c => c.userId === currentUser.id);
  const activeCard = userCards.find(c => c.id === selectedCardId) || userCards[0];

  const handleToggleControl = (controlKey: keyof Card['controls']) => {
    if (!activeCard) return;
    const newControls = {
      ...activeCard.controls,
      [controlKey]: !activeCard.controls[controlKey],
    };
    updateCardLimits(activeCard.id, activeCard.spendingLimit, newControls);
  };

  const handleLimitChange = (newLimit: number) => {
    if (!activeCard) return;
    updateCardLimits(activeCard.id, newLimit, activeCard.controls);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Cards & Security Controls
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your physical metal cards, digital tokens, and instant virtual security toggles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> Zero Liability Protection
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Visual Card Display */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card Selector Tabs */}
          <div className="flex gap-2 p-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl">
            {userCards.map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCardId(c.id);
                  setShowCvv(false);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  (activeCard?.id === c.id)
                    ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {c.tier.replace('Nova ', '')}
              </button>
            ))}
          </div>

          {/* Realistic Visual Card Container */}
          {activeCard && (
            <div className="relative">
              <div
                className={`relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 shadow-2xl text-white overflow-hidden transition-all duration-300 flex flex-col justify-between border ${
                  activeCard.colorTheme === 'black'
                    ? 'bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-zinc-700/60 shadow-zinc-950/40'
                    : activeCard.colorTheme === 'navy'
                    ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 border-blue-800/50 shadow-blue-950/40'
                    : 'bg-gradient-to-br from-zinc-800 via-neutral-900 to-zinc-950 border-zinc-600/50 shadow-zinc-900/30'
                }`}
              >
                {/* Subtle Card Texture Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_70%)] pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none" />

                {/* Card Top: Chip, Contactless & Logo */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {/* Metallic Chip */}
                    <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-0.5 border border-amber-300 shadow-inner flex flex-col justify-around px-1.5">
                      <div className="h-px bg-amber-800/40 w-full" />
                      <div className="h-px bg-amber-800/40 w-full" />
                    </div>
                    {/* Contactless Wifi Icon */}
                    <Wifi className="w-5 h-5 text-zinc-300/80 rotate-90" />
                  </div>

                  <div className="text-right">
                    <span className="font-serif font-black tracking-tighter text-xl">NOVA</span>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-400 -mt-1 font-sans">
                      {activeCard.tier}
                    </span>
                  </div>
                </div>

                {/* Card Number */}
                <div className="relative z-10 my-auto">
                  <div className="font-mono text-lg sm:text-xl font-medium tracking-[0.22em] drop-shadow-sm">
                    {activeCard.cardNumber}
                  </div>
                </div>

                {/* Card Bottom: Holder, Expiry, CVV */}
                <div className="flex items-end justify-between relative z-10 text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-400 block">Cardholder</span>
                    <span className="font-medium tracking-wider uppercase text-sm drop-shadow-xs">
                      {activeCard.cardholderName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-zinc-400 block">Expires</span>
                      <span className="font-mono text-xs font-semibold">
                        {activeCard.expiryMonth}/{activeCard.expiryYear}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-zinc-400 block">CVV</span>
                      <button
                        type="button"
                        onClick={() => setShowCvv(prev => !prev)}
                        className="font-mono text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
                      >
                        {showCvv ? activeCard.cvv : '•••'}
                        {showCvv ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Frozen Overlay if Card is Frozen */}
                {activeCard.status === 'FROZEN' && (
                  <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-xs flex flex-col items-center justify-center z-20 animate-in fade-in">
                    <Lock className="w-10 h-10 text-amber-400 mb-2" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">Card Temporarily Frozen</span>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-[200px] text-center">
                      Transactions will be declined until unfrozen.
                    </p>
                  </div>
                )}
              </div>

              {/* Card Action Buttons Below Card */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => toggleFreezeCard(activeCard.id)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                    activeCard.status === 'FROZEN'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200'
                  }`}
                >
                  {activeCard.status === 'FROZEN' ? (
                    <>
                      <Unlock className="w-4 h-4" /> Unfreeze Card
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Freeze Card
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setCardToReplace(activeCard);
                    setShowReplaceModal(true);
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" /> Replace Card
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Limits & Security Toggle Controls */}
        {activeCard && (
          <div className="lg:col-span-7 space-y-6">
            {/* Spending Limit Slider Card */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Monthly Spending Limit
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Real-time transaction control ceiling
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">
                    ${activeCard.spendingLimit.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-zinc-400 block">Limit / Month</span>
                </div>
              </div>

              {/* Progress bar of current spend */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">Spent this cycle: ${activeCard.monthlySpent.toLocaleString()}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {((activeCard.monthlySpent / activeCard.spendingLimit) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (activeCard.monthlySpent / activeCard.spendingLimit) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Limit Slider */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Adjust Limit:
                </label>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={activeCard.spendingLimit}
                  onChange={e => handleLimitChange(Number(e.target.value))}
                  className="w-full accent-zinc-900 dark:accent-white cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>$500</span>
                  <span>$10,000</span>
                  <span>$25,000</span>
                </div>
              </div>
            </div>

            {/* Feature Security Toggles */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Transaction Security Toggles
              </h3>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {/* Online Payments */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                        Online E-Commerce & Subscriptions
                      </span>
                      <span className="text-[11px] text-zinc-500">Allow web card charges and recurrent tokens</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeCard.controls.onlinePayments}
                    onChange={() => handleToggleControl('onlinePayments')}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Contactless */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                        Contactless Point-of-Sale (NFC)
                      </span>
                      <span className="text-[11px] text-zinc-500">Tap-to-pay at in-person terminal readers</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeCard.controls.contactless}
                    onChange={() => handleToggleControl('contactless')}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* International Usage */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                        International & Overseas Charges
                      </span>
                      <span className="text-[11px] text-zinc-500">Permit foreign currency transactions abroad</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeCard.controls.internationalUsage}
                    onChange={() => handleToggleControl('internationalUsage')}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* ATM Cash Withdrawals */}
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                        ATM Cash Withdrawals
                      </span>
                      <span className="text-[11px] text-zinc-500">Enable physical cash dispensers with PIN</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activeCard.controls.atmWithdrawals}
                    onChange={() => handleToggleControl('atmWithdrawals')}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Replace Card Modal */}
      {showReplaceModal && cardToReplace && (
        <Modal
          isOpen={showReplaceModal}
          onClose={() => setShowReplaceModal(false)}
          title="Order Card Replacement"
          description="A new card number and CVV will be generated immediately for security."
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Card to Replace:</span>
                <strong className="text-zinc-900 dark:text-white">{cardToReplace.tier} ({cardToReplace.cardNumber})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Delivery Method:</span>
                <span className="text-zinc-900 dark:text-white font-medium">FedEx Priority (2 Business Days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Replacement Fee:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">$0.00 (Nova Complimentary)</strong>
              </div>
            </div>

            <p className="text-zinc-500">
              Your digital wallet token (Apple Pay / Google Wallet) will remain functional while your physical card is manufactured.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReplaceModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  replaceCard(cardToReplace.id);
                  setShowReplaceModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold"
              >
                Confirm Replacement
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
