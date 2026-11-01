---
name: supplement-miniapp-project
description: Project-specific rules for the Toofanm Telegram supplement-shop Mini App. Use for catalog, UI, cart, checkout, orders, payment receipts, admin workflow, bot handoff, tests, and deployment.
---

# Supplement Mini App Project

## Project scope
- Repository: `Toofanm/Telegram-miniapp`.
- Current Mini App entry point: `index.html`; the runtime catalog is loaded from `./products.json`.
- Persian RTL Telegram Mini App integrated with the shop bot.
- Inspect the repository and current architecture before editing. Preserve working behavior; avoid destructive rewrites and unrelated refactors.
- Website and Mini App are related but their deployment and business rules are not interchangeable.

## Catalog integrity
- `products.json` is the catalog currently consumed by the Mini App (`index.html` loads it at runtime). Do not assume a `products.txt` file exists in this repository.
- `products.json` in this Mini App repository is the catalog source of truth.\n- Prices in `products.json` use full Iranian toman. Store the unmarked source amount in `basePrice` (toman); derive the displayed `price` from `basePrice` only: 15% markup for all non-steroid products and 20% for `category: steroid`, rounded to the nearest 5,000 toman. Never apply markup to the previously marked-up `price`; this prevents compounding. The app runtime calculates the final `price` from `basePrice` on load.\n Update the Mini App catalog only from the latest inventory committed to this repository; do not substitute the website inventory or another repository.\n- Product pack images must be exact matches for brand, product family, and package size. Prefer official manufacturer image assets; Amazon product images are the permitted fallback. Do not reuse another product's image, generic category artwork, or an unverified retailer image. Store the direct image URL in `image` and the product/source page in `imageSource`; leave the image blank when no reliable match exists.\n- Display only products that are explicitly available. Exclude records marked unavailable by `available: false`, `inStock: false`, `price: "out"`, `stock: 0`, or stock/status values such as `ناموجود`, `اتمام موجودی`, `out`, `out of stock`, or `unavailable`. Do not infer unavailability from a missing stock field; confirm it from repository inventory data. Remove unavailable products from the Mini App catalog view and prevent adding them to cart.\n- In the default all-products view and search results, products in category `discount` must appear before every other product, regardless of the selected sort order. Keep discounted/damaged products only in `discount`; never duplicate them in regular categories.\n- Identify the latest authoritative inventory before any catalog update. Compare it against `products.json`; preserve valid products, variants, and stable IDs.
- The inventory requirement is 23 creatine models. Validate product identity and variants against the latest source list; do not count pack-size duplicates or non-creatine formulas as separate models without checking.
- Correct product naming is `JNX`, not `GNx`.
- Discounted/damaged products belong only in the `discount` category. Never duplicate the same product under its regular category and Discounts. Keep one stable product ID and verify the Discounts category renders.
- Do not import the website-only rule for unavailable products without explicit instruction.
- Product descriptions and Supplement Facts must come from manufacturer/product-label sources. Attribute unverified performance claims to the manufacturer. Never invent ingredients, dosages, benefits, or facts.
- When correcting images or descriptions, do not silently alter price, stock, category, or product identity. Match each image to the exact brand, packaging, size, and variant.

## Pricing and shipping
- Mini App supplement price adjustment: +15% over source price, rounded to a price ending in 0 or 5 according to the existing project convention. Inspect implementation before changing rounding.
- Other product branch, if present: +20%.
- Mini App shipping: free shipping for orders with at least 3 purchased items; otherwise up to 1 kg = 150,000 toman, each additional kg = +50,000 toman.
- Do not copy the older website shipping table into the Mini App.
- Show shipping and final payable amount clearly before submission.

## UI requirements
- Persian UI is RTL, including mixed Latin product names, prices, forms, and statuses.
- Mobile-first Telegram WebApp. No separate drawer menu; preserve the agreed compact navigation.
- Main navigation uses Search instead of Products and includes a functional Cart tab.
- Cart badge reflects actual item count; cart tab navigation, product quantity controls, totals, and badges remain synchronized.
- Checkout/customer details stay inside the Mini App. After successful order submission, hand off to the Telegram bot for confirmation, payment instructions, and receipt submission.
- Preserve approved copy unless explicitly changed:
  - `ارسال همه روزه به سراسر کشور`
  - `جدیدترین محصولات روز دنیا`
  - `BETTER SUPPLEMENTS BIGGER RESULTS`
  - `مکمل مناسب فقط یک محصول نیست؛ بخشی از مسیر عملکرد، ریکاوری و رسیدن به هدف توست.`
- Do not reintroduce educational sections or unrelated content removed from Mini App scope.

## End-to-end order workflow (critical)
1. Customer adds products and quantities to cart.
2. Cart shows correct line totals, count, shipping, and payable total.
3. Customer submits required contact and delivery details inside Mini App.
4. Backend validates the request and durably creates one order with a unique order ID.
5. Customer receives explicit order-created / awaiting-payment confirmation with order ID and summary.
6. Admin receives order details and pending-payment state.
7. Customer is handed off to the bot for payment instructions and receipt image submission.
8. Receipt is linked to the correct order ID and delivered to admin.
9. Admin approval/rejection updates order state and notifies customer.

Safeguards:
- Never report success before backend persistence is confirmed.
- Prevent duplicate orders on retries using idempotency or equivalent server-side protection.
- Validate product IDs, quantities, prices, shipping, and totals server-side; never trust client totals.
- Do not expose bot tokens, API keys, admin IDs, or private customer data in client code/logs.
- Validate Telegram WebApp identity using the existing secure server-side approach; do not trust arbitrary browser-supplied user IDs.
- Use explicit states such as `pending_payment`, `receipt_submitted`, `approved`, `rejected`, adapting safely to the current schema.
- Log failures with order/correlation ID and redact secrets and unnecessary personal data.
- Test both customer and admin notifications. An HTTP success alone does not prove message delivery.

## Engineering workflow
1. Inspect repository tree, branch, recent commits, scripts, environment variables, and deployment entry points.
2. Locate source of truth for catalog, prices, shipping, cart, order API, bot handlers, and admin notifications.
3. State the plan and affected files before broad changes.
4. Make the smallest coherent change; separate UI changes from order/payment backend changes where possible.
5. Add/update tests for catalog parsing, price/shipping calculations, cart state, validation, idempotency, and notifications as applicable.
6. Run only scripts that exist: formatting, lint, type checks, tests, and build. Never claim a test passed unless executed and observed.
7. Review the final diff for unintended changes to catalog, prices, stock, IDs, and styling.
8. Report changed files, executed tests and results, blockers, and deployment status precisely.

## Deployment constraints
- Do not assume Render, Netlify, Railway, or Telegram Bot API serverless is currently active. Inspect configuration first.
- Do not deploy, migrate production data, change webhook ownership, or alter polling processes without checking production topology.
- Prior Telegram `getUpdates` conflicts occurred with multiple bot consumers. Ensure only one polling consumer or use the configured webhook architecture.
- Do not change live order registration/checkout as part of unrelated UI or catalog work.
- Never commit secrets.

## Acceptance checklist
- [ ] `products.json` matches the latest authoritative inventory and stable IDs are preserved.
- [ ] The 23 creatine models are verified against source, excluding unrelated formulas and duplicate pack variants.
- [ ] Discount products appear only in Discounts.
- [ ] Images and descriptions match exact variants and manufacturer sources.
- [ ] Price and shipping rules match Mini App policy.
- [ ] RTL/mobile layout works in Telegram viewport.
- [ ] Search, Cart tab, badge, quantity controls, and totals work.
- [ ] Checkout stays inside Mini App.
- [ ] Backend creates one durable order with stable ID.
- [ ] Customer receives order confirmation.
- [ ] Admin receives pending order.
- [ ] Receipt is linked to order and delivered to admin.
- [ ] Approval/rejection reaches customer.
- [ ] Build/tests pass or failures are documented.
