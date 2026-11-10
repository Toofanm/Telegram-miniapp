# AI Skills — Telegram Mini App

This repository is the frontend project for the Supplement Energy Telegram Mini App. It is separate from the Python bot repository `Toofanm/telegram-shop` and from the website repository `Toofanm/supplement-store-web`.

## Project-specific source of truth
- Main entry point: `index.html`.
- Runtime catalog: `products.json`.
- Project rules: `.claude/skills/supplement-miniapp-project/SKILL.md`.
- The Mini App uses static HTML, CSS, and vanilla JavaScript. Do not assume React, Next.js, or a build pipeline exists.
- The website, Mini App, and bot have separate repositories and their catalog, deployment, and business rules must not be conflated.

## Mini App skills
| Skill | Path | Purpose |
|---|---|---|
| Project Guide | `.claude/skills/supplement-miniapp-project/SKILL.md` | Catalog, pricing, shipping, UI, checkout, order and deployment rules |
| Visual Design | `.claude/skills/miniapp-visual-design/SKILL.md` | Mobile-first visual system, RTL, product presentation, approved design constraints |
| Web Guidelines | `.claude/skills/miniapp-web-guidelines/SKILL.md` | Vanilla JS UI, accessibility, responsive behavior, interaction quality |
| Composition Patterns | `.claude/skills/miniapp-composition-patterns/SKILL.md` | Reusable DOM patterns and state ownership without introducing React |
| Verification Loop | `.claude/skills/miniapp-verification-loop/SKILL.md` | Exact-SHA, risk-based static/UI/catalog/order verification |
| Security Review | `.claude/skills/miniapp-security-review/SKILL.md` | Telegram identity, XSS, commerce trust boundaries, privacy |
| E-commerce SEO | `.claude/skills/miniapp-seo-ecommerce/SKILL.md` | Public catalog and product content without exposing private app screens |
| Static Technical SEO | `.claude/skills/miniapp-seo-static-web/SKILL.md` | GitHub Pages crawlability, metadata, canonical, robots, sitemap and rendering |

## Existing skills retained
- `.claude/skills/uiux-pro-max/`
- `.claude/skills/humanizer/`
- `.claude/skills/firecrawl/`

## Usage workflow
1. Inspect the current repository branch, head SHA, open PRs, and relevant source files.
2. Read this index and the project guide, then load only specialist skills relevant to the requested task.
3. Audit before editing. Keep findings separate from implementation recommendations.
4. Preserve catalog, prices, stock, shipping, cart, checkout, payment, order, and bot-handoff rules unless explicitly authorized.
5. Use only tools and checks actually available. Do not claim a browser test, Telegram live test, CI run, or deployment without evidence.
6. Report changed files, exact commit, test evidence, and unresolved risks.

## Boundaries
- Do not place bot/backend security skills in this repository or frontend/design skills in the Python bot repository.
- Do not introduce React/Next.js, paid SEO APIs, analytics, crawlers, new CI jobs, or dependencies without explicit approval.
- Skills are repository documentation. They are not automatically installed in ChatGPT and do not create an always-on agent runtime.
