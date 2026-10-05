import { useState } from 'react';
import { useAuth } from '../../AuthContext.jsx';

export default function ResetPassword({ onDone }) {
  const { user, updatePassword, resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (user && password !== confirmation) { setMessage('The passwords do not match.'); return; }
    setBusy(true); setMessage('');
    try {
      const result = user ? await updatePassword(password) : await resetPassword(email.trim());
      if (result.error) throw result.error;
      if (user) onDone();
      else setMessage('If this address has an account, a new recovery link will arrive by email.');
    } catch (error) { setMessage(error.message || 'Please try again.'); }
    finally { setBusy(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-black px-6 text-white">
    <form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-2xl border border-white/10 p-7">
      <h1 className="text-xl font-semibold">Reset your password</h1>
      {user ? <>
        <label className="block text-sm">New password<input className="mt-2 w-full rounded border border-white/20 bg-neutral-950 p-3" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} /></label>
        <label className="block text-sm">Confirm password<input className="mt-2 w-full rounded border border-white/20 bg-neutral-950 p-3" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>
      </> : <>
        <p className="text-sm text-neutral-400">This recovery link is invalid or has expired. Request a new link below.</p>
        <label className="block text-sm">Email<input className="mt-2 w-full rounded border border-white/20 bg-neutral-950 p-3" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>
      </>}
      {message && <p role="status" className="text-sm text-amber-200">{message}</p>}
      <button disabled={busy} className="w-full rounded bg-white p-3 font-medium text-black disabled:opacity-50">{busy ? 'Please wait…' : user ? 'Save password' : 'Send recovery link'}</button>
    </form>
  </main>;
}
