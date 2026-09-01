import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ArrowRight, 
  Wallet, 
  ArrowLeftRight, 
  Users, 
  LifeBuoy, 
  ShieldCheck, 
  CreditCard,
  X
} from 'lucide-react';
import { useBanking, isWelcomeCreditTransaction } from '../../context/BankingContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const { accounts, transactions, beneficiaries, supportTickets } = useBanking();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedAccounts = accounts.filter(
      a => a.name.toLowerCase().includes(q) || a.accountNumber.includes(q) || a.type.toLowerCase().includes(q)
    );

    const matchedTransactions = transactions.filter(
      t => !isWelcomeCreditTransaction(t) && (
           t.description.toLowerCase().includes(q) || 
           t.merchantName?.toLowerCase().includes(q) ||
           t.category.toLowerCase().includes(q) ||
           t.reference.toLowerCase().includes(q)
      )
    ).slice(0, 5);

    const matchedBeneficiaries = beneficiaries.filter(
      b => b.name.toLowerCase().includes(q) || b.nickname.toLowerCase().includes(q) || b.bankName.toLowerCase().includes(q)
    );

    const matchedArticles = [
      { title: 'How to initiate an international SWIFT wire transfer', category: 'Transfers', view: 'support' },
      { title: 'Setting up biometric 2FA and Passkeys', category: 'Security', view: 'security' },
      { title: 'Understanding high-yield APY compounding', category: 'Savings', view: 'accounts' },
      { title: 'Virtual card freeze and transaction controls', category: 'Cards', view: 'cards' },
    ].filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));

    return {
      accounts: matchedAccounts,
      transactions: matchedTransactions,
      beneficiaries: matchedBeneficiaries,
      articles: matchedArticles,
    };
  }, [query, accounts, transactions, beneficiaries]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 dark:border-zinc-800 gap-3">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search accounts, transactions, payees, support guides..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query.trim() ? (
            <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
              <p className="font-medium text-zinc-700 dark:text-zinc-300 mb-2">Quick Navigation</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                <button
                  onClick={() => { onNavigate('transfers'); onClose(); }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Transfer Money
                </button>
                <button
                  onClick={() => { onNavigate('cards'); onClose(); }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Manage Cards
                </button>
                <button
                  onClick={() => { onNavigate('statements'); onClose(); }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5"
                >
                  <LifeBuoy className="w-3.5 h-3.5" /> Download Statements
                </button>
                <button
                  onClick={() => { onNavigate('security'); onClose(); }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> 2FA Settings
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Accounts */}
              {searchResults?.accounts && searchResults.accounts.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" /> Bank Accounts
                  </h4>
                  <div className="space-y-1">
                    {searchResults.accounts.map(acc => (
                      <div
                        key={acc.id}
                        onClick={() => { onNavigate('accounts'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{acc.name} (**{acc.accountNumber})</p>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{acc.type} • Routing: {acc.routingNumber}</span>
                        </div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white">
                          ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transactions */}
              {searchResults?.transactions && searchResults.transactions.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ArrowLeftRight className="w-3.5 h-3.5" /> Transactions
                  </h4>
                  <div className="space-y-1">
                    {searchResults.transactions.map(tx => (
                      <div
                        key={tx.id}
                        onClick={() => { onNavigate('transactions'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{tx.description}</p>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{new Date(tx.date).toLocaleDateString()} • {tx.category}</span>
                        </div>
                        <span className={`text-xs font-bold ${tx.amount < 0 ? 'text-zinc-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beneficiaries */}
              {searchResults?.beneficiaries && searchResults.beneficiaries.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> Payees & Beneficiaries
                  </h4>
                  <div className="space-y-1">
                    {searchResults.beneficiaries.map(ben => (
                      <div
                        key={ben.id}
                        onClick={() => { onNavigate('transfers'); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{ben.name} ({ben.nickname})</p>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{ben.bankName} • {ben.country}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Help articles */}
              {searchResults?.articles && searchResults.articles.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <LifeBuoy className="w-3.5 h-3.5" /> Help Articles & Guides
                  </h4>
                  <div className="space-y-1">
                    {searchResults.articles.map((art, idx) => (
                      <div
                        key={idx}
                        onClick={() => { onNavigate(art.view); onClose(); }}
                        className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="text-xs text-zinc-800 dark:text-zinc-200">{art.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">{art.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty result */}
              {searchResults && 
               searchResults.accounts.length === 0 && 
               searchResults.transactions.length === 0 && 
               searchResults.beneficiaries.length === 0 && 
               searchResults.articles.length === 0 && (
                <div className="py-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  No records matching &ldquo;{query}&rdquo; found. Try searching by account number, vendor name, or transaction amount.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
