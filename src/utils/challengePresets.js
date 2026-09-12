/**
 * challengePresets.js
 *
 * Presets are just starting points that populate the same builder state —
 * they never create separate product types. Selecting a preset sets
 * { step, rules, commercial } and the user can still change every field
 * afterwards.
 */

import { STEP_TYPES, DEFAULT_RULES, DEFAULT_COMMERCIAL_CONFIG } from './challengeRules.js';

export const CHALLENGE_PRESETS = [
  {
    id: 'balanced',
    name: 'Balanced',
    tagline: 'Most Popular',
    description: 'Our recommended 2-Step configuration — standard risk, standard price.',
    step: STEP_TYPES.TWO_STEP,
    rules: { ...DEFAULT_RULES[STEP_TYPES.TWO_STEP] },
    commercial: { ...DEFAULT_COMMERCIAL_CONFIG },
  },
  {
    id: 'fast-track',
    name: 'Fast Track',
    tagline: 'Fast Track',
    description: 'Single evaluation phase — get funded in one pass.',
    step: STEP_TYPES.ONE_STEP,
    rules: { ...DEFAULT_RULES[STEP_TYPES.ONE_STEP] },
    commercial: { ...DEFAULT_COMMERCIAL_CONFIG },
  },
  {
    id: 'conservative',
    name: 'Conservative',
    tagline: 'Lower Risk',
    description: 'Higher targets and tighter drawdown limits, at a lower price.',
    step: STEP_TYPES.TWO_STEP,
    rules: {
      phase1ProfitTarget: 10,
      phase2ProfitTarget: 8,
      dailyLoss: 3,
      maxLoss: 6,
      minTradingDays: 5,
    },
    commercial: { ...DEFAULT_COMMERCIAL_CONFIG },
  },
  {
    id: 'custom',
    name: 'Custom',
    tagline: 'Build Your Own',
    description: 'Start from the standard configuration and adjust every rule yourself.',
    step: STEP_TYPES.TWO_STEP,
    rules: { ...DEFAULT_RULES[STEP_TYPES.TWO_STEP] },
    commercial: { ...DEFAULT_COMMERCIAL_CONFIG },
  },
];

export function getPresetById(id) {
  return CHALLENGE_PRESETS.find((p) => p.id === id) ?? null;
}