import React, { useEffect, useState } from "react";
import { ChevronDown, Search, X, Menu, LogIn, Sparkles, UserPlus, Globe2 } from "lucide-react";
import 'flag-icons/css/flag-icons.min.css';
import acg from '../assets/ACG.png';

const navItems = [
  { name: "Challenge", dropdown: false, path: 'challenges' }, 
  { name: "How It Works", dropdown: false, path: 'how' },
  { name: "FAQ", dropdown: false, path: 'faq' },
  { name: "Academy", dropdown: false, path: 'academy' },
  { name: "Contact", dropdown: false, path: 'contact' },
];

const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
};

export default function Navbar({onLogin}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 font-sans ${
          scrolled ? "h-16" : "h-[76px]"
        }`}
      >
        {/* Dynamic Contextual Glassmorphic Backdrop Background Layer */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            scrolled
              ? "bg-[#0A0C14]/80 backdrop-blur-xl border-b border-gray-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              : "bg-gradient-to-b from-[#090A0F]/90 to-transparent border-b border-transparent"
          }`}
        />

        {/* Ambient Top Hardware Light Source Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div
            className={`absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[50px] rounded-full blur-[100px] transition-all duration-700 ${
              scrolled ? "bg-blue-500/5 opacity-40" : "bg-blue-500/15 opacity-100"
            }`}
          />
        </div>

        {/* Core Layout Shell constrained to identical platform rules */}
        <div className="relative max-w-[1440px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between z-10">
          
          {/* Brand Identity Vector Block */}
          <div className="flex items-center gap-12">
            <a href="#" className="text-white font-black text-2xl tracking-tight flex items-center gap-2 group/logo">
              <img src={acg} width={80} />
            </a>

            {/* DESKTOP ROUTING CONTROLS */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item, idx) => (
                <div 
                  key={item.name}
                  onMouseEnter={() => item.dropdown && setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  className="relative h-full flex items-center py-4"
                >
                  <a
                    onClick={(e) => {
                      e.preventDefault(); 
                      if (item.path) {
                        const element = document.getElementById(item.path);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    <span>{item.name}</span>
                    {item.dropdown && (
                      <ChevronDown
                        size={12}
                        className={`text-gray-500 transition-transform duration-300 group-hover:text-blue-400 ${
                          activeDropdown === idx ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>

                  {/* Micro Indicator Ambient Indicator Underline Rule */}
                  <span className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 ${
                    activeDropdown === idx ? "w-full opacity-100" : "w-0 opacity-0"
                  }`} />

                  {/* High-fidelity Abstract Matrix Menu Box Layout */}
                  {item.dropdown && activeDropdown === idx && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-56 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-[#0E101A] border border-gray-800 p-2 rounded-xl shadow-2xl backdrop-blur-md">
                        <a href="#" className="flex flex-col p-2.5 rounded-lg hover:bg-white/5 transition-colors group/sub">
                          <span className="text-xs font-bold text-gray-200 group-hover/sub:text-blue-400 transition-colors">Standard Protocols</span>
                          <span className="text-[10px] text-gray-500 mt-0.5">2-Step Execution Matrix</span>
                        </a>
                        <a href="#" className="flex flex-col p-2.5 rounded-lg hover:bg-white/5 transition-colors group/sub">
                          <span className="text-xs font-bold text-gray-200 group-hover/sub:text-cyan-400 transition-colors">Speed Infrastructure</span>
                          <span className="text-[10px] text-gray-500 mt-0.5">Instant Single Verification</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* RIGHT UTILITY MODULES PANEL */}
          <div className="hidden lg:flex items-center gap-6">
            
            {/* Command Trigger Action Hook */}
            <button 
              onClick={() => setSearchActive(true)}
              className="text-gray-400 hover:text-white p-2 hover:bg-white/5 rounded-lg transition-all duration-300"
            >
              <Search size={18} />
            </button>

            {/* Local CSS Flag Vector Dynamic Trigger */}
            <button className="flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-white transition-colors border border-gray-800/80 bg-black/20 rounded-lg px-2.5 py-1.5 hover:border-gray-700">
              <div className="w-4 h-3 rounded-sm overflow-hidden flex items-center justify-center border border-white/10">
                <span className="fi fi-gb !block w-full h-full scale-[1.1]" />
              </div>
              <span>EN</span>
            </button>

            <div className="w-[1px] h-4 bg-gray-800" />

            <a onClick={onLogin} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors">
              <LogIn size={13} className="text-gray-500" /> Log In
            </a>

            <button 
            onClick={onLogin}
            className="relative group/btn rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[size:200%_auto] hover:bg-right px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-950/40 hover:shadow-cyan-500/20 active:scale-[0.98] transition-all duration-500 flex items-center gap-2">
              <Sparkles size={13} className="text-cyan-200" />
              Get Started
            </button>
          </div>

          {/* RESPONSIVE MOBILE EXPANSION CONTROLLER BUTTON */}
          <div className="flex lg:hidden items-center gap-4">
            <button 
              onClick={() => setSearchActive(true)}
              className="text-gray-400 p-2"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2 transition-colors relative z-50"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </header>

      {/* FULL SCREEN SLIDE OVER INTERACTIVE COMMAND SEARCH PANEL */}
      {searchActive && (
        <div className="fixed inset-0 bg-[#06070B]/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xl relative">
            <button 
              onClick={() => setSearchActive(false)}
              className="absolute -top-12 right-0 text-gray-500 hover:text-white flex items-center gap-1.5 text-xs font-mono"
            >
              ESC <X size={16} />
            </button>
            <div className="relative border-b-2 border-gray-800 focus-within:border-blue-500 transition-colors pb-2">
              <Search className="absolute left-2 top-1 text-gray-500" size={22} />
              <input 
                autoFocus
                type="text" 
                placeholder="SEARCH ACCOUNT NODES, GUIDES OR PROTOCOLS..." 
                className="w-full bg-transparent border-0 pl-12 pr-4 text-white placeholder-gray-600 font-mono text-sm tracking-wide focus:ring-0 uppercase outline-none"
              />
            </div>
            <p className="text-[10px] text-gray-600 font-mono mt-3 uppercase tracking-wider">Press Enter to dispatch query pipelines</p>
          </div>
        </div>
      )}

      {/* MOBILE APPLICATION NAVIGATION LAYER OVERLAY MESH */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#090A0F] z-40 pt-24 px-6 flex flex-col justify-between pb-8 lg:hidden animate-in slide-in-from-right duration-300">
          <div className="space-y-6">
            <p className="text-[10px] font-mono font-bold tracking-widest text-gray-600 uppercase border-b border-gray-900 pb-2">Navigation Matrix</p>
            <div className="flex flex-col gap-5">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();

                    setMobileMenuOpen(false);

                    if (item.path) {
                      const element = document.getElementById(item.path);
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                  className="text-lg font-black tracking-tight text-gray-300 hover:text-white flex items-center justify-between group"
                >
                  <span>{item.name}</span>
                  {item.dropdown && <ChevronDown size={16} className="text-gray-600 group-hover:text-blue-500 transition-colors" />}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-900 pt-6">
            <div className="grid grid-cols-2 gap-3">
              <a onClick={onLogin} className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-gray-800 bg-black/20 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white">
                <LogIn size={14} /> Log In
              </a>
              <button className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-gray-800 bg-black/20 text-xs font-bold font-mono text-gray-400">
                <div className="w-4 h-3 rounded-sm overflow-hidden border border-white/10">
                  <span className="fi fi-gb !block w-full h-full scale-[1.1]" />
                </div>
                GLOBAL / EN
              </button>
            </div>
            
            <button onClick={onLogin} className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
              <UserPlus size={14} /> Start Challenge
            </button>
          </div>
        </div>
      )}
    </>
  );
}