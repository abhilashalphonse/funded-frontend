
/**
 * pricingEngine.js
 *
 * Pure pricing logic — no React, no DOM, no state.
 *
 * This module can run:
 * - in the browser for instant price previews
 * - in the backend as the authoritative pricing engine
 *
 * IMPORTANT:
 * The browser price is NEVER authoritative.
 * The backend must independently recompute the price before checkout.
 */

import {
  STEP_TYPES,
  ACCOUNT_SIZE_CONFIG,
  RULE_BOUNDS,
  BASE_PRICE_CURVES,
  ADJUSTMENT_TABLES,
  PROFIT_SPLIT_ADJUSTMENTS,
  PAYOUT_ADJUSTMENTS,
  NEWS_TRADING_ADJUSTMENT,
  WEEKEND_HOLDING_ADJUSTMENT,
  PROFIT_SPLIT_OPTIONS,
  PAYOUT_FREQUENCY_OPTIONS,
  PRICE_MULTIPLIER_FLOOR,
  PRICE_MULTIPLIER_CEILING,
  PSYCHOLOGICAL_PRICES,
} from './challengeRules.js';


/* ----------------------------------------------------------------------
   Utilities
---------------------------------------------------------------------- */

export const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);


export const roundCurrency = (value) =>
  Math.round((value + Number.EPSILON) * 100) / 100;


function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}


/* ----------------------------------------------------------------------
   Base price
---------------------------------------------------------------------- */

/**
 * Piecewise-linear interpolation across the account-size curve.
 *
 * Example:
 * $50,000 1-Step => €269
 *
 * Custom account sizes between anchors are interpolated.
 */
export function calculateBasePrice(accountSize, step) {
  const curve = BASE_PRICE_CURVES[step];

  if (!curve || curve.length === 0) {
    throw new Error(
      `No base price curve exists for step "${step}".`
    );
  }

  if (!Number.isFinite(accountSize)) {
    throw new Error(
      'Account size must be a finite number.'
    );
  }

  if (accountSize <= curve[0].size) {
    return curve[0].price;
  }

  if (
    accountSize >=
    curve[curve.length - 1].size
  ) {
    return curve[curve.length - 1].price;
  }

  for (let i = 0; i < curve.length - 1; i += 1) {
    const lower = curve[i];
    const upper = curve[i + 1];

    if (
      accountSize >= lower.size &&
      accountSize <= upper.size
    ) {
      const ratio =
        (accountSize - lower.size) /
        (upper.size - lower.size);

      return (
        lower.price +
        ratio * (upper.price - lower.price)
      );
    }
  }

  throw new Error(
    'Unable to calculate base price.'
  );
}


/* ----------------------------------------------------------------------
   Psychological pricing
---------------------------------------------------------------------- */

/**
 * Psychological pricing is used ONLY for the base price.
 *
 * The customized subtotal is deliberately NOT passed through this
 * function because doing so can hide legitimate pricing changes.
 */
export function roundToPsychologicalPrice(rawPrice) {
  if (
    !Number.isFinite(rawPrice) ||
    rawPrice <= 0
  ) {
    return 0;
  }

  const match = PSYCHOLOGICAL_PRICES.find(
    (price) => price >= rawPrice
  );

  if (match !== undefined) {
    return match;
  }

  /*
   * Extend the ladder above its configured maximum.
   *
   * Example:
   * €1265.55 -> €1300 -> €1299
   */
  const ceilTo50 =
    Math.ceil(rawPrice / 50) * 50;

  return Math.max(1, ceilTo50 - 1);
}


/* ----------------------------------------------------------------------
   Strict adjustment lookup
---------------------------------------------------------------------- */

/**
 * NEVER silently return zero when a pricing definition is missing.
 *
 * A missing table entry means:
 * - the UI has sent an unsupported value
 * - challengeRules.js is incomplete
 * - or there is a pricing-engine bug
 *
 * All three cases should fail loudly.
 */
function getAdjustment(
  table,
  field,
  value
) {
  if (
    !table ||
    !Object.prototype.hasOwnProperty.call(
      table,
      value
    )
  ) {
    throw new Error(
      `Missing pricing adjustment for ${field}=${value}.`
    );
  }

  const adjustment = table[value];

  if (!Number.isFinite(adjustment)) {
    throw new Error(
      `Invalid pricing adjustment for ${field}=${value}.`
    );
  }

  return adjustment;
}


/* ----------------------------------------------------------------------
   Adjustment calculation
---------------------------------------------------------------------- */

/**
 * Calculates every individual commercial adjustment.
 *
 * Returns:
 *
 * {
 *   items: {
 *     profitTarget: 0,
 *     dailyLoss: 0,
 *     ...
 *   },
 *   total: 0
 * }
 */
export function computeAdjustments(
  step,
  rules,
  commercial
) {
  if (!ADJUSTMENT_TABLES[step]) {
    throw new Error(
      `No adjustment table exists for step "${step}".`
    );
  }

  if (!isPlainObject(rules)) {
    throw new Error(
      'Challenge rules are required.'
    );
  }

  if (!isPlainObject(commercial)) {
    throw new Error(
      'Commercial configuration is required.'
    );
  }

  const tables =
    ADJUSTMENT_TABLES[step];

  const items = {};


  /* ---------------------------------------------------------------
     Challenge rules
  ---------------------------------------------------------------- */

  if (step === STEP_TYPES.TWO_STEP) {
    items.phase1ProfitTarget =
      getAdjustment(
        tables.phase1ProfitTarget,
        'phase1ProfitTarget',
        rules.phase1ProfitTarget
      );

    items.phase2ProfitTarget =
      getAdjustment(
        tables.phase2ProfitTarget,
        'phase2ProfitTarget',
        rules.phase2ProfitTarget
      );
  } else {
    items.profitTarget =
      getAdjustment(
        tables.profitTarget,
        'profitTarget',
        rules.profitTarget
      );
  }


  items.dailyLoss =
    getAdjustment(
      tables.dailyLoss,
      'dailyLoss',
      rules.dailyLoss
    );


  items.maxLoss =
    getAdjustment(
      tables.maxLoss,
      'maxLoss',
      rules.maxLoss
    );


  items.minTradingDays =
    getAdjustment(
      tables.minTradingDays,
      'minTradingDays',
      rules.minTradingDays
    );


  /* ---------------------------------------------------------------
     Commercial options
  ---------------------------------------------------------------- */

  items.profitSplit =
    getAdjustment(
      PROFIT_SPLIT_ADJUSTMENTS,
      'profitSplit',
      commercial.profitSplit
    );


  items.payoutFrequency =
    getAdjustment(
      PAYOUT_ADJUSTMENTS,
      'payoutFrequency',
      commercial.payoutFrequency
    );


  items.newsTrading =
    commercial.newsTrading
      ? NEWS_TRADING_ADJUSTMENT
      : 0;


  items.weekendHolding =
    commercial.weekendHolding
      ? WEEKEND_HOLDING_ADJUSTMENT
      : 0;


  /* ---------------------------------------------------------------
     Total
  ---------------------------------------------------------------- */

  const total = Object.values(items).reduce(
    (sum, value) => sum + value,
    0
  );


  return {
    items,
    total,
  };
}


/* ----------------------------------------------------------------------
   Validation
---------------------------------------------------------------------- */

export function validateChallengeConfiguration(
  config
) {
  const errors = [];

  if (!isPlainObject(config)) {
    return {
      valid: false,
      errors: [
        {
          field: 'config',
          message:
            'Challenge configuration must be an object.',
        },
      ],
    };
  }


  const {
    step,
    accountSize,
    rules,
    commercial,
  } = config;


  /* ---------------------------------------------------------------
     Step
  ---------------------------------------------------------------- */

  if (
    !Object.values(STEP_TYPES).includes(step)
  ) {
    errors.push({
      field: 'step',
      message:
        'Unknown challenge type.',
    });

    return {
      valid: false,
      errors,
    };
  }


  /* ---------------------------------------------------------------
     Account size
  ---------------------------------------------------------------- */

  const sizeConfig =
    ACCOUNT_SIZE_CONFIG[step];

  if (!Number.isFinite(accountSize)) {
    errors.push({
      field: 'accountSize',
      message:
        'Account size must be a finite number.',
    });
  } else if (
    accountSize < sizeConfig.min ||
    accountSize > sizeConfig.max
  ) {
    errors.push({
      field: 'accountSize',
      message:
        `Account size must be between $${sizeConfig.min.toLocaleString(
          'en-US'
        )} and $${sizeConfig.max.toLocaleString(
          'en-US'
        )}.`,
    });
  } else if (
    (accountSize - sizeConfig.min) %
      sizeConfig.step !==
    0
  ) {
    errors.push({
      field: 'accountSize',
      message:
        `Account size must be in $${sizeConfig.step.toLocaleString(
          'en-US'
        )} increments.`,
    });
  }


  /* ---------------------------------------------------------------
     Rules
  ---------------------------------------------------------------- */

  const ruleFields =
    step === STEP_TYPES.TWO_STEP
      ? [
          'phase1ProfitTarget',
          'phase2ProfitTarget',
          'dailyLoss',
          'maxLoss',
          'minTradingDays',
        ]
      : [
          'profitTarget',
          'dailyLoss',
          'maxLoss',
          'minTradingDays',
        ];


  if (!isPlainObject(rules)) {
    errors.push({
      field: 'rules',
      message:
        'Challenge rules are required.',
    });
  } else {
    ruleFields.forEach((field) => {
      const bounds =
        RULE_BOUNDS[field];

      const value =
        rules[field];


      if (!bounds) {
        errors.push({
          field,
          message:
            `No rule bounds exist for ${field}.`,
        });

        return;
      }


      if (!Number.isFinite(value)) {
        errors.push({
          field,
          message:
            `${field} must be a number.`,
        });

        return;
      }


      if (
        value < bounds.min ||
        value > bounds.max
      ) {
        errors.push({
          field,
          message:
            `${field} must be between ${bounds.min} and ${bounds.max}.`,
        });

        return;
      }


      if (
        (value - bounds.min) %
          bounds.increment !==
        0
      ) {
        errors.push({
          field,
          message:
            `${field} must use increments of ${bounds.increment}.`,
        });
      }
    });


    /* -------------------------------------------------------------
       Economic sanity
    -------------------------------------------------------------- */

    if (
      Number.isFinite(rules.dailyLoss) &&
      Number.isFinite(rules.maxLoss) &&
      rules.dailyLoss > rules.maxLoss
    ) {
      errors.push({
        field: 'dailyLoss',
        message:
          'Daily Loss cannot be greater than Maximum Loss.',
      });
    }


    /* -------------------------------------------------------------
       Two-step sanity
    -------------------------------------------------------------- */

   
  }


  /* ---------------------------------------------------------------
     Commercial configuration
  ---------------------------------------------------------------- */

  if (!isPlainObject(commercial)) {
    errors.push({
      field: 'commercial',
      message:
        'Commercial configuration is required.',
    });
  } else {
    if (
      !PROFIT_SPLIT_OPTIONS.includes(
        commercial.profitSplit
      )
    ) {
      errors.push({
        field: 'profitSplit',
        message:
          'Unsupported profit split.',
      });
    }


    if (
      !PAYOUT_FREQUENCY_OPTIONS.includes(
        commercial.payoutFrequency
      )
    ) {
      errors.push({
        field: 'payoutFrequency',
        message:
          'Unsupported payout frequency.',
      });
    }


    if (
      typeof commercial.newsTrading !==
      'boolean'
    ) {
      errors.push({
        field: 'newsTrading',
        message:
          'News Trading must be true or false.',
      });
    }


    if (
      typeof commercial.weekendHolding !==
      'boolean'
    ) {
      errors.push({
        field: 'weekendHolding',
        message:
          'Weekend Holding must be true or false.',
      });
    }
  }


  return {
    valid: errors.length === 0,
    errors,
  };
}


/* ----------------------------------------------------------------------
   Main pricing function
---------------------------------------------------------------------- */

/**
 * ChallengeDefinition:
 *
 * {
 *   step,
 *   accountSize,
 *   rules
 * }
 *
 * CommercialConfig:
 *
 * {
 *   profitSplit,
 *   payoutFrequency,
 *   newsTrading,
 *   weekendHolding
 * }
 *
 * Promotion:
 *
 * {
 *   discount
 * }
 */
export function calculatePrice(
  challengeDefinition,
  commercialConfig,
  promotion = null
) {
  if (!isPlainObject(challengeDefinition)) {
    throw new Error(
      'Challenge definition is required.'
    );
  }


  const {
    step,
    accountSize,
    rules,
  } = challengeDefinition;


  /* ---------------------------------------------------------------
     Validate before calculating
  ---------------------------------------------------------------- */

  const validation =
    validateChallengeConfiguration({
      step,
      accountSize,
      rules,
      commercial: commercialConfig,
    });


  if (!validation.valid) {
    const error = new Error(
      'Invalid challenge configuration.'
    );

    error.code =
      'INVALID_CHALLENGE_CONFIGURATION';

    error.details =
      validation.errors;

    throw error;
  }


  /* ---------------------------------------------------------------
     Base price
  ---------------------------------------------------------------- */

  const rawBasePrice =
    calculateBasePrice(
      accountSize,
      step
    );


  /*
   * Psychological pricing applies to the BASE product price.
   *
   * Example:
   * interpolated base = €267.40
   * displayed base = €269
   */

  const basePrice =
    roundToPsychologicalPrice(
      rawBasePrice
    );


  /* ---------------------------------------------------------------
     Adjustments
  ---------------------------------------------------------------- */

  const {
    items: adjustmentItems,
    total: adjustmentTotal,
  } = computeAdjustments(
    step,
    rules,
    commercialConfig
  );


  /* ---------------------------------------------------------------
     Multiplier
  ---------------------------------------------------------------- */

  const rawMultiplier =
    1 + adjustmentTotal;


  const finalMultiplier =
    clamp(
      rawMultiplier,
      PRICE_MULTIPLIER_FLOOR,
      PRICE_MULTIPLIER_CEILING
    );


  /* ---------------------------------------------------------------
     Customized subtotal
  ---------------------------------------------------------------- */

  /*
   * IMPORTANT:
   *
   * Do NOT use roundToPsychologicalPrice() here.
   *
   * Psychological rounding was causing different configurations
   * to collapse into the same displayed price.
   *
   * Example:
   *
   * €269 × 0.96 = €258
   * €269 × 1.02 = €274
   *
   * Both must remain different prices.
   */

  const rawSubtotal =
  basePrice *
  finalMultiplier;


  const subtotal =
    Math.max(
      1,
      Math.round(rawSubtotal)
    );


  /* ---------------------------------------------------------------
     Customization delta
  ---------------------------------------------------------------- */

  const customizationPrice =
    subtotal - basePrice;


  /* ---------------------------------------------------------------
     Promotion
  ---------------------------------------------------------------- */

  let promotionDiscount = 0;


  if (
    promotion &&
    Number.isFinite(
      promotion.discount
    )
  ) {
    promotionDiscount =
      clamp(
        Math.round(
          promotion.discount
        ),
        0,
        subtotal
      );
  }


  /* ---------------------------------------------------------------
     Final price
  ---------------------------------------------------------------- */

  const finalPrice =
    Math.max(
      0,
      subtotal -
        promotionDiscount
    );


  /* ---------------------------------------------------------------
     Return
  ---------------------------------------------------------------- */

  return {
    basePrice,

    customizationPrice,

    subtotal,

    promotionDiscount,

    finalPrice,

    currency: 'EUR',

    multiplier:
      finalMultiplier,

    /*
     * Debug / audit information.
     * You don't need to display these to customers.
     */

    rawBasePrice,

    rawSubtotal,

    rawMultiplier,

    adjustmentTotal,

    adjustmentItems,
  };
}
