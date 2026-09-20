import React from 'react';
import logo from '../../assets/ACG.png';

const FOOTER_LINKS = [
  { label: 'Challenges', href: '#challenges' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Support', href: '#support' },
  { label: 'Email', href: 'mailto:support@acgforex.com' },
  { label: 'Phone', href: 'tel:+420910920310' },
];

const LEGAL_LINKS = [
  { label: 'Funded Account Disclaimer', href: '/legal/funded-account-disclaimer' },
  { label: 'Refund Policy', href: '/legal/refund-policy' },
  { label: 'Complaints Policy', href: '/legal/complaints-policy' },
  { label: 'Terms & Conditions', href: '/legal/terms-and-conditions' },
  { label: 'Privacy Policy', href: '/legal/privacy-policy' },
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

        <section
          aria-labelledby="footer-disclaimer-title"
          className="rounded-2xl border border-white/[0.07] bg-white/[0.025] px-5 py-6 sm:px-7 sm:py-7"
        >
          <h2
            id="footer-disclaimer-title"
            className="text-[12px] font-semibold tracking-[-0.01em] text-[#8E8E93]"
          >
            Disclaimer:
          </h2>

          <div className="mt-4 space-y-4 text-[11px] leading-[1.7] text-[#666A73] sm:text-[12px]">
            <p>
              ACG Funded, operated by ACG Forex Technologies Ltd., provides trading evaluation,
              education, technology and simulated funded-account services. Information made
              available through ACG Funded is for general informational purposes only and does
              not constitute investment advice, financial advice, an offer, recommendation or
              solicitation to buy or sell any financial instrument.
            </p>

            <p>
              ACG Funded is not a broker, investment adviser or financial institution and does
              not accept client deposits for investment or trading. Trading decisions are made
              solely by each participant, and participation in an ACG Funded program does not
              create a brokerage, investment-management or advisory relationship.
            </p>

            <p>
              Accounts used in ACG Funded evaluations and funded programs are simulated accounts
              using virtual funds unless expressly stated otherwise. Results generated in a
              simulated environment are hypothetical and have inherent limitations. They may
              differ materially from results that could be achieved in live market conditions
              because simulated trading may not reflect factors such as liquidity, slippage,
              execution latency, market impact, spreads or other real-world trading conditions.
            </p>

            <p>
              Trading leveraged products involves substantial risk. Past or simulated performance
              is not indicative of future results, and no representation is made that any
              participant will achieve profits or avoid losses. ACG Funded services may not be
              available in every jurisdiction, and users are responsible for ensuring that their
              participation is permitted under the laws and regulations applicable to them.
            </p>
          </div>
        </section>

        <nav
          aria-label="Legal"
          className="mt-7 border-b border-white/[0.08] pb-8"
        >
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[12px] font-medium text-[#777B84] transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-8">
          <p className="text-[11px] text-[#565A63] max-w-2xl leading-relaxed">
            © 2026 ACG Forex Technologies Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
