import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, FlaskConical, Play, RefreshCw, ShieldCheck, Trash2 } from "lucide-react";

const badgeTone = status => {
  const value = String(status || "").toUpperCase();
  if (["PASS", "READY", "CLEANED"].includes(value)) return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  if (["FAIL"].includes(value)) return "border-red-400/20 bg-red-400/10 text-red-300";
  if (["RUNNING", "CREATING"].includes(value)) return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  return "border-white/10 bg-white/5 text-zinc-300";
};

function StatusBadge({ children }) {
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide ${badgeTone(children)}`}>{children || "—"}</span>;
}

function Panel({ title, text, children }) {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] p-5">
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {text && <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function KeyValue({ label, value, mono = false }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-3">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">{label}</p>
      <p className={`mt-1 break-all text-xs text-zinc-300 ${mono ? "font-mono" : ""}`}>{value ?? "—"}</p>
    </div>
  );
}

export default function LaunchReadinessPanel({ data, adminFetch, reload }) {
  const runs = data?.rows || [];
  const [selectedRunId, setSelectedRunId] = useState(runs[0]?.runId || "");
  const [symbol, setSymbol] = useState("BTCUSD");
  const [volume, setVolume] = useState("0.01");
  const [confirmation, setConfirmation] = useState("");
  const [reason, setReason] = useState("Pre-launch lifecycle acceptance");
  const [cleanupReason, setCleanupReason] = useState("Acceptance fixture cleanup");
  const [busy, setBusy] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (!selectedRunId && runs[0]?.runId) setSelectedRunId(runs[0].runId);
    if (selectedRunId && !runs.some(run => run.runId === selectedRunId) && runs[0]?.runId) {
      setSelectedRunId(runs[0].runId);
    }
  }, [runs, selectedRunId]);

  const selected = useMemo(
    () => runs.find(run => run.runId === selectedRunId) || runs[0] || null,
    [runs, selectedRunId],
  );

  const perform = async (key, fn) => {
    if (busy) return;
    setBusy(key);
    setLocalError("");
    try {
      await fn();
      await reload();
    } catch (error) {
      setLocalError(error?.message || "Launch-readiness operation failed.");
    } finally {
      setBusy("");
    }
  };

  const createFixture = () => perform("create", async () => {
    const created = await adminFetch("/launch-readiness/fixtures", {
      method: "POST",
      body: JSON.stringify({ symbol, volume }),
    });
    setSelectedRunId(created.runId);
    setConfirmation("");
  });

  const runPreflight = () => selected && perform("preflight", async () => {
    await adminFetch(`/launch-readiness/${encodeURIComponent(selected.runId)}/preflight`, { method: "POST", body: "{}" });
  });

  const runAcceptance = () => selected && perform("run", async () => {
    await adminFetch(`/launch-readiness/${encodeURIComponent(selected.runId)}/run`, {
      method: "POST",
      body: JSON.stringify({ confirmation, reason }),
    });
    setConfirmation("");
  });

  const cleanup = () => selected && perform("cleanup", async () => {
    await adminFetch(`/launch-readiness/${encodeURIComponent(selected.runId)}/cleanup`, {
      method: "POST",
      body: JSON.stringify({ reason: cleanupReason }),
    });
  });

  const fixture = selected?.fixture || {};
  const preflight = selected?.preflight;
  const scenarios = selected?.report?.scenarios || [];

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <KeyValue label="Environment" value={String(data?.environment || "unknown").toUpperCase()} />
        <KeyValue label="Provisioning policy" value={data?.riskPolicyVersion || "—"} />
        <KeyValue label="Trading provider" value={data?.tradingProvider || "—"} />
      </div>

      {localError && (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-xs text-red-200">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          <span>{localError}</span>
        </div>
      )}

      <Panel
        title="Dedicated acceptance fixture"
        text="Creates a synthetic customer and two fresh V2 two-step Challenge accounts. No payment record or customer bearer token is required."
      >
        <div className="grid gap-3 md:grid-cols-[1fr_160px_160px_auto]">
          <div className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2.5">
            <p className="text-[9px] uppercase tracking-widest text-zinc-600">Fixture isolation</p>
            <p className="mt-1 text-xs text-zinc-300">New acceptance customer + Challenge A + Challenge B</p>
          </div>
          <label className="block">
            <span className="text-[9px] uppercase tracking-widest text-zinc-600">Symbol</span>
            <input value={symbol} onChange={event => setSymbol(event.target.value.toUpperCase())}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-white/25" />
          </label>
          <label className="block">
            <span className="text-[9px] uppercase tracking-widest text-zinc-600">Volume</span>
            <input value={volume} onChange={event => setVolume(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-white/25" />
          </label>
          <button onClick={createFixture} disabled={Boolean(busy)}
            className="self-end rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black disabled:opacity-40">
            {busy === "create" ? "Creating…" : "Create Fresh Fixture"}
          </button>
        </div>
      </Panel>

      {runs.length > 0 && (
        <Panel title="Acceptance runs" text="Every fixture and destructive run is durable and remains available for audit.">
          <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[9px] uppercase tracking-widest text-zinc-600">
                <tr><th className="px-3 py-2.5">Run</th><th className="px-3 py-2.5">Status</th><th className="px-3 py-2.5">Symbol</th><th className="px-3 py-2.5">Created by</th><th className="px-3 py-2.5">Created</th></tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {runs.map(run => (
                  <tr key={run.runId} onClick={() => setSelectedRunId(run.runId)}
                    className={`cursor-pointer hover:bg-white/[0.03] ${selected?.runId === run.runId ? "bg-white/[0.04]" : ""}`}>
                    <td className="px-3 py-3 font-mono text-zinc-300">{run.runId}</td>
                    <td className="px-3 py-3"><StatusBadge>{run.status}</StatusBadge></td>
                    <td className="px-3 py-3 text-zinc-400">{run.symbol} · {run.volume}</td>
                    <td className="px-3 py-3 text-zinc-400">{run.createdBy}</td>
                    <td className="px-3 py-3 text-zinc-500">{run.createdAt ? new Date(run.createdAt).toLocaleString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {selected && (
        <>
          <Panel title="Selected fixture" text="Only IDs attached to this acceptance run can be mutated or cleaned by the harness.">
            <div className="flex items-center justify-between gap-3">
              <div className="font-mono text-xs text-zinc-300">{selected.runId}</div>
              <StatusBadge>{selected.status}</StatusBadge>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <KeyValue label="Customer" value={fixture.customerId} mono />
              <KeyValue label="Challenge A" value={fixture.challengeAId} mono />
              <KeyValue label="Challenge B" value={fixture.challengeBId} mono />
              <KeyValue label="Challenge A Trader" value={fixture.challengeAPlatformAccountId} mono />
              <KeyValue label="Challenge B Trader" value={fixture.challengeBPlatformAccountId} mono />
              <KeyValue label="Trial created by runner" value={fixture.trialAccountId || "Not created yet"} mono />
            </div>
          </Panel>

          <Panel title="Preflight" text="Read-only validation of Funded fixture state, Trader health and V2 capabilities.">
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={runPreflight} disabled={Boolean(busy) || selected.status === "RUNNING" || selected.status === "CLEANED"}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-white/5 disabled:opacity-35">
                <ShieldCheck size={14} /> {busy === "preflight" ? "Checking…" : "Run Preflight"}
              </button>
              {preflight?.status && <StatusBadge>{preflight.status}</StatusBadge>}
            </div>
            {preflight?.checks?.length > 0 && (
              <div className="mt-4 grid gap-2 lg:grid-cols-2">
                {preflight.checks.map((check, index) => (
                  <div key={`${check.name}-${index}`} className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5">
                    {check.status === "PASS" ? <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-400" /> : <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-400" />}
                    <div className="min-w-0">
                      <p className="text-xs text-zinc-300">{check.name}</p>
                      {check.detail != null && <p className="mt-1 break-all font-mono text-[10px] text-zinc-600">{typeof check.detail === "string" ? check.detail : JSON.stringify(check.detail)}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Full lifecycle acceptance"
            text="Destructive only to this dedicated fixture. It tests Trial concurrency, federation, account routing, phase promotion, breach race, Funded Review, Master approval and Master routing."
          >
            <div className="rounded-lg border border-amber-400/15 bg-amber-400/[0.04] p-4">
              <div className="flex items-start gap-3">
                <FlaskConical size={16} className="mt-0.5 text-amber-300" />
                <div>
                  <p className="text-xs font-semibold text-amber-200">Destructive fixture test</p>
                  <p className="mt-1 text-[11px] leading-5 text-zinc-500">The runner intentionally passes and breaches fixture accounts. Normal customers are never selected by this run ID.</p>
                </div>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                <label>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600">Type RUN ACCEPTANCE</span>
                  <input value={confirmation} onChange={event => setConfirmation(event.target.value)}
                    placeholder="RUN ACCEPTANCE"
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-amber-300/40" />
                </label>
                <label>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-600">Audit reason</span>
                  <input value={reason} onChange={event => setReason(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-amber-300/40" />
                </label>
              </div>
              <button onClick={runAcceptance}
                disabled={Boolean(busy) || selected.status !== "READY" || preflight?.status !== "PASS" || confirmation !== "RUN ACCEPTANCE" || reason.trim().length < 5}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-black disabled:opacity-35">
                <Play size={14} /> {busy === "run" ? "Running lifecycle acceptance…" : "Run Full Acceptance"}
              </button>
            </div>

            {scenarios.length > 0 && (
              <div className="mt-5 space-y-2">
                {scenarios.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="flex items-start justify-between gap-4 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-200">{item.name}</p>
                      <p className="mt-1 text-[10px] leading-4 text-zinc-600">{item.error?.message || item.summary || "Completed"}</p>
                    </div>
                    <StatusBadge>{item.status}</StatusBadge>
                  </div>
                ))}
              </div>
            )}

            {selected.report?.summary && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <KeyValue label="Passed" value={selected.report.summary.pass ?? 0} />
                <KeyValue label="Failed" value={selected.report.summary.fail ?? 0} />
                <KeyValue label="Total" value={selected.report.summary.total ?? 0} />
              </div>
            )}
          </Panel>

          <Panel title="Cleanup fixture" text="Closes only accounts linked to the selected acceptance run. Evidence and audit history remain stored.">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <input value={cleanupReason} onChange={event => setCleanupReason(event.target.value)}
                className="rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-white outline-none focus:border-white/25" />
              <button onClick={cleanup} disabled={Boolean(busy) || selected.status === "RUNNING" || selected.status === "CLEANED" || cleanupReason.trim().length < 5}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/20 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-400/[0.05] disabled:opacity-35">
                <Trash2 size={14} /> {busy === "cleanup" ? "Cleaning…" : "Cleanup Fixture"}
              </button>
            </div>
          </Panel>

          <div className="flex justify-end">
            <button onClick={() => reload()} disabled={Boolean(busy)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:bg-white/5 hover:text-white">
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
}
