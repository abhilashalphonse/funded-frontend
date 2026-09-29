import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Printer, X } from "lucide-react";
import acg from "../../assets/ACG.png";

const usd = value => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(Number(value) || 0);

const paidDate = value => {
  const date = new Date(value || 0);
  if (!Number.isFinite(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export default function PayoutCertificateModal({ payout, onClose }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = event => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!payout || String(payout.status || "").toUpperCase() !== "PAID") return null;

  const reference = payout.reference?.txHash
    || payout.reference?.utr
    || payout.reference?.providerReference
    || payout.payoutId;

  return createPortal(
    <div className="fixed inset-0 z-[150] grid place-items-center overflow-y-auto bg-black/85 p-3 backdrop-blur-sm sm:p-6">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #acg-payout-certificate, #acg-payout-certificate * { visibility: visible !important; }
          #acg-payout-certificate {
            position: fixed !important;
            inset: 0 !important;
            width: 100vw !important;
            min-height: 100vh !important;
            margin: 0 !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .acg-certificate-controls { display: none !important; }
        }
      `}</style>

      <button type="button" aria-label="Close certificate" onClick={onClose} className="absolute inset-0" />

      <div className="relative w-full max-w-[880px]">
        <div className="acg-certificate-controls mb-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.1] bg-[#111] px-3 text-[10px] font-semibold text-zinc-200 hover:bg-white/[0.06]"
          >
            <Printer size={13} />
            Print / Save PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-lg border border-white/[0.1] bg-[#111] text-zinc-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        <article
          id="acg-payout-certificate"
          className="relative overflow-hidden rounded-[26px] border border-white/[0.12] bg-[#050505] px-6 py-8 text-white sm:px-12 sm:py-12"
        >
          <div className="absolute inset-x-0 top-0 h-[3px] bg-[#195be1]" />
          <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full border border-[#195be1]/15" />
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full border border-white/[0.05]" />

          <header className="relative flex items-start justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={acg} alt="ACG" className="h-8 w-auto object-contain sm:h-10" />
              <div className="h-7 w-px bg-white/[0.12]" />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#777]">ACG Funded</div>
                <div className="mt-0.5 text-[9px] text-[#4f4f4f]">Verified payout record</div>
              </div>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.15em] text-emerald-300">
              Paid
            </span>
          </header>

          <div className="relative mt-16 sm:mt-20">
            <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#5d75ad]">Payout certificate</span>
            <h1 className="mt-4 max-w-2xl text-[clamp(2rem,7vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
              Trading performance.<br />
              <span className="text-[#777]">Reward delivered.</span>
            </h1>

            <div className="mt-12 sm:mt-16">
              <span className="block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#555]">Payout amount</span>
              <strong className="mt-2 block font-mono text-[clamp(2.5rem,9vw,5.6rem)] font-semibold leading-none tracking-[-0.065em] text-white">
                {usd(payout.requestedAmountUsd)}
              </strong>
            </div>
          </div>

          <div className="relative mt-12 grid gap-3 border-t border-white/[0.08] pt-6 sm:grid-cols-2 lg:grid-cols-4">
            <CertificateField label="Account" value={payout.accountId || "—"} />
            <CertificateField label="Paid on" value={paidDate(payout.paidAt)} />
            <CertificateField label="Method" value={payout.method || "—"} />
            <CertificateField label="Payout ID" value={payout.payoutId || "—"} mono />
          </div>

          <div className="relative mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="block text-[8px] font-semibold uppercase tracking-[0.14em] text-[#444]">Settlement reference</span>
              <span className="mt-1.5 block max-w-xl truncate font-mono text-[9px] text-[#777]">{reference || "—"}</span>
            </div>
            <div className="shrink-0 text-left sm:text-right">
              <span className="block text-[8px] uppercase tracking-[0.14em] text-[#444]">Recorded by</span>
              <span className="mt-1 block text-[10px] font-semibold text-[#888]">ACG Funded</span>
            </div>
          </div>
        </article>
      </div>
    </div>,
    document.body,
  );
}

function CertificateField({ label, value, mono = false }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-[#090909] px-4 py-3.5">
      <span className="block text-[8px] font-semibold uppercase tracking-[0.13em] text-[#4f4f4f]">{label}</span>
      <strong className={`mt-1.5 block truncate text-[10px] font-semibold text-[#aaa] ${mono ? "font-mono" : ""}`}>{value}</strong>
    </div>
  );
}
