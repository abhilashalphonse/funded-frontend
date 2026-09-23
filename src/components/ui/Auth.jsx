import React, { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext"; 
// import acg from "../assets/ACG.png";
import { Eye, EyeOff, Check, ArrowLeft, Mail, RefreshCw } from "lucide-react";
import Logo from '../../assets/ACG.png';
import { trackEvent } from '../../utils/analytics.js';

/* ------------------------------------------------------------------ */
/*  Why this pass looks different                                      */
/*  The split-screen "trust rail" is gone. Stripe / Vercel / Linear     */
/*  don't run a stats panel next to auth — they run one small,          */
/*  bordered card, centered, with tight type and generous outer         */
/*  whitespace. The containment (card edge + shadow) is what reads as   */
/*  precise; a form floating loose on bare black reads as unfinished.   */
/*  Trust signal is compressed to a single quiet line under the card.   */
/* ------------------------------------------------------------------ */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');`;

/* ------------------------------------------------------------------ */
/*  Primitives                                                         */
/* ------------------------------------------------------------------ */

function Wordmark() {
  return (
    <div className="flex items-center justify-center gap-2">
     <img src={Logo} width={80} />
    </div>
  );
}

function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_closest-side,rgba(255,255,255,0.055),transparent_70%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.02] mix-blend-screen">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" fill="white" />
      </svg>
    </div>
  );
}

function BackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      type="button"
      className="group absolute left-6 top-6 z-10 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[12.5px] font-medium text-neutral-500 transition-colors hover:text-white focus:outline-none sm:left-8 sm:top-8"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" strokeWidth={2} />
      Back
    </button>
  );
}

function Card({ children, wide }) {
  return (
    <div
      className={`w-full ${wide ? "max-w-[420px]" : "max-w-[380px]"} rounded-2xl border border-white/[0.09] bg-[#0A0A0A] px-7 py-8 sm:px-9 sm:py-9`}
      style={{
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02), 0 24px 60px -20px rgba(0,0,0,0.85)",
      }}
    >
      {children}
    </div>
  );
}

function SocialButton({ icon, label, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border border-white/[0.09] bg-white/[0.015] text-[13px] font-medium text-neutral-300 transition-all duration-150 hover:border-white/[0.18] hover:bg-white/[0.04] hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
    >
      {icon}
      {label}
    </button>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-[11px] font-medium text-neutral-500">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-lg border border-white/[0.09] bg-white/[0.02] px-3 py-2.5 text-[13.5px] text-white placeholder:text-neutral-600 outline-none transition-all duration-150 focus:border-white/30 focus:bg-white/[0.03] focus:ring-1 focus:ring-white/20";

function CheckboxRow({ checked, onChange, children }) {
  return (
    <button type="button" onClick={onChange} className="flex items-start gap-2.5 text-left focus:outline-none">
      <span
        className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-150 ${
          checked ? "border-white bg-white" : "border-white/[0.18] bg-white/[0.02]"
        }`}
      >
        {checked && <Check className="h-[10px] w-[10px] text-black" strokeWidth={3.5} />}
      </span>
      <span className="text-[12px] leading-relaxed text-neutral-500">{children}</span>
    </button>
  );
}

const PrimaryButton = ({ loading, children }) => (
  <button
    type="submit"
    disabled={loading}
    className="mt-1 flex h-[40px] w-full items-center justify-center rounded-lg bg-white text-[13.5px] font-medium text-black transition-all duration-150 hover:bg-neutral-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
  >
    {children}
  </button>
);

/* Monochrome OAuth marks — single currentColor stroke/fill, no brand color */
const GoogleMark = (
  <svg className="h-[15px] w-[15px]" viewBox="0 0 24 24" fill="none">
    <path d="M21.6 12.23c0-.68-.06-1.33-.17-1.96H12v3.7h5.4a4.62 4.62 0 0 1-2 3.03v2.5h3.24c1.9-1.75 2.96-4.33 2.96-7.27z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M12 22c2.7 0 4.96-.89 6.62-2.4l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.75-5.59-4.11H3.06v2.58A10 10 0 0 0 12 22z" fill="currentColor" fillOpacity="0.14" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    <path d="M6.41 13.95a5.99 5.99 0 0 1 0-3.9V7.47H3.06a10 10 0 0 0 0 9.06l3.35-2.58z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
    <path d="M12 5.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87A9.96 9.96 0 0 0 12 2a10 10 0 0 0-8.94 5.47l3.35 2.58C7.2 7.73 9.4 5.98 12 5.98z" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
  </svg>
);

function TrustLine() {
  return (
    <p className="mt-6 text-center text-[11.5px] text-neutral-600">
      Regulated infrastructure · 3M+ traders funded · $2B+ paid out
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Login                                                               */
/* ------------------------------------------------------------------ */

function LoginForm({ onSwitchToSignup, initialEmail = "" }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");

  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;
    } catch (err) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setNotice("");
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Enter your email address first.");
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await resetPassword(normalizedEmail);
      if (resetError) throw resetError;
      setNotice("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message || "Unable to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const { error: googleSignInError } = await signInWithGoogle();
      if (googleSignInError) throw googleSignInError;
    } catch (err) {
      setError(err.message || "Unable to start Google sign-in.");
      setLoading(false);
    }
  };

  return (
    <>
      <Wordmark />
      <h1 className="mt-6 text-center text-[19px] font-semibold tracking-tight text-white">
        Log in to ACG
      </h1>
      <p className="mt-1.5 text-center text-[13px] text-neutral-500">
        Don&apos;t have a profile?{" "}
        <button type="button" onClick={onSwitchToSignup} className="font-medium text-white underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60">
          Create one
        </button>
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <SocialButton icon={GoogleMark} label="Continue with Google" onClick={handleGoogleLogin} disabled={loading} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-neutral-600">or</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-white/[0.14] bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] font-medium text-neutral-200">
          {error}
        </div>
      )}
      {notice && (
        <div className="mb-4 rounded-lg border border-white/[0.14] bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] font-medium text-neutral-200">
          {notice}
        </div>
      )}

      <form className="flex flex-col gap-3.5" onSubmit={handleLogin}>
        <Field label="Email" htmlFor="email">
          <input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} required />
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses + " pr-10"}
              required
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-neutral-200 focus:outline-none">
              {showPassword ? <EyeOff className="h-[15px] w-[15px]" strokeWidth={1.75} /> : <Eye className="h-[15px] w-[15px]" strokeWidth={1.75} />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between pt-0.5">
          <button type="button" onClick={() => setRemember((r) => !r)} className="flex items-center gap-2 focus:outline-none">
            <span className={`flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors ${remember ? "border-white bg-white" : "border-white/[0.18] bg-white/[0.02]"}`}>
              {remember && <Check className="h-[10px] w-[10px] text-black" strokeWidth={3.5} />}
            </span>
            <span className="text-[12.5px] font-medium text-neutral-400">Remember me</span>
          </button>
          <button type="button" onClick={handlePasswordReset} disabled={loading} className="text-[12.5px] font-medium text-neutral-400 transition-colors hover:text-white disabled:opacity-50">
            Forgot password?
          </button>
        </div>

        <PrimaryButton loading={loading}>{loading ? "Logging in…" : "Log in"}</PrimaryButton>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Signup                                                              */
/* ------------------------------------------------------------------ */

function SignupForm({ onSwitchToLogin, onVerificationRequired, initialEmail = "", lockEmail = false }) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [ageAgree, setAgeAgree] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!ageAgree) {
      setError("Confirm that you are 18 or older and agree to the account terms.");
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const { data, error: signUpError } = await signUp(normalizedEmail, password, {});
      if (signUpError) throw signUpError;

      // When Supabase email confirmation is enabled it creates the user but
      // deliberately returns no active session. Show a dedicated verification
      // screen instead of leaving the registration form looking stuck.
      if (!data?.session) {
        onVerificationRequired(normalizedEmail);
        return;
      }

      void trackEvent("signup_completed", { method: "email" });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("acg:authMode", "signup");
    }
    try {
      const { error: googleSignInError } = await signInWithGoogle();
      if (googleSignInError) throw googleSignInError;
    } catch (err) {
      setError(err.message || "Unable to start Google sign-in.");
      setLoading(false);
    }
  };

  return (
    <>
      <Wordmark />
      <h1 className="mt-6 text-center text-[19px] font-semibold tracking-tight text-white">
        Create your account
      </h1>
      <p className="mt-1.5 text-center text-[13px] text-neutral-500">
        {lockEmail ? "Create your account with the email used for your purchase to claim your Challenge." : "Start with just your login. Complete profile details only when needed."}
      </p>

      {error && (
        <div className="mt-5 rounded-lg border border-white/[0.14] bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] font-medium text-neutral-200">
          {error}
        </div>
      )}
      {!lockEmail && <>
        <div className="mt-6">
          <SocialButton icon={GoogleMark} label="Continue with Google" onClick={handleGoogleSignup} disabled={loading} />
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-neutral-600">or</span>
          <span className="h-px flex-1 bg-white/[0.08]" />
        </div>
      </>}

      <form className="flex flex-col gap-3.5" onSubmit={handleSignup}>
        <Field label="Email" htmlFor="signupEmail">
          <input
            id="signupEmail"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => { if (!lockEmail) setEmail(e.target.value); }}
            readOnly={lockEmail}
            className={inputClasses + (lockEmail ? " cursor-default text-neutral-400" : "")}
            required
          />
        </Field>

        <Field label="Password" htmlFor="signupPassword">
          <div className="relative">
            <input
              id="signupPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses + " pr-10"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-neutral-200 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-[15px] w-[15px]" strokeWidth={1.75} /> : <Eye className="h-[15px] w-[15px]" strokeWidth={1.75} />}
            </button>
          </div>
        </Field>

        <CheckboxRow checked={ageAgree} onChange={() => setAgeAgree((value) => !value)}>
          I confirm that I am 18 years of age or older and agree to the{" "}
          <span className="text-neutral-300">User Agreement</span>{" "}
          and{" "}
          <span className="text-neutral-300">Privacy Policy</span>.
        </CheckboxRow>

        <PrimaryButton loading={loading}>{loading ? "Creating account…" : "Create account"}</PrimaryButton>
      </form>

      <p className="mt-6 text-center text-[12.5px] text-neutral-500">
        Already have an account?{" "}
        <button type="button" onClick={onSwitchToLogin} className="font-medium text-white underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-white/60">
          Sign in
        </button>
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Email verification                                                  */
/* ------------------------------------------------------------------ */

function VerifyEmail({ email, onBackToLogin }) {
  const { resendSignupVerification } = useAuth();
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const resend = async () => {
    if (!email || sending) return;
    setSending(true);
    setNotice("");
    setError("");
    try {
      const { error: resendError } = await resendSignupVerification(email);
      if (resendError) throw resendError;
      setNotice("Verification email sent again.");
    } catch (err) {
      setError(err?.message || "Unable to resend the verification email.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="mx-auto grid size-12 place-items-center rounded-xl border border-white/[0.1] bg-white/[0.035] text-white">
        <Mail className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <h1 className="mt-6 text-center text-[19px] font-semibold tracking-tight text-white">
        Verify your email
      </h1>
      <p className="mt-2 text-center text-[13px] leading-5 text-neutral-500">
        We sent a verification link to
      </p>
      <p className="mt-1 break-all text-center text-[13px] font-medium text-neutral-200">
        {email}
      </p>
      <p className="mt-5 text-center text-[12px] leading-5 text-neutral-500">
        Open the email and select the verification link. Once verified, you&apos;ll be signed in automatically and returned to ACG.
      </p>

      {notice && (
        <div className="mt-5 rounded-lg border border-white/[0.14] bg-white/[0.03] px-3.5 py-2.5 text-center text-[12px] font-medium text-neutral-200">
          {notice}
        </div>
      )}
      {error && (
        <div className="mt-5 rounded-lg border border-white/[0.14] bg-white/[0.03] px-3.5 py-2.5 text-center text-[12px] font-medium text-neutral-200">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={resend}
        disabled={sending}
        className="mt-6 flex h-[40px] w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.02] text-[13px] font-medium text-neutral-200 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-wait disabled:opacity-50"
      >
        {sending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
        {sending ? "Sending…" : "Resend verification email"}
      </button>

      <button
        type="button"
        onClick={onBackToLogin}
        className="mt-4 w-full text-center text-[12.5px] font-medium text-neutral-500 transition hover:text-white"
      >
        Back to sign in
      </button>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function Auth({ onBack = () => {}, initialView = "login", initialEmail = "", lockInitialEmail = false }) {
  const [view, setView] = useState(initialView);
  const [verificationEmail, setVerificationEmail] = useState("");

  useEffect(() => {
    if (view === "signup") void trackEvent("signup_started");
  }, [view]);

  return (
    <div className="relative min-h-screen w-full bg-black font-sans text-white antialiased">
      <style>{FONT_IMPORT}{`
        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif; }
      `}</style>

      <Atmosphere />
      <BackButton onBack={onBack} />

      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16 sm:px-5 sm:py-20">
        <Card wide={view === "signup"}>
          {view === "login" ? (
            <LoginForm onSwitchToSignup={() => setView("signup")} initialEmail={initialEmail} />
          ) : view === "verify-email" ? (
            <VerifyEmail
              email={verificationEmail}
              onBackToLogin={() => setView("login")}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => setView("login")}
              onVerificationRequired={(email) => {
                setVerificationEmail(email);
                setView("verify-email");
              }}
              initialEmail={initialEmail}
              lockEmail={lockInitialEmail}
            />
          )}
        </Card>
        <TrustLine />


      </div>
    </div>
  );
}
