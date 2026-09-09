import React, { useState } from 'react';

export default function StartChallengeSection() {
  const [activeMetric, setActiveMetric] = useState('equity');
  const [isHovered, setIsHovered] = useState(false);

  const valueProps = [
    { text: "As many Free Trials as you need", dynamicBadge: "Unlimited Practice" },
    { text: "Up to $200,000 baseline configurations", dynamicBadge: "Scalable Capital" },
    { text: "No artificial time limit execution restrictions", dynamicBadge: "Trade Your Pace" }
  ];

  const historicalDataPoints = [
    { label: "Jan", balance: 200000 },
    { label: "Feb", balance: 204500 },
    { label: "Mar", balance: 202100 },
    { label: "Apr", balance: 215400 },
    { label: "May", balance: 211000 },
    { label: "Jun", balance: 226335 }
  ];

  return (
    <section className="dark bg-[#090A0F] py-10 md:py-32 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative">
      {/* Immersive layered macro-ambient lighting arrangements */}
      <div className="absolute right-10 top-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none select-none animate-pulse" />
      <div className="absolute left-1/4 bottom-10 w-96 h-96 bg-indigo-500/5 rounded-full blur-[110px] pointer-events-none select-none" />

      {/* Structured core bounding container optimized strictly to 1224px viewport footprint */}
      <div className="container mx-auto max-w-[1224px] space-y-16 relative z-10">
        
        {/* Main Master Hero Interactive Split-Console */}
        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-br from-[#111322] via-[#0C0D16] to-[#08090F] rounded-3xl border border-gray-800/80 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.85)] group transition-all duration-700 hover:border-blue-500/30"
        >
          {/* Hardware-Accelerated Dynamic Edge Tracking Highlight rule */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Dynamic Grid Background Texture Layer */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] opacity-60 mix-blend-overlay pointer-events-none" />

          {/* LEFT PANEL: Core Contextual Copy & High-Intent Conversion Triggers */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start space-y-8 relative z-10">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
                🚀 Evaluation Gateways Open
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Start Your <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Challenge Today
                </span>
              </h2>
            </div>

            {/* Performance Checklist Matrix with dynamic layout badges */}
            <ul className="w-full space-y-4">
              {valueProps.map((prop, index) => (
                <li key={index} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-gray-900 bg-black/20 backdrop-blur-sm group/item hover:border-gray-800 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover/item:bg-blue-500/20 group-hover/item:border-blue-400 transition-all duration-300">
                      <svg className="w-3 h-3 text-blue-400 fill-none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm text-gray-300 font-medium tracking-wide group-hover/item:text-white transition-colors duration-300">
                      {prop.text}
                    </span>
                  </div>
                  <span className="self-start sm:self-center text-[9px] font-mono font-bold bg-white/5 text-gray-500 px-2 py-0.5 rounded border border-white/5 uppercase tracking-wider">
                    {prop.dynamicBadge}
                  </span>
                </li>
              ))}
            </ul>

            {/* Dual Premium Conversion Direct Actions Tier */}
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button className="flex-1 sm:flex-initial flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[size:200%_auto] hover:bg-right text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-blue-950/50 hover:shadow-cyan-500/20 active:scale-[0.98] transition-all duration-500 group/btn">
                <span>Start Challenge Node</span>
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-1" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <button className="px-6 py-4 rounded-xl bg-[#121422] hover:bg-[#181B2F] border border-gray-800 hover:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-300 text-center">
                Initialize Free Trial
              </button>
            </div>

          </div>

          {/* RIGHT PANEL: Embedded High-Investment Live Analytical Dashboard Terminal Mock */}
          <div className="lg:col-span-6 bg-slate-950/40 p-6 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-gray-800/60 flex flex-col justify-center relative overflow-hidden min-h-[400px]">
            
            {/* Interactive Analytical Header Panel */}
            <div className="bg-[#0E101A]/90 border border-gray-800/80 rounded-2xl p-5 shadow-2xl relative z-10 space-y-4 backdrop-blur-md">
              
              {/* Window Controls UI Header Element */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-900">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                  <span className="ml-2 font-mono text-[10px] text-gray-500 tracking-wider">ACG_METRIC_ENGINE_V4.9</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveMetric('equity')}
                    className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-all ${
                      activeMetric === 'equity' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Equity
                  </button>
                  <button 
                    onClick={() => setActiveMetric('objectives')}
                    className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-all ${
                      activeMetric === 'objectives' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Objectives
                  </button>
                </div>
              </div>

              {activeMetric === 'equity' ? (
                /* VIEW A: Interactive Balance Progression Sparkline Console */
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Account Matrix Balance</p>
                      <h4 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight mt-0.5">$226,335.70</h4>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+13.16%</span>
                      <p className="text-[9px] text-gray-600 mt-1">Current Run</p>
                    </div>
                  </div>

                  {/* High-fidelity Vector Curve Component Asset */}
                  <div className="h-28 relative mt-2 w-full">
                    <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Gradient Fill Path */}
                      <path d="M 0 100 Q 80 80 150 90 T 300 30 T 450 40 L 500 15 L 500 120 L 0 120 Z" fill="url(#area-grad)" />
                      {/* Crisp Foreground Indicator Guideline */}
                      <path d="M 0 100 Q 80 80 150 90 T 300 30 T 450 40 L 500 15" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
                      {/* Dynamic Target Hub Indicator Node */}
                      <circle cx="500" cy="15" r="4" fill="#22d3ee" className="animate-ping" />
                      <circle cx="500" cy="15" r="2.5" fill="#3b82f6" />
                    </svg>
                  </div>
                </div>
              ) : (
                /* VIEW B: Real-time Rule Check Compliance Telemetry Dashboard */
                <div className="space-y-3 animate-fadeIn py-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono"><span className="text-gray-400">Profit Target Metric</span><span className="text-emerald-400 font-bold">100% Passed</span></div>
                    <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden"><div className="w-full h-full bg-emerald-500" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono"><span className="text-gray-400">Max Daily Drawdown Perimeter</span><span className="text-blue-400 font-bold">0.84% / 5% Limit</span></div>
                    <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden"><div className="w-[17%] h-full bg-blue-500" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono"><span className="text-gray-400">Minimum Execution Allotment</span><span className="text-indigo-400 font-bold">4 / 4 Days Met</span></div>
                    <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden"><div className="w-full h-full bg-indigo-500" /></div>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Background Ambient Grid Glow Floating Overlay */}
            <div className={`absolute bottom-6 left-6 right-6 bg-[#121526]/50 border border-gray-800/40 p-3.5 rounded-xl flex justify-between items-center backdrop-blur-md transition-all duration-700 transform ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-40'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-[11px] font-mono font-medium text-gray-300">Routing Mode: Institutional Aggregation</p>
              </div>
              <span className="text-[9px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-gray-500">SECURE NODE</span>
            </div>

          </div>

        </div>

        {/* TRIPLE SUB-PANEL FOOTER: Credibility Metrics Matrix Frame */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full border-t border-gray-900 pt-12">
          <div className="space-y-2 group/metric">
            <h4 className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-blue-500 rounded-full" /> Scaled Ecosystem
            </h4>
            <div className="text-3xl font-black font-mono text-white group-hover/metric:text-blue-400 transition-colors duration-300">
              3.5M+ <span className="text-xs font-sans font-normal text-gray-500 block sm:inline ml-0 sm:ml-1">Traders Engaged</span>
            </div>
            <p className="text-xs text-gray-500 leading-normal font-normal">
              Empowering day, swing, and algorithmic systematic traders globally.
            </p>
          </div>

          <div className="space-y-2 group/metric">
            <h4 className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-cyan-400 rounded-full" /> Capital Dispatched
            </h4>
            <div className="text-3xl font-black font-mono text-white group-hover/metric:text-cyan-400 transition-colors duration-300">
              $500M+ <span className="text-xs font-sans font-normal text-gray-500 block sm:inline ml-0 sm:ml-1">Paid in Rewards</span>
            </div>
            <p className="text-xs text-gray-500 leading-normal font-normal">
              High-velocity scale infrastructure distribution engine running uninterrupted.
            </p>
          </div>

          <div className="space-y-2 group/metric">
            <h4 className="text-xs font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-2">
              <span className="w-1 h-1 bg-indigo-400 rounded-full" /> Audited Validation
            </h4>
            <div className="text-3xl font-black font-mono text-white group-hover/metric:text-indigo-400 transition-colors duration-300">
              4.8 / 5 <span className="text-xs font-sans font-normal text-gray-500 block sm:inline ml-0 sm:ml-1">Trustpilot Core</span>
            </div>
            <p className="text-xs text-gray-500 leading-normal font-normal">
              Industry leading customer satisfaction rating score matrix framework.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}