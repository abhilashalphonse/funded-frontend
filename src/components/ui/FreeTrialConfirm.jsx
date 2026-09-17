import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, ChevronLeft, Loader2, ShieldCheck } from "lucide-react";
import { createFreeTrial, getFreeTrialEligibility } from "../../services/freeTrialApi.js";

const formatAccountSize = (value) => `$${Number(value || 0).toLocaleString("en-US")}`;

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-b-0">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default function FreeTrialConfirm({
  plan,
  onBack = () => {},
  onCreated = () => {},
  onGoToDashboard = () => {},
}) {
  const [eligibility, setEligibility] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [createdTrial, setCreatedTrial] = useState(null);

  const definition = plan?.challengeDefinition;
  const isTwoStep = definition?.step === "2step";

  const trialRules = useMemo(() => {
    if (!definition) return null;
    return {
      profitTarget: 5,
      dailyLoss: definition.rules?.dailyLoss,
      maxLoss: definition.rules?.maxLoss,
      minTradingDays: 2,
      durationDays: 14,
    };
  }, [definition]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoadingEligibility(true);
      setError("");
      try {
        const result = await getFreeTrialEligibility();
        if (active) setEligibility(result);
      } catch (err) {
        if (active) setError(err.message || "Unable to check Free Trial eligibility.");
      } finally {
        if (active) setLoadingEligibility(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  if (!definition || !trialRules) return null;

  const startTrial = async () => {
    if (creating || eligibility?.eligible === false) return;

    setCreating(true);
    setError("");
    try {
      const trial = await createFreeTrial(definition);
      setCreatedTrial(trial);
      setEligibility({ eligible: false, maxActiveTrials: 1, activeTrial: trial });
      onCreated(trial);
    } catch (err) {
      setError(err.message || "Unable to start your Free Trial.");
      if (err.code === "ACTIVE_FREE_TRIAL_EXISTS") {
        try {
          const result = await getFreeTrialEligibility();
          setEligibility(result);
        } catch {
          // Keep the original server error visible.
        }
      }
    } finally {
      setCreating(false);
    }
  };

  if (createdTrial) {
    return (
      <section className="min-h-screen bg-[#05060A] px-5 py-16 text-white">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0A0C12] p-7 sm:p-9">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10">
              <Check className="h-5 w-5 text-emerald-400" />
            </div>

            <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Free Trial Ready</div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Your {formatAccountSize(definition.accountSize)} trial is active.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">
              Your ACG Trader demo account has been provisioned. The 14-day trial period has started.
            </p>

            <div className="mt-7 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5">
              <Row label="Account" value={formatAccountSize(definition.accountSize)} />
              <Row label="Evaluation" value={isTwoStep ? "2-Step trial format" : "1-Step trial format"} />
              <Row label="Profit Target" value="5%" />
              <Row label="Minimum Trading Days" value="2" />
              <Row label="Duration" value="14 days" />
            </div>

            <button
              type="button"
              onClick={onGoToDashboard}
              className="mt-7 h-12 w-full rounded-lg bg-white text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#05060A] px-5 py-10 text-white sm:py-14">
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to challenge builder
        </button>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-8">
            <div className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              <ShieldCheck className="h-4 w-4" />
              ACG Free Trial
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Practice before your real challenge.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500">
              Experience the ACG evaluation environment with a shortened simulated challenge.
              Passing a Free Trial does not grant a funded account.
            </p>

            <div className="mt-7 rounded-xl border border-white/[0.07] bg-white/[0.02] px-5">
              <Row label="Account Size" value={formatAccountSize(definition.accountSize)} />
              <Row label="Based On" value={isTwoStep ? "2-Step Challenge" : "1-Step Challenge"} />
              <Row label="Trial Profit Target" value="5%" />
              <Row label="Daily Loss" value={`${trialRules.dailyLoss}%`} />
              <Row label="Maximum Loss" value={`${trialRules.maxLoss}%`} />
              <Row label="Minimum Trading Days" value="2" />
              <Row label="Duration" value="14 days" />
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#0A0C12] p-6 sm:p-7">
            <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Start Free Trial</div>
            <div className="mt-3 text-2xl font-semibold">€0</div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              One Free Trial can be active at a time. Once it ends, you can start another.
            </p>

            {loadingEligibility && (
              <div className="mt-6 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-xs text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking eligibility...
              </div>
            )}

            {!loadingEligibility && eligibility?.eligible === false && (
              <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 text-xs leading-relaxed text-amber-200">
                You already have an active Free Trial. Open your dashboard to continue trading.
              </div>
            )}

            {error && (
              <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={eligibility?.eligible === false ? onGoToDashboard : startTrial}
              disabled={loadingEligibility || creating}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-semibold text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating your trial...
                </>
              ) : eligibility?.eligible === false ? (
                "Open Active Trial"
              ) : (
                "Start 14-Day Free Trial"
              )}
            </button>

            <p className="mt-4 text-[11px] leading-relaxed text-zinc-600">
              This is a simulated evaluation. No payment is required and no payout or funded-account entitlement is created by passing it.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
