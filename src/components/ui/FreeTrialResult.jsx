import React from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, ShieldAlert } from "lucide-react";

const formatUSD = (value) => `$${Number(value || 0).toLocaleString("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

function tone(result) {
  if (result === "PASSED") {
    return {
      label: "Free Trial Passed",
      icon: CheckCircle2,
      description: "You completed the trial objectives. You can now start the matching paid challenge with the same configuration.",
    };
  }
  if (result === "BREACHED") {
    return {
      label: "Free Trial Ended",
      icon: ShieldAlert,
      description: "The trial ended after a risk rule was exceeded. Your performance remains available for review.",
    };
  }
  return {
    label: "Free Trial Expired",
    icon: Clock3,
    description: "The 14-day trial period ended. You can start the matching paid challenge or return to your dashboard.",
  };
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
      <div className="text-[10px] uppercase tracking-[0.13em] text-zinc-600">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

export default function FreeTrialResult({
  trial,
  onBack = () => {},
  onStartChallenge = () => {},
}) {
  if (!trial) return null;

  const result = trial.trial?.result || trial.status;
  const state = tone(result);
  const Icon = state.icon;
  const initial = Number(trial.initialDeposit || trial.accountSize || 0);
  const profit = Number(trial.projections?.profit || 0);
  const profitPct = initial > 0 ? (profit / initial) * 100 : 0;
  const tradingDays = Number(trial.projections?.tradingDays || 0);
  const phase = trial.rules?.phases?.find(item => Number(item.phase) === Number(trial.currentPhase || 1)) || trial.rules?.phases?.[0];
  const targetPct = Number(phase?.profitTarget || 0);

  return (
    <section className="min-h-screen bg-[#05060A] px-5 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04]">
            <Icon className="h-5 w-5 text-white" />
          </div>

          <div className="mt-6 text-[11px] uppercase tracking-[0.2em] text-zinc-500">{state.label}</div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {formatUSD(trial.accountSize).replace(".00", "")} · {trial.challengeType === "TWO_STEP" ? "2-Step" : "1-Step"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
            {state.description}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Metric label="Result" value={result} />
            <Metric label="Profit" value={formatUSD(profit)} />
            <Metric label="Return" value={`${profitPct >= 0 ? "+" : ""}${profitPct.toFixed(2)}%`} />
            <Metric label="Trading Days" value={String(tradingDays)} />
          </div>

          <div className="mt-6 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
              <span className="text-sm text-zinc-500">Trial Profit Target</span>
              <span className="text-sm font-medium text-white">{targetPct}%</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/[0.06] py-3">
              <span className="text-sm text-zinc-500">Daily Loss</span>
              <span className="text-sm font-medium text-white">{Number(trial.rules?.dailyDrawdown || 0)}%</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-zinc-500">Maximum Loss</span>
              <span className="text-sm font-medium text-white">{Number(trial.rules?.maxDrawdown || 0)}%</span>
            </div>
          </div>

          <div className="mt-7 rounded-xl border border-white/[0.08] bg-black/20 p-5">
            <div className="text-sm font-medium text-white">Continue with the real challenge</div>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Your tested account size, challenge type, risk settings, and commercial configuration will be carried into checkout.
            </p>
            <button
              type="button"
              onClick={() => onStartChallenge(trial)}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Start This Challenge
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {trial.conversion?.convertedToPaid && (
            <div className="mt-4 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-xs text-emerald-300">
              This Free Trial has already converted to paid challenge {trial.conversion?.paidAccountId || ""}.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
