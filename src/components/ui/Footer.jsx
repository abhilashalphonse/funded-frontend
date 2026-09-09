import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import logo from '../../assets/ACG.png';
export default function Footer() {
  return (
    <footer className="bg-[#05060A] border-t border-white/[0.08] pt-20 pb-10">
      <div className="max-w-[1224px] mx-auto px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
               <img src={logo} width={80} />
            </div>
            <p className="text-[#888888] text-sm max-w-[240px] leading-relaxed">
              Institutional-grade trading infrastructure. Built for clarity, speed, and precision.
            </p>
          </div>

          {/* Links Columns */}
          {[
            { title: "Platform", links: ["Dashboard", "Markets", "Pricing", "API"] },
            { title: "Company", links: ["About", "Careers", "Security", "Press"] },
            { title: "Support", links: ["Help Center", "Status", "Contact", "Documentation"] },
            { title: "Legal", links: ["Privacy", "Terms", "Risk Disclosure", "Compliance"] }
          ].map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-[#888888] hover:text-white transition-colors duration-200 flex items-center gap-1">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Trust/Compliance Strip */}
        <div className="pt-10 border-t border-white/[0.08] space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <p className="text-[11px] text-[#666666] max-w-2xl leading-relaxed">
              © 2026 ACG Forex Technologies Ltd. All rights reserved. Trading financial instruments involves significant risk. 
              Past performance is not indicative of future results. Please ensure you fully understand the risks involved.
            </p>
            <div className="flex items-center gap-6 text-[11px] text-[#666666]">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}