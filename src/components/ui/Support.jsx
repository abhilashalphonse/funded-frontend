import React from 'react';
import { 
  Mail, 
  Phone, 
  ArrowRight, 
  Globe2, 
  Clock, 
  Activity, 
  ShieldCheck
} from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';

export default function Support() {
  const localizationHubs = [
    { code: "gb", label: "English", region: "London Node" },
    { code: "de", label: "German", region: "Frankfurt Node" },
    { code: "es", label: "Spanish", region: "Madrid Node" },
    { code: "fr", label: "French", region: "Paris Node" },
    { code: "it", label: "Italian", region: "Milan Node" },
    { code: "jp", label: "Japanese", region: "Tokyo Node" },
    { code: "ae", label: "Arabic", region: "Dubai Node" },
    { code: "vn", label: "Vietnamese", region: "APAC Node" }
  ];

  return (
    <section id="support" className="bg-black text-[#EDEDED] py-16 md:py-24 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative selection:bg-white/20 selection:text-white">
      
      {/* Vercel-style subtle radial spotlight (pure white/gray, no colors) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none select-none" />

      <div className="max-w-[1080px] mx-auto relative z-10 w-full">
        
        {/* Main Interface: Pure black with an ultra-thin gray border */}
        <div className="relative rounded-2xl bg-[#050505] border border-white/[0.08] overflow-hidden shadow-2xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[560px] divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
            
            {/* LEFT COLUMN: Support Routing */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.01)_0%,transparent_100%)]">
              
              <div className="space-y-8">
                {/* Linear-style Status Pill */}
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] text-[11px] font-medium text-[#A1A1AA] shadow-sm backdrop-blur-sm">
                  <div className="relative flex items-center justify-center w-2 h-2">
                    <span className="absolute w-full h-full rounded-full bg-emerald-500 opacity-20 animate-ping" />
                    <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  </div>
                  Systems Operational
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-white">
                    Global Support
                  </h2>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-[90%]">
                    Direct access to our institutional routing network. Connect with specialized account managers across primary global timezones.
                  </p>
                </div>

                {/* Routing Actions */}
                <div className="w-full space-y-2 pt-4">
                  <a
                    href="mailto:support@acgforex.com"
                    className="group w-full flex items-center justify-between p-3.5 rounded-xl border border-transparent bg-transparent text-[#888888] transition-all duration-200 hover:bg-white/[0.03] hover:border-white/[0.08] hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Mail strokeWidth={1.5} className="w-4 h-4" />
                      <span className="text-sm font-medium tracking-tight">Email Support</span>
                    </div>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-white/50" />
                  </a>

                  <a
                    href="tel:+420910920310"
                    className="group w-full flex items-center justify-between p-3.5 rounded-xl border border-transparent bg-transparent text-[#888888] transition-all duration-200 hover:bg-white/[0.03] hover:border-white/[0.08] hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Phone strokeWidth={1.5} className="w-4 h-4" />
                      <span className="text-sm font-medium tracking-tight">Call Support</span>
                    </div>
                    <ArrowRight strokeWidth={1.5} className="w-4 h-4 text-white/50" />
                  </a>
                </div>
              </div>

              {/* Static Contact */}
              <div className="grid grid-cols-1 gap-4 pt-8 mt-6 sm:grid-cols-2 sm:pt-12 sm:mt-8">
                <div className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] text-[#666666] uppercase font-medium tracking-wider">
                    <Mail strokeWidth={1.5} className="w-3 h-3" /> Email
                  </span>
                  <a href="mailto:support@acgforex.com" className="text-sm text-[#A1A1AA] hover:text-white transition-colors block truncate">
                    support@acgforex.com
                  </a>
                </div>
                <div className="space-y-1.5">
                  <span className="flex items-center gap-1.5 text-[10px] text-[#666666] uppercase font-medium tracking-wider">
                    <Phone strokeWidth={1.5} className="w-3 h-3" /> Voice
                  </span>
                  <a href="tel:+420910920310" className="text-sm text-[#A1A1AA] hover:text-white transition-colors block font-mono">
                    +420 910 920 310
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Infrastructure Nodes */}
            <div className="lg:col-span-7 bg-[#020202] p-6 sm:p-10 flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                  <h3 className="text-sm font-medium text-[#EDEDED] flex items-center gap-2">
                    <Globe2 strokeWidth={1.5} className="w-4 h-4 text-[#888]" /> Network Footprint
                  </h3>
                  <span className="text-[10px] font-mono text-[#666] uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 rounded-sm">
                    ISO 3166-1
                  </span>
                </div>

                {/* Nodes Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {localizationHubs.map((hub, i) => (
                    <div
                      key={i}
                      className="group p-3.5 sm:p-4 rounded-xl border border-white/[0.06] bg-[#070707] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-default flex flex-col justify-between min-h-[100px]"
                    >
                      <div className="flex justify-between items-start">
                        {/* Grayscale flags that colorize on hover (Premium feel) */}
                        <div className="w-5 h-3.5 rounded-[2px] overflow-hidden border border-white/[0.1] flex items-center justify-center grayscale opacity-40 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">
                          <span className={`fi fi-${hub.code} !block w-full h-full scale-[1.2]`} />
                        </div>
                      </div>
                      
                      <div className="space-y-0.5 mt-auto pt-4">
                        <p className="text-xs font-medium text-[#EDEDED] tracking-tight">
                          {hub.label}
                        </p>
                        <p className="text-[10px] text-[#666666] tracking-wide font-medium">
                          {hub.region}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Footer */}
              <div className="mt-12 flex items-center justify-between bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl">
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-[#888] uppercase">
                      <Clock strokeWidth={1.5} className="w-3 h-3" /> Queue Time
                    </div>
                    <p className="text-sm font-mono text-white tracking-tight">&lt; 45s</p>
                  </div>
                  
                  <div className="w-px h-8 bg-white/[0.08]" />
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-[#888] uppercase">
                      <Activity strokeWidth={1.5} className="w-3 h-3" /> Resolution
                    </div>
                    <p className="text-sm font-mono text-white tracking-tight">99.4%</p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-[10px] font-medium tracking-wider text-[#666] uppercase">
                  <ShieldCheck strokeWidth={1.5} className="w-3.5 h-3.5" />
                  AES-256 Encrypted
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}