---
name: miniapp-visual-design
description: Use when reviewing or changing the Telegram Mini App's visual system, product presentation, banners, navigation, or responsive layout.
---

# Visual Design System — Supplement Energy Mini App

## Source of truth
1. Follow the user's latest explicit direction for the task.
2. Preserve the current approved Mini App design and the tokens/components in `index.html`.
3. Follow the project-specific rules in `.claude/skills/supplement-miniapp-project/SKILL.md`.
4. Treat external design references as inspiration only.

Do not copy the website layout wholesale. The Mini App is a compact, mobile-first Telegram shopping interface with its own navigation, interaction, and checkout constraints.

## Design workflow
- Inspect the current `index.html`, existing CSS variables, component patterns, product image treatment, and Telegram viewport behavior before proposing changes.
- Classify the task as preserve, refine, or redesign. Avoid a broad redesign for a localized request.
- Define hierarchy, spacing, typography, color roles, responsive behavior, and component states before implementation.
- Reuse existing CSS variables and patterns. Avoid duplicate tokens, arbitrary inline styles, and unnecessary dependencies.
- Validate Persian RTL and mixed Persian/Latin product names, numerals, prices, and labels.
- Review real product pack images for exact brand, variant, size, and crop. Never substitute generated lookalikes or generic product imagery.
- Use screenshots or browser evidence when available. Do not claim visual validation from source inspection alone.

## Mini App constraints
- Mobile-first; prioritize Telegram WebApp viewport and safe-area insets.
- Keep the compact approved navigation; do not add a drawer or unrelated educational sections.
- Preserve the agreed banner/copy and existing no-motion direction unless the user explicitly changes it.
- Avoid large desktop-only hero layouts, excessive card nesting, hover-dependent controls, and content that competes with product discovery.
- Touch targets, focus states, readable contrast, and clear cart/checkout feedback are mandatory.
- Preserve the established dark visual identity and current semantic tokens. Do not switch to a light theme or import another brand's palette without explicit approval.

## Product and commerce integrity
- Product name, brand, size, flavor, price, and availability must remain source-backed and readable.
- Do not alter catalog, price, inventory, shipping, cart, checkout, order, payment, or bot handoff behavior as a side effect of visual work.
- Use badges only for genuine data-backed states.

## Deliverable
List affected components/tokens, mobile and RTL checks, accessibility checks, image issues, and any unverified behavior. Keep design rationale concise and distinguish recommendations from implemented changes.
