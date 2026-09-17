import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, RefreshCw, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import acg from '../../assets/ACG.png';
import { customerApi } from '../../api/customer.js';

const SYMBOL = 'BTCUSDT';
const WS_URL = `wss://stream.binance.com:9443/ws/${SYMBOL.toLowerCase()}@ticker`;

const money = (value, digits = 2) => Number(value || 0).toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: digits,
  maximumFractionDigits: digits,
});

const priceText = (value) => value ? Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';

function floatingPnl(position, price) {
  if (!price) return 0;
  const direction = position.side === 'BUY' ? 1 : -1;
  return (Number(price) - Number(position.entryPrice)) * Number(position.quantity) * direction;
}

export default function DemoTrading({ account, onAccountChange, onBack, onStartChallenge }) {
  const socketRef = useRef(null);
  const reconnectRef = useRef(null);
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(0);
  const [connected, setConnected] = useState(false);
  const [quantity, setQuantity] = useState(0.01);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState('');

  const positions = account?.demoTrading?.positions || [];
  const history = account?.demoTrading?.history || [];
  const floating = useMemo(() => positions.reduce((sum, position) => sum + floatingPnl(position, price), 0), [positions, price]);
  const equity = Number(account?.balance || 0) + floating;

  useEffect(() => {
    let stopped = false;
    const connect = () => {
      if (stopped) return;
      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setPrice(Number(data.c));
          setChange(Number(data.P || 0));
        } catch { /* ignore malformed market tick */ }
      };
      ws.onerror = () => ws.close();
      ws.onclose = () => {
        setConnected(false);
        if (!stopped) reconnectRef.current = window.setTimeout(connect, 1800);
      };
    };
    connect();
    return () => {
      stopped = true;
      window.clearTimeout(reconnectRef.current);
      socketRef.current?.close();
    };
  }, []);

  const placeOrder = async (side) => {
    if (!price || working) return;
    setWorking(true);
    setNotice('');
    try {
      const next = await customerApi.placeDemoOrder(account.accountId, {
        symbol: 'BTCUSD',
        side,
        quantity: Number(quantity),
        price: Number(price),
      });
      onAccountChange(next);
      setNotice(`${side === 'BUY' ? 'Long' : 'Short'} position opened at ${priceText(price)}.`);
    } catch (error) {
      setNotice(error.message || 'Unable to place demo order.');
    } finally {
      setWorking(false);
    }
  };

  const closePosition = async (positionId) => {
    if (!price || working) return;
    setWorking(true);
    setNotice('');
    try {
      const next = await customerApi.closeDemoPosition(account.accountId, positionId, Number(price));
      onAccountChange(next);
      setNotice('Position closed and the simulated P&L was booked to your demo balance.');
    } catch (error) {
      setNotice(error.message || 'Unable to close demo position.');
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#EDEDED] antialiased">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#222] bg-black px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <img src={acg} alt="ACG Funded" className="h-5 w-auto" />
          <span className="hidden h-4 w-px bg-[#2A2A2A] sm:block" />
          <span className="hidden text-[12px] text-[#777] sm:block">Demo Trading</span>
        </div>
        <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-[#888] hover:text-white">
          <ArrowLeft size={14} /> Dashboard
        </button>
      </header>

      <main className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8">
        <section className="mb-5 flex flex-col gap-4 rounded-xl border border-[#242424] bg-[#090909] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded border border-[#2B2B2B] bg-[#111] px-2 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#888]">Free demo</span>
              <span className={`flex items-center gap-1.5 text-[11px] ${connected ? 'text-emerald-400' : 'text-[#777]'}`}>
                {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
                {connected ? 'Live market feed' : 'Connecting'}
              </span>
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white">Practice the ACG workflow before your first challenge.</h1>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-5 text-[#777]">This account uses simulated funds. Orders are persisted to your ACG Funded profile, but they do not enter the paid challenge risk engine or ACG Trader.</p>
          </div>
          <button onClick={onStartChallenge} className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-4 text-[12px] font-semibold text-black hover:bg-[#E9E9E9]">
            Start real challenge <ArrowRight size={13} />
          </button>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_330px]">
          <div className="space-y-5">
            <section className="rounded-xl border border-[#222] bg-[#090909]">
              <div className="flex items-center justify-between border-b border-[#202020] px-5 py-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-[#666]">BTC / USD</div>
                  <div className="mt-1 flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-semibold tracking-tight text-white">${priceText(price)}</span>
                    <span className={`font-mono text-[12px] ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{change >= 0 ? '+' : ''}{change.toFixed(2)}%</span>
                  </div>
                </div>
                <RefreshCw size={15} className={connected ? 'text-[#555]' : 'animate-spin text-[#777]'} />
              </div>

              <div className="grid min-h-[330px] place-items-center px-6 py-10">
                <div className="w-full max-w-xl">
                  <div className="mb-8 flex items-center justify-center">
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-[#242424] bg-[#0D0D0D]">
                      <div className="absolute inset-4 rounded-full border border-[#1E1E1E]" />
                      <div className="text-center">
                        <div className="text-[10px] uppercase tracking-[0.17em] text-[#555]">Live quote</div>
                        <div className="mt-2 font-mono text-xl font-medium text-white">${priceText(price)}</div>
                        <div className="mt-2 text-[10px] text-[#555]">Binance BTCUSDT reference</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[12px] leading-5 text-[#666]">The onboarding demo intentionally keeps charting minimal. Full charting, tools, order types and execution belong in ACG Trader.</p>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-[#222] bg-[#090909]">
              <div className="flex items-center justify-between border-b border-[#202020] px-5 py-4">
                <div><h2 className="text-[13px] font-medium text-white">Open positions</h2><p className="mt-1 text-[11px] text-[#666]">{positions.length} open</p></div>
                <span className={`font-mono text-[12px] ${floating >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{floating >= 0 ? '+' : ''}{money(floating)}</span>
              </div>
              {positions.length === 0 ? (
                <div className="px-5 py-10 text-center text-[12px] text-[#666]">Open your first demo position from the order ticket.</div>
              ) : (
                <div className="divide-y divide-[#202020]">
                  {positions.map((position) => {
                    const pnl = floatingPnl(position, price);
                    return <div key={position.positionId} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 sm:grid-cols-[1.1fr_.7fr_.7fr_.7fr_auto] sm:items-center">
                      <div><div className="text-[13px] font-medium text-white">{position.symbol}</div><div className={`mt-1 text-[10px] font-medium ${position.side === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{position.side} · {position.quantity}</div></div>
                      <div className="hidden font-mono text-[11px] text-[#888] sm:block">{priceText(position.entryPrice)}</div>
                      <div className="hidden font-mono text-[11px] text-[#888] sm:block">{priceText(price)}</div>
                      <div className={`font-mono text-[11px] ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{pnl >= 0 ? '+' : ''}{money(pnl)}</div>
                      <button disabled={working || !price} onClick={() => closePosition(position.positionId)} className="rounded-md border border-[#303030] px-3 py-1.5 text-[11px] text-[#AAA] hover:bg-[#151515] hover:text-white disabled:opacity-40">Close</button>
                    </div>;
                  })}
                </div>
              )}
            </section>

            <section className="rounded-xl border border-[#222] bg-[#090909]">
              <div className="border-b border-[#202020] px-5 py-4"><h2 className="text-[13px] font-medium text-white">Recent demo trades</h2></div>
              {history.length === 0 ? <div className="px-5 py-8 text-[12px] text-[#666]">Closed trades will appear here.</div> : (
                <div className="divide-y divide-[#202020]">
                  {history.slice(0, 8).map((trade) => <div key={trade.tradeId} className="flex items-center justify-between gap-4 px-5 py-3 text-[11px]">
                    <div><span className="text-[#DDD]">{trade.symbol}</span><span className="ml-2 text-[#666]">{trade.side} · {trade.quantity}</span></div>
                    <span className={`font-mono ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{trade.pnl >= 0 ? '+' : ''}{money(trade.pnl)}</span>
                  </div>)}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-xl border border-[#222] bg-[#090909] p-5">
              <div className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-[#666]"><ShieldCheck size={14} /> Demo account</div>
              <div className="grid grid-cols-2 gap-4">
                <Metric label="Balance" value={money(account?.balance)} />
                <Metric label="Equity" value={money(equity)} />
                <Metric label="Floating P&L" value={`${floating >= 0 ? '+' : ''}${money(floating)}`} tone={floating >= 0 ? 'good' : 'bad'} />
                <Metric label="Closed trades" value={String(account?.totalTrades || 0)} />
              </div>
            </section>

            <section className="rounded-xl border border-[#222] bg-[#090909] p-5">
              <div className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Market order</div>
              <label className="mt-5 block text-[11px] text-[#777]">BTC quantity</label>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" min="0.001" step="0.001" className="mt-2 h-10 w-full rounded-md border border-[#2A2A2A] bg-[#0D0D0D] px-3 font-mono text-[13px] text-white outline-none focus:border-[#555]" />
              <div className="mt-2 flex gap-2">
                {[0.005, 0.01, 0.025].map((value) => <button key={value} onClick={() => setQuantity(value)} className="flex-1 rounded-md border border-[#282828] py-1.5 font-mono text-[10px] text-[#777] hover:text-white">{value}</button>)}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <button disabled={!price || working} onClick={() => placeOrder('BUY')} className="h-11 rounded-md bg-emerald-500 text-[12px] font-semibold text-black hover:bg-emerald-400 disabled:opacity-40">{working ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Buy / Long'}</button>
                <button disabled={!price || working} onClick={() => placeOrder('SELL')} className="h-11 rounded-md bg-red-500 text-[12px] font-semibold text-white hover:bg-red-400 disabled:opacity-40">{working ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Sell / Short'}</button>
              </div>
              <p className="mt-4 text-[10px] leading-4 text-[#555]">Demo orders use the displayed market quote as a simulated fill. No real funds are involved.</p>
              {notice && <div className="mt-4 rounded-md border border-[#2A2A2A] bg-[#111] px-3 py-2 text-[11px] leading-4 text-[#AAA]">{notice}</div>}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Metric({ label, value, tone }) {
  const toneClass = tone === 'good' ? 'text-emerald-400' : tone === 'bad' ? 'text-red-400' : 'text-white';
  return <div><div className="text-[10px] uppercase tracking-[0.12em] text-[#555]">{label}</div><div className={`mt-1.5 font-mono text-[13px] ${toneClass}`}>{value}</div></div>;
}
