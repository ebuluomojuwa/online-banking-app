import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Zap, 
  Wifi, 
  Droplet, 
  ShieldCheck, 
  Sparkles,
  AlertCircle,
  Building,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBanking } from '../../context/BankingContext';
import { BillPayment } from '../../types';
import { Badge, Modal } from '../ui';

export const BillPaymentsView: React.FC = () => {
  const { bills, accounts, currentUser, payBill, addBill, toggleAutoPay, hideBalances } = useBanking();

  const [selectedBillForPay, setSelectedBillForPay] = useState<BillPayment | null>(null);
  const [payAccountId, setPayAccountId] = useState(accounts[0]?.id || '');
  const [showAddBillerModal, setShowAddBillerModal] = useState(false);

  // New Biller Form State
  const [newBillerName, setNewBillerName] = useState('');
  const [newCategory, setNewCategory] = useState<BillPayment['billerCategory']>('Electricity');
  const [newAccountNum, setNewAccountNum] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-09-15');

  const [payError, setPayError] = useState('');
  const [paySuccess, setPaySuccess] = useState('');

  const userBills = bills.filter(b => b.userId === currentUser.id);
  const unpaidBills = userBills.filter(b => b.status === 'UNPAID' || b.status === 'OVERDUE');
  const totalDue = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const getBillerIcon = (category: string) => {
    switch (category) {
      case 'Utilities': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Telecom': return <Wifi className="w-5 h-5 text-blue-500" />;
      case 'Water': return <Droplet className="w-5 h-5 text-cyan-500" />;
      case 'Insurance': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      default: return <Receipt className="w-5 h-5 text-purple-500" />;
    }
  };

  const handlePayBill = (e: React.FormEvent) => {
    e.preventDefault();
    setPayError('');
    if (!selectedBillForPay) return;

    const sourceAcc = accounts.find(a => a.id === payAccountId);
    if (!sourceAcc || sourceAcc.availableBalance < selectedBillForPay.amount) {
      setPayError('Insufficient funds in the selected payment account.');
      return;
    }

    payBill(selectedBillForPay.id, payAccountId);
    setPaySuccess(`Payment of $${selectedBillForPay.amount.toFixed(2)} to ${selectedBillForPay.billerName} posted!`);
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setSelectedBillForPay(null);
      setPaySuccess('');
    }, 1500);
  };

  const handleAddBiller = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount);
    if (!newBillerName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return;

    addBill({
      billerName: newBillerName.trim(),
      category: newCategory,
      accountNumber: newAccountNum.trim() || '8839210',
      amount: parsedAmount,
      dueDate: newDueDate,
      autoPay: false,
    });

    setShowAddBillerModal(false);
    setNewBillerName('');
    setNewAmount('');
    setNewAccountNum('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Bills & Payees
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage scheduled payments, electronic billing feeds, and automated debits
          </p>
        </div>

        <button
          onClick={() => setShowAddBillerModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Biller
        </button>
      </div>

      {/* Hero Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Unpaid Bills</span>
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
              {hideBalances ? '••••••' : `$${totalDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            </div>
          </div>
          <div className="mt-4 text-xs text-zinc-500">
            {unpaidBills.length} payments due in the next 30 days
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">AutoPay Enrollment</span>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {userBills.filter(b => b.autoPay).length} of {userBills.length}
            </div>
          </div>
          <div className="mt-4 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Protected against late fees & credit impacts
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Electronic Interchange</span>
            <div className="text-sm font-bold text-zinc-900 dark:text-white mt-2">
              Next-Day Clearing Protocol
            </div>
          </div>
          <div className="mt-4 text-xs text-zinc-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Guaranteed On-Time Delivery
          </div>
        </div>
      </div>

      {/* Bills Table / Cards */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">
          Active Payees & Scheduled Statements
        </h2>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {userBills.map(bill => (
            <div
              key={bill.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 px-3 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                  {getBillerIcon(bill.category)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{bill.billerName}</h3>
                    <Badge variant={bill.status === 'PAID' ? 'success' : bill.status === 'OVERDUE' ? 'destructive' : 'warning'}>
                      {bill.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span>Acct: **{bill.accountNumber}</span>
                    <span>•</span>
                    <span>Due: {new Date(bill.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right">
                  <div className="text-base font-bold text-zinc-900 dark:text-white">
                    ${bill.amount.toFixed(2)}
                  </div>
                  {/* AutoPay Toggle */}
                  <label className="flex items-center gap-1.5 text-[11px] text-zinc-500 cursor-pointer mt-0.5 justify-end">
                    <input
                      type="checkbox"
                      checked={bill.autoPay}
                      onChange={() => toggleAutoPay(bill.id)}
                      className="accent-emerald-600 rounded"
                    />
                    <span>AutoPay</span>
                  </label>
                </div>

                {bill.status !== 'PAID' ? (
                  <button
                    onClick={() => setSelectedBillForPay(bill)}
                    className="px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
                  >
                    Pay Now
                  </button>
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Settled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Bill Modal */}
      {selectedBillForPay && (
        <Modal
          isOpen={!!selectedBillForPay}
          onClose={() => setSelectedBillForPay(null)}
          title={`Pay ${selectedBillForPay.billerName}`}
          description={`Statement Amount: $${selectedBillForPay.amount.toFixed(2)}`}
        >
          <form onSubmit={handlePayBill} className="space-y-4 text-xs">
            {payError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {payError}
              </div>
            )}
            {paySuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold">{paySuccess}</span>
              </div>
            )}

            {!paySuccess && (
              <>
                <div className="space-y-1.5">
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300">Payment Account</label>
                  <select
                    value={payAccountId}
                    onChange={e => setPayAccountId(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                  >
                    {accounts.filter(a => a.userId === currentUser.id && a.type !== 'CREDIT').map(acc => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (**{acc.accountNumber}) — Available: ${acc.availableBalance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Biller Identifier:</span>
                    <span className="text-zinc-900 dark:text-white font-mono">**{selectedBillForPay.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Processing Fee:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">$0.00</strong>
                  </div>
                  <div className="flex justify-between font-bold text-sm pt-1 border-t border-zinc-200 dark:border-zinc-700">
                    <span>Total Debit:</span>
                    <span>${selectedBillForPay.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBillForPay(null)}
                    className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold"
                  >
                    Authorize Payment
                  </button>
                </div>
              </>
            )}
          </form>
        </Modal>
      )}

      {/* Add Biller Modal */}
      {showAddBillerModal && (
        <Modal
          isOpen={showAddBillerModal}
          onClose={() => setShowAddBillerModal(false)}
          title="Add New Biller / Vendor"
          description="Enter the electronic billing identifier from your utility or service statement."
        >
          <form onSubmit={handleAddBiller} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Company / Biller Name</label>
              <input
                type="text"
                placeholder="e.g. Pacific Gas & Electric"
                value={newBillerName}
                onChange={e => setNewBillerName(e.target.value)}
                required
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                >
                  <option value="Utilities">Utilities</option>
                  <option value="Telecom">Telecom / Internet</option>
                  <option value="Water">Water & Sewer</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Subscriptions">Subscriptions</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Account / Meter #</label>
                <input
                  type="text"
                  placeholder="99482103"
                  value={newAccountNum}
                  onChange={e => setNewAccountNum(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Statement Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="120.00"
                  value={newAmount}
                  onChange={e => setNewAmount(e.target.value)}
                  required
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Due Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddBillerModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold"
              >
                Save Biller
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
