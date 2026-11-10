---
name: miniapp-verification-loop
description: Use before reporting Mini App changes complete; verify the exact Git commit with risk-based static checks and relevant UI/catalog/order regressions.
---

# Verification Loop — Telegram Mini App

## Procedure
1. Translate the request into observable acceptance criteria and explicit non-goals.
2. Inspect repository, branch, exact head SHA, open PRs, current diff, source-of-truth files, and available workflows.
3. Read the affected implementation and project skill before editing.
4. Run the narrowest relevant checks first; use existing repository scripts/workflows only.
5. Review the final diff for unintended changes to product IDs, catalog, prices, stock, shipping, checkout, payment, orders, secrets, and deployment configuration.
6. Verify CI/status against the exact new head SHA. An older green run or a workflow file is not evidence for the current commit.
7. Report pass, fail, skipped, or unavailable for each acceptance criterion.

## Risk-based checks
- Catalog: parse `products.json`, verify stable unique IDs, availability filtering, discount category exclusivity, and data-driven counts.
- Pricing: test source `basePrice`, category markup, rounding, and absence of compounded markup.
- UI: inspect RTL, mobile viewport, safe-area behavior, search, filters, sorting, product detail, cart badge, quantity controls, and empty/error states.
- Checkout: verify client-side totals are presentation only; backend remains authoritative. Test order idempotency and customer/admin handoff only when the relevant backend integration is in scope and a safe test environment exists.
- Security: inspect Telegram identity validation boundaries, HTML escaping, URL handling, and absence of secrets in client assets.
- Static app: use existing HTML/JS checks and browser/E2E workflows if available. Do not add a new CI job, dependency, headless browser, or paid service solely to satisfy this guide.

## Evidence rules
- State exact commit SHA and actual commands/workflow results.
- Distinguish source review, static validation, browser testing, Telegram live testing, and production deployment.
- Never claim a customer order, admin notification, bot handoff, or live Telegram interaction succeeded unless observed in an authorized test.
- Do not deploy or alter GitHub Pages settings as a side effect of documentation or code review.
