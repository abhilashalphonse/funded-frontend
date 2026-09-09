import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  Star,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Layers,
  Zap,
  Radio,
  Lock,
  Wallet,
} from "lucide-react";
import LiveTradingTerminal from "./LiveTradingTerminal";
import PayoutProofSection from "./PayoutProof";


/* ------------------------------------------------------------------ */
/*  Data — kept as static config so the terminal reads as "real"       */
/* ------------------------------------------------------------------ */

const SYMBOLS = [
  "EURUSD",
  "GBPUSD",
  "USDJPY",
  "XAUUSD",
  "BTCUSD",
  "USDINR",
  "USDAED"
];

// open/close pairs in SVG-space (lower y = higher price). Static, hand-tuned uptrend.
const CANDLES = [
  { o: 108, c: 96 }, { o: 96, c: 102 }, { o: 102, c: 84 }, { o: 84, c: 90 },
  { o: 90, c: 74 }, { o: 74, c: 80 }, { o: 80, c: 62 }, { o: 62, c: 68 },
  { o: 68, c: 50 }, { o: 50, c: 56 }, { o: 56, c: 40 }, { o: 40, c: 44 },
  { o: 44, c: 28 }, { o: 28, c: 33 }, { o: 33, c: 18 }, { o: 18, c: 22 },
  { o: 22, c: 10 }, { o: 10, c: 14 },
];

const ORDER_BOOK = {
  bids: [
    { price: "67,238", size: 0.82 },
    { price: "67,231", size: 0.55 },
    { price: "67,225", size: 0.38 },
    { price: "67,218", size: 0.21 },
  ],
  asks: [
    { price: "67,246", size: 0.44 },
    { price: "67,252", size: 0.61 },
    { price: "67,259", size: 0.29 },
    { price: "67,265", size: 0.17 },
  ],
};

const POSITIONS = [
  { symbol: "BTC/USD", side: "LONG", size: "0.4", pnl: "+$1,284.20", up: true },
  { symbol: "XAU/USD", side: "LONG", size: "2.0 oz", pnl: "+$412.60", up: true },
  { symbol: "NAS100", side: "SHORT", size: "1.5", pnl: "-$96.10", up: false },
];

const traders = [
  {
    id: 1,
    name: "James",
    flag: "🇬🇧",
    challengeSize: "100K Challenge",
    badge: "Paid $2,430",
    badgeType: "gold",
    timeline: [
      { status: "Started Challenge", done: true },
      { status: "Passed Evaluation", done: true },
      { status: "First Payout", done: true },
      { status: "Scaled Account", done: true },
    ]
  },
  {
    id: 2,
    name: "Sarah",
    flag: "🇦🇺",
    challengeSize: "50K Challenge",
    badge: "Funded in 18 Days",
    badgeType: "blue",
    timeline: [
      { status: "Started Challenge", done: true },
      { status: "Failed First Attempt", done: false, failed: true },
      { status: "Retried & Focused", done: true },
      { status: "Passed & Funded", done: true },
    ]
  },
  {
    id: 3,
    name: "Daniel",
    flag: "🇨🇦",
    challengeSize: "25K Challenge",
    badge: "Now Trading 100K",
    badgeType: "gold",
    timeline: [
      { status: "Started Challenge", done: true },
      { status: "Consistent Risk Plan", done: true },
      { status: "Passed Evaluation", done: true },
      { status: "Regular Payouts", done: true },
    ]
  },
  {
    id: 4,
    name: "Elena",
    flag: "🇪🇸",
    challengeSize: "200K Challenge",
    badge: "Paid $5,120",
    badgeType: "gold",
    timeline: [
      { status: "Started Challenge", done: true },
      { status: "Passed Phase 1 & 2", done: true },
      { status: "First Payout", done: true },
      { status: "Compounding Gains", done: true },
    ]
  }
];


/* ------------------------------------------------------------------ */
/*  Count-up hook — used to make the headline numbers feel "live"      */
/* ------------------------------------------------------------------ */

function useCountUp(target, { duration = 1400, start = false, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    let startTime;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return value.toFixed(decimals);
}
const REFRESH_INTERVAL = 20 * 60 * 1000; 

const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);
  const [prices, setPrices] = useState([]);
  const symbols = ["EURUSD", "GBPUSD", "BTCUSD", "XAUUSD"];
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


useEffect(() => {
  let isMounted = true;
  let timerId;

  const fetchPrices = async () => {
    try {
      // 1. Map all symbols to fetch promises to run them IN PARALLEL
      const fetchPromises = SYMBOLS.map(async (symbol) => {
        try {
          const res = await fetch(`https://corsproxy.io/?https://biquote.io/api/${symbol}`);
          if (!res.ok) return null;
          
          const data = await res.json();
          return {
            symbol,
            price: data.bid ?? data.last,
            apiChange: data.change ?? 0,
          };
        } catch (err) {
          console.error(`Error fetching ${symbol}:`, err);
          return null; // Return null so Promise.all doesn't crash completely
        }
      });

      // 2. Wait for all requests to finish together
      const results = await Promise.all(fetchPromises);
      
      // Filter out any failed requests (nulls)
      const validResults = results.filter(item => item !== null);

      if (isMounted && validResults.length > 0) {
        setPrices((prevPrices) =>
          validResults.map((newItem) => {
            const oldItem = prevPrices.find((p) => p.symbol === newItem.symbol);
            const oldPrice = oldItem ? oldItem.price : newItem.price;

            const priceDiff = newItem.price - oldPrice;
            const sessionChangePercent = oldPrice > 0 ? (priceDiff / oldPrice) * 100 : 0;

            return {
              symbol: newItem.symbol,
              price: newItem.price,
              up: newItem.price > oldPrice ? true : newItem.price < oldPrice ? false : (oldItem?.up ?? true),
              change: newItem.apiChange !== 0 ? newItem.apiChange : (priceDiff !== 0 ? sessionChangePercent : (oldItem?.change ?? 0)),
            };
          })
        );

        // 3. Schedule next update cycle in 5 seconds
        timerId = setTimeout(fetchPrices, 5000);
      }
    } catch (globalErr) {
      console.error("Error in fetch cycle:", globalErr);
      if (isMounted) timerId = setTimeout(fetchPrices, 5000); // retry even if it failed
    }
  };

  fetchPrices();

  return () => {
    isMounted = false;
    clearTimeout(timerId);
  };
}, []);





  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const equity = useCountUp(184240.5, { start: mounted, decimals: 2 });
  const consistency = useCountUp(94.8, { start: mounted, decimals: 1 });
  const psychScore = useCountUp(89.2, { start: mounted, decimals: 1 });
  const buffer = useCountUp(94.2, { start: mounted, decimals: 1 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const chartWidth = 500;
  const chartHeight = 130;
  const step = chartWidth / CANDLES.length;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  

  return (
      <section 
      className={`relative min-h-screen overflow-hidden bg-[#07090D] text-white select-none font-sans transition-all duration-500 pb-20 ${
        scrolled ? "pt-16" : "pt-[76px]"
      }`} >
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes soft-float {
          0%, 100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
          50% { transform: translateY(-8px) rotate(var(--rot, 0deg)); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes grow-bar {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .fade-up { animation: fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
        .float-chip { animation: soft-float 5s ease-in-out infinite; }
        .ticker-track { animation: ticker-scroll 32s linear infinite; }
        .candle-grow { transform-origin: bottom; animation: grow-bar 0.6s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      {/* ---------------------------------------------------------- */}
      {/* Market ticker tape — signature element                     */}
      {/* ---------------------------------------------------------- */}
      <div className="relative z-20 w-full border-y border-white/[0.08] bg-black/30 backdrop-blur-xl overflow-hidden">
        <div className="flex whitespace-nowrap ticker-track w-max py-2.5">
          {[...prices, ...prices].map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-6 font-mono text-[11px]"
          >
            <span className="text-gray-500">{t.symbol}</span>
            <span className="text-white">
              {Number(t.price).toFixed(5)}
            </span>

            <span
              className={`flex items-center gap-1 ${
                t.up ? "text-green-400" : "text-red-400"
              }`}
            >
              {t.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {Math.abs(t.change).toFixed(2)}%
            </span>

            <span className="text-gray-700">/</span>
          </div>
        ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* FULL PAGE HERO WRAPPER                                     */}
      {/* ---------------------------------------------------------- */}
       <div className="relative w-full overflow-hidden">
        
        {/* FTMO STYLE BLUE ATMOSPHERE */}
        <div
          className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[160px] opacity-60 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(37,99,235,0.45), rgba(14,165,233,0.15) 40%, transparent 70%)",
          }}
        />

        {/* ---------- Content ---------- */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-28 lg:pt-16 pb-20 sm:pb-28 lg:pb-36 flex flex-col items-center text-center">
          
          {/* ================= Badge ================= */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="group inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 backdrop-blur-md px-3.5 py-1.5 sm:px-4 sm:py-2 hover:border-blue-500/40 transition-all cursor-pointer max-w-full">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
              </span>

              <span className="text-[11px] sm:text-xs font-medium text-blue-300 tracking-wide truncate">
                Built for disciplined traders.
              </span>

              <span className="inline-flex items-center gap-1 text-white text-[11px] sm:text-xs font-semibold group-hover:translate-x-0.5 transition-transform shrink-0">
                Read Manifesto
                <ArrowRight size={12} />
              </span>
            </div>
          </div>

          {/* ================= Floating Cards & Headline Wrapper ================= */}
          <div className="relative w-full flex justify-center">
            
            {/* Floating Card Left */}
            <div className="hidden lg:flex absolute left-[-30px] xl:left-[-60px] top-10 rounded-2xl border border-white/10 bg-[#11131F]/80 backdrop-blur-xl px-4 py-3 items-center gap-3 shadow-2xl float-chip">
              <Wallet className="text-purple-400" size={16} />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Capital Upto
                </p>
                <p className="text-sm font-semibold text-white">$200,000</p>
              </div>
            </div>

            {/* Floating Card Right */}
            <div
              className="hidden lg:flex absolute right-[-30px] xl:right-[-60px] top-20 rounded-2xl border border-white/10 bg-[#11131F]/80 backdrop-blur-xl px-4 py-3 items-center gap-3 shadow-2xl float-chip"
              style={{ animationDelay: "1.2s" }}
            >
              <Zap className="text-cyan-400" size={16} />
              <div className="text-left">
                <p className="text-[10px] uppercase tracking-widest text-gray-500">
                  Fast Payout
                </p>
                <p className="text-sm font-semibold text-white">4h 18m</p>
              </div>
            </div>

            {/* ================= Headline ================= */}
            <h1
              className="
                font-black
                text-4xl font-semibold lg:text-8xl
                leading-[0.9]
                tracking-[-0.055em]
                max-w-6xl
                mx-auto
                bg-gradient-to-b
                from-white
                via-slate-100
                to-slate-300
                bg-clip-text
                text-transparent
              "
            >
              Become a{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Funded Trader.
              </span>
            </h1>
          </div>

          {/* ================= Subtitle ================= */}
          <p className="mt-6 sm:mt-8 text-lg sm:text-xl lg:text-2xl text-gray-300 font-medium max-w-2xl px-2">
            Professional capital. Professional discipline.
          </p>

          {/* ================= Description ================= */}
          <p className="mt-6 sm:mt-10 lg:mt-12 max-w-3xl text-sm sm:text-base lg:text-lg leading-6 sm:leading-7 lg:leading-8 text-gray-400 px-2">
            Trade up to <span className="font-semibold text-white">$200,000</span>{" "}
            with transparent rules, institutional-grade technology, and fast
            payouts designed for serious traders.
          </p>

          {/* ================= CTA Buttons ================= */}
          <div className="mt-8 sm:mt-12 lg:mt-14 flex flex-col sm:flex-row gap-3.5 sm:gap-4 w-full sm:w-auto px-4 sm:px-0 justify-center items-center">
            <button
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                px-6
                sm:px-9
                py-4
                sm:py-5
                font-semibold
                text-white
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                transition-all
                hover:scale-[1.02]
                hover:shadow-[0_15px_45px_rgba(59,130,246,0.35)]
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
              "
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" /> 
              <span
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("challenges");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }}
               className="relative flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base">
                Start Challenge — $49
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </button>

            <button
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                px-6
                sm:px-9
                py-4
                sm:py-5
                font-semibold
                text-gray-300
                transition-all
                hover:border-white/20
                hover:bg-white/[0.05]
                w-full
                sm:w-auto
                flex
                items-center
                justify-center
              "
            >
              <span className="flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base">
                <Lock size={16} />
                View Live Terminal
              </span>
            </button>
            
          </div>
        </div>
       </div>
       <section className="relative w-full bg-[#030303] text-white py-5 px-6 md:px-12 overflow-hidden select-none">
      
      {/* Top Fading Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-16 lg:gap-20 text-[13px] font-medium text-zinc-300 tracking-wide">
        
        {/* Item 1 */}
        <div className="flex items-center gap-2.5">
          <svg className="w-3.5 h-3.5 text-[#0066ff] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Zero Hidden Rules</span>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-2.5">
          <svg className="w-3.5 h-3.5 text-[#0066ff] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Automated 24h Payouts</span>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-2.5">
          <svg className="w-3.5 h-3.5 text-[#0066ff] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>24/7 Human Support</span>
        </div>

        {/* Item 4 */}
        <div className="flex items-center gap-2.5">
          <svg className="w-3.5 h-3.5 text-[#0066ff] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Built In-house</span>
        </div>

      </div>

      {/* Bottom Fading Gradient Border */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
      
       </section>
        {/* ------------------------------------------------------ */}
        {/* Live terminal — matches the AUDCHF_M5 mockup card style  */} 
        <LiveTradingTerminal />

      {/* ------------------------------------------------------------ */}
    </section>
  );
} 