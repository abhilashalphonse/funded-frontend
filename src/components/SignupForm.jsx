import acg from '../assets/ACG.png';



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