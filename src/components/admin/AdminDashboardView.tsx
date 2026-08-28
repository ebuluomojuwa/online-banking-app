import React from 'react';
import { 
  Users, 
  Wallet, 
  ArrowLeftRight, 
  AlertOctagon, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Lock, 
  CheckCircle2,
  ChevronRight,
  Landmark,
  FileText
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

interface AdminDashboardViewProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onNavigate }) => {
  const { users, accounts, transactions, fraudAlerts, auditLogs } = useBanking();

  // Aggregate Institutional Metrics
  const totalCustomerDeposits = accounts
    .filter(a => a.type !== 'CREDIT')
    .reduce((sum, a) => sum + a.balance, 0);

  const totalCreditExposure = accounts
    .filter(a => a.type === 'CREDIT')
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const pendingRiskAlerts = fraudAlerts.filter(f => f.status === 'UNDER_REVIEW');
  const recentAuditEntries = auditLogs.slice(0, 6);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-zinc-900 to-zinc-950 text-white p-6 sm:p-8 rounded-3xl border border-amber-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Institutional Admin Console
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">Compliance Tier 1</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Treasury & Risk Command Center
          </h1>
          <p className="text-xs text-zinc-400 max-w-xl">
            Real-time multi-account ledger auditing, automated AML monitoring, and administrative customer operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('admin-customers')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Manage Customers
          </button>
          <button
            onClick={() => onNavigate('admin-fraud')}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl border border-zinc-700"
          >
            Risk Queue ({pendingRiskAlerts.length})
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Vault Deposits */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Customer Deposits</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white mt-3">
            ${totalCustomerDeposits.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% YoY Vault Reserves
          </div>
        </div>

        {/* Total Customers */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Users</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white mt-3">
            {users.length}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">
            100% KYC Verified Tier 3
          </div>
        </div>

        {/* Total Credit Exposure */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Credit Exposure</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white mt-3">
            ${totalCreditExposure.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">
            0.04% Institutional Default Rate
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Risk Triggers</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mt-3">
            {pendingRiskAlerts.length}
          </div>
          <div className="text-[11px] text-rose-500 font-medium mt-2">
            Requires compliance triage
          </div>
        </div>
      </div>

      {/* Grid: Live Risk Queue & Recent System Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Risk & Fraud Queue (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Live Fraud & Risk Watchlist
              </h2>
              <p className="text-xs text-zinc-400">High anomaly transactions flagged by automated engine</p>
            </div>
            <button
              onClick={() => onNavigate('admin-fraud')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              All Alerts ({fraudAlerts.length})
            </button>
          </div>

          <div className="space-y-3">
            {fraudAlerts.map(alert => (
              <div
                key={alert.id}
                onClick={() => onNavigate('admin-fraud')}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 hover:border-amber-300 dark:hover:border-amber-700 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-900 dark:text-white">{alert.type}</span>
                  <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'warning'}>
                    {alert.severity} RISK
                  </Badge>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">{alert.description}</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1">
                  <span>Target: {alert.userName} (${alert.amount.toLocaleString()})</span>
                  <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Immutable Audit Log Trail (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Institutional Audit Logs
              </h2>
              <p className="text-xs text-zinc-400">Cryptographically signed staff action ledger</p>
            </div>
            <button
              onClick={() => onNavigate('admin-audit')}
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center"
            >
              Full Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {recentAuditEntries.map(log => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>{log.action}</span>
                    <Badge variant="neutral" className="text-[9px] py-0 px-1 font-mono">
                      {log.targetType}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500">{log.details}</p>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Staff: {log.userName} • IP: {log.ipAddress}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
