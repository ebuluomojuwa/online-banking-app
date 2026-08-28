import React, { useState, useMemo } from 'react';
import { 
  SendHorizontal, 
  ArrowLeftRight, 
  Globe2, 
  Building, 
  CheckCircle2, 
  Sparkles, 
  UserPlus, 
  ShieldCheck, 
  AlertCircle,
  FileDown,
  RefreshCw,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBanking } from '../../context/BankingContext';
import { Badge, Modal } from '../ui';

export const TransfersView: React.FC = () => {
  const { 
    currentUser, 
    accounts, 
    beneficiaries, 
    transferFunds, 
    addBeneficiary, 
    hideBalances 
  } = useBanking();

  const userAccounts = useMemo(() => {
    return accounts.filter(a => a.userId === currentUser.id && a.type !== 'CREDIT');
  }, [accounts, currentUser.id]);

  const [transferType, setTransferType] = useState<'INTERNAL' | 'OTHER_CUSTOMER' | 'DOMESTIC_WIRE' | 'INTERNATIONAL_SWIFT'>('INTERNAL');
  
  // Form fields
  const [fromAccountId, setFromAccountId] = useState(userAccounts[0]?.id || '');
  const [toInternalAccountId, setToInternalAccountId] = useState(userAccounts[1]?.id || '');
  const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [customAccountNumber, setCustomAccountNumber] = useState('');
  const [customRoutingOrSwift, setCustomRoutingOrSwift] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [reference, setReference] = useState('');
  const [note, setNote] = useState('');
  const [frequency, setFrequency] = useState<'ONE_TIME' | 'WEEKLY' | 'MONTHLY'>('ONE_TIME');

  // Multi-step modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transferSuccessData, setTransferSuccessData] = useState<{
    txId: string;
    fromAccountName: string;
    toAccountName: string;
    amount: number;
    reference: string;
    date: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Selected source account object
  const selectedSourceAccount = useMemo(() => {
    return accounts.find(a => a.id === fromAccountId) || userAccounts[0];
  }, [accounts, fromAccountId, userAccounts]);

  const numAmount = parseFloat(amount) || 0;

  // Determine recipient display name and account
  const recipientSummary = useMemo(() => {
    if (transferType === 'INTERNAL') {
      const dest = accounts.find(a => a.id === toInternalAccountId);
      return {
        name: dest ? `${dest.name} (Your Account)` : 'Internal Account',
        account: dest ? `**${dest.accountNumber}` : '---',
      };
    } else if (selectedBeneficiaryId) {
      const ben = beneficiaries.find(b => b.id === selectedBeneficiaryId);
      return {
        name: ben ? ben.name : 'Selected Payee',
        account: ben ? `${ben.bankName} (**${ben.accountNumber.slice(-4)})` : '---',
      };
    } else {
      return {
        name: customRecipientName || 'Recipient',
        account: customAccountNumber ? `**${customAccountNumber.slice(-4)}` : 'External Bank',
      };
    }
  }, [transferType, toInternalAccountId, selectedBeneficiaryId, customRecipientName, customAccountNumber, accounts, beneficiaries]);

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedSourceAccount) {
      setErrorMessage('Please select a source account');
      return;
    }
    if (numAmount <= 0) {
      setErrorMessage('Transfer amount must be greater than $0.00');
      return;
    }
    if (selectedSourceAccount.availableBalance < numAmount) {
      setErrorMessage(`Insufficient funds in source account. Available: $${selectedSourceAccount.availableBalance.toFixed(2)}`);
      return;
    }
    if (transferType === 'INTERNAL' && fromAccountId === toInternalAccountId) {
      setErrorMessage('Source and destination accounts must be different');
      return;
    }
    if (transferType !== 'INTERNAL' && !selectedBeneficiaryId && !customRecipientName.trim()) {
      setErrorMessage('Please select or specify a recipient');
      return;
    }

    setShowReviewModal(true);
  };

  const handleConfirmTransfer = async () => {
    setIsSubmitting(true);
    try {
      const generatedRef = reference.trim() || `TRF-HSBC-${Date.now().toString().slice(-6)}`;
      const result = await transferFunds({
        fromAccountId: selectedSourceAccount.id,
        recipientName: recipientSummary.name,
        recipientAccount: transferType === 'INTERNAL' ? toInternalAccountId : (customAccountNumber || '7291'),
        amount: numAmount,
        transferType,
        reference: generatedRef,
        note: note.trim() || undefined,
      });

      if (result.success && result.transactionId) {
        setShowReviewModal(false);
        setTransferSuccessData({
          txId: result.transactionId,
          fromAccountName: `${selectedSourceAccount.name} (**${selectedSourceAccount.accountNumber})`,
          toAccountName: recipientSummary.name,
          amount: numAmount,
          reference: generatedRef,
          date: new Date().toISOString(),
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Reset form
        setAmount('');
        setReference('');
        setNote('');
      } else {
        setErrorMessage(result.error || 'Transfer failed');
        setShowReviewModal(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Transfer Funds
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Instant zero-fee internal transfers, interbank ACH, and international SWIFT routing
        </p>
      </div>

      {/* Transfer Category Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'INTERNAL', label: 'Between My Accounts', icon: ArrowLeftRight, desc: 'Instant & Free' },
          { id: 'OTHER_CUSTOMER', label: 'HSBC Customer', icon: SendHorizontal, desc: 'Direct Peer Routing' },
          { id: 'DOMESTIC_WIRE', label: 'External ACH / Wire', icon: Building, desc: '1-2 Business Days' },
          { id: 'INTERNATIONAL_SWIFT', label: 'SWIFT International', icon: Globe2, desc: 'Global Currencies' },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = transferType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setTransferType(tab.id as any);
                setErrorMessage('');
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'border-zinc-950 dark:border-white bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-white dark:text-zinc-950' : 'text-zinc-400'}`} />
              <div className="font-semibold text-xs">{tab.label}</div>
              <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`}>
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Transfer Form Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleOpenReview} className="space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Account */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Source Account
              </label>
              <select
                value={fromAccountId}
                onChange={e => setFromAccountId(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
              >
                {userAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (**{acc.accountNumber}) — Available: ${acc.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
              {selectedSourceAccount && (
                <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1">
                  <span>Available Balance:</span>
                  <strong className="text-zinc-800 dark:text-zinc-200">
                    {hideBalances ? '••••••' : `$${selectedSourceAccount.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </strong>
                </div>
              )}
            </div>

            {/* Destination Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Destination Recipient
              </label>

              {transferType === 'INTERNAL' ? (
                <select
                  value={toInternalAccountId}
                  onChange={e => setToInternalAccountId(e.target.value)}
                  className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                >
                  {userAccounts.filter(a => a.id !== fromAccountId).map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (**{acc.accountNumber}) — Current: ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-3">
                  {/* Saved Beneficiaries Quick Dropdown */}
                  <select
                    value={selectedBeneficiaryId}
                    onChange={e => {
                      setSelectedBeneficiaryId(e.target.value);
                      if (e.target.value) {
                        const ben = beneficiaries.find(b => b.id === e.target.value);
                        if (ben) {
                          setCustomRecipientName(ben.name);
                          setCustomAccountNumber(ben.accountNumber);
                          setCustomRoutingOrSwift(ben.routingOrSwift);
                        }
                      }
                    }}
                    className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white font-medium focus:outline-none"
                  >
                    <option value="">-- Choose from Saved Beneficiaries or Enter New --</option>
                    {beneficiaries.map(ben => (
                      <option key={ben.id} value={ben.id}>
                        {ben.name} ({ben.nickname}) - {ben.bankName}
                      </option>
                    ))}
                  </select>

                  {!selectedBeneficiaryId && (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        placeholder="Recipient Full Name"
                        value={customRecipientName}
                        onChange={e => setCustomRecipientName(e.target.value)}
                        className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder={transferType === 'INTERNATIONAL_SWIFT' ? 'IBAN Account Identifier' : 'Account Number'}
                        value={customAccountNumber}
                        onChange={e => setCustomAccountNumber(e.target.value)}
                        className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder={transferType === 'INTERNATIONAL_SWIFT' ? 'SWIFT / BIC Code (e.g. BNPAFR21)' : 'ACH Routing Number (9 digits)'}
                        value={customRoutingOrSwift}
                        onChange={e => setCustomRoutingOrSwift(e.target.value)}
                        className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Amount & Currency */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Transfer Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-lg font-bold text-zinc-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-lg font-bold rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {[100, 500, 1000, 2500, 5000].map(val => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as any)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white font-medium focus:outline-none"
              >
                <option value="ONE_TIME">One-time Instant</option>
                <option value="WEEKLY">Weekly Recurring</option>
                <option value="MONTHLY">Monthly Recurring</option>
              </select>
            </div>
          </div>

          {/* Reference & Memo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Payment Reference / Memo
              </label>
              <input
                type="text"
                placeholder="e.g. Invoice #8819 or Gift"
                value={reference}
                onChange={e => setReference(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Internal Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="Personal record memo"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full p-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Fee & Exchange Rate Breakdown Note */}
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Simulated Prototype Transfer Fee:</span>
            </div>
            <strong className="text-emerald-600 dark:text-emerald-400 font-bold">$0.00 (HSBC Zero-Fee Tier)</strong>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md flex items-center gap-2"
            >
              <SendHorizontal className="w-4 h-4" /> Review Transfer Details
            </button>
          </div>
        </form>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <Modal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          title="Review Transfer"
          description="Please verify the transfer details before final submission."
        >
          <div className="space-y-6">
            <div className="bg-zinc-50 dark:bg-zinc-800/60 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-700 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700">
                <span className="text-zinc-500">From Account:</span>
                <strong className="text-zinc-900 dark:text-white">
                  {selectedSourceAccount.name} (**{selectedSourceAccount.accountNumber})
                </strong>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700">
                <span className="text-zinc-500">To Recipient:</span>
                <strong className="text-zinc-900 dark:text-white">
                  {recipientSummary.name}
                </strong>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700">
                <span className="text-zinc-500">Transfer Type:</span>
                <Badge variant="neutral">{transferType}</Badge>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700">
                <span className="text-zinc-500">Transfer Amount:</span>
                <strong className="text-base text-zinc-900 dark:text-white font-bold">
                  ${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </strong>
              </div>

              <div className="flex justify-between py-1 border-b border-zinc-200/60 dark:border-zinc-700">
                <span className="text-zinc-500">Processing Fee:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">$0.00</strong>
              </div>

              <div className="flex justify-between pt-1 font-bold text-sm">
                <span className="text-zinc-900 dark:text-white">Total Deducted:</span>
                <span className="text-zinc-900 dark:text-white">
                  ${numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-[11px] text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
              ⚡ Fictional Prototype Mode: Simulated balances will update immediately in your dashboard.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel & Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmTransfer}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Confirm Transfer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Transfer Success Confirmation Modal */}
      {transferSuccessData && (
        <Modal
          isOpen={!!transferSuccessData}
          onClose={() => setTransferSuccessData(null)}
          title="Transfer Executed Successfully"
          description="Your simulated transaction has posted and balances have been adjusted."
        >
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                ${transferSuccessData.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                Sent to <strong className="text-zinc-800 dark:text-zinc-200">{transferSuccessData.toAccountName}</strong>
              </p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl text-left text-xs space-y-2 border border-zinc-200/80 dark:border-zinc-700">
              <div className="flex justify-between">
                <span className="text-zinc-400">Reference Number:</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">{transferSuccessData.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">From Account:</span>
                <span className="text-zinc-900 dark:text-white">{transferSuccessData.fromAccountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Timestamp:</span>
                <span className="text-zinc-900 dark:text-white">{new Date(transferSuccessData.date).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setTransferSuccessData(null)}
                className="px-6 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
