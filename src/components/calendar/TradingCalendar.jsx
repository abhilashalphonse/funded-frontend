import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuth } from "../../AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_URL || "";
const MAX_PAGES = 250;
const CLOSING_TYPES = new Set([
  "CLOSE",
  "PARTIAL_CLOSE",
  "REVERSE_CLOSE",
  "STOP_LOSS",
  "TAKE_PROFIT",
  "LIQUIDATION",
]);

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const compactMoneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("en-US");

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value) {
  return moneyFormatter.format(number(value));
}

function signedMoney(value) {
  const amount = number(value);
  if (Math.abs(amount) < 0.005) return money(0);
  return `${amount > 0 ? "+" : "-"}${moneyFormatter.format(Math.abs(amount))}`;
}

function compactSignedMoney(value) {
  const amount = number(value);
  if (Math.abs(amount) < 0.005) return "$0";
  return `${amount > 0 ? "+" : "-"}${compactMoneyFormatter.format(Math.abs(amount))}`;
}

function mobileCompactSignedMoney(value) {
  const amount = number(value);
  const absolute = Math.abs(amount);
  if (absolute < 0.5) return "$0";
  const sign = amount > 0 ? "+" : "-";
  if (absolute >= 1_000_000) {
    return `${sign}${(absolute / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (absolute >= 1_000) {
    return `${sign}${(absolute / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `${sign}${Math.round(absolute).toLocaleString("en-US")}`;
}

function utcDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function utcMonthBounds(cursor) {
  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  return {
    from: new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)),
    to: new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999)),
  };
}

function moveMonth(cursor, amount) {
  return new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + amount, 1));
}

function monthLabel(cursor) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(cursor);
}

function utcTimeLabel(value) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);
}

function dayHeading(key) {
  const date = new Date(`${key}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) return key;
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function dealNet(deal) {
  return number(deal?.realizedPnl) - number(deal?.commission) - number(deal?.swap);
}

function createDayBucket(key) {
  return {
    key,
    realized: 0,
    commission: 0,
    swap: 0,
    net: 0,
    tradeCount: 0,
    wins: 0,
    losses: 0,
    executions: [],
  };
}

function aggregateDeals(items) {
  const days = new Map();
  for (const deal of items) {
    const key = utcDateKey(deal?.executedAt);
    if (!key) continue;
    const bucket = days.get(key) || createDayBucket(key);
    const realized = number(deal.realizedPnl);
    const commission = number(deal.commission);
    const swap = number(deal.swap);
    const type = String(deal.type || "").toUpperCase();

    bucket.realized += realized;
    bucket.commission += commission;
    bucket.swap += swap;
    bucket.net += realized - commission - swap;
    bucket.executions.push(deal);

    if (CLOSING_TYPES.has(type)) {
      bucket.tradeCount += 1;
      if (realized > 0) bucket.wins += 1;
      else if (realized < 0) bucket.losses += 1;
    }

    days.set(key, bucket);
  }

  for (const bucket of days.values()) {
    bucket.executions.sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime());
  }

  return days;
}

function buildCalendarRows(cursor) {
  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const firstWeekdayMondayZero = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells = [
    ...Array(firstWeekdayMondayZero).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows = [];
  for (let index = 0; index < cells.length; index += 7) {
    rows.push(cells.slice(index, index + 7));
  }
  return rows;
}

function dateKeyForDay(cursor, day) {
  const year = cursor.getUTCFullYear();
  const month = String(cursor.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}-${String(day).padStart(2, "0")}`;
}

function toneClass(value) {
  if (value > 0.004) return "text-emerald-400";
  if (value < -0.004) return "text-rose-400";
  return "text-[#8a8a8a]";
}

function cellClass(value, selected, today) {
  const tone = value > 0.004
    ? "border-emerald-400/15 bg-emerald-400/[0.045]"
    : value < -0.004
      ? "border-rose-400/15 bg-rose-400/[0.045]"
      : "border-white/[0.07] bg-[#080808]";

  if (selected) return `${tone} border-[#195be1]/80 ring-1 ring-inset ring-[#195be1]/30`;
  if (today) return `${tone} border-[#195be1]/45`;
  return `${tone} hover:border-white/[0.16] hover:bg-white/[0.025]`;
}

export default function TradingCalendar({ account }) {
  const { getAccessToken } = useAuth();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  });
  const [items, setItems] = useState([]);
  const [timezone, setTimezone] = useState("UTC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const bounds = useMemo(() => utcMonthBounds(cursor), [cursor]);

  useEffect(() => {
    setSelectedDay(null);
  }, [account?.accountId, cursor]);

  useEffect(() => {
    if (!account?.accountId) {
      setItems([]);
      setError("");
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Your ACG Funded session has expired.");

        const allItems = [];
        let nextCursor = null;
        let pageCount = 0;
        const seenCursors = new Set();

        while (!cancelled) {
          const params = new URLSearchParams({
            limit: "200",
            from: bounds.from.toISOString(),
            to: bounds.to.toISOString(),
          });
          if (nextCursor) params.set("cursor", nextCursor);

          const response = await fetch(
            `${API_URL}/api/customer/accounts/${encodeURIComponent(account.accountId)}/trades?${params.toString()}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
              signal: controller.signal,
            },
          );

          const payload = await response.json().catch(() => ({}));
          if (!response.ok) {
            throw new Error(payload?.message || "Unable to load trading history.");
          }

          const pageItems = Array.isArray(payload?.data?.items) ? payload.data.items : [];
          allItems.push(...pageItems);
          if (payload?.data?.timezone) setTimezone(payload.data.timezone);

          const page = payload?.data?.page || {};
          if (!page.hasMore) break;
          const candidate = String(page.nextCursor || "");
          if (!candidate || seenCursors.has(candidate)) {
            throw new Error("Trading history pagination could not be completed safely.");
          }
          seenCursors.add(candidate);
          nextCursor = candidate;
          pageCount += 1;
          if (pageCount >= MAX_PAGES) {
            throw new Error("This month contains too much activity to display safely.");
          }
        }

        if (!cancelled) setItems(allItems);
      } catch (loadError) {
        if (loadError?.name === "AbortError") return;
        if (!cancelled) {
          setItems([]);
          setError(loadError?.message || "Unable to load trading history.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [account?.accountId, bounds.from, bounds.to, getAccessToken, reloadKey]);

  const dayMap = useMemo(() => aggregateDeals(items), [items]);
  const calendarRows = useMemo(() => buildCalendarRows(cursor), [cursor]);
  const todayKey = utcDateKey(new Date());

  const monthStats = useMemo(() => {
    let net = 0;
    let realized = 0;
    let commission = 0;
    let swap = 0;
    let trades = 0;
    let wins = 0;
    let losses = 0;

    for (const bucket of dayMap.values()) {
      net += bucket.net;
      realized += bucket.realized;
      commission += bucket.commission;
      swap += bucket.swap;
      trades += bucket.tradeCount;
      wins += bucket.wins;
      losses += bucket.losses;
    }

    return {
      net,
      realized,
      commission,
      swap,
      trades,
      wins,
      losses,
      tradingDays: dayMap.size,
      winRate: trades > 0 ? (wins / trades) * 100 : 0,
    };
  }, [dayMap]);

  const weekStats = useMemo(() => calendarRows.map((row, index) => {
    let net = 0;
    let trades = 0;
    for (const day of row) {
      if (!day) continue;
      const bucket = dayMap.get(dateKeyForDay(cursor, day));
      if (!bucket) continue;
      net += bucket.net;
      trades += bucket.tradeCount;
    }
    return { index: index + 1, net, trades };
  }), [calendarRows, cursor, dayMap]);

  const selected = selectedDay ? dayMap.get(selectedDay) || createDayBucket(selectedDay) : null;

  if (!account) {
    return (
      <section className="grid min-h-[320px] place-items-center rounded-xl border border-white/[0.08] bg-[#080808] px-6 text-center">
        <div className="max-w-sm">
          <CalendarDays size={20} className="mx-auto text-[#555]" />
          <h2 className="mt-4 text-[13px] font-semibold text-white">No trading account selected</h2>
          <p className="mt-2 text-[10px] leading-5 text-[#666]">Choose or create an account to view its trading calendar.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="space-y-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] lg:pb-0">
        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] px-4 py-4 sm:px-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#666]">
                <CalendarDays size={13} />
                Trading performance
              </div>
              <h2 className="mt-2 text-[clamp(1.25rem,4vw,1.8rem)] font-semibold tracking-[-0.04em] text-white">
                {monthLabel(cursor)}
              </h2>
              <p className="mt-1 text-[10px] text-[#5f5f5f]">
                Realized activity for {account.accountId} · Day boundaries use {timezone}.
              </p>
            </div>

            <div className="inline-flex self-start overflow-hidden rounded-lg border border-white/[0.08] bg-black lg:self-auto">
              <button
                type="button"
                onClick={() => setCursor(current => moveMonth(current, -1))}
                className="grid min-h-9 min-w-10 place-items-center text-[#777] transition hover:bg-white/[0.04] hover:text-white"
                aria-label="Previous month"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setCursor(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)));
                }}
                className="min-h-9 border-x border-white/[0.08] px-3 text-[9px] font-medium text-[#888] transition hover:bg-white/[0.04] hover:text-white"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setCursor(current => moveMonth(current, 1))}
                className="grid min-h-9 min-w-10 place-items-center text-[#777] transition hover:bg-white/[0.04] hover:text-white"
                aria-label="Next month"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] sm:grid-cols-4 sm:divide-y-0">
            <Metric label="Net P&L" value={signedMoney(monthStats.net)} tone={toneClass(monthStats.net)} />
            <Metric label="Trades" value={integerFormatter.format(monthStats.trades)} />
            <Metric label="Trading days" value={integerFormatter.format(monthStats.tradingDays)} />
            <Metric label="Win rate" value={monthStats.trades ? `${monthStats.winRate.toFixed(1)}%` : "—"} />
          </div>
        </section>

        {error && (
          <div className="flex items-start justify-between gap-4 rounded-lg border border-rose-500/20 bg-rose-500/[0.045] px-4 py-3">
            <div className="flex min-w-0 items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-400" />
              <div>
                <p className="text-[10px] font-medium text-rose-300">Trading calendar unavailable</p>
                <p className="mt-1 text-[9px] leading-4 text-[#777]">{error}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setReloadKey(value => value + 1)}
              className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/[0.08] px-2.5 text-[9px] text-[#aaa] hover:text-white"
            >
              <RefreshCw size={11} />
              Retry
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808]">
          <div className="border-b border-white/[0.07] px-4 py-3.5 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-[11px] font-semibold text-white">Weekly summary</h3>
                <p className="mt-0.5 text-[9px] text-[#555]">Calendar-row totals for this month</p>
              </div>
              {loading && (
                <span className="inline-flex items-center gap-1.5 text-[9px] text-[#666]">
                  <RefreshCw size={10} className="animate-spin" />
                  Loading
                </span>
              )}
            </div>
          </div>
          <div className="flex snap-x snap-mandatory overflow-x-auto sm:grid sm:grid-cols-3 sm:overflow-visible xl:grid-cols-6">
            {weekStats.map(week => (
              <div key={week.index} className="min-w-[132px] snap-start border-r border-white/[0.06] px-4 py-2.5 last:border-r-0 sm:min-w-0 sm:border-b sm:px-5 sm:py-3">
                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">Week {week.index}</span>
                <strong className={`mt-1.5 block font-mono text-[12px] font-semibold ${toneClass(week.net)}`}>
                  {compactSignedMoney(week.net)}
                </strong>
                <span className="mt-1 block text-[8px] text-[#555]">
                  {week.trades} trade{week.trades === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808]">
          <div className="grid grid-cols-7 border-b border-white/[0.07] bg-black/40">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
              <div key={day} className="px-1 py-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.07em] text-[#707070] sm:text-[9px]">
                {day}
              </div>
            ))}
          </div>

          {loading && !items.length ? (
            <div className="grid min-h-[330px] place-items-center">
              <div className="text-center">
                <RefreshCw size={17} className="mx-auto animate-spin text-[#666]" />
                <p className="mt-3 text-[10px] text-[#666]">Loading trading activity…</p>
              </div>
            </div>
          ) : (
            <div className="p-1.5 sm:p-2">
              {calendarRows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {row.map((day, columnIndex) => {
                    if (!day) {
                      return <div key={`empty-${rowIndex}-${columnIndex}`} className="min-h-[74px] sm:min-h-[92px]" />;
                    }
                    const key = dateKeyForDay(cursor, day);
                    const bucket = dayMap.get(key);
                    const selectedCell = selectedDay === key;
                    const today = todayKey === key;
                    const hasActivity = Boolean(bucket?.executions?.length);
                    const net = bucket?.net || 0;

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSelectedDay(key)}
                        className={`min-h-[74px] min-w-0 rounded-lg border p-1.5 text-left transition sm:min-h-[92px] sm:p-2.5 ${cellClass(net, selectedCell, today)}`}
                        aria-label={`${key}${hasActivity ? `, ${signedMoney(net)}, ${bucket.tradeCount} trades` : ", no trading activity"}`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`font-mono text-[9px] font-medium sm:text-[10px] ${today ? "text-white" : "text-[#8a8a8a]"}`}>
                            {String(day).padStart(2, "0")}
                          </span>
                          {today && (
                            <>
                              <span className="mt-0.5 size-1.5 rounded-full bg-[#195be1] sm:hidden" aria-hidden="true" />
                              <span className="hidden text-[7px] font-semibold uppercase tracking-[0.08em] text-[#777] sm:block">Today</span>
                            </>
                          )}
                        </div>

                        {hasActivity && (
                          <div className="mt-2 min-w-0 sm:mt-3">
                            <strong className={`block whitespace-nowrap font-mono text-[8.5px] font-semibold tracking-[-0.05em] sm:hidden ${toneClass(net)}`}>
                              {mobileCompactSignedMoney(net)}
                            </strong>
                            <strong className={`hidden whitespace-nowrap font-mono text-[11px] font-semibold sm:block ${toneClass(net)}`}>
                              {compactSignedMoney(net)}
                            </strong>
                            <span className="mt-1 hidden text-[8px] text-[#555] sm:block">
                              {bucket.tradeCount > 0
                                ? `${bucket.tradeCount} trade${bucket.tradeCount === 1 ? "" : "s"}`
                                : `${bucket.executions.length} execution${bucket.executions.length === 1 ? "" : "s"}`}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="border-t border-white/[0.06] px-5 py-4 text-center text-[9px] text-[#555]">
              No trading activity was recorded for {monthLabel(cursor)}.
            </div>
          )}
        </section>

        <div className="px-1 text-[10px] leading-5 text-[#666]">
          <span className="sm:hidden">Net P&L = realized P&L − commission − swap. Day boundaries use UTC.</span>
          <span className="hidden sm:inline">Net P&L = realized P&L minus execution commission and swap. Trade outcomes use realized P&L on closing executions. Times and day boundaries are UTC.</span>
        </div>
      </div>

      {selectedDay && (
        <DayDrawer
          dayKey={selectedDay}
          bucket={selected}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </>
  );
}

function Metric({ label, value, tone = "text-white" }) {
  return (
    <div className="px-4 py-4 sm:px-5">
      <span className="block text-[8px] font-semibold uppercase tracking-[0.12em] text-[#555]">{label}</span>
      <strong className={`mt-1.5 block font-mono text-[15px] font-semibold tracking-[-0.02em] sm:text-[17px] ${tone}`}>
        {value}
      </strong>
    </div>
  );
}

function DayDrawer({ dayKey, bucket, onClose }) {
  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const executions = bucket?.executions || [];
  const net = bucket?.net || 0;
  const tradeCount = bucket?.tradeCount || 0;
  const wins = bucket?.wins || 0;
  const losses = bucket?.losses || 0;

  return createPortal(
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label={`Trading details for ${dayHeading(dayKey)}`}>
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close day details"
      />
      <aside className="absolute inset-x-0 bottom-0 flex max-h-[84dvh] flex-col overflow-hidden rounded-t-2xl border-t border-white/[0.1] bg-[#080808] shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[min(92vw,430px)] sm:rounded-none sm:border-l sm:border-t-0">
        <div className="shrink-0 border-b border-white/[0.07] bg-[#080808]/98 px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[8px] font-semibold uppercase tracking-[0.13em] text-[#666]">Trading day · UTC</span>
              <h3 className="mt-1.5 text-[15px] font-semibold leading-5 text-white">{dayHeading(dayKey)}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] text-[#777] transition hover:bg-white/[0.04] hover:text-white"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          <strong className={`mt-5 block font-mono text-[28px] font-semibold tracking-[-0.04em] ${toneClass(net)}`}>
            {signedMoney(net)}
          </strong>
          <span className="mt-1 block text-[9px] text-[#666]">Net P&L</span>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <MiniMetric label="Trades" value={tradeCount} />
            <MiniMetric label="Wins" value={wins} />
            <MiniMetric label="Losses" value={losses} />
            <MiniMetric label="Exec." value={executions.length} />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-5">
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/25">
            <SummaryRow label="Realized P&L" value={signedMoney(bucket?.realized || 0)} valueClass={toneClass(bucket?.realized || 0)} />
            <SummaryRow label="Commission" value={`-${money(bucket?.commission || 0)}`} />
            <SummaryRow label="Swap" value={number(bucket?.swap) === 0 ? money(0) : signedMoney(-number(bucket?.swap))} />
            <SummaryRow label="Net P&L" value={signedMoney(net)} valueClass={toneClass(net)} emphasized />
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-[10px] font-semibold text-white">Executions</h4>
              <span className="text-[8px] text-[#666]">{executions.length} total</span>
            </div>

            {executions.length === 0 ? (
              <div className="rounded-xl border border-white/[0.07] px-4 py-8 text-center text-[9px] text-[#666]">
                No trading activity on this day.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06] overflow-hidden rounded-xl border border-white/[0.08]">
                {executions.map((deal, index) => {
                  const netValue = dealNet(deal);
                  const close = CLOSING_TYPES.has(String(deal.type || "").toUpperCase());
                  return (
                    <div key={deal.dealId || `${deal.executedAt}-${index}`} className="px-3.5 py-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] font-semibold text-white">{deal.symbol || "—"}</span>
                            <span className="text-[8px] font-medium text-[#777]">{deal.side || "—"}</span>
                            <span className="rounded border border-white/[0.07] px-1.5 py-0.5 text-[7px] font-medium uppercase tracking-[0.08em] text-[#666]">
                              {String(deal.type || "EXECUTION").replaceAll("_", " ")}
                            </span>
                          </div>
                          <p className="mt-1.5 text-[8px] text-[#666]">
                            {utcTimeLabel(deal.executedAt)} · {deal.volume || "—"} lots @ {deal.price || "—"}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <strong className={`font-mono text-[10px] font-semibold ${toneClass(netValue)}`}>
                            {signedMoney(netValue)}
                          </strong>
                          <span className="mt-1 block text-[7px] text-[#666]">{close ? "Close" : "Execution"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-black/30 px-2.5 py-2.5">
      <span className="block text-[7px] font-semibold uppercase tracking-[0.1em] text-[#555]">{label}</span>
      <strong className="mt-1 block font-mono text-[11px] font-semibold text-white">{value}</strong>
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "text-[#aaa]", emphasized = false }) {
  return (
    <div className={`flex items-center justify-between gap-4 px-3.5 py-3 ${emphasized ? "border-t border-white/[0.08] bg-white/[0.02]" : ""}`}>
      <span className={`text-[9px] ${emphasized ? "font-semibold text-[#aaa]" : "text-[#666]"}`}>{label}</span>
      <span className={`font-mono text-[10px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
