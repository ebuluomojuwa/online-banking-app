import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  Globe2, 
  Smartphone, 
  Clock, 
  User, 
  ArrowRight 
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

export const AdminFraudAlertsView: React.FC = () => {
  const { fraudAlerts, toggleFreezeUser } = useBanking();
  const [alerts, setAlerts] = useState(fraudAlerts);
  const [resolvedStatus, setResolvedStatus] = useState<Record<string, string>>({});

  const handleApprove = (alertId: string) => {
    setResolvedStatus(prev => ({ ...prev, [alertId]: 'APPROVED' }));
  };

  const handleDeclineAndFreeze = (alertId: string, userId: string) => {
    toggleFreezeUser(userId);
    setResolvedStatus(prev => ({ ...prev, [alertId]: 'FROZEN' }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          AML & Fraud Risk Monitoring
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Automated heuristic rule triggers, unusual device fingerprints, and geolocation anomalies
        </p>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {alerts.map(alert => {
          const statusOverride = resolvedStatus[alert.id];

          return (
            <div
              key={alert.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  alert.severity === 'HIGH' 
                    ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400' 
                    : 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                }`}>
                  <AlertOctagon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{alert.type}</h3>
                    <Badge variant={alert.severity === 'HIGH' ? 'destructive' : 'warning'}>
                      {alert.severity} SEVERITY
                    </Badge>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-xl">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 pt-1 font-mono">
                    <span>Account: {alert.userName}</span>
                    <span>•</span>
                    <span>Amount: ${alert.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span>•</span>
                    <span>Triggered: {new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="shrink-0 w-full md:w-auto">
                {statusOverride ? (
                  <div className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Resolution: {statusOverride}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(alert.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Clear
                    </button>
                    <button
                      onClick={() => handleDeclineAndFreeze(alert.id, alert.userId)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" /> Decline & Freeze User
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
