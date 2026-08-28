import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Search, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowDownLeft, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Transaction } from '../../types';
import { Badge, Modal } from '../ui';

export const AdminTransactionsView: React.FC = () => {
  const { transactions, reverseTransaction } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxForReverse, setSelectedTxForReverse] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.accountName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmReverse = () => {
    if (!selectedTxForReverse) return;
    reverseTransaction(selectedTxForReverse.id, 'Administrative intervention / client risk dispute');
    setSelectedTxForReverse(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Institutional Transaction Audit Ledger
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Global monitoring of all customer transactions with administrative reversal capabilities
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search all global transactions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Global Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">Transaction / Reference</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-6 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredTransactions.map(tx => (
                <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-6 text-zinc-500 whitespace-nowrap">
                    {new Date(tx.date).toLocaleDateString()}
                    <span className="block text-[10px] text-zinc-400">{new Date(tx.date).toLocaleTimeString()}</span>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-white">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        tx.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {tx.amount > 0 ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span>{tx.description}</span>
                        <span className="block text-[10px] text-zinc-400 font-mono font-normal">Ref: {tx.reference}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-500">
                    {tx.accountName}
                  </td>

                  <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300">
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px]">
                      {tx.category}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-bold font-mono">
                    <span className={tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}>
                      {tx.amount > 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={tx.status === 'Completed' ? 'success' : tx.status === 'Reversed' ? 'secondary' : 'warning'}>
                      {tx.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tx.riskScore === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {tx.riskScore || 'Low'}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    {tx.status !== 'Reversed' && (
                      <button
                        onClick={() => setSelectedTxForReverse(tx)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-semibold text-[11px] flex items-center gap-1 ml-auto"
                      >
                        <RotateCcw className="w-3 h-3" /> Reverse
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reverse Transaction Modal */}
      {selectedTxForReverse && (
        <Modal
          isOpen={!!selectedTxForReverse}
          onClose={() => setSelectedTxForReverse(null)}
          title="Confirm Transaction Reversal"
          description="This action will issue an immediate offset ledger adjustment and record an audit log."
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Target Transaction:</span>
                <strong className="text-zinc-900 dark:text-white">{selectedTxForReverse.description}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Amount to Refund/Offset:</span>
                <strong className="text-rose-600 dark:text-rose-400 font-bold">${Math.abs(selectedTxForReverse.amount).toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Account:</span>
                <span className="font-mono text-zinc-900 dark:text-white">{selectedTxForReverse.accountName}</span>
              </div>
            </div>

            <p className="text-zinc-500">
              The affected customer will be notified via their secure portal notification feed.
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedTxForReverse(null)}
                className="px-4 py-2 rounded-xl text-zinc-600 dark:text-zinc-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReverse}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Execute Reversal
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
