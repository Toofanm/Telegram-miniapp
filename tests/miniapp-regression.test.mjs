import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const products = JSON.parse(readFileSync(new URL("../products.json", import.meta.url), "utf8"));
const scriptStart = html.lastIndexOf("<script>");
const scriptEnd = html.indexOf("</script>", scriptStart);
const appScript = html.slice(scriptStart + "<script>".length, scriptEnd);

test("Mini App inline JavaScript parses", () => {
  assert.ok(scriptStart >= 0 && scriptEnd > scriptStart, "inline app script must exist");
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

test("supplement catalog has source prices and verifiable image provenance", () => {
  for (const product of products) {
    if (product.category === "steroid" || product.category === "sarm") continue;
    const base = Number(product.basePrice);
    assert.ok(Number.isFinite(base) && base > 0, "invalid basePrice for product " + product.id);
    const finalPrice = Math.round((base * 1.15) / 5000) * 5000;
    assert.equal(finalPrice % 5000, 0);
    assert.equal(Number(product.price), finalPrice, "incorrect supplement price for product " + product.id);
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
  const end = appScript.indexOf("function openCart", start);
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
  assert.ok(!html.includes(".add-btn,.inline-qty button{min-width:40px;min-height:40px;height:40px}"));
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

test("category and image fallback icons use consistent inline SVG rather than emoji glyphs", () => {
  assert.ok(appScript.includes("function categoryIconSvg(category)"));
  assert.ok(appScript.includes("categoryIconSvg(c)"));
  assert.ok(appScript.includes("categoryIconSvg(p.category)"));
  assert.ok(appScript.includes('focusable="false"'));
  assert.ok(html.includes(".category-card-icon svg,.product-fallback svg{"));
});


test("requested product packshots are mapped to exact manufacturer or Amazon product sources", () => {
  const expected = {
    4: "hyperbolic-mass-assorted-flavours-4kg",
    14: "B0DJBB1XD2",
    18: "nitro-tech-100-whey-gold",
    28: "100WHEY_Van_2kg",
    54: "gold-amino-chewables-330",
    75: "B0BJ2S32YL",
    85: "lipo-6-black-ultra-concentrate",
    86: "lipo-6-hardcore",
    97: "qhush-platinum-black-pre-workout",
  };
  for (const [id, marker] of Object.entries(expected)) {
    const product = products.find((item) => String(item.id) === id);
    assert.ok(product, "missing catalog product " + id);
    assert.ok(product.image.includes(marker) || product.imageSource.includes(marker), "wrong packshot/source for product " + id);
    assert.ok(product.imageSource, "image source missing for product " + id);
  }
});

test("every supplement has an exact product packshot and source page", () => {
  const expected = {
    77: ["jnxsports.com/cdn/shop/files/0486_JNX_Sports", "jnxsports.com/products/the-curse-creatine-monohydrate"],
    131: ["xpnworld.com/cdn/shop/files/ProJointSupport-180caps", "xpnworld.com/products/pro-joint-support"],
    201: ["nutriversum.org/sites/new_nutriversum_org/documents/product/gainer_pro_5000g", "nutriversum.org/gainers/PURE_-_Gainer_Pro_5000g"],
    202: ["m.media-amazon.com/images/I/8118rYJFiQL", "amazon.es/-/en/Zoomad-Labs-Monohydrate-Strawberry"],
    203: ["b2b.activlab.pl/wp-content/uploads/2022/04/creavita-grape", "b2b.activlab.pl/produkt/creavita"],
    204: ["grenade.com/cdn/shop/files/Grenade-TD-1", "grenade.com/products/thermo-detonator"],
    205: ["mutantnation.com/cdn/shop/files/33501USMUTANTMADNESS", "mutantnation.com/products/madness-ultra-concentrated-pre-workout"],
    206: ["walmartimages.com/seo/Ronnie-Coleman-L-Arginine-XS-Capsules", "walmart.com/ip/Ronnie-Coleman-L-Arginine-XS-Capsules"],
    207: ["quamtrax.com/cdn/shop/files/l-carnitina-lonza-veggie-120-caps", "quamtrax.com/products/l-carnitina-lonza"],
    208: ["static.thcdn.com/productimg/original/10530146", "myprotein.com/p/sports-nutrition/l-carnitine-tablets/10530146"],
    209: ["nutrex.com/cdn/shop/files/CLA-90_800x800", "nutrex.com/products/cla-1000"],
    210: ["allmaxnutrition.com/cdn/shop/files/ACuts_allmax_nutrition_canada", "allmaxnutrition.com/products/acuts-amino-acid"],
    211: ["fasklep.pl/2687-large_default/gear-crea-shock-300-g", "fasklep.pl/en/gear/1221-gear-crea-shock-300-g"],
  };
  for (const product of products) {
    if (product.category === "steroid" || product.category === "sarm") continue;
    assert.ok(product.image && product.imageSource, "missing supplement packshot/source for product " + product.id);
  }
  for (const [id, [imageMarker, sourceMarker]] of Object.entries(expected)) {
    const product = products.find((item) => String(item.id) === id);
    assert.ok(product, "missing catalog product " + id);
    assert.ok(product.image.includes(imageMarker), "wrong product image for " + id);
    assert.ok(product.imageSource.includes(sourceMarker), "wrong source page for " + id);
  }
});

test("product detail sheet uses static lightweight presentation and preserves larger packshots", () => {
  assert.ok(html.includes(".overlay.open{animation:none!important}"));
  assert.ok(html.includes("backdrop-filter:none!important"));
  assert.ok(html.includes("grid-template-columns:184px minmax(0,1fr)"));
  assert.ok(html.includes(".sheet{"));
  assert.ok(html.includes("prefers-reduced-motion:reduce"));
});

test("thermal order receipt renders without animated printer effects", () => {
  assert.ok(html.includes(".receipt-machine{animation:none!important"));
  assert.ok(html.includes(".receipt-slot:after{display:none!important"));
  assert.ok(html.includes(".receipt-paper{"));
  assert.ok(appScript.includes("function renderOrderReceipt(data,fallbackItems,customer,retryPayload)"));
});


test("user-approved product pages provide the exact current catalog packshots", () => {
  const expected = {
    4: ["207507.webp", "hyperbolic-mass-assorted-flavours-4kg"],
    18: ["muscletech-int-nitro-tech-100-whey-gold.png", "nitro-tech-100-whey-gold"],
    43: ["muscleTech-int-platinum-100-glutamine.png", "platinum-100-glutamine"],
    85: ["Lipo6-BlackUC-60-INP.webp", "lipo-6-black-ultra-concentrate"],
    86: ["Lipo6-HC_800x800.png", "lipo-6-hardcore"],
  };
  for (const [id, [image, source]] of Object.entries(expected)) {
    const product = products.find((item) => String(item.id) === id);
    assert.ok(product, "missing product " + id);
    assert.ok(product.image.includes(image), "wrong official packshot for product " + id);
    assert.ok(product.imageSource.includes(source), "wrong reference product page for product " + id);
  }
});

test("product modal opens without entrance animation and keeps responsive image sizing", () => {
  assert.ok(html.includes(".overlay.open{animation:none!important}"));
  assert.ok(html.includes("grid-template-columns:250px minmax(0,1fr)!important"));
  assert.ok(html.includes("grid-template-columns:176px minmax(0,1fr)!important"));
  assert.ok(html.includes(".sheet{"));
});

test("order receipt is static and does not run printer or paper animations", () => {
  assert.ok(html.includes(".receipt-machine{animation:none!important"));
  assert.ok(html.includes(".receipt-paper{"));
  assert.ok(html.includes(".receipt-check{animation:none!important"));
});


test("all 69 steroid and SARM products are visible as separate catalog categories", () => {
  const steroids = products.filter((product) => product.category === "steroid");
  const sarms = products.filter((product) => product.category === "sarm");
  assert.equal(steroids.length, 65);
  assert.equal(sarms.length, 4);
  assert.ok(html.includes('sarm:"سارم‌ها"'));
  assert.ok(html.includes('"steroid","sarm","testbooster"'));
});

test("steroid and SARM prices are stored and displayed in full toman", () => {
  for (const product of products.filter((item) => item.category === "steroid" || item.category === "sarm")) {
    assert.ok(Number(product.basePrice) >= 1000000, "base price is not full toman for product " + product.id);
    assert.ok(Number(product.price) >= 1000000, "display price is not full toman for product " + product.id);
    assert.equal(Number(product.price), Math.round((Number(product.basePrice) * 1.20) / 5000) * 5000);
  }
});

test("live product suggestions are rendered while typing without a search button", () => {
  assert.ok(html.includes('id="search-suggestions"'));
  assert.ok(appScript.includes("function renderSearchSuggestions()"));
  assert.ok(appScript.includes('addEventListener("input"'));
  assert.ok(appScript.includes('data-search-suggestion'));
  assert.ok(appScript.includes("slice(0,6)"));
});


test("catalog loads from products.json only; numeric stock files and quantity caps are not required", () => {
  assert.ok(appScript.includes('fetch("./products.json"'));
  assert.ok(!appScript.includes("inventory.json"));
  assert.ok(!appScript.includes("p.stock"));
  assert.ok(!appScript.includes("stockByProductId"));
  assert.ok(!appScript.includes("defaultStock"));
  assert.ok(!appScript.includes("Number(p.stock"));
  assert.ok(appScript.includes('category==="sarm")?0.20:0.15'));
  assert.ok(appScript.includes('"قابل سفارش"'));
});


test("viewport allows browser zoom for users with low vision", () => {
  assert.ok(html.includes('content="width=device-width,initial-scale=1,viewport-fit=cover"'));
  assert.ok(!html.includes("maximum-scale=1"));
  assert.ok(!html.includes("user-scalable=no"));
});



test("order receipt retries the same idempotent payload and clears the key only after both notifications succeed", async () => {
  const start = appScript.indexOf("function renderOrderReceipt(");
  const end = appScript.indexOf("function normalizeWeightDigits", start);
  assert.ok(start >= 0 && end > start, "receipt renderer must exist");
  const rendererSource = appScript.slice(start, end);
  const nodes = {};
  let receiptMarkup = "";
  let clearCount = 0;
  let request = null;
  const makeNode = () => ({ disabled: false, textContent: "", listener: null, addEventListener(type, listener) { if (type === "click") this.listener = listener; } });
  const document = { getElementById(id) { return nodes[id] || null; } };
  const openSheet = (_title, markup) => {
    receiptMarkup = markup;
    nodes["finish-order"] = makeNode();
    nodes["retry-order-notifications"] = markup.includes('id="retry-order-notifications"') ? makeNode() : null;
  };
  const fetch = async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({
      ok: true, order_id: "TEST-ORDER-1", customer_notified: true, admin_notified: true,
      items: [], subtotal: 1000, shipping_cost: 0, total: 1000,
    }) };
  };
  const render = new Function(
    "openSheet", "safe", "money", "fmt", "document", "fetch", "notify", "closeSheet",
    "clearCheckoutIdempotencyKey", rendererSource + "; return renderOrderReceipt;"
  )(openSheet, String, String, String, document, fetch, () => {}, () => {}, () => { clearCount += 1; });

  const payload = { initData: "signed-init-data", idempotency_key: "same-order-key", items: [], customer: { name: "Test" } };
  render({ order_id: "TEST-ORDER-1", customer_notified: true, admin_notified: false }, [], {}, payload);
  assert.match(receiptMarkup, /id="retry-order-notifications"/);
  const retryButton = nodes["retry-order-notifications"];
  assert.equal(typeof retryButton.listener, "function");
  retryButton.listener();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(request.url, "https://telegram-shop-8hll.onrender.com/miniapp-order");
  assert.deepEqual(JSON.parse(request.options.body), payload);
  assert.equal(clearCount, 1);
  assert.doesNotMatch(receiptMarkup, /id="retry-order-notifications"/);
});

test("failed order-notification retry keeps the idempotency key and restores the retry control", async () => {
  const start = appScript.indexOf("function renderOrderReceipt(");
  const end = appScript.indexOf("function normalizeWeightDigits", start);
  const rendererSource = appScript.slice(start, end);
  const nodes = {};
  let clearCount = 0;
  let notices = [];
  const makeNode = () => ({ disabled: false, textContent: "", listener: null, addEventListener(type, listener) { if (type === "click") this.listener = listener; } });
  const document = { getElementById(id) { return nodes[id] || null; } };
  const openSheet = (_title, markup) => {
    nodes["finish-order"] = makeNode();
    nodes["retry-order-notifications"] = markup.includes('id="retry-order-notifications"') ? makeNode() : null;
  };
  const fetch = async () => ({ ok: false, json: async () => ({ ok: false, message: "temporary failure" }) });
  const render = new Function(
    "openSheet", "safe", "money", "fmt", "document", "fetch", "notify", "closeSheet",
    "clearCheckoutIdempotencyKey", rendererSource + "; return renderOrderReceipt;"
  )(openSheet, String, String, String, document, fetch, (message) => notices.push(message), () => {}, () => { clearCount += 1; });
  const payload = { initData: "signed-init-data", idempotency_key: "same-order-key", items: [], customer: {} };
  render({ order_id: "TEST-ORDER-2", customer_notified: false, admin_notified: true }, [], {}, payload);
  const retryButton = nodes["retry-order-notifications"];
  retryButton.listener();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(clearCount, 0);
  assert.equal(retryButton.disabled, false);
  assert.equal(retryButton.textContent, "تلاش مجدد برای ارسال اعلان‌ها");
  assert.deepEqual(notices, ["temporary failure"]);
});
