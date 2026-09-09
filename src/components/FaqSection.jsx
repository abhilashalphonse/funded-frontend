import React, { useState } from 'react';

export default function FaqSection() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFaq, setOpenFaq] = useState(0);

  const categories = [
    { id: 'general', label: 'Evaluation Mechanics', icon: '⚡' },
    { id: 'accounts', label: 'Platform & Accounts', icon: '🖥️' },
    { id: 'rules', label: 'Risk Parameters', icon: '🛡️' },
  ];

  const faqData = {
    general: [
      {
        question: "How do I become an ACG Funded Trader?",
        answer: "To secure a funded balance, you must successfully pass our structural evaluation process. Prove your baseline consistency across simulated trading parameters, hitting execution benchmarks while adhering strictly to maximum daily and trailing drawdown thresholds."
      },
      {
        question: "How do I start my first evaluation challenge?",
        answer: "Select your customized account tier scale from our main dashboard panel, select your target platform interface (MT4, MT5, or cTrader), and complete checkout. Your institutional evaluation nodes are configured instantly and sent to your portal."
      },
      {
        question: "I have successfully passed—what are my immediate next steps?",
        answer: "Once our automated data verification process logs your pass parameters, you will clear KYC verification directly in your backend workspace and review your funding contract agreement. Funded setups are dispatched to live routing structures within hours."
      }
    ],
    accounts: [
      {
        question: "Can I modify my execution platform or account type?",
        answer: "Platform architecture assignments are permanent once an evaluation step is actively initialized. However, before executing your first simulated market order, you can toggle parameters or reset configurations instantly from your node matrix dashboard."
      },
      {
        question: "Are multi-account allocations or optimization pools supported?",
        answer: "Yes. Enterprise traders can scale operations up to our maximum capital aggregation limits by combining multiple funding setups into a unified execution route via our master allocation dashboard panel."
      }
    ],
    rules: [
      {
        question: "Do I have to close my positions overnight or before the weekend?",
        answer: "Position holding limits depend heavily on your selected account tier blueprint. Standard challenge models require flattening exposures prior to weekend margin closures, while premium swing-tier allocations grant full freedom for extended posture holding."
      },
      {
        question: "What exactly happens if a max daily loss limit is breached?",
        answer: "Our liquidity guardrails track equity fluctuations in real time. If a risk boundary is crossed, live terminal permissions are locked automatically to prevent compounding capital drawdowns. Residual validation credits can be processed at your desk panel."
      }
    ]
  };

  return (
    <section id="faq" className="dark bg-[#090A0F] py-24 md:py-32 px-4 sm:px-8 lg:px-16 font-sans overflow-hidden relative">
      {/* High-fidelity ambient dynamic light rings */}
      <div className="absolute left-10 top-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none select-none animate-pulse" />
      <div className="absolute right-10 bottom-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none select-none" />

      {/* Structured core bounding frame constrained to exactly 1224px max width */}
      <div className="container mx-auto max-w-[1224px] space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col justify-start items-center w-full gap-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-bold tracking-widest text-blue-400 uppercase">
            💬 Knowledge Base
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-xl">
            Have queries regarding parameters or scaling rules? Explore our centralized routing directories or contact live desk support below.
          </p>
        </div>

        {/* Master Workspace Container Layout Box */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 bg-gradient-to-b from-[#11131F]/60 to-[#0A0B10]/95 rounded-3xl border border-gray-800/80 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] group transition-all duration-500 hover:border-gray-700/60 min-h-[580px]">
          
          {/* Subtle Top-edge Linear Highlight Glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* LEFT COLUMN: Segmented Control Hub & Live Desk Telemetry */}
          <div className="lg:col-span-4 bg-slate-950/40 border-b lg:border-b-0 lg:border-r border-gray-800/60 p-6 sm:p-8 flex flex-col justify-between space-y-8">
            
            <div className="space-y-4">
              <p className="text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                Directory Filter
              </p>
              {/* Category Selection Stack */}
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenFaq(0); // Reset accordion index on change
                    }}
                    className={`w-full p-4 rounded-xl border font-semibold text-xs tracking-wide transition-all duration-300 flex items-center gap-3.5 ${
                      activeCategory === cat.id
                        ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-lg shadow-blue-950/20 translate-x-1'
                        : 'bg-[#121420]/30 border-gray-800/80 text-gray-400 hover:text-white hover:border-gray-700 hover:bg-[#161929]/50'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Infrastructure Widget to boost page value metrics */}
            <div className="p-4 rounded-2xl bg-[#11131F]/40 border border-gray-800/60 relative overflow-hidden space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-medium text-gray-300">Live Risk Desk</span>
                </div>
                <span>99.8% Efficiency</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal">
                Can't find structural solutions? Reach out via our global chat matrix system.
              </p>
              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-[10px] font-bold uppercase tracking-wider text-white transition-all duration-300 shadow-md">
                Initialize Instant Chat
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Hardware-Accelerated Interactive Accordion Deck */}
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-center space-y-4">
            {faqData[activeCategory].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#131626]/40 border-blue-500/30 shadow-xl shadow-black/40'
                      : 'bg-[#11131F]/20 border-gray-800/60 hover:border-gray-700/80 hover:bg-[#131626]/20'
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center gap-4 transition-colors group/trigger"
                  >
                    <h3 className={`text-sm sm:text-base font-bold tracking-tight transition-colors duration-300 ${
                      isOpen ? 'text-blue-400' : 'text-white group-hover/trigger:text-blue-400'
                    }`}>
                      {faq.question}
                    </h3>
                    
                    {/* Premium Interactive Toggle Node */}
                    <div className={`flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                      isOpen 
                        ? 'bg-blue-500/20 border-blue-400 text-blue-400 rotate-180' 
                        : 'bg-gray-900 border-gray-800 text-gray-500 group-hover/trigger:text-gray-300 group-hover/trigger:border-gray-700'
                    }`}>
                      <svg className="w-3 h-3 fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Accordion Content Container with smooth transition mechanics */}
                  <div className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[300px] border-t border-gray-800/40 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                  }`}>
                    <div className="p-5 text-xs sm:text-sm text-gray-400 leading-relaxed font-normal bg-slate-950/20">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Global Footer Subtext Link */}
        <div className="text-center">
          <p className="text-xs text-gray-500 font-mono">
            Looking for something else?{' '}
            <a href="#all-faqs" className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 transition-colors">
              Access entire framework index
            </a>
          </p>
        </div>

      </div>
    </section>
  );
}