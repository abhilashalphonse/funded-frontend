import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Minus, Plus, ChevronDown, ArrowRight, Check, AlertCircle } from 'lucide-react';

import {
  STEP_TYPES,
  ACCOUNT_SIZE_CONFIG,
  ACCOUNT_SIZE_ANCHORS,
  RECOMMENDED_ACCOUNT_SIZE,
  DEFAULT_RULES,
  DEFAULT_COMMERCIAL_CONFIG,
  RULE_BOUNDS,
  PROFIT_SPLIT_OPTIONS,
  PAYOUT_FREQUENCY_OPTIONS,
} from '../../utils/challengeRules.js';
import { calculatePrice, validateChallengeConfiguration } from '../../utils/pricingEngine.js';
import { CHALLENGE_PRESETS } from '../../utils/challengePresets.js';
import { trackAcquisitionEvent } from '../../services/analytics.js';

/* ============================================================================
   HELPERS
   ============================================================================ */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const formatAccountSize = (value) => `$${Math.round(value).toLocaleString('en-US')}`;
const formatEUR = (amount) => `€${Math.round(amount).toLocaleString('en-US')}`;
const formatSignedEUR = (amount) => {
  const rounded = Math.round(amount);
  if (rounded === 0) return null;
  return rounded > 0 ? `+${formatEUR(rounded)}` : `-${formatEUR(Math.abs(rounded))}`;
};

/* ============================================================================
   PRIMITIVE: SegmentedControl
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
            } ${active ? 'bg-white text-[#05060A]' : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'}`}
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
        You choose the capital, risk and trading conditions. We price the risk.
      </p>
    </div>
  );
}

/* ============================================================================
   PathCard + PathSelector — Step 1 of the flow: the two flagship
   configurations, shown as product cards rather than a settings toggle.
   ============================================================================ */

function PathCard({ step, active, onSelect }) {
  const isTwoStep = step === STEP_TYPES.TWO_STEP;

  return (
    <button
      type="button"
      onClick={() => onSelect(step)}
      aria-pressed={active}
      className={`text-left rounded-xl border p-5 sm:p-6 transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
        active
          ? 'border-white/40 bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.05)]'
          : 'border-white/[0.08] bg-[#0A0C12] hover:border-white/20 hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-lg font-medium text-white">
            {isTwoStep ? '2-Step' : '1-Step'}
          </div>

          <div className="text-xs text-gray-500 mt-1">
            {isTwoStep
              ? 'Standard 2-phase evaluation'
              : 'Fast-track single evaluation'}
          </div>
        </div>

        <span
          className={`h-6 w-6 rounded-full flex items-center justify-center border ${
            active
              ? 'bg-white border-white'
              : 'border-white/20'
          }`}
        >
          {active && (
            <Check
              className="w-3.5 h-3.5 text-[#05060A]"
              strokeWidth={3}
            />
          )}
        </span>
      </div>

      <div className="text-xs text-gray-400">
        {isTwoStep
          ? 'Two evaluation phases with a verification stage.'
          : 'One evaluation phase for a faster path to funded.'}
      </div>

      <div className="mt-4 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
        {isTwoStep ? 'Best value' : 'Fast track'}
      </div>
    </button>
  );
}

function PathSelector({ step, onChange }) {
  return (
    <section className="mb-12">
      <div className="text-center mb-4">
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Choose your evaluation
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
        <PathCard
          step={STEP_TYPES.TWO_STEP}
          active={step === STEP_TYPES.TWO_STEP}
          onSelect={onChange}
        />

        <PathCard
          step={STEP_TYPES.ONE_STEP}
          active={step === STEP_TYPES.ONE_STEP}
          onSelect={onChange}
        />
      </div>
    </section>
  );
}

/* ============================================================================
   PresetSelector — quick starting points; purely populate builder state.
   ============================================================================ */

function PresetSelector({ activePresetId, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      {CHALLENGE_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => onSelect(preset)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
            activePresetId === preset.id
              ? 'border-white/40 text-white bg-white/[0.06]'
              : 'border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20'
          }`}
          title={preset.description}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
}

/* ============================================================================
   AccountSizeSelector
   ============================================================================ */

function AccountSizeSelector({ step, value, onChange }) {
  const { min, max, step: increment } = ACCOUNT_SIZE_CONFIG[step];
  const anchors = ACCOUNT_SIZE_ANCHORS[step];
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
      <div className="text-center mb-4">
  <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
    Choose your account size
  </div>
  <div className="text-xs text-gray-600 mt-1">
    Start with the account size that fits your strategy
  </div>
</div>

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
        className="w-full max-w-xs text-center bg-transparent text-5xl sm:text-6xl font-medium tracking-tighter text-white mb-6 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-md transition-colors"
      />

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {anchors.map((anchor) => {
          const active = value === anchor;
          const recommended = anchor === RECOMMENDED_ACCOUNT_SIZE;
          return (
            <button
              key={anchor}
              type="button"
              onClick={() => onChange(anchor)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
  active
    ? 'border-white bg-white text-[#05060A]'
    : 'border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20'
}`}
            >
              {formatAccountSize(anchor)}
              {recommended && (
  <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-gray-500 bg-[#05060A] px-1.5">
    recommended
  </span>
)}
            </button>
          );
        })}
      </div>

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
        .account-slider { -webkit-appearance: none; height: 24px; }
        .account-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px; border-radius: 9999px;
          background: #FFFFFF; border: 2px solid #05060A; box-shadow: 0 0 0 1px rgba(255,255,255,0.15);
          cursor: pointer; transition: transform 150ms ease; margin-top: 0;
        }
        .account-slider::-webkit-slider-thumb:hover { transform: scale(1.1); }
        .account-slider:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px rgba(255,255,255,0.35); }
        .account-slider::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 9999px; background: #FFFFFF;
          border: 2px solid #05060A; cursor: pointer; transition: transform 150ms ease;
        }
        .account-slider::-moz-range-track { background: transparent; }
      `}</style>
    </div>
  );
}

/* ============================================================================
   RuleControl
   ============================================================================ */

function RuleControl({ label, value, unit = '%', bounds, onChange, helpText, error }) {
  const { min, max, increment } = bounds;
  const round = (n) => Math.round(n * 100) / 100;
  const dec = () => onChange(clamp(round(value - increment), min, max));
  const inc = () => onChange(clamp(round(value + increment), min, max));

  return (
    <div className="py-4 border-b border-white/[0.06] last:border-0">
      <div className="flex items-center justify-between">
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
      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   PhaseTargets — 2-Step phase 1 / phase 2 target pair
   ============================================================================ */

function PhaseTargets({ rules, onRuleChange }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-1">
      {[
        { key: 'phase1ProfitTarget', label: 'Phase 1' },
        { key: 'phase2ProfitTarget', label: 'Phase 2' },
      ].map(({ key, label }) => {
        const bounds = RULE_BOUNDS[key];
        return (
          <div key={key} className="rounded-lg border border-white/[0.08] bg-[#0A0C12] p-4">
            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">{label} Target</div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-medium tracking-tight text-white">{rules[key]}%</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onRuleChange(key, clamp(rules[key] - bounds.increment, bounds.min, bounds.max))}
                  disabled={rules[key] <= bounds.min}
                  aria-label={`Decrease ${label} target`}
                  className="h-7 w-7 flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:hover:bg-transparent transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onRuleChange(key, clamp(rules[key] + bounds.increment, bounds.min, bounds.max))}
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
  );
}

/* ============================================================================
   RuleConfigurator
   ============================================================================ */

function RuleConfigurator({ step, rules, onRuleChange, fieldErrors }) {
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
            error={fieldErrors.profitTarget}
          />
        )}
        <RuleControl
          label="Daily Loss"
          value={rules.dailyLoss}
          bounds={RULE_BOUNDS.dailyLoss}
          onChange={(v) => onRuleChange('dailyLoss', v)}
          helpText="Maximum drawdown allowed in a single day"
          error={fieldErrors.dailyLoss}
        />
        <RuleControl
          label="Maximum Loss"
          value={rules.maxLoss}
          bounds={RULE_BOUNDS.maxLoss}
          onChange={(v) => onRuleChange('maxLoss', v)}
          helpText="Maximum drawdown allowed overall"
          error={fieldErrors.maxLoss}
        />
        <RuleControl
          label="Minimum Trading Days"
          value={rules.minTradingDays}
          unit=""
          bounds={RULE_BOUNDS.minTradingDays}
          onChange={(v) => onRuleChange('minTradingDays', v)}
          error={fieldErrors.minTradingDays}
        />
      </div>
    </section>
  );
}

/* ============================================================================
   AdvancedOptions
   ============================================================================ */

function ToggleRow({ label, value, onChange, helpText }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-gray-200">{label}</div>
        {helpText && <div className="text-xs text-gray-500 mt-0.5">{helpText}</div>}
      </div>
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
              helpText="Trade through high-impact news events"
              value={advanced.newsTrading}
              onChange={(v) => onAdvancedChange('newsTrading', v)}
            />
            <ToggleRow
              label="Weekend Holding"
              helpText="Keep positions open over the weekend"
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

/* ============================================================================
   PriceBreakdown
   Shows Base / Customization / Promotion / Total only — never the internal
   per-rule modifier percentages (spec section 15).
   ============================================================================ */

function PriceBreakdown({ pricing }) {
  const [open, setOpen] = useState(false);
  const customizationLabel = formatSignedEUR(pricing.customizationPrice);

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
              <span className="text-gray-500">Base Challenge</span>
              <span className="text-gray-300 font-mono">{formatEUR(pricing.basePrice)}</span>
            </div>
            {customizationLabel && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Custom Conditions</span>
                <span className="text-gray-300 font-mono">{customizationLabel}</span>
              </div>
            )}
            {pricing.promotionDiscount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Promotion</span>
                <span className="text-gray-300 font-mono">-{formatEUR(pricing.promotionDiscount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-gray-400">Total</span>
              <span className="text-white font-mono">{formatEUR(pricing.finalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ChallengeSummary — checkout-preview sidebar
   ============================================================================ */

function ChallengeSummary({ step, accountSize, rules, advanced, pricing, isValid, validationErrors, onStart, onStartFreeTrial }) {
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
        <SummaryLine label="Profit Split" value={`${advanced.profitSplit}%`} />
        <SummaryLine label="Payout" value={advanced.payoutFrequency} />
      </ul>

      <div className="rounded-lg border border-white/[0.06] bg-white/[0.01] px-4 py-4 mb-3">
        <div className="text-2xl font-medium tracking-tight text-white">{formatEUR(pricing.finalPrice)}</div>
        <div className="text-xs text-gray-500 mt-0.5">One-time fee</div>
      </div>

      <PriceBreakdown pricing={pricing} />

      {!isValid && (
        <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-md border border-red-500/20 bg-red-500/[0.06] text-xs text-red-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{validationErrors[0]?.message ?? 'Fix the highlighted rules to continue.'}</span>
        </div>
      )}

      <button
        type="button"
        onClick={onStart}
        disabled={!isValid}
        className="w-full h-11 rounded-md bg-white text-[#05060A] font-medium text-sm hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0C12]"
      >
        Start Your Challenge
        <ArrowRight className="w-4 h-4 opacity-70" strokeWidth={2} />
      </button>

      <button
        type="button"
        onClick={onStartFreeTrial}
        disabled={!isValid}
        className="mt-2.5 w-full h-11 rounded-md border border-white/[0.1] bg-white/[0.02] text-gray-300 font-medium text-sm hover:text-white hover:bg-white/[0.05] disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
      >
        Try This Challenge Free
      </button>

      <p className="mt-3 text-center text-[11px] leading-relaxed text-gray-600">
        14-day simulated trial · 5% target · 2 minimum trading days · no payment required
      </p>
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

   Owns three cleanly separated pieces of state (mirrors the contract the
   backend will eventually use, section 22):
     - challengeDefinition  { step, accountSize, rules }
     - commercialConfig     { profitSplit, payoutFrequency, newsTrading, weekendHolding }
     - pricing               derived, recomputed via useMemo

   Trading Execution Configuration (broker/server/leverage/symbols) is
   intentionally out of scope for this component.
   ============================================================================ */

export default function BuildChallenge({ onSelectPlan, onSelectFreeTrial }) {
  const [step, setStep] = useState(STEP_TYPES.TWO_STEP);
  const [accountSize, setAccountSize] = useState(RECOMMENDED_ACCOUNT_SIZE);
  const [rules, setRules] = useState(DEFAULT_RULES[STEP_TYPES.TWO_STEP]);
  const [advanced, setAdvanced] = useState(DEFAULT_COMMERCIAL_CONFIG);
  const [activePresetId, setActivePresetId] = useState('balanced');

  const handleStepChange = useCallback((nextStep) => {
    setStep(nextStep);
    setRules(DEFAULT_RULES[nextStep]);
    setActivePresetId(nextStep === STEP_TYPES.TWO_STEP ? 'balanced' : 'fast-track');

    const { min, max } = ACCOUNT_SIZE_CONFIG[nextStep];
    setAccountSize((current) => clamp(current, min, max));
  }, []);

  const handlePresetSelect = useCallback((preset) => {
    setStep(preset.step);
    setRules(preset.rules);
    setAdvanced(preset.commercial);
    setActivePresetId(preset.id);
    setAccountSize((current) => clamp(current, ACCOUNT_SIZE_CONFIG[preset.step].min, ACCOUNT_SIZE_CONFIG[preset.step].max));
  }, []);

  const handleAccountSizeChange = useCallback((value) => {
    setAccountSize(value);
    setActivePresetId(null);
  }, []);

  const handleRuleChange = useCallback((key, value) => {
    setRules((prev) => ({ ...prev, [key]: value }));
    setActivePresetId(null);
  }, []);

  const handleAdvancedChange = useCallback((key, value) => {
    setAdvanced((prev) => ({ ...prev, [key]: value }));
    setActivePresetId(null);
  }, []);

  const validation = useMemo(
  () =>
    validateChallengeConfiguration({
      step,
      accountSize,
      rules,
      commercial: advanced,
    }),
  [
    step,
    accountSize,
    rules.profitTarget,
    rules.phase1ProfitTarget,
    rules.phase2ProfitTarget,
    rules.dailyLoss,
    rules.maxLoss,
    rules.minTradingDays,
    advanced.profitSplit,
    advanced.payoutFrequency,
    advanced.newsTrading,
    advanced.weekendHolding,
  ]
);

  const fieldErrors = useMemo(() => {
    const map = {};
    validation.errors.forEach((e) => {
      if (!map[e.field]) map[e.field] = e.message;
    });
    return map;
  }, [validation]);

  const pricing = useMemo(() => {
  if (!validation.valid) {
    return null;
  }

  const challengeDefinition = {
    step,
    accountSize,
    rules: {
      profitTarget: rules.profitTarget,
      phase1ProfitTarget: rules.phase1ProfitTarget,
      phase2ProfitTarget: rules.phase2ProfitTarget,
      dailyLoss: rules.dailyLoss,
      maxLoss: rules.maxLoss,
      minTradingDays: rules.minTradingDays,
    },
  };

  const commercialConfig = {
    profitSplit: advanced.profitSplit,
    payoutFrequency: advanced.payoutFrequency,
    newsTrading: advanced.newsTrading,
    weekendHolding: advanced.weekendHolding,
  };

  return calculatePrice(
    challengeDefinition,
    commercialConfig
  );
}, [
  validation.valid,
  step,
  accountSize,
  rules.profitTarget,
  rules.phase1ProfitTarget,
  rules.phase2ProfitTarget,
  rules.dailyLoss,
  rules.maxLoss,
  rules.minTradingDays,
  advanced.profitSplit,
  advanced.payoutFrequency,
  advanced.newsTrading,
  advanced.weekendHolding,
]);


  const buildSelectedPlan = () => ({
    challengeDefinition: {
      step,
      accountSize,
      rules: { ...rules },
    },
    commercialConfig: { ...advanced },
    pricingPreview: pricing,
  });

  const handleStart = () => {
    if (!validation.valid) return;
    onSelectPlan(buildSelectedPlan());
  };

  const handleStartFreeTrial = () => {
    if (!validation.valid) return;
    void trackAcquisitionEvent("free_trial_cta_clicked", {
      surface: "challenge_builder",
      step,
      accountSize,
    });
    onSelectFreeTrial(buildSelectedPlan());
  };

  return (
    <div id="challenge-builder" className="relative min-h-screen bg-[#05060A] text-white font-sans selection:bg-white/20 selection:text-white">
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
<PathSelector step={step} onChange={handleStepChange} />
<AccountSizeSelector
  step={step}
  value={accountSize}
  onChange={handleAccountSizeChange}
/>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
          <div>
            <RuleConfigurator step={step} rules={rules} onRuleChange={handleRuleChange} fieldErrors={fieldErrors} />
            <AdvancedOptions advanced={advanced} onAdvancedChange={handleAdvancedChange} />
          </div>

          <ChallengeSummary
            step={step}
            accountSize={accountSize}
            rules={rules}
            advanced={advanced}
            pricing={pricing}
            isValid={validation.valid}
            validationErrors={validation.errors}
            onStart={handleStart}
            onStartFreeTrial={handleStartFreeTrial}
          />
        </div>
      </div>
    </div>
  );
}