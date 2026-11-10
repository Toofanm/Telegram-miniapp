---
name: miniapp-composition-patterns
description: Use when organizing reusable UI sections, DOM rendering, state ownership, and interaction logic in the Mini App's vanilla JavaScript architecture.
---

# Composition Patterns — Vanilla JavaScript Mini App

## Fit the existing stack
- This repository currently uses a static `index.html` with CSS and vanilla JavaScript. Do not port React composition patterns literally or introduce a framework without explicit approval.
- Inspect existing DOM structure, render functions, state variables, and event delegation before refactoring.

## Reuse and ownership
- Keep one clear owner for each piece of state: catalog, search query, selected category, sort mode, cart quantities, and checkout state.
- Separate data transformation from DOM rendering and user-event handling where practical.
- Prefer small functions with explicit inputs/outputs over duplicated markup strings or large functions with unrelated responsibilities.
- Keep reusable product-card, category, cart-row, and feedback patterns consistent without building an unnecessary component framework.
- Derive visible counts, totals, and badges from authoritative in-memory state rather than maintaining competing copies.
- Use stable product IDs for DOM data attributes and cart keys; never rely on array positions.

## Safe rendering
- Escape untrusted product text before inserting it into HTML strings, or use safe DOM text APIs.
- Do not interpolate untrusted data into event-handler attributes, script contexts, URLs, or CSS.
- Validate image URLs and preserve the exact product/source mapping.
- Keep event listeners bounded and avoid registering duplicate handlers during repeated renders.

## Refactoring boundaries
- Avoid broad rewrites for a small component change.
- Preserve RTL, current visual tokens, accessibility semantics, and no-motion behavior.
- Never change catalog, price, stock, shipping, checkout, payment, order, or Telegram handoff logic during structural cleanup unless explicitly requested.
- Add focused regression checks for state synchronization and edge cases before claiming equivalence.
