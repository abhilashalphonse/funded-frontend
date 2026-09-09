import React, { useState, useEffect } from 'react';
import ReactCountryFlag from "react-country-flag";
import acg from '../assets/ACG.png'
import { 
  User, Menu, X, LayoutDashboard, Gem, Users, GraduationCap, 
  CreditCard, Trophy, MessageSquare, Clock, Flag, ChevronDown,
  Shield, Bell, Globe, Check, Search, ArrowUpRight, Percent, DollarSign,
  BookOpen, Play, Lock, Award, BarChart3, Download, Receipt, Plus, Wallet, 
  ExternalLink, Activity, TrendingUp, AlertTriangle, CheckCircle2, Zap,
   Layers, ShieldCheck, Flame, AlertCircle, LogOut
} from 'lucide-react';
import { useAuth } from "../AuthContext"; 


const OverviewSection = ({ userName, userInitials }) => {
  const { user, signOut } = useAuth();
  
  // 1. Setup Active Tab State
  const [activeTab, setActiveTab] = useState("Overview");

  // Navigation Pill Options
  const tabList = ["Overview", "Trades", "Calendar", "Statistics", "Account"];

  // Extract the metadata saved during registration
  const firstName = user?.user_metadata?.first_name || "Trader";
  const secondName = user?.user_metadata?.second_name || "";
  const country = user?.user_metadata?.country || "Global";
  const hasActiveAccount = true; 

  if (!hasActiveAccount) {
    return (
      <div className="space-y-6 animate-fade-in">
        <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold border border-zinc-700 relative">
              {userInitials}
              <span className="absolute -bottom-0.5 -right-0.5 text-xs">🇵🇹</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Welcome, {userName}</h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Start with the Challenge to access rewards or the Free Trial for risk-free practice.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans text-zinc-300">
      
      {/* 2. Header Section */}
      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white uppercase tracking-wide">Account: #ACG-509421</span>
              <span className="text-[11px] bg-blue-500/10 text-[#1e70e2] border border-blue-500/20 font-medium px-2.5 py-1 rounded-full uppercase tracking-wider">
                Phase 1
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2 font-mono">
              <span>Server: <strong className="text-zinc-300 font-medium">ACG-DEMO-04</strong></span>
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <span>Platform: <strong className="text-zinc-300 font-medium">DXTrade</strong></span>
            </p>
          </div>
        </div>
        <button className="text-[11px] font-semibold bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-700 px-3 py-2 rounded-xl transition">
          Switch Credentials
        </button>
      </section>

      {/* 3. Horizontal Navigation Tablet Pills */}
      <nav className="flex items-center gap-2 bg-[#141414] p-1.5 rounded-2xl border border-zinc-800 max-w-max overflow-x-auto scrollbar-none">
        {tabList.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap tracking-wide ${
                isActive
                  ? "bg-[#1e70e2] text-white shadow-lg shadow-blue-500/10 border border-blue-500/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* 4. Dynamic Content Area */}
      <div className="transition-all duration-300">
        
        {/* OVERVIEW TAB CONTENT */}
        {activeTab === "Overview" && (
          <div className="space-y-6">
            {/* Metric Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-2">Account Balance</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">$104,250.00</h3>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Initial: <span className="text-emerald-500 font-medium">$100,000.00</span>
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-2">Floating Equity</p>
                <h3 className="text-2xl font-bold text-emerald-400 tracking-tight">$105,110.00</h3>
                <p className="text-[11px] text-zinc-500 mt-2">
                  <span className="text-emerald-400">+$860.00</span> Running positions
                </p>
              </div>

              <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-2">Daily Drawdown</p>
                <h3 className="text-2xl font-bold text-white tracking-tight mb-3">$1,150.00</h3>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[23%] rounded-full" />
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">Max Daily Risk Limit: $5,000.00</p>
              </div>

              <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex flex-col justify-between hover:border-zinc-700 transition">
                <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider mb-2">Max Overall Loss</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">$0.00</h3>
                <p className="text-[11px] text-emerald-500 mt-2 font-medium">
                  Safe • Floor at $90,000.00
                </p>
              </div>
            </section>

            {/* Guidelines & Events Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Guidelines */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6">
                  <div className="mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <Activity size={16} className="text-[#1e70e2]" /> Simulated Evaluation Guidelines
                    </h2>
                    <p className="text-xs text-zinc-400 mt-0.5">You must meet all target thresholds safely to unlock Phase 2 deployment.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition gap-4">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-zinc-200">Achieve 8% Profit Target</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">Progress: $4,250.00 / $8,000.00</div>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-1/2">
                        <div className="flex-1 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#1e70e2] h-full w-[53.1%] rounded-full" />
                        </div>
                        <div className="text-[11px] font-bold text-[#1e70e2] bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg w-14 text-center">
                          53.1%
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-xl hover:border-zinc-700 transition gap-4">
                      <div>
                        <div className="text-xs font-semibold text-zinc-200">Minimum Evaluation Days</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">Progress: 4 / 5 Days Traded</div>
                      </div>
                      <div className="text-[11px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-lg">
                        Active
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl gap-4">
                      <div>
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 size={15} /> Strict Drawdown Regulation
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">Account daily parameters inside nominal safety margins.</div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                        Passed
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: High-Impact Blocks */}
              <div className="space-y-6">
                <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6">
                  <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                      <AlertTriangle size={15} className="text-amber-500" /> High-Impact Blocks
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      Prop firm configurations strictly restrict executions inside a ±2-minute window of macroeconomic releases.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-rose-400 uppercase bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                          USD • High Impact
                        </span>
                        <span className="text-[11px] font-mono font-bold text-zinc-500">13:30 GMT</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">Core Retail Sales MoM</h4>
                      <p className="text-[11px] text-zinc-500">Execution Block: 13:28 - 13:32</p>
                    </div>

                    <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          EUR • Med Impact
                        </span>
                        <span className="text-[11px] font-mono font-bold text-zinc-500">14:45 GMT</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">ECB President Lagarde Speaks</h4>
                      <p className="text-[11px] text-zinc-500">Volatility warnings recommended.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-zinc-600 leading-relaxed text-center sm:text-left">
              * Risk parameters, metrics calculation algorithms, and evaluation data values pipeline directly from the linked matching simulation engine environment. Latency corrections occur every 15 seconds.
            </p>
          </div>
        )}

              {/* TRADES TAB CONTENT */}
              {activeTab === "Trades" && (
                  <div className="space-y-6 animate-fade-in">

                      {/* Trade Sub-Metrics Summary */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 p-4">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Total Trades</p>
                              <p className="text-xl font-bold text-white mt-1">42</p>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 p-4">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Win Rate</p>
                              <p className="text-xl font-bold text-[#1e70e2] mt-1">64.2%</p>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 p-4">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Average Win</p>
                              <p className="text-xl font-bold text-emerald-400 mt-1">+$320.00</p>
                          </div>
                          <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800 p-4">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Profit Factor</p>
                              <p className="text-xl font-bold text-amber-500 mt-1">1.84</p>
                          </div>
                      </div>

                      {/* Section Container with Header Actions */}
                      <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
                          <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Trading Ledger</h3>
                                  <p className="text-xs text-zinc-400 mt-0.5">Real-time update stream from evaluation environment.</p>
                              </div>

                              {/* Toggle between Active and History */}
                              <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-center">
                                  <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 text-white shadow-sm">
                                      Active (2)
                                  </button>
                                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-200 transition">
                                      History
                                  </button>
                              </div>
                          </div>

                          {/* Responsive Table Wrapper */}
                          <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                  <thead>
                                      <tr className="border-b border-zinc-800/60 bg-zinc-900/30 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                          <th className="py-3.5 px-5">Asset / Ticket</th>
                                          <th className="py-3.5 px-5">Type</th>
                                          <th className="py-3.5 px-5">Volume</th>
                                          <th className="py-3.5 px-5">Open Price</th>
                                          <th className="py-3.5 px-5">Current Price</th>
                                          <th className="py-3.5 px-5">SL / TP</th>
                                          <th className="py-3.5 px-5 text-right">Profit / Loss</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-800/40 text-xs font-medium">

                                      {/* Position 1 */}
                                      <tr className="hover:bg-zinc-900/20 transition-colors">
                                          <td className="py-4 px-5">
                                              <div className="text-white font-bold">EURUSD</div>
                                              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">#8492041</div>
                                          </td>
                                          <td className="py-4 px-5">
                                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-bold uppercase text-[10px]">
                                                  Buy
                                              </span>
                                          </td>
                                          <td className="py-4 px-5 font-mono text-zinc-300">2.50 Lots</td>
                                          <td className="py-4 px-5 font-mono text-zinc-400">1.08450</td>
                                          <td className="py-4 px-5 font-mono text-zinc-300">1.08610</td>
                                          <td className="py-4 px-5 font-mono text-zinc-500 space-y-0.5">
                                              <div>SL: <span className="text-zinc-400">1.08200</span></div>
                                              <div>TP: <span className="text-zinc-400">1.09100</span></div>
                                          </td>
                                          <td className="py-4 px-5 text-right font-mono">
                                              <div className="text-emerald-400 font-bold">+$400.00</div>
                                              <div className="text-[10px] text-emerald-500/80">+{16.0} pips</div>
                                          </td>
                                      </tr>

                                      {/* Position 2 */}
                                      <tr className="hover:bg-zinc-900/20 transition-colors">
                                          <td className="py-4 px-5">
                                              <div className="text-white font-bold">XAUUSD</div>
                                              <div className="text-[10px] text-zinc-500 font-mono mt-0.5">#8492115</div>
                                          </td>
                                          <td className="py-4 px-5">
                                              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold uppercase text-[10px]">
                                                  Sell
                                              </span>
                                          </td>
                                          <td className="py-4 px-5 font-mono text-zinc-300">1.00 Lot</td>
                                          <td className="py-4 px-5 font-mono text-zinc-400">2,342.10</td>
                                          <td className="py-4 px-5 font-mono text-zinc-300">2,337.50</td>
                                          <td className="py-4 px-5 font-mono text-zinc-500 space-y-0.5">
                                              <div>SL: <span className="text-zinc-400">2,350.00</span></div>
                                              <div>TP: <span className="text-zinc-400">2,320.00</span></div>
                                          </td>
                                          <td className="py-4 px-5 text-right font-mono">
                                              <div className="text-emerald-400 font-bold">+$460.00</div>
                                              <div className="text-[10px] text-emerald-500/80">+{46.0} pips</div>
                                          </td>
                                      </tr>

                                  </tbody>
                              </table>
                          </div>

                          {/* Table Footer Summary Indicator */}
                          <div className="p-4 bg-zinc-900/20 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                              <div>Showing active market exposures</div>
                              <div className="font-mono font-bold text-emerald-400">Combined Floating: +$860.00</div>
                          </div>
                      </div>

                  </div>
              )}

              {/* CALENDAR TAB CONTENT */}
              {activeTab === "Calendar" && (
                  <div className="space-y-6 animate-fade-in">

                      {/* Calendar Control Header */}
                      <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Daily Performance Calendar</h3>
                              <p className="text-xs text-zinc-400 mt-0.5">Track your daily simulated net profit and loss distributions.</p>
                          </div>

                          {/* Month Navigator */}
                          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 self-start sm:self-center">
                              <button className="p-1.5 text-zinc-400 hover:text-white transition">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                              </button>
                              <span className="text-xs font-bold text-white px-4 min-w-[100px] text-center">July 2026</span>
                              <button className="p-1.5 text-zinc-400 hover:text-white transition">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                              </button>
                          </div>
                      </div>

                      {/* Calendar Monthly Grid Container */}
                      <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 space-y-2">

                          {/* Days of the Week Header */}
                          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-800/60">
                              <div>Sun</div>
                              <div>Mon</div>
                              <div>Tue</div>
                              <div>Wed</div>
                              <div>Thu</div>
                              <div>Fri</div>
                              <div>Sat</div>
                          </div>

                          {/* Monthly Grid Blocks */}
                          <div className="grid grid-cols-7 gap-2 pt-2">

                              {/* Row 1: Empty or previous month offset days */}
                              <div className="bg-zinc-900/10 min-h-[75px] rounded-xl border border-dashed border-zinc-800/40 p-2 opacity-30 text-[11px] text-zinc-600 font-mono">28</div>
                              <div className="bg-zinc-900/10 min-h-[75px] rounded-xl border border-dashed border-zinc-800/40 p-2 opacity-30 text-[11px] text-zinc-600 font-mono">29</div>
                              <div className="bg-zinc-900/10 min-h-[75px] rounded-xl border border-dashed border-zinc-800/40 p-2 opacity-30 text-[11px] text-zinc-600 font-mono">30</div>

                              {/* Active Days Start */}
                              {/* Day 1: Profit Day */}
                              <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 transition min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono">
                                  <span className="text-[11px] text-zinc-400 font-bold">01</span>
                                  <span className="text-[11px] font-bold text-emerald-400 text-right">+$1,250</span>
                              </div>

                              {/* Day 2: Loss Day */}
                              <div className="bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 transition min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono">
                                  <span className="text-[11px] text-zinc-400 font-bold">02</span>
                                  <span className="text-[11px] font-bold text-rose-400 text-right">-$450</span>
                              </div>

                              {/* Day 3: Flat / No Trades Day */}
                              <div className="bg-zinc-900/40 hover:bg-zinc-900/60 border border-zinc-800/60 transition min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono">
                                  <span className="text-[11px] text-zinc-500">03</span>
                                  <span className="text-[10px] text-zinc-600 text-right">$0.00</span>
                              </div>

                              {/* Day 4: Weekend (Closed Market) */}
                              <div className="bg-[#141414] border border-zinc-900/40 min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono opacity-40">
                                  <span className="text-[11px] text-zinc-600">04</span>
                                  <span className="text-[9px] uppercase text-zinc-600 tracking-wider text-right">Mkt Clsd</span>
                              </div>

                              {/* Row 2 */}
                              <div className="bg-[#141414] border border-zinc-900/40 min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono opacity-40">
                                  <span className="text-[11px] text-zinc-600">05</span>
                                  <span className="text-[9px] uppercase text-zinc-600 tracking-wider text-right">Mkt Clsd</span>
                              </div>

                              <div className="bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 hover:border-emerald-500/20 transition min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono">
                                  <span className="text-[11px] text-zinc-400 font-bold">06</span>
                                  <span className="text-[11px] font-bold text-emerald-400 text-right">+$2,100</span>
                              </div>

                              {/* Today / Active ongoing tracking day styling */}
                              <div className="bg-emerald-500/10 border-2 border-[#1e70e2] min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono relative shadow-md shadow-blue-500/5">
                                  <div className="flex justify-between items-center">
                                      <span className="text-[11px] text-white font-bold">07</span>
                                      <span className="text-[9px] bg-[#1e70e2] text-white font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tight scale-90 origin-right">Today</span>
                                  </div>
                                  <span className="text-[11px] font-bold text-emerald-400 text-right">+$1,350</span>
                              </div>

                              {/* Future Days Placeholder styling */}
                              {[...Array(21)].map((_, index) => {
                                  const dayNumber = index + 8;
                                  const isWeekend = dayNumber % 7 === 1 || dayNumber % 7 === 2; // Rough mapping for layout visual mapping
                                  return (
                                      <div
                                          key={dayNumber}
                                          className={`min-h-[75px] rounded-xl p-2 flex flex-col justify-between font-mono ${isWeekend
                                                  ? "bg-[#141414] border border-zinc-900/40 opacity-20"
                                                  : "bg-zinc-900/20 border border-zinc-800/40 opacity-40"
                                              }`}
                                      >
                                          <span className="text-[11px] text-zinc-600">{dayNumber < 10 ? `0${dayNumber}` : dayNumber}</span>
                                          <span className="text-[10px] text-zinc-700 text-right">-</span>
                                      </div>
                                  );
                              })}

                          </div>
                      </div>

                      {/* Calendar Summary Footer Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between">
                              <span className="text-xs text-zinc-400">Profitable Days</span>
                              <span className="text-sm font-bold text-emerald-400 font-mono">3 Days</span>
                          </div>
                          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between">
                              <span className="text-xs text-zinc-400">Losing Days</span>
                              <span className="text-sm font-bold text-rose-400 font-mono">1 Day</span>
                          </div>
                          <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-3.5 flex items-center justify-between sm:col-span-1">
                              <span className="text-xs text-zinc-400">Month Net PnL</span>
                              <span className="text-sm font-bold text-emerald-400 font-mono">+$4,250.00</span>
                          </div>
                      </div>

                  </div>
              )}

              {/* STATISTICS TAB CONTENT */}
              {activeTab === "Statistics" && (
                  <div className="space-y-6 animate-fade-in">

                      {/* 1. Primary Performance Metrics Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-4 flex flex-col justify-between">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Win Rate</p>
                              <div className="flex items-baseline gap-2 mt-2">
                                  <h4 className="text-2xl font-bold text-white tracking-tight">64.2%</h4>
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold">High</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 mt-1">27 Wins / 15 Losses</p>
                          </div>

                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-4 flex flex-col justify-between">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Profit Factor</p>
                              <div className="flex items-baseline gap-2 mt-2">
                                  <h4 className="text-2xl font-bold text-[#1e70e2] tracking-tight">1.84</h4>
                                  <span className="text-[10px] text-zinc-500 font-mono">Gross/Loss</span>
                              </div>
                              <p className="text-[10px] text-emerald-500 mt-1 font-medium">Optimal Parameter</p>
                          </div>

                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-4 flex flex-col justify-between">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Average Reward-to-Risk (RRR)</p>
                              <div className="flex items-baseline gap-2 mt-2">
                                  <h4 className="text-2xl font-bold text-white tracking-tight">1:2.1</h4>
                                  <span className="text-[10px] text-amber-500 font-mono font-bold">Stable</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 mt-1">Target Threshold: 1:1.5+</p>
                          </div>

                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-4 flex flex-col justify-between">
                              <p className="text-[11px] text-zinc-500 font-medium uppercase tracking-wider">Discipline Score</p>
                              <div className="flex items-baseline gap-2 mt-2">
                                  <h4 className="text-2xl font-bold text-emerald-400 tracking-tight">96%</h4>
                                  <span className="text-[10px] text-emerald-500 font-mono">Excellent</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 mt-1">Based on rule parameters</p>
                          </div>
                      </div>

                      {/* 2. Advanced Mathematical Analytics & Rules Split Block */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                          {/* Left Columns: Core Evaluation Breakdown Ledger */}
                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6 lg:col-span-2 space-y-5">
                              <div>
                                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Mathematical Metric Summary</h3>
                                  <p className="text-xs text-zinc-400 mt-0.5">Calculated tracking vectors across active execution pools.</p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                                      <span className="text-xs text-zinc-400">Total Cleared Volume</span>
                                      <span className="text-xs font-bold text-white font-mono">148.50 Lots</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                                      <span className="text-xs text-zinc-400">Trading Expectancy</span>
                                      <span className="text-xs font-bold text-emerald-400 font-mono">+$101.19 / Trade</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                                      <span className="text-xs text-zinc-400">Average Profitable Trade</span>
                                      <span className="text-xs font-bold text-emerald-400 font-mono">+$320.00</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                                      <span className="text-xs text-zinc-400">Sharpe Ratio</span>
                                      <span className="text-xs font-bold text-[#1e70e2] font-mono">2.41</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 border-b border-zinc-800/50 sm:border-0">
                                      <span className="text-xs text-zinc-400">Average Losing Trade</span>
                                      <span className="text-xs font-bold text-rose-400 font-mono">-$152.00</span>
                                  </div>
                                  <div className="flex items-center justify-between py-2 sm:border-0">
                                      <span className="text-xs text-zinc-400">Total Run Execution Count</span>
                                      <span className="text-xs font-bold text-white font-mono">42 Trades</span>
                                  </div>
                              </div>
                          </div>

                          {/* Right Column: Rule Consistency & Discipline Evaluation Matrix */}
                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6 space-y-4">
                              <div>
                                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Rule Consistency Matrix</h3>
                                  <p className="text-xs text-zinc-400 mt-0.5">Automated assessment pipeline.</p>
                              </div>

                              <div className="space-y-3 pt-1">
                                  <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-1.5">
                                      <div className="flex justify-between text-[11px] font-semibold text-zinc-200">
                                          <span>Lot Size Consistency</span>
                                          <span className="text-emerald-400">98%</span>
                                      </div>
                                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                          <div className="bg-emerald-500 h-full w-[98%]" />
                                      </div>
                                  </div>

                                  <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-1.5">
                                      <div className="flex justify-between text-[11px] font-semibold text-zinc-200">
                                          <span>Risk Limit Buffer Compliance</span>
                                          <span className="text-emerald-400">100%</span>
                                      </div>
                                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                          <div className="bg-emerald-500 h-full w-[100%]" />
                                      </div>
                                  </div>

                                  <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl space-y-1.5">
                                      <div className="flex justify-between text-[11px] font-semibold text-zinc-200">
                                          <span>News Block Evasion</span>
                                          <span className="text-amber-500">92%</span>
                                      </div>
                                      <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                                          <div className="bg-amber-500 h-full w-[92%]" />
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 3. Daily Activity & Drawdown Summary Ledger */}
                      <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
                          <div className="p-5 border-b border-zinc-800">
                              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Daily Summary History</h3>
                              <p className="text-xs text-zinc-400 mt-0.5">Track day-to-day risk usage statistics.</p>
                          </div>

                          <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                  <thead>
                                      <tr className="border-b border-zinc-800/60 bg-zinc-900/30 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                          <th className="py-3 px-5">Date</th>
                                          <th className="py-3 px-5">Volume Traded</th>
                                          <th className="py-3 px-5">Max Daily Drawdown Hit</th>
                                          <th className="py-3 px-5">Trades Count</th>
                                          <th className="py-3 px-5 text-right">Net Daily PnL</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-800/40 text-xs font-medium font-mono">
                                      <tr className="hover:bg-zinc-900/20 transition-colors">
                                          <td className="py-3.5 px-5 text-zinc-300 font-sans">July 07, 2026</td>
                                          <td className="py-3.5 px-5 text-zinc-400">12.50 Lots</td>
                                          <td className="py-3.5 px-5 text-zinc-400">$1,150.00 / $5,000</td>
                                          <td className="py-3.5 px-5 text-zinc-400">5 Trades</td>
                                          <td className="py-3.5 px-5 text-emerald-400 text-right font-bold">+$1,350.00</td>
                                      </tr>
                                      <tr className="hover:bg-zinc-900/20 transition-colors">
                                          <td className="py-3.5 px-5 text-zinc-300 font-sans">July 06, 2026</td>
                                          <td className="py-3.5 px-5 text-zinc-400">18.00 Lots</td>
                                          <td className="py-3.5 px-5 text-zinc-400">$2,400.00 / $5,000</td>
                                          <td className="py-3.5 px-5 text-zinc-400">8 Trades</td>
                                          <td className="py-3.5 px-5 text-emerald-400 text-right font-bold">+$2,100.00</td>
                                      </tr>
                                      <tr className="hover:bg-zinc-900/20 transition-colors">
                                          <td className="py-3.5 px-5 text-zinc-300 font-sans">July 03, 2026</td>
                                          <td className="py-3.5 px-5 text-zinc-400">0.00 Lots</td>
                                          <td className="py-3.5 px-5 text-zinc-400">$0.00 / $5,000</td>
                                          <td className="py-3.5 px-5 text-zinc-400">0 Trades</td>
                                          <td className="py-3.5 px-5 text-zinc-500 text-right">$0.00</td>
                                      </tr>
                                      <tr className="hover:bg-zinc-900/20 transition-colors">
                                          <td className="py-3.5 px-5 text-zinc-300 font-sans">July 02, 2026</td>
                                          <td className="py-3.5 px-5 text-zinc-400">6.20 Lots</td>
                                          <td className="py-3.5 px-5 text-zinc-400">$850.00 / $5,000</td>
                                          <td className="py-3.5 px-5 text-zinc-400">3 Trades</td>
                                          <td className="py-3.5 px-5 text-rose-400 text-right font-bold">-$450.00</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>

                  </div>
              )}

              {/* ACCOUNT TAB CONTENT */}
              {activeTab === "Account" && (
                  <div className="space-y-6 animate-fade-in">

                      {/* 1. Account Credentials Cards Split Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                          {/* Platform Connection Credentials (Left Side) */}
                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6 lg:col-span-2 space-y-4">
                              <div>
                                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Platform Connection Credentials</h3>
                                  <p className="text-xs text-zinc-400 mt-0.5">Use these data tokens inside your DXTrade terminal interface link.</p>
                              </div>

                              <div className="space-y-3 pt-2">
                                  {/* Server Field */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl gap-2">
                                      <div>
                                          <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Trading Server</span>
                                          <p className="text-xs font-mono font-bold text-white mt-0.5">ACG-Sim-Live04</p>
                                      </div>
                                      <button className="text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition active:scale-95">
                                          Copy Server
                                      </button>
                                  </div>

                                  {/* Login Field */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl gap-2">
                                      <div>
                                          <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Account Login Number</span>
                                          <p className="text-xs font-mono font-bold text-white mt-0.5">509421</p>
                                      </div>
                                      <button className="text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition active:scale-95">
                                          Copy Login
                                      </button>
                                  </div>

                                  {/* Password Field */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl gap-2">
                                      <div>
                                          <span className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Master Password</span>
                                          <p className="text-xs font-mono font-bold text-zinc-400 mt-0.5">••••••••••••••••</p>
                                      </div>
                                      <div className="flex gap-2">
                                          <button className="text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition">
                                              Reveal
                                          </button>
                                          <button className="text-[10px] font-bold bg-[#1e70e2]/10 hover:bg-[#1e70e2]/20 text-[#1e70e2] px-3 py-1.5 rounded-lg border border-[#1e70e2]/20 transition">
                                              Change
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Account Specifications Panel (Right Side) */}
                          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6 space-y-4">
                              <div>
                                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Program Rules Blueprint</h3>
                                  <p className="text-xs text-zinc-400 mt-0.5">Static settings mapped to this asset tier model.</p>
                              </div>

                              <div className="space-y-3 font-mono text-xs pt-1">
                                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                                      <span className="text-zinc-500 font-sans">Account Leverage</span>
                                      <span className="font-bold text-white">1:100</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                                      <span className="text-zinc-500 font-sans">Allowed Types</span>
                                      <span className="font-bold text-white">Hedging / Scalping</span>
                                  </div>
                                  <div className="flex justify-between py-2 border-b border-zinc-800/50">
                                      <span className="text-zinc-500 font-sans">Weekend Holding</span>
                                      <span className="font-bold text-rose-400 uppercase text-[11px]">Prohibited</span>
                                  </div>
                                  <div className="flex justify-between py-2">
                                      <span className="text-zinc-500 font-sans">Profit Split Allocation</span>
                                      <span className="font-bold text-emerald-400">80% / 20%</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* 2. Billings, Receipts & Invoice History Module */}
                      <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
                          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                              <div>
                                  <h3 className="text-sm font-bold uppercase tracking-wider text-white">Subscription & Challenge Fee History</h3>
                                  <p className="text-xs text-zinc-400 mt-0.5">Invoices related to setup parameters or performance evaluations.</p>
                              </div>
                          </div>

                          <div className="overflow-x-auto">
                              <table className="w-full text-left border-collapse">
                                  <thead>
                                      <tr className="border-b border-zinc-800/60 bg-zinc-900/30 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                                          <th className="py-3 px-5">Invoice Reference</th>
                                          <th className="py-3 px-5">Date Cleared</th>
                                          <th className="py-3 px-5">Model Description</th>
                                          <th className="py-3 px-5">Processing Method</th>
                                          <th className="py-3 px-5 text-right">Fee Charge</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-800/40 text-xs font-medium">
                                      <tr className="hover:bg-zinc-900/20 transition-colors">
                                          <td className="py-3.5 px-5 font-mono text-white">#INV-928405</td>
                                          <td className="py-3.5 px-5 text-zinc-400 font-mono">June 29, 2026</td>
                                          <td className="py-3.5 px-5 text-zinc-300">$100k Evaluation Challenge — Phase 1 Registration</td>
                                          <td className="py-3.5 px-5 font-mono text-zinc-400">Stripe CC</td>
                                          <td className="py-3.5 px-5 text-right font-mono text-white">$549.00</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>

                  </div>
              )}

      </div>
    </div>
  );
};
const AnalyticsSection = () => {
  const performanceStats = [
    { metric: "Win Rate", value: "68.4%", industryAvg: "54.0%", status: "Optimal", type: "success" },
    { metric: "Profit Factor", value: "2.41", industryAvg: "1.65", status: "Strong", type: "success" },
    { metric: "Average Winning Trade", value: "+$1,840.00", industryAvg: "+$1,200.00", status: "Above Avg", type: "neutral" },
    { metric: "Average Losing Trade", value: "-$760.00", industryAvg: "-$850.00", status: "Controlled", type: "success" },
    { metric: "Max Consecutive Wins", value: "9 Trades", industryAvg: "5 Trades", status: "Exceptional", type: "success" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top 3 High-Level Analytics Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* Sharpe Ratio Card */}
        <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-2xl p-5 text-center space-y-3 order-2 md:order-1 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-zinc-500 font-black text-xs uppercase tracking-wider">Risk Eff.</div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 mx-auto border border-zinc-700 flex items-center justify-center text-sm font-bold text-[#1e70e2]">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Sharpe Ratio</h4>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Risk-Adjusted Return Metric</p>
          </div>
          <div className="text-sm font-black text-emerald-400 font-mono">2.84</div>
          <span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-0.5 rounded-full mx-auto border border-zinc-800">Excellent Grade</span>
        </div>

        {/* Profit Factor Card - Main Highlight */}
        <div className="bg-[#1a1a1a] border-2 border-zinc-800 rounded-2xl p-6 text-center space-y-3 order-1 md:order-2 md:h-[250px] flex flex-col justify-center relative shadow-xl shadow-blue-500/5">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1e70e2] text-white text-[10px] uppercase font-black px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Activity size={10} /> Live Efficiency
          </div>
          <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto border-2 border-[#1e70e2] flex items-center justify-center text-base font-bold text-white">
            <Percent size={22} className="text-[#1e70e2]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">Current Win Rate</h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">Calculated across 84 trades</p>
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">68.40%</div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mx-auto border border-emerald-500/20">Target: &gt;50%</span>
        </div>

        {/* Profit Factor Metric */}
        <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-2xl p-5 text-center space-y-3 order-3 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-zinc-600 font-black text-xs uppercase tracking-wider">Multiplication</div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 mx-auto border border-zinc-700 flex items-center justify-center text-sm font-bold text-white">
            <Layers size={20} className="text-zinc-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Profit Factor</h4>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Gross Profits / Gross Losses</p>
          </div>
          <div className="text-sm font-black text-emerald-400 font-mono">2.41</div>
          <span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-0.5 rounded-full mx-auto border border-zinc-800">Breakeven: 1.0</span>
        </div>
      </section>

      {/* Deep Metrics Table Grid */}
      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Advanced Performance Matrix</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Comprehensive structural breakdown of historical simulated account execution.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/30">
                <th className="py-3 px-6">Performance Statistic</th>
                <th className="py-3 px-4 text-center">Your Account Matrix</th>
                <th className="py-3 px-4 text-center">Global Benchmark Baseline</th>
                <th className="py-3 px-6 text-right">Status Evaluation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs text-zinc-300">
              {performanceStats.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/10 transition group">
                  <td className="py-4 px-6 font-semibold text-white">{row.metric}</td>
                  <td className="py-4 px-4 text-center font-bold text-white font-mono">{row.value}</td>
                  <td className="py-4 px-4 text-center text-zinc-500 font-mono">{row.industryAvg}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        row.type === 'success' 
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                          : 'text-zinc-400 bg-zinc-950 border-zinc-800'
                      }`}>
                        {row.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
const CalendarSection = () => {
  const [search, setSearch] = useState("");
  const events = [
    { time: "13:30 GMT", currency: "USD", impact: "High", event: "Core Retail Sales (MoM)", forecast: "0.2%", previous: "0.1%", restriction: "Blocked Window: 13:28 - 13:32" },
    { time: "14:45 GMT", currency: "USD", impact: "Medium", event: "Flash Manufacturing PMI", forecast: "51.4", previous: "50.7", restriction: "Monitoring Advised" },
    { time: "15:00 GMT", currency: "EUR", impact: "High", event: "ECB President Lagarde Speech", forecast: "N/A", previous: "N/A", restriction: "Blocked Window: 14:58 - 15:02" },
    { time: "23:30 GMT", currency: "AUD", impact: "Medium", event: "RBA Meeting Minutes", forecast: "N/A", previous: "N/A", restriction: "Monitoring Advised" },
    { time: "07:00 GMT", currency: "GBP", impact: "Low", event: "Public Sector Net Borrowing", forecast: "11.2B", previous: "13.4B", restriction: "Unrestricted" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Critical Action Alerts (Matches Top 3 Blocks structure) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        {/* Total Events Tracking */}
        <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-2xl p-5 text-center space-y-3 order-2 md:order-1 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-zinc-500 font-black text-xs uppercase tracking-wider">Schedule</div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 mx-auto border border-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-400">
            <Clock size={20} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Daily Macro Schedule</h4>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">Monitored Liquidity Triggers</p>
          </div>
          <div className="text-sm font-black text-white font-mono">5 Events Tracked</div>
          <span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-0.5 rounded-full mx-auto border border-zinc-800">Timezone: GMT / UTC</span>
        </div>

        {/* Center Alert - Strict Risk Banner */}
        <div className="bg-[#1a1a1a] border-2 border-zinc-800 rounded-2xl p-6 text-center space-y-3 order-1 md:order-2 md:h-[250px] flex flex-col justify-center relative shadow-xl shadow-red-500/5">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] uppercase font-black px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Flame size={10} fill="currentColor" /> Critical Safety Rule
          </div>
          <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto border-2 border-red-500 flex items-center justify-center text-base font-bold text-white">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white">2-Min Execution Rule</h3>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">Strict platform protocol enforcement</p>
          </div>
          <div className="text-sm font-black text-red-400 font-mono tracking-tight">±2 Min High Impact Windows</div>
          <span className="text-[10px] text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-full mx-auto border border-red-500/20">Violations Void Performance</span>
        </div>

        {/* Upcoming Lockout */}
        <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-2xl p-5 text-center space-y-3 order-3 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-zinc-600 font-black text-xs uppercase tracking-wider">Next Hazard</div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 mx-auto border border-zinc-700 flex items-center justify-center text-sm font-bold text-white">
            <AlertCircle size={20} className="text-amber-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">USD Core Retail Sales</h4>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">High volatility index output</p>
          </div>
          <div className="text-sm font-black text-amber-500 font-mono">In 2h 45m</div>
          <span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-0.5 rounded-full mx-auto border border-zinc-800">Action: Restrict Executions</span>
        </div>
      </section>

      {/* Main Calendar Data Table */}
      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Economic Event Feed</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Real-time macro timeline track. Blocked periods indicate operational trade suspension rules.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500"><Search size={14} /></span>
            <input type="text" placeholder="Filter currency or event..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#1e70e2] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 transition outline-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/30">
                <th className="py-3 px-6 w-28">Time</th>
                <th className="py-3 px-4 text-center w-20">Currency</th>
                <th className="py-3 px-4 text-center w-24">Impact</th>
                <th className="py-3 px-4">Macroeconomic Event</th>
                <th className="py-3 px-4 text-center w-20">Forecast</th>
                <th className="py-3 px-4 text-center w-20">Previous</th>
                <th className="py-3 px-6 text-right">Rule Restriction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs text-zinc-300">
              {events.filter(e => e.event.toLowerCase().includes(search.toLowerCase()) || e.currency.toLowerCase().includes(search.toLowerCase())).map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/10 transition group">
                  <td className="py-4 px-6 font-bold text-zinc-400 font-mono group-hover:text-white">{row.time}</td>
                  <td className="py-4 px-4 text-center font-bold text-white font-mono">{row.currency}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase border ${
                        row.impact === 'High' 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : row.impact === 'Medium' 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {row.impact}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-white">{row.event}</td>
                  <td className="py-4 px-4 text-center font-mono text-zinc-400">{row.forecast}</td>
                  <td className="py-4 px-4 text-center font-mono text-zinc-500">{row.previous}</td>
                  <td className={`py-4 px-6 text-right font-mono font-medium ${
                    row.impact === 'High' ? 'text-red-400' : 'text-zinc-500'
                  }`}>{row.restriction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
const ProfileSection = ({ userName, userInitials }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold border-2 border-zinc-700 relative shadow-inner text-white">
            {userInitials}
            <span className="absolute bottom-0 right-0 text-sm bg-zinc-900 px-1 rounded-full border border-zinc-700">🇵🇹</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">{userName}</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Trader ID: <span className="font-mono text-zinc-300">#ACG-98421</span></p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Verified Account
            </div>
          </div>
        </div>
        <button className="text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-4 py-2 rounded-xl transition">
          Change Avatar
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <User size={16} className="text-[#1e70e2]" /> Personal Details
            </h2>
            
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">First Name</label>
                <input type="text" defaultValue={userName} className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#1e70e2] focus:ring-1 focus:ring-[#1e70e2] rounded-xl px-3.5 py-2 text-sm text-white transition outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Last Name</label>
                <input type="text" defaultValue="A." className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#1e70e2] focus:ring-1 focus:ring-[#1e70e2] rounded-xl px-3.5 py-2 text-sm text-white transition outline-none" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs text-zinc-400 font-medium">Email Address</label>
                <input type="email" defaultValue="abhilash@example.com" className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-[#1e70e2] focus:ring-1 focus:ring-[#1e70e2] rounded-xl px-3.5 py-2 text-sm text-white transition outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Country</label>
                <input type="text" defaultValue="Portugal" disabled className="w-full bg-zinc-900/30 border border-zinc-800 text-zinc-500 rounded-xl px-3.5 py-2 text-sm cursor-not-allowed select-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-medium">Timezone</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#1e70e2] rounded-xl px-3.5 py-2 text-sm text-white transition outline-none cursor-pointer">
                  <option>Western European Time (GMT)</option>
                  <option>Central European Time (GMT+1)</option>
                  <option>Eastern Standard Time (GMT-5)</option>
                </select>
              </div>
              <div className="sm:col-span-2 pt-4 flex justify-end">
                <button type="submit" className="bg-[#1e70e2] hover:bg-[#1b62c9] text-white font-semibold py-2.5 px-6 rounded-xl text-xs transition shadow-lg shadow-[#1e70e2]/10 active:scale-[0.98]">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Shield size={16} className="text-[#1e70e2]" /> Security
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">Keep your simulated funding environment safe by updating credentials regularly.</p>
            <div className="pt-2 space-y-2">
              <button className="w-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-left font-medium py-2.5 px-4 rounded-xl transition text-xs flex justify-between items-center">
                <span>Change Password</span><span>→</span>
              </button>
              <button className="w-full bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 text-left font-medium py-2.5 px-4 rounded-xl transition text-xs flex justify-between items-center">
                <span>Two-Factor Auth (2FA)</span><span className="text-emerald-500 text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">Enabled</span>
              </button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Bell size={16} className="text-[#1e70e2]" /> Preferences
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-zinc-300 group-hover:text-white transition">Email notifications</span>
                <input type="checkbox" defaultChecked className="accent-[#1e70e2] rounded border-zinc-800 bg-zinc-900 h-4 w-4" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-zinc-300 group-hover:text-white transition">Weekly performance digests</span>
                <input type="checkbox" defaultChecked className="accent-[#1e70e2] rounded border-zinc-800 bg-zinc-900 h-4 w-4" />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-xs text-zinc-300 group-hover:text-white transition">Show profile on leaderboard</span>
                <input type="checkbox" className="accent-[#1e70e2] rounded border-zinc-800 bg-zinc-900 h-4 w-4" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const TradersSection = () => {
  const [search, setSearch] = useState("");
  const tradersData = [
    { name: "Alexandre Silva", flag: "🇧🇷", tier: "$200,000 Sim", win: "68%", pf: "2.41", avg: "$12,450" },
    { name: "Elena Rostova", flag: "🇩🇪", tier: "$100,000 Sim", win: "62%", pf: "1.98", avg: "$7,820" },
    { name: "Marcus Brody", flag: "🇺🇸", tier: "$200,000 Sim", win: "59%", pf: "1.82", avg: "$15,100" },
    { name: "Chen Wei", flag: "🇸🇬", tier: "$50,000 Sim", win: "74%", pf: "3.10", avg: "$4,250" },
    { name: "Amara Okafor", flag: "🇳🇬", tier: "$100,000 Sim", win: "57%", pf: "1.65", avg: "$6,900" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Active Funded Peers</p>
            <h3 className="text-2xl font-bold text-white mt-1">12,482</h3>
            <p className="text-[11px] text-emerald-500 mt-0.5 flex items-center gap-1"><span>↑ 8.2%</span> <span className="text-zinc-500">this week</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#1e70e2]"><Users size={18} /></div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Average Profit Factor</p>
            <h3 className="text-2xl font-bold text-white mt-1">1.84</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Across all qualified accounts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Percent size={18} /></div>
        </div>
        <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Total Simulated Payouts</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">$4,294,850</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">Processed since platform launch</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300"><DollarSign size={18} /></div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Verified Recent Payouts</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time simulator rewards split processing transparency.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Marek K.", amount: "$8,450", account: "$100k Challenge", flag: "🇨🇿", time: "2 mins ago" },
            { name: "Sarah L.", amount: "$14,210", account: "$200k Challenge", flag: "🇬🇧", time: "14 mins ago" },
            { name: "Diego R.", amount: "$3,120", account: "$50k Challenge", flag: "🇪🇸", time: "1 hour ago" },
            { name: "Yuki T.", amount: "$19,500", account: "$200k Challenge", flag: "🇯🇵", time: "2 hours ago" },
          ].map((payout, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2"><span className="text-sm">{payout.flag}</span><span className="text-xs font-semibold text-zinc-200">{payout.name}</span></div>
                <span className="text-[10px] text-zinc-500 font-medium">{payout.time}</span>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-400 tracking-tight">{payout.amount}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5 font-medium">{payout.account}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Funded Trader Directory</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Analyze risk alignments and metrics of verified performance models.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500"><Search size={14} /></span>
            <input type="text" placeholder="Search traders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#1e70e2] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 transition outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/20">
                <th className="py-3 px-6">Trader Name</th><th className="py-3 px-4">Account Tier</th><th className="py-3 px-4 text-center">Win Rate</th><th className="py-3 px-4 text-center">Profit Factor</th><th className="py-3 px-4 text-right">Avg Payout</th><th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs text-zinc-300">
              {tradersData.filter(t => t.name.toLowerCase().includes(search.toLowerCase())).map((trader, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/20 transition group">
                  <td className="py-4 px-6 font-medium text-white flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold border border-zinc-700">{trader.name.split(' ').map(n => n[0]).join('')}</span>
                    <div className="flex items-center gap-1.5"><span>{trader.name}</span><span>{trader.flag}</span></div>
                  </td>
                  <td className="py-4 px-4 text-zinc-400 font-mono">{trader.tier}</td>
                  <td className="py-4 px-4 text-center font-semibold text-emerald-400">{trader.win}</td>
                  <td className="py-4 px-4 text-center font-mono">{trader.pf}</td>
                  <td className="py-4 px-4 text-right font-medium text-white">{trader.avg}</td>
                  <td className="py-4 px-6 text-right">
                    <button className="inline-flex items-center gap-1 text-[11px] font-semibold bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-700 px-2.5 py-1.5 rounded-lg transition">Analyze <ArrowUpRight size={12} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="text-[10px] text-zinc-600 leading-relaxed">* All account values represent simulated evaluations matching prop-firm models.</p>
    </div>
  );
};
const AcademySection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-gradient-to-r from-[#1a1a1a] to-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#1e70e2]/10 text-[#1e70e2] text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-[#1e70e2]/20">Institutional Training Hub</div>
          <h1 className="text-xl font-bold text-white tracking-tight">ACG Elite Trading Academy</h1>
          <p className="text-xs text-zinc-400 max-w-xl">Master the algorithmic frameworks required to pass your Evaluation Challenges and scale simulated assets safely.</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 min-w-[200px] w-full md:w-auto">
          <div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-zinc-400">Curriculum Progress</span><span className="text-white">35%</span></div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden"><div className="bg-[#1e70e2] h-full w-[35%] rounded-full"></div></div>
          <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1"><Award size={12} className="text-[#1e70e2]" /> 2 of 6 Modules Completed</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Core Syllabus Packages</h2><span className="text-xs text-zinc-500">Updated for 2026 Algorithms</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1a1a1a] border border-zinc-800 hover:border-zinc-700/60 rounded-2xl p-5 flex flex-col justify-between space-y-5 transition group">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#1e70e2]"><BarChart3 size={18} /></div>
                <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded uppercase tracking-wider">Foundation</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#1e70e2] transition">1. Market Structure Principles</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Break away from retail chart patterns. Map institutional order flow trends utilizing structural shifts.</p>
              </div>
              <div className="pt-2 space-y-1.5 border-t border-zinc-800/60 text-[11px] text-zinc-300">
                <div><span className="text-emerald-500 font-bold">✓</span> Break of Structure (BOS) vs CHoCH</div>
                <div><span className="text-emerald-500 font-bold">✓</span> Swing Highs/Lows Mapping</div>
                <div className="text-zinc-600">● Multi-Timeframe Fractality alignment</div>
              </div>
            </div>
            <button className="w-full bg-[#1e70e2]/10 hover:bg-[#1e70e2] text-[#1e70e2] hover:text-white font-semibold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1">Resume Module <Play size={10} fill="currentColor" /></button>
          </div>

          <div className="bg-[#1a1a1a] border border-[#1e70e2]/40 bg-gradient-to-b from-[#1a1a1a] via-[#1a1a1a] to-[#1e70e2]/5 rounded-2xl p-5 flex flex-col justify-between space-y-5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-[#1e70e2] text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">Active</div>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Gem size={18} /></div>
                <span className="text-[10px] font-bold bg-[#1e70e2]/20 text-[#1e70e2] px-2 py-0.5 rounded uppercase tracking-wider">Advanced</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">2. Order Flow & Liquidity</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Identify where retail stops sit. Trade alongside institutional order sweeps and execution setups.</p>
              </div>
              <div className="pt-2 space-y-1.5 border-t border-zinc-800/60 text-[11px] text-zinc-300">
                <div><span className="text-[#1e70e2] font-mono">→</span> Order Blocks & Fair Value Gaps (FVG)</div>
                <div><span className="text-[#1e70e2] font-mono">→</span> Liquidity Pools & Inducement Zones</div>
                <div className="text-zinc-600">● Premium vs Discount Pricing arrays</div>
              </div>
            </div>
            <button className="w-full bg-[#1e70e2] hover:bg-[#1b62c9] text-white font-semibold py-2 rounded-xl transition text-xs flex items-center justify-center gap-1">Start Learning <Play size={10} fill="currentColor" /></button>
          </div>

          <div className="bg-[#1a1a1a] border border-zinc-800 opacity-85 rounded-2xl p-5 flex flex-col justify-between space-y-5 transition group">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><User size={18} /></div>
                <span className="text-[10px] font-bold bg-zinc-800 text-purple-400 px-2 py-0.5 rounded uppercase tracking-wider">Elite</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">3. Psychological Scale Frameworks</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Manage emotional drawdowns under strict simulated evaluation thresholds.</p>
              </div>
              <div className="pt-2 space-y-1.5 border-t border-zinc-800/60 text-[11px] text-zinc-500 space-y-1">
                <div className="flex items-center gap-1.5"><Lock size={10} /> Over-trading Regulation Systems</div>
                <div className="flex items-center gap-1.5"><Lock size={10} /> Dissociating Simulated Sizes</div>
              </div>
            </div>
            <button className="w-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-medium py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-not-allowed"><Lock size={12} /> Unlock via Phase 1</button>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Smart Money Concept (SMC) Masterclass</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Interactive algorithm trace session with certified prop evaluators.</p>
          </div>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg self-start sm:self-auto">Live Stream Tomorrow @ 15:00 GMT</span>
        </div>
        <div className="relative aspect-video rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-center items-center p-6 text-center overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="w-14 h-14 rounded-full bg-[#1e70e2] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition z-10"><Play size={20} className="ml-1" fill="currentColor" /></div>
          <div className="mt-4 max-w-sm z-10">
            <h4 className="text-xs font-bold text-white tracking-wide">Liquidity Inducement vs. True Breakouts</h4>
            <p className="text-[11px] text-zinc-400 mt-1">Watch how central algorithms trigger stop hunts prior to expansion.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
const BillingSection = ({ userName }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2"><Wallet size={16} className="text-[#1e70e2]" /> Profit Split Payout Method</h2>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded uppercase">Verified</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">Configure your destination gateway to route processed simulated reward splits.</p>
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-between hover:border-zinc-700 transition">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-white">USDT</div>
                <div>
                  <h4 className="text-xs font-bold text-white">Crypto Settlement (TRC-20)</h4>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">TR7NHqDjQ62TQ...zNpeee</p>
                </div>
              </div>
              <button className="text-[11px] font-semibold text-zinc-400 hover:text-white transition">Modify</button>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2"><CreditCard size={16} className="text-[#1e70e2]" /> Cards on file</h2>
              <button className="text-xs font-semibold text-[#1e70e2] hover:underline flex items-center gap-1"><Plus size={14} /> Add Card</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between h-28 relative overflow-hidden">
                <div className="absolute -right-3 -bottom-3 text-zinc-800/10 text-6xl font-black select-none">VISA</div>
                <div className="flex justify-between items-start"><span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-medium">Default</span><span className="text-xs font-bold text-zinc-400">•• 4242</span></div>
                <div><p className="text-[11px] text-zinc-400 font-medium">{userName} A.</p><p className="text-[10px] text-zinc-500 mt-0.5">Expires 12/28</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Fee Architecture</h2>
            <div className="space-y-3 pt-1">
              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/60">
                <div className="flex justify-between text-xs font-semibold text-white"><span>Evaluation Fees</span><span className="text-zinc-400">One-Time</span></div>
                <p className="text-[11px] text-zinc-500 mt-1">Challenge fees are structured per evaluation size. No hidden monthly subscriptions.</p>
              </div>
              <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="flex justify-between text-xs font-bold text-emerald-400"><span>Refundable Rule</span><span className="text-emerald-500 font-mono">100%</span></div>
                <p className="text-[11px] text-zinc-400 mt-1">Your baseline fee is reimbursed along with your initial certified cashout.</p>
              </div>
            </div>
            <a href="#rules" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1e70e2] hover:underline pt-1">Refund Agreement Details <ExternalLink size={12} /></a>
          </div>
        </div>
      </div>

      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-800"><h2 className="text-sm font-bold uppercase tracking-wider text-white">Invoice & Order Ledger</h2></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/20">
                <th className="py-3 px-6">Invoice ID</th><th className="py-3 px-4">Challenge Description</th><th className="py-3 px-4">Date</th><th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-right">Amount</th><th className="py-3 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs text-zinc-300">
              {[
                { id: "INV-2026-0842", desc: "$200,000 Sim evaluation allocation", date: "June 14, 2026", status: "Paid", price: "$1,089.00" },
                { id: "INV-2026-0211", desc: "$50,000 Sim evaluation allocation", date: "Jan 08, 2026", status: "Paid", price: "$329.00" },
              ].map((inv, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/10 transition">
                  <td className="py-4 px-6 font-mono font-medium text-white">{inv.id}</td>
                  <td className="py-4 px-4 text-zinc-400 font-medium">{inv.desc}</td>
                  <td className="py-4 px-4 text-zinc-500">{inv.date}</td>
                  <td className="py-4 px-4 text-center"><span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">{inv.status}</span></td>
                  <td className="py-4 px-4 text-right font-semibold text-white">{inv.price}</td>
                  <td className="py-4 px-6 text-right"><button className="p-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-zinc-700 transition"><Download size={13} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
const LeaderboardSection = () => {
  const [search, setSearch] = useState("");
  const rankings = [
    { rank: 4, name: "Sarah Jenkins", country: "GB", size: "$200,000", rr: "1:2.4", consistency: "84%", profit: "+$9,820.00" },
    { rank: 5, name: "Amir Al-Sayed", country: "AE", size: "$100,000", rr: "1:3.1", consistency: "79%", profit: "+$8,410.00" },
    { rank: 6, name: "Hans Müller", country: "DE", size: "$200,000", rr: "1:1.9", consistency: "91%", profit: "+$7,900.00" },
    { rank: 7, name: "Lucia Rossi", country: "IT", size: "$50,000", rr: "1:2.8", consistency: "73%", profit: "+$4,890.00" },
    { rank: 8, name: "Chen Zhang", country: "CN", size: "$100,000", rr: "1:2.2", consistency: "88%", profit: "+$4,120.00" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
        <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-2xl p-5 text-center space-y-3 order-2 md:order-1 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-zinc-500 font-black text-xl">#2</div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 mx-auto border border-zinc-700 flex items-center justify-center text-sm font-bold relative text-white">
            JD
            <span className="absolute -bottom-1 -right-1 shadow-md"><ReactCountryFlag countryCode="US" svg style={{ width: '16px', height: '16px', borderRadius: '2px' }} /></span>
          </div>
          <div><h4 className="text-xs font-bold text-white">Jonathan Doe</h4><p className="text-[11px] text-zinc-400 font-mono mt-0.5">$200k Sim Account</p></div>
          <div className="text-sm font-black text-emerald-400 font-mono">+$24,150.00</div>
          <span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-0.5 rounded-full mx-auto border border-zinc-800">Gain: +12.07%</span>
        </div>

        <div className="bg-[#1a1a1a] border-2 border-zinc-800 rounded-2xl p-6 text-center space-y-3 order-1 md:order-2 md:h-[250px] flex flex-col justify-center relative shadow-xl shadow-blue-500/5">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1e70e2] text-white text-[10px] uppercase font-black px-3 py-0.5 rounded-full tracking-wider flex items-center gap-1"><Trophy size={10} fill="currentColor" /> Champion</div>
          <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto border-2 border-[#1e70e2] flex items-center justify-center text-base font-bold relative text-white">
            MT
            <span className="absolute -bottom-1 -right-1 shadow-lg"><ReactCountryFlag countryCode="PT" svg style={{ width: '18px', height: '18px', borderRadius: '2px' }} /></span>
          </div>
          <div><h3 className="text-sm font-black text-white">Miguel Torres</h3><p className="text-xs text-zinc-400 font-mono mt-0.5">$200k Sim Account</p></div>
          <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">+$38,420.00</div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mx-auto border border-emerald-500/20">Gain: +19.21%</span>
        </div>

        <div className="bg-[#1a1a1a] border border-zinc-800/80 rounded-2xl p-5 text-center space-y-3 order-3 relative md:h-[220px] flex flex-col justify-center">
          <div className="absolute top-4 left-4 text-zinc-600 font-black text-xl">#3</div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 mx-auto border border-zinc-700 flex items-center justify-center text-sm font-bold relative text-white">
            IK
            <span className="absolute -bottom-1 -right-1 shadow-md"><ReactCountryFlag countryCode="JP" svg style={{ width: '16px', height: '16px', borderRadius: '2px' }} /></span>
          </div>
          <div><h4 className="text-xs font-bold text-white">Itsuki Kuroki</h4><p className="text-[11px] text-zinc-400 font-mono mt-0.5">$100k Sim Account</p></div>
          <div className="text-sm font-black text-emerald-400 font-mono">+$11,940.00</div>
          <span className="text-[10px] text-zinc-500 font-medium bg-zinc-950 px-2 py-0.5 rounded-full mx-auto border border-zinc-800">Gain: +11.94%</span>
        </div>
      </section>

      <section className="bg-[#1a1a1a] rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Payout Cycle Standings</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Live performance updates for active certified evaluation accounts.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500"><Search size={14} /></span>
            <input type="text" placeholder="Search ranked traders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#1e70e2] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 transition outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/60 text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-900/30">
                <th className="py-3 px-6 text-center w-16">Rank</th><th className="py-3 px-4">Trader</th><th className="py-3 px-4 text-center">Country</th><th className="py-3 px-4">Account Size</th><th className="py-3 px-4 text-center">Avg R:R</th><th className="py-3 px-4 text-center">Consistency</th><th className="py-3 px-6 text-right">Sim Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs text-zinc-300">
              {rankings.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/10 transition group">
                  <td className="py-4 px-6 text-center font-bold text-zinc-400 font-mono group-hover:text-white">{row.rank}</td>
                  <td className="py-4 px-4 font-semibold text-white">{row.name}</td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <ReactCountryFlag countryCode={row.country} svg style={{ width: '18px', height: '13px', borderRadius: '1.5px' }} />
                    </div>
                  </td>
                  <td className="py-4 px-4 text-zinc-400 font-mono">{row.size}</td>
                  <td className="py-4 px-4 text-center font-mono text-zinc-400">{row.rr}</td>
                  <td className="py-4 px-4 text-center"><div className="flex items-center justify-center gap-1"><Zap size={11} className="text-[#1e70e2]" /><span className="font-semibold text-zinc-300">{row.consistency}</span></div></td>
                  <td className="py-4 px-6 text-right font-black text-emerald-400 font-mono">{row.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const navItems = [
  { id: 'overview', name: 'Accounts Overview', icon: LayoutDashboard },
  { id: 'analytics', name: 'Advanced Metrics', icon: BarChart3 }, 
  { id: 'calendar', name: 'Economic Calendar', icon: Clock },     
  { id: 'traders', name: 'Traders', icon: Users },
  { id: 'academy', name: 'Academy', icon: GraduationCap },
  { id: 'billing', name: 'Billing', icon: CreditCard },
  { id: 'leaderboard', name: 'Leaderboard', icon: Trophy },
  { id: 'profile', name: 'Profile Settings', icon: User },
];



export default function Dashboard({onBack}) {
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isOpen, setIsOpen] = useState(false);

  const userInitials = "AA";
  const userName = "Abhilash";
  const traderCount = "264,000+";






 // Define the view contents based on the selected tab
// Define the view contents based on the selected tab
  const renderTabContent = () => {
    // Pass down common user states and state setters from your global scope
    const propsPayload = { userName, userInitials, setActiveTab };

    switch (activeTab) {
      case 'overview':
        return <OverviewSection {...propsPayload} />;

      case 'analytics':
        return <AnalyticsSection />;

      case 'calendar':
        return <CalendarSection />;

      case 'traders':
        return <TradersSection />;

      case 'academy':
        return <AcademySection />;

      case 'billing':
        return <BillingSection {...propsPayload} />;

      case 'leaderboard':
        return <LeaderboardSection />;

      case 'profile':
        return <ProfileSection {...propsPayload} />;

      default:
        return null;
    }
  };

  const formatBreadcrumb = (str) => {
    if (str === 'overview') return 'Accounts overview';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;

    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-200 font-sans flex flex-col antialiased">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <header className="bg-[#1a1a1a] border-b border-zinc-800 sticky top-0 z-50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center gap-2 font-bold text-lg text-white tracking-wider">
           <img src={acg} width={80} />
          </div>
        </div>

        <div className="relative">
  <button
    onClick={() => setIsOpen(!isOpen)}
    className="flex items-center gap-2.5 rounded-full border border-zinc-700/60 bg-zinc-800/40 p-1.5 pr-3 backdrop-blur-sm transition-all hover:bg-zinc-800/60 hover:border-zinc-600"
  >
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-600 bg-zinc-700 text-xs font-semibold tracking-wider text-white">
      {userInitials}
    </div>

    <span className="hidden text-sm font-medium text-gray-300 md:inline">
      {userName}
    </span>

    <svg
      className={`h-4 w-4 text-gray-400 transition-transform ${
        isOpen ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {isOpen && (
    <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-900/95 backdrop-blur-xl shadow-2xl z-50">
      <div className="border-b border-zinc-800 px-4 py-3">
        <p className="text-sm font-medium text-white">{userName}</p>
        <p className="text-xs text-gray-500">
          {userInitials}
        </p>
      </div>

      <button
        onClick={() => {
          setIsOpen(false);
          onBack();
        }}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-zinc-800/70"
      >
        <span className="text-base">🏠</span>
        Homepage
      </button>

      <div className="mx-3 border-t border-zinc-800" />

      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-400 transition-colors hover:bg-red-500/10"
      >
        <span className="text-base">🚪</span>
        Logout
      </button>
    </div>
  )}
</div>
      </header>

      <div className="flex flex-1 relative">
        
        {/* --- SIDE NAVIGATION --- */}
        <aside className={`
          fixed md:static inset-y-0 left-0 top-16 md:top-0 z-40
          w-64 bg-[#1a1a1a] border-r border-zinc-800
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
          transition-transform duration-200 ease-in-out flex flex-col justify-between
        `}>
          <div className="p-4 space-y-6">
            <button 
              onClick={() => {
                setActiveTab('overview');
                setIsSidebarOpen(false);
              }}
              className="w-full bg-[#1e70e2] hover:bg-[#1b62c9] text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition active:scale-[0.98] text-sm"
            >
              New Challenge
            </button>

            <div>
              <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2">Main menu</p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        isActive 
                          ? 'bg-[#1e70e2]/10 text-[#1e70e2] border-l-2 border-[#1e70e2] rounded-l-none' 
                          : 'text-gray-400 hover:bg-zinc-800/50 hover:text-gray-200'
                      }`}
                    >
                      <Icon size={18} className={isActive ? 'text-[#1e70e2]' : 'text-gray-400'} />
                      {item.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          
          <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 flex items-center justify-between">
            <span>v2.4.1-stable</span>
            <ChevronDown size={14} />
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 top-16 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          />
        )}

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-6xl mx-auto w-full space-y-8">
          {/* Dynamic Breadcrumbs */}
         {/* <nav className="text-xs text-zinc-500 flex items-center gap-2">
            <span onClick={() => setActiveTab('overview')} className="hover:text-zinc-300 cursor-pointer">Trader</span>
            <span>/</span>
            <span className="text-zinc-400">{formatBreadcrumb(activeTab)}</span> 
          </nav> */}

          {/* Conditional Layout Injection */}
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}