import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Rocket,
  Zap,
  Eye,
  EyeOff,
  Target,
  TrendingDown,
  ShieldAlert,
  CalendarCheck,
  Clock,
  RotateCcw,
  Gift,
  HelpCircle,
  GraduationCap,
  Brain,
  Gauge,
  Calendar,
  LineChart,
  NotebookPen,
  Bell
} from "lucide-react";

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD", rate: 1.08, countryCode: "us" },
  { code: "GBP", symbol: "£", label: "GBP", rate: 0.85, countryCode: "gb" },
  { code: "EUR", symbol: "€", label: "EUR", rate: 1,    countryCode: "eu" }, 
];

const MORE_CURRENCIES = [
  { code: "CHF", symbol: "CHF ", label: "CHF", rate: 0.95 },
  { code: "AUD", symbol: "A$", label: "AUD", rate: 1.65 },
  { code: "CAD", symbol: "C$", label: "CAD", rate: 1.47 },
  { code: "PLN", symbol: "zł", label: "PLN", rate: 4.3 },
];

const ALL_CURRENCIES = [...CURRENCIES, ...MORE_CURRENCIES];

const STEP_MODES = [
  { id: "2-step", label: "2-Step", sub: "Standard 2-Phase", icon: Rocket },
  { id: "1-step", label: "1-Step", sub: "Single step to Funded", icon: Zap },
];

// All prices below are sourced in USD and stored internally as EUR-base
// (priceEUR = usdPrice / USD.rate) so the existing multi-currency converter
// keeps working unchanged for every currency option.
const USD_RATE = CURRENCIES.find((c) => c.code === "USD").rate;
const toEurBase = (usd) => usd / USD_RATE;

// Avg. Reward figures are not provided by the new pricing sheet, so they are
// estimated at ~6% of account size (in line with the previous data's ratio).
// Update these with real figures whenever they're available.
const estimateAvgReward = (size) => Math.round((size * 0.06) / 5) * 5;

const ACCOUNTS_1STEP = [
  { id: "10k", size: 10000, priceEUR: toEurBase(89), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(10000), badge: null },
  { id: "25k", size: 25000, priceEUR: toEurBase(98), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(25000), badge: null },
  { id: "50k", size: 50000, priceEUR: toEurBase(301), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(50000), badge: null },
  { id: "100k", size: 100000, priceEUR: toEurBase(549), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(100000), badge: "best" },
  { id: "200k", size: 200000, priceEUR: toEurBase(910), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(200000), badge: null },
];

const ACCOUNTS_2STEP = [
  { id: "5k", size: 5000, priceEUR: toEurBase(49), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(5000), badge: null },
  { id: "10k", size: 10000, priceEUR: toEurBase(69), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(10000), badge: null },
  { id: "25k", size: 25000, priceEUR: toEurBase(129), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(25000), badge: null },
  { id: "50k", size: 50000, priceEUR: toEurBase(249), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(50000), badge: null },
  { id: "100k", size: 100000, priceEUR: toEurBase(448), oldPriceEUR: null, avgRewardEUR: estimateAvgReward(100000), badge: "best" },
];

const ACCOUNTS_BY_MODE = {
  "1-step": ACCOUNTS_1STEP,
  "2-step": ACCOUNTS_2STEP,
};

const OBJECTIVES_BY_MODE = {
  "1-step": {
    profitTarget: { phase1: 10, phase2: null },
    maxDailyLoss: 3,
    maxLoss: 6,
    minTradingDays: 4,
    tradingPeriod: "Unlimited",
    refund: 100,
    rewardsMax: 80,
  },
  "2-step": {
    profitTarget: { phase1: 8, phase2: 6 },
    maxDailyLoss: 5,
    maxLoss: 10,
    minTradingDays: 4,
    tradingPeriod: "Unlimited",
    refund: 100,
    rewardsMax: 80,
  },
};

const PERKS = [
  { label: "Academy", icon: GraduationCap, isBranded: true },
  { label: "Psychology Course", icon: Brain },
  { label: "Account MetriX", icon: Gauge },
  { label: "Economic Calendar", icon: Calendar },
  { label: "Equity Simulator", icon: LineChart },
  { label: "Trading Journal", icon: NotebookPen },
  { label: "News Indicator", icon: Bell },
];

const LEGEND = [
  { key: "profitTarget", label: "Profit Target", icon: Target },
  { key: "maxDailyLoss", label: "Max Daily Loss", icon: TrendingDown },
  { key: "maxLoss", label: "Max Loss", icon: ShieldAlert },
  { key: "minTradingDays", label: "Min Trading days", icon: CalendarCheck },
  { key: "tradingPeriod", label: "Trading Period", icon: Clock },
  { key: "refund", label: "Refund", icon: RotateCcw },
  { key: "rewards", label: "Rewards", icon: Gift },
];

// ---------------------------------------------------------------------------
// Layout Dimensions
// ---------------------------------------------------------------------------
const ROW_HEIGHT = "64px";
const HEADER_HEIGHT = "120px";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fmtInt = (n) => Math.round(n).toLocaleString("en-US");
const money = (amount, currency) => `${currency.symbol}${fmtInt(amount)}`;
const convert = (eurAmount, currency) => eurAmount * currency.rate;

// ---------------------------------------------------------------------------
// Phase Table View
// ---------------------------------------------------------------------------
function PhaseTableView({ currency, showNumbers, accounts, selectedAccountId, onSelect, objectives }) {
  const account = accounts.find((a) => a.id === selectedAccountId) ?? accounts[0];
  const price = convert(account.priceEUR, currency);
  const isBest = account.badge === "best";

  if (!objectives) return null;

  const dailyLossValue = showNumbers ? money((account.size * objectives.maxDailyLoss) / 100, currency) : `${objectives.maxDailyLoss}%`;
  const maxLossValue = showNumbers ? money((account.size * objectives.maxLoss) / 100, currency) : `${objectives.maxLoss}%`;

  const rows = [
    {
      key: "profitTarget",
      icon: Target,
      label: "Profit Target",
      phase1: `${objectives.profitTarget.phase1}%`,
      phase2: objectives.profitTarget.phase2 !== null ? `${objectives.profitTarget.phase2}%` : "—",
      account: "—",
    },
    {
      key: "maxDailyLoss",
      icon: TrendingDown,
      label: "Max Daily Loss",
      phase1: dailyLossValue,
      phase2: objectives.profitTarget.phase2 !== null ? dailyLossValue : "—",
      account: dailyLossValue,
    },
    {
      key: "maxLoss",
      icon: ShieldAlert,
      label: "Max Loss",
      phase1: maxLossValue,
      phase2: objectives.profitTarget.phase2 !== null ? maxLossValue : "—",
      account: maxLossValue,
    },
    {
      key: "minTradingDays",
      icon: CalendarCheck,
      label: "Min Trading days",
      phase1: `${objectives.minTradingDays} days`,
      phase2: objectives.profitTarget.phase2 !== null ? `${objectives.minTradingDays} days` : "—",
      account: "Unlimited",
    },
    {
      key: "tradingPeriod",
      icon: Clock,
      label: "Trading Period",
      phase1: objectives.tradingPeriod,
      phase2: objectives.profitTarget.phase2 !== null ? objectives.tradingPeriod : "—",
      account: "Unlimited",
    },
    {
      key: "refund",
      icon: RotateCcw,
      label: "Refund",
      phase1: "—",
      phase2: "—",
      account: (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400">
          Yes {objectives.refund}%
        </span>
      ),
    },
    {
      key: "rewards",
      icon: Gift,
      label: "Rewards",
      phase1: "—",
      phase2: "—",
      account: `up to ${objectives.rewardsMax}% of the profit`,
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap gap-2 justify-center sm:justify-start">
        {accounts.map((acc) => {
          const active = acc.id === account.id;
          return (
            <button
              key={acc.id}
              type="button"
              onClick={() => onSelect(acc.id)}
              className={`relative rounded-xl border px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C7DFF]/60 ${
                active
                  ? "border-white/[0.15] bg-white/[0.08] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] scale-105"
                  : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:border-white/[0.1] hover:text-white"
              }`}
            >
              {acc.size / 1000}K
              {acc.badge === "best" && (
                <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#FF8A3D] to-[#FF5252] shadow-[0_0_8px_rgba(255,122,61,0.6)]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0C12]/80 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto selection:bg-blue-500/30">
          <table className="w-full min-w-[768px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.06] text-[11px] uppercase tracking-widest text-slate-500 bg-white/[0.01]">
                <th className="px-6 py-5 font-semibold">Trading Objectives</th>
                <th className="px-6 py-5 font-semibold">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm normal-case text-slate-200 font-bold">Phase 1</span>
                    <span className="text-[10.5px] text-slate-500 tracking-normal font-medium">Challenge</span>
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm normal-case text-slate-200 font-bold">Phase 2</span>
                    <span className="text-[10.5px] text-slate-500 tracking-normal font-medium">Verification</span>
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm normal-case text-white font-black">Account</span>
                    <span className="text-[10.5px] text-slate-400 tracking-normal font-semibold">Account</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {rows.map((row, i) => (
                <motion.tr
                  key={row.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                  className="group transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-white/[0.03] p-2 text-slate-400 transition-colors group-hover:bg-white/[0.06] group-hover:text-white">
                        <row.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-sm font-semibold text-slate-300">{row.phase1}</td>
                  <td className="px-6 py-4.5 text-sm font-semibold text-slate-300">{row.phase2}</td>
                  <td className="px-6 py-4.5 text-sm font-bold text-white bg-white/[0.01] group-hover:bg-transparent transition-colors">{row.account}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/[0.06] bg-black/40 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Account Size</div>
            <div className="mt-1 text-2xl font-black text-white tracking-tight">{money(account.size, currency)}</div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <div className="text-left sm:text-right">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Refundable Price</div>
              <div className="text-2xl font-black text-white tracking-tight">{money(price, currency)}</div>
            </div>
            <button
              type="button"
              onClick={() => onStart(account)}
              className={`relative overflow-hidden rounded-xl px-8 py-4 text-sm font-extrabold text-white transition-all active:scale-[0.98] text-center shadow-lg
                ${
                  isBest
                    ? "bg-gradient-to-r from-[#FF7A3D] to-[#FF5252] shadow-[0_4px_20px_rgba(255,82,82,0.25)] hover:shadow-[0_4px_30px_rgba(255,82,82,0.45)] hover:brightness-110"
                    : "bg-[#2E6BFF] shadow-[0_4px_20px_rgba(46,107,255,0.2)] hover:bg-[#4C7DFF]"
                }`}
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function ChallengeSection({ onSelectPlan }) {
  const [stepMode, setStepMode] = useState("2-step");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [showNumbers, setShowNumbers] = useState(false);
  const [showPhases, setShowPhases] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("100k");

  const currency = useMemo(() => ALL_CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0], [currencyCode]);

  const accounts = useMemo(() => ACCOUNTS_BY_MODE[stepMode], [stepMode]);
  const currentObjectives = useMemo(() => OBJECTIVES_BY_MODE[stepMode], [stepMode]);

  // Keep the selected account valid whenever the step mode changes (account
  // line-ups differ between 1-step and 2-step, e.g. 2-step also offers $5k).
  useEffect(() => {
    if (!accounts.find((a) => a.id === selectedAccountId)) {
      const fallback = accounts.find((a) => a.badge === "best") ?? accounts[0];
      setSelectedAccountId(fallback.id);
    }
  }, [accounts, selectedAccountId]);

  const isOneStep = stepMode === "1-step";
  const handleStart = (account) => {
    if (onSelectPlan) {
      onSelectPlan({
        stepMode,
        currencyCode,
        accountId: account.id,
        accountSize: account.size,
        priceEUR: account.priceEUR,
        price: convert(account.priceEUR, currency), // price in currently selected display currency
        currency, // full currency object {code, symbol, rate,...}
      });
    }
  };

  return (
    <section id="challenges" className="relative overflow-hidden bg-[#05060A] px-4  min-h-screen flex items-center text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Structural Visual Effects */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-[#2E6BFF] blur-[160px] opacity-[0.08]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FF7A3D] blur-[160px] opacity-[0.06]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_30%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Top Toggles */}
        <div className="mb-10 flex justify-center">
          <div className="relative flex w-full max-w-md sm:inline-flex rounded-2xl border border-white/[0.08] bg-[#0A0C12]/80 p-1.5 backdrop-blur-xl shadow-2xl">
            {STEP_MODES.map((mode) => {
              const Icon = mode.icon;
              const active = stepMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setStepMode(mode.id)}
                  className={`relative flex-1 flex items-center gap-3 rounded-xl px-4 py-3 sm:px-6 text-left transition-colors duration-300 outline-none z-10 ${
                    active ? "text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="step-mode-indicator"
                      className="absolute inset-0 z-0 rounded-xl bg-white/[0.06] border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${active ? "bg-white/10 text-white" : "bg-transparent text-slate-500"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-black leading-tight tracking-wide">{mode.label}</span>
                      <span className={`block text-[10.5px] font-medium leading-none mt-1 ${active ? "text-slate-400" : "text-slate-600"}`}>
                        {mode.sub}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency & Control Row */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border border-white/[0.05] bg-white/[0.02] p-4 rounded-2xl backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 bg-[#0c0d0f] p-1.5 rounded-xl border border-white/[0.04]">
            {CURRENCIES.map((c) => {
              const active = currencyCode === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrencyCode(c.code)}
                  className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all duration-200 select-none ${
                    active 
                      ? "bg-[#2A2B30] text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] border border-white/10" 
                      : "bg-transparent text-slate-500 hover:text-white"
                  }`}
                >
                  <span 
                    className={`fi fi-${c.countryCode} w-4 h-4 rounded-full object-cover shrink-0`}
                    style={{ backgroundPosition: 'center', backgroundSize: 'cover' }}
                  />
                  <span className="tracking-wide">{c.code}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 justify-between lg:justify-end">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${showNumbers ? "bg-[#2E6BFF]" : "bg-white/10 group-hover:bg-white/20"}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showNumbers}
                  onChange={(e) => setShowNumbers(e.target.checked)}
                />
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${showNumbers ? "translate-x-4" : "translate-x-1"}`} />
              </div>
              <span className="text-sm font-semibold text-slate-400 group-hover:text-white transition-colors">Show Numbers</span>
            </label>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            <button
              type="button"
              onClick={() => setShowPhases(!showPhases)}
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors group py-1"
            >
              {showPhases ? <Eye className="h-4 w-4 text-[#2E6BFF]" /> : <EyeOff className="h-4 w-4 text-slate-500 group-hover:text-white" />}
              <span>{showPhases ? "Hide Detailed Phases" : "View Detailed Phases"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Structural Grid Display Engine */}
        <AnimatePresence mode="wait">
          {!showPhases ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-row items-stretch gap-0 lg:gap-4 overflow-visible">
                {/* Left Static Column (Hidden below large screens to safeguard layout) */}
                <div className="hidden lg:flex w-[240px] shrink-0 flex-col pt-6">
                  <div style={{ height: HEADER_HEIGHT }} className="flex flex-col justify-end pb-5 px-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Comparison Matrix</span>
                  </div>
                  
                  {LEGEND.map(({ key, label, icon: Icon }) => (
                    <div 
                      key={key} 
                      style={{ height: ROW_HEIGHT }} 
                      className="flex items-center gap-3 justify-start px-2 border-b border-white/[0.02]"
                    >
                      <div className="w-5 h-5 rounded-full border border-slate-700/60 flex items-center justify-center text-slate-500 shrink-0 bg-white/[0.01]">
                        <Icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-semibold text-slate-400 tracking-wide">
                        {label}
                      </span>
                    </div>
                  ))}
                  
                  <div className="px-2 pt-12 text-xs font-semibold text-slate-500 leading-relaxed max-w-[160px]">
                    One-time refundable fee from
                  </div>
                </div>

                {/* Scrolling Matrix Layout Block */}
                <div className="w-full flex flex-row gap-4 overflow-x-auto pb-6 pt-4 snap-x snap-mandatory mask-scroll-edge lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0 px-2 sm:px-4 lg:px-0">
                  {accounts.map((account, idx) => {
                    const price = convert(account.priceEUR, currency);
                    const oldPrice = account.oldPriceEUR ? convert(account.oldPriceEUR, currency) : null;
                    const dailyLossValue = showNumbers ? money((account.size * currentObjectives.maxDailyLoss) / 100, currency) : `${currentObjectives.maxDailyLoss}%`;
                    const maxLossValue = showNumbers ? money((account.size * currentObjectives.maxLoss) / 100, currency) : `${currentObjectives.maxLoss}%`;
                    const isBest = account.badge === "best";

                    return (
                      <div key={account.id} className="w-[280px] sm:w-[300px] lg:w-auto shrink-0 snap-center flex flex-col gap-4 transition-transform duration-300 hover:-translate-y-1">
                        
                        {/* Interactive Premium Account Structural Card */}
                        <div className="relative flex-1 flex flex-col">
                          {isBest && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff7a00] to-[#ff4500] text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md z-20 shadow-xl shadow-orange-500/10 border border-orange-400/20 whitespace-nowrap">
                              Best Value
                            </div>
                          )}

                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.25 }}
                            className={`flex-1 border rounded-2xl px-5 py-6 flex flex-col shadow-2xl text-center backdrop-blur-sm ${
                              isBest 
    ? "bg-[#0f172a]/95 border-blue-500/30 shadow-blue-900/5 ring-1 ring-blue-500/10" 
    : "bg-[#111214]/90 border-white/[0.04] shadow-black/40"
                            }`}
                          >
                            {/* Account Card Header Row */}
                            <div style={{ height: HEADER_HEIGHT }} className="flex flex-col items-center justify-end pb-5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Account Size</span>
                              <span className="text-3xl font-black text-white tracking-tight leading-none">
                                {money(account.size, currency)}
                              </span>
                            </div>

                            {/* Responsive Structural Dynamic Blocks */}
                            <div className="w-full flex flex-col divide-y divide-white/[0.03]">
                              {LEGEND.map(({ key, label }) => {
                                var content = null;

                                if (key === "profitTarget") {
                                  content = isOneStep ? (
                                    <span className="text-sm font-bold text-slate-200">{currentObjectives.profitTarget.phase1}%</span>
                                  ) : (
                                    <div className="flex flex-col gap-1 w-full text-xs">
                                      <div className="flex items-center justify-between lg:justify-start lg:gap-3">
                                        <span className="text-slate-500 font-bold text-[10px]">P1</span>
                                        <span className="text-white font-black">{currentObjectives.profitTarget.phase1}%</span>
                                      </div>
                                      <div className="flex items-center justify-between lg:justify-start lg:gap-3">
                                        <span className="text-slate-500 font-bold text-[10px]">P2</span>
                                        <span className="text-white font-black">{currentObjectives.profitTarget.phase2}%</span>
                                      </div>
                                    </div>
                                  );
                                } else if (key === "maxDailyLoss") {
                                  content = <span className="text-sm font-bold text-slate-200">{dailyLossValue}</span>;
                                } else if (key === "maxLoss") {
                                  content = <span className="text-sm font-bold text-slate-200">{maxLossValue}</span>;
                                } else if (key === "minTradingDays") {
                                  content = (
                                    <span className="text-sm font-bold text-slate-200">
                                      {currentObjectives.minTradingDays === 0 ? "0 days" : `${currentObjectives.minTradingDays} days`}
                                    </span>
                                  );
                                } else if (key === "tradingPeriod") {
                                  content = <span className="text-sm font-bold text-slate-200">{currentObjectives.tradingPeriod}</span>;
                                } else if (key === "refund") {
                                  content = (
                                    <div className="flex items-center gap-1.5 justify-end lg:justify-start">
                                      <span className="text-sm font-bold text-slate-200">Yes</span>
                                      <span className="bg-[#102a1d] border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-black text-[#10b981]">
                                        {currentObjectives.refund}%
                                      </span>
                                    </div>
                                  );
                                } else if (key === "rewards") {
                                  content = <span className="text-sm font-bold text-slate-200">up to {currentObjectives.rewardsMax}%</span>;
                                }

                                return (
                                  <div 
                                    key={key} 
                                    style={{ height: ROW_HEIGHT }} 
                                    className="flex items-center justify-between lg:justify-start text-left"
                                  >
                                    {/* Mobile/Tablet Inline Legend Labels */}
                                    <span className="text-xs font-semibold text-slate-500 lg:hidden pr-4">{label}</span>
                                    <div className="text-right lg:text-left">{content}</div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="w-full h-[1px] bg-white/[0.04] mt-5 mb-5" />
                            
                            {/* Cost Optimization Elements */}
                            <div className="w-full flex flex-col items-center gap-4 mt-auto">
                              <div className="flex items-center justify-center gap-2 h-8">
                                {oldPrice ? (
                                  <>
                                    <span className="text-sm font-black text-[#ff7a00] flex items-center gap-0.5 shrink-0 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10">
                                      {money(price, currency)}
                                    </span>
                                    <span className="text-xs text-slate-500 line-through font-bold">
                                      {money(oldPrice, currency)}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-black text-white tracking-tight">
                                    {money(price, currency)}
                                  </span>
                                )}
                              </div>

                              <button 
                                onClick={() => handleStart(account)}
                                type="button" 
                                className="w-full rounded-xl bg-[#007fff] hover:bg-[#0072e3] py-3 text-xs font-black text-white uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-blue-600/10"
                              >
                                Start now
                              </button>
                            </div>
                          </motion.div>
                        </div>

                        {/* Segregated Detached Reward Metric Segment */}
                        <div className="w-full rounded-xl bg-[#111214]/80 border border-white/[0.04] p-3.5 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                          <span className="bg-white/[0.05] border border-white/5 rounded px-2 py-0.5 text-xs font-bold text-white tracking-wide mb-1">
                            {money(convert(account.avgRewardEUR, currency), currency)}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                            <span>Avg. Reward</span>
                            <HelpCircle className="w-3 h-3 text-slate-600" />
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Integrated Elegant Perks System Block */}
              <div className="mt-4 ">
                <div className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center sm:text-left">
                  You will also get access to:
                </div>
                <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                  {PERKS.map(({ label, icon: Icon, isBranded }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.04] bg-[#0d0e12]/50 text-slate-300 text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white cursor-pointer select-none"
                    >
                      <Icon className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-slate-300" />
                      <span className="tracking-wide">
                        {isBranded ? (
                          <>
                            <span className="text-red-500 font-extrabold mr-1">ACG Forex</span>
                            <span>{label}</span>
                          </>
                        ) : (
                          label
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
             <motion.div
              key="table"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full flex flex-col gap-8"
             >
                <PhaseTableView
                  currency={currency}
                  showNumbers={showNumbers}
                  accounts={accounts}
                  selectedAccountId={selectedAccountId}
                  onSelect={setSelectedAccountId}
                  objectives={currentObjectives}
                  onStart={handleStart}
                />

                {/* Integrated Elegant Perks System Block (Table Phase Fallback) */}
                <div className="border-t border-white/[0.04] pt-8">
                  <div className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 text-center sm:text-left">
                    You will also get access to:
                  </div>
                  <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    {PERKS.map(({ label, icon: Icon, isBranded }) => (
                      <div
                        key={label}
                        className="group flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.04] bg-[#0d0e12]/50 text-slate-300 text-xs font-semibold backdrop-blur-md transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04] hover:text-white cursor-pointer select-none"
                      >
                        <Icon className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-slate-300" />
                        <span className="tracking-wide">
                          {isBranded ? (
                            <>
                              <span className="text-red-500 font-extrabold mr-1">ACG Forex</span>
                              <span>{label}</span>
                            </>
                          ) : (
                            label
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}