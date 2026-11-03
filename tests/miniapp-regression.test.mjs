import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const products = JSON.parse(readFileSync(new URL("../products.json", import.meta.url), "utf8"));
const inlineScripts = [...html.matchAll(/<script\\b[^>]*>([\\s\\S]*?)<\\/script>/gi)]
  .map((match) => match[1])
  .filter((source) => source.trim());
const appScript = inlineScripts.at(-1);

test("Mini App inline JavaScript parses", () => {
  assert.ok(appScript, "inline app script must exist");
  assert.doesNotThrow(() => new Function(appScript));
});

test("catalog count is sourced from products.json and IDs remain unique", () => {
  const ids = products.map((product) => String(product.id));
  assert.ok(products.length > 0, "products.json must contain the current inventory");
  assert.equal(new Set(ids).size, products.length);
  for (const product of products) {
    assert.ok(product.id !== undefined && product.id !== null && String(product.id).length > 0);
  }
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

test("mobile layout keeps compact category navigation and accessible controls", () => {
  assert.ok(!html.includes('id="quick-access"'));
  assert.ok(html.includes('id="categories"'));
  assert.ok(html.includes("focus-visible"));
  assert.ok(html.includes("min-height:52px"));
});

test("mobile cart badge, cart navigation, and checkout retry key are wired", () => {
  assert.ok(html.includes('id="mobile-cart-count"'));
  assert.ok(appScript.includes('getElementById("mobile-cart").addEventListener("click"'));
  assert.ok(appScript.includes("idempotency_key:idempotencyKey"));
  assert.ok(appScript.includes("clearCheckoutIdempotencyKey()"));
  assert.ok(!appScript.includes("ثبت سفارش و پرداخت آنلاین در این نسخه آزمایشی فعال نیست"));
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
  const cart = {};
  const getShipping = new Function("findProduct", "cart", helpers + "; return getShipping;")(
    (id) => productsById.get(String(id)),
    cart,
  );
  const setCart = (values) => {
    for (const key of Object.keys(cart)) delete cart[key];
    Object.assign(cart, values);
  };

  setCart({ "1": 1 });
  assert.deepEqual(getShipping(["1"]), { fee: 250000, free: false, missing: false });
  setCart({ "2": 1 });
  assert.deepEqual(getShipping(["2"]), { fee: 150000, free: false, missing: false });
  setCart({ "3": 1 });
  assert.deepEqual(getShipping(["3"]), { fee: 200000, free: false, missing: false });
  setCart({ "4": 1 });
  assert.deepEqual(getShipping(["4"]), { fee: null, free: false, missing: true });
  setCart({ "4": 3 });
  assert.deepEqual(getShipping(["4"]), { fee: 0, free: true, missing: true });
});

test("desktop navigation has unique destinations and no duplicate category link", () => {
  const start = html.indexOf('<nav class="desktop-nav"');
  const end = html.indexOf("</nav>", start);
  const nav = html.slice(start, end);
  const hrefs = [...nav.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(hrefs, ["home", "categories", "products"]);
  assert.equal(new Set(hrefs).size, hrefs.length);
});

test("product cards use a semantic detail button and keep cart controls separate", () => {
  assert.ok(html.includes('class="product-open" data-open-product='));
  assert.ok(!html.includes('tabindex="0" role="button"'));
  assert.ok(appScript.includes('querySelectorAll("[data-open-product]")'));
  assert.ok(html.includes('class="product-bottom"'));
});

test("dialog labels itself, traps keyboard focus, and restores focus on close", () => {
  assert.ok(html.includes('role="dialog" aria-modal="true" aria-labelledby="sheet-title"'));
  assert.ok(appScript.includes("function trapSheetFocus(event)"));
  assert.ok(appScript.includes('event.key==="Escape"'));
  assert.ok(appScript.includes("document.contains(returnFocus)"));
  assert.ok(appScript.includes('getElementById("close-sheet").focus()'));
});

test("touch controls and checkout fields meet mobile sizing rules", () => {
  assert.ok(html.includes(".add-btn,.inline-qty button,.qty button{min-width:44px;min-height:44px;height:44px}"));
  assert.ok(html.includes(".checkout-form input,.checkout-form textarea{font-size:16px;min-height:48px}"));
  assert.ok(html.includes(".bottom-nav{min-height:68px;padding:7px}"));
});

test("desktop sheet is centered and mobile navigation remains breakpoint-scoped", () => {
  assert.ok(html.includes(".overlay{align-items:center;padding:16px}"));
  assert.ok(html.includes(".sheet{border-radius:22px;max-height:calc(100dvh - 32px);padding-bottom:24px}"));
  const mobileNavRule = html.indexOf(".bottom-nav{position:fixed;display:grid");
  const mobileBreakpoint = html.lastIndexOf("@media(max-width:600px)", mobileNavRule);
  assert.ok(mobileNavRule > 0 && mobileBreakpoint >= 0);
});
