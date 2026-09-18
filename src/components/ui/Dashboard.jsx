import React, { useState, useEffect } from 'react';
import ReactCountryFlag from "react-country-flag";
import acg from '../../assets/ACG.png';
import { 
  User, Menu, BarChart2, X, ChevronRight, LayoutDashboard, Gem, Users, GraduationCap, 
  CreditCard, Trophy, MessageSquare, Clock, Flag, ChevronDown,
  Shield, Bell, Globe, Check, Search, ArrowUpRight, Percent, DollarSign,
  BookOpen, Play, Lock, Award, BarChart3, Download, Receipt, Plus, Wallet, 
  ExternalLink, Activity, TrendingUp, AlertTriangle, CheckCircle2, Zap,
   Layers, ShieldCheck, Flame, AlertCircle, LogOut
} from 'lucide-react';
import { useAuth } from "../../AuthContext"; 
import { getAnalyticsSessionId } from "../../utils/analytics.js";

const API_URL = import.meta.env.VITE_API_URL || "";

const pageDetails = {
  overview: { title: 'Overview', description: 'Account, objective and risk status' },
  analytics: { title: 'Performance', description: 'Understand how this account is performing' },
  calendar: { title: 'Calendar', description: 'Market events and trading restrictions' },
  academy: { title: 'Academy', description: 'Continue your trading education' },
  billing: { title: 'Billing', description: 'Orders, invoices and payout settings' },
  profile: { title: 'Settings', description: 'Profile, security and preferences' },
};

const formatFreshness = (value) => {
  if (!value) return "Waiting for live data";
  const ageMs = Math.max(0, Date.now() - new Date(value).getTime());
  if (!Number.isFinite(ageMs)) return "Waiting for live data";
  const seconds = Math.floor(ageMs / 1000);
  if (seconds < 5) return "Updated just now";
  if (seconds < 60) return `Updated ${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  return `Updated ${minutes}m ago`;
};

const PageHeader = ({ activeTab, activeChallenge, onOpenTrader, traderLaunching, launchError }) => {
  const page = pageDetails[activeTab] || pageDetails.overview;
  const isOverview = activeTab === "overview";
  const connectionActive = activeChallenge?.provisioning?.status === "ACTIVE";
  const freshness = formatFreshness(activeChallenge?.lastPlatformSnapshotAt || activeChallenge?.updatedAt);

  if (!isOverview) {
    return (
      <header className="mb-6 border-b border-[#1d1d1d] pb-4 sm:mb-7">
        <h1 className="text-[clamp(1.35rem,3vw,1.75rem)] font-semibold tracking-[-0.035em] text-white">{page.title}</h1>
        <p className="mt-1.5 text-[12px] text-[#737373]">{page.description}</p>
      </header>
    );
  }

  return (
    <header className="mb-5 flex min-w-0 flex-col gap-4 border-b border-[#1d1d1d] pb-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-[#9a9a9a]">
            <span className={`h-1.5 w-1.5 rounded-full ${connectionActive ? "bg-emerald-400" : "bg-zinc-600"}`} />
            {connectionActive ? "Live" : "Offline"}
          </span>
          <span className="text-[#4f4f4f]">•</span>
          <span className="text-[#6f6f6f]">{freshness}</span>
          {activeChallenge && (
            <>
              <span className="text-[#4f4f4f]">•</span>
              <span className="text-[#6f6f6f]">Phase {activeChallenge.currentPhase || 1}</span>
              <span className="text-[#4f4f4f]">•</span>
              <span className="text-[#6f6f6f]">{activeChallenge.status}</span>
            </>
          )}
        </div>
        <h1 className="truncate text-[clamp(1.45rem,3.5vw,2rem)] font-semibold tracking-[-0.04em] text-white">
          {activeChallenge?.accountId || "No active trading account"}
        </h1>
        <p className="mt-1.5 text-[12px] text-[#737373]">
          {activeChallenge
            ? `${activeChallenge.accountMode === "DEMO" ? "Free Trial" : activeChallenge.challengeType === "TWO_STEP" ? "2-Step Evaluation" : "1-Step Evaluation"} · ${money(activeChallenge.accountSize || 0)}`
            : "Start a challenge or free trial to begin trading."}
        </p>
        {launchError && <p className="mt-2 text-[12px] text-red-400">{launchError}</p>}
      </div>

      <button
        type="button"
        onClick={onOpenTrader}
        disabled={!activeChallenge || traderLaunching}
        className="hidden h-9 shrink-0 items-center justify-center rounded-lg bg-white px-4 text-[12px] font-semibold text-black transition hover:bg-[#e8e8e8] disabled:cursor-not-allowed disabled:opacity-40 sm:inline-flex"
      >
        {traderLaunching ? "Opening…" : "Open ACG Trader"}
      </button>
    </header>
  );
};


const money = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(number);
};

const pct = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return `${number.toFixed(2)}%`;
};

const clampPercent = (value) => Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Number(value) : 0));

const OverviewSection = ({ account, onStartTrial, onNewChallenge }) => {
  if (!account) {
    return (
      <div className="grid min-h-[360px] place-items-center rounded-xl border border-white/[0.08] bg-[#080808] px-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto grid size-11 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#8a8a8a]">
            <Activity size={18} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-white">No active trading account</h2>
          <p className="mt-2 text-[12px] leading-5 text-[#777]">Start a free trial or create a challenge to unlock your trading workspace.</p>
          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <button onClick={onStartTrial} className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-[12px] font-semibold text-white hover:bg-white/[0.07]">Start Free Trial</button>
            <button onClick={onNewChallenge} className="rounded-lg bg-white px-4 py-2 text-[12px] font-semibold text-black hover:bg-[#e8e8e8]">View Challenges</button>
          </div>
        </div>
      </div>
    );
  }

  const initial = Number(account.accountSize || 0);
  const balance = Number(account.balance || 0);
  const equity = Number(account.equity || 0);
  const floating = Number(account.floatingProfit || 0);
  const dailyLoss = Number(account.projections?.dailyLoss || 0);
  const totalLoss = Number(account.projections?.totalLoss || 0);
  const profit = Number(account.projections?.profit ?? (balance - initial));
  const tradingDays = Number(account.projections?.tradingDays || 0);
  const totalTrades = Number(account.totalTrades || 0);
  const winningTrades = Number(account.winningTrades || 0);
  const losingTrades = Number(account.losingTrades || 0);

  const dailyLossPctLimit = Number(account.rules?.dailyDrawdown || 0);
  const maxLossPctLimit = Number(account.rules?.maxDrawdown || 0);
  const minTradingDays = Number(account.rules?.minimumTradingDays || 0);
  const phaseRule = (account.rules?.phases || []).find(item => Number(item.phase) === Number(account.currentPhase || 1));
  const profitTargetPct = Number(phaseRule?.profitTarget || 0);

  const profitTargetAmount = initial * profitTargetPct / 100;
  const dailyLossLimit = initial * dailyLossPctLimit / 100;
  const maxLossLimit = initial * maxLossPctLimit / 100;
  const dailyUsagePct = dailyLossLimit > 0 ? dailyLoss / dailyLossLimit * 100 : 0;
  const maxUsagePct = maxLossLimit > 0 ? totalLoss / maxLossLimit * 100 : 0;
  const profitProgressPct = profitTargetAmount > 0 ? Math.max(0, profit) / profitTargetAmount * 100 : 0;
  const tradingDaysPct = minTradingDays > 0 ? tradingDays / minTradingDays * 100 : 100;
  const winRate = totalTrades > 0 ? winningTrades / totalTrades * 100 : 0;
  const returnPct = initial > 0 ? profit / initial * 100 : 0;
  const freeMargin = Number(account.marginFree || 0);
  const usedMargin = Number(account.margin || 0);
  const dailyRemaining = Math.max(0, dailyLossLimit - dailyLoss);
  const maxRemaining = Math.max(0, maxLossLimit - totalLoss);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#080808]">
        <div className="grid gap-5 px-4 py-5 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#666]">Current equity</p>
            <div className="mt-1 flex flex-wrap items-end gap-x-3 gap-y-1">
              <strong className="text-[clamp(2rem,6vw,3.1rem)] font-semibold leading-none tracking-[-0.055em] text-white tabular-nums">{money(equity)}</strong>
              <span className={`pb-1 text-[12px] font-medium tabular-nums ${floating > 0 ? "text-emerald-400" : floating < 0 ? "text-rose-400" : "text-[#777]"}`}>
                {floating >= 0 ? "+" : ""}{money(floating)} floating
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4 lg:text-right">
            <CompactStat label="Balance" value={money(balance)} />
            <CompactStat label="Return" value={pct(returnPct)} tone={returnPct > 0 ? "positive" : returnPct < 0 ? "negative" : "neutral"} />
            <CompactStat label="Free margin" value={money(freeMargin)} />
            <CompactStat label="Trades" value={String(totalTrades)} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,.8fr)]">
        <div className="rounded-xl border border-white/[0.08] bg-[#080808]">
          <div className="border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
            <h2 className="text-[12px] font-semibold text-white">Evaluation progress</h2>
            <p className="mt-0.5 text-[10px] text-[#666]">What remains before this phase is complete.</p>
          </div>
          <div className="divide-y divide-white/[0.06]">
            <ProgressRow
              label={`Profit target · ${profitTargetPct || 0}%`}
              value={money(Math.max(0, profit))}
              target={money(profitTargetAmount)}
              progress={profitProgressPct}
            />
            <ProgressRow
              label="Minimum trading days"
              value={`${tradingDays} day${tradingDays === 1 ? "" : "s"}`}
              target={`${minTradingDays} day${minTradingDays === 1 ? "" : "s"}`}
              progress={tradingDaysPct}
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#080808] p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[12px] font-semibold text-white">Risk buffer</h2>
              <p className="mt-0.5 text-[10px] text-[#666]">Distance from challenge limits.</p>
            </div>
            <ShieldCheck size={16} className="text-[#777]" />
          </div>
          <div className="mt-5 space-y-5">
            <RiskBufferRow label="Daily loss remaining" amount={dailyRemaining} usage={dailyUsagePct} />
            <RiskBufferRow label="Maximum loss remaining" amount={maxRemaining} usage={maxUsagePct} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-4">
            <CompactStat label="Used margin" value={money(usedMargin)} />
            <CompactStat label="Free margin" value={money(freeMargin)} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.08] bg-[#080808] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[12px] font-semibold text-white">Performance</h2>
              <p className="mt-0.5 text-[10px] text-[#666]">Current account trading summary.</p>
            </div>
            <BarChart3 size={15} className="text-[#707070]" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <CompactStat label="Win rate" value={pct(winRate)} />
            <CompactStat label="Wins" value={String(winningTrades)} />
            <CompactStat label="Losses" value={String(losingTrades)} />
            <CompactStat label="P&L" value={money(profit)} tone={profit > 0 ? "positive" : profit < 0 ? "negative" : "neutral"} />
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#080808] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[12px] font-semibold text-white">Account details</h2>
              <p className="mt-0.5 text-[10px] text-[#666]">Platform and evaluation state.</p>
            </div>
            <Zap size={15} className="text-[#707070]" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
            <CompactStat label="Status" value={String(account.status || "—")} />
            <CompactStat label="Phase" value={`Phase ${account.currentPhase || 1}`} />
            <CompactStat label="Platform" value={account.platform === "acg-trader" ? "ACG Trader" : (account.platform || "—")} />
            <CompactStat label="Account size" value={money(initial)} />
            {account.accountMode !== "DEMO" && account.commercialTerms?.profitSplit != null && (
              <CompactStat label="Profit split" value={`${account.commercialTerms.profitSplit}%`} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

function CompactStat({ label, value, tone = "neutral" }) {
  const toneClass = tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-rose-400" : "text-white";
  return (
    <div className="min-w-0">
      <span className="block text-[9px] font-medium uppercase tracking-[0.11em] text-[#666]">{label}</span>
      <strong className={`mt-1 block truncate text-[13px] font-semibold tabular-nums ${toneClass}`}>{value}</strong>
    </div>
  );
}

function ProgressRow({ label, value, target, progress }) {
  const width = clampPercent(progress);
  return (
    <div className="px-4 py-4 sm:px-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-medium text-[#b8b8b8]">{label}</span>
        <span className="shrink-0 text-[10px] tabular-nums text-[#707070]">{value} / {target}</span>
      </div>
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div className="h-full rounded-full bg-white transition-[width] duration-500" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function RiskBufferRow({ label, amount, usage }) {
  const width = clampPercent(usage);
  const barClass = width >= 80 ? "bg-rose-400" : width >= 55 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-[10px] text-[#777]">{label}</span>
        <strong className="text-[14px] font-semibold tabular-nums text-white">{money(amount)}</strong>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div className={`h-full rounded-full transition-[width] duration-500 ${barClass}`} style={{ width: `${width}%` }} />
      </div>
      <p className="mt-1.5 text-right text-[9px] text-[#5f5f5f]">{width.toFixed(1)}% of limit used</p>
    </div>
  );
}

function HeroStat({ label, value, tone = "neutral" }) {
  const toneClass = tone === "positive" ? "text-emerald-400" : tone === "negative" ? "text-rose-400" : "text-white";
  return (
    <div className="rounded-2xl border border-white/[0.075] bg-black/20 px-3 py-3.5 backdrop-blur-sm">
      <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-[#657487]">{label}</span>
      <strong className={`mt-1.5 block truncate text-[13px] font-semibold tabular-nums ${toneClass}`}>{value}</strong>
    </div>
  );
}

function ModernMetricCard({ icon: Icon, label, value, helper, helperValue }) {
  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-[#090c11] p-4 shadow-[0_18px_55px_rgba(0,0,0,.16)]">
      <div className="flex items-center justify-between">
        <div className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-[#8096aa]">
          <Icon size={15} />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#5e6c7d]">{label}</span>
      </div>
      <strong className="mt-5 block break-words text-[clamp(1.2rem,3vw,1.5rem)] font-semibold tracking-[-0.04em] text-white tabular-nums">{value}</strong>
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.065] pt-3 text-[9px]">
        <span className="text-[#657487]">{helper}</span>
        <span className="font-mono text-[#aeb9c5]">{helperValue}</span>
      </div>
    </div>
  );
}

function ModernRiskCard({ icon: Icon, label, value, usage, limit, limitPct }) {
  const safeUsage = clampPercent(usage);
  const tone = safeUsage >= 80 ? "bg-rose-400" : safeUsage >= 50 ? "bg-amber-400" : "bg-emerald-400";
  return (
    <div className="rounded-[20px] border border-white/[0.08] bg-[#090c11] p-4 shadow-[0_18px_55px_rgba(0,0,0,.16)]">
      <div className="flex items-center justify-between">
        <div className="grid size-9 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-[#8096aa]">
          <Icon size={15} />
        </div>
        <span className="text-[9px] font-mono text-[#758396]">{safeUsage.toFixed(1)}% used</span>
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-[#5e6c7d]">{label}</span>
          <strong className="mt-1.5 block break-words text-[clamp(1.2rem,3vw,1.5rem)] font-semibold tracking-[-0.04em] text-white tabular-nums">{value}</strong>
        </div>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${safeUsage}%` }} />
      </div>
      <div className="mt-3 flex items-center justify-between text-[9px]">
        <span className="text-[#657487]">Hard limit ({limitPct || 0}%)</span>
        <span className="font-mono text-[#aeb9c5]">{money(limit)}</span>
      </div>
    </div>
  );
}

function ModernObjectiveRow({ label, progress, currentLabel, targetLabel }) {
  const safe = clampPercent(progress);
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] font-medium text-[#e7edf3]">{label}</span>
          <span className="mt-1 block text-[9px] font-mono text-[#677688]">{currentLabel} / {targetLabel}</span>
        </div>
        <strong className="text-[11px] font-mono text-[#aeb9c5]">{Math.round(safe)}%</strong>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
        <div className="h-full rounded-full bg-white" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

function MiniState({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-3">
      <span className="block text-[8px] font-bold uppercase tracking-[0.11em] text-[#5f6e80]">{label}</span>
      <strong className="mt-1.5 block text-[11px] font-mono text-[#dce4ec]">{value}</strong>
    </div>
  );
}

function PerformanceStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-3">
      <span className="block text-[8px] font-bold uppercase tracking-[0.11em] text-[#5f6e80]">{label}</span>
      <strong className="mt-2 block text-[18px] font-semibold tracking-[-0.03em] text-white">{value}</strong>
    </div>
  );
}

function ModernStateRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 text-[10px]">
      <span className="text-[#667487]">{label}</span>
      <span className="font-mono text-[#d7dfe7]">{value}</span>
    </div>
  );
}

const AnalyticsSection = ({ account }) => {
  if (!account) {
    return <div className="rounded-xl border border-[#222222] bg-[#0A0A0A] p-6 text-sm text-[#888888]">No account analytics are available yet.</div>;
  }

  const totalTrades = Number(account.totalTrades || 0);
  const winningTrades = Number(account.winningTrades || 0);
  const losingTrades = Number(account.losingTrades || 0);
  const winRate = totalTrades > 0 ? winningTrades / totalTrades * 100 : 0;
  const initial = Number(account.accountSize || 0);
  const balance = Number(account.balance || 0);
  const equity = Number(account.equity || 0);
  const profit = Number(account.projections?.profit ?? (balance - initial));
  const returnPct = initial > 0 ? profit / initial * 100 : 0;
  const dailyLoss = Number(account.projections?.dailyLoss || 0);
  const totalLoss = Number(account.projections?.totalLoss || 0);

  const rows = [
    ["Total trades", totalTrades.toLocaleString("en-US")],
    ["Winning trades", winningTrades.toLocaleString("en-US")],
    ["Losing trades", losingTrades.toLocaleString("en-US")],
    ["Win rate", pct(winRate)],
    ["Realized challenge P&L", money(profit)],
    ["Return on starting balance", pct(returnPct)],
    ["Current balance", money(balance)],
    ["Current equity", money(equity)],
    ["Current daily drawdown", money(dailyLoss)],
    ["Current max drawdown", money(totalLoss)],
    ["Trading days", String(Number(account.projections?.tradingDays || 0))],
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ModernMetricCard icon={BarChart3} label="Win Rate" value={pct(winRate)} helper="Trades" helperValue={String(totalTrades)} />
        <ModernMetricCard icon={TrendingUp} label="Challenge P&L" value={money(profit)} helper="Return" helperValue={pct(returnPct)} />
        <ModernMetricCard icon={Activity} label="Equity" value={money(equity)} helper="Balance" helperValue={money(balance)} />
      </section>

      <section className="bg-[#0A0A0A] rounded-xl border border-[#222222] overflow-hidden">
        <div className="p-5 border-b border-[#222222]">
          <h2 className="text-sm font-medium text-white">Account Analytics</h2>
          <p className="text-xs text-[#888888] mt-1">Only metrics currently reported by the ACG Funded state engine are shown.</p>
        </div>
        <div className="divide-y divide-[#222222]">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <span className="text-[13px] text-[#888888]">{label}</span>
              <span className="text-[13px] text-white font-mono tabular-nums text-right">{value}</span>
            </div>
          ))}
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
        
        <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
          <table className="min-w-[760px] w-full border-collapse text-left">
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
const ProfileSection = ({ userName, userInitials, userEmail, userMetadata = {}, activeChallenge }) => {
  const profileName = String(userMetadata?.full_name || userMetadata?.name || "").trim();
  const nameParts = profileName.split(/\s+/).filter(Boolean);
  const firstName = userMetadata?.first_name || nameParts[0] || "";
  const lastName = userMetadata?.last_name || nameParts.slice(1).join(" ") || "";
  const country = userMetadata?.country || userMetadata?.country_name || "";
  const timezone = userMetadata?.timezone || "";

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/[0.06] flex items-center justify-center text-xl font-bold border-2 border-white/[0.12] relative shadow-inner text-white">
            {userInitials}

          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{userName}</h1>
            <p className="text-xs text-gray-400 mt-0.5">Account: <span className="font-mono text-gray-300">{activeChallenge?.accountId || "No active challenge"}</span></p>

          </div>
        </div>

      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <User size={16} className="text-white" /> Personal Details
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">First Name</label>
                <input type="text" value={firstName} readOnly className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-gray-400 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">Last Name</label>
                <input type="text" value={lastName} readOnly placeholder="—" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-gray-400 outline-none" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs text-gray-400 font-medium">Email Address</label>
                <input type="email" defaultValue={userEmail || ""} readOnly className="w-full bg-white/[0.03] border border-white/[0.08] text-gray-400 rounded-xl px-3.5 py-2 text-sm outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">Country</label>
                <input type="text" value={country} readOnly placeholder="—" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-gray-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-gray-400 font-medium">Timezone</label>
                <input type="text" value={timezone} readOnly placeholder="—" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-sm text-gray-500 outline-none" />
              </div>
              <div className="sm:col-span-2 pt-3">
                <p className="text-[10px] leading-relaxed text-gray-600">
                  Profile editing will appear here when account-profile persistence is enabled.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Shield size={16} className="text-white" /> Account
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Security and notification settings will appear here when they are available for your account.
            </p>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
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
        <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
          <table className="min-w-[760px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03]">
                <th className="py-3 px-6">Trader Name</th><th className="py-3 px-4">Account Tier</th><th className="py-3 px-4 text-center">Win Rate</th><th className="py-3 px-4 text-center">Profit Factor</th><th className="py-3 px-4 text-right">Avg Payout</th>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3 2xl:gap-6">
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
            <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-center text-xs font-medium text-gray-500">Module content coming soon</div>
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
            <div className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2 text-center text-xs font-medium text-gray-500">Module content coming soon</div>
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
            <div className="w-full rounded-xl border border-white/[0.12] bg-white/[0.04] py-2 text-center text-xs font-medium text-gray-500"><span className="inline-flex items-center gap-1.5"><Lock size={12} /> Locked until Phase 1</span></div>
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
        <div className="relative aspect-video rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col justify-center items-center p-6 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="w-14 h-14 rounded-full bg-white/[0.08] text-gray-500 flex items-center justify-center z-10"><Play size={20} className="ml-1" /></div>
          <div className="mt-4 max-w-sm z-10">
            <h4 className="text-xs font-bold text-white tracking-wide">Liquidity Inducement vs. True Breakouts</h4>
            <p className="text-[11px] text-gray-400 mt-1">Session access will appear here when the academy launches.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
const BillingSection = ({ userName }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
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
              <span className="text-[11px] font-medium text-gray-600">Editing unavailable</span>
            </div>
          </div>

          <div className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2"><CreditCard size={16} className="text-white" /> Cards on file</h2>
              <span className="text-xs font-medium text-gray-600">Card management unavailable</span>
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
            <p className="pt-1 text-[11px] text-gray-500">Refund terms will be shown here when the legal policy page is published.</p>
          </div>
        </div>
      </div>

      <section className="bg-[#0A0C12] rounded-2xl border border-white/[0.08] overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/[0.08]"><h2 className="text-sm font-bold uppercase tracking-wider text-white">Invoice & Order Ledger</h2></div>
        <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
          <table className="min-w-[760px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.07] text-[11px] font-bold uppercase tracking-wider text-gray-500 bg-white/[0.03]">
                <th className="py-3 px-6">Invoice ID</th><th className="py-3 px-4">Challenge Description</th><th className="py-3 px-4">Date</th><th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-right">Amount</th>
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
        <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
          <table className="min-w-[760px] w-full border-collapse text-left">
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
  { id: 'overview', name: 'Overview', icon: LayoutDashboard },
  { id: 'analytics', name: 'Performance', icon: BarChart3 },
  { id: 'calendar', name: 'Calendar', icon: Clock },
  { id: 'academy', name: 'Academy', icon: GraduationCap },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'profile', name: 'Settings', icon: User },
];
 


export default function Dashboard({ onBack = () => {}, onNewChallenge = () => {}, onFreeTrial = () => {}, trialChecking = false, trialError = "" }) {
  const { user, signOut, getAccessToken } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isOpen, setIsOpen] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true);
  const [workspaceError, setWorkspaceError] = useState("");
  const [traderLaunching, setTraderLaunching] = useState(false);
  const [launchError, setLaunchError] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Trader";
  const userInitials = userName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "TR";
  const availableAccounts = Array.isArray(workspace?.accounts) ? workspace.accounts : [];
  const defaultAccount = workspace?.activeChallenge || workspace?.demos?.find(account => account.enabled && ["NEW", "ACTIVE", "PHASE_2"].includes(account.status)) || availableAccounts[0] || null;
  const activeChallenge = availableAccounts.find(account => account.accountId === selectedAccountId) || defaultAccount;

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;

    const loadWorkspace = async () => {
      if (inFlight || cancelled) return;
      inFlight = true;
      try {
        setWorkspaceError("");
        const token = await getAccessToken();
        if (!token) throw new Error("Your ACG Funded session has expired.");
        const response = await fetch(`${API_URL}/api/customer/workspace`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-acg-session-id": getAnalyticsSessionId(),
          },
          cache: "no-store",
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.message || "Unable to load your trading workspace.");
        if (!cancelled) setWorkspace(payload?.data || null);
      } catch (error) {
        if (!cancelled) setWorkspaceError(error?.message || "Unable to load your trading workspace.");
      } finally {
        inFlight = false;
        if (!cancelled) setWorkspaceLoading(false);
      }
    };

    void loadWorkspace();
    const interval = window.setInterval(loadWorkspace, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [getAccessToken]);

  useEffect(() => {
    if (!availableAccounts.length) {
      if (selectedAccountId) setSelectedAccountId("");
      return;
    }
    const stillExists = availableAccounts.some(account => account.accountId === selectedAccountId);
    if (!stillExists && defaultAccount?.accountId) setSelectedAccountId(defaultAccount.accountId);
  }, [workspace, selectedAccountId]);

  const handleOpenTrader = async () => {
    if (!activeChallenge?.accountId || traderLaunching) return;

    setTraderLaunching(true);
    setLaunchError("");

    let traderWindow = null;

    try {
      // Open the tab synchronously from the user's click so browsers do not
      // treat the eventual federated launch as an unsolicited popup.
      traderWindow = window.open("about:blank", "_blank");
      if (!traderWindow) {
        throw new Error("Your browser blocked the ACG Trader tab. Allow pop-ups for ACG Funded and try again.");
      }

      // Prevent the trading application from retaining a reference to the
      // ACG Funded dashboard once the new tab is navigated cross-origin.
      traderWindow.opener = null;

      const token = await getAccessToken();
      if (!token) throw new Error("Your ACG Funded session has expired.");

      const response = await fetch(
        `${API_URL}/api/customer/accounts/${encodeURIComponent(activeChallenge.accountId)}/trading-launch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-acg-session-id": getAnalyticsSessionId(),
          },
        },
      );

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.data?.launchUrl) {
        throw new Error(payload?.message || "Unable to open ACG Trader.");
      }

      const launchUrl = new URL(payload.data.launchUrl, window.location.origin);
      const federationTicket = launchUrl.searchParams.get("ticket") || launchUrl.searchParams.get("acg_ticket");
      if (!federationTicket) {
        throw new Error("ACG Trader launch session is missing its federation ticket.");
      }

      traderWindow.location.replace(launchUrl.toString());
    } catch (error) {
      if (traderWindow && !traderWindow.closed) {
        traderWindow.close();
      }
      setLaunchError(error?.message || "Unable to open ACG Trader.");
    } finally {
      setTraderLaunching(false);
    }
  };

  const renderTabContent = () => {
    const propsPayload = {
      userName,
      userInitials,
      userEmail: user?.email || "",
      userMetadata: user?.user_metadata || {},
      activeChallenge,
      setActiveTab,
    };

    switch (activeTab) {
      case 'overview':
        return <OverviewSection {...propsPayload} account={activeChallenge} onStartTrial={onFreeTrial} onNewChallenge={onNewChallenge} />;
      case 'analytics':
        return <AnalyticsSection account={activeChallenge} />;
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
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#222222] bg-[#000000] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="-ml-1 flex h-11 w-11 items-center justify-center rounded-md text-[#888888] transition-colors hover:bg-white/[0.04] hover:text-[#EDEDED] lg:hidden"
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
            className="flex min-h-11 items-center gap-2 rounded-full pl-3 pr-2 hover:bg-[#111111] transition-colors focus:outline-none"
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

      <div className="relative z-10 flex min-w-0 flex-1">
        
        {/* --- SIDE NAVIGATION --- */}
        <aside className={`
          fixed inset-y-0 left-0 top-14 z-40
          w-[min(86vw,18rem)] bg-[#000000] border-r border-[#222222]
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:top-0 lg:w-64 xl:w-72 lg:translate-x-0 lg:shrink-0
          transition-transform duration-200 ease-in-out flex flex-col justify-between
        `}>
          <div className="p-4 space-y-5">
            <div className="relative">
              <p className="mb-2 px-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#555]">Trading account</p>
              <button
                type="button"
                onClick={() => setAccountMenuOpen(value => !value)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/[0.08] bg-[#080808] px-3 py-2.5 text-left hover:border-white/[0.14]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-white">{activeChallenge?.accountId || "No active account"}</p>
                  <p className="mt-0.5 truncate text-[10px] text-[#666]">
                    {activeChallenge ? `${money(activeChallenge.accountSize || 0)} · ${activeChallenge.accountMode === "DEMO" ? "Free Trial" : activeChallenge.status}` : "Choose or create an account"}
                  </p>
                </div>
                <ChevronDown size={14} className={`shrink-0 text-[#666] transition ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {accountMenuOpen && availableAccounts.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-lg border border-white/[0.1] bg-[#0a0a0a] p-1 shadow-2xl">
                  {availableAccounts.map(account => {
                    const selected = account.accountId === activeChallenge?.accountId;
                    return (
                      <button
                        key={account.accountId}
                        type="button"
                        onClick={() => {
                          setSelectedAccountId(account.accountId);
                          setAccountMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left ${selected ? "bg-white/[0.07]" : "hover:bg-white/[0.04]"}`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[11px] font-medium text-white">{account.accountId}</p>
                          <p className="mt-0.5 text-[9px] text-[#666]">{money(account.accountSize || 0)} · {account.accountMode === "DEMO" ? "Free Trial" : account.status}</p>
                        </div>
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${account.enabled ? "bg-emerald-400" : "bg-zinc-600"}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {activeChallenge && (
              <button
                type="button"
                onClick={handleOpenTrader}
                disabled={traderLaunching}
                className="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-white text-[12px] font-semibold text-black transition hover:bg-[#e8e8e8] disabled:opacity-50"
              >
                <ArrowUpRight size={14} />
                {traderLaunching ? "Opening…" : "Open ACG Trader"}
              </button>
            )}

            {/* Primary actions */}
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setIsSidebarOpen(false);
                  onNewChallenge();
                }}
                className="w-full h-11 lg:h-8 bg-white hover:bg-[#EBEBEB] text-black text-[13px] font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                New Challenge
              </button>
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  onFreeTrial();
                }}
                disabled={trialChecking}
                className="w-full h-11 lg:h-8 border border-[#333333] bg-[#0A0A0A] hover:bg-[#111111] text-white text-[13px] font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-wait disabled:opacity-50"
              >
                {trialChecking ? "Checking Trader…" : "Free Trial"}
              </button>
              {trialError && (
                <div className="rounded-md border border-amber-500/20 bg-amber-500/[0.05] px-3 py-2 text-[11px] leading-relaxed text-amber-300">
                  {trialError}
                </div>
              )}
            </div>

            <div> 
              <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#555555]">
                Workspace
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
                      className={`w-full min-h-11 lg:min-h-0 flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${
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
            className="fixed inset-0 top-14 z-30 bg-black/80 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* --- MAIN CONTENT AREA --- */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="dashboard-surface mx-auto w-full max-w-[1560px] px-4 py-5 pb-24 sm:px-6 sm:py-6 sm:pb-24 lg:px-7 lg:py-7 lg:pb-8 xl:px-8">
            {workspaceError && (
              <div className="mb-4 rounded-md border border-red-500/20 bg-red-500/[0.05] px-4 py-3 text-[12px] text-red-300">
                {workspaceError}
              </div>
            )}
            <PageHeader
              activeTab={activeTab}
              activeChallenge={activeChallenge}
              onOpenTrader={handleOpenTrader}
              traderLaunching={traderLaunching}
              launchError={launchError}
            />
            {workspaceLoading
              ? (
                <div className="grid min-h-[240px] place-items-center rounded-2xl border border-white/[0.08] bg-[#090b0f] text-[12px] font-semibold text-[#718092]">
                  Loading your trading workspace…
                </div>
              )
              : renderTabContent()}
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-white/[0.08] bg-black/95 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur lg:hidden">
        {[
          { id: "overview", label: "Overview", icon: LayoutDashboard },
          { id: "analytics", label: "Performance", icon: BarChart3 },
          { id: "calendar", label: "Calendar", icon: Clock },
        ].map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`flex min-h-12 flex-col items-center justify-center gap-1 py-1 text-[10px] ${active ? "text-white" : "text-[#666]"}`}>
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={handleOpenTrader}
          disabled={!activeChallenge || traderLaunching}
          className="flex min-h-12 flex-col items-center justify-center gap-1 py-1 text-[10px] text-white disabled:text-[#444]"
        >
          <ArrowUpRight size={16} />
          <span>Trade</span>
        </button>
      </nav>
    </div>
  );
}
