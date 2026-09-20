import React, { useEffect } from 'react';
import logo from '../../assets/ACG.png';
import Footer from './Footer';
import TermsAndConditions from './TermsAndConditions';

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
      <>
        <p><strong>Effective Date:</strong> 01/06/2025</p>
        <p><strong>Last Updated:</strong> 01/06/2025</p>

        <p>
          At ACG Funded, we are committed to delivering a high standard of service to all of our
          users. We recognize that, from time to time, things may go wrong. When that happens, we
          want to hear about it and have the opportunity to put things right as quickly as
          possible. This Complaints Policy outlines how you can raise a complaint, how we will
          handle it, and what you can expect from us.
        </p>

        <h2>1. Who Can Make a Complaint</h2>
        <p>Any individual or entity who has interacted with ACG Funded, including but not limited to:</p>
        <ul>
          <li>Registered platform users (funded or evaluation phase)</li>
          <li>Prospective clients</li>
          <li>Business partners</li>
          <li>General website visitors</li>
        </ul>

        <h2>2. What Constitutes a Complaint</h2>
        <p>
          We define a complaint as: “Any expression of dissatisfaction, whether oral or written,
          and whether justified or not, regarding a service, decision, or outcome provided by
          ACG Funded.”
        </p>
        <p>This may include, but is not limited to:</p>
        <ul>
          <li>Disputes over challenge results or evaluation outcomes</li>
          <li>Platform performance or technical issues</li>
          <li>Account suspensions or terminations</li>
          <li>Disagreement with billing or fees</li>
          <li>Concerns over communication or customer service</li>
        </ul>

        <h2>3. How to Submit a Complaint</h2>
        <p><strong>Online Submission (Preferred)</strong></p>
        <p>
          Use the Contact Support form on the ACG Funded website or email us at{' '}
          <a href="mailto:support@acgfunded.com">support@acgfunded.com</a>.
        </p>
        <p>Please include:</p>
        <ul>
          <li>Your full name</li>
          <li>Email address used for registration</li>
          <li>Account ID (if applicable)</li>
          <li>Detailed description of the issue</li>
          <li>Any supporting documentation or screenshots</li>
        </ul>
        <p>Please ensure you include a return email address or phone number.</p>

        <h2>4. What Happens Next</h2>
        <ul>
          <li><strong>Acknowledgement:</strong> You will receive an acknowledgment within 2 business days.</li>
          <li><strong>Investigation:</strong> We aim to resolve complaints within 10 business days. If more time is required, we will inform you.</li>
          <li><strong>Resolution:</strong> We will provide a fair outcome and any corrective actions.</li>
          <li><strong>Appeals:</strong> If dissatisfied, you may request an internal review within 10 business days of receiving our response.</li>
        </ul>

        <h2>5. Record-Keeping and Confidentiality</h2>
        <p>
          All complaints are treated with confidentiality and stored securely. Records are kept
          for a minimum of five (5) years.
        </p>

        <h2>6. External Review or Mediation</h2>
        <p>
          ACG Funded is not a regulated financial institution. If you remain unsatisfied, you may
          seek independent advice or escalate the matter through any applicable dispute-resolution
          process described in our Terms &amp; Conditions.
        </p>

        <h2>7. Our Commitment to You</h2>
        <p>We aim to:</p>
        <ul>
          <li>Handle all complaints fairly and transparently</li>
          <li>Respond promptly and professionally</li>
          <li>Learn from complaints to improve our services</li>
        </ul>

        <p>ACG Funded Team.</p>
      </>
    ),
  },
  '/legal/terms-and-conditions': {
    title: 'Terms & Conditions',
    content: <TermsAndConditions />,
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
              [&_h2]:pt-7 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-white
              [&_h3]:pt-5 [&_h3]:text-[15px] [&_h3]:font-semibold [&_h3]:text-white
              [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2
              [&_li]:pl-1
              [&_strong]:font-semibold [&_strong]:text-[#E7E9ED]
              [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4
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
