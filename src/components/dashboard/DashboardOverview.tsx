import React, { useState, useMemo } from 'react';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  SendHorizontal, 
  Receipt, 
  PlusCircle, 
  FileDown, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight,
  ShieldCheck,
  Building2,
  PieChart as PieIcon,
  BarChart2,
  Calendar,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Copy,
  Check,
  Bell,
  Wallet,
  BadgeCheck,
  Smartphone
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

interface DashboardOverviewProps {
  onNavigate: (view: string) => void;
  onSelectTransaction?: (txId: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate, onSelectTransaction }) => {
  const { 
    currentUser, 
    accounts, 
    transactions, 
    cards,
    beneficiaries, 
    bills,
    notifications,
    unreadNotificationCount,
    hideBalances, 
    toggleHideBalances 
  } = useBanking();

  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('30D');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showFullAccount, setShowFullAccount] = useState(false);

  // Filter accounts belonging exclusively to the authenticated customer
  const userAccounts = useMemo(() => {
    return accounts.filter(a => a.userId === currentUser.id);
  }, [accounts, currentUser.id]);

  const userCards = useMemo(() => {
    return cards.filter(c => c.userId === currentUser.id);
  }, [cards, currentUser.id]);

  const userTransactions = useMemo(() => {
    return transactions.filter(t => t.userId === currentUser.id);
  }, [transactions, currentUser.id]);

  const primaryAccount = useMemo(() => {
    return userAccounts.find(a => a.isPrimary) || userAccounts[0] || {
      id: 'acc_none',
      userId: currentUser.id,
      accountNumber: '••••',
      routingNumber: '021000089',
      iban: '••••',
      swift: 'HBUKGB41400',
      name: 'Premier Checking',
      type: 'CHECKING' as const,
      currency: 'USD',
      balance: 0.00,
      availableBalance: 0.00,
      pendingBalance: 0.00,
      status: 'ACTIVE' as const,
      isPrimary: true,
      interestRate: 0.005,
      createdAt: new Date().toISOString(),
    };
  }, [userAccounts, currentUser.id]);

  // Calculate totals dynamically from authenticated user's accounts
  const totalBalance = useMemo(() => {
    return userAccounts.reduce((acc, curr) => acc + (curr.type === 'CREDIT' ? 0 : curr.balance), 0);
  }, [userAccounts]);

  const availableTotal = useMemo(() => {
    return userAccounts.reduce((acc, curr) => acc + (curr.type === 'CREDIT' ? 0 : curr.availableBalance), 0);
  }, [userAccounts]);

  const pendingTotal = useMemo(() => {
    return userAccounts.reduce((acc, curr) => acc + curr.pendingBalance, 0);
  }, [userAccounts]);

  // Dynamic calculations from user's transactions
  const totalIncome = useMemo(() => {
    return userTransactions
      .filter(t => t.amount > 0 && t.status === 'Completed')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [userTransactions]);

  const totalExpenses = useMemo(() => {
    return userTransactions
      .filter(t => t.amount < 0 && t.status === 'Completed')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [userTransactions]);

  // Sort recent transactions for this customer
  const recentTransactions = useMemo(() => {
    return [...userTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [userTransactions]);

  // Spending Category Breakdown dynamically aggregated from user's transactions
  const spendingData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    userTransactions
      .filter(t => t.amount < 0 && t.status === 'Completed')
      .forEach(t => {
        const cat = t.category || 'General';
        categories[cat] = (categories[cat] || 0) + Math.abs(t.amount);
      });

    const colors = ['#E11D48', '#F43F5E', '#FB7185', '#FDA4AF', '#38BDF8', '#818CF8', '#A78BFA'];
    const entries = Object.keys(categories).map((name, index) => ({
      name,
      value: Math.round(categories[name]),
      color: colors[index % colors.length],
    }));

    if (entries.length === 0) {
      return [
        { name: 'Housing & Living', value: 2400, color: '#E11D48' },
        { name: 'Food & Dining', value: 850, color: '#F43F5E' },
        { name: 'Shopping & Retail', value: 620, color: '#FB7185' },
        { name: 'Travel & Commute', value: 410, color: '#38BDF8' },
      ];
    }
    return entries;
  }, [userTransactions]);

  // Dynamic balance history curve scaled to customer's balance
  const balanceHistoryData = useMemo(() => {
    const base = totalBalance > 0 ? totalBalance : 6000;
    if (timeRange === '7D') {
      return [
        { date: 'Aug 22', balance: Math.round(base * 0.88) },
        { date: 'Aug 23', balance: Math.round(base * 0.90) },
        { date: 'Aug 24', balance: Math.round(base * 0.92) },
        { date: 'Aug 25', balance: Math.round(base * 0.95) },
        { date: 'Aug 26', balance: Math.round(base * 0.97) },
        { date: 'Aug 27', balance: Math.round(base * 0.99) },
        { date: 'Aug 28', balance: base },
      ];
    } else if (timeRange === '30D') {
      return [
        { date: 'Jul 29', balance: Math.round(base * 0.72) },
        { date: 'Aug 05', balance: Math.round(base * 0.79) },
        { date: 'Aug 12', balance: Math.round(base * 0.84) },
        { date: 'Aug 19', balance: Math.round(base * 0.91) },
        { date: 'Aug 26', balance: Math.round(base * 0.96) },
        { date: 'Aug 28', balance: base },
      ];
    } else if (timeRange === '3M') {
      return [
        { date: 'Jun 01', balance: Math.round(base * 0.60) },
        { date: 'Jun 15', balance: Math.round(base * 0.68) },
        { date: 'Jul 01', balance: Math.round(base * 0.75) },
        { date: 'Jul 15', balance: Math.round(base * 0.82) },
        { date: 'Aug 01', balance: Math.round(base * 0.90) },
        { date: 'Aug 28', balance: base },
      ];
    } else if (timeRange === '6M') {
      return [
        { date: 'Mar', balance: Math.round(base * 0.50) },
        { date: 'Apr', balance: Math.round(base * 0.58) },
        { date: 'May', balance: Math.round(base * 0.69) },
        { date: 'Jun', balance: Math.round(base * 0.78) },
        { date: 'Jul', balance: Math.round(base * 0.88) },
        { date: 'Aug', balance: base },
      ];
    } else {
      return [
        { date: 'Sep 25', balance: Math.round(base * 0.35) },
        { date: 'Nov 25', balance: Math.round(base * 0.45) },
        { date: 'Jan 26', balance: Math.round(base * 0.58) },
        { date: 'Mar 26', balance: Math.round(base * 0.70) },
        { date: 'May 26', balance: Math.round(base * 0.82) },
        { date: 'Jul 26', balance: Math.round(base * 0.91) },
        { date: 'Aug 26', balance: base },
      ];
    }
  }, [timeRange, totalBalance]);

  // Cash Flow dynamically calculated
  const cashFlowData = useMemo(() => {
    const inc = totalIncome > 0 ? totalIncome : 5200;
    const exp = totalExpenses > 0 ? totalExpenses : 2400;
    return [
      { month: 'May', income: Math.round(inc * 0.85), expenses: Math.round(exp * 0.80) },
      { month: 'Jun', income: Math.round(inc * 0.90), expenses: Math.round(exp * 0.88) },
      { month: 'Jul', income: Math.round(inc * 0.95), expenses: Math.round(exp * 0.92) },
      { month: 'Aug', income: Math.round(inc), expenses: Math.round(exp) },
    ];
  }, [totalIncome, totalExpenses]);

  const formatMoney = (amount: number) => {
    if (hideBalances) return '••••••';
    return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. PERSONALIZED CUSTOMER PROFILE & IDENTITY CARD */}
      <div className="bg-[#1C0407] rounded-3xl border border-[#38080E] p-6 sm:p-7 shadow-2xl relative overflow-hidden text-white">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Customer Bio Information */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-700 to-rose-950 border-2 border-rose-500/40 flex items-center justify-center text-xl font-bold text-rose-100 shadow-md">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1C0407] flex items-center justify-center" title="Online & Authenticated">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">
                  {currentUser.firstName} {currentUser.lastName}
                </h1>
                <Badge variant="danger" className="text-[10px] uppercase font-bold py-0.5 px-2">
                  {currentUser.role === 'ADMIN' ? 'System Administrator' : currentUser.role === 'SUPPORT_AGENT' ? 'Support Specialist' : 'Premier Client'}
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>KYC Verified</span>
                </div>
              </div>

              {/* Status and Username */}
              <div className="flex items-center gap-2 text-xs text-rose-200/70">
                <span className="font-mono text-rose-200">@{currentUser.username || 'premier.client'}</span>
                <span className="text-rose-400/40">•</span>
                <span className="text-rose-300/80 font-medium">HSBC Premier Account Holder</span>
              </div>
            </div>
          </div>

          {/* Primary Account Overview Capsule */}
          <div className="bg-[#0E0103] border border-[#38080E] p-4 rounded-2xl flex flex-col justify-between gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Primary Account
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-900/60 font-semibold">
                {primaryAccount.type}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-rose-100">{primaryAccount.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-xs text-rose-300 font-bold">
                    {showFullAccount ? `HSBC-${primaryAccount.accountNumber}` : `•••• ${primaryAccount.accountNumber}`}
                  </span>
                  <button
                    onClick={() => setShowFullAccount(p => !p)}
                    className="text-rose-400/70 hover:text-rose-200"
                    title={showFullAccount ? 'Hide full number' : 'Show full number'}
                  >
                    {showFullAccount ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => copyToClipboard(primaryAccount.accountNumber, 'acc')}
                    className="text-rose-400/70 hover:text-rose-200"
                    title="Copy Account Number"
                  >
                    {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-rose-400/70">Ledger Balance</span>
                <p className="text-sm font-bold text-white">
                  {formatMoney(primaryAccount.balance)}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-rose-400/70 pt-2 border-t border-[#38080E]">
              <span>Routing: <strong className="text-rose-200 font-mono">{primaryAccount.routingNumber}</strong></span>
              <span>SWIFT: <strong className="text-rose-200 font-mono">{primaryAccount.swift}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="mt-5 pt-5 border-t border-[#38080E] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('transfers')}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/50 transition-all"
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              Transfer Funds
            </button>
            <button
              onClick={() => onNavigate('cards')}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#25060A] hover:bg-[#38080E] text-rose-200 hover:text-white font-semibold text-xs rounded-xl border border-[#38080E] transition-all"
            >
              <CreditCard className="w-3.5 h-3.5 text-rose-400" />
              Cards ({userCards.length})
            </button>
            <button
              onClick={() => onNavigate('bills')}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#25060A] hover:bg-[#38080E] text-rose-200 hover:text-white font-semibold text-xs rounded-xl border border-[#38080E] transition-all"
            >
              <Receipt className="w-3.5 h-3.5 text-rose-400" />
              Pay Bills ({bills.filter(b => b.userId === currentUser.id).length})
            </button>
            <button
              onClick={() => onNavigate('statements')}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#25060A] hover:bg-[#38080E] text-rose-200 hover:text-white font-semibold text-xs rounded-xl border border-[#38080E] transition-all"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-400" />
              Statements
            </button>
            <button
              onClick={() => onNavigate('notifications')}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#25060A] hover:bg-[#38080E] text-rose-200 hover:text-white font-semibold text-xs rounded-xl border border-[#38080E] transition-all relative"
            >
              <Bell className="w-3.5 h-3.5 text-rose-400" />
              Notifications
              {unreadNotificationCount > 0 && (
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-rose-300/80">
            <button
              onClick={toggleHideBalances}
              className="flex items-center gap-1.5 text-xs text-rose-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#0E0103] border border-[#38080E] transition-colors"
            >
              {hideBalances ? <EyeOff className="w-3.5 h-3.5 text-rose-400" /> : <Eye className="w-3.5 h-3.5 text-rose-400" />}
              <span>{hideBalances ? 'Show Balances' : 'Mask Balances'}</span>
            </button>
            <span className="text-[11px] text-rose-400/50 hidden sm:inline">256-Bit Encrypted Session</span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC FINANCIAL KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Available Balance Card */}
        <div className="bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm relative overflow-hidden text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400/80">
                Total Available Balance
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-900/40 border border-rose-800/50 flex items-center justify-center text-rose-300">
                <Wallet className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                {formatMoney(availableTotal)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-400 gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +${(totalBalance * 0.08).toFixed(2)} this month
                </span>
                <span className="text-[11px] text-rose-400/60">(+8.0%)</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-[#38080E] flex justify-between text-xs text-rose-300/70">
            <div>
              <span>Current Total: </span>
              <strong className="text-white">{formatMoney(totalBalance)}</strong>
            </div>
            <div>
              <span>Pending Holds: </span>
              <strong className="text-white">{formatMoney(pendingTotal)}</strong>
            </div>
          </div>
        </div>

        {/* Deposit Liquidity Breakdown */}
        <div className="bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400/80">
                Customer Portfolios
              </span>
              <Badge variant="neutral" className="bg-[#25060A] text-rose-200 border-[#38080E]">
                {userAccounts.length} Connected Accounts
              </Badge>
            </div>

            <div className="mt-3.5 space-y-2.5">
              {userAccounts.map(acc => (
                <div key={acc.id} className="flex items-center justify-between text-xs bg-[#0E0103] p-2.5 rounded-xl border border-[#38080E]">
                  <span className="text-rose-200 flex items-center gap-2 truncate mr-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${acc.type === 'CHECKING' ? 'bg-rose-500' : acc.type === 'SAVINGS' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className="truncate font-semibold">{acc.name}</span>
                    <span className="text-[10px] text-rose-400/70 font-mono">(**{acc.accountNumber})</span>
                  </span>
                  <span className="font-bold text-white flex-shrink-0">{formatMoney(acc.availableBalance)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#38080E] flex items-center justify-between">
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Earning up to 4.75% APY
            </span>
            <button 
              onClick={() => onNavigate('accounts')} 
              className="text-xs font-bold text-rose-200 hover:text-white flex items-center"
            >
              All Accounts <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Credit & Card Limits */}
        <div className="bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400/80">
                Active Card Lines
              </span>
              <Badge variant="secondary" className="bg-[#25060A] text-rose-200 border-[#38080E]">
                {userCards.length} Card{userCards.length === 1 ? '' : 's'} Active
              </Badge>
            </div>

            {userCards.length > 0 ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-rose-300/80">
                    {userCards[0].cardholderName} ({userCards[0].brand}):
                  </span>
                  <span className="text-lg font-bold text-white">
                    {formatMoney(userCards[0].currentSpend)}
                  </span>
                </div>
                <div className="w-full bg-[#0E0103] h-2 rounded-full overflow-hidden border border-[#38080E]">
                  <div 
                    className="bg-rose-500 h-full rounded-full transition-all" 
                    style={{ width: `${Math.min(100, Math.round((userCards[0].currentSpend / (userCards[0].monthlyLimit || 10000)) * 100))}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[11px] text-rose-400/70">
                  <span>{formatMoney(userCards[0].currentSpend)} spent</span>
                  <span>{formatMoney(userCards[0].monthlyLimit)} limit</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-[#0E0103] rounded-xl border border-[#38080E] text-center text-xs text-rose-300/70">
                No credit cards linked. Apply for an HSBC World Elite card today.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#38080E] flex items-center justify-between">
            <span className="text-[11px] text-rose-400/80">Contactless & Apple Pay</span>
            <button 
              onClick={() => onNavigate('cards')} 
              className="text-xs font-bold text-rose-200 hover:text-white flex items-center"
            >
              Card Controls <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC ACCOUNTS PORTFOLIO GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Customer Accounts & Portfolios
            </h3>
            <p className="text-xs text-rose-300/70">
              Active Premier banking accounts and portfolios
            </p>
          </div>
          <button
            onClick={() => onNavigate('accounts')}
            className="text-xs font-semibold text-rose-300 hover:text-white flex items-center gap-1"
          >
            Manage Accounts <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {userAccounts.map(account => (
            <div
              key={account.id}
              onClick={() => onNavigate('accounts')}
              className="group bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] hover:border-rose-500/50 transition-all cursor-pointer shadow-sm flex flex-col justify-between text-white"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      {account.type} ACCOUNT
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5 group-hover:text-rose-300 transition-colors">
                      {account.name}
                    </h4>
                  </div>
                  <Badge variant={account.status === 'ACTIVE' ? 'success' : 'warning'} className="font-mono text-[10px]">
                    •••• {account.accountNumber}
                  </Badge>
                </div>

                <div className="mt-4">
                  <span className="text-2xl font-bold tracking-tight text-white">
                    {account.balance < 0 ? '-' : ''}{formatMoney(account.balance)}
                  </span>
                  <div className="text-[11px] text-rose-300/70 mt-1">
                    {account.type === 'CREDIT' ? (
                      `Available Credit: ${formatMoney(account.availableBalance)}`
                    ) : (
                      `Available: ${formatMoney(account.availableBalance)}`
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#38080E] flex items-center justify-between text-xs text-rose-400/80">
                <span className="font-mono text-[10px]">Routing: {account.routingNumber}</span>
                <span className="text-rose-200 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Transfer <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FINANCIAL ANALYTICS: BALANCE TRENDS & SPENDING BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance History Line Chart */}
        <div className="lg:col-span-2 bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Account Valuation Trend
              </h3>
              <p className="text-xs text-rose-300/70 mt-0.5">
                Dynamic balance evolution over selected interval
              </p>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center bg-[#0E0103] p-1 rounded-2xl gap-1 border border-[#38080E]">
              {(['7D', '30D', '3M', '6M', '1Y'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all ${
                    timeRange === range
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="date" 
                  stroke="#BE123C" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#38080E' }} 
                />
                <YAxis 
                  stroke="#BE123C" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={val => `$${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Portfolio Total']}
                  contentStyle={{
                    backgroundColor: '#0E0103',
                    border: '1px solid #38080E',
                    borderRadius: '1rem',
                    color: '#FFF',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#F43F5E"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#F43F5E', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#E11D48' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Category Donut Chart */}
        <div className="bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-rose-400" /> Spending Distribution
                </h3>
                <p className="text-xs text-rose-300/70 mt-0.5">
                  Calculated from customer expense records
                </p>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {spendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Spent']}
                    contentStyle={{
                      backgroundColor: '#0E0103',
                      border: '1px solid #38080E',
                      borderRadius: '1rem',
                      color: '#FFF',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2 pt-3 border-t border-[#38080E] text-[11px]">
            {spendingData.slice(0, 4).map(item => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-rose-300/80 truncate">{item.name}</span>
                <span className="font-semibold text-white ml-auto">
                  ${item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. CASH FLOW & QUICK BENEFICIARIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Dynamics */}
        <div className="lg:col-span-2 bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-rose-400" /> Cash Flow Dynamics
              </h3>
              <p className="text-xs text-rose-300/70 mt-0.5">
                Monthly Inflow vs Outflow analysis
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#BE123C" fontSize={11} tickLine={false} />
                <YAxis stroke="#BE123C" fontSize={11} tickLine={false} tickFormatter={val => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#0E0103',
                    border: '1px solid #38080E',
                    borderRadius: '1rem',
                    color: '#FFF',
                    fontSize: '11px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="income" name="Inflow" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Outflow" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Transfer Payees */}
        <div className="bg-[#1C0407] p-6 rounded-3xl border border-[#38080E] shadow-sm flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Quick Transfer Payees
              </h3>
              <button
                onClick={() => onNavigate('transfers')}
                className="text-xs font-semibold text-rose-300 hover:text-white"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {beneficiaries.slice(0, 3).map(ben => (
                <div
                  key={ben.id}
                  onClick={() => onNavigate('transfers')}
                  className="p-3 rounded-2xl border border-[#38080E] hover:bg-[#25060A] cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold text-xs">
                      {ben.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{ben.name}</p>
                      <span className="text-[10px] text-rose-300/70">{ben.nickname}</span>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-xl bg-[#0E0103] text-rose-300 hover:text-white">
                    <SendHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#38080E]">
            <button
              onClick={() => onNavigate('transfers')}
              className="w-full py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-950/40 flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> New Wire Transfer
            </button>
          </div>
        </div>
      </div>

      {/* 6. RECENT TRANSACTIONS STREAM */}
      <div className="bg-[#1C0407] rounded-3xl border border-[#38080E] shadow-sm p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Recent Transaction History
            </h3>
            <p className="text-xs text-rose-300/70 mt-0.5">
              Live ledger entries posted to {currentUser.firstName}'s accounts
            </p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-semibold text-rose-300 hover:text-white flex items-center gap-1"
          >
            All Activity ({userTransactions.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="divide-y divide-[#38080E]">
            {recentTransactions.map(tx => (
              <div
                key={tx.id}
                onClick={() => {
                  if (onSelectTransaction) onSelectTransaction(tx.id);
                  onNavigate('transactions');
                }}
                className="py-3.5 flex items-center justify-between hover:bg-[#25060A] px-2 rounded-2xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    tx.amount > 0 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-white">
                      {tx.description}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-rose-300/70 mt-0.5">
                      <span>{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{tx.category}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px] text-rose-400">{tx.accountName}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-bold ${
                    tx.amount > 0 
                      ? 'text-emerald-400' 
                      : 'text-white'
                  }`}>
                    {tx.amount > 0 ? '+' : '-'}{formatMoney(tx.amount)}
                  </span>
                  <div className="mt-0.5">
                    <Badge variant={tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'danger'} className="text-[10px] py-0 px-1.5">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-rose-300/70">
            No transactions found for this account yet.
          </div>
        )}
      </div>

    </div>
  );
};
