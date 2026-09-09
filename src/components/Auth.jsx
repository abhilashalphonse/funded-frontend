import React, { useState } from "react";
import { useAuth } from "../AuthContext"; 
import acg from '../assets/ACG.png';
import {
  Eye,
  EyeOff,
  ChevronDown,
  Check,
  Globe2,
  ArrowLeft
} from "lucide-react";


const badges = [
  { label: "Forbes" },
  { label: "fml" },
  { label: "fmls:24" },
  { label: "EY Entrepreneur\nOf The Year" },
  { label: "50", sub: "Technology Fast 50\n2022 WINNER\nDeloitte." },
  { label: "50", sub: "Technology Fast 50\n2021 WINNER\nDeloitte." },
];

const platforms = [
  { name: "MetaTrader 5", dot: "bg-sky-500" },
  { name: "MetaTrader 4", dot: "bg-orange-500" },
  { name: "cTrader", dot: "bg-neutral-100" },
];

const flags = ["🇮🇳", "🇺🇸", "🇦🇺", "🇮🇹", "🇩🇪", "🇨🇿", "🇬🇧"];

const titles = ["Mr.", "Mrs.", "Ms.", "Mx."];

const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "India",
  "Australia",
  "Czech Republic",
  "United Arab Emirates",
  "Malta",
];

function TrustCard({ className = "", children }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-neutral-100 transition-colors duration-150 hover:bg-white/[0.07] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
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
        <label
          htmlFor={htmlFor}
          className="mb-2 block text-sm font-semibold text-neutral-200"
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none transition-colors focus:border-sky-500/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-sky-500/30";

const selectClasses =
  inputClasses +
  " appearance-none pr-10 cursor-pointer disabled:text-neutral-500";

function SelectField({ id, value, onChange, placeholder, options }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={selectClasses}
      >
        <option value="" disabled className="text-neutral-500">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#0a0b0d] text-neutral-100">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}

function CheckboxRow({ checked, onChange, children }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-start gap-2.5 text-left focus:outline-none"
    >
      <span
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked
            ? "border-sky-500 bg-sky-500"
            : "border-white/20 bg-transparent"
        }`}
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </span>
      <span className="text-xs leading-relaxed text-neutral-400">
        {children}
      </span>
    </button>
  );
}

const GoogleIcon = (
  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.87z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.1A12 12 0 0 0 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.31 14.32A7.2 7.2 0 0 1 4.93 12c0-.8.14-1.58.38-2.32v-3.1H1.3A12 12 0 0 0 0 12c0 1.94.46 3.77 1.3 5.42l4.01-3.1z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.3 6.58l4.01 3.1C6.25 6.85 8.89 4.75 12 4.75z"
    />
  </svg>
);

const FacebookIcon = (
  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
  </svg>
);

const AppleIcon = (
  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="#fff">
    <path d="M16.36 1.43c0 1.14-.44 2.2-1.15 3.03-.83.94-2.14 1.66-3.36 1.56-.15-1.09.42-2.24 1.15-3.02.82-.9 2.22-1.58 3.36-1.57zM20.7 17.2c-.4.94-.6 1.36-1.11 2.2-.72 1.17-1.73 2.63-2.99 2.64-1.11.01-1.4-.73-2.9-.72-1.5.01-1.81.74-2.93.73-1.26-.01-2.22-1.33-2.94-2.5-2.02-3.27-2.23-7.1-.98-9.14.88-1.44 2.28-2.29 3.6-2.29 1.34 0 2.18.75 3.29.75 1.07 0 1.72-.75 3.29-.75 1.17 0 2.41.64 3.29 1.74-2.89 1.58-2.42 5.7.38 6.9-.34 1.1-.5 1.3-.71 1.44z" />
  </svg>
);

const BrandMark = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
    <defs>
      <linearGradient id="topRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F2FE" />
        <stop offset="100%" stopColor="#0072FF" />
      </linearGradient>
      <linearGradient id="rightRibbon" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0072FF" />
        <stop offset="100%" stopColor="#0033AA" />
      </linearGradient>
      <linearGradient id="bottomRibbon" x1="100%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#0033AA" />
        <stop offset="100%" stopColor="#0055FF" />
      </linearGradient>
      <linearGradient id="leftRibbon" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0055FF" />
        <stop offset="100%" stopColor="#00F2FE" />
      </linearGradient>
    </defs>
    <g>
      <path d="M 140 64 L 372 64 C 430 64 448 82 448 140 L 448 240 C 400 200 360 176 310 176 L 176 176 C 176 130 150 90 140 64 Z" fill="url(#topRibbon)" />
      <path d="M 448 140 L 448 372 C 448 430 430 448 372 448 L 272 448 C 312 400 336 360 336 310 L 336 176 C 382 176 422 150 448 140 Z" fill="url(#rightRibbon)" />
      <path d="M 372 448 L 140 448 C 82 448 64 430 64 372 L 64 272 C 112 312 152 336 202 336 L 336 336 C 336 382 362 422 372 448 Z" fill="url(#bottomRibbon)" />
      <path d="M 64 372 L 64 140 C 64 82 82 64 140 64 L 240 64 C 200 112 176 152 176 202 L 176 336 C 130 336 90 362 64 372 Z" fill="url(#leftRibbon)" />
    </g>
  </svg>
);

function TrustRail() {
  return (
    <div className="hidden w-1/2 flex-col gap-5 p-5 lg:flex xl:p-6">
      {/* Leader panel */}
      <TrustCard className="flex flex-1 flex-col items-center justify-center px-8 py-10">
        <div className="mb-10 grid w-full grid-cols-3 gap-3 opacity-90 sm:grid-cols-6">
          {badges.map((b, i) => (
            <div
              key={i}
              className="flex h-16 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 text-center"
            >
              {b.sub ? (
                <div className="leading-tight">
                  <div className="text-lg font-bold text-white">{b.label}</div>
                  <div className="whitespace-pre-line text-[7px] font-medium text-neutral-500">
                    {b.sub}
                  </div>
                </div>
              ) : (
                <span className="whitespace-pre-line text-[11px] font-semibold text-neutral-300">
                  {b.label}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl">
          {BrandMark}
        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">Leader</h2>
        <p className="mt-2 max-w-xs text-center text-sm leading-relaxed text-neutral-400">
          ACG is a leading Modern Prop Trading firm founded in 2022
        </p>
      </TrustCard>

      {/* Bottom row */}
      <div className="flex gap-5" style={{ height: "44%" }}>
        {/* Platforms */}
        <TrustCard className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="mb-7 grid w-full grid-cols-2 gap-3">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
              >
                <span className={`h-2 w-2 rounded-full ${p.dot}`} />
                <span className="text-xs font-semibold text-neutral-200">
                  {p.name}
                </span>
              </div>
            ))}
            <div className="rounded-lg border border-white/[0.03] bg-white/[0.01]" />
          </div>
          <h3 className="text-xl font-bold text-white">Trading Platforms</h3>
          <p className="mt-1.5 text-center text-sm text-neutral-400">
            All the top trading platforms available
          </p>
        </TrustCard>

        {/* Customers */}
        <TrustCard className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          <div className="mb-7 grid grid-cols-6 gap-2.5">
            {flags.map((f, i) => (
              <div
                key={i}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-base"
              >
                {f}
              </div>
            ))}
          </div>
          <h3 className="text-xl font-bold text-white">3 million customers</h3>
          <p className="mt-1.5 text-center text-sm text-neutral-400">
            Trusted by over 3 million customers worldwide
          </p>
        </TrustCard>
      </div>
    </div>
  );
}

function LanguageSelector({onBack}) {
  return (
    <div className="flex justify-start">
      <button
        onClick={onBack}
        type="button"
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/60"
      >
        <ArrowLeft className="h-4 w-4 text-neutral-400" />
        Back

      </button>
    </div>
  );
}

function LoginForm({ onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Connect to Context
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12 lg:py-0">
      <div className="mb-10 flex items-center justify-center gap-2.5">
        <img src={acg} width={80} />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
          Log in to ACG
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Don&apos;t have a profile yet?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-medium text-sky-400 underline decoration-sky-400/40 underline-offset-2 transition-colors hover:text-sky-300"
          >
            Create a profile
          </button>
        </p>
      </div>

      {/* Render error if present */}
      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-center text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      <form className="mt-6 flex flex-col gap-5" onSubmit={handleLogin}>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            required
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses + " pr-11"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setRemember((r) => !r)}
            className="flex items-center gap-2.5 focus:outline-none"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
                remember ? "border-sky-500 bg-sky-500" : "border-white/20 bg-transparent"
              }`}
            >
              {remember && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
            </span>
            <span className="text-sm font-medium text-neutral-300">Remember me</span>
          </button>
          <a
            href="#"
            className="text-sm font-semibold text-neutral-200 underline underline-offset-2 transition-colors hover:text-white"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-sky-500 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(14,165,233,0.6)] transition-all duration-150 hover:bg-sky-400 hover:shadow-[0_8px_28px_-6px_rgba(14,165,233,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">or</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="flex flex-col gap-3">
        <SocialButton icon={GoogleIcon} label="Continue with Google" />
        <SocialButton icon={FacebookIcon} label="Continue with Facebook" />
        <SocialButton icon={AppleIcon} label="Continue with Apple" />
      </div>

      <a
        href="#"
        className="mt-8 text-center text-xs font-medium text-neutral-500 underline underline-offset-2 transition-colors hover:text-neutral-300"
      >
        Cookie settings
      </a>
    </div>
  );
}

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

  // Hook states
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSignup = async (e) => { 
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    // Basic Validation Checks
    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!ageAgree || !idAgree) {
      return setError("You must agree to the age requirement and identification terms.");
    }

    setLoading(true);

    try {
      // Pass standard auth pairs, plus contextual data properties
      const metadata = {
        first_name: firstName,
        last_name: lastName,
        title,
        date_of_birth: dob,
        country,
        phone_number: `${phoneCountry} ${phone}`,
        referral_code: referralCode,
        marketing_agreement: marketingAgree
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

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12 lg:py-10">
      <div className="mb-8 flex items-center justify-center gap-2.5">
       <img src={acg} width={80} />
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
          Create your account
        </h1>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-center text-sm font-medium text-red-400">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-center text-sm font-medium text-emerald-400">
          {successMsg}
        </div>
      )}

      <form className="mt-9 flex flex-col gap-5" onSubmit={handleSignup}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" htmlFor="firstName">
            <input
              id="firstName"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={inputClasses}
              required
            />
          </Field>
          <Field label="Last name" htmlFor="lastName">
            <input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={inputClasses}
              required
            />
          </Field>
        </div>

        <Field label="Title" htmlFor="title">
          <SelectField
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Select title"
            options={titles}
          />
        </Field>

        <Field label="Date of Birth" htmlFor="dob">
          <input
            id="dob"
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={inputClasses + " [color-scheme:dark]"}
            required
          />
        </Field>

        <Field label="Country" htmlFor="country">
          <SelectField
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Select a country"
            options={countries}
          />
        </Field>

        <Field label="Email" htmlFor="signupEmail">
          <input
            id="signupEmail"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses}
            required
          />
        </Field>

        <Field label="Phone number" htmlFor="phone">
          <div className="flex gap-2.5">
            <div className="w-[38%]">
              <SelectField
                id="phoneCountry"
                value={phoneCountry}
                onChange={(e) => setPhoneCountry(e.target.value)}
                placeholder="Country"
                options={countries}
              />
            </div>
            <input
              id="phone"
              type="tel"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClasses + " flex-1"}
              required
            />
          </div>
        </Field>

        <Field label="Password" htmlFor="signupPassword">
          <div className="relative">
            <input
              id="signupPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses + " pr-11"}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </Field>

        <Field label="Confirm password" htmlFor="confirmPassword">
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClasses + " pr-11"}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((s) => !s)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
        </Field>

        <Field label="Referral code (optional)" htmlFor="referralCode">
          <input
            id="referralCode"
            type="text"
            placeholder="Referral code (optional)"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            className={inputClasses}
          />
        </Field>

        <div className="flex flex-col gap-3.5 pt-1">
          <CheckboxRow checked={ageAgree} onChange={() => setAgeAgree((v) => !v)}>
            I certify that I am 18 years of age or older, agree to the{" "}
            <a href="#" className="text-neutral-300 underline underline-offset-2 hover:text-white">
              User Agreement
            </a>{" "}
            and acknowledge the{" "}
            <a href="#" className="text-neutral-300 underline underline-offset-2 hover:text-white">
              Privacy policy
            </a>
            .
          </CheckboxRow>

          <CheckboxRow checked={idAgree} onChange={() => setIdAgree((v) => !v)}>
            I acknowledge my name is correct and corresponds to the government-issued identification.
          </CheckboxRow>

          <CheckboxRow checked={marketingAgree} onChange={() => setMarketingAgree((v) => !v)}>
            I agree to receive news, updates, promotions, surveys, and other communications from FundingPips via phone and email.
          </CheckboxRow>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-sky-500 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(14,165,233,0.6)] transition-all duration-150 hover:bg-sky-400 hover:shadow-[0_8px_28px_-6px_rgba(14,165,233,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Get Funded"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">or</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="flex flex-col gap-3">
        <SocialButton icon={GoogleIcon} label="Continue with Google" />
      </div>

      <p className="mt-8 text-center text-sm text-neutral-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-medium text-sky-400 underline decoration-sky-400/40 underline-offset-2 transition-colors hover:text-sky-300"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

export default function Auth({ onBack }) {
  const [view, setView] = useState("login"); // "login" | "signup"

  return (
    <div className="min-h-screen w-full bg-[#0a0b0d] text-neutral-100 antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col lg:flex-row">
        {/* ---------------- Left: Auth form ---------------- */}
        <div className="relative flex w-full flex-1 flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:px-16 lg:py-10 xl:px-24">
          <LanguageSelector onBack={onBack} />

          {view === "login" ? (
            <LoginForm onSwitchToSignup={() => setView("signup")} />
          ) : (
            <SignupForm onSwitchToLogin={() => setView("login")} />
          )}
        </div>

        {/* ---------------- Right: Proof / trust rail (login only) ---------------- */}
        {view === "login" && <TrustRail />}
      </div>
    </div>
  );
}