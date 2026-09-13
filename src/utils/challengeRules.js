
/**
 * challengeRules.js
 *
 * ACG Funded — Single Source of Truth
 *
 * Contains every configurable value that defines a challenge:
 *
 * - Challenge types
 * - Account-size limits
 * - Account-size anchors
 * - Default challenge rules
 * - Default commercial configuration
 * - Rule bounds
 * - Allowed commercial options
 * - Base price curves
 * - Pricing adjustment tables
 * - Pricing multiplier limits
 * - Psychological base-price ladder
 *
 * IMPORTANT:
 * This file contains NO React, DOM, API, database, or state logic.
 *
 * It can be imported by:
 *
 *   Frontend
 *      ↓
 *   pricingEngine.js
 *
 * and:
 *
 *   Backend
 *      ↓
 *   pricingEngine.js
 *
 * Both sides therefore use exactly the same commercial rules.
 */


/* ======================================================================
   CHALLENGE TYPES
====================================================================== */

export const STEP_TYPES = {
  ONE_STEP: '1step',
  TWO_STEP: '2step',
};


/* ======================================================================
   ACCOUNT SIZE
====================================================================== */

export const ACCOUNT_SIZE_CONFIG = {
  [STEP_TYPES.ONE_STEP]: {
    min: 5000,
    max: 100000,
    step: 500,
    default: 50000,
  },

  [STEP_TYPES.TWO_STEP]: {
    min: 5000,
    max: 200000,
    step: 500,
    default: 50000,
  },
};


/**
 * Account sizes highlighted by the UI.
 *
 * These are presentation anchors only.
 * The actual allowed account sizes are controlled by
 * ACCOUNT_SIZE_CONFIG.step.
 */
export const ACCOUNT_SIZE_ANCHORS = {
  [STEP_TYPES.ONE_STEP]: [
    10000,
    25000,
    50000,
    100000,
  ],

  [STEP_TYPES.TWO_STEP]: [
    10000,
    25000,
    50000,
    100000,
    150000,
    200000,
  ],
};


/**
 * Recommended / sweet-spot account size.
 */
export const RECOMMENDED_ACCOUNT_SIZE = 50000;


/* ======================================================================
   DEFAULT CHALLENGE RULES
====================================================================== */

export const DEFAULT_RULES = {
  [STEP_TYPES.ONE_STEP]: {
    profitTarget: 10,
    dailyLoss: 3,
    maxLoss: 6,
    minTradingDays: 3,
  },

  [STEP_TYPES.TWO_STEP]: {
    phase1ProfitTarget: 8,
    phase2ProfitTarget: 6,
    dailyLoss: 5,
    maxLoss: 10,
    minTradingDays: 3,
  },
};


/* ======================================================================
   DEFAULT COMMERCIAL CONFIGURATION
====================================================================== */

export const DEFAULT_COMMERCIAL_CONFIG = {
  newsTrading: false,
  weekendHolding: false,
  profitSplit: 80,
  payoutFrequency: 'Biweekly',
};


/* ======================================================================
   RULE BOUNDS
====================================================================== */

/**
 * Every numeric challenge rule must exist inside these bounds.
 *
 * The pricing engine validates against these values.
 *
 * IMPORTANT:
 * These are NOT merely UI limits.
 * They are backend validation limits as well.
 */
export const RULE_BOUNDS = {
  profitTarget: {
    min: 5,
    max: 12,
    increment: 1,
  },

  phase1ProfitTarget: {
    min: 5,
    max: 12,
    increment: 1,
  },

  phase2ProfitTarget: {
    min: 5,
    max: 12,
    increment: 1,
  },

  dailyLoss: {
    min: 2,
    max: 5,
    increment: 1,
  },

  maxLoss: {
    min: 5,
    max: 10,
    increment: 1,
  },

  minTradingDays: {
    min: 3,
    max: 5,
    increment: 1,
  },
};


/* ======================================================================
   COMMERCIAL OPTIONS
====================================================================== */

export const PROFIT_SPLIT_OPTIONS = [
  80,
  90,
  100,
];


export const PAYOUT_FREQUENCY_OPTIONS = [
  'Monthly',
  'Biweekly',
  'Weekly',
  'On Demand',
];


/* ======================================================================
   BASE PRICE CURVES
====================================================================== */

/**
 * Base prices represent the price of the DEFAULT challenge
 * configuration at each account-size anchor.
 *
 * IMPORTANT:
 *
 * These prices are the starting point.
 *
 * Custom challenge rules are priced through ADJUSTMENT_TABLES.
 *
 * Therefore:
 *
 * default configuration
 *        ↓
 * multiplier = 1.00
 *        ↓
 * base price
 *
 * Example:
 *
 * $50K 1-Step default = €269
 * $50K 2-Step default = €189
 */

export const BASE_PRICE_CURVES = {
  [STEP_TYPES.ONE_STEP]: [
    {
      size: 5000,
      price: 39,
    },

    {
      size: 10000,
      price: 69,
    },

    {
      size: 25000,
      price: 149,
    },

    {
      size: 50000,
      price: 269,
    },

    {
      size: 75000,
      price: 379,
    },

    {
      size: 100000,
      price: 499,
    },
  ],

  [STEP_TYPES.TWO_STEP]: [
    {
      size: 5000,
      price: 29,
    },

    {
      size: 10000,
      price: 49,
    },

    {
      size: 25000,
      price: 99,
    },

    {
      size: 50000,
      price: 189,
    },

    {
      size: 100000,
      price: 349,
    },

    {
      size: 150000,
      price: 499,
    },

    {
      size: 200000,
      price: 649,
    },
  ],
};


/* ======================================================================
   PRICING ADJUSTMENT TABLES
====================================================================== */

/**
 * All values are ADDITIVE multiplier adjustments.
 *
 * Example:
 *
 * base = €269
 *
 * +27% profit split
 * +22% payout
 *
 * adjustmentTotal = 0.49
 *
 * multiplier = 1.49
 *
 * price ≈ €401
 *
 *
 * DEFAULT VALUES MUST ALWAYS BE ZERO.
 *
 * This guarantees:
 *
 * DEFAULT CONFIG
 *      ↓
 * adjustmentTotal = 0
 *      ↓
 * multiplier = 1
 *      ↓
 * base price
 */


/* ----------------------------------------------------------------------
   1-STEP
---------------------------------------------------------------------- */

const ONE_STEP_ADJUSTMENTS = {
  profitTarget: {
    5: 0.35,
    6: 0.27,
    7: 0.20,
    8: 0.13,
    9: 0.06,
    10: 0,
    11: -0.04,
    12: -0.08,
  },

  dailyLoss: {
    2: -0.06,
    3: 0,
    4: 0.10,
    5: 0.21,
  },

  maxLoss: {
    5: -0.05,
    6: 0,
    7: 0.08,
    8: 0.16,
    9: 0.25,
    10: 0.35,
  },

  /**
   * 3 days is the default.
   *
   * Therefore 3 MUST equal zero.
   *
   * More required days reduce ACG risk and therefore receive
   * a lower price.
   */
  minTradingDays: {
    3: 0,
    4: -0.05,
    5: -0.08,
  },
};


/* ----------------------------------------------------------------------
   2-STEP
---------------------------------------------------------------------- */

const TWO_STEP_ADJUSTMENTS = {
  phase1ProfitTarget: {
    5: 0.22,
    6: 0.15,
    7: 0.08,
    8: 0,
    9: -0.05,
    10: -0.09,
    11: -0.12,
    12: -0.15,
  },

  /**
   * 6% is the default Phase 2 target.
   */
  phase2ProfitTarget: {
  5: 0.20,
  6: 0,
  7: -0.06,
  8: -0.11,
  9: -0.16,
  10: -0.20,
  11: -0.24,
  12: -0.28,
},

  dailyLoss: {
    2: -0.12,
    3: -0.06,
    4: -0.03,
    5: 0,
  },

  maxLoss: {
    5: -0.20,
    6: -0.15,
    7: -0.10,
    8: -0.06,
    9: -0.03,
    10: 0,
  },

  minTradingDays: {
    3: 0,
    4: -0.05,
    5: -0.08,
  },
};


/**
 * Expose adjustment tables by challenge type.
 */
export const ADJUSTMENT_TABLES = {
  [STEP_TYPES.ONE_STEP]: ONE_STEP_ADJUSTMENTS,
  [STEP_TYPES.TWO_STEP]: TWO_STEP_ADJUSTMENTS,
};


/* ======================================================================
   COMMERCIAL ADJUSTMENTS
====================================================================== */

/**
 * Profit split:
 *
 * 80% = standard
 * 90% = premium
 * 100% = maximum premium
 */
export const PROFIT_SPLIT_ADJUSTMENTS = {
  80: 0,
  90: 0.12,
  100: 0.27,
};


/**
 * Payout frequency:
 *
 * Monthly = cheaper
 * Biweekly = standard
 * Weekly = premium
 * On Demand = highest premium
 */
export const PAYOUT_ADJUSTMENTS = {
  Monthly: -0.05,
  Biweekly: 0,
  Weekly: 0.10,
  'On Demand': 0.22,
};


/**
 * Trading freedom premiums.
 */
export const NEWS_TRADING_ADJUSTMENT = 0.07;

export const WEEKEND_HOLDING_ADJUSTMENT = 0.05;


/* ======================================================================
   PRICING MULTIPLIER LIMITS
====================================================================== */

/**
 * Prevent extreme configurations from becoming commercially
 * nonsensical.
 */
export const PRICE_MULTIPLIER_FLOOR = 0.40;

export const PRICE_MULTIPLIER_CEILING = 1.95;


/* ======================================================================
   PSYCHOLOGICAL PRICE LADDER
====================================================================== */

/**
 * Used for BASE prices.
 *
 * The final customized subtotal should NOT be forced through
 * this ladder because doing so can make different configurations
 * appear to have the same price.
 */
export const PSYCHOLOGICAL_PRICES = [
  29,
  39,
  49,
  59,
  69,
  79,
  89,
  99,
  129,
  149,
  169,
  189,
  219,
  239,
  269,
  299,
  349,
  379,
  399,
  449,
  499,
  549,
  599,
  649,
  699,
  749,
];


/* ======================================================================
   OPTIONAL PRICING METADATA
====================================================================== */

/**
 * These labels can be used by the UI without duplicating commercial
 * meaning in React.
 */
export const PRICING_METADATA = {
  [STEP_TYPES.ONE_STEP]: {
    name: '1-Step',
    positioning: 'Fast Track',
  },

  [STEP_TYPES.TWO_STEP]: {
    name: '2-Step',
    positioning: 'Best Value',
  },
};
