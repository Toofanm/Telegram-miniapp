---
name: miniapp-web-guidelines
description: Use when reviewing HTML, CSS, JavaScript interactions, accessibility, responsive behavior, forms, and UX quality in the vanilla JavaScript Telegram Mini App.
---

# Web Interface Guidelines — Telegram Mini App

## Architecture-aware review
- Current entry point is `index.html`; inspect the actual implementation before recommending framework-specific changes.
- The current project is a static HTML/CSS/vanilla JavaScript application. Do not introduce React, Next.js, TypeScript, a build system, or dependencies just to follow generic frontend guidance.
- Prefer small, reusable functions and semantic HTML patterns that fit the existing architecture.

## Layout and accessibility
- Preserve `lang="fa"`, `dir="rtl"`, and correct logical CSS properties. Test mixed Persian and Latin content.
- Check narrow Telegram viewport widths, safe-area insets, keyboard behavior, 200% zoom, and text overflow.
- Use semantic buttons/links, accessible names, visible focus, logical keyboard order, and sufficient contrast.
- Interactive targets should be comfortably touchable (aim for 44×44 CSS px where practical).
- Never make hover the only way to discover or operate a control.
- Communicate loading, empty, error, disabled, success, and pending states clearly; do not signal state by color alone.

## Interaction and performance
- Keep search, category filters, sort, product detail, cart count, quantity controls, totals, and checkout feedback synchronized with their actual state.
- Avoid unnecessary DOM replacement that loses focus or event handlers; use existing event delegation patterns where appropriate.
- Keep rendering and filtering responsive for the current catalog size. Avoid expensive repeated DOM queries and unbounded listeners.
- Respect the established no-motion requirement; do not add animation or smooth scrolling unless explicitly requested.
- Ensure images have useful alt text and sensible loading behavior; prioritize only genuinely critical above-the-fold imagery.
- Do not add analytics, trackers, external scripts, fonts, or libraries without evaluating privacy, performance, and user approval.

## Regression boundaries
- Treat cart, price calculations, shipping, order submission, payment handoff, and Telegram identity as high-risk flows.
- UI changes must not silently change business logic. Verify relevant behavior with focused checks.
- Report each finding with location, user impact, severity, and a practical fix.
