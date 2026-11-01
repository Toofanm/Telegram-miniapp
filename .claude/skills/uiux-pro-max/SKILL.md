---
name: editorfarzad-uiux-pro-max
description: EditorFarzad's UI/UX design intelligence. Plan and build professional interfaces by first generating a design system (layout pattern, visual style, color palette, typography, effects, anti-patterns) matched to the product type, then implementing it and checking it against an accessibility and quality checklist. Use this whenever the user asks to build, design, redesign, retheme, review, or improve a landing page, website, dashboard, web app, or mobile app UI, in any stack (HTML and Tailwind, React, Next.js, Vue, Svelte, Flutter, SwiftUI, React Native), even if they don't mention design.
metadata:
  personalized-for: EditorFarzad
  inspired-by: UI UX Pro Max by nextlevelbuilder (github.com/nextlevelbuilder/ui-ux-pro-max-skill, MIT)
---

# UI/UX Pro Max Lite (EditorFarzad Edition)

> Personalized for **EditorFarzad**. A lightweight, self-contained version of the UI UX Pro Max workflow. The full original ships a searchable database (styles, palettes, font pairings, 192 industry rules) and a Python search script. If that is installed (`.claude/skills/ui-ux-pro-max/scripts/search.py`), prefer it: `python3 <path>/search.py "product description" --design-system -p "Project"`.

## Step 1: Understand the product

Pin down before designing: product type and industry, audience, main goal of the page (sign-up, purchase, booking, information), platform and stack (default: HTML + Tailwind), language and direction (Persian means RTL), and light or dark preference. Infer what you can; ask only for what blocks you.

## Step 2: Generate a design system

Write it out before any code, in this shape:

```
TARGET: <Project> - DESIGN SYSTEM
PATTERN: <page structure + section order + where the CTA sits>
STYLE: <one named style + keywords + why it fits>
COLORS: Primary / Secondary / CTA / Background / Surface / Text / Border (hex)
TYPOGRAPHY: <heading font> / <body font> + scale (e.g. 48/36/24/18/16/14)
SPACING & RADIUS: 4 or 8 px grid, radius scale
KEY EFFECTS: <shadows, motion, hover states>
AVOID: <anti-patterns for this industry>
```

Match the industry:

| Product | Pattern | Style | Mood |
|---|---|---|---|
| SaaS / dev tool | Hero + product shot + features + pricing + FAQ | Minimal, Bento grid | Trust, clarity, one accent color |
| Fintech / banking | Hero + trust signals + features + security | Clean corporate, restrained | Navy, green, no playful gradients |
| Health / clinic | Hero + services + doctors + booking | Soft, accessible | Calm blues and greens, high contrast |
| Beauty / spa / wellness | Hero-centric + social proof + booking | Soft UI | Warm neutrals, gold accent, serif headings |
| E-commerce | Hero + categories + products + reviews | Clean, image-led | Brand color for CTA only |
| Portfolio / agency / video editor | Showreel hero + selected work + about + contact | Bold editorial or dark cinematic | Large type, generous whitespace |
| Restaurant / food | Hero image + menu + location + reservation | Warm, photographic | Appetizing warm tones |
| Gaming / Web3 | Immersive hero + features + community | Dark, neon accents | Use glow sparingly |
| Dashboard / analytics | Sidebar + KPI cards + charts + tables | Data-dense minimal | Neutral base, semantic colors for status |

Font pairing defaults: Inter / Inter (product UI), Playfair Display / Inter (premium), Space Grotesk / Inter (tech), Cormorant Garamond / Montserrat (luxury), Vazirmatn (Persian, any style).

## Step 3: Implement

- Turn the design system into tokens first (CSS variables or Tailwind theme): colors, fonts, spacing, radius, shadows. Never hard-code hex values in components.
- Mobile-first, then 768, 1024, 1440 px breakpoints.
- Real SVG icons (Lucide, Heroicons, Phosphor), never emojis as icons.
- One primary CTA per screen; secondary actions look secondary.
- For a retheme of an existing app: audit hard-coded styles, map them to existing semantic tokens, migrate one component batch at a time, keep structure and logic unchanged.

## Step 4: Pre-delivery checklist

- [ ] Body text contrast at least 4.5:1, large text and UI parts at least 3:1, in every theme
- [ ] Visible keyboard focus on every interactive element; logical tab order
- [ ] `cursor: pointer` and hover, active, disabled states on clickable elements
- [ ] Touch targets at least 44×44 px
- [ ] `prefers-reduced-motion` respected; motion 150 to 300 ms, never blocking
- [ ] Text reflows at 375 px and 200% zoom without clipping; chips and badges wrap
- [ ] Status never shown by color alone
- [ ] Images have alt text; icon-only buttons have accessible labels
- [ ] Layout checked at 375, 768, 1024, 1440 px
- [ ] RTL checked if the content is Persian or Arabic (mirrored layout, logical CSS properties)

## Anti-patterns to avoid

Purple-to-pink "AI" gradients on serious products, low-contrast gray-on-gray text, more than two typefaces, centered long paragraphs, walls of identical cards, autoplaying sound, carousels hiding key content, fake urgency, and placeholder text left in the final build.
