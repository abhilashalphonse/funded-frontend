import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Minus, Plus, ChevronDown, ArrowRight } from 'lucide-react';

/* ============================================================================
   CONFIGURATION
   Static data describing available options. Kept separate from components so
   it can later be swapped for values fetched from an API without touching
   the presentation layer.
   ============================================================================ */

const STEP_TYPES = {
  ONE_STEP: '1step',
  TWO_STEP: '2step',
};

const ACCOUNT_SIZE_CONFIG = {
  [STEP_TYPES.ONE_STEP]: { min: 5000, max: 100000, step: 500, default: 47500 },
  [STEP_TYPES.TWO_STEP]: { min: 10000, max: 100000, step: 500, default: 50000 },
};

const DEFAULT_RULES = {
  [STEP_TYPES.ONE_STEP]: {
    profitTarget: 10,
    dailyLoss: 3,
    maxLoss: 6,
    minTradingDays: 4,
  },
  [STEP_TYPES.TWO_STEP]: {
    phase1ProfitTarget: 8,
    phase2ProfitTarget: 6,
    dailyLoss: 5,
    maxLoss: 10,
    minTradingDays: 4,
  },
};

// Allowed ranges mirror the customization options in the pricing spec, so the
// stepper controls can never push a rule to a value the pricing engine
// doesn't have a defined modifier for.
const RULE_BOUNDS = {
  profitTarget: { min: 5, max: 12, increment: 1 },
  phase1ProfitTarget: { min: 5, max: 12, increment: 1 },
  phase2ProfitTarget: { min: 5, max: 12, increment: 1 },
  dailyLoss: { min: 2, max: 5, increment: 1 },
  maxLoss: { min: 5, max: 10, increment: 1 },
  minTradingDays: { min: 3, max: 5, increment: 1 },
};

const PROFIT_SPLIT_OPTIONS = [80, 90, 100];
const PAYOUT_FREQUENCY_OPTIONS = ['Monthly', 'Biweekly', 'On Demand'];

/* ============================================================================
   PRICING ENGINE
   Pure, presentation-free functions. Nothing in this section reads state or
   touches the DOM, so it can be lifted into its own module (e.g.
   `pricingEngine.js`) or replaced by a backend API call without touching any
   component below. Every function takes plain values in and returns plain
   values out.
   ============================================================================ */

// Anchor points for piecewise-linear base price interpolation.
// Source of truth for "what does a raw account size cost before modifiers".
const ONE_STEP_BASE_CURVE = [
  { size: 5000, price: 59 },
  { size: 10000, price: 89 },
  { size: 25000, price: 190 },
  { size: 50000, price: 320 },
  { size: 75000, price: 430 },
  { size: 100000, price: 549 },
];

const TWO_STEP_BASE_CURVE = [
  { size: 10000, price: 79 },
  { size: 25000, price: 139 },
  { size: 50000, price: 259 },
  { size: 100000, price: 449 },
  { size: 200000, price: 749 },
];

/**
 * Piecewise-linear interpolation across a sorted curve of {size, price}
 * anchor points. Values outside the curve's range clamp to the nearest
 * endpoint rather than extrapolating.
 */
function calculateBasePrice(accountSize, curve) {
  if (!curve || curve.length === 0 || !Number.isFinite(accountSize)) return 0;

  if (accountSize <= curve[0].size) return curve[0].price;
  if (accountSize >= curve[curve.length - 1].size) return curve[curve.length - 1].price;

  for (let i = 0; i < curve.length - 1; i += 1) {
    const lower = curve[i];
    const upper = curve[i + 1];
    if (accountSize >= lower.size && accountSize <= upper.size) {
      const ratio = (accountSize - lower.size) / (upper.size - lower.size);
      return lower.price + ratio * (upper.price - lower.price);
    }
  }

  return curve[curve.length - 1].price;
}

// -- Individual modifiers -----------------------------------------------
// Each takes a raw rule/option value and returns a multiplier. All are
// defensive against missing/invalid input so a bad value degrades to a
// neutral 1.00 multiplier instead of producing NaN.

function profitTargetModifier(target) {
  const t = Number(target);
  if (!Number.isFinite(t)) return 1;
  // Reference: 10%. Every 1% lower compounds x1.08; every 1% higher applies
  // the inverse (a discount), expressed here as a single exponent.
  return 1.08 ** (10 - t);
}

function dailyLossModifier(dailyLoss) {
  const d = Number(dailyLoss);
  if (!Number.isFinite(d)) return 1;
  return 1.12 ** (d - 3); // reference: 3%
}

function maximumLossModifier(maxLoss) {
  const m = Number(maxLoss);
  if (!Number.isFinite(m)) return 1;
  return 1.07 ** (m - 6); // reference: 6%
}

const TRADING_DAYS_MODIFIERS = { 3: 1.03, 4: 1.0, 5: 0.98 };
function tradingDaysModifier(days) {
  return TRADING_DAYS_MODIFIERS[days] ?? 1;
}

const PROFIT_SPLIT_MODIFIERS = { 80: 1.0, 90: 1.08, 100: 1.2 };
function profitSplitModifier(split) {
  return PROFIT_SPLIT_MODIFIERS[split] ?? 1;
}

const PAYOUT_MODIFIERS = { Monthly: 1.0, Biweekly: 1.07, 'On Demand': 1.18 };
function payoutModifier(frequency) {
  return PAYOUT_MODIFIERS[frequency] ?? 1;
}

function newsTradingModifier(enabled) {
  return enabled ? 1.05 : 1.0;
}

function weekendHoldingModifier(enabled) {
  return enabled ? 1.03 : 1.0;
}

/**
 * calculatePricing(config) — THE pricing engine entry point.
 *
 * Not a real production pricing service: it implements the formulas defined
 * in the pricing spec (piecewise base curve + multiplicative modifier stack)
 * so the UI can demonstrate live recalculation. Swap this for a call to a
 * backend endpoint later; keep the return shape the same and nothing else
 * needs to change.
 *
 * Returns:
 *   {
 *     basePrice: number,
 *     modifiers: { profitTarget, dailyLoss, maxLoss, tradingDays,
 *                  profitSplit, payout, newsTrading, weekendHolding },
 *     finalPrice: number,
 *     currency: 'EUR'
 *   }
 */
function calculatePricing(config) {
  const { step, accountSize, rules, advanced } = config;
  const curve = step === STEP_TYPES.TWO_STEP ? TWO_STEP_BASE_CURVE : ONE_STEP_BASE_CURVE;

  const safeAccountSize = Number.isFinite(accountSize) ? accountSize : curve[0].size;
  const basePrice = calculateBasePrice(safeAccountSize, curve);

  const profitTargetTotalModifier =
    step === STEP_TYPES.TWO_STEP
      ? profitTargetModifier(rules.phase1ProfitTarget) * profitTargetModifier(rules.phase2ProfitTarget)
      : profitTargetModifier(rules.profitTarget);

  const modifiers = {
    profitTarget: profitTargetTotalModifier,
    dailyLoss: dailyLossModifier(rules.dailyLoss),
    maxLoss: maximumLossModifier(rules.maxLoss),
    tradingDays: tradingDaysModifier(rules.minTradingDays),
    profitSplit: profitSplitModifier(advanced.profitSplit),
    payout: payoutModifier(advanced.payoutFrequency),
    newsTrading: newsTradingModifier(advanced.newsTrading),
    weekendHolding: weekendHoldingModifier(advanced.weekendHolding),
  };

  const rawFinalPrice = Object.values(modifiers).reduce((acc, m) => acc * m, basePrice);
  const finalPrice = Number.isFinite(rawFinalPrice) ? Math.max(0, Math.round(rawFinalPrice)) : 0;

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    modifiers,
    finalPrice,
    currency: 'EUR',
  };
}

const MODIFIER_LABELS = {
  profitTarget: 'Profit Target',
  dailyLoss: 'Daily Loss',
  maxLoss: 'Maximum Loss',
  tradingDays: 'Minimum Trading Days',
  profitSplit: 'Profit Split',
  payout: 'Payout Frequency',
  newsTrading: 'News Trading',
  weekendHolding: 'Weekend Holding',
};

/* ============================================================================
   HELPERS
   ============================================================================ */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatAccountSize = (value) => `$${Math.round(value).toLocaleString('en-US')}`;

const formatEUR = (amount) => `€${Math.round(amount).toLocaleString('en-US')}`;

// Turns a multiplier (e.g. 1.25) into a signed percentage string (e.g. "+25%").
const formatModifierDelta = (multiplier) => {
  const pct = Math.round((multiplier - 1) * 100);
  if (pct === 0) return '+0%';
  return pct > 0 ? `+${pct}%` : `${pct}%`;
};

/* ============================================================================
   PRIMITIVE: SegmentedControl
   Reusable pill-style selector used for the step toggle and several advanced
   options. Matches the site's monochrome surface/border treatment.
   ============================================================================ */

function SegmentedControl({ options, value, onChange, size = 'md', ariaLabel }) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center rounded-md border border-white/[0.08] bg-[#0A0C12] p-1 gap-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`relative rounded-[5px] font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0C12] ${
              size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2 text-sm'
            } ${
              active
                ? 'bg-white text-[#05060A]'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================================
   ChallengeHeader
   ============================================================================ */

function ChallengeHeader() {
  return (
    <div className="flex flex-col items-center text-center mb-10">
      <h1 className="text-4xl sm:text-5xl font-medium tracking-tighter text-white mb-3 leading-[1.1]">
        Build Your Challenge
      </h1>
      <p className="text-base sm:text-lg text-gray-400 font-light max-w-md">
        Configure a challenge built around how you trade.
      </p>
    </div>
  );
}

/* ============================================================================
   StepSelector
   ============================================================================ */

function StepSelector({ step, onChange }) {
  return (
    <div className="flex justify-center mb-12">
      <SegmentedControl
        ariaLabel="Challenge type"
        value={step}
        onChange={onChange}
        options={[
          { value: STEP_TYPES.ONE_STEP, label: '1 Step' },
          { value: STEP_TYPES.TWO_STEP, label: '2 Step' },
        ]}
      />
    </div>
  );
}

/* ============================================================================
   AccountSizeSelector
   The primary interaction: a large editable amount plus a custom-styled
   range slider, both driving the same piece of state.
   ============================================================================ */

function AccountSizeSelector({ step, value, onChange }) {
  const { min, max, step: increment } = ACCOUNT_SIZE_CONFIG[step];
  const [draft, setDraft] = useState(formatAccountSize(value));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(formatAccountSize(value));
  }, [value, editing]);

  const commitDraft = () => {
    const numeric = Number(draft.replace(/[^0-9.]/g, ''));
    if (Number.isNaN(numeric)) {
      setDraft(formatAccountSize(value));
    } else {
      const snapped = Math.round(numeric / increment) * increment;
      onChange(clamp(snapped, min, max));
    }
    setEditing(false);
  };

  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center mb-14">
      <label htmlFor="account-size-input" className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Account Size
      </label>

      <input
        id="account-size-input"
        type="text"
        inputMode="numeric"
        value={editing ? draft : formatAccountSize(value)}
        onFocus={() => setEditing(true)}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
        }}
        className="w-full max-w-xs text-center bg-transparent text-5xl sm:text-6xl font-medium tracking-tighter text-white mb-8 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-md transition-colors"
      />

      <div className="w-full max-w-md px-1">
        <div className="relative h-6 flex items-center account-slider-wrapper">
          <div className="absolute inset-x-0 h-[3px] rounded-full bg-white/[0.08]" />
          <div
            className="absolute h-[3px] rounded-full bg-white transition-[width] duration-150 ease-out"
            style={{ width: `${percent}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={increment}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Account size"
            className="account-slider relative w-full appearance-none bg-transparent"
          />
        </div>
        <div className="flex justify-between mt-3 text-xs text-gray-500 font-mono">
          <span>{formatAccountSize(min)}</span>
          <span>{formatAccountSize(max)}</span>
        </div>
      </div>

      <style>{`
        .account-slider {
          -webkit-appearance: none;
          height: 24px;
        }
        .account-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #FFFFFF;
          border: 2px solid #05060A;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.15);
          cursor: pointer;
          transition: transform 150ms ease;
          margin-top: 0;
        }
        .account-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }
        .account-slider:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px rgba(255,255,255,0.35);
        }
        .account-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #FFFFFF;
          border: 2px solid #05060A;
          cursor: pointer;
          transition: transform 150ms ease;
        }
        .account-slider::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   RuleControl
   Reusable stepper used for every numeric rule (profit target, losses, etc).
   ============================================================================ */

function RuleControl({ label, value, unit = '%', bounds, onChange, helpText }) {
  const { min, max, increment } = bounds;

  const round = (n) => Math.round(n * 100) / 100;
  const dec = () => onChange(clamp(round(value - increment), min, max));
  const inc = () => onChange(clamp(round(value + increment), min, max));

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.06] last:border-0">
      <div>
        <div className="text-sm font-medium text-gray-200">{label}</div>
        {helpText && <div className="text-xs text-gray-500 mt-0.5">{helpText}</div>}
      </div>

      <div className="flex items-center gap-3 rounded-md border border-white/[0.08] bg-[#0A0C12]">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:bg-transparent transition-colors rounded-l-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={2} />
        </button>

        <span className="min-w-[3.5rem] text-center text-sm font-mono text-white tabular-nums">
          {value}
          {unit}
        </span>

        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.04] disabled:opacity-30 disabled:hover:bg-transparent transition-colors rounded-r-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   PhaseTargets
   Groups Phase 1 / Phase 2 profit targets for the 2-Step flow so the split
   is legible without adding extra visual weight to the rule list.
   ============================================================================ */

function PhaseTargets({ rules, onRuleChange }) {
  return (
    <div className="mb-2">
      <div className="grid grid-cols-2 gap-3 mb-1">
        {[
          { key: 'phase1ProfitTarget', label: 'Phase 1' },
          { key: 'phase2ProfitTarget', label: 'Phase 2' },
        ].map(({ key, label }) => {
          const bounds = RULE_BOUNDS[key];
          return (
            <div key={key} className="rounded-lg border border-white/[0.08] bg-[#0A0C12] p-4">
              <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                {label} Target
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-medium tracking-tight text-white">{rules[key]}%</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      onRuleChange(key, clamp(rules[key] - bounds.increment, bounds.min, bounds.max))
                    }
                    disabled={rules[key] <= bounds.min}
                    aria-label={`Decrease ${label} target`}
                    className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onRuleChange(key, clamp(rules[key] + bounds.increment, bounds.min, bounds.max))
                    }
                    disabled={rules[key] >= bounds.max}
                    aria-label={`Increase ${label} target`}
                    className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   RuleConfigurator
   ============================================================================ */

function RuleConfigurator({ step, rules, onRuleChange }) {
  return (
    <section className="rounded-xl border border-white/[0.08] bg-[#0A0C12] p-6 mb-6">
      <h2 className="text-sm font-medium text-white mb-1">Challenge rules</h2>
      <p className="text-xs text-gray-500 mb-5">Adjust the parameters that define your challenge.</p>

      {step === STEP_TYPES.TWO_STEP && <PhaseTargets rules={rules} onRuleChange={onRuleChange} />}

      <div>
        {step === STEP_TYPES.ONE_STEP && (
          <RuleControl
            label="Profit Target"
            value={rules.profitTarget}
            bounds={RULE_BOUNDS.profitTarget}
            onChange={(v) => onRuleChange('profitTarget', v)}
          />
        )}
        <RuleControl
          label="Daily Loss"
          value={rules.dailyLoss}
          bounds={RULE_BOUNDS.dailyLoss}
          onChange={(v) => onRuleChange('dailyLoss', v)}
          helpText="Maximum drawdown allowed in a single day"
        />
        <RuleControl
          label="Maximum Loss"
          value={rules.maxLoss}
          bounds={RULE_BOUNDS.maxLoss}
          onChange={(v) => onRuleChange('maxLoss', v)}
          helpText="Maximum drawdown allowed overall"
        />
        <RuleControl
          label="Minimum Trading Days"
          value={rules.minTradingDays}
          unit=""
          bounds={RULE_BOUNDS.minTradingDays}
          onChange={(v) => onRuleChange('minTradingDays', v)}
        />
      </div>
    </section>
  );
}

/* ============================================================================
   AdvancedOptions
   ============================================================================ */

function AdvancedOptions({ advanced, onAdvancedChange }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-white/[0.08] bg-[#0A0C12] overflow-hidden mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-6 py-4 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      >
        <span className="text-sm font-medium text-white">Advanced options</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-1 space-y-5 border-t border-white/[0.06]">
            <ToggleRow
              label="News Trading"
              value={advanced.newsTrading}
              onChange={(v) => onAdvancedChange('newsTrading', v)}
            />
            <ToggleRow
              label="Weekend Holding"
              value={advanced.weekendHolding}
              onChange={(v) => onAdvancedChange('weekendHolding', v)}
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-gray-200">Profit Split</span>
              <SegmentedControl
                size="sm"
                ariaLabel="Profit split"
                value={advanced.profitSplit}
                onChange={(v) => onAdvancedChange('profitSplit', v)}
                options={PROFIT_SPLIT_OPTIONS.map((p) => ({ value: p, label: `${p}%` }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-200">Payout Frequency</span>
              <SegmentedControl
                size="sm"
                ariaLabel="Payout frequency"
                value={advanced.payoutFrequency}
                onChange={(v) => onAdvancedChange('payoutFrequency', v)}
                options={PAYOUT_FREQUENCY_OPTIONS.map((f) => ({ value: f, label: f }))}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-200">{label}</span>
      <SegmentedControl
        size="sm"
        ariaLabel={label}
        value={value}
        onChange={onChange}
        options={[
          { value: false, label: 'No' },
          { value: true, label: 'Yes' },
        ]}
      />
    </div>
  );
}

/* ============================================================================
   PriceBreakdown
   Disclosure showing how the final price was assembled: base price, then
   every non-neutral modifier, then the final total. Purely presentational —
   consumes the object calculatePricing() returns.
   ============================================================================ */

function PriceBreakdown({ pricing }) {
  const [open, setOpen] = useState(false);

  const adjustments = Object.entries(pricing.modifiers)
    .filter(([, multiplier]) => Math.abs(multiplier - 1) > 0.001)
    .map(([key, multiplier]) => ({
      label: MODIFIER_LABELS[key],
      delta: formatModifierDelta(multiplier),
    }));

  return (
    <div className="mb-6 -mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded"
      >
        Price breakdown
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Base Price</span>
              <span className="text-gray-300 font-mono">{formatEUR(pricing.basePrice)}</span>
            </div>

            {adjustments.length > 0 && (
              <div className="pt-1">
                <div className="text-gray-600 uppercase tracking-wider text-[10px] mb-1.5">Rule Adjustments</div>
                <div className="space-y-1.5">
                  {adjustments.map((a) => (
                    <div key={a.label} className="flex items-center justify-between">
                      <span className="text-gray-500">{a.label}</span>
                      <span className="text-gray-300 font-mono">{a.delta}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-gray-400">Final Price</span>
              <span className="text-white font-mono">{formatEUR(pricing.finalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ChallengeSummary
   ============================================================================ */

function ChallengeSummary({ step, accountSize, rules, pricing, onStart }) {
  const stepLabel = step === STEP_TYPES.ONE_STEP ? '1-Step' : '2-Step';

  return (
    <aside className="lg:sticky lg:top-8 rounded-xl border border-white/[0.08] bg-[#0A0C12] shadow-2xl shadow-black p-6 h-fit">
      <h2 className="text-sm font-medium text-white mb-5">Your Challenge</h2>

      <div className="flex items-baseline justify-between mb-1">
        <span className="text-2xl font-medium tracking-tight text-white">{formatAccountSize(accountSize)}</span>
        <span className="text-xs font-medium text-gray-400 px-2 py-1 rounded-full border border-white/[0.08] bg-white/[0.02]">
          {stepLabel}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-5">Account</p>

      <ul className="space-y-2.5 mb-6">
        {step === STEP_TYPES.ONE_STEP ? (
          <SummaryLine label="Profit Target" value={`${rules.profitTarget}%`} />
        ) : (
          <>
            <SummaryLine label="Phase 1 Target" value={`${rules.phase1ProfitTarget}%`} />
            <SummaryLine label="Phase 2 Target" value={`${rules.phase2ProfitTarget}%`} />
          </>
        )}
        <SummaryLine label="Daily Loss" value={`${rules.dailyLoss}%`} />
        <SummaryLine label="Maximum Loss" value={`${rules.maxLoss}%`} />
      </ul>

      <div className="rounded-lg border border-white/[0.06] bg-white/[0.01] px-4 py-4 mb-3">
        <div className="text-2xl font-medium tracking-tight text-white">{formatEUR(pricing.finalPrice)}</div>
        <div className="text-xs text-gray-500 mt-0.5">One-time fee</div>
      </div>

      <PriceBreakdown pricing={pricing} />

      <button
        type="button"
        onClick={onStart}
        className="w-full h-11 rounded-md bg-white text-[#05060A] font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C12]"
      >
        Start Your Challenge
        <ArrowRight className="w-4 h-4 opacity-70" strokeWidth={2} />
      </button>
    </aside>
  );
}

function SummaryLine({ label, value }) {
  return (
    <li className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-200 font-mono">{value}</span>
    </li>
  );
}

/* ============================================================================
   BuildChallenge — top-level component
   Owns all configuration state; children are presentational and receive
   values/handlers as props. Pricing is derived state, recomputed via
   useMemo whenever the configuration changes.
   ============================================================================ */

export default function BuildChallenge() {
  const [step, setStep] = useState(STEP_TYPES.ONE_STEP);
  const [accountSize, setAccountSize] = useState(ACCOUNT_SIZE_CONFIG[STEP_TYPES.ONE_STEP].default);
  const [rules, setRules] = useState(DEFAULT_RULES[STEP_TYPES.ONE_STEP]);
  const [advanced, setAdvanced] = useState({
    newsTrading: false,
    weekendHolding: false,
    profitSplit: 80,
    payoutFrequency: 'Biweekly',
  });

  const handleStepChange = useCallback((nextStep) => {
    setStep(nextStep);
    setRules(DEFAULT_RULES[nextStep]);

    const { min, max } = ACCOUNT_SIZE_CONFIG[nextStep];
    setAccountSize((current) => clamp(current, min, max));
  }, []);

  const handleRuleChange = useCallback((key, value) => {
    setRules((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleAdvancedChange = useCallback((key, value) => {
    setAdvanced((prev) => ({ ...prev, [key]: value }));
  }, []);

  const pricing = useMemo(
    () => calculatePricing({ step, accountSize, rules, advanced }),
    [step, accountSize, rules, advanced]
  );

  const handleStart = () => {
    // Placeholder only — wire this up to your checkout/API flow.
    console.log('Start challenge with config:', { step, accountSize, rules, advanced, pricing });
  };

  return (
    <div className="relative min-h-screen bg-[#05060A] text-white font-sans selection:bg-white/20 selection:text-white">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 sm:py-24">
        <ChallengeHeader />
        <StepSelector step={step} onChange={handleStepChange} />
        <AccountSizeSelector step={step} value={accountSize} onChange={setAccountSize} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div>
            <RuleConfigurator step={step} rules={rules} onRuleChange={handleRuleChange} />
            <AdvancedOptions advanced={advanced} onAdvancedChange={handleAdvancedChange} />
          </div>

          <ChallengeSummary
            step={step}
            accountSize={accountSize}
            rules={rules}
            pricing={pricing}
            onStart={handleStart}
          />
        </div>
      </div>
    </div>
  );
}