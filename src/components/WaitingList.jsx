import React, { useState, useEffect } from "react"; 
import acg from '../assets/ACG.png';



const country = "Malta";
const countryFlag = "🇲🇹";

const STATS = [
  { label: "Countries Launching Soon", value: "18" },
  { label: "Priority Members", value: "2,000+" },
  { label: "Platform Readiness", value: "98%" },
  { label: "Avg. Invite Time", value: "< 7 Days" },
];

const CHALLENGES = [
  { size: "$5K", target: "8%", daily: "5%", max: "10%", platform: "MT4, MT5" },
  { size: "$10K", target: "8%", daily: "5%", max: "10%", platform: "MT4, MT5" },
  { size: "$25K", target: "8%", daily: "5%", max: "10%", platform: "MT4, MT5, cTrader" },
  { size: "$50K", target: "8%", daily: "5%", max: "10%", platform: "MT4, MT5, cTrader" },
];

const FEATURES = [
  {
    icon: "zap",
    title: "Instant Notification",
    description: "Receive an alert the exact millisecond challenges open in your region.",
  },
  {
    icon: "shield",
    title: "Priority Queue",
    description: "Waitlist members are guaranteed allocation ahead of the general public.",
  },
  {
    icon: "activity",
    title: "Platform Telemetry",
    description: "Receive transparent, behind-the-scenes engineering and rollout updates.",
  },
];

const CHALLENGE_OPTIONS = ["5K", "10K", "25K", "50K", "100K"];

// ── Ultra-minimalist stroke icons (Lucide-style) ──────────────────────────
function Icon({ name, className = "w-4 h-4" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5, // Thinner, more premium stroke
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "arrow-right":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      );
    case "map-pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "zap":
      return (
        <svg {...common}>
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "spinner":
      return (
        <svg {...common} className={`${className} animate-spin`}>
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      );
    case "chevron-down":
      return (
        <svg {...common}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      );
    default:
      return null;
  }
}

const getFlagEmoji = (countryCode) => {
  if (!countryCode) return "🌍";
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0))
  );
};

export default function WaitingList() {
 const [location, setLocation] = useState({
    country: "Detecting region...",
    flag: "🌍",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    country: "...",
    challenge: "25K",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 2. Event Handlers
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const scrollToForm = () => {
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 3. Fetch Geo-Location on Mount
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) throw new Error("Failed to fetch geolocation");
        
        const data = await response.json();
        const detectedCountry = data.country_name || "Unknown Region";
        const detectedFlag = getFlagEmoji(data.country_code);

        setLocation({
          country: detectedCountry,
          flag: detectedFlag,
        });

        setFormData((prev) => ({
          ...prev,
          country: detectedCountry,
        }));
      } catch (error) {
        console.error("Location detection blocked or failed:", error);
        setLocation({ country: "Global", flag: "🌍" });
        setFormData((prev) => ({ ...prev, country: "Global" }));
      }
    };

    fetchLocation();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#05060A] font-sans text-slate-300 antialiased selection:bg-[#2E6BFF]/30 selection:text-white">
      {/* ── Keyframe Animations ────────────────────────────────────────── */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>

      {/* ── Minimalist Background Elements ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 flex justify-center overflow-hidden">
        {/* Subtle top ambient light (Vercel style) */}
        <div className="absolute -top-[20%] w-[800px] h-[400px] bg-[#2E6BFF]/10 blur-[120px] rounded-full opacity-50" />
        {/* Extremely faint structural grid (Linear style) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* ── Top Navigation Bar (Implied) ───────────────────────────────── */}
      <header className="relative z-10 flex h-16 items-center justify-between border-b border-white/[0.06] px-6 sm:px-12 bg-[#05060A]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 font-semibold text-white tracking-tight text-sm">
          
          <img src={acg} width={80} />
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="hidden sm:inline-block">Status: Rolling Out</span>
          <div className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]" />
            <span className="text-white">{location.country}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-32 pt-20 sm:pt-32">
        
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="animate-fade-in-up flex flex-col items-center text-center opacity-0">
          <a
            href="#waitlist-form"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#2E6BFF]/30 bg-[#2E6BFF]/10 px-3 py-1 text-xs font-medium text-[#2E6BFF] transition-colors hover:bg-[#2E6BFF]/20"
          >
            <span>{location.flag} {location.country} allocation pending</span>
            <Icon name="arrow-right" className="h-3 w-3" />
          </a>

          <h1 className="max-w-3xl text-5xl font-semibold tracking-tighter text-white sm:text-7xl">
            Built for disciplined <br className="hidden sm:block" />
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              global traders.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base text-slate-400 sm:text-lg sm:leading-relaxed">
            Trading challenges are currently staging for deployment in your region. Join the priority waitlist to secure your allocation the exact moment we go live in <span className="text-white font-medium">{country}</span>.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <button
              onClick={scrollToForm}
              className="group flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-6 text-sm font-medium text-black transition-all hover:bg-slate-200 active:scale-[0.98]"
            >
              Secure Early Access
            </button>
            <button
              onClick={() => document.getElementById("challenges")?.scrollIntoView({ behavior: "smooth" })}
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.02] px-6 text-sm font-medium text-white transition-all hover:bg-white/[0.04] active:scale-[0.98]"
            >
              View Allocations
            </button>
          </div>
        </section>

        {/* ── METRICS (Linear Style) ───────────────────────────────────── */}
        <section className="animate-fade-in-up delay-100 mt-24 opacity-0 border-y border-white/[0.06] bg-white/[0.01]">
          <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] sm:grid-cols-4 sm:divide-y-0">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-6 sm:p-8 flex flex-col items-center text-center">
                <div className="text-3xl font-semibold tracking-tight text-white">{stat.value}</div>
                <div className="mt-1 text-xs font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CHALLENGES DATA TABLE ────────────────────────────────────── */}
        <section id="challenges" className="animate-fade-in-up delay-200 mt-32 opacity-0">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Challenge Allocations</h2>
              <p className="mt-1 text-sm text-slate-400">Target metrics for upcoming regional accounts.</p>
            </div>
            <div className="text-xs text-slate-500 font-mono">Platform v2.0</div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0A0C12]">
            <div className="grid grid-cols-5 border-b border-white/[0.08] bg-white/[0.02] px-6 py-3 text-xs font-medium text-slate-400">
              <div className="col-span-1">Account Size</div>
              <div className="col-span-1">Profit Target</div>
              <div className="col-span-1">Daily Limit</div>
              <div className="col-span-1">Max Drawdown</div>
              <div className="col-span-1 text-right">Platforms</div>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {CHALLENGES.map((c) => (
                <div
                  key={c.size}
                  className="grid grid-cols-5 items-center px-6 py-4 text-sm transition-colors hover:bg-white/[0.02]"
                >
                  <div className="col-span-1 font-semibold text-white">{c.size}</div>
                  <div className="col-span-1 text-slate-300">{c.target}</div>
                  <div className="col-span-1 text-slate-300">{c.daily}</div>
                  <div className="col-span-1 text-slate-300">{c.max}</div>
                  <div className="col-span-1 text-right text-xs text-slate-500">{c.platform}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ────────────────────────────────────────────── */}
        <section className="animate-fade-in-up delay-300 mt-32 opacity-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.01] p-6 transition-colors hover:border-white/[0.1] hover:bg-white/[0.02]"
              >
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-[#0A0C12] text-slate-300">
                  <Icon name={f.icon} className="h-4 w-4" />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WAITLIST FORM (Vercel Style Card) ────────────────────────── */}
        <section id="waitlist-form" className="animate-fade-in-up mt-32 scroll-mt-32 opacity-0">
          <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0A0C12] shadow-2xl">
            {/* Minimalist Card Header */}
            <div className="border-b border-white/[0.08] bg-white/[0.02] px-8 py-6">
              <h2 className="text-lg font-semibold text-white">Join the Waitlist</h2>
              <p className="mt-1 text-sm text-slate-400">Priority access for {country}.</p>
            </div>

            <div className="p-8">
              {isSubmitted ? (
                <div className="flex flex-col items-center py-6 text-center animate-fade-in-up">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]">
                    <Icon name="check" className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">Allocation Reserved</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    You're on the list. We'll notify you via email the moment infrastructure is ready in {country}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="space-y-4">
                    <Field label="First Name">
                      <input
                        type="text"
                        required
                        placeholder="e.g. John"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                        className={inputClasses}
                      />
                    </Field>

                    <Field label="Email Address">
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange("email")}
                        className={inputClasses}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Region">
                        <input
                          type="text"
                          readOnly
                          value={formData.country}
                          className={`${inputClasses} cursor-not-allowed text-slate-500 bg-white/[0.02]`}
                        />
                      </Field>

                      <Field label="Target Account">
                        <div className="relative">
                          <select
                            value={formData.challenge}
                            onChange={handleChange("challenge")}
                            className={`${inputClasses} appearance-none pr-10`}
                          >
                            {CHALLENGE_OPTIONS.map((opt) => (
                              <option key={opt} value={opt} className="bg-[#05060A] text-slate-300">
                                ${opt}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                            <Icon name="chevron-down" className="h-4 w-4" />
                          </div>
                        </div>
                      </Field>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white text-sm font-medium text-black transition-all hover:bg-slate-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Icon name="spinner" className="h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      "Secure Position"
                    )}
                  </button>
                  
                  <p className="text-center text-xs text-slate-500">
                    Your data is encrypted and stored securely.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#05060A]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row text-xs text-slate-500">
          <div className="flex items-center gap-2 font-semibold text-slate-300">
            
            <img src={acg} width={120} />
          </div>
          <p>© {new Date().getFullYear()} ACG Funding. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ── Shared UI Helpers ─────────────────────────────────────────────────────

const inputClasses =
  "h-10 w-full rounded-md border border-white/[0.1] bg-transparent px-3 text-sm text-white placeholder-slate-600 outline-none transition-colors hover:border-white/[0.2] focus:border-[#2E6BFF] focus:ring-1 focus:ring-[#2E6BFF] focus:bg-[#2E6BFF]/[0.02]";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-slate-400">{label}</label>
      {children}
    </div>
  );
}