import React, { useState } from "react";
import { useAuth } from "../../AuthContext"; 
// import acg from "../assets/ACG.png";
import { Eye, EyeOff, ChevronDown, Check, ArrowLeft } from "lucide-react";
import Logo from '../../assets/ACG.png';

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

const titles = ["Mr.", "Mrs.", "Ms.", "Mx."];
const countries = [
  "Argentina", "Australia", "Austria", "Belgium", "Brazil", "Bulgaria", "Canada",
  "Chile", "Colombia", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia",
  "Finland", "France", "Germany", "Greece", "Hungary", "Iceland", "India", "Indonesia",
  "Ireland", "Italy", "Japan", "Latvia", "Lithuania", "Luxembourg", "Malaysia", "Malta",
  "Mexico", "Netherlands", "New Zealand", "Norway", "Philippines", "Poland", "Portugal",
  "Romania", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain",
  "Sweden", "Switzerland", "Thailand", "United Arab Emirates", "United Kingdom", "United States",
  "Vietnam",
];

const phoneCodes = [
  "+1", "+27", "+30", "+31", "+32", "+33", "+34", "+36", "+39", "+40", "+41", "+43",
  "+44", "+45", "+46", "+47", "+48", "+49", "+51", "+52", "+54", "+55", "+60", "+61",
  "+63", "+64", "+65", "+81", "+82", "+84", "+91", "+351", "+352", "+353", "+354", "+356",
  "+357", "+358", "+359", "+370", "+371", "+372", "+385", "+420", "+421", "+971",
];

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

const selectClasses = inputClasses + " appearance-none pr-9 cursor-pointer disabled:text-neutral-600";

function SelectField({ id, value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={onChange} className={selectClasses}>
        <option value="" disabled className="text-neutral-600">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-600" strokeWidth={1.75} />
    </div>
  );
}

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

function LoginForm({ onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
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

function SignupForm({ onSwitchToLogin }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountry, setPhoneCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ageAgree, setAgeAgree] = useState(false);
  const [idAgree, setIdAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!ageAgree || !idAgree) {
      return setError("You must agree to the age requirement and identification terms.");
    }

    setLoading(true);
    try {
      const metadata = {
        first_name: firstName,
        last_name: lastName,
        title,
        date_of_birth: dob,
        country,
        phone_number: `${phoneCountry} ${phone}`,
        referral_code: referralCode,
        marketing_agreement: marketingAgree,
      };

      const { error: signUpError } = await signUp(email, password, metadata);
      if (signUpError) throw signUpError;

      setSuccessMsg("Registration successful! Check your email inbox to verify your account.");
    } catch (err) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
        Create your account
      </h1>
      <p className="mt-1.5 text-center text-[13px] text-neutral-500">Get funded in minutes, not weeks.</p>

      {error && (
        <div className="mt-5 rounded-lg border border-white/[0.14] bg-white/[0.03] px-3.5 py-2.5 text-[12.5px] font-medium text-neutral-200">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mt-5 rounded-lg border border-white/[0.18] bg-white/[0.05] px-3.5 py-2.5 text-[12.5px] font-medium text-white">
          {successMsg}
        </div>
      )}

      <form className="mt-6 flex flex-col gap-3.5" onSubmit={handleSignup}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="First name" htmlFor="firstName">
            <input id="firstName" type="text" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClasses} required />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <input id="lastName" type="text" placeholder="Doe" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClasses} required />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[35%_1fr]">
          <Field label="Title" htmlFor="title">
            <SelectField id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="—" options={titles} />
          </Field>
          <Field label="Date of birth" htmlFor="dob">
            <input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputClasses + " [color-scheme:dark]"} required />
          </Field>
        </div>

        <Field label="Country" htmlFor="country">
          <SelectField id="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Select a country" options={countries} />
        </Field>

        <Field label="Email" htmlFor="signupEmail">
          <input id="signupEmail" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} required />
        </Field>

        <Field label="Phone number" htmlFor="phone">
          <div className="grid grid-cols-[7.5rem_1fr] gap-2">
            <div className="min-w-0">
              <SelectField id="phoneCountry" value={phoneCountry} onChange={(e) => setPhoneCountry(e.target.value)} placeholder="Code" options={phoneCodes} />
            </div>
            <input id="phone" type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses + " flex-1"} required />
          </div>
        </Field>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Password" htmlFor="signupPassword">
            <div className="relative">
              <input
                id="signupPassword"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses + " pr-9"}
                required
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-neutral-200 focus:outline-none">
                {showPassword ? <EyeOff className="h-[14px] w-[14px]" strokeWidth={1.75} /> : <Eye className="h-[14px] w-[14px]" strokeWidth={1.75} />}
              </button>
            </div>
          </Field>
          <Field label="Confirm" htmlFor="confirmPassword">
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses + " pr-9"}
                required
              />
              <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} aria-label={showConfirmPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-neutral-200 focus:outline-none">
                {showConfirmPassword ? <EyeOff className="h-[14px] w-[14px]" strokeWidth={1.75} /> : <Eye className="h-[14px] w-[14px]" strokeWidth={1.75} />}
              </button>
            </div>
          </Field>
        </div>

        <Field label="Referral code (optional)" htmlFor="referralCode">
          <input id="referralCode" type="text" placeholder="Optional" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className={inputClasses} />
        </Field>

        <div className="flex flex-col gap-3 pt-1">
          <CheckboxRow checked={ageAgree} onChange={() => setAgeAgree((v) => !v)}>
            I certify that I am 18 years of age or older, agree to the{" "}
            <span className="text-neutral-300">User Agreement</span>{" "}
            and acknowledge the{" "}
            <span className="text-neutral-300">Privacy Policy</span>.
          </CheckboxRow>
          <CheckboxRow checked={idAgree} onChange={() => setIdAgree((v) => !v)}>
            I acknowledge my name is correct and corresponds to my government-issued identification.
          </CheckboxRow>
          <CheckboxRow checked={marketingAgree} onChange={() => setMarketingAgree((v) => !v)}>
            I agree to receive news, updates and promotions from ACG by phone and email.
          </CheckboxRow>
        </div>

        <PrimaryButton loading={loading}>{loading ? "Creating account…" : "Get funded"}</PrimaryButton>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-neutral-600">or</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <SocialButton icon={GoogleMark} label="Continue with Google" onClick={handleGoogleSignup} disabled={loading} />

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
/*  Root                                                                */
/* ------------------------------------------------------------------ */

export default function Auth({ onBack = () => {}, initialView = "login" }) {
  const [view, setView] = useState(initialView);

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
            <LoginForm onSwitchToSignup={() => setView("signup")} />
          ) : (
            <SignupForm onSwitchToLogin={() => setView("login")} />
          )}
        </Card>
        <TrustLine />


      </div>
    </div>
  );
}
