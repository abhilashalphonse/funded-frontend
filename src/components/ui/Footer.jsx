import React from 'react';
import logo from '../../assets/ACG.png';

const FOOTER_LINKS = [
  { label: 'Challenges', href: '#challenges' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Support', href: '#support' },
  { label: 'Email', href: 'mailto:support@acgforex.com' },
  { label: 'Phone', href: 'tel:+420910920310' },
];

export default function Footer() {
  return (
    <footer className="bg-[#05060A] border-t border-white/[0.08] pt-16 pb-10">
      <div className="max-w-[1224px] mx-auto px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between mb-14">
          <div className="space-y-4">
            <a href="#top" className="inline-flex items-center gap-2" aria-label="Back to top">
              <img src={logo} width={80} alt="ACG Funded" />
            </a>
            <p className="text-[#888888] text-sm max-w-[300px] leading-relaxed">
              Institutional-grade trading infrastructure. Built for clarity, speed, and precision.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#888888] hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="pt-8 border-t border-white/[0.08]">
          <p className="text-[11px] text-[#666666] max-w-2xl leading-relaxed">
            © 2026 ACG Forex Technologies Ltd. All rights reserved. Trading financial instruments involves significant risk.
            Past performance is not indicative of future results. Please ensure you fully understand the risks involved.
          </p>
        </div>
      </div>
    </footer>
  );
}
