// Pure checkout-quote helpers shared by UI and tests.
export function validCheckoutQuote(quote) {
  return Boolean(quote)
    && quote.currency === "USD"
    && Number.isFinite(quote.amount)
    && quote.amount > 0
    && typeof quote.pricingVersion === "string"
    && quote.pricingVersion.length > 0;
}

export function checkoutPriceMatches(preview, quote) {
  return validCheckoutQuote(quote)
    && Number.isFinite(preview?.finalPrice)
    && preview.finalPrice === quote.amount
    && preview.pricingVersion === quote.pricingVersion;
}

export function isRefreshableCheckoutError(code) {
  return [
    "UPI_QUOTE_EXPIRED",
    "UPI_QUOTE_MISMATCH",
    "UPI_QUOTE_INVALID",
    "UPI_AMOUNT_OUT_OF_RANGE",
    "CHECKOUT_PRICE_CHANGED",
    "CHECKOUT_PRICE_CONFIRMATION_REQUIRED",
  ].includes(code);
}
