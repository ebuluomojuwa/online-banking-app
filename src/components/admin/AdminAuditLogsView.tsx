import React, { useState } from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

export const AdminAuditLogsView: React.FC = () => {
  const { auditLogs } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter(log => {
    if (selectedActionFilter !== 'ALL' && !log.action.includes(selectedActionFilter)) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.userName.toLowerCase().includes(q) ||
        log.ipAddress.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Institutional Audit & Compliance Ledger
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Tamper-evident chronological record of all administrative modifications, authentication events, and transactions
          </p>
        </div>

        <button
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              ["Timestamp,User,Action,Target,IPAddress,Details"]
              .concat(filteredLogs.map(l => `"${l.timestamp}","${l.userName}","${l.action}","${l.targetType}","${l.ipAddress}","${l.details}"`))
              .join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `hsbc_audit_logs_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold rounded-xl text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs"
        >
          <Download className="w-4 h-4 text-zinc-500" /> Export Audit CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by action, details, staff name, IP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-medium">Filter:</span>
          <select
            value={selectedActionFilter}
            onChange={e => setSelectedActionFilter(e.target.value)}
            className="p-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="LOGIN">Auth & Logins</option>
            <option value="TRANSFER">Fund Transfers</option>
            <option value="FREEZE">Freeze / Lock Actions</option>
            <option value="CARD">Card Control Changes</option>
            <option value="REVERSAL">Administrative Reversals</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-6">Details / Payload</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-6 text-zinc-500 whitespace-nowrap font-sans">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                  </td>

                  <td className="py-3.5 px-4 font-sans font-semibold text-zinc-900 dark:text-white whitespace-nowrap">
                    {log.userName}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{log.action}</span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap font-sans">
                    <Badge variant="neutral" className="text-[10px] font-mono">
                      {log.targetType} #{log.targetId ? log.targetId.slice(0, 6) : 'SYS'}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-6 font-sans text-zinc-600 dark:text-zinc-300">
                    {log.details}
                  </td>

                  <td className="py-3.5 px-4 text-right text-zinc-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
