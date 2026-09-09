import React, { useState } from 'react';

export default function AcademySection() {
  // Simulates an active course module hover/selection state to make the UI feel alive
  const [activeModule, setActiveModule] = useState(0);

  const learningObjectives = [
    "Expand your trading knowledge",
    "Perfect for beginners and intermediate traders",
    "Includes the Trading Psychology Course"
  ];

  const previewModules = [
    { title: "Module 1: Market Structure Principles", duration: "45 mins", level: "Beginner" },
    { title: "Module 2: Advanced Order Flow & Liquidity", duration: "1 hr 15 mins", level: "Intermediate" },
    { title: "Module 3: Elite Psychological Frameworks", duration: "50 mins", level: "Advanced" }
  ];

  return (
    <section id="academy" className="dark bg-[#090A0F] py-20 md:py-28 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative">
      {/* Premium layered ambient light sources */}
      <div className="absolute left-10 top-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none select-none animate-pulse" />
      <div className="absolute right-10 bottom-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none select-none" />
      
      {/* Constrained to exact 1224px max width layout footprint */}
      <div className="container mx-auto max-w-[1224px] relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col justify-start items-center w-full gap-4 pb-16 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] font-mono font-bold tracking-widest text-blue-400 uppercase">
            ⚡ ACG Knowledge Hub
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Elevate Your Trading with{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              ACG Forex Academy
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xl">
            Learn with ACG Academy, gain inspiration from our YouTube channels, 
            and connect with thousands of algorithmic and manual traders globally.
          </p>
        </div>

        {/* Master Showcase Layout Box */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 md:min-h-[720px] bg-gradient-to-b from-[#11131F]/60 to-[#0C0D14]/90 rounded-3xl border border-gray-800/80 overflow-hidden group transition-all duration-500 hover:border-gray-700/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          {/* Subtle Top-edge Linear Highlight Glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* LEFT FLANK: High-investment interactive platform workspace panel */}
          <div className="relative order-1 lg:col-span-7 min-h-[380px] sm:min-h-[480px] lg:h-full bg-slate-950/40 border-b lg:border-b-0 lg:border-r border-gray-800/60 p-4 sm:p-8 flex flex-col justify-center items-center overflow-hidden">
            
            {/* Soft background glow within the visual workspace frame */}
            <div className="absolute inset-0 bg-radial-gradient from-blue-600/5 via-transparent to-transparent opacity-60" />

            {/* Core Cinematic Video Backdrop Wrapper */}
            <div className="relative w-full max-w-[560px] aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/80 group/video">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" 
                alt="ACG Academy Video Preview" 
                className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105 group-hover/video:scale-100 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Premium Floating Center Play Trigger */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-400/30 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/video:scale-110 group-hover/video:bg-white group-hover/video:text-black text-blue-400">
                  <svg className="w-5 h-5 fill-current ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Live Lesson Overlay Watermark Indicator */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black/60 backdrop-blur-md border border-white/5 p-2.5 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <p className="text-[11px] font-mono font-medium text-gray-300 tracking-wide truncate max-w-[200px] sm:max-w-none">
                    Previewing: Trading Psychology Mastery
                  </p>
                </div>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-gray-400">03:42 / 52:10</span>
              </div>
            </div>

            {/* Sub-tray: Floating Course Modules Timeline list */}
            <div className="w-full max-w-[560px] mt-6 space-y-2 relative z-10">
              {previewModules.map((mod, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setActiveModule(i)}
                  className={`p-3 rounded-xl border transition-all duration-300 cursor-pointer flex justify-between items-center ${
                    activeModule === i
                      ? 'bg-blue-600/10 border-blue-500/40 shadow-lg shadow-blue-950/20 translate-x-1'
                      : 'bg-[#121420]/40 border-gray-800/80 hover:border-gray-700 hover:bg-[#161929]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center border ${
                      activeModule === i ? 'bg-blue-500 text-white border-blue-400' : 'bg-gray-900 text-gray-500 border-gray-800'
                    }`}>
                      0{i + 1}
                    </div>
                    <p className={`text-xs font-semibold tracking-wide transition-colors ${activeModule === i ? 'text-white' : 'text-gray-400'}`}>
                      {mod.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500">
                    <span>{mod.duration}</span>
                    <span className="text-gray-700">•</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      mod.level === 'Advanced' ? 'bg-purple-500/10 text-purple-400' : mod.level === 'Intermediate' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>{mod.level}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT FLANK: Deeply integrated content controls with elegant metric layout */}
          <div className="relative order-2 p-8 sm:p-12 lg:col-span-5 z-10 flex flex-col justify-center items-start space-y-6">
            
            {/* Segment Kicker Indicator */}
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-gray-400">Structured Curriculum</span>
            </div>

            {/* Core Segment Hero Typography */}
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Expand Your Trading Knowledge With <span className="text-blue-400">ACG Academy</span>
            </h3>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-normal">
              Enhance your edge and master market complexity. Our tailored foundational methodologies 
              and signature Trading Psychology modules are built specifically to handle volatile execution parameters.
            </p>

            {/* Performance Checklist Matrix */}
            <ul className="w-full space-y-4 pt-2">
              {learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-3.5 text-xs sm:text-sm text-gray-200 group/item">
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center group-hover/item:border-blue-400 group-hover/item:bg-blue-500/20 transition-all duration-300">
                    <svg className="w-3 h-3 text-blue-400 fill-none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="font-medium tracking-wide text-gray-300 group-hover/item:text-white transition-colors duration-300">
                    {objective}
                  </span>
                </li>
              ))}
            </ul>

            {/* Premium Multi-tier Call to Action Interface Block */}
            <div className="pt-6 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-blue-950/50 hover:shadow-blue-600/30 active:scale-[0.98] transition-all duration-300 group/btn">
                <svg className="w-3.5 h-3.5 fill-current text-white transition-transform duration-300 group-hover/btn:scale-110" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Access Full Course
              </button>
              
              <button className="px-6 py-4 rounded-xl bg-[#11131F] hover:bg-[#161828] border border-gray-800 hover:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-all duration-300 text-center">
                View Curriculum
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}