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
  Bell,
  Check,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Design tokens — strict black / white / gray. No hue, anywhere.
// Signature move: the recommended plan inverts to a solid white card. That's
// the only "color" contrast in the whole layout — everything else is value.
// ---------------------------------------------------------------------------
const ICON_STROKE = 1.5;

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD", rate: 1.08, countryCode: "us" },
  { code: "GBP", symbol: "£", label: "GBP", rate: 0.85, countryCode: "gb" },
  { code: "EUR", symbol: "€", label: "EUR", rate: 1, countryCode: "eu" },
];

const MORE_CURRENCIES = [
  { code: "CHF", symbol: "CHF ", label: "CHF", rate: 0.95 },
  { code: "AUD", symbol: "A$", label: "AUD", rate: 1.65 },
  { code: "CAD", symbol: "C$", label: "CAD", rate: 1.47 },
  { code: "PLN", symbol: "zł", label: "PLN", rate: 4.3 },
];

const ALL_CURRENCIES = [...CURRENCIES, ...MORE_CURRENCIES];

const STEP_MODES = [
  { id: "2-step", label: "2-Step", sub: "Standard 2-phase evaluation", icon: Rocket },
  { id: "1-step", label: "1-Step", sub: "Single pass to funded", icon: Zap },
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
const ROW_HEIGHT = "60px";
const HEADER_HEIGHT = "112px";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fmtInt = (n) => Math.round(n).toLocaleString("en-US");
const money = (amount, currency) => `${currency.symbol}${fmtInt(amount)}`;
const convert = (eurAmount, currency) => eurAmount * currency.rate;

// ---------------------------------------------------------------------------
// Phase Table View
// ---------------------------------------------------------------------------
function PhaseTableView({ currency, showNumbers, accounts, selectedAccountId, onSelect, objectives, onStart }) {
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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] border border-white/[0.12] px-2.5 py-1 text-xs font-medium text-white">
          <Check className="h-3 w-3" strokeWidth={2} />
          {objectives.refund}%
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
              className={`relative rounded-lg border px-4 py-2.5 sm:px-5 sm:py-3 text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                active
                  ? "border-white bg-white text-black"
                  : "border-white/[0.12] bg-transparent text-zinc-400 hover:border-white/[0.24] hover:text-white"
              }`}
            >
              {acc.size / 1000}K
              {acc.badge === "best" && !active && (
                <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0A0B]">
        <div className="overflow-x-auto selection:bg-white/20">
          <table className="w-full min-w-[768px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] uppercase tracking-widest text-zinc-500">
                <th className="px-6 py-5 font-medium">Trading Objectives</th>
                <th className="px-6 py-5 font-medium">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm normal-case text-zinc-200 font-semibold">Phase 1</span>
                    <span className="text-[10.5px] text-zinc-600 tracking-normal font-normal">Challenge</span>
                  </div>
                </th>
                <th className="px-6 py-5 font-medium">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm normal-case text-zinc-200 font-semibold">Phase 2</span>
                    <span className="text-[10.5px] text-zinc-600 tracking-normal font-normal">Verification</span>
                  </div>
                </th>
                <th className="px-6 py-5 font-medium">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm normal-case text-white font-semibold">Funded Account</span>
                    <span className="text-[10.5px] text-zinc-600 tracking-normal font-normal">Live</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {rows.map((row, i) => (
                <motion.tr
                  key={row.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="group transition-colors hover:bg-white/[0.02]"
                >
                  <td className="px-6 py-4.5">
                    <div className="flex items-center gap-3">
                      <row.icon className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" strokeWidth={ICON_STROKE} />
                      <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{row.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-sm font-medium text-zinc-400">{row.phase1}</td>
                  <td className="px-6 py-4.5 text-sm font-medium text-zinc-400">{row.phase2}</td>
                  <td className="px-6 py-4.5 text-sm font-semibold text-white">{row.account}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-6 border-t border-white/[0.08] bg-black/40 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Account Size</div>
            <div className="mt-1 text-2xl font-semibold text-white tracking-tight tabular-nums">{money(account.size, currency)}</div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
            <div className="text-left sm:text-right">
              <div className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">Refundable Price</div>
              <div className="text-2xl font-semibold text-white tracking-tight tabular-nums">{money(price, currency)}</div>
            </div>
            <button
              type="button"
              onClick={() => onStart(account)}
              className="rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-black transition-all active:scale-[0.98] hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
            >
              Start challenge
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
    <section id="challenges" className="relative overflow-hidden bg-black px-4 min-h-screen flex items-center text-zinc-300 font-sans selection:bg-white/20">
      {/* Ambient depth — pure white bloom at near-zero opacity, no hue */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[70%] h-[45%] rounded-full bg-white blur-[180px] opacity-[0.025]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_25%,transparent_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Section eyebrow */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500">
            <span className="h-1 w-1 rounded-full bg-zinc-500" />
            Pricing
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">Choose your challenge</h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto sm:mx-0">
            Transparent objectives, one-time fee, fully refundable on your first payout.
          </p>
        </div>

        {/* Top Toggles */}
        <div className="mb-8 flex justify-center sm:justify-start">
          <div className="relative flex w-full max-w-md sm:inline-flex rounded-xl border border-white/[0.08] bg-[#0A0A0B] p-1">
            {STEP_MODES.map((mode) => {
              const Icon = mode.icon;
              const active = stepMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setStepMode(mode.id)}
                  className={`relative flex-1 flex items-center gap-3 rounded-lg px-4 py-3 sm:px-6 text-left transition-colors duration-200 outline-none z-10 ${
                    active ? "text-black" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="step-mode-indicator"
                      className="absolute inset-0 z-0 rounded-lg bg-white"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className="h-4 w-4" strokeWidth={ICON_STROKE} />
                    <div>
                      <span className="block text-sm font-semibold leading-tight tracking-tight">{mode.label}</span>
                      <span className={`block text-[10.5px] leading-none mt-1 ${active ? "text-zinc-600" : "text-zinc-600"}`}>
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
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border border-white/[0.08] bg-[#0A0A0B] p-4 rounded-xl">
          <div className="flex flex-wrap items-center gap-1 bg-black p-1 rounded-lg border border-white/[0.06]">
            {CURRENCIES.map((c) => {
              const active = currencyCode === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrencyCode(c.code)}
                  className={`relative flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-150 select-none ${
                    active ? "bg-white/[0.1] text-white" : "bg-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span
                    className={`fi fi-${c.countryCode} w-4 h-4 rounded-full object-cover shrink-0 grayscale opacity-80`}
                    style={{ backgroundPosition: "center", backgroundSize: "cover" }}
                  />
                  <span className="tracking-wide">{c.code}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 justify-between lg:justify-end">
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${showNumbers ? "bg-white" : "bg-white/[0.12] group-hover:bg-white/20"}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showNumbers}
                  onChange={(e) => setShowNumbers(e.target.checked)}
                />
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full shadow-md transition-transform duration-200 ${showNumbers ? "translate-x-4 bg-black" : "translate-x-1 bg-white"}`} />
              </div>
              <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">Show Numbers</span>
            </label>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            <button
              type="button"
              onClick={() => setShowPhases(!showPhases)}
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group py-1"
            >
              {showPhases ? (
                <Eye className="h-4 w-4 text-white" strokeWidth={ICON_STROKE} />
              ) : (
                <EyeOff className="h-4 w-4 text-zinc-500 group-hover:text-white" strokeWidth={ICON_STROKE} />
              )}
              <span>{showPhases ? "Hide detailed phases" : "View detailed phases"}</span>
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
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-row items-stretch gap-0 lg:gap-4 overflow-visible">
                {/* Left Static Column (Hidden below large screens to safeguard layout) */}
                <div className="hidden lg:flex w-[220px] shrink-0 flex-col pt-6">
                  <div style={{ height: HEADER_HEIGHT }} className="flex flex-col justify-end pb-5 px-2">
                    <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">Objectives</span>
                  </div>

                  {LEGEND.map(({ key, label, icon: Icon }) => (
                    <div key={key} style={{ height: ROW_HEIGHT }} className="flex items-center gap-3 justify-start px-2 border-b border-white/[0.02]">
                      <Icon className="h-3.5 w-3.5 text-zinc-600 shrink-0" strokeWidth={ICON_STROKE} />
                      <span className="text-sm font-medium text-zinc-500 tracking-tight">{label}</span>
                    </div>
                  ))}

                  <div className="px-2 pt-10 text-xs text-zinc-600 leading-relaxed max-w-[160px]">
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
                        {/* Interactive Premium Account Structural Card — the recommended
                            plan inverts to solid white. That inversion is the entire
                            "signature" device; nothing else in the layout carries color. */}
                        <div className="relative flex-1 flex flex-col">
                          {isBest && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full z-20 border border-white/20 whitespace-nowrap">
                              Recommended
                            </div>
                          )}

                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.04, duration: 0.25 }}
                            className={`flex-1 border rounded-2xl px-5 py-6 flex flex-col text-center ${
                              isBest ? "bg-white border-white text-black" : "bg-[#0A0A0B] border-white/[0.08] text-zinc-300"
                            }`}
                          >
                            {/* Account Card Header Row */}
                            <div style={{ height: HEADER_HEIGHT }} className="flex flex-col items-center justify-end pb-5">
                              <span className={`text-[10px] font-medium uppercase tracking-widest mb-1.5 ${isBest ? "text-black/50" : "text-zinc-500"}`}>
                                Account Size
                              </span>
                              <span className={`text-3xl font-semibold tracking-tight leading-none tabular-nums ${isBest ? "text-black" : "text-white"}`}>
                                {money(account.size, currency)}
                              </span>
                            </div>

                            {/* Responsive Structural Dynamic Blocks */}
                            <div className={`w-full flex flex-col divide-y ${isBest ? "divide-black/[0.08]" : "divide-white/[0.05]"}`}>
                              {LEGEND.map(({ key, label }) => {
                                var content = null;
                                const strong = isBest ? "text-black" : "text-zinc-100";
                                const soft = isBest ? "text-black/45" : "text-zinc-500";

                                if (key === "profitTarget") {
                                  content = isOneStep ? (
                                    <span className={`text-sm font-semibold ${strong}`}>{currentObjectives.profitTarget.phase1}%</span>
                                  ) : (
                                    <div className="flex flex-col gap-1 w-full text-xs">
                                      <div className="flex items-center justify-between lg:justify-start lg:gap-3">
                                        <span className={`font-medium text-[10px] ${soft}`}>P1</span>
                                        <span className={`font-semibold ${strong}`}>{currentObjectives.profitTarget.phase1}%</span>
                                      </div>
                                      <div className="flex items-center justify-between lg:justify-start lg:gap-3">
                                        <span className={`font-medium text-[10px] ${soft}`}>P2</span>
                                        <span className={`font-semibold ${strong}`}>{currentObjectives.profitTarget.phase2}%</span>
                                      </div>
                                    </div>
                                  );
                                } else if (key === "maxDailyLoss") {
                                  content = <span className={`text-sm font-semibold ${strong}`}>{dailyLossValue}</span>;
                                } else if (key === "maxLoss") {
                                  content = <span className={`text-sm font-semibold ${strong}`}>{maxLossValue}</span>;
                                } else if (key === "minTradingDays") {
                                  content = (
                                    <span className={`text-sm font-semibold ${strong}`}>
                                      {currentObjectives.minTradingDays === 0 ? "0 days" : `${currentObjectives.minTradingDays} days`}
                                    </span>
                                  );
                                } else if (key === "tradingPeriod") {
                                  content = <span className={`text-sm font-semibold ${strong}`}>{currentObjectives.tradingPeriod}</span>;
                                } else if (key === "refund") {
                                  content = (
                                    <div className="flex items-center gap-1.5 justify-end lg:justify-start">
                                      <Check className={`h-3.5 w-3.5 ${strong}`} strokeWidth={2} />
                                      <span className={`text-sm font-semibold ${strong}`}>{currentObjectives.refund}%</span>
                                    </div>
                                  );
                                } else if (key === "rewards") {
                                  content = <span className={`text-sm font-semibold ${strong}`}>up to {currentObjectives.rewardsMax}%</span>;
                                }

                                return (
                                  <div key={key} style={{ height: ROW_HEIGHT }} className="flex items-center justify-between lg:justify-start text-left">
                                    {/* Mobile/Tablet Inline Legend Labels */}
                                    <span className={`text-xs font-medium lg:hidden pr-4 ${soft}`}>{label}</span>
                                    <div className="text-right lg:text-left">{content}</div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className={`w-full h-[1px] mt-5 mb-5 ${isBest ? "bg-black/[0.08]" : "bg-white/[0.06]"}`} />

                            {/* Cost Optimization Elements */}
                            <div className="w-full flex flex-col items-center gap-4 mt-auto">
                              <div className="flex items-center justify-center gap-2 h-8">
                                {oldPrice ? (
                                  <>
                                    <span className={`text-sm font-semibold tabular-nums ${isBest ? "text-black" : "text-white"}`}>
                                      {money(price, currency)}
                                    </span>
                                    <span className={`text-xs line-through font-medium tabular-nums ${isBest ? "text-black/40" : "text-zinc-600"}`}>
                                      {money(oldPrice, currency)}
                                    </span>
                                  </>
                                ) : (
                                  <span className={`text-lg font-semibold tracking-tight tabular-nums ${isBest ? "text-black" : "text-white"}`}>
                                    {money(price, currency)}
                                  </span>
                                )}
                              </div>

                              <button
                                onClick={() => handleStart(account)}
                                type="button"
                                className={`w-full rounded-lg py-3 text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 ${
                                  isBest
                                    ? "bg-black text-white hover:bg-zinc-800 focus-visible:ring-black/40"
                                    : "bg-white text-black hover:bg-zinc-200 focus-visible:ring-white/40"
                                }`}
                              >
                                Start now
                              </button>
                            </div>
                          </motion.div>
                        </div>

                        {/* Segregated Detached Reward Metric Segment */}
                        <div className="w-full rounded-xl bg-[#0A0A0B] border border-white/[0.08] p-3.5 flex flex-col items-center justify-center text-center">
                          <span className="text-xs font-semibold text-white tracking-wide mb-1 tabular-nums">
                            {money(convert(account.avgRewardEUR, currency), currency)}
                          </span>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-500 tracking-wider uppercase">
                            <span>Avg. Reward</span>
                            <HelpCircle className="w-3 h-3 text-zinc-600" strokeWidth={ICON_STROKE} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Integrated Elegant Perks System Block */}
              <div className="mt-4">
                <div className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-500 text-center sm:text-left">
                  You will also get access to:
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {PERKS.map(({ label, icon: Icon, isBranded }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.08] bg-[#0A0A0B] text-zinc-400 text-xs font-medium transition-all duration-200 select-none"
                    >
                      <Icon className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-zinc-300" strokeWidth={ICON_STROKE} />
                      <span className="tracking-wide">
                        {isBranded ? (
                          <>
                            <span className="text-white font-semibold mr-1">ACG Forex</span>
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
              transition={{ duration: 0.2 }}
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
              <div className="border-t border-white/[0.08] pt-8">
                <div className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-500 text-center sm:text-left">
                  You will also get access to:
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {PERKS.map(({ label, icon: Icon, isBranded }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.08] bg-[#0A0A0B] text-zinc-400 text-xs font-medium transition-all duration-200 select-none"
                    >
                      <Icon className="h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-zinc-300" strokeWidth={ICON_STROKE} />
                      <span className="tracking-wide">
                        {isBranded ? (
                          <>
                            <span className="text-white font-semibold mr-1">ACG Forex</span>
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