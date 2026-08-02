# STUDYARC Design System (Phase 1)

This document outlines the core design tokens, colors, and patterns used across the STUDYARC platform. All frontend engineers should use these classes to ensure consistency across the application.

## 1. Brand Colors

The platform uses a dark, "Dev-Fusion" aesthetic built around three primary glowing neon colors over a deep slate background.

- **Brand Teal (`brand-teal`)**: `#35C7B8`
  - Usage: Primary CTAs, successful states, and "Diagnose/AI" related features.
- **Brand Cyan (`brand-cyan`)**: `#00F0FF`
  - Usage: Secondary highlights, gradients, tech-focused elements, and the "Pro" tier badge.
- **Brand Amber (`brand-amber`)**: `#F59E0B`
  - Usage: Warnings, "Practice Mode", "Real-time" highlights, and star ratings.
- **Brand Indigo (`brand-indigo`)**: `#6366F1`
  - Usage: Trust markers, "Expert Mentors", and testimonials.
- **Brand Pink (`brand-pink`)**: `#EC4899`
  - Usage: Accents and legal/cookie banner highlights.

## 2. Backgrounds & Surfaces

- **Main Background (`bright-bg`)**: `#05050B` - Deep space black/slate.
- **Card Background (`bright-card`)**: `#0D0E15` - Used for default cards and containers.
- **Glass Effect (`glass-bright`)**:
  - `bg-[#0D0E15]/80` with `backdrop-blur-xl`.
  - Usage: All floating panels, pricing cards, mentor profiles, and dashboard widgets.

## 3. Typography

- **Headings (`font-heading`)**: Inter / Outfit (or sans serif fallback) with `font-black` and `tracking-tight`.
- **Body**: Standard sans-serif (`text-slate-300` for primary reading, `text-slate-500` for secondary metadata).
- **Accents (`font-mono`)**: Monospace font used for data metrics, sub-labels (e.g. "Step 01", "Pricing"). Usually paired with `uppercase` and `tracking-widest`.

## 4. Custom Glow Effects (Shadows & Borders)

Do not use standard Tailwind shadows (like `shadow-lg`) for premium cards. Use our custom glow utilities defined in `index.css`:

- `.card-glow-teal`: Teal hover aura.
- `.card-glow-cyan`: Cyan hover aura.
- `.card-glow-amber`: Amber hover aura.
- `.card-glow-indigo`: Indigo hover aura.
- `.card-glow-emerald`: Emerald hover aura.

**Standard border for panels**: `border border-bright-border` (`#1A1C29`).

## 5. Components

### Primary CTA Button
Must use the `bg-bright-gradient` with `glow-bright-cyan` for the primary conversion buttons.
```html
<button className="rounded-xl bg-bright-gradient border border-brand-teal px-8 py-4 font-extrabold text-white shadow-2xl shadow-brand-teal/30 hover:scale-105 glow-bright-cyan transition">
  Start for Free
</button>
```

### Analytical Pulse / Badges
```html
<span className="rounded bg-brand-cyan/20 px-1.5 py-0.5 text-[10px] text-brand-cyan uppercase">
  Live
</span>
```

---
*Maintained by Lead Frontend. Last updated during Phase 1 Sprint.*
