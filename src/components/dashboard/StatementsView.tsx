import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Eye, 
  ArrowDownLeft, 
  ArrowUpRight 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge, Modal } from '../ui';

export const StatementsView: React.FC = () => {
  const { accounts, transactions, currentUser } = useBanking();
  const userAccounts = accounts.filter(a => a.userId === currentUser.id);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(userAccounts[0]?.id || '');
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [showStatementPreview, setShowStatementPreview] = useState(false);

  const selectedAccount = userAccounts.find(a => a.id === selectedAccountId) || userAccounts[0];

  const archiveStatements = [
    { id: 'stmt-2026-08', month: 'August 2026', period: 'Aug 01, 2026 - Aug 27, 2026', size: '240 KB' },
    { id: 'stmt-2026-07', month: 'July 2026', period: 'Jul 01, 2026 - Jul 31, 2026', size: '312 KB' },
    { id: 'stmt-2026-06', month: 'June 2026', period: 'Jun 01, 2026 - Jun 30, 2026', size: '288 KB' },
    { id: 'stmt-2026-05', month: 'May 2026', period: 'May 01, 2026 - May 31, 2026', size: '295 KB' },
    { id: 'stmt-2026-04', month: 'April 2026', period: 'Apr 01, 2026 - Apr 30, 2026', size: '304 KB' },
  ];

  const relevantTransactions = transactions.filter(t => t.userId === currentUser.id && (selectedAccountId ? t.accountId === selectedAccountId : true));

  const totalInflow = relevantTransactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOutflow = relevantTransactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const startingBalance = (selectedAccount?.balance || 24000) - (totalInflow - totalOutflow);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Official Account Statements
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Download certified monthly PDF disclosures, interest certificates, and tax documents
          </p>
        </div>

        <button
          onClick={() => setShowStatementPreview(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
        >
          <Eye className="w-4 h-4" /> View Current Statement
        </button>
      </div>

      {/* Account & Filter Selector */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Select Account
          </label>
          <select
            value={selectedAccountId}
            onChange={e => setSelectedAccountId(e.target.value)}
            className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs text-zinc-900 dark:text-white font-medium focus:outline-none"
          >
            {userAccounts.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name} (**{acc.accountNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Tax Year & Disclosure
          </label>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">2026 Year-to-Date Interest Earned:</span>
            <strong className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">$1,482.30</strong>
          </div>
        </div>
      </div>

      {/* Archive Statements List */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
          Monthly Disclosures & Archived Statements
        </h2>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {archiveStatements.map(stmt => (
            <div
              key={stmt.id}
              className="py-4 flex items-center justify-between hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 px-3 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white">{stmt.month} Statement</h3>
                  <span className="text-[11px] text-zinc-400">{stmt.period} • PDF • {stmt.size}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedMonth(stmt.month);
                    setShowStatementPreview(true);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={() => {
                    setSelectedMonth(stmt.month);
                    setShowStatementPreview(true);
                  }}
                  className="p-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-2xs"
                  title="Download Statement"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Statement Modal Preview */}
      {showStatementPreview && selectedAccount && (
        <Modal
          isOpen={showStatementPreview}
          onClose={() => setShowStatementPreview(false)}
          title={`Nova Bank Official Statement - ${selectedMonth}`}
          description={`Account: ${selectedAccount.name} (**${selectedAccount.accountNumber})`}
        >
          <div className="space-y-6 text-xs print:p-0">
            {/* Bank Statement Letterhead */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex justify-between items-start border-b border-zinc-200 dark:border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-serif font-black text-xs">
                      N
                    </div>
                    <span className="font-serif font-bold text-base tracking-tight text-zinc-900 dark:text-white">NOVA BANK N.A.</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-1">100 Wall Street, Floor 32, New York, NY 10005</p>
                  <p className="text-[10px] text-zinc-400">FDIC Certificate #84920194 | Prototype Disclosures</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">Statement Period</span>
                  <strong className="text-xs text-zinc-900 dark:text-white block">{selectedMonth}</strong>
                  <span className="text-[10px] text-zinc-400">Printed: {new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Customer & Account Box */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase font-bold block">Account Holder</span>
                  <strong className="text-zinc-900 dark:text-white text-sm">{currentUser.firstName} {currentUser.lastName}</strong>
                  <span className="text-zinc-500 block text-[11px]">{currentUser.email}</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 text-[10px] uppercase font-bold block">Account Coordinates</span>
                  <strong className="text-zinc-900 dark:text-white block font-mono text-xs">{selectedAccount.name}</strong>
                  <span className="font-mono text-[11px] text-zinc-500">Acct: **{selectedAccount.accountNumber} | Routing: {selectedAccount.routingNumber}</span>
                </div>
              </div>

              {/* Summary Numbers */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-center bg-white dark:bg-zinc-900 p-3 rounded-xl">
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Starting Balance</span>
                  <strong className="text-xs font-bold text-zinc-900 dark:text-white">${startingBalance.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Total Inflows</span>
                  <strong className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+${totalInflow.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Total Outflows</span>
                  <strong className="text-xs font-bold text-rose-500">-${totalOutflow.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-400 block">Ending Balance</span>
                  <strong className="text-xs font-bold text-zinc-900 dark:text-white">${selectedAccount.balance.toFixed(2)}</strong>
                </div>
              </div>

              {/* Chronological Table */}
              <div className="pt-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase text-[9px]">
                      <th className="py-1.5">Date</th>
                      <th className="py-1.5">Description</th>
                      <th className="py-1.5">Category</th>
                      <th className="py-1.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                    {relevantTransactions.slice(0, 8).map(t => (
                      <tr key={t.id}>
                        <td className="py-1.5 text-zinc-500 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                        <td className="py-1.5 font-medium text-zinc-900 dark:text-zinc-100">{t.description}</td>
                        <td className="py-1.5 text-zinc-500">{t.category}</td>
                        <td className={`py-1.5 text-right font-bold ${t.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                          {t.amount > 0 ? '+' : '-'}${Math.abs(t.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>

              <button
                onClick={() => setShowStatementPreview(false)}
                className="px-5 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
