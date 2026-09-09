import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Mail, 
  Phone, 
  ChevronRight, 
  Globe2, 
  Clock, 
  Activity, 
  Zap,
  ShieldCheck
} from 'lucide-react';
import 'flag-icons/css/flag-icons.min.css';

export default function SupportSection() {
  const [activeChannel, setActiveChannel] = useState('chat');
  const [hoveredLanguage, setHoveredLanguage] = useState(null);

  // Hardened mapping using absolute ISO 3166-1-alpha-2 codes natively supported by flag-icons
  const localizationHubs = [
    { code: "gb", label: "English Desk", region: "Global Routing" },
    { code: "de", label: "German Desk", region: "Frankfurt Node" },
    { code: "es", label: "Spanish Desk", region: "Madrid Node" },
    { code: "fr", label: "French Desk", region: "Paris Node" },
    { code: "it", label: "Italian Desk", region: "Milan Node" },
    { code: "jp", label: "Japanese Desk", region: "Tokyo Node" },
    { code: "ae", label: "Arabic Desk", region: "Dubai Hub" },
    { code: "vn", label: "Vietnamese Desk", region: "APAC Node" }
  ];

  return (
    <section id="contact" className="dark bg-[#090A0F] text-white py-24 md:py-32 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative">
      {/* Premium layered background illumination fields */}
      <div className="absolute right-1/4 top-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none select-none animate-pulse" />
      <div className="absolute left-10 bottom-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-[110px] pointer-events-none select-none" />

      {/* Structured grid shell tailored exactly to 1224px layout rules */}
      <div className="max-w-[1224px] mx-auto relative z-10">
        
        {/* Main Interface Window Wrapper */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#111322]/80 via-[#0C0D16]/95 to-[#08090F] border border-gray-800/80 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.85)] group transition-all duration-500 hover:border-blue-500/30">
          
          {/* Top Edge Reactive Light Ray */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
            
            {/* LEFT COLUMN: Terminal Call Actions & High-Intent Trigger Paths */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-start space-y-8 border-b lg:border-b-0 lg:border-r border-gray-800/60">
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Desk Status: Operative 24/7
                </div>
                
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-none">
                  Global Client <br />
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    Support Desks
                  </span>
                </h2>
              </div>
              
              <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed font-normal">
                Deploying integrated high-frequency client assistance frameworks. Connect natively with specialized multi-lingual institutional account managers around the clock.
              </p>
              
              {/* Split Interactive Routing Buttons */}
              <div className="w-full space-y-3 max-w-md">
                <button 
                  onClick={() => setActiveChannel('chat')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group/btn ${
                    activeChannel === 'chat'
                      ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-lg shadow-blue-950/20 translate-x-1'
                      : 'bg-black/20 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className={`w-4 h-4 ${activeChannel === 'chat' ? 'text-blue-400' : 'text-gray-500'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Initialize Live Terminal Chat</span>
                  </div>
                  <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
                
                <button 
                  onClick={() => setActiveChannel('telegram')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group/btn ${
                    activeChannel === 'telegram'
                      ? 'bg-cyan-600/10 border-cyan-500/40 text-white shadow-lg shadow-cyan-950/20 translate-x-1'
                      : 'bg-black/20 border-gray-900 text-gray-400 hover:text-white hover:border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 ${activeChannel === 'telegram' ? 'text-cyan-400' : 'text-gray-500'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">Launch Telegram Matrix Route</span>
                  </div>
                  <ChevronRight className="w-4 h-4 transform group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Hardware Base-layer Subchannels */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-900 w-full max-w-md">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase font-mono font-bold tracking-widest">
                    <Mail className="w-3 h-3 text-blue-500/60" /> Data Transmission
                  </span>
                  <a href="mailto:support@acgforex.com" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors font-semibold block truncate">
                    support@acgforex.com
                  </a>
                </div>
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase font-mono font-bold tracking-widest">
                    <Phone className="w-3 h-3 text-cyan-500/60" /> Voice Backbone
                  </span>
                  <a href="tel:+420910920310" className="text-xs sm:text-sm text-gray-300 hover:text-white transition-colors font-mono font-semibold block">
                    +420 910 920 310
                  </a>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Vector Localization Hub Frame */}
            <div className="lg:col-span-6 bg-slate-950/20 p-6 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden min-h-[440px]">
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-blue-400" /> Language Node Footprint
                  </p>
                  <span className="text-[9px] font-mono text-gray-600 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    ISO 3166-1 ACTIVE MATRICES
                  </span>
                </div>

                {/* Grid Structure compiling standard flag-icon CSS nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {localizationHubs.map((hub, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredLanguage(i)}
                      onMouseLeave={() => setHoveredLanguage(null)}
                      className={`p-3.5 rounded-xl border font-mono text-left transition-all duration-300 relative overflow-hidden cursor-crosshair ${
                        hoveredLanguage === i
                          ? 'bg-blue-600/10 border-blue-500/40 translate-y-[-1px] shadow-lg shadow-blue-950/40'
                          : 'bg-[#0E101A]/60 border-gray-900'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        {/* High-fidelity CSS Flag Vector Node Overlay */}
                        <div className="w-5 h-3.5 rounded-sm overflow-hidden border border-white/10 flex items-center justify-center">
                          <span className={`fi fi-${hub.code} !block w-full h-full scale-[1.1]`} />
                        </div>
                        <Zap className={`w-2.5 h-2.5 ${hoveredLanguage === i ? 'text-cyan-400 animate-pulse' : 'text-gray-700'}`} />
                      </div>
                      
                      <p className="text-[11px] font-bold text-gray-200 mt-3.5 tracking-tight truncate">
                        {hub.label}
                      </p>
                      <p className="text-[8px] text-gray-500 tracking-wider font-medium uppercase mt-0.5">
                        {hub.region}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Central Infrastructure System Telemetry Deck */}
              <div className="bg-[#0E101A]/90 border border-gray-900 p-4 rounded-2xl shadow-xl mt-6 space-y-3 relative z-10 backdrop-blur-md">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-[9px] font-mono font-bold tracking-wider text-gray-500 uppercase">
                      <Clock className="w-3 h-3 text-blue-400" /> Avg Queue
                    </div>
                    <p className="text-lg font-black font-mono text-white tracking-tight">&lt; 45s</p>
                  </div>
                  
                  <div className="space-y-1 border-x border-gray-900">
                    <div className="flex items-center justify-center gap-1 text-[9px] font-mono font-bold tracking-wider text-gray-500 uppercase">
                      <Activity className="w-3 h-3 text-cyan-400" /> Resolution
                    </div>
                    <p className="text-lg font-black font-mono text-white tracking-tight">99.4%</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1 text-[9px] font-mono font-bold tracking-wider text-gray-500 uppercase">
                      <ShieldCheck className="w-3 h-3 text-indigo-400" /> Secure SSL
                    </div>
                    <p className="text-lg font-black font-mono text-white tracking-tight">AES-256</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}