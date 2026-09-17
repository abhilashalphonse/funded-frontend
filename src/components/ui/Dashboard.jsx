import React, { useState, useEffect } from 'react';
import ReactCountryFlag from "react-country-flag";
import acg from '../../assets/ACG.png';
import { 
  User, Menu, BarChart2, X, ChevronRight, LayoutDashboard, Gem, Users, GraduationCap, 
  CreditCard, Trophy, MessageSquare, Clock, Flag, ChevronDown,
  Shield, Bell, Globe, Check, Search, ArrowUpRight, Percent, DollarSign,
  BookOpen, Play, Lock, Award, BarChart3, Download, Receipt, Plus, Wallet, 
  ExternalLink, Activity, TrendingUp, AlertTriangle, CheckCircle2, Zap,
   Layers, ShieldCheck, Flame, AlertCircle, LogOut, Loader2
} from 'lucide-react';
import { useAuth } from "../../AuthContext"; 
import { cancelFreeTrial, createFreeTrialTradingSession, getActiveFreeTrial, getFreeTrialHistory } from "../../services/freeTrialApi.js";

const pageDetails = {
  overview: { title: 'Account #509421', description: 'Your live evaluation account', action: 'Open WebTrader' },
  analytics: { title: 'Advanced Metrics', description: 'Performance and risk analysis', action: 'Export report' },
  calendar: { title: 'Economic Calendar', description: 'Market events and trading restrictions', action: 'View schedule' },
  traders: { title: 'Traders', description: 'Explore active funded peers', action: 'Browse all traders' },
  academy: { title: 'Academy', description: 'Continue your trading education', action: 'My progress' },
  billing: { title: 'Billing', description: 'Payout methods, invoices, and payment details', action: 'Payment settings' },
  leaderboard: { title: 'Leaderboard', description: 'Current payout-cycle standings', action: 'View rules' },
  profile: { title: 'Profile Settings', description: 'Manage your account preferences', action: 'Save changes' },
};

const PageHeader = ({ activeTab }) => {
  const page = pageDetails[activeTab];

  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-[#222222] pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded border border-[#222222] bg-[#0A0A0A] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[#888888]">Phase 1 Evaluation</span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#888888]"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Live Connection</span>
        </div>
        <h1 className="text-[28px] font-medium leading-none tracking-tight text-white sm:text-[32px]">{page.title}</h1>
        <p className="mt-2 text-[13px] text-[#888888]">{page.description}</p>
      </div>
      <button className="h-8 w-fit rounded-md bg-white px-4 text-[13px] font-medium text-black transition-colors hover:bg-[#EBEBEB] focus:outline-none focus:ring-2 focus:ring-white/20">{page.action}</button>
    </header>
  );
};



const clampPercent = (value) => Math.max(0, Math.min(100, Number(value) || 0));
const formatUSD = (value) => `${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function daysRemaining(expiresAt) {
  if (!expiresAt) return 0;
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000));
}

function FreeTrialActiveCard({ trial, launching, cancelling, onContinue, onCancel }) {
  if (!trial) return null;

  const initial = Number(trial.initialDeposit || trial.accountSize || 0);
  const profit = Number(trial.projections?.profit || 0);
  const phaseRule = trial.rules?.phases?.find(item => Number(item.phase) === Number(trial.currentPhase || 1)) || trial.rules?.phases?.[0];
  const targetPct = Number(phaseRule?.profitTarget || 0);
  const targetAmount = initial * targetPct / 100;
  const progress = targetAmount > 0 ? clampPercent((Math.max(0, profit) / targetAmount) * 100) : 0;
  const tradingDays = Number(trial.projections?.tradingDays || 0);
  const minimumTradingDays = Number(trial.rules?.minimumTradingDays || 0);
  const dailyLimit = initial * Number(trial.rules?.dailyDrawdown || 0) / 100;
  const maxLimit = initial * Number(trial.rules?.maxDrawdown || 0) / 100;
  const dailyRemaining = Math.max(0, dailyLimit - Number(trial.projections?.dailyLoss || 0));
  const maxRemaining = Math.max(0, maxLimit - Number(trial.projections?.totalLoss || 0));

  return (
    <section className="rounded-xl border border-white/[0.12] bg-[#0A0A0A] overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-[#222222] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded border border-white/[0.14] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
              Free Trial
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            {formatUSD(trial.accountSize).replace(".00", "")} · {trial.challengeType === "TWO_STEP" ? "2-Step" : "1-Step"}
          </h2>
          <p className="mt-1 text-[12px] text-[#777777]">
            {daysRemaining(trial.trial?.expiresAt)} days remaining · Account {trial.accountId}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onContinue(trial)}
            disabled={launching}
            className="flex h-9 items-center justify-center gap-2 rounded-md bg-white px-4 text-[12px] font-semibold text-black transition-colors hover:bg-[#EBEBEB] disabled:opacity-50"
          >
            {launching && <Loader2 size={14} className="animate-spin" />}
            {launching ? "Opening ACG Trader…" : "Continue Trading"}
          </button>
          <button
            type="button"
            onClick={() => onCancel(trial)}
            disabled={cancelling}
            className="flex h-9 items-center justify-center gap-2 rounded-md border border-[#2A2A2A] px-4 text-[12px] font-medium text-[#888888] transition-colors hover:border-[#444444] hover:text-white disabled:opacity-50"
          >
            {cancelling && <Loader2 size={14} className="animate-spin" />}
            {cancelling ? "Cancelling…" : "Cancel Trial"}
          </button>
        </div>
      </div>

      <div className="grid gap-px bg-[#222222] sm:grid-cols-4">
        <div className="bg-[#0A0A0A] p-5">
          <div className="text-[11px] uppercase tracking-wider text-[#666666]">Profit</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{formatUSD(profit)}</div>
          <div className="mt-2 text-[11px] text-[#777777]">Target {formatUSD(targetAmount)}</div>
        </div>
        <div className="bg-[#0A0A0A] p-5">
          <div className="text-[11px] uppercase tracking-wider text-[#666666]">Trading Days</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{tradingDays} / {minimumTradingDays}</div>
          <div className="mt-2 text-[11px] text-[#777777]">Minimum requirement</div>
        </div>
        <div className="bg-[#0A0A0A] p-5">
          <div className="text-[11px] uppercase tracking-wider text-[#666666]">Daily Loss Remaining</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{formatUSD(dailyRemaining)}</div>
          <div className="mt-2 text-[11px] text-[#777777]">Limit {formatUSD(dailyLimit)}</div>
        </div>
        <div className="bg-[#0A0A0A] p-5">
          <div className="text-[11px] uppercase tracking-wider text-[#666666]">Max Loss Remaining</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{formatUSD(maxRemaining)}</div>
          <div className="mt-2 text-[11px] text-[#777777]">Limit {formatUSD(maxLimit)}</div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#888888]">Profit target progress</span>
          <span className="font-mono text-white">{Math.round(progress)}%</span>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#242424]">
          <div className="h-full bg-white transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] text-[#666666]">
          <span>{targetPct}% target</span>
          <span>{daysRemaining(trial.trial?.expiresAt)} days left</span>
        </div>
      </div>
    </section>
  );
}

function FreeTrialHistory({ trials }) {
  if (!trials?.length) return null;

  return (
    <section className="rounded-xl border border-[#222222] bg-[#0A0A0A] overflow-hidden">
      <div className="border-b border-[#222222] px-5 py-4">
        <h2 className="text-[14px] font-medium text-white">Free Trial History</h2>
        <p className="mt-1 text-[11px] text-[#666666]">Your previous simulated evaluations remain visible here.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead className="border-b border-[#222222] bg-[#080808] text-[10px] uppercase tracking-wider text-[#666666]">
            <tr>
              <th className="px-5 py-3 font-medium">Challenge</th>
              <th className="px-4 py-3 font-medium">Result</th>
              <th className="px-4 py-3 font-medium">Profit</th>
              <th className="px-4 py-3 font-medium">Trading Days</th>
              <th className="px-5 py-3 text-right font-medium">Completed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1F1F1F] text-[12px]">
            {trials.map(trial => (
              <tr key={trial.accountId} className="hover:bg-white/[0.015]">
                <td className="px-5 py-4">
                  <div className="font-medium text-white">{formatUSD(trial.accountSize).replace(".00", "")}</div>
                  <div className="mt-0.5 text-[10px] text-[#666666]">{trial.challengeType === "TWO_STEP" ? "2-Step" : "1-Step"} · {trial.accountId}</div>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#CCCCCC]">
                    {trial.trial?.result || trial.status}
                  </span>
                </td>
                <td className="px-4 py-4 font-mono text-[#D8D8D8]">{formatUSD(trial.projections?.profit || 0)}</td>
                <td className="px-4 py-4 font-mono text-[#888888]">{Number(trial.projections?.tradingDays || 0)}</td>
                <td className="px-5 py-4 text-right text-[#777777]">
                  {trial.trial?.completedAt ? new Date(trial.trial.completedAt).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const OverviewSection = ({ freeTrial, freeTrialHistory, freeTrialLoading, freeTrialError, launchingTrial, cancellingTrial, onContinueTrial, onCancelTrial }) => {
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {freeTrialLoading && (
        <div className="flex items-center gap-2 rounded-xl border border-[#222222] bg-[#0A0A0A] px-5 py-4 text-[12px] text-[#888888]">
          <Loader2 size={14} className="animate-spin" />
          Loading your Free Trial…
        </div>
      )}

      {freeTrialError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.04] px-5 py-4 text-[12px] text-red-300">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{freeTrialError}</span>
        </div>
      )}

      {!freeTrialLoading && freeTrial && (
        <FreeTrialActiveCard
          trial={freeTrial}
          launching={launchingTrial}
          cancelling={cancellingTrial}
          onContinue={onContinueTrial}
          onCancel={onCancelTrial}
        />
      )}

      {!freeTrialLoading && !freeTrial && !freeTrialError && (
        <div className="rounded-xl border border-[#222222] bg-[#0A0A0A] px-5 py-4">
          <div className="text-[13px] font-medium text-white">No active Free Trial</div>
          <p className="mt-1 text-[11px] text-[#666666]">Start a Free Trial from the challenge builder whenever you want to practice.</p>
        </div>
      )}

      <FreeTrialHistory trials={freeTrialHistory} />
            
            {/* Core Metrics Grid - Absolute minimalism, tabular numbers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Balance Card */}
              <div className="p-6 rounded-xl border border-[#222222] bg-[#0A0A0A]">
                <div className="text-[13px] text-[#888888] mb-4">Current Balance</div>
                <div className="text-[32px] font-semibold tracking-tighter text-white tabular-nums leading-none">
                  $104,250<span className="text-[#888888]">.00</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between text-[13px]">
                  <span className="text-[#888888]">Initial</span>
                  <span className="text-[#EDEDED] tabular-nums">$100,000.00</span>
                </div>
              </div>

              {/* Equity Card */}
              <div className="p-6 rounded-xl border border-[#222222] bg-[#0A0A0A]">
                <div className="text-[13px] text-[#888888] mb-4">Floating Equity</div>
                <div className="text-[32px] font-semibold tracking-tighter text-white tabular-nums leading-none">
                  $105,110<span className="text-[#888888]">.00</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between text-[13px]">
                  <span className="text-[#888888]">Active PnL</span>
                  <span className="text-emerald-400 tabular-nums flex items-center gap-1">
                    <ArrowUpRight size={14} /> $860.00
                  </span>
                </div>
              </div>

              {/* Drawdown Card */}
              <div className="p-6 rounded-xl border border-[#222222] bg-[#0A0A0A]">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-[13px] text-[#888888]">Daily Drawdown</div>
                  <div className="text-[12px] text-[#888888] font-mono">23%</div>
                </div>
                <div className="text-[32px] font-semibold tracking-tighter text-white tabular-nums leading-none mb-4">
                  $1,150<span className="text-[#888888]">.00</span>
                </div>
                {/* 1px Progress Bar */}
                <div className="w-full h-[1px] bg-[#333333]">
                  <div className="h-full bg-white w-[23%]" />
                </div>
                <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between text-[13px]">
                  <span className="text-[#888888]">Hard Limit</span>
                  <span className="text-[#EDEDED] tabular-nums">$5,000.00</span>
                </div>
              </div>

              {/* Max Loss Card */}
              <div className="p-6 rounded-xl border border-[#222222] bg-[#0A0A0A]">
                <div className="text-[13px] text-[#888888] mb-4">Max Overall Loss</div>
                <div className="text-[32px] font-semibold tracking-tighter text-white tabular-nums leading-none">
                  $0<span className="text-[#888888]">.00</span>
                </div>
                <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between text-[13px]">
                  <span className="text-[#888888]">Status</span>
                  <span className="text-[#EDEDED] flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" /> Optimal
                  </span>
                </div>
              </div>
            </div>

            {/* List/Table Section - Stripe/Linear Issue Tracker Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
              
              <div className="lg:col-span-2">
                <h2 className="text-[14px] font-medium text-white mb-4">Trading Objectives</h2>
                <div className="border border-[#222222] rounded-xl bg-[#0A0A0A] overflow-hidden">
                  
                  {/* Row 1 */}
                  <div className="flex items-center justify-between p-4 border-b border-[#222222]">
                    <div>
                      <div className="text-[13px] text-[#EDEDED] mb-1">Profit Target (8%)</div>
                      <div className="text-[13px] text-[#888888] font-mono tabular-nums">
                        $4,250.00 / $8,000.00
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-[160px]">
                      <div className="flex-1 h-[1px] bg-[#333333]">
                        <div className="h-full bg-white w-[53%]" />
                      </div>
                      <span className="text-[12px] text-[#888888] font-mono w-8 text-right">53%</span>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="text-[13px] text-[#EDEDED] mb-1">Minimum Trading Days</div>
                      <div className="text-[13px] text-[#888888] font-mono tabular-nums">
                        4 / 5 Days
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] text-[#888888]">
                      <Clock size={12} />
                      Pending
                    </div>
                  </div>
                </div>
              </div>

              {/* Economic Calendar - Extreme Minimalism */}
              <div>
                <h2 className="text-[14px] font-medium text-white mb-4 flex items-center justify-between">
                  Economic Events
                  <span className="text-[12px] text-[#888888] font-normal">Today</span>
                </h2>
                
                <div className="space-y-1">
                  {/* Event 1 */}
                  <div className="flex items-start justify-between p-3 rounded-lg hover:bg-[#111111] transition-colors group cursor-default">
                    <div className="flex gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <div>
                        <div className="text-[13px] text-[#EDEDED]">Core Retail Sales</div>
                        <div className="text-[12px] text-[#888888] mt-0.5">USD • High Impact</div>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#888888] font-mono group-hover:text-[#EDEDED] transition-colors">
                      13:30
                    </div>
                  </div>

                  {/* Event 2 */}
                  <div className="flex items-start justify-between p-3 rounded-lg hover:bg-[#111111] transition-colors group cursor-default">
                    <div className="flex gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                      <div>
                        <div className="text-[13px] text-[#EDEDED]">Lagarde Speaks</div>
                        <div className="text-[12px] text-[#888888] mt-0.5">EUR • Med Impact</div>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#888888] font-mono group-hover:text-[#EDEDED] transition-colors">
                      14:45
                    </div>
                  </div>
                </div>
              </div>

            </div>
    </div>
  );
}
const AnalyticsSection = () => {
  const performanceStats = [
    { metric: "Win Rate", value: "68.4%", industryAvg: "54.0%", status: "Optimal", type: "success" },
    { metric: "Profit Factor", value: "2.41", industryAvg: "1.65", status: "Strong", type: "success" },
    { metric: "Average Winning Trade", value: "+$1,840.00", industryAvg: "+$1,200.00", status: "Above Avg", type: "neutral" },
    { metric: "Average Losing Trade", value: "-$760.00", industryAvg: "-$850.00", status: "Controlled", type: "success" },
    { metric: "Max Consecutive Wins", value: "9 Trades", industryAvg: "5 Trades", status: "Exceptional", type: "success" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top 3 High-Level Analytics Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* Sharpe Ratio Card */}
        <div className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-5 text-center space-y-3 order-2 md:order-1 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-gray-500 font-black text-xs uppercase tracking-wider">Risk Eff.</div>
          <div className="w-12 h-12 rounded-full bg-white/[0.06] mx-auto border border-white/[0.12] flex items-center justify-center text-sm font-bold text-white">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Sharpe Ratio</h4>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">Risk-Adjusted Return Metric</p>
          </div>
          <div className="text-sm font-black text-white font-mono">2.84</div>
          <span className="text-[10px] text-gray-500 font-medium bg-white/[0.02] px-2 py-0.5 rounded-full mx-auto border border-white/[0.08]">Excellent Grade</span>
        </div>

        {/* Profit Factor Card - Main Highlight */}
        <div className="bg-[#0A0C12] border-2 border-white/[0.08] rounded-2xl p-6 text-center space-y-3 order-1 md:order-2 md:h-[250px] flex flex-col justify-center relative shadow-xl shadow-white/[0.04]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] uppercase font-black px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Activity size={10} /> Live Efficiency
          </div>
          <div className="w-16 h-16 rounded-full bg-white/[0.06] mx-auto border-2 border-white/40 flex items-center justify-center text-base font-bold text-white">
            <Percent size={22} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Current Win Rate</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Calculated across 84 trades</p>
          </div>
          <div className="text-xl font-black text-white font-mono tracking-tight">68.40%</div>
          <span className="text-[10px] text-white font-bold bg-white/[0.06] px-2 py-0.5 rounded-full mx-auto border border-white/[0.15]">Target: &gt;50%</span>
        </div>

        {/* Profit Factor Metric */}
        <div className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-5 text-center space-y-3 order-3 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-gray-600 font-black text-xs uppercase tracking-wider">Multiplication</div>
          <div className="w-12 h-12 rounded-full bg-white/[0.06] mx-auto border border-white/[0.12] flex items-center justify-center text-sm font-bold text-white">
            <Layers size={20} className="text-gray-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Profit Factor</h4>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">Gross Profits / Gross Losses</p>
          </div>
          <div className="text-sm font-black text-white font-mono">2.41</div>
          <span className="text-[10px] text-gray-500 font-medium bg-white/[0.02] px-2 py-0.5 rounded-full mx-auto border border-white/[0.08]">Breakeven: 1.0</span>
        </div>
      </section>

      {/* Deep Metrics Table Grid */}
      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Advanced Performance Matrix</h2>
            <p className="text-xs text-gray-400 mt-0.5">Comprehensive structural breakdown of historical simulated account execution.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03]">
                <th className="py-3 px-6">Performance Statistic</th>
                <th className="py-3 px-4 text-center">Your Account Matrix</th>
                <th className="py-3 px-4 text-center">Global Benchmark Baseline</th>
                <th className="py-3 px-6 text-right">Status Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-gray-300">
              {performanceStats.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition group">
                  <td className="py-4 px-6 font-semibold text-white">{row.metric}</td>
                  <td className="py-4 px-4 text-center font-bold text-white font-mono">{row.value}</td>
                  <td className="py-4 px-4 text-center text-gray-500 font-mono">{row.industryAvg}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        row.type === 'success' 
                          ? 'text-white bg-white/[0.06] border-white/[0.15]' 
                          : 'text-gray-400 bg-white/[0.02] border-white/[0.08]'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
const CalendarSection = () => {
  const [search, setSearch] = useState("");
  const events = [
    { time: "13:30 GMT", currency: "USD", impact: "High", event: "Core Retail Sales (MoM)", forecast: "0.2%", previous: "0.1%", restriction: "Blocked Window: 13:28 - 13:32" },
    { time: "14:45 GMT", currency: "USD", impact: "Medium", event: "Flash Manufacturing PMI", forecast: "51.4", previous: "50.7", restriction: "Monitoring Advised" },
    { time: "15:00 GMT", currency: "EUR", impact: "High", event: "ECB President Lagarde Speech", forecast: "N/A", previous: "N/A", restriction: "Blocked Window: 14:58 - 15:02" },
    { time: "23:30 GMT", currency: "AUD", impact: "Medium", event: "RBA Meeting Minutes", forecast: "N/A", previous: "N/A", restriction: "Monitoring Advised" },
    { time: "07:00 GMT", currency: "GBP", impact: "Low", event: "Public Sector Net Borrowing", forecast: "11.2B", previous: "13.4B", restriction: "Unrestricted" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Critical Action Alerts (Matches Top 3 Blocks structure) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* Total Events Tracking */}
        <div className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-5 text-center space-y-3 order-2 md:order-1 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-gray-500 font-black text-xs uppercase tracking-wider">Schedule</div>
          <div className="w-12 h-12 rounded-full bg-white/[0.06] mx-auto border border-white/[0.12] flex items-center justify-center text-sm font-bold text-gray-400">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Daily Macro Schedule</h4>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">Monitored Liquidity Triggers</p>
          </div>
          <div className="text-sm font-black text-white font-mono">5 Events Tracked</div>
          <span className="text-[10px] text-gray-500 font-medium bg-white/[0.02] px-2 py-0.5 rounded-full mx-auto border border-white/[0.08]">Timezone: GMT / UTC</span>
        </div>

        {/* Center Alert - Strict Risk Banner */}
        <div className="bg-[#0A0C12] border-2 border-white/[0.08] rounded-2xl p-6 text-center space-y-3 order-1 md:order-2 md:h-[250px] flex flex-col justify-center relative shadow-xl shadow-white/[0.03]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] uppercase font-black px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Flame size={10} fill="currentColor" /> Critical Safety Rule
          </div>
          <div className="w-16 h-16 rounded-full bg-white/[0.06] mx-auto border-2 border-white/[0.3] flex items-center justify-center text-base font-bold text-white">
            <AlertTriangle size={22} className="text-gray-300" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">2-Min Execution Rule</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">Strict platform protocol enforcement</p>
          </div>
          <div className="text-sm font-black text-gray-400 font-mono tracking-tight">±2 Min High Impact Windows</div>
          <span className="text-[10px] text-gray-400 font-bold bg-white/[0.05] px-2 py-0.5 rounded-full mx-auto border border-white/[0.12]">Violations Void Performance</span>
        </div>

        {/* Upcoming Lockout */}
        <div className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-5 text-center space-y-3 order-3 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-gray-600 font-black text-xs uppercase tracking-wider">Next Hazard</div>
          <div className="w-12 h-12 rounded-full bg-white/[0.06] mx-auto border border-white/[0.12] flex items-center justify-center text-sm font-bold text-white">
            <AlertCircle size={20} className="text-gray-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">USD Core Retail Sales</h4>
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">High volatility index output</p>
          </div>
          <div className="text-sm font-black text-gray-400 font-mono">In 2h 45m</div>
          <span className="text-[10px] text-gray-500 font-medium bg-white/[0.02] px-2 py-0.5 rounded-full mx-auto border border-white/[0.08]">Action: Restrict Executions</span>
        </div>
      </section>

      {/* Main Calendar Data Table */}
      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Economic Event Feed</h2>
            <p className="text-xs text-gray-400 mt-0.5">Real-time macro timeline track. Blocked periods indicate operational trade suspension rules.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"><Search size={14} /></span>
            <input type="text" placeholder="Filter currency or event..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 transition outline-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03]">
                <th className="py-3 px-6 w-28">Time</th>
                <th className="py-3 px-4 text-center w-20">Currency</th>
                <th className="py-3 px-4 text-center w-24">Impact</th>
                <th className="py-3 px-4">Macroeconomic Event</th>
                <th className="py-3 px-4 text-center w-20">Forecast</th>
                <th className="py-3 px-4 text-center w-20">Previous</th>
                <th className="py-3 px-6 text-right">Rule Restriction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-gray-300">
              {events.filter(e => e.event.toLowerCase().includes(search.toLowerCase()) || e.currency.toLowerCase().includes(search.toLowerCase())).map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition group">
                  <td className="py-4 px-6 font-bold text-gray-400 font-mono group-hover:text-white">{row.time}</td>
                  <td className="py-4 px-4 text-center font-bold text-white font-mono">{row.currency}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                        row.impact === 'High' 
                          ? 'bg-white/[0.05] text-gray-400 border-white/[0.12]' 
                          : row.impact === 'Medium' 
                          ? 'bg-white/[0.05] text-gray-400 border-white/[0.12]' 
                          : 'bg-white/[0.06] text-gray-400 border-white/[0.12]'
                      }`}>
                        {row.impact}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-white">{row.event}</td>
                  <td className="py-4 px-4 text-center font-mono text-gray-400">{row.forecast}</td>
                  <td className="py-4 px-4 text-center font-mono text-gray-500">{row.previous}</td>
                  <td className={`py-4 px-6 text-right font-mono font-medium ${
                    row.impact === 'High' ? 'text-gray-400' : 'text-gray-500'
                  }`}>{row.restriction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
const ProfileSection = ({ userName, userInitials }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/[0.06] flex items-center justify-center text-xl font-bold border-2 border-white/[0.12] relative shadow-inner text-white">
            {userInitials}
            <span className="absolute bottom-0 right-0 text-sm bg-white/[0.03] px-1 rounded-full border border-white/[0.12]">🇵🇹</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{userName}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Trader ID: <span className="font-mono text-gray-300">#ACG-98421</span></p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-white/[0.06] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-white/[0.15]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              Verified Account
            </div>
          </div>
        </div>
        <button className="text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.08] text-white border border-white/[0.12] px-4 py-2 rounded-xl transition">
          Change Avatar
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <User size={16} className="text-white" /> Personal Details
            </h2>
            
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">First Name</label>
                <input type="text" defaultValue={userName} className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/40 rounded-xl px-3.5 py-2 text-sm text-white transition outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">Last Name</label>
                <input type="text" defaultValue="A." className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/40 rounded-xl px-3.5 py-2 text-sm text-white transition outline-none" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs text-gray-400 font-medium">Email Address</label>
                <input type="email" defaultValue="abhilash@example.com" className="w-full bg-white/[0.05] border border-white/[0.08] focus:border-white/40 focus:ring-1 focus:ring-white/40 rounded-xl px-3.5 py-2 text-sm text-white transition outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">Country</label>
                <input type="text" defaultValue="Portugal" disabled className="w-full bg-white/[0.03] border border-white/[0.08] text-gray-500 rounded-xl px-3.5 py-2 text-sm cursor-not-allowed select-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">Timezone</label>
                <select className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 rounded-xl px-3.5 py-2 text-sm text-white transition outline-none cursor-pointer">
                  <option>Western European Time (GMT)</option>
                  <option>Central European Time (GMT+1)</option>
                  <option>Eastern Standard Time (GMT-5)</option>
                </select>
              </div>
              <div className="sm:col-span-2 pt-4 flex justify-end">
                <button type="submit" className="bg-white hover:bg-gray-200 text-black font-semibold py-2.5 px-6 rounded-xl text-xs transition shadow-lg shadow-white/[0.06] active:scale-[0.98]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Shield size={16} className="text-white" /> Security
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">Keep your simulated funding environment safe by updating credentials regularly.</p>
            <div className="pt-2 space-y-2">
              <button className="w-full bg-white/[0.06] hover:bg-white/[0.06] text-gray-200 border border-white/[0.08] hover:border-white/[0.12] text-left font-medium py-2.5 px-4 rounded-xl transition text-xs flex justify-between items-center">
                <span>Change Password</span><span>→</span>
              </button>
              <button className="w-full bg-white/[0.06] hover:bg-white/[0.06] text-gray-200 border border-white/[0.08] hover:border-white/[0.12] text-left font-medium py-2.5 px-4 rounded-xl transition text-xs flex justify-between items-center">
                <span>Two-Factor Auth (2FA)</span><span className="text-gray-200 text-[10px] bg-white/[0.06] px-1.5 py-0.5 rounded font-bold">Enabled</span>
              </button>
            </div>
          </div>

          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Bell size={16} className="text-white" /> Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-gray-300 group-hover:text-white transition">Email notifications</span>
                <input type="checkbox" defaultChecked className="accent-white rounded border-white/[0.08] bg-white/[0.03] h-4 w-4" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-gray-300 group-hover:text-white transition">Weekly performance digests</span>
                <input type="checkbox" defaultChecked className="accent-white rounded border-white/[0.08] bg-white/[0.03] h-4 w-4" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-gray-300 group-hover:text-white transition">Show profile on leaderboard</span>
                <input type="checkbox" className="accent-white rounded border-white/[0.08] bg-white/[0.03] h-4 w-4" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const TradersSection = () => {
  const [search, setSearch] = useState("");
  const tradersData = [
    { name: "Alexandre Silva", flag: "🇧🇷", tier: "$200,000 Sim", win: "68%", pf: "2.41", avg: "$12,450" },
    { name: "Elena Rostova", flag: "🇩🇪", tier: "$100,000 Sim", win: "62%", pf: "1.98", avg: "$7,820" },
    { name: "Marcus Brody", flag: "🇺🇸", tier: "$200,000 Sim", win: "59%", pf: "1.82", avg: "$15,100" },
    { name: "Chen Wei", flag: "🇸🇬", tier: "$50,000 Sim", win: "74%", pf: "3.10", avg: "$4,250" },
    { name: "Amara Okafor", flag: "🇳🇬", tier: "$100,000 Sim", win: "57%", pf: "1.65", avg: "$6,900" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Active Funded Peers</p>
            <h3 className="text-2xl font-bold text-white mt-1">12,482</h3>
            <p className="text-[11px] text-gray-200 mt-0.5 flex items-center gap-1"><span>↑ 8.2%</span> <span className="text-gray-500">this week</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white"><Users size={18} /></div>
        </div>
        <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Average Profit Factor</p>
            <h3 className="text-2xl font-bold text-white mt-1">1.84</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Across all qualified accounts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.15] flex items-center justify-center text-white"><Percent size={18} /></div>
        </div>
        <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Simulated Payouts</p>
            <h3 className="text-2xl font-bold text-white mt-1">$4,294,850</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">Processed since platform launch</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-gray-300"><DollarSign size={18} /></div>
        </div>
      </section>

      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Verified Recent Payouts</h2>
          <p className="text-xs text-gray-400 mt-0.5">Real-time simulator rewards split processing transparency.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Marek K.", amount: "$8,450", account: "$100k Challenge", flag: "🇨🇿", time: "2 mins ago" },
            { name: "Sarah L.", amount: "$14,210", account: "$200k Challenge", flag: "🇬🇧", time: "14 mins ago" },
            { name: "Diego R.", amount: "$3,120", account: "$50k Challenge", flag: "🇪🇸", time: "1 hour ago" },
            { name: "Yuki T.", amount: "$19,500", account: "$200k Challenge", flag: "🇯🇵", time: "2 hours ago" },
          ].map((payout, i) => (
            <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-white/[0.12] transition">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2"><span className="text-sm">{payout.flag}</span><span className="text-xs font-semibold text-gray-200">{payout.name}</span></div>
                <span className="text-[10px] text-gray-500 font-medium">{payout.time}</span>
              </div>
              <div>
                <div className="text-lg font-bold text-white tracking-tight">{payout.amount}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 font-medium">{payout.account}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Funded Trader Directory</h2>
            <p className="text-xs text-gray-400 mt-0.5">Analyze risk alignments and metrics of verified performance models.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"><Search size={14} /></span>
            <input type="text" placeholder="Search traders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 transition outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03]">
                <th className="py-3 px-6">Trader Name</th><th className="py-3 px-4">Account Tier</th><th className="py-3 px-4 text-center">Win Rate</th><th className="py-3 px-4 text-center">Profit Factor</th><th className="py-3 px-4 text-right">Avg Payout</th><th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-gray-300">
              {tradersData.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map((trader, idx) => (
                <tr key={idx} className="hover:bg-white/[0.03] transition group">
                  <td className="py-4 px-6 font-medium text-white flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-bold border border-white/[0.12]">{trader.name.split(' ').map(n => n[0]).join('')}</span>
                    <div className="flex items-center gap-1.5"><span>{trader.name}</span><span>{trader.flag}</span></div>
                  </td>
                  <td className="py-4 px-4 text-gray-400 font-mono">{trader.tier}</td>
                  <td className="py-4 px-4 text-center font-semibold text-white">{trader.win}</td>
                  <td className="py-4 px-4 text-center font-mono">{trader.pf}</td>
                  <td className="py-4 px-4 text-right font-medium text-white">{trader.avg}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/[0.06] hover:bg-white/[0.08] hover:text-white border border-white/[0.12] px-2.5 py-1.5 rounded-lg transition">Analyze <ArrowUpRight size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="text-[10px] text-gray-600 leading-relaxed">* All account values represent simulated evaluations matching prop-firm models.</p>
    </div>
  );
};
const AcademySection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-gradient-to-r from-[#0A0C12] to-white/[0.02] rounded-2xl border border-white/[0.08] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-white/[0.08] text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-white/[0.15]">Institutional Training Hub</div>
          <h1 className="text-xl font-bold text-white tracking-tight">ACG Elite Trading Academy</h1>
          <p className="text-xs text-gray-400 max-w-xl">Master the algorithmic frameworks required to pass your Evaluation Challenges and scale simulated assets safely.</p>
        </div>
        <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4 min-w-[200px] w-full md:w-auto">
          <div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-gray-400">Curriculum Progress</span><span className="text-white">35%</span></div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden"><div className="bg-white h-full w-[35%] rounded-full"></div></div>
          <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1"><Award size={12} className="text-white" /> 2 of 6 Modules Completed</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Core Syllabus Packages</h2><span className="text-xs text-gray-500">Updated for 2026 Algorithms</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#0A0C12] border border-white/[0.08] hover:border-white/[0.1] rounded-2xl p-5 flex flex-col justify-between space-y-5 transition group">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white"><BarChart3 size={18} /></div>
                <span className="text-[10px] font-bold bg-white/[0.06] text-gray-400 px-2 py-0.5 rounded uppercase tracking-wider">Foundation</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-white transition">1. Market Structure Principles</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Break away from retail chart patterns. Map institutional order flow trends utilizing structural shifts.</p>
              </div>
              <div className="pt-2 space-y-1.5 border-t border-white/[0.07] text-[11px] text-gray-300">
                <div><span className="text-gray-200 font-bold">✓</span> Break of Structure (BOS) vs CHoCH</div>
                <div><span className="text-gray-200 font-bold">✓</span> Swing Highs/Lows Mapping</div>
                <div className="text-gray-600">● Multi-Timeframe Fractality alignment</div>
              </div>
            </div>
            <button className="w-full bg-white/[0.08] hover:bg-white text-white hover:text-black font-semibold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1">Resume Module <Play size={10} fill="currentColor" /></button>
          </div>

          <div className="bg-[#0A0C12] border border-white/[0.18] bg-gradient-to-b from-[#0A0C12] via-[#0A0C12] to-white/[0.03] rounded-2xl p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-white text-black text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Active</div>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.15] flex items-center justify-center text-white"><Gem size={18} /></div>
                <span className="text-[10px] font-bold bg-white/[0.15] text-white px-2 py-0.5 rounded uppercase tracking-wider">Advanced</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-white transition">2. Order Flow & Liquidity</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Identify where retail stops sit. Trade alongside institutional order sweeps and execution setups.</p>
              </div>
              <div className="pt-2 space-y-1.5 border-t border-white/[0.07] text-[11px] text-gray-300">
                <div><span className="text-white font-mono">→</span> Order Blocks & Fair Value Gaps (FVG)</div>
                <div><span className="text-white font-mono">→</span> Liquidity Pools & Inducement Zones</div>
                <div className="text-gray-600">● Premium vs Discount Pricing arrays</div>
              </div>
            </div>
            <button className="w-full bg-white hover:bg-gray-200 text-black font-semibold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1">Start Learning <Play size={10} fill="currentColor" /></button>
          </div>

          <div className="bg-[#0A0C12] border border-white/[0.08] opacity-85 rounded-2xl p-5 flex flex-col justify-between space-y-5 transition group">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.12] flex items-center justify-center text-gray-400"><User size={18} /></div>
                <span className="text-[10px] font-bold bg-white/[0.06] text-gray-400 px-2 py-0.5 rounded uppercase tracking-wider">Elite</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">3. Psychological Scale Frameworks</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">Manage emotional drawdowns under strict simulated evaluation thresholds.</p>
              </div>
              <div className="pt-2 space-y-1.5 border-t border-white/[0.07] text-[11px] text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5"><Lock size={10} /> Over-trading Regulation Systems</div>
                <div className="flex items-center gap-1.5"><Lock size={10} /> Dissociating Simulated Sizes</div>
              </div>
            </div>
            <button className="w-full bg-white/[0.06] text-gray-400 border border-white/[0.12] font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"><Lock size={12} /> Unlock via Phase 1</button>
          </div>
        </div>
      </section>

      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Smart Money Concept (SMC) Masterclass</h2>
            <p className="text-xs text-gray-400 mt-0.5">Interactive algorithm trace session with certified prop evaluators.</p>
          </div>
          <span className="text-[11px] font-medium text-white bg-white/[0.06] border border-white/[0.15] px-2.5 py-1 rounded-lg self-start sm:self-auto">Live Stream Tomorrow @ 15:00 GMT</span>
        </div>
        <div className="relative aspect-video rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-center items-center p-6 text-center overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition z-10"><Play size={20} className="ml-1" fill="currentColor" /></div>
          <div className="mt-4 max-w-sm z-10">
            <h4 className="text-xs font-bold text-white tracking-wide">Liquidity Inducement vs. True Breakouts</h4>
            <p className="text-[11px] text-gray-400 mt-1">Watch how central algorithms trigger stop hunts prior to expansion.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
const BillingSection = ({ userName }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2"><Wallet size={16} className="text-white" /> Profit Split Payout Method</h2>
              <span className="text-[10px] bg-white/[0.06] text-white font-bold border border-white/[0.15] px-2 py-0.5 rounded uppercase">Verified</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">Configure your destination gateway to route processed simulated reward splits.</p>
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-xl p-4 flex items-center justify-between hover:border-white/[0.12] transition">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-xs font-mono font-bold text-white">USDT</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Crypto Settlement (TRC-20)</h4>
                  <p className="text-[11px] text-gray-500 font-mono mt-0.5">TR7NHqDjQ62TQ...zNpeee</p>
                </div>
              </div>
              <button className="text-[11px] font-semibold text-gray-400 hover:text-white transition">Modify</button>
            </div>
          </div>

          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2"><CreditCard size={16} className="text-white" /> Cards on file</h2>
              <button className="text-xs font-semibold text-white hover:underline flex items-center gap-1"><Plus size={14} /> Add Card</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-white/[0.02] to-white/[0.02] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
                <div className="absolute -right-3 -bottom-3 text-white/[0.05] text-6xl font-black select-none">VISA</div>
                <div className="flex justify-between items-start"><span className="text-[10px] bg-white/[0.06] text-gray-300 px-2 py-0.5 rounded font-medium">Default</span><span className="text-xs font-bold text-gray-400">•• 4242</span></div>
                <div><p className="text-[11px] text-gray-400 font-medium">{userName} A.</p><p className="text-[10px] text-gray-500 mt-0.5">Expires 12/28</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">Fee Architecture</h2>
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-white/[0.04] rounded-xl border border-white/[0.07]">
                <div className="flex justify-between text-xs font-semibold text-white"><span>Evaluation Fees</span><span className="text-gray-400">One-Time</span></div>
                <p className="text-[11px] text-gray-500 mt-1">Challenge fees are structured per evaluation size. No hidden monthly subscriptions.</p>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.08]">
                <div className="flex justify-between text-xs font-bold text-white"><span>Refundable Rule</span><span className="text-gray-200 font-mono">100%</span></div>
                <p className="text-[11px] text-gray-400 mt-1">Your baseline fee is reimbursed along with your initial certified cashout.</p>
              </div>
            </div>
            <a href="#rules" className="inline-flex items-center gap-1 text-[11px] font-semibold text-white hover:underline pt-1">Refund Agreement Details <ExternalLink size={12} /></a>
          </div>
        </div>
      </div>

      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/[0.08]"><h2 className="text-sm font-bold uppercase tracking-wider text-white">Invoice & Order Ledger</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03]">
                <th className="py-3 px-6">Invoice ID</th><th className="py-3 px-4">Challenge Description</th><th className="py-3 px-4">Date</th><th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-right">Amount</th><th className="py-3 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-gray-300">
              {[
                { id: "INV-2026-0842", desc: "$200,000 Sim evaluation allocation", date: "June 14, 2026", status: "Paid", price: "$1,089.00" },
                { id: "INV-2026-0211", desc: "$50,000 Sim evaluation allocation", date: "Jan 08, 2026", status: "Paid", price: "$329.00" },
              ].map((inv, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-6 font-mono font-medium text-white">{inv.id}</td>
                  <td className="py-4 px-4 text-gray-400 font-medium">{inv.desc}</td>
                  <td className="py-4 px-4 text-gray-500">{inv.date}</td>
                  <td className="py-4 px-4 text-center"><span className="text-[10px] font-bold bg-white/[0.06] text-white border border-white/[0.15] px-2 py-0.5 rounded">{inv.status}</span></td>
                  <td className="py-4 px-4 text-right font-semibold text-white">{inv.price}</td>
                  <td className="py-4 px-6 text-right"><button className="p-2 bg-white/[0.07] hover:bg-white/[0.08] text-gray-300 rounded-lg border border-white/[0.12] transition"><Download size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
const LeaderboardSection = () => {
  const [search, setSearch] = useState("");
  const rankings = [
    { rank: 4, name: "Sarah Jenkins", country: "GB", size: "$200,000", rr: "1:2.4", consistency: "84%", profit: "+$9,820.00" },
    { rank: 5, name: "Amir Al-Sayed", country: "AE", size: "$100,000", rr: "1:3.1", consistency: "79%", profit: "+$8,410.00" },
    { rank: 6, name: "Hans Müller", country: "DE", size: "$200,000", rr: "1:1.9", consistency: "91%", profit: "+$7,900.00" },
    { rank: 7, name: "Lucia Rossi", country: "IT", size: "$50,000", rr: "1:2.8", consistency: "73%", profit: "+$4,890.00" },
    { rank: 8, name: "Chen Zhang", country: "CN", size: "$100,000", rr: "1:2.2", consistency: "88%", profit: "+$4,120.00" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        <div className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-5 text-center space-y-3 order-2 md:order-1 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-gray-500 font-black text-xl">#2</div>
          <div className="w-12 h-12 rounded-full bg-white/[0.06] mx-auto border border-white/[0.12] flex items-center justify-center text-sm font-bold relative text-white">
            JD
            <span className="absolute -bottom-1 -right-1 shadow-md"><ReactCountryFlag countryCode="US" svg style={{ width: '16px', height: '16px', borderRadius: '2px' }} /></span>
          </div>
          <div><h4 className="text-xs font-bold text-white">Jonathan Doe</h4><p className="text-[11px] text-gray-400 font-mono mt-0.5">$200k Sim Account</p></div>
          <div className="text-sm font-black text-white font-mono">+$24,150.00</div>
          <span className="text-[10px] text-gray-500 font-medium bg-white/[0.02] px-2 py-0.5 rounded-full mx-auto border border-white/[0.08]">Gain: +12.07%</span>
        </div>

        <div className="bg-[#0A0C12] border-2 border-white/[0.08] rounded-2xl p-6 text-center space-y-3 order-1 md:order-2 md:h-[250px] flex flex-col justify-center relative shadow-xl shadow-white/[0.04]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] uppercase font-black px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1"><Trophy size={10} fill="currentColor" /> Champion</div>
          <div className="w-16 h-16 rounded-full bg-white/[0.06] mx-auto border-2 border-white/40 flex items-center justify-center text-base font-bold relative text-white">
            MT
            <span className="absolute -bottom-1 -right-1 shadow-lg"><ReactCountryFlag countryCode="PT" svg style={{ width: '18px', height: '18px', borderRadius: '2px' }} /></span>
          </div>
          <div><h3 className="text-sm font-black text-white">Miguel Torres</h3><p className="text-xs text-gray-400 font-mono mt-0.5">$200k Sim Account</p></div>
          <div className="text-xl font-black text-white font-mono tracking-tight">+$38,420.00</div>
          <span className="text-[10px] text-white font-bold bg-white/[0.06] px-2 py-0.5 rounded-full mx-auto border border-white/[0.15]">Gain: +19.21%</span>
        </div>

        <div className="bg-[#0A0C12] border border-white/[0.08] rounded-2xl p-5 text-center space-y-3 order-3 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-gray-600 font-black text-xl">#3</div>
          <div className="w-12 h-12 rounded-full bg-white/[0.06] mx-auto border border-white/[0.12] flex items-center justify-center text-sm font-bold relative text-white">
            IK
            <span className="absolute -bottom-1 -right-1 shadow-md"><ReactCountryFlag countryCode="JP" svg style={{ width: '16px', height: '16px', borderRadius: '2px' }} /></span>
          </div>
          <div><h4 className="text-xs font-bold text-white">Itsuki Kuroki</h4><p className="text-[11px] text-gray-400 font-mono mt-0.5">$100k Sim Account</p></div>
          <div className="text-sm font-black text-white font-mono">+$11,940.00</div>
          <span className="text-[10px] text-gray-500 font-medium bg-white/[0.02] px-2 py-0.5 rounded-full mx-auto border border-white/[0.08]">Gain: +11.94%</span>
        </div>
      </section>

      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Payout Cycle Standings</h2>
            <p className="text-xs text-gray-400 mt-0.5">Live performance updates for active certified evaluation accounts.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500"><Search size={14} /></span>
            <input type="text" placeholder="Search ranked traders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 transition outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03]">
                <th className="py-3 px-6 text-center w-16">Rank</th><th className="py-3 px-4">Trader</th><th className="py-3 px-4 text-center">Country</th><th className="py-3 px-4">Account Size</th><th className="py-3 px-4 text-center">Avg R:R</th><th className="py-3 px-4 text-center">Consistency</th><th className="py-3 px-6 text-right">Sim Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-xs text-gray-300">
              {rankings.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition group">
                  <td className="py-4 px-6 text-center font-bold text-gray-400 font-mono group-hover:text-white">{row.rank}</td>
                  <td className="py-4 px-4 font-semibold text-white">{row.name}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <ReactCountryFlag countryCode={row.country} svg style={{ width: '18px', height: '13px', borderRadius: '1.5px' }} />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-400 font-mono">{row.size}</td>
                  <td className="py-4 px-4 text-center font-mono text-gray-400">{row.rr}</td>
                  <td className="py-4 px-4 text-center"><div className="flex items-center justify-center gap-1"><Zap size={11} className="text-white" /><span className="font-semibold text-gray-300">{row.consistency}</span></div></td>
                  <td className="py-4 px-6 text-right font-black text-white font-mono">{row.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const navItems = [
  { id: 'overview', name: 'Accounts Overview', icon: LayoutDashboard },
  { id: 'analytics', name: 'Advanced Metrics', icon: BarChart3 }, 
  { id: 'calendar', name: 'Economic Calendar', icon: Clock },     
  { id: 'traders', name: 'Traders', icon: Users },
  { id: 'academy', name: 'Academy', icon: GraduationCap },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
  { id: 'profile', name: 'Profile Settings', icon: User },
];
 


export default function Dashboard({ onBack = () => {} }) {
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isOpen, setIsOpen] = useState(false);
  const [freeTrial, setFreeTrial] = useState(null);
  const [freeTrialHistory, setFreeTrialHistory] = useState([]);
  const [freeTrialLoading, setFreeTrialLoading] = useState(true);
  const [freeTrialError, setFreeTrialError] = useState("");
  const [launchingTrial, setLaunchingTrial] = useState(false);
  const [cancellingTrial, setCancellingTrial] = useState(false);

  const userInitials = "AA";
  const userName = "Abhilash";
  const traderCount = "264,000+"; // Kept if you need it elsewhere

  const loadFreeTrials = async () => {
    setFreeTrialLoading(true);
    setFreeTrialError("");
    try {
      const [active, history] = await Promise.all([
        getActiveFreeTrial(),
        getFreeTrialHistory(),
      ]);
      setFreeTrial(active || null);
      setFreeTrialHistory(Array.isArray(history) ? history : []);
    } catch (error) {
      setFreeTrialError(error.message || "Unable to load Free Trial data.");
    } finally {
      setFreeTrialLoading(false);
    }
  };

  useEffect(() => {
    loadFreeTrials();
  }, []);

  const handleContinueTrial = async (trial) => {
    if (!trial?.accountId || launchingTrial) return;
    setLaunchingTrial(true);
    setFreeTrialError("");
    try {
      const session = await createFreeTrialTradingSession(trial.accountId);
      if (!session?.launchUrl) throw new Error("ACG Trader launch URL was not returned.");
      window.location.assign(session.launchUrl);
    } catch (error) {
      setFreeTrialError(error.message || "Unable to open ACG Trader.");
      setLaunchingTrial(false);
    }
  };

  const handleCancelTrial = async (trial) => {
    if (!trial?.accountId || cancellingTrial) return;
    const confirmed = window.confirm("Cancel this Free Trial? Trading will be disabled and you can start another trial immediately.");
    if (!confirmed) return;

    setCancellingTrial(true);
    setFreeTrialError("");
    try {
      await cancelFreeTrial(trial.accountId);
      await loadFreeTrials();
    } catch (error) {
      setFreeTrialError(error.message || "Unable to cancel Free Trial.");
    } finally {
      setCancellingTrial(false);
    }
  };

  const renderTabContent = () => {
    const propsPayload = { userName, userInitials, setActiveTab };

    switch (activeTab) {
      case 'overview':
        return (
          <OverviewSection
            {...propsPayload}
            freeTrial={freeTrial}
            freeTrialHistory={freeTrialHistory}
            freeTrialLoading={freeTrialLoading}
            freeTrialError={freeTrialError}
            launchingTrial={launchingTrial}
            cancellingTrial={cancellingTrial}
            onContinueTrial={handleContinueTrial}
            onCancelTrial={handleCancelTrial}
          />
        );
      case 'analytics':
        return <AnalyticsSection />;
      case 'calendar':
        return <CalendarSection />;
      case 'traders':
        return <TradersSection />;
      case 'academy':
        return <AcademySection />;
      case 'billing':
        return <BillingSection {...propsPayload} />;
      case 'leaderboard':
        return <LeaderboardSection />;
      case 'profile':
        return <ProfileSection {...propsPayload} />;
      default:
        return null;
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    // Outer shell: Pure black
    <div className="relative min-h-screen bg-[#000000] text-[#EDEDED] font-sans flex flex-col antialiased overflow-x-hidden selection:bg-white/20">

      {/* Subtle, engineered grid (no glow) */}
      <div
        className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 40%, transparent 100%)'
        }}
      />

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="relative z-50 bg-[#000000] border-b border-[#222222] sticky top-0 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1.5 -ml-1.5 text-[#888888] hover:text-[#EDEDED] transition-colors"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          
          <div className="flex items-center gap-2">
            {/* Replace with your logo, scaled appropriately for a 14px high nav */}
            <img src={acg} alt="ACG Logo" className="h-5 w-auto object-contain" />
          </div>
        </div>

        <div className="relative">
          {/* Vercel-style User Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full hover:bg-[#111111] transition-colors focus:outline-none"
          >
            <span className="hidden text-[13px] font-medium text-[#888888] md:inline">
              {userName}
            </span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold tracking-wider text-black">
              {userInitials}
            </div>
          </button>

          {/* Minimalist Dropdown */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-lg border border-[#222222] bg-[#0A0A0A] shadow-2xl z-50">
              <div className="border-b border-[#222222] px-4 py-3">
                <p className="text-[13px] font-medium text-white">{userName}</p>
                <p className="text-[12px] text-[#888888]">Personal Account</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onBack();
                  }}
                  className="flex w-full items-center px-4 py-2 text-left text-[13px] text-[#888888] transition-colors hover:bg-[#111111] hover:text-[#EDEDED]"
                >
                  Homepage
                </button>
                
                <div className="my-1 border-t border-[#222222]" />
                
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-left text-[13px] text-[#888888] transition-colors hover:bg-[#111111] hover:text-[#EDEDED]"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 relative z-10">
        
        {/* --- SIDE NAVIGATION --- */}
        <aside className={`
          fixed md:static inset-y-0 left-0 top-14 md:top-0 z-40
          w-64 bg-[#000000] border-r border-[#222222]
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          transition-transform duration-200 ease-in-out flex flex-col justify-between
        `}>
          <div className="p-4 space-y-6">
            
            {/* Vercel-style Action Button */}
            <button 
              onClick={() => {
                setActiveTab('overview');
                setIsSidebarOpen(false);
              }}
              className="w-full h-8 bg-white hover:bg-[#EBEBEB] text-black text-[13px] font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              New Challenge
            </button>

            <div> 
              <p className="text-[11px] font-medium text-[#555555] uppercase tracking-wider px-3 mb-2">
                Overview
              </p>
              <nav className="space-y-0.5">
                {navItems?.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
                        isActive 
                          ? 'bg-[#111111] text-white' 
                          : 'text-[#888888] hover:bg-[#0A0A0A] hover:text-[#EDEDED]'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-[#EDEDED]' : 'text-[#888888]'} />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          
          <div className="p-4 border-t border-[#222222] flex items-center justify-between">
            <span className="text-[12px] text-[#555555] font-mono">v2.4.1-stable</span>
            <ChevronDown size={14} className="text-[#555555]" />
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-14 bg-black/80 z-30 md:hidden backdrop-blur-sm"
          />
        )}

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="dashboard-surface mx-auto w-full max-w-[1040px] px-5 py-8 sm:px-6 sm:py-12">
            <PageHeader activeTab={activeTab} />
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
