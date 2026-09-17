import React, { useEffect, useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { getAdminAcquisitionFunnel } from "../../services/adminAnalyticsApi.js";

const LABELS = {
  free_trial_cta_clicked: "Free Trial CTA",
  registration_completed: "Registrations",
  free_trial_created: "Trials Created",
  free_trial_first_trade: "First Trade",
  free_trial_passed: "Trials Passed",
  trial_checkout_started: "Checkout Started",
  trial_payment_created: "Payment Created",
  trial_converted_to_paid: "Paid Conversion",
};

function percent(value) {
  if (value === null || value === undefined) return "—";
  return `${(Number(value) * 100).toFixed(1)}%`;
}

export default function AdminAcquisitionFunnel() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getAdminAcquisitionFunnel(days));
    } catch (err) {
      setError(err.message || "Unable to load acquisition analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [days]);

  return (
    <main className="min-h-screen bg-[#05060A] px-5 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-zinc-600">Admin · Acquisition</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Free Trial Funnel</h1>
            <p className="mt-2 text-sm text-zinc-500">From discovery through paid challenge activation.</p>
          </div>

          <div className="flex items-center gap-2">
            {[7, 30, 90].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => setDays(option)}
                className={`h-9 rounded-md border px-3 text-xs font-medium transition-colors ${
                  days === option
                    ? "border-white bg-white text-black"
                    : "border-white/[0.1] bg-white/[0.02] text-zinc-400 hover:text-white"
                }`}
              >
                {option}D
              </button>
            ))}
            <button
              type="button"
              onClick={load}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-white/[0.1] text-zinc-500 hover:text-white"
              aria-label="Refresh funnel"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-8 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-4 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading acquisition funnel…
          </div>
        )}

        {error && (
          <div className="mt-8 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.05] px-5 py-4 text-sm text-red-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!loading && data && (
          <>
            <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {data.stages?.map(stage => (
                <div key={stage.name} className="rounded-xl border border-white/[0.08] bg-[#0A0C12] p-5">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                    {LABELS[stage.name] || stage.name}
                  </div>
                  <div className="mt-3 text-3xl font-semibold tracking-tight">{stage.count}</div>
                  <div className="mt-2 text-xs text-zinc-500">
                    Step conversion: <span className="text-zinc-300">{percent(stage.stepConversionRate)}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0C12]">
                <div className="border-b border-white/[0.08] px-5 py-4">
                  <h2 className="text-sm font-medium">Acquisition funnel</h2>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {data.stages?.map((stage, index) => (
                    <div key={stage.name} className="grid grid-cols-[40px_1fr_auto_auto] items-center gap-3 px-5 py-4">
                      <div className="text-xs font-mono text-zinc-600">{String(index + 1).padStart(2, "0")}</div>
                      <div className="text-sm text-zinc-300">{LABELS[stage.name] || stage.name}</div>
                      <div className="text-sm font-semibold">{stage.count}</div>
                      <div className="w-16 text-right text-xs text-zinc-500">{percent(stage.stepConversionRate)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/[0.08] bg-[#0A0C12] p-5">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">Trial → Paid</div>
                  <div className="mt-3 text-4xl font-semibold tracking-tight">{percent(data.trialToPaidConversionRate)}</div>
                  <p className="mt-2 text-xs text-zinc-500">Paid challenge activations divided by Free Trials created in this reporting window.</p>
                </div>

                <div className="rounded-xl border border-white/[0.08] bg-[#0A0C12] p-5">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">Trial outcomes</div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["Passed", data.outcomes?.passed],
                      ["Breached", data.outcomes?.breached],
                      ["Expired", data.outcomes?.expired],
                      ["Cancelled", data.outcomes?.cancelled],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="text-[10px] text-zinc-600">{label}</div>
                        <div className="mt-1 text-xl font-semibold">{Number(value || 0)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
