import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Sliders, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { User } from '../../types';
import { Badge, Modal } from '../ui';

interface AdminCustomersViewProps {
  onNavigate: (view: string) => void;
}

export const AdminCustomersView: React.FC<AdminCustomersViewProps> = ({ onNavigate }) => {
  const { users, accounts, toggleFreezeUser, switchUser } = useBanking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const filteredUsers = users.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Customer Directory & KYC Management
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Audit customer accounts, manage KYC compliance tiers, freeze accounts, and adjust credit lines
          </p>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs rounded-xl text-zinc-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Customer Name</th>
                <th className="py-3.5 px-4">Email & Phone</th>
                <th className="py-3.5 px-4">Role Tier</th>
                <th className="py-3.5 px-4">KYC Status</th>
                <th className="py-3.5 px-4">Total Balance</th>
                <th className="py-3.5 px-4 text-center">Account Status</th>
                <th className="py-3.5 px-6 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredUsers.map(user => {
                const userAccts = accounts.filter(a => a.userId === user.id);
                const totalBal = userAccts.reduce((sum, a) => sum + (a.type === 'CREDIT' ? 0 : a.balance), 0);

                return (
                  <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 font-bold text-xs">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <span className="text-[10px] text-zinc-400 font-mono">ID: #{user.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-zinc-600 dark:text-zinc-300">
                      <div>{user.email}</div>
                      <span className="text-[11px] text-zinc-400">{user.phone}</span>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant={user.role === 'ADMIN' ? 'warning' : 'neutral'}>
                        {user.role}
                      </Badge>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant="success" className="text-[10px]">
                        <ShieldCheck className="w-3 h-3 mr-1 inline" /> {user.kycStatus}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 font-bold text-zinc-900 dark:text-white font-mono">
                      ${totalBal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <Badge variant={user.status === 'ACTIVE' ? 'success' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Impersonate / Switch View */}
                        <button
                          onClick={() => {
                            switchUser(user.id);
                            onNavigate('dashboard');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-[11px] flex items-center gap-1"
                          title="Switch to customer dashboard"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>

                        {/* Freeze / Unfreeze */}
                        <button
                          onClick={() => toggleFreezeUser(user.id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold ${
                            user.status === 'FROZEN'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                          }`}
                          title={user.status === 'FROZEN' ? 'Unfreeze User Account' : 'Freeze User Account'}
                        >
                          {user.status === 'FROZEN' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
