import React, { useState } from 'react';
import { 
  Wallet, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  ShieldCheck, 
  Percent, 
  Building2, 
  Eye, 
  EyeOff,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Account } from '../../types';
import { Badge } from '../ui';

export const AccountsDetailView: React.FC = () => {
  const { accounts, transactions, currentUser, hideBalances } = useBanking();
  const userAccounts = accounts.filter(a => a.userId === currentUser.id);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(userAccounts[0]?.id || '');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const selectedAccount = userAccounts.find(a => a.id === selectedAccountId) || userAccounts[0];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const accountTransactions = transactions
    .filter(t => t.accountId === selectedAccount?.id)
    .slice(0, 10);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Deposit & Credit Accounts
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Inspect institutional ledger numbers, APY yield compounding, and account routing coordinates
        </p>
      </div>

      {/* Account Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {userAccounts.map(account => {
          const isSelected = account.id === selectedAccountId;
          return (
            <div
              key={account.id}
              onClick={() => setSelectedAccountId(account.id)}
              className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-zinc-950 dark:border-white bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-lg scale-[1.01]'
                  : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-zinc-400 dark:text-zinc-500' : 'text-zinc-400'}`}>
                    {account.type}
                  </span>
                  <Badge variant={isSelected ? 'secondary' : 'neutral'}>
                    **{account.accountNumber}
                  </Badge>
                </div>

                <h3 className="text-base font-bold mt-2">
                  {account.name}
                </h3>

                <div className="mt-4">
                  <span className="text-2xl font-bold tracking-tight">
                    {hideBalances ? '••••••' : `$${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                  </span>
                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'}`}>
                    Available: ${account.availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {account.interestRate ? (
                <div className={`mt-5 pt-3 border-t text-xs flex items-center justify-between ${isSelected ? 'border-zinc-800 dark:border-zinc-200' : 'border-zinc-100 dark:border-zinc-800'}`}>
                  <span className="flex items-center gap-1 font-semibold text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" /> {account.interestRate}% APY
                  </span>
                  <span className="text-[10px] opacity-80">Compounded Monthly</span>
                </div>
              ) : (
                <div className={`mt-5 pt-3 border-t text-xs flex items-center justify-between opacity-80 ${isSelected ? 'border-zinc-800 dark:border-zinc-200' : 'border-zinc-100 dark:border-zinc-800'}`}>
                  <span>Primary Liquidity</span>
                  <span>Zero Overdraft Fee</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Account Deep Details */}
      {selectedAccount && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Wire & Routing Coordinates (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-5">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Account Numbers & Routing Coordinates
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Use these coordinates for direct deposits, tax refunds, and ACH/Wire transfers
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* Account Number */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Full Account Number</span>
                  <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    08429184{selectedAccount.accountNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(`08429184${selectedAccount.accountNumber}`, 'acct')}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100"
                >
                  {copiedField === 'acct' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Routing Number (ABA) */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">ACH / Electronic Routing (ABA)</span>
                  <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    {selectedAccount.routingNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(selectedAccount.routingNumber, 'routing')}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100"
                >
                  {copiedField === 'routing' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Wire Routing & SWIFT */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Domestic Wire / International SWIFT</span>
                  <span className="font-mono text-sm font-bold text-zinc-900 dark:text-white">
                    HSBCUS33XXX / WIRE0210
                  </span>
                </div>
                <button
                  onClick={() => handleCopy('HSBCUS33XXX', 'swift')}
                  className="p-2 rounded-xl bg-white dark:bg-zinc-700 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100"
                >
                  {copiedField === 'swift' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Bank Legal Address */}
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-xs">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Bank Entity & Domicile</span>
                <span className="font-semibold text-zinc-900 dark:text-white block mt-0.5">HSBC Bank USA, N.A.</span>
                <span className="text-zinc-500 block text-[11px]">452 Fifth Avenue, New York, NY 10018</span>
              </div>
            </div>
          </div>

          {/* Account Ledger Activity (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                  {selectedAccount.name} Activity
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Recent transactions posted to this specific ledger
                </p>
              </div>

              <span className="text-xs text-zinc-400">
                {accountTransactions.length} recent entries
              </span>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {accountTransactions.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-400">
                  No transaction history recorded for this account.
                </div>
              ) : (
                accountTransactions.map(tx => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        tx.amount > 0 
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' 
                          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}>
                        {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                          {tx.description}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {new Date(tx.date).toLocaleDateString()} • {tx.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-bold ${
                        tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'
                      }`}>
                        {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                      </span>
                      <div className="text-[10px] text-zinc-400">{tx.status}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
