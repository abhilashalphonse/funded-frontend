import React, { useEffect } from 'react';
import logo from '../../assets/ACG.png';
import Footer from './Footer';

const LEGAL_PAGES = {
  '/legal/funded-account-disclaimer': {
    title: 'Funded Account Disclaimer',
    content: (
      <>
        <p>
          Simulated results do not represent actual trading and trading results have certain
          limitations. Trades have not actually been executed, and no portrayal is being made
          that any account will, or is likely to, achieve a profit or a loss.
        </p>
        <p>
          ACG Funded Trader accounts are not live trading accounts. They are fully simulated
          accounts utilizing real market quotes from liquidity providers.
        </p>
      </>
    ),
  },
  '/legal/refund-policy': {
    title: 'Refund Policy',
    content: (
      <>
        <p>
          The Company may provide products, services, subscriptions, or access to certain portions
          of the Company website at a monetary cost. Prices and availability are subject to change
          without notice. The Company may allow for such purchases within its website or via a
          white-label affiliate. It is your responsibility to thoroughly read and understand any
          applicable terms and conditions. By making such purchases, you agree that the Company
          has no responsibility and acquires no liability for claims related to your purchases
          except where required by applicable law.
        </p>
        <p>
          Upon completion of an approved transaction, the purchased product, service, subscription,
          or access will be made available to you.
        </p>
        <p>
          There are no refunds on Services purchased from the Company. You pay a one-time fee for
          an attempt at an Evaluation. The provision of this Evaluation is a service and begins
          immediately upon purchase. All transactions are final except where a refund is required
          by applicable law.
        </p>

        <h2>Dispute Policy</h2>
        <p>
          Clients who improperly dispute charges or request chargebacks may have their access to
          the Platform suspended or terminated. If you believe a charge was made in error, please
          contact ACG Funded support before initiating a payment dispute.
        </p>

        <h2>Acceptance of this Policy</h2>
        <p>
          It is your responsibility to familiarize yourself with this Refund Policy. By placing an
          order for any of our products or services, you indicate that you have read this Refund
          Policy and agree to its terms. If you do not agree with this Refund Policy, please do not
          place an order with us.
        </p>
      </>
    ),
  },
  '/legal/complaints-policy': {
    title: 'Complaints Policy',
    content: (
      <p>
        The ACG Funded Complaints Policy will be published here. For assistance in the meantime,
        please contact support@acgforex.com.
      </p>
    ),
  },
  '/legal/terms-and-conditions': {
    title: 'Terms & Conditions',
    content: (
      <p>
        The ACG Funded Terms & Conditions will be published here before the service is made
        generally available.
      </p>
    ),
  },
  '/legal/privacy-policy': {
    title: 'Privacy Policy',
    content: (
      <p>
        The ACG Funded Privacy Policy will be published here before the service is made generally
        available.
      </p>
    ),
  },
};

export function getLegalPage(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return LEGAL_PAGES[normalized] || null;
}

export default function LegalPage({ page }) {
  useEffect(() => {
    document.title = `${page.title} | ACG Funded`;
    window.scrollTo({ top: 0, behavior: 'auto' });

    return () => {
      document.title = 'ACG Funded';
    };
  }, [page.title]);

  return (
    <div className="min-h-screen bg-[#05060A] text-white">
      <header className="border-b border-white/[0.08]">
        <div className="mx-auto flex max-w-[1224px] items-center justify-between px-6 py-5">
          <a href="/" aria-label="ACG Funded home">
            <img src={logo} width={82} alt="ACG Funded" />
          </a>
          <a
            href="/"
            className="text-[13px] font-medium text-[#969AA3] transition-colors hover:text-white"
          >
            Back to ACG Funded
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-16 sm:py-20">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7C818C]">
          Legal
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
          {page.title}
        </h1>

        <article className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-7 sm:px-9 sm:py-9">
          <div
            className="
              space-y-5 text-[14px] leading-7 text-[#A4A8B1]
              [&_h2]:pt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-white
            "
          >
            {page.content}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
