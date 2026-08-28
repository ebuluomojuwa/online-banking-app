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
  Sparkles
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

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  const { 
    currentUser, 
    accounts, 
    transactions, 
    beneficiaries, 
    savingsGoals, 
    hideBalances, 
    toggleHideBalances 
  } = useBanking();

  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('30D');

  // Filter accounts for current user
  const userAccounts = useMemo(() => {
    return accounts.filter(a => a.userId === currentUser.id);
  }, [accounts, currentUser.id]);

  // Calculate totals
  const totalBalance = useMemo(() => {
    return userAccounts.reduce((acc, curr) => acc + (curr.type === 'CREDIT' ? 0 : curr.balance), 0);
  }, [userAccounts]);

  const availableTotal = useMemo(() => {
    return userAccounts.reduce((acc, curr) => acc + (curr.type === 'CREDIT' ? 0 : curr.availableBalance), 0);
  }, [userAccounts]);

  const pendingTotal = useMemo(() => {
    return userAccounts.reduce((acc, curr) => acc + curr.pendingBalance, 0);
  }, [userAccounts]);

  // Balance History Data for Line Chart
  const balanceHistoryData = useMemo(() => {
    if (timeRange === '7D') {
      return [
        { date: 'Aug 21', balance: 81200 },
        { date: 'Aug 22', balance: 80800 },
        { date: 'Aug 23', balance: 80730 },
        { date: 'Aug 24', balance: 80410 },
        { date: 'Aug 25', balance: 80100 },
        { date: 'Aug 26', balance: 76070 },
        { date: 'Aug 27', balance: 84520 },
      ];
    } else if (timeRange === '30D') {
      return [
        { date: 'Jul 28', balance: 74200 },
        { date: 'Aug 04', balance: 76400 },
        { date: 'Aug 11', balance: 78100 },
        { date: 'Aug 18', balance: 77500 },
        { date: 'Aug 25', balance: 79200 },
        { date: 'Aug 27', balance: 84520 },
      ];
    } else if (timeRange === '3M') {
      return [
        { date: 'Jun 01', balance: 68500 },
        { date: 'Jun 15', balance: 71200 },
        { date: 'Jul 01', balance: 73800 },
        { date: 'Jul 15', balance: 75400 },
        { date: 'Aug 01', balance: 77200 },
        { date: 'Aug 27', balance: 84520 },
      ];
    } else if (timeRange === '6M') {
      return [
        { date: 'Mar', balance: 58000 },
        { date: 'Apr', balance: 64500 },
        { date: 'May', balance: 67200 },
        { date: 'Jun', balance: 71000 },
        { date: 'Jul', balance: 76500 },
        { date: 'Aug', balance: 84520 },
      ];
    } else {
      return [
        { date: 'Sep 25', balance: 42000 },
        { date: 'Nov 25', balance: 48500 },
        { date: 'Jan 26', balance: 53000 },
        { date: 'Mar 26', balance: 58000 },
        { date: 'May 26', balance: 67200 },
        { date: 'Jul 26', balance: 76500 },
        { date: 'Aug 26', balance: 84520 },
      ];
    }
  }, [timeRange]);

  // Spending Category Breakdown
  const spendingData = [
    { name: 'Housing & Rent', value: 3400, color: '#3B82F6' },
    { name: 'Food & Dining', value: 1240, color: '#10B981' },
    { name: 'Shopping & Tech', value: 980, color: '#8B5CF6' },
    { name: 'Transportation', value: 450, color: '#F59E0B' },
    { name: 'Utilities & Telecom', value: 380, color: '#06B6D4' },
    { name: 'Travel & Leisure', value: 680, color: '#EC4899' },
    { name: 'Subscriptions', value: 180, color: '#64748B' },
  ];

  // Cash Flow Data for Bar Chart
  const cashFlowData = [
    { month: 'Apr', income: 20950, expenses: 8400, net: 12550 },
    { month: 'May', income: 8450, expenses: 6200, net: 2250 },
    { month: 'Jun', income: 16900, expenses: 9100, net: 7800 },
    { month: 'Jul', income: 17136, expenses: 8900, net: 8236 },
    { month: 'Aug', income: 16900, expenses: 7420, net: 9480 },
  ];

  const recentTransactions = useMemo(() => {
    return transactions.filter(t => t.userId === currentUser.id).slice(0, 5);
  }, [transactions, currentUser.id]);

  const formatMoney = (amount: number) => {
    if (hideBalances) return '••••••';
    return `$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome & Security Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 dark:bg-[#16191E] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              PREMIER CLIENT PORTAL
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">FDIC Member Prototype</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome back, {currentUser.firstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Simulated banking environment active. Continuous fraud prevention and encrypted transaction pipelines operational.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('transfers')}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-[#0F1115] font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all"
          >
            <SendHorizontal className="w-4 h-4" />
            Transfer Funds
          </button>
          <button
            onClick={() => onNavigate('bills')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-2xl border border-slate-700/50 transition-all"
          >
            <Receipt className="w-4 h-4 text-slate-400" />
            Pay a Bill
          </button>
          <button
            onClick={() => onNavigate('statements')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-2xl border border-slate-700/50 transition-all"
          >
            <FileDown className="w-4 h-4 text-slate-400" />
            Statements
          </button>
        </div>
      </div>

      {/* Hero Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Net Balance Card */}
        <div className="bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Available Balance
            </span>
            <button
              onClick={toggleHideBalances}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title={hideBalances ? 'Show balance' : 'Hide balance'}
            >
              {hideBalances ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="mt-3">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatMoney(totalBalance)}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center text-xs font-semibold text-emerald-500 dark:text-emerald-400 gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> +$8,450.00 this month
              </span>
              <span className="text-[11px] text-slate-400">(+11.2%)</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <div>
              <span>Available: </span>
              <strong className="text-slate-800 dark:text-slate-200">{formatMoney(availableTotal)}</strong>
            </div>
            <div>
              <span>Pending: </span>
              <strong className="text-slate-800 dark:text-slate-200">{formatMoney(pendingTotal)}</strong>
            </div>
          </div>
        </div>

        {/* Checking & Reserves Breakdown */}
        <div className="bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Liquidity
              </span>
              <Badge variant="neutral">2 Deposit Accounts</Badge>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> Premier Checking (**4821)
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatMoney(24680.25)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> High-Yield Reserve (**1937)
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatMoney(59840.20)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Earning 4.75% APY monthly
            </span>
            <button 
              onClick={() => onNavigate('accounts')} 
              className="text-xs font-semibold text-slate-900 dark:text-white hover:text-emerald-400 flex items-center"
            >
              Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Credit Card & Liabilities */}
        <div className="bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Credit & Virtual Cards
              </span>
              <Badge variant="secondary">Metal Tier</Badge>
            </div>

            <div className="mt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">Current Balance:</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">-$1,240.30</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '8.2%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>$1,240.30 used</span>
                <span>$25,000.00 limit</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Auto-Pay active on Sep 2</span>
            <button 
              onClick={() => onNavigate('cards')} 
              className="text-xs font-semibold text-slate-900 dark:text-white hover:text-emerald-400 flex items-center"
            >
              Card Controls <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Accounts & Portfolios
          </h3>
          <button
            onClick={() => onNavigate('accounts')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white flex items-center gap-1"
          >
            View All Account Details <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {userAccounts.map(account => (
            <div
              key={account.id}
              onClick={() => onNavigate('accounts')}
              className="group bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-700 transition-all cursor-pointer shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                      {account.type} ACCOUNT
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {account.name}
                    </h4>
                  </div>
                  <Badge variant={account.status === 'ACTIVE' ? 'success' : 'warning'}>
                    ** {account.accountNumber}
                  </Badge>
                </div>

                <div className="mt-4">
                  <span className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {account.balance < 0 ? '-' : ''}{formatMoney(account.balance)}
                  </span>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {account.type === 'CREDIT' ? (
                      `Available Credit: ${formatMoney(account.availableBalance)}`
                    ) : (
                      `Available: ${formatMoney(account.availableBalance)}`
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[10px]">Routing: {account.routingNumber}</span>
                <span className="text-slate-900 dark:text-slate-200 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Manage <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Financial Analytics: Balance History & Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance History Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" /> Balance Trend Over Time
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simulated combined liquidity growth and asset valuation
              </p>
            </div>

            {/* Time Filter Tabs */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl gap-1 border border-slate-200 dark:border-slate-800">
              {(['7D', '30D', '3M', '6M', '1Y'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all ${
                    timeRange === range
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#334155' }} 
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={val => `$${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, 'Total Assets']}
                  contentStyle={{
                    backgroundColor: '#0F1115',
                    border: '1px solid #1E293B',
                    borderRadius: '1rem',
                    color: '#F8FAFC',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10B981', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#059669' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending Category Donut Chart */}
        <div className="bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-indigo-400" /> Spending Distribution
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  August Breakdown ($7,310 Total)
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
                    formatter={(val: number) => [`$${val.toLocaleString()}`, 'Amount']}
                    contentStyle={{
                      backgroundColor: '#0F1115',
                      border: '1px solid #1E293B',
                      borderRadius: '1rem',
                      color: '#F8FAFC',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            {spendingData.slice(0, 4).map(item => (
              <div key={item.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
                <span className="font-semibold text-slate-900 dark:text-white ml-auto">
                  ${item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cash Flow Bar Chart & Quick Beneficiaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-400" /> Cash Flow Dynamics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly Income vs Expenses vs Net Savings
              </p>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={val => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, '']}
                  contentStyle={{
                    backgroundColor: '#0F1115',
                    border: '1px solid #1E293B',
                    borderRadius: '1rem',
                    color: '#F8FAFC',
                    fontSize: '11px',
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="income" name="Inflow" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Outflow" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Send to Beneficiaries Widget */}
        <div className="bg-white dark:bg-[#16191E] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Quick Transfer
              </h3>
              <button
                onClick={() => onNavigate('transfers')}
                className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-400"
              >
                Manage Payees
              </button>
            </div>

            <div className="space-y-3">
              {beneficiaries.slice(0, 4).map(ben => (
                <div
                  key={ben.id}
                  onClick={() => onNavigate('transfers')}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex items-center justify-between transition-colors"
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
                  <button className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-400">
                    <SendHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigate('transfers')}
              className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-[#0F1115] text-xs font-bold transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> New Instant Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Activity Table */}
      <div className="bg-white dark:bg-[#16191E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Transaction Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live simulated transactions posted to your accounts
            </p>
          </div>
          <button
            onClick={() => onNavigate('transactions')}
            className="text-xs font-semibold text-slate-900 dark:text-white hover:text-emerald-400 flex items-center gap-1"
          >
            All Transactions <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {recentTransactions.map(tx => (
            <div
              key={tx.id}
              onClick={() => onNavigate('transactions')}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-2xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                  tx.amount > 0 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {tx.description}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{tx.category}</span>
                    <span>•</span>
                    <span className="font-mono text-[10px]">{tx.accountName}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-sm font-bold ${
                  tx.amount > 0 
                    ? 'text-emerald-500 dark:text-emerald-400' 
                    : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {tx.amount > 0 ? '+' : '-'}{formatMoney(tx.amount)}
                </span>
                <div className="mt-0.5">
                  <Badge variant={tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'neutral'} className="text-[10px] py-0 px-1.5">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
