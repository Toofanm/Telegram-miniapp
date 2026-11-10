---
name: miniapp-seo-ecommerce
description: Use when improving public search visibility of the Mini App's catalog or public product presentation without exposing private Telegram or checkout content.
---

# E-commerce SEO — Telegram Mini App

## Public/private distinction
- Determine which pages are genuinely public and independently accessible to search crawlers. A Telegram-only screen or user/session-dependent view is not automatically indexable.
- Keep cart, checkout, account, order status, receipt, payment, customer details, and private APIs out of search indexes.
- Do not expose private app state or backend data to crawlers or AI agents to gain visibility.

## Catalog content
- Treat this repository's `products.json` as the Mini App catalog source of truth. Do not copy the website or bot catalog into this project.
- Product names, brands, variants, package sizes, prices, and availability must match current catalog data and visible content.
- Avoid generating thin, near-duplicate pages for every flavor/size unless the app has stable, crawlable canonical URLs and genuinely distinct useful content.
- Do not invent ingredients, Supplement Facts, certifications, reviews, health outcomes, ratings, or manufacturer claims.
- Use descriptive Persian copy with correct RTL and mixed Latin product names. Avoid keyword stuffing and boilerplate descriptions.
- Product image alt text should identify the actual visible product and variant, not add unsupported claims.

## Metadata and internal discovery
- Use a unique title and description for the public landing/catalog page, aligned with visible page content.
- Ensure primary public content and navigation links are understandable without requiring Telegram authentication or client-only interaction where indexing is intended.
- Do not treat arbitrary word-count, image-count, or character-count thresholds as universal ranking requirements.
- Keep canonical and Open Graph metadata accurate for the real public URL and brand identity.

## Validation
Report the exact public URL/template, indexability evidence, metadata, canonical behavior, and catalog-source consistency. Separate technical eligibility from ranking or traffic claims. Never promise rankings, AI citations, or rich-result display.
