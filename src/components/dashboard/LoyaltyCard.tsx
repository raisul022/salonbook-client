'use client';

import React, { useState } from 'react';
import { Crown, Sparkles, Gift, CheckCircle2, Copy, Check, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoyaltyCard() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'SALON-VIP-882';

  const copyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success('Referral code copied! Share with friends to earn 100 points.');
    setTimeout(() => setCopied(false), 2500);
  };

  const currentPoints = 380;
  const targetPoints = 500;
  const progressPercent = Math.min((currentPoints / targetPoints) * 100, 100);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-salon-950 text-white p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
      {/* Background Gold Ambient Radial */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Tier Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">Silver Connoisseur</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                  VIP Tier 2
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Earn 10 grooming points for every $1 spent on appointments.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
              {currentPoints}
            </span>
            <span className="text-xs text-stone-400 ml-1.5 font-medium">Grooming Points</span>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="py-6 space-y-2">
          <div className="flex justify-between text-xs text-stone-300">
            <span>Next Tier: <strong className="text-amber-300">Gold Patron</strong></span>
            <span>{targetPoints - currentPoints} points to unlock</span>
          </div>
          <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-salon-500 via-amber-400 to-amber-300 transition-all duration-700 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Active Tier Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-stone-200">10% Off All Treatments</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-stone-200">Free Hot Towel Upgrade</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-stone-200">Priority Peak Slots</span>
          </div>
        </div>

        {/* Referral Program */}
        <div className="mt-6 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-salon-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Give $15, Get 100 Points</p>
              <p className="text-[11px] text-stone-400">Share your referral link with friends.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 font-mono text-xs text-amber-300 font-bold select-all">
              {referralCode}
            </span>
            <button
              onClick={copyReferral}
              className="px-3 py-1.5 rounded-xl bg-salon-600 hover:bg-salon-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
