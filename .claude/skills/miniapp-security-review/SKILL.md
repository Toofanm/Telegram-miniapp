---
name: miniapp-security-review
description: Use when changing client-side data handling, Telegram WebApp integration, cart/checkout requests, external URLs, customer information, or Mini App security boundaries.
---

# Security Review — Telegram Mini App

## Trust boundaries
Treat browser input, Telegram WebApp initialization data, product JSON, image URLs, API responses, and all client-side state as untrusted. The Mini App frontend is not an authority for identity, price, inventory, shipping, payment, or order state.

## Review checklist
- **Telegram identity:** validate Telegram WebApp `initData` server-side using the established backend verification. Never trust `initDataUnsafe`, client-supplied user IDs, query parameters, or hidden UI controls as authentication.
- **Secrets:** never place bot tokens, API keys, admin IDs, signing secrets, or privileged endpoints' credentials in `index.html`, `products.json`, public assets, or browser logs.
- **Commerce integrity:** backend must validate product IDs, quantities, current prices, availability, shipping, totals, and order ownership. Client calculations are display-only.
- **Order safety:** retries and duplicate submissions must not create duplicate orders; preserve backend idempotency and order-ID linkage.
- **Payment and receipts:** never mark an order paid based on client state, screenshot content, or AI output. Keep receipt association and admin approval on the trusted backend.
- **XSS:** escape catalog/user-provided strings before HTML insertion. Avoid unsafe `innerHTML`, inline event handlers, and dynamic script construction. Validate URLs and protocols before using them.
- **External resources:** review third-party scripts, fonts, images, and APIs for necessity, privacy, and integrity. Do not add trackers or broad permissions without approval.
- **Privacy:** minimize customer data in browser storage, URLs, logs, and error messages. Never expose other users' orders or private backend responses.
- **Transport and headers:** verify HTTPS for public endpoints and assess CSP/security headers at the actual hosting layer. Do not claim headers are configured from frontend source alone.

## Severity and output
Classify findings Critical / High / Medium / Low with concrete evidence, realistic impact, and mitigation. Block release for unresolved Critical or High issues. State unreviewed trust boundaries and whether the work was source review, not a penetration test.

Preserve current catalog, price, inventory, shipping, payment, order, and Telegram handoff behavior unless explicitly authorized to change them.
