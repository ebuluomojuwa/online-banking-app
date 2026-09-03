import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Key
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Badge } from '../ui';
import { ChangePasswordForm } from './ChangePasswordForm';

export const ProfileSettingsView: React.FC = () => {
  const { currentUser } = useBanking();

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
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Account Settings & Security
        </h1>
        <p className="text-xs text-rose-300/70 mt-1">
          Manage your personal profile records, change portal security credentials, and KYC status
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-[#1C0407] p-6 sm:p-8 rounded-3xl border border-[#38080E] shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center text-white text-xl font-bold border border-rose-400/40 shadow-md">
          {(currentUser.firstName || 'P').charAt(0)}{(currentUser.lastName || 'C').charAt(0)}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-white">
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <Badge variant="success">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline" /> KYC Verified Level 3
            </Badge>
          </div>
          <p className="text-xs text-rose-300/80">{currentUser.email}</p>
          <div className="text-[11px] text-rose-400/70 pt-1">
            Member Since: {new Date(currentUser.memberSince || currentUser.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • Customer ID: #{currentUser.customerId || (currentUser.id ? currentUser.id.slice(0, 6).toUpperCase() : 'NOVA-PREMIER')}
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div id="change-password-section" className="bg-[#1C0407] rounded-3xl border border-[#38080E] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#38080E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Change Account Password
              </h3>
              <p className="text-xs text-rose-300/70">
                Update your login password securely through Firebase Authentication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-rose-300/70 bg-[#0E0103] px-3 py-1.5 rounded-xl border border-[#38080E] self-start sm:self-auto">
            <Key className="w-3.5 h-3.5 text-rose-400" />
            <span>Encrypted Authentication</span>
          </div>
        </div>

        <ChangePasswordForm />
      </div>

      {/* Edit Personal Details Form */}
      <form onSubmit={handleSaveProfile} className="bg-[#1C0407] rounded-3xl border border-[#38080E] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-2 border-b border-[#38080E]">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Contact & Profile Details
            </h3>
            <p className="text-xs text-rose-300/70">
              Personal contact records and preferences
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4" /> Profile details saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-rose-200/90 uppercase tracking-wider text-[11px]">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full p-3 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-rose-200/90 uppercase tracking-wider text-[11px]">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full p-3 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-rose-200/90 uppercase tracking-wider text-[11px]">Primary Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-rose-200/90 uppercase tracking-wider text-[11px]">Mobile Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-3 bg-[#0E0103] border border-[#38080E] rounded-xl text-white placeholder-rose-400/40 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Save Profile Details
          </button>
        </div>
      </form>
    </div>
  );
};
