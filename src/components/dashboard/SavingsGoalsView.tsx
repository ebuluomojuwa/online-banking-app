import React, { useState } from 'react';
import { 
  PiggyBank, 
  Plus, 
  Target, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBanking } from '../../context/BankingContext';
import { SavingsGoal } from '../../types';
import { Badge, Modal } from '../ui';

export const SavingsGoalsView: React.FC = () => {
  const { savingsGoals, accounts, currentUser, createSavingsGoal, contributeToGoal, withdrawFromGoal, hideBalances } = useBanking();

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // Form states
  const [newGoalName, setNewGoalName] = useState('');
  const [newTargetAmount, setNewTargetAmount] = useState('');
  const [newCategory, setNewCategory] = useState<SavingsGoal['category']>('EMERGENCY');
  const [newTargetDate, setNewTargetDate] = useState('2027-12-31');
  const [newColor, setNewColor] = useState('#10B981');

  // Contribution/Withdrawal form
  const [actionAmount, setActionAmount] = useState('');
  const [actionAccountId, setActionAccountId] = useState(accounts[0]?.id || '');
  const [actionError, setActionError] = useState('');

  const userGoals = savingsGoals.filter(g => g.userId === currentUser.id);

  const totalSaved = userGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = userGoals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newTargetAmount);
    if (!newGoalName.trim() || isNaN(target) || target <= 0) return;

    createSavingsGoal({
      name: newGoalName.trim(),
      targetAmount: target,
      currentAmount: 0,
      targetDate: newTargetDate,
      category: newCategory,
      color: newColor,
    });

    setShowCreateModal(false);
    setNewGoalName('');
    setNewTargetAmount('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!selectedGoal) return;

    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0) {
      setActionError('Please enter a valid amount greater than $0.00');
      return;
    }

    const sourceAcc = accounts.find(a => a.id === actionAccountId);
    if (!sourceAcc || sourceAcc.availableBalance < amount) {
      setActionError('Insufficient balance in selected account');
      return;
    }

    contributeToGoal(selectedGoal.id, amount, actionAccountId);
    setShowContributeModal(false);
    setActionAmount('');

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError('');
    if (!selectedGoal) return;

    const amount = parseFloat(actionAmount);
    if (isNaN(amount) || amount <= 0) {
      setActionError('Please enter a valid amount');
      return;
    }

    if (selectedGoal.currentAmount < amount) {
      setActionError(`Cannot withdraw more than current goal savings ($${selectedGoal.currentAmount.toFixed(2)})`);
      return;
    }

    withdrawFromGoal(selectedGoal.id, amount, actionAccountId);
    setShowWithdrawModal(false);
    setActionAmount('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Savings Goals & Vaults
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Ring-fence funds for major milestones with 4.75% APY compound returns
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Goal
        </button>
      </div>

      {/* Aggregate Overview Card */}
      <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
            <PiggyBank className="w-4 h-4" /> Total Savings Vaults
          </span>
          <div className="text-3xl sm:text-4xl font-bold tracking-tight">
            {hideBalances ? '••••••' : `$${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          </div>
          <p className="text-xs text-zinc-400">
            Targeting <strong className="text-zinc-200">${totalTarget.toLocaleString()}</strong> across {userGoals.length} automated wealth goals
          </p>
        </div>

        {/* Aggregate Progress Bar */}
        <div className="w-full md:w-80 space-y-2 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-400 font-medium">Milestone Progress:</span>
            <span className="font-bold text-emerald-400">{overallProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, overallProgress)}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-400 text-right">
            ${(totalTarget - totalSaved).toLocaleString()} remaining to all targets
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userGoals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const isCompleted = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
            >
              <div>
                {/* Top: Category & Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: goal.color || '#10B981' }}
                    >
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{goal.name}</h3>
                      <span className="text-[10px] text-zinc-400 uppercase font-medium tracking-wider">
                        {goal.category}
                      </span>
                    </div>
                  </div>

                  {isCompleted ? (
                    <Badge variant="success" className="text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1 inline" /> Completed
                    </Badge>
                  ) : (
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {progress.toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div className="my-4">
                  <div className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                    {hideBalances ? '••••••' : `$${goal.currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    Goal: ${goal.targetAmount.toLocaleString()} • Target: {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* Linear progress bar */}
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      backgroundColor: goal.color || '#10B981',
                      width: `${Math.min(100, progress)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setShowContributeModal(true);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" /> Deposit
                </button>
                <button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setShowWithdrawModal(true);
                  }}
                  className="py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
                >
                  Withdraw
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Savings Goal"
          description="Ring-fence funds toward a target date and earn competitive high-yield APY."
        >
          <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Goal Name</label>
              <input
                type="text"
                placeholder="e.g. Down Payment on Home"
                value={newGoalName}
                onChange={e => setNewGoalName(e.target.value)}
                required
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Target Amount ($)</label>
                <input
                  type="number"
                  placeholder="25000"
                  min="100"
                  value={newTargetAmount}
                  onChange={e => setNewTargetAmount(e.target.value)}
                  required
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                >
                  <option value="EMERGENCY">Emergency Fund</option>
                  <option value="VACATION">Vacation & Travel</option>
                  <option value="VEHICLE">Vehicle / Auto</option>
                  <option value="HOME">Home & Real Estate</option>
                  <option value="EDUCATION">Education</option>
                  <option value="GENERAL">General Wealth</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Target Date</label>
                <input
                  type="date"
                  value={newTargetDate}
                  onChange={e => setNewTargetDate(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-zinc-700 dark:text-zinc-300">Theme Color</label>
                <select
                  value={newColor}
                  onChange={e => setNewColor(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
                >
                  <option value="#10B981">Emerald Green</option>
                  <option value="#3B82F6">Sapphire Blue</option>
                  <option value="#8B5CF6">Amethyst Purple</option>
                  <option value="#F59E0B">Amber Gold</option>
                  <option value="#EC4899">Rose Ruby</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold"
              >
                Create Goal
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Deposit to Goal Modal */}
      {showContributeModal && selectedGoal && (
        <Modal
          isOpen={showContributeModal}
          onClose={() => setShowContributeModal(false)}
          title={`Deposit to ${selectedGoal.name}`}
          description="Transfer funds from your checking account into this savings goal."
        >
          <form onSubmit={handleContribute} className="space-y-4 text-xs">
            {actionError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {actionError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Source Account</label>
              <select
                value={actionAccountId}
                onChange={e => setActionAccountId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
              >
                {accounts.filter(a => a.userId === currentUser.id && a.type !== 'CREDIT').map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (**{acc.accountNumber}) — Available: ${acc.availableBalance.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Deposit Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                placeholder="500.00"
                value={actionAmount}
                onChange={e => setActionAmount(e.target.value)}
                required
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white font-bold"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowContributeModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Confirm Deposit
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Withdraw from Goal Modal */}
      {showWithdrawModal && selectedGoal && (
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          title={`Withdraw from ${selectedGoal.name}`}
          description="Move saved funds back to your Premier Checking account."
        >
          <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
            {actionError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
                {actionError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Destination Account</label>
              <select
                value={actionAccountId}
                onChange={e => setActionAccountId(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
              >
                {accounts.filter(a => a.userId === currentUser.id && a.type !== 'CREDIT').map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} (**{acc.accountNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-zinc-700 dark:text-zinc-300">Withdraw Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                max={selectedGoal.currentAmount}
                placeholder="100.00"
                value={actionAmount}
                onChange={e => setActionAmount(e.target.value)}
                required
                className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white font-bold"
              />
              <span className="text-[11px] text-zinc-400">
                Available in this goal: ${selectedGoal.currentAmount.toFixed(2)}
              </span>
            </div>

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold"
              >
                Confirm Withdrawal
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
