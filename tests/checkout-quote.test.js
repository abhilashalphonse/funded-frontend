import test from "node:test";
import assert from "node:assert/strict";
import { checkoutPriceMatches, validCheckoutQuote, isRefreshableCheckoutError } from "../src/utils/checkoutQuote.js";
import { PRICING_VERSION } from "../src/utils/challengeRules.js";

const quote = { amount: 189, currency: "USD", pricingVersion: PRICING_VERSION };
test("only complete authoritative USD quotes are accepted", () => {
  assert.equal(validCheckoutQuote(quote), true);
  assert.equal(validCheckoutQuote({ ...quote, amount: 0 }), false);
  assert.equal(validCheckoutQuote({ ...quote, amount: Number.NaN }), false);
  assert.equal(validCheckoutQuote({ ...quote, currency: "INR" }), false);
  assert.equal(validCheckoutQuote({ ...quote, pricingVersion: "" }), false);
  assert.equal(validCheckoutQuote(null), false);
});
test("saved old checkout price or pricing version requires customer acceptance", () => {
  assert.equal(checkoutPriceMatches({ finalPrice: 189, pricingVersion: quote.pricingVersion }, quote), true);
  assert.equal(checkoutPriceMatches({ finalPrice: 108, pricingVersion: quote.pricingVersion }, quote), false);
  assert.equal(checkoutPriceMatches({ finalPrice: 189, pricingVersion: "legacy" }, quote), false);
  assert.equal(checkoutPriceMatches(null, quote), false);
});
test("only expected payment quote failures trigger refresh", () => {
  assert.equal(isRefreshableCheckoutError("UPI_QUOTE_EXPIRED"), true);
  assert.equal(isRefreshableCheckoutError("CHECKOUT_PRICE_CHANGED"), true);
  assert.equal(isRefreshableCheckoutError("UPI_QUOTE_INVALID"), true);
  assert.equal(isRefreshableCheckoutError("PAYMENT_PROVIDER_UNAVAILABLE"), false);
});
