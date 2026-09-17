import React, { useEffect, useState } from 'react';
import { Check, Loader2, RefreshCw } from 'lucide-react';
import acg from '../assets/ACG.png';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function PaymentReturn({ paymentId, onActivated, onContinue }) {
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!paymentId) return undefined;
    let active = true;
    let timer;

    const check = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payments/${encodeURIComponent(paymentId)}/status`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.message || 'Unable to verify payment.');
        if (!active) return;
        const next = payload?.data || null;
        setPayment(next);
        setError('');

        if (next?.status === 'PAID' && next?.accountId) {
          await onActivated?.(next);
          return;
        }

        if (!['FAILED', 'EXPIRED', 'UNDERPAID', 'REFUNDED'].includes(next?.status)) {
          timer = window.setTimeout(check, 3000);
        }
      } catch (nextError) {
        if (!active) return;
        setError(nextError.message || 'Unable to verify payment.');
        timer = window.setTimeout(check, 5000);
      }
    };

    void check();
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [paymentId, onActivated]);

  const status = payment?.status || 'CONFIRMING';
  const activated = status === 'PAID' && Boolean(payment?.accountId);
  const failed = ['FAILED', 'EXPIRED', 'UNDERPAID', 'REFUNDED'].includes(status);

  return <div className="min-h-screen bg-black text-white antialiased">
    <header className="flex h-14 items-center border-b border-[#222] px-5 sm:px-7"><img src={acg} alt="ACG Funded" className="h-5 w-auto" /></header>
    <main className="mx-auto flex min-h-[calc(100vh-56px)] max-w-2xl items-center px-5 py-10">
      <section className="w-full rounded-2xl border border-[#242424] bg-[#090909] p-7 sm:p-9">
        <div className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl border ${activated ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : failed ? 'border-red-500/20 bg-red-500/10 text-red-400' : 'border-[#2A2A2A] bg-[#111] text-[#AAA]'}`}>
          {activated ? <Check size={20} /> : <Loader2 size={20} className={failed ? '' : 'animate-spin'} />}
        </div>
        <div className="text-[10px] uppercase tracking-[0.17em] text-[#555]">Challenge activation</div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{activated ? 'Your challenge is ready.' : failed ? `Payment ${status.toLowerCase()}.` : 'Confirming your payment.'}</h1>
        <p className="mt-3 text-[13px] leading-6 text-[#777]">{activated ? 'The evaluation account has been created and linked to your ACG Funded workspace.' : failed ? 'The payment was not activated. You can return to the dashboard and start again.' : 'We are waiting for the payment provider confirmation and account provisioning. This page updates automatically.'}</p>

        <div className="mt-7 divide-y divide-[#202020] rounded-xl border border-[#222] bg-[#0C0C0C] px-4">
          <Row label="Payment" value={status} />
          <Row label="Account" value={payment?.accountId || 'Pending'} />
          <Row label="Activation" value={payment?.activatedAt ? 'Complete' : 'Pending'} />
        </div>

        {error && <div className="mt-5 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-[11px] text-red-300">{error}</div>}
        <button onClick={onContinue} className="mt-7 flex h-10 items-center justify-center gap-2 rounded-md bg-white px-5 text-[12px] font-semibold text-black hover:bg-[#EAEAEA]">{activated ? 'Open dashboard' : failed ? 'Return to dashboard' : <><RefreshCw size={13} /> Continue to dashboard</>}</button>
      </section>
    </main>
  </div>;
}

function Row({ label, value }) { return <div className="flex items-center justify-between py-3 text-[11px]"><span className="text-[#666]">{label}</span><span className="font-mono text-[#CCC]">{value}</span></div>; }
