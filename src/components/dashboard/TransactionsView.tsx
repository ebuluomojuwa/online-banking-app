import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Download, 
  FileText, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Printer,
  Share2
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Transaction, TransactionCategory, TransactionStatus } from '../../types';
import { Badge, Modal } from '../ui';

export const TransactionsView: React.FC = () => {
  const { transactions, currentUser, accounts, hideBalances } = useBanking();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAccount, setSelectedAccount] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected transaction for details modal
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Filter transactions for current user
  const userTransactions = useMemo(() => {
    return transactions.filter(t => t.userId === currentUser.id);
  }, [transactions, currentUser.id]);

  const filteredTransactions = useMemo(() => {
    return userTransactions.filter(tx => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(q);
        const matchesMerchant = tx.merchantName?.toLowerCase().includes(q);
        const matchesRef = tx.reference.toLowerCase().includes(q);
        const matchesCat = tx.category.toLowerCase().includes(q);
        if (!matchesDesc && !matchesMerchant && !matchesRef && !matchesCat) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'ALL' && tx.category !== selectedCategory) {
        return false;
      }

      // Account
      if (selectedAccount !== 'ALL' && tx.accountId !== selectedAccount) {
        return false;
      }

      // Status
      if (selectedStatus !== 'ALL' && tx.status !== selectedStatus) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'amount-desc') return Math.abs(b.amount) - Math.abs(a.amount);
      if (sortBy === 'amount-asc') return Math.abs(a.amount) - Math.abs(b.amount);
      return 0;
    });
  }, [userTransactions, searchTerm, selectedCategory, selectedAccount, selectedStatus, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  const categories: TransactionCategory[] = [
    'Salary', 'Transfer', 'Groceries', 'Utilities', 'Subscription', 
    'Dining', 'Shopping', 'Transportation', 'Entertainment', 'Health', 'Travel', 'Investment', 'Fees'
  ];

  const userAccounts = useMemo(() => {
    return accounts.filter(a => a.userId === currentUser.id);
  }, [accounts, currentUser.id]);

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Transaction Activity
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Search, filter, and inspect simulated debit & credit ledgers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Export CSV Simulation
              const csvContent = "data:text/csv;charset=utf-8," + 
                ["Date,Description,Category,Account,Amount,Status,Reference"]
                .concat(filteredTransactions.map(t => `"${t.date}","${t.description}","${t.category}","${t.accountName}","${t.amount}","${t.status}","${t.reference}"`))
                .join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `hsbc_bank_statement_${new Date().toISOString().slice(0,10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-zinc-500" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search by merchant, description, reference code..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Account Filter */}
          <div>
            <select
              value={selectedAccount}
              onChange={e => { setSelectedAccount(e.target.value); setCurrentPage(1); }}
              className="w-full py-2 px-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Accounts</option>
              {userAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (**{acc.accountNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full py-2 px-3 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary filters: Status & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Status:</span>
            {(['ALL', 'Completed', 'Pending', 'Failed', 'Reversed'] as const).map(status => (
              <button
                key={status}
                onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                  selectedStatus === status
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="py-1 px-2.5 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg text-xs text-zinc-900 dark:text-white focus:outline-none font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200/80 dark:border-zinc-800 text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Description / Merchant</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                    No transactions found matching your criteria. Try adjusting your search filters.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map(tx => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      <span className="block text-[10px] text-zinc-400">
                        {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          tx.amount > 0 
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' 
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}>
                          {tx.amount > 0 ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <span>{tx.description}</span>
                          <span className="block text-[10px] text-zinc-400 font-mono font-normal">
                            Ref: {tx.reference}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-300 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium">
                        {tx.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-mono text-[11px]">
                      {tx.accountName}
                    </td>

                    <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                      <span className={tx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}>
                        {tx.amount > 0 ? '+' : '-'}{hideBalances ? '••••' : `$${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <Badge 
                        variant={
                          tx.status === 'Completed' ? 'success' :
                          tx.status === 'Pending' ? 'warning' :
                          tx.status === 'Reversed' ? 'secondary' : 'destructive'
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedTx(tx);
                        }}
                        className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white underline underline-offset-2"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {filteredTransactions.length > 0 && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} items
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-semibold text-zinc-800 dark:text-zinc-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <Modal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          title="Transaction Receipt & Details"
          description={`Reference: ${selectedTx.reference}`}
        >
          <div className="space-y-6 text-sm">
            {/* Header Amount */}
            <div className="p-6 bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl text-center border border-zinc-200/80 dark:border-zinc-700">
              <span className="text-xs uppercase tracking-wider font-semibold text-zinc-400">Total Transaction Amount</span>
              <div className={`text-3xl font-extrabold mt-1 ${
                selectedTx.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'
              }`}>
                {selectedTx.amount > 0 ? '+' : '-'}${Math.abs(selectedTx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {selectedTx.currency}
              </div>
              <div className="mt-2 flex justify-center">
                <Badge variant={selectedTx.status === 'Completed' ? 'success' : selectedTx.status === 'Pending' ? 'warning' : 'neutral'}>
                  {selectedTx.status}
                </Badge>
              </div>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 block">Merchant / Recipient</span>
                <strong className="text-zinc-900 dark:text-zinc-100 text-sm">{selectedTx.merchantName || selectedTx.description}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Posted Date</span>
                <strong className="text-zinc-900 dark:text-zinc-100 text-sm">{new Date(selectedTx.date).toLocaleString()}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Account Ledger</span>
                <strong className="text-zinc-900 dark:text-zinc-100 font-mono text-xs">{selectedTx.accountName}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Category</span>
                <strong className="text-zinc-900 dark:text-zinc-100 text-xs">{selectedTx.category}</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Interchange Processing Fee</span>
                <strong className="text-zinc-900 dark:text-zinc-100 text-xs">$0.00 (HSBC Premier Benefit)</strong>
              </div>
              <div>
                <span className="text-zinc-400 block">Risk Evaluation Score</span>
                <strong className="text-emerald-600 dark:text-emerald-400 text-xs">{selectedTx.riskScore || 'Low'} (Verified)</strong>
              </div>
            </div>

            {selectedTx.note && (
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Transaction Memo:</span>
                <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">{selectedTx.note}</p>
              </div>
            )}

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold"
              >
                <Printer className="w-4 h-4" /> Print Simulated Receipt
              </button>

              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold"
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
