import { useState, useEffect, useRef, useCallback } from "react";
import { Zap, TrendingUp, Activity, Shield, WifiOff } from "lucide-react";

// ---- live market config ----
const SYMBOL = "btcusdt";
const KLINE_INTERVAL = "5m";
const CANDLE_COUNT = 28;
const CHART_HEIGHT = 128;
const CHART_WIDTH = 600;
const CANDLE_STEP = CHART_WIDTH / CANDLE_COUNT;
const BINANCE_REST = "https://api.binance.com/api/v3";
const BINANCE_WS = `wss://stream.binance.com:9443/stream?streams=${SYMBOL}@kline_${KLINE_INTERVAL}/${SYMBOL}@depth5@100ms/${SYMBOL}@ticker`;

// Simulated account metrics
function seedPositions() {
  return [
    { symbol: "BTC/USD", side: "LONG", size: "1.2 lots", pnl: 340, up: true, mult: 1.2 },
    { symbol: "ETH/USD", side: "SHORT", size: "3.5 lots", pnl: -85, up: false, mult: -3.5 },
    { symbol: "XAU/USD", side: "LONG", size: "0.8 lots", pnl: 62, up: true, mult: 0.8 },
  ];
}

export default function LiveTradingTerminal() {
  const cardRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const lastPriceRef = useRef(null);

  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [connected, setConnected] = useState(false);

  const [lastPrice, setLastPrice] = useState(null);
  const [pctChange, setPctChange] = useState(0);

  const [equity, setEquity] = useState(102340);
  const [equityDelta, setEquityDelta] = useState(120);
  const [buffer, setBuffer] = useState(87);
  const [consistency, setConsistency] = useState(74);
  const [psychScore, setPsychScore] = useState(81);

  const [candles, setCandles] = useState([]);
  const [positions, setPositions] = useState(seedPositions());
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });

  // Handles both mouse and touch for the spotlight effect
  const handleInteraction = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    setSpot({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  // --- fetch seed candles from Binance REST ---
  useEffect(() => {
    let cancelled = false;

    async function seed() {
      try {
        const res = await fetch(
          `${BINANCE_REST}/klines?symbol=${SYMBOL.toUpperCase()}&interval=${KLINE_INTERVAL}&limit=${CANDLE_COUNT}`
        );
        const raw = await res.json();
        if (cancelled) return;
        const seeded = raw.map((k) => ({
          t: k[0],
          o: parseFloat(k[1]),
          h: parseFloat(k[2]),
          l: parseFloat(k[3]),
          c: parseFloat(k[4]),
        }));
        setCandles(seeded);
        lastPriceRef.current = seeded[seeded.length - 1]?.c ?? null;
        setLastPrice(lastPriceRef.current);
      } catch (err) {
        console.error("Failed to load seed candles", err);
      }
    }

    seed();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- live websocket: klines, depth5, ticker ---
  useEffect(() => {
    function connect() {
      const ws = new WebSocket(BINANCE_WS);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        reconnectTimer.current = setTimeout(connect, 2000);
      };
      ws.onerror = () => ws.close();

      ws.onmessage = (evt) => {
        const msg = JSON.parse(evt.data);
        const { stream, data } = msg;
        if (!stream) return;

        if (stream.endsWith(`@kline_${KLINE_INTERVAL}`)) {
          const k = data.k;
          const updated = {
            t: k.t,
            o: parseFloat(k.o),
            h: parseFloat(k.h),
            l: parseFloat(k.l),
            c: parseFloat(k.c),
          };
          setCandles((prev) => {
            if (prev.length === 0) return prev;
            const last = prev[prev.length - 1];
            if (last.t === updated.t) {
              return [...prev.slice(0, -1), updated];
            }
            if (k.x) {
              return [...prev.slice(1), updated];
            }
            return prev;
          });
          lastPriceRef.current = updated.c;
        }

        if (stream.endsWith("@depth5@100ms")) {
          setOrderBook({
            asks: (data.asks || []).slice(0, 5).map(([price, size]) => ({
              price: parseFloat(price).toFixed(2),
              size: parseFloat(size),
            })),
            bids: (data.bids || []).slice(0, 5).map(([price, size]) => ({
              price: parseFloat(price).toFixed(2),
              size: parseFloat(size),
            })),
          });
        }

        if (stream.endsWith("@ticker")) {
          setLastPrice(parseFloat(data.c));
          setPctChange(parseFloat(data.P));
        }
      };
    }

    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, []);

  // --- synthetic account metrics ---
  useEffect(() => {
    const id = setInterval(() => {
      const priceMoveRatio = lastPriceRef.current
        ? (Math.random() - 0.5) * 0.0006
        : 0;

      setPositions((prev) =>
        prev.map((p) => {
          const drift = p.pnl * priceMoveRatio * p.mult + (Math.random() - 0.5) * 6;
          const pnl = p.pnl + drift;
          return { ...p, pnl, up: pnl >= 0 };
        })
      );

      setEquity((prevEquity) => {
        const change = (Math.random() - 0.48) * 60;
        const next = Math.max(90000, prevEquity + change);
        setEquityDelta((prevDelta) => prevDelta + change);
        return next;
      });

      setBuffer((prev) => Math.min(99, Math.max(40, prev + (Math.random() - 0.5) * 2)));
      setConsistency((prev) => Math.min(98, Math.max(50, prev + (Math.random() - 0.5) * 1.5)));
      setPsychScore((prev) => Math.min(98, Math.max(50, prev + (Math.random() - 0.5) * 1.5)));
    }, 1500);
    return () => clearInterval(id);
  }, []);

  const formatCurrency = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const formatPnl = (n) => `${n >= 0 ? "+" : "-"}$${Math.abs(n).toFixed(2)}`;

  const formatPrice = (n) =>
    n == null
      ? "—"
      : n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 py-8 md:py-16 flex flex-col items-center">
      <div
        ref={cardRef}
        onMouseMove={handleInteraction}
        onTouchMove={handleInteraction}
        className="fade-up w-full max-w-5xl border border-gray-800/60 bg-gradient-to-br from-[#121520] to-[#0A0C12] backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl text-left relative overflow-hidden group"
        style={{ animationDelay: "0.4s" }}
      >
        {/* Spotlight Effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(500px circle at ${spot.x}% ${spot.y}%, rgba(96,165,250,0.08), transparent 70%)`,
          }}
        />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-blue-600/15 transition-all duration-700" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent" />

        {/* Window Chrome Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800/80 pb-4 md:pb-5 mb-5 md:mb-6 gap-3 md:gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <div className="h-4 w-[1px] bg-gray-800 hidden md:block" />
            <p className="text-[10px] md:text-xs text-gray-500 font-mono tracking-wider uppercase flex items-center gap-1.5 whitespace-nowrap">
              <Zap size={12} className="text-blue-400 shrink-0" /> PHASE1 $100,000
              <span className="inline-block w-[6px] h-3 bg-blue-400/70 ml-0.5 animate-pulse shrink-0" />
            </p>
          </div>
          <div
            className={`self-start md:self-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium border ${
              connected
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {connected ? (
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
            ) : (
              <WifiOff size={12} className="shrink-0" />
            )}
            {connected ? "Binance Live Feed" : "Reconnecting..."}
          </div>
        </div>

        {/* Dashboard Core Layout split */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column: Account Metrics + Chart + Positions */}
          <div className="md:col-span-2 space-y-4 md:space-y-5">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-[#11131F]/80 p-3 md:p-4 rounded-xl border border-gray-800/80">
                <p className="text-[10px] md:text-[11px] text-gray-500 uppercase font-semibold tracking-wider">Account Equity</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white mt-1 font-mono tabular-nums">
                  {formatCurrency(equity)}
                </p>
                <span
                  className={`text-[9px] md:text-[10px] font-medium px-1.5 py-0.5 rounded mt-2 inline-block font-mono transition-colors ${
                    equityDelta >= 0 ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"
                  }`}
                >
                  {formatPnl(equityDelta)} today
                </span>
              </div>

              <div className="bg-[#11131F]/80 p-3 md:p-4 rounded-xl border border-gray-800/80">
                <p className="text-[10px] md:text-[11px] text-gray-500 uppercase font-semibold tracking-wider">BTC/USD Spot</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-cyan-400 mt-1 font-mono tabular-nums">
                  {formatPrice(lastPrice)}
                </p>
                <span
                  className={`text-[9px] md:text-[11px] font-medium block mt-2 font-mono ${
                    pctChange >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {pctChange >= 0 ? "+" : ""}
                  {pctChange.toFixed(2)}% (24h)
                </span>
              </div>
            </div>

            {/* Live Candlestick Chart */}
            <div className="bg-[#0E1017] border border-gray-800/80 rounded-xl p-3 md:p-4 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
                <span className="text-[10px] md:text-xs font-medium text-gray-400 flex items-center gap-1.5 truncate">
                  <TrendingUp size={14} className="text-blue-400 shrink-0" /> BTC/USD — {KLINE_INTERVAL} candles
                </span>
                <span className="text-[9px] md:text-[10px] text-gray-500 font-mono shrink-0 flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      connected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
                    }`}
                  />
                  {connected ? "LIVE" : "OFFLINE"}
                </span>
              </div>
              <div className="h-36 md:h-32 w-full pt-1 md:pt-2">
                {candles.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-[10px] md:text-[11px] text-gray-600 font-mono">
                    Loading market data…
                  </div>
                ) : (
                  <svg className="w-full h-full" viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none">
                    {[0.25, 0.5, 0.75].map((f) => (
                      <line
                        key={f}
                        x1="0"
                        x2={CHART_WIDTH}
                        y1={CHART_HEIGHT * f}
                        y2={CHART_HEIGHT * f}
                        stroke="#1c1f2e"
                        strokeWidth="1"
                      />
                    ))}

                    {(() => {
                      const minPrice = Math.min(...candles.map((c) => Math.min(c.o, c.c, c.l ?? c.o))) - 5;
                      const maxPrice = Math.max(...candles.map((c) => Math.max(c.o, c.c, c.h ?? c.c))) + 5;
                      const range = maxPrice - minPrice || 1;
                      const getY = (price) => CHART_HEIGHT - ((price - minPrice) / range) * CHART_HEIGHT;

                      return candles.map((cd, i) => {
                        const cx = i * CANDLE_STEP + CANDLE_STEP / 2;
                        const bull = cd.c > cd.o;
                        const oY = getY(cd.o);
                        const cY = getY(cd.c);
                        const bodyTop = Math.min(oY, cY);
                        const bodyBottom = Math.max(oY, cY);
                        const high = getY(cd.h ?? Math.max(cd.o, cd.c));
                        const low = getY(cd.l ?? Math.min(cd.o, cd.c));
                        const color = bull ? "#34d399" : "#ef4444";

                        return (
                          <g key={cd.t ?? i} style={{ transition: "all 0.4s ease" }}>
                            <line x1={cx} x2={cx} y1={high} y2={low} stroke={color} strokeWidth="1.5" />
                            <rect
                              x={cx - CANDLE_STEP * 0.28}
                              y={bodyTop}
                              width={CANDLE_STEP * 0.56}
                              height={Math.max(bodyBottom - bodyTop, 2)}
                              fill={color}
                              rx="1"
                            />
                          </g>
                        );
                      });
                    })()}
                  </svg>
                )}
              </div>
            </div>

            {/* Live Positions Table */}
            <div className="bg-[#0E1017] border border-gray-800/80 rounded-xl overflow-x-auto">
              <div className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 border-b border-gray-800/80 min-w-full">
                <span className="text-[10px] md:text-[11px] text-gray-500 uppercase font-semibold tracking-wider">Open Positions</span>
                <span className="text-[10px] md:text-[11px] text-gray-600 font-mono">{positions.length} active</span>
              </div>
              <div className="divide-y divide-gray-800/40 min-w-full">
                {positions.map((p, i) => (
                  <div key={i} className="flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 hover:bg-white/[0.02] transition-colors gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span
                        className={`text-[8px] md:text-[9px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          p.side === "LONG" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {p.side}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-300 font-medium truncate">{p.symbol}</span>
                      <span className="text-[10px] md:text-[11px] text-gray-600 font-mono hidden sm:inline shrink-0">{p.size}</span>
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-mono font-semibold shrink-0 tabular-nums transition-colors ${
                        p.up ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {formatPnl(p.pnl)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Trader Scores + Live Order Book */}
          <div className="flex flex-col space-y-5 md:space-y-6 pt-5 mt-2 border-t md:border-t-0 md:mt-0 md:pt-0 md:border-l border-gray-800/80 md:pl-6">
            <div>
              <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold tracking-wider">Strategy Consistency</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1 font-mono tabular-nums">
                {consistency.toFixed(0)}%
              </p>
              <div className="w-full bg-gray-950 h-1.5 rounded-full mt-2 md:mt-3 overflow-hidden border border-gray-800/60">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${consistency}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/80">
              <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold tracking-wider flex items-center gap-1.5">
                <Activity size={13} className="text-purple-400" /> Psychological Score
              </p>
              <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1 font-mono tabular-nums">
                {psychScore.toFixed(0)}%
              </p>
              <div className="w-full bg-gray-950 h-1.5 rounded-full mt-2 md:mt-3 overflow-hidden border border-gray-800/60">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${psychScore}%` }}
                />
              </div>
            </div>

            {/* Live Order Book */}
            <div className="pt-4 border-t border-gray-800/80">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <p className="text-[10px] md:text-xs text-gray-500 uppercase font-semibold tracking-wider">Order Book — BTC/USD</p>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${connected ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
              </div>
              <div className="space-y-1 font-mono text-[10px] md:text-[11px]">
                {orderBook.asks.length === 0 && orderBook.bids.length === 0 ? (
                  <div className="text-[10px] md:text-[11px] text-gray-600 py-2">Loading order book…</div>
                ) : (
                  <>
                    {orderBook.asks
                      .slice()
                      .reverse()
                      .map((a, i) => (
                        <div key={`a-${i}`} className="relative flex items-center justify-between px-2 py-0.5 rounded">
                          <div
                            className="absolute inset-y-0 right-0 bg-red-500/5 rounded pointer-events-none transition-all duration-500"
                            style={{ width: `${Math.min(a.size * 40, 100)}%` }}
                          />
                          <span className="relative text-red-400 tabular-nums">{a.price}</span>
                          <span className="relative text-gray-500 tabular-nums">{a.size.toFixed(3)}</span>
                        </div>
                      ))}
                    <div className="h-[1px] bg-gray-800/60 my-1.5" />
                    {orderBook.bids.map((b, i) => (
                      <div key={`b-${i}`} className="relative flex items-center justify-between px-2 py-0.5 rounded">
                        <div
                          className="absolute inset-y-0 right-0 bg-emerald-500/5 rounded pointer-events-none transition-all duration-500"
                          style={{ width: `${Math.min(b.size * 40, 100)}%` }}
                        />
                        <span className="relative text-emerald-400 tabular-nums">{b.price}</span>
                        <span className="relative text-gray-500 tabular-nums">{b.size.toFixed(3)}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/80 mt-auto">
              <p className="text-[10px] md:text-[11px] text-gray-500 uppercase font-semibold tracking-wider">Allocation Health</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-400 mt-1 flex items-center gap-2">
                Institutional Alpha <Shield size={16} className="text-blue-400 shrink-0" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}