import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";
const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"];

function localDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function rangeFor(mode) {
  const today = new Date();
  if (mode === "tomorrow") {
    const tomorrow = addDays(today, 1);
    return { from: localDateKey(tomorrow), to: localDateKey(tomorrow) };
  }
  if (mode === "week") return { from: localDateKey(today), to: localDateKey(addDays(today, 6)) };
  return { from: localDateKey(today), to: localDateKey(today) };
}

function eventTime(event) {
  if (!event?.timestamp) return null;
  const date = new Date(event.timestamp);
  return Number.isFinite(date.getTime()) ? date : null;
}

function timeLabel(event) {
  const date = eventTime(event);
  if (!date || event.allDay) return "All day";
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(date);
}

function dayLabel(event) {
  const date = eventTime(event);
  if (!date) return event.date || "Scheduled";
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(date);
}

function valueLabel(value) {
  return value == null || value === "" ? "—" : String(value);
}

function countdownLabel(timestamp, now) {
  if (!timestamp) return "Scheduled";
  const target = new Date(timestamp).getTime();
  if (!Number.isFinite(target)) return "Scheduled";
  const delta = target - now;
  const absolute = Math.abs(delta);
  if (absolute < 60_000) return delta >= 0 ? "Releasing now" : "Released just now";

  const totalSeconds = Math.floor(absolute / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (delta < 0) {
    if (days > 0) return `Released ${days}d ago`;
    if (hours > 0) return `Released ${hours}h ago`;
    return `Released ${minutes}m ago`;
  }

  if (days > 0) return `Starts in ${days}d ${hours}h`;
  return `Starts in ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function restrictionText(restriction) {
  if (!restriction) return { tone: "neutral", title: "Rule unavailable", detail: "Restriction status is unavailable." };
  if (restriction.status === "ALLOWED") {
    return { tone: "allowed", title: "News trading allowed", detail: "This account does not restrict trading around this event." };
  }
  if (restriction.status === "RESTRICTED") {
    if (restriction.blockedFrom && restriction.blockedUntil) {
      const from = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(restriction.blockedFrom));
      const until = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(restriction.blockedUntil));
      return { tone: "restricted", title: "Trading restricted", detail: `${from} – ${until} local time · ${restriction.beforeMinutes}m before / ${restriction.afterMinutes}m after` };
    }
    return { tone: "restricted", title: "Trading restricted", detail: "This event is covered by the account's news restriction." };
  }
  if (restriction.status === "NOT_SPECIFIED") {
    return { tone: "neutral", title: "News rule not specified", detail: "This account does not have an explicit news-trading setting." };
  }
  return { tone: "neutral", title: "No account rule", detail: "Select a trading account to see its news-trading rule." };
}

export default function NewsCalendar({ account }) {
  const { getAccessToken } = useAuth();
  const [range, setRange] = useState("today");
  const [currencies, setCurrencies] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const load = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);
      setError("");
      const token = await getAccessToken();
      if (!token) throw new Error("Your ACG Funded session has expired.");

      const selectedRange = rangeFor(range);
      const params = new URLSearchParams(selectedRange);
      if (currencies.length) params.set("currencies", currencies.join(","));
      if (account?.accountId) params.set("accountId", account.accountId);

      const response = await fetch(`${API_URL}/api/customer/news-calendar?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.message || "Unable to load economic calendar.");
      setData(payload?.data || null);
    } catch (loadError) {
      setError(loadError?.message || "Unable to load economic calendar.");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [account?.accountId, currencies, getAccessToken, range]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const timer = setInterval(() => void load({ silent: true }), 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, [load]);

  const events = Array.isArray(data?.events) ? data.events : [];
  const nextEvent = useMemo(
    () => events.find(event => {
      const time = eventTime(event);
      return time && time.getTime() >= now - 60_000;
    }) || null,
    [events, now],
  );

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Local time";
  const toggleCurrency = currency => {
    setCurrencies(current => current.includes(currency)
      ? current.filter(item => item !== currency)
      : [...current, currency]);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <section className="rounded-2xl border border-white/[0.08] bg-[#080808] p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#666]">
              <CalendarDays size={13} />
              High-impact news
            </div>
            <h2 className="mt-3 text-[clamp(1.4rem,4vw,2rem)] font-semibold tracking-[-0.04em] text-white">Economic Calendar</h2>
            <p className="mt-2 max-w-2xl text-[11px] leading-5 text-[#757575]">
              High-impact economic releases only. Times are shown in {timezone}.
            </p>
          </div>

          <div className="inline-flex w-full rounded-lg border border-white/[0.08] bg-black p-1 lg:w-auto">
            {[
              ["today", "Today"],
              ["tomorrow", "Tomorrow"],
              ["week", "This Week"],
            ].map(([id, label]) => (
              <button
                type="button"
                key={id}
                onClick={() => setRange(id)}
                className={`min-h-9 flex-1 rounded-md px-3 text-[10px] font-medium transition lg:flex-none ${range === id ? "bg-white text-black" : "text-[#777] hover:text-white"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-white/[0.07] pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrencies([])}
              className={`min-h-8 rounded-md border px-3 text-[9px] font-medium transition ${!currencies.length ? "border-white bg-white text-black" : "border-white/[0.08] text-[#777] hover:border-white/[0.16] hover:text-white"}`}
            >
              All
            </button>
            {CURRENCIES.map(currency => (
              <button
                type="button"
                key={currency}
                onClick={() => toggleCurrency(currency)}
                className={`min-h-8 rounded-md border px-3 font-mono text-[9px] transition ${currencies.includes(currency) ? "border-white bg-white text-black" : "border-white/[0.08] text-[#777] hover:border-white/[0.16] hover:text-white"}`}
              >
                {currency}
              </button>
            ))}
          </div>
        </div>
      </section>

      {data?.dataStatus === "STALE" && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-[10px] leading-5 text-amber-300">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          The provider is temporarily unavailable. Showing the most recent cached calendar.
        </div>
      )}

      {error && !data && (
        <section className="grid min-h-[230px] place-items-center rounded-xl border border-white/[0.08] bg-[#080808] px-6 text-center">
          <div>
            <AlertTriangle size={20} className="mx-auto text-[#666]" />
            <h3 className="mt-3 text-[12px] font-semibold text-white">Economic calendar temporarily unavailable</h3>
            <p className="mt-1.5 text-[10px] text-[#666]">{error}</p>
            <button type="button" onClick={() => void load()} className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.1] px-4 text-[10px] font-medium text-white">
              <RefreshCw size={12} /> Try again
            </button>
          </div>
        </section>
      )}

      {loading && !data ? (
        <section className="grid min-h-[230px] place-items-center rounded-xl border border-white/[0.08] bg-[#080808] text-[11px] text-[#666]">
          Loading high-impact events…
        </section>
      ) : data && (
        <>
          {nextEvent && (
            <NextEventCard event={nextEvent} now={now} />
          )}

          <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#080808]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
              <div>
                <h3 className="text-[11px] font-semibold text-white">High-impact events</h3>
                <p className="mt-0.5 text-[9px] text-[#5d5d5d]">{events.length} event{events.length === 1 ? "" : "s"} in this range</p>
              </div>
              {data.fetchedAt && (
                <span className="hidden text-[9px] text-[#4f4f4f] sm:block">
                  Updated {new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date(data.fetchedAt))}
                </span>
              )}
            </div>

            {events.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <CheckCircle2 size={19} className="mx-auto text-[#555]" />
                <h4 className="mt-3 text-[11px] font-medium text-white">No high-impact events</h4>
                <p className="mt-1 text-[9px] text-[#5f5f5f]">No matching high-impact releases are scheduled for this selection.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {events.map(event => <EventRow key={event.id} event={event} now={now} />)}
              </div>
            )}
          </section>

          <div className="flex flex-col gap-2 px-1 text-[9px] leading-4 text-[#4f4f4f] sm:flex-row sm:items-center sm:justify-between">
            <span>Economic calendar data provided by FinanceCalendar.com.</span>
            <a
              href={data?.attribution?.url || "https://www.financecalendar.com"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[#777] transition hover:text-white"
            >
              FinanceCalendar.com <ExternalLink size={9} />
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function NextEventCard({ event, now }) {
  const rule = restrictionText(event.restriction);
  return (
    <section className="rounded-2xl border border-white/[0.11] bg-[#090909] p-4 sm:p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#656565]">Next high-impact event</span>
          <div className="mt-3 flex items-center gap-2">
            <CurrencyBadge currency={event.currency} />
            <span className="rounded border border-rose-500/20 bg-rose-500/[0.06] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-rose-300">High</span>
          </div>
          <h3 className="mt-3 text-[17px] font-semibold tracking-[-0.025em] text-white">{event.title}</h3>
          <p className="mt-1 text-[10px] text-[#666]">{dayLabel(event)} · {timeLabel(event)} local time</p>
        </div>
        <div className="shrink-0 md:text-right">
          <div className="font-mono text-[18px] font-semibold text-white">{countdownLabel(event.timestamp, now)}</div>
          <p className="mt-1 text-[9px] text-[#555]">{event.country || event.category || "Economic release"}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <ValueStat label="Forecast" value={event.forecast} />
        <ValueStat label="Previous" value={event.previous} />
        <ValueStat label="Actual" value={event.actual} emphasized={event.actual != null} />
      </div>

      <RuleBox rule={rule} />
    </section>
  );
}

function EventRow({ event, now }) {
  const rule = restrictionText(event.restriction);
  return (
    <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[105px_minmax(0,1fr)_270px] lg:items-center">
      <div>
        <div className="font-mono text-[12px] font-semibold text-white">{timeLabel(event)}</div>
        <div className="mt-1 text-[9px] text-[#555]">{dayLabel(event)}</div>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <CurrencyBadge currency={event.currency} />
          <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-rose-400">High impact</span>
          <span className="text-[8px] text-[#4f4f4f]">{countdownLabel(event.timestamp, now)}</span>
        </div>
        <h4 className="mt-2 text-[11px] font-medium leading-5 text-[#dedede]">{event.title}</h4>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px]">
          <span className="text-[#555]">Forecast <strong className="font-mono font-medium text-[#999]">{valueLabel(event.forecast)}</strong></span>
          <span className="text-[#555]">Previous <strong className="font-mono font-medium text-[#999]">{valueLabel(event.previous)}</strong></span>
          <span className="text-[#555]">Actual <strong className="font-mono font-medium text-white">{valueLabel(event.actual)}</strong></span>
        </div>
      </div>

      <div className={`rounded-lg border px-3 py-2.5 ${rule.tone === "restricted" ? "border-rose-500/20 bg-rose-500/[0.05]" : rule.tone === "allowed" ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-white/[0.07] bg-white/[0.02]"}`}>
        <div className="flex items-center gap-2">
          {rule.tone === "restricted" ? <ShieldAlert size={12} className="text-rose-400" /> : <CheckCircle2 size={12} className={rule.tone === "allowed" ? "text-emerald-400" : "text-[#666]"} />}
          <span className={`text-[9px] font-semibold ${rule.tone === "restricted" ? "text-rose-300" : rule.tone === "allowed" ? "text-emerald-300" : "text-[#888]"}`}>{rule.title}</span>
        </div>
        <p className="mt-1.5 text-[8px] leading-4 text-[#666]">{rule.detail}</p>
      </div>
    </div>
  );
}

function CurrencyBadge({ currency }) {
  return (
    <span className="inline-flex min-w-9 items-center justify-center rounded border border-white/[0.09] bg-white/[0.035] px-1.5 py-1 font-mono text-[9px] font-semibold text-[#b5b5b5]">
      {currency || "—"}
    </span>
  );
}

function ValueStat({ label, value, emphasized = false }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-black px-3 py-3">
      <span className="text-[8px] font-semibold uppercase tracking-[0.11em] text-[#555]">{label}</span>
      <strong className={`mt-1.5 block font-mono text-[12px] ${emphasized ? "text-white" : "text-[#a1a1a1]"}`}>{valueLabel(value)}</strong>
    </div>
  );
}

function RuleBox({ rule }) {
  return (
    <div className={`mt-4 rounded-lg border px-3 py-3 ${rule.tone === "restricted" ? "border-rose-500/20 bg-rose-500/[0.05]" : rule.tone === "allowed" ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-white/[0.07] bg-white/[0.02]"}`}>
      <div className="flex items-center gap-2">
        {rule.tone === "restricted" ? <ShieldAlert size={13} className="text-rose-400" /> : <CheckCircle2 size={13} className={rule.tone === "allowed" ? "text-emerald-400" : "text-[#666]"} />}
        <span className={`text-[10px] font-semibold ${rule.tone === "restricted" ? "text-rose-300" : rule.tone === "allowed" ? "text-emerald-300" : "text-[#888]"}`}>{rule.title}</span>
      </div>
      <p className="mt-1.5 text-[9px] leading-4 text-[#666]">{rule.detail}</p>
    </div>
  );
}
