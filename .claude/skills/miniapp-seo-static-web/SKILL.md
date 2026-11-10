---
name: miniapp-seo-static-web
description: Use when auditing crawlability, metadata, canonical URLs, sitemap, robots, rendering, and performance for the static GitHub Pages Mini App.
---

# Technical SEO — Static GitHub Pages Mini App

## Inspect actual hosting and URL structure
- Confirm the repository's current GitHub Pages configuration, published branch/folder, canonical public URL, and any custom domain before changing absolute URLs.
- This is a static HTML/CSS/vanilla JavaScript project; do not apply Next.js App Router or server-rendering instructions.
- Inspect `index.html`, `products.json`, asset paths, and current metadata before proposing changes.

## Crawlability and indexation
- Check the real public landing page response, title, description, robots directives, canonical URL, Open Graph tags, and mobile viewport.
- Ensure relative assets and catalog fetch paths work under the actual GitHub Pages project subpath; do not assume deployment at the domain root.
- Add or update sitemap/robots files only when there are stable, public, canonical URLs to list. A single-page app does not need fabricated per-product URLs.
- Do not index search queries, filter/sort variants, cart, checkout, account, order, payment, or user-specific states.
- Do not use robots.txt as access control. Private information must be protected by the backend, not by crawler directives.
- Check that public page content is useful and accessible when JavaScript has not yet completed; do not claim dynamic product cards are indexed without rendering evidence.

## Structured data
- Add Product/Offer/Breadcrumb/Organization JSON-LD only when the relevant content is visible, public, accurate, and backed by the current Mini App data source.
- Do not expose unpublished stock, internal identifiers, customer data, or payment details.
- Avoid duplicate or conflicting structured data. Validate JSON-LD syntax and use official validators where available.

## Performance and verification
- Review image sizes, lazy loading, font requests, layout shifts, render-blocking scripts, and unnecessary third-party resources.
- Treat Core Web Vitals as measured outcomes; use PageSpeed/CrUX only when available and approved.
- Do not add paid crawlers, analytics, new dependencies, or CI jobs without approval.
- Report verified URL, status/indexability evidence, metadata, sitemap/robots coverage, rendering limitations, and any untested behavior.
