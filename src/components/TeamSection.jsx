import React, { useState } from 'react';

export default function TeamSection() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeNode, setActiveNode] = useState(null);

  // High-investment tracking nodes to make the background map feel "alive"
  const mapHotspots = [
    { id: 1, top: '25%', left: '20%', label: 'London Desk — Active' },
    { id: 2, top: '45%', left: '55%', label: 'Dubai Hub — Active' },
    { id: 3, top: '35%', left: '78%', label: 'Singapore Desk — Active' },
  ];

  return (
    <section className="dark bg-[#090A0F] py-24 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative">
      {/* High-fidelity ambient dynamic light rings */}
      <div className="absolute left-1/3 top-10 w-[600px] h-96 bg-gradient-to-r from-blue-500/10 to-indigo-500/5 rounded-full blur-[150px] pointer-events-none select-none animate-pulse" />
      <div className="absolute right-1/4 bottom-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Structured core bounding frame constrained to exactly 1224px max width */}
      <div className="container mx-auto max-w-[1224px] space-y-6 relative z-10">
        
        {/* Main Immersive Hero Showcase Banner Panel */}
        <div className="relative w-full rounded-3xl border border-gray-800/80 bg-gradient-to-b from-[#11131F]/40 to-[#0A0B10]/95 backdrop-blur-md overflow-hidden min-h-[540px] shadow-[0_0_50px_rgba(0,0,0,0.8)] group transition-all duration-500 hover:border-gray-700/60 flex flex-col justify-between">
          
          {/* Subtle Top-edge Tracking Accent Rule */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Interactive Absolute Background Visual Workspace */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity group-hover:opacity-50 transition-all duration-700">
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80" 
              alt="Global Operations network topography canvas" 
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
              loading="lazy"
            />
            {/* Ambient vignette shield mask */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#090A0F]/60 via-[#11131F]/40 to-[#0A0C12]" />
          </div>

          {/* Live Infrastructure Map Hotspots */}
          <div className="absolute inset-0 z-10 hidden sm:block">
            {mapHotspots.map((node) => (
              <div 
                key={node.id}
                className="absolute transition-all duration-300"
                style={{ top: node.top, left: node.left }}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                <div className="relative flex items-center justify-center cursor-pointer">
                  <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-blue-400 opacity-40" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                  
                  {/* Glassmorphic tooltip popover overlay */}
                  <div className={`absolute bottom-6 whitespace-nowrap bg-[#121424]/90 border border-blue-500/30 backdrop-blur-md text-[10px] font-mono text-gray-200 px-2.5 py-1 rounded-md shadow-xl transition-all duration-300 ${
                    activeNode === node.id ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-1 scale-95 pointer-events-none'
                  }`}>
                    {node.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contextual Floating Branding Data Matrix Layer */}
          <div className="relative z-20 w-full flex flex-col items-center text-center px-6 pt-16 max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
              🌐 Institutional Ecosystem
            </div>

            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              People of <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">ACG</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-md font-normal">
              Our modern algorithmic prop system grew from a tight circle of disciplined scale-traders, 
              deploying decentralized operations across unified target desks globally.
            </p>

            {/* Premium CTA Row Interface Wrapper */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto pt-2">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-blue-950/50 hover:shadow-blue-600/20 active:scale-[0.98] transition-all duration-300">
                Explore Enterprise Core
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#11131F] hover:bg-[#161828] border border-gray-800 hover:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-300">
                Careers Framework
                <span className="text-[10px]">→</span>
              </button>
            </div>
          </div>

          {/* Integrated Live Environment Footer Mock */}
          <div className="w-full bg-[#11131F]/30 backdrop-blur-sm border-t border-gray-900 px-6 py-4 relative z-20 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-mono text-gray-500">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span>ACG Central Node Stream: Connected</span>
            </div>
            <div className="flex items-center gap-4">
              <span>LATENCY: 12ms</span>
              <span className="hidden sm:inline text-gray-800">|</span>
              <span>REDUNDANCY: 99.99%</span>
            </div>
          </div>

        </div>

        {/* Triple Column High-Investment Data Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          
          {/* CARD 01: Since 2022 Performance Metrics */}
          <div 
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative bg-gradient-to-b from-[#11131F]/50 to-[#0C0D14]/90 border border-gray-800/80 rounded-2xl p-6 overflow-hidden flex flex-col justify-between items-start min-h-[140px] group/card transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/10"
          >
            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                Operational Genesis
              </div>
              <div className="text-3xl font-black font-mono tracking-tight text-white group-hover/card:text-blue-400 transition-colors duration-300">
                2022
              </div>
            </div>
            
            {/* Real-time SVG Sparkline Graph Simulation Asset */}
            <div className="absolute right-0 bottom-0 left-0 h-16 pointer-events-none opacity-20 group-hover/card:opacity-35 transition-opacity duration-300">
              <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,25 Q15,10 30,22 T60,5 T90,18 L100,10 L100,30 L0,30 Z" fill="url(#gradient-blue)" stroke="#3b82f6" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3b82f6" stopOpacity="1" />
                    <stop offset="1" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* CARD 02: Team Profile Silhouette Layer Matrix */}
          <div 
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative bg-gradient-to-b from-[#11131F]/50 to-[#0C0D14]/90 border border-gray-800/80 rounded-2xl p-6 overflow-hidden flex flex-col justify-between items-start min-h-[140px] group/card transition-all duration-300 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/10"
          >
            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">
                <span className="w-1 h-1 rounded-full bg-indigo-400" />
                Seat Allocation
              </div>
              <div className="text-3xl font-black font-mono tracking-tight text-white group-hover/card:text-indigo-400 transition-colors duration-300">
                300+
              </div>
            </div>

            {/* High-Investment Live Status Avatar Mock Assembly */}
            <div className="absolute right-6 bottom-4 flex items-center -space-x-2.5 opacity-40 group-hover/card:opacity-75 transition-all duration-500 scale-100 group-hover/card:scale-105 origin-right">
              <div className="w-8 h-8 rounded-full border border-[#090A0F] bg-gray-800 flex items-center justify-center text-[9px] font-mono font-bold text-gray-400">LN</div>
              <div className="w-8 h-8 rounded-full border border-[#090A0F] bg-gray-700 flex items-center justify-center text-[9px] font-mono font-bold text-gray-300 z-10">DXB</div>
              <div className="w-8 h-8 rounded-full border border-[#090A0F] bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-[8px] font-mono font-bold text-white z-20 shadow-lg shadow-indigo-950">💻</div>
            </div>
          </div>

          {/* CARD 03: Global Reach Network Topography Asset */}
          <div 
            onMouseEnter={() => setHoveredCard(3)}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative bg-gradient-to-b from-[#11131F]/50 to-[#0C0D14]/90 border border-gray-800/80 rounded-2xl p-6 overflow-hidden flex flex-col justify-between items-start min-h-[140px] group/card transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/10"
          >
            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold tracking-widest text-gray-500">
                <span className="w-1 h-1 rounded-full bg-cyan-400" />
                Data Transit Perimeter
              </div>
              <div className="text-3xl font-black font-mono tracking-tight text-white group-hover/card:text-cyan-400 transition-colors duration-300">
                140+
              </div>
            </div>

            {/* Custom abstract tracking globe wireframe asset mockup */}
            <div className="absolute right-6 bottom-3 w-12 h-12 rounded-full border border-dashed border-gray-800 flex items-center justify-center opacity-30 group-hover/card:opacity-60 group-hover/card:rotate-45 transition-all duration-700">
              <div className="w-8 h-8 rounded-full border border-dotted border-gray-700 flex items-center justify-center animate-spin-[spin_12s_linear_infinite]">
                <div className="w-4 h-4 rounded-full bg-cyan-500/10 border border-cyan-500/20" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}