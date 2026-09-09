import React, { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const footerLinks = {
    ecosystem: [
      { label: "2-Step Evaluation", href: "#" },
      { label: "1-Step Evaluation", href: "#" },
      { label: "Scaling Framework", href: "#" },
      { label: "Trading Platforms", href: "#" },
      { label: "Institutional API", href: "#" }
    ],
    analytics: [
      { label: "Performance Matrix", href: "#" },
      { label: "Trading Academy", href: "#" },
      { label: "Leaderboard Stream", href: "#" },
      { label: "Economic Calendar", href: "#" }
    ],
    firm: [
      { label: "About ACG Desk", href: "#" },
      { label: "Careers Portal", href: "#" },
      { label: "Press & Media", href: "#" },
      { label: "Security Perimeter", href: "#" }
    ],
    legal: [
      { label: "Terms of Service", href: "#" },
      { label: "Risk Disclosure", href: "#" },
      { label: "Privacy Blueprint", href: "#" },
      { label: "Cookie Mapping", href: "#" }
    ]
  };

  return (
    <footer className="dark bg-[#06070B] border-t border-gray-900 pt-20 pb-8 px-4 sm:px-8 lg:px-16 font-sans relative overflow-hidden">
      {/* Background Micro-Illumination Nodes */}
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none select-none" />
      <div className="absolute left-10 bottom-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-[90px] pointer-events-none select-none" />

      {/* Structured core bounding container exactly matching 1224px viewport limits */}
      <div className="container mx-auto max-w-[1224px] space-y-16 relative z-10">
        
        {/* TOP PANEL: Brand Positioning & Newsletter Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-12 border-b border-gray-900">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-sm text-white shadow-md shadow-blue-950">
                A
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                ACG<span className="text-blue-500">.</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm font-normal">
              Next-generation algorithmic liquidity evaluation frameworks. Providing global systematic traders with decentralized allocation access across highly optimized virtual parameters.
            </p>
          </div>

          {/* Premium Newsletter Terminal Widget */}
          <div className="lg:col-span-7 w-full lg:max-w-md lg:ml-auto space-y-3">
            <p className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
              // Intel Distribution System
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center bg-[#0E101A] border border-gray-800 rounded-xl p-1.5 focus-within:border-blue-500/50 transition-all group">
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter authorized operative email..." 
                className="w-full bg-transparent px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white uppercase tracking-wider transition-all duration-300 whitespace-nowrap active:scale-95 shadow-md"
              >
                {subscribed ? "Nodes Armed" : "Join Matrix"}
              </button>
            </form>
            <p className="text-[10px] text-gray-500 font-mono">
              Receive live optimization updates, risk desk briefs, and structural matrix releases.
            </p>
          </div>

        </div>

        {/* CENTER PANEL: Hyper-Categorized Navigation Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-4 w-full">
          
          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-blue-500 rounded-full" /> Capital Models
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.ecosystem.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-xs text-gray-500 hover:text-white transition-colors duration-200 font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-cyan-400 rounded-full" /> Terminal Tools
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.analytics.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-xs text-gray-500 hover:text-white transition-colors duration-200 font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-indigo-400 rounded-full" /> Institution
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.firm.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-xs text-gray-500 hover:text-white transition-colors duration-200 font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-purple-500 rounded-full" /> Protocols
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-xs text-gray-500 hover:text-white transition-colors duration-200 font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* BOTTOM PANEL: Heavy Institutional Risk Disclosure & Legal Infrastructure */}
        <div className="pt-8 border-t border-gray-900 space-y-6">
          
          {/* Strict Proprietary Industry Risk Notice */}
          <div className="p-4 rounded-xl bg-[#090A10] border border-gray-900/60 text-[10px] sm:text-[11px] text-gray-500 leading-relaxed font-normal space-y-2">
            <span className="font-bold text-gray-400 block uppercase font-mono tracking-wider">⚠️ Institutional Risk Disclosure & Regulatory Disclaimer</span>
            <p>
              All products, accounts, and simulation parameters provided by ACG are purely virtual configurations designed for performance evaluation metrics. Any simulated balances, data feeds, or performance metrics shown inside this portal are entirely simulated and do not correspond to live cash deployments, deposits, or retail brokerage balances. Pass actions do not guarantee future live performance parameters.
            </p>
            <p>
              ACG does not act as a financial custodian, licensed broker-dealer, or investment advisory desk. Access to performance credit metrics is subject to territorial validation compliance and specific risk tier regulations within your respective jurisdiction.
            </p>
          </div>

          {/* Copyright and Live Environment Status Baseline */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-gray-600">
            <div>
              © {new Date().getFullYear()} ACG Ecosystem Inc. All proprietary simulation protocols reserved.
            </div>
            
            {/* Live Operational Ticker */}
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span>ALL COMPLIANCE SCHEMAS ACTIVE</span>
              </div>
              <span className="text-gray-800">|</span>
              <span>TLS 1.3 SECURE</span>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}