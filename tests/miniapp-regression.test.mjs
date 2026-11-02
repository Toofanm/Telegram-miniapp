import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const products = JSON.parse(readFileSync(new URL("../products.json", import.meta.url), "utf8"));
const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter((source) => source.trim());
const appScript = inlineScripts.at(-1);

test("Mini App inline JavaScript parses", () => {
  assert.ok(appScript, "inline app script must exist");
  assert.doesNotThrow(() => new Function(appScript));
});

test("catalog keeps stable unique IDs and one dedicated discount item", () => {
  const ids = products.map((product) => String(product.id));
  assert.equal(products.length, 190);
  assert.equal(new Set(ids).size, products.length);
  const discounts = products.filter((product) => product.category === "discount");
  assert.equal(discounts.length, 1);
  assert.equal(String(discounts[0].id), "21");
});

test("catalog has source prices and verifiable image provenance", () => {
  for (const product of products) {
    const base = Number(product.basePrice);
    assert.ok(Number.isFinite(base) && base > 0, "invalid basePrice for product " + product.id);
    const rate = product.category === "steroid" ? 0.20 : 0.15;
    const finalPrice = Math.round((base * (1 + rate)) / 5000) * 5000;
    assert.equal(finalPrice % 5000, 0);
    if (product.image) assert.ok(product.imageSource, "image source missing for product " + product.id);
  }
});

test("mobile cart badge, cart navigation, and checkout retry key are wired", () => {
  assert.match(appScript, /id="mobile-cart-count"/);
  assert.match(appScript, /getElementById\("mobile-cart"\)\.addEventListener\("click"/);
  assert.match(appScript, /idempotency_key:idempotencyKey/);
  assert.match(appScript, /clearCheckoutIdempotencyKey\(\)/);
  assert.doesNotMatch(appScript, /ثبت سفارش و پرداخت آنلاین در این نسخه آزمایشی فعال نیست/);
});

test("Persian and Arabic product weights calculate shipping correctly", () => {
  const start = appScript.indexOf("function normalizeWeightDigits");
  const end = appScript.indexOf("\nfunction openCart", start);
  assert.ok(start >= 0 && end > start, "weight and shipping helpers must exist");
  const helpers = appScript.slice(start, end);
  const productsById = new Map([
    ["1", { weight: "۲.۷ کیلو" }],
    ["2", { weight: "۵۰۰ گرم" }],
    ["3", { weight: "١.٢ kg" }],
    ["4", { weight: "وزن نامشخص" }],
  ]);
  let cart = {};
  const getShipping = new Function("findProduct", "cart", helpers + "; return getShipping;")(
    (id) => productsById.get(String(id)),
    cart,
  );

  cart = { "1": 1 };
  assert.deepEqual(getShipping(["1"]), { fee: 250000, free: false, missing: false });
  cart = { "2": 1 };
  assert.deepEqual(getShipping(["2"]), { fee: 150000, free: false, missing: false });
  cart = { "3": 1 };
  assert.deepEqual(getShipping(["3"]), { fee: 200000, free: false, missing: false });
  cart = { "4": 1 };
  assert.deepEqual(getShipping(["4"]), { fee: null, free: false, missing: true });
  cart = { "4": 3 };
  assert.deepEqual(getShipping(["4"]), { fee: 0, free: true, missing: true });
});
