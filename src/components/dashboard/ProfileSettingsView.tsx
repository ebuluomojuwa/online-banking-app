import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles,
  Sliders,
  DollarSign,
  Globe
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, switchUser, users, resetAllData } = useBanking();

  const [firstName, setFirstName] = useState(currentUser.firstName);
  const [lastName, setLastName] = useState(currentUser.lastName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Client Profile & Preferences
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Manage personal contact records, KYC compliance status, and simulation personas
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#1C0407] p-6 sm:p-8 rounded-3xl border border-[#38080E] shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white text-xl font-bold border border-rose-400/40 shadow-md">
          {(currentUser.firstName || 'P').charAt(0)}{(currentUser.lastName || 'C').charAt(0)}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <Badge variant="success">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> KYC Verified Level 3
            </Badge>
          </div>
          <p className="text-xs text-zinc-500">{currentUser.email}</p>
          <div className="text-[11px] text-zinc-400 pt-1">
            Member Since: {new Date(currentUser.memberSince || currentUser.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • Customer ID: #{currentUser.customerId || (currentUser.id ? currentUser.id.slice(0, 6).toUpperCase() : 'HSBC-PREMIER')}
          </div>
        </div>
      </div>

      {/* Persona Switcher Box (for Demo testing) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 dark:border-amber-900/50 p-6 rounded-3xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
            Prototype Persona Switcher
          </h3>
        </div>
        <p className="text-xs text-amber-800/80 dark:text-amber-400/80">
          Switch between simulated customer and administrative staff accounts to evaluate different permission tiers:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {users.map(u => (
            <button
              key={u.id}
              onClick={() => switchUser(u.id)}
              className={`p-3 rounded-2xl border text-left transition-all text-xs ${
                u.id === currentUser.id
                  ? 'border-amber-500 bg-white dark:bg-zinc-900 shadow-xs ring-2 ring-amber-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 hover:bg-white dark:hover:bg-zinc-900'
              }`}
            >
              <div className="font-bold text-zinc-900 dark:text-white">{u.firstName} {u.lastName}</div>
              <div className="text-[10px] text-zinc-400 uppercase font-semibold mt-0.5">{u.role}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Personal Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
          Contact & Domicile Details
        </h3>

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-2 text-xs border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" /> Profile details saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Primary Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">Mobile Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-xs hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Mock Data */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-3xl border border-rose-200 dark:border-rose-900/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
            Reset Prototype Storage
          </h3>
          <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">
            Clear customized local records and re-seed with fresh 100+ transactions and accounts.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo state to fresh mock seed data?')) {
              resetAllData();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Re-Seed Prototype Data
        </button>
      </div>
    </div>
  );
};
