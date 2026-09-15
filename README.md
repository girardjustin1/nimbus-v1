# Nimbus Design System

A React + Storybook design system for Nimbus front-end prototyping — a single
source of truth for the Nimbus brand: design tokens, foundations, reusable UI
components, application patterns, and ready-to-use screen templates.

Built with **React 19, TypeScript, Tailwind CSS v4, React Aria, Recharts,
Storybook 10, and Vite.**

## 📖 Live Storybook

### 👉 **[girardjustin1.github.io/nimbus-v1](https://girardjustin1.github.io/nimbus-v1/)**

The full, interactive library — styles, components, application patterns, and app
screens — auto-deployed from `main`. Start on the **Introduction** page for a guided
overview of everything inside.

## Core Purpose

Nimbus gives designers and engineers one place to see and reuse the Nimbus
visual language. Everything is themed from the Nimbus Figma token export, so the
brand — pink primary, teal secondary, Proxima Nova, warm gray neutrals — stays
consistent from a single button to a full application screen.

## Brand & Tokens

The theme is generated from the Nimbus design tokens in `reference/styles/` and
applied in `src/styles/theme.css`:

- **Brand:** pink primary (`#DA6EA3` / `--color-brand-500`) with teal
  (`#37B6B7`) as the secondary / `_alt` accent.
- **Neutrals:** a warm gray scale for surfaces, text, and borders.
- **Typography:** Proxima Nova with the Nimbus type scale (`text-md` 15px,
  `text-sm` 13px, `text-xl` 26px, display sizes up to 72px).
- **Radius & spacing:** Nimbus token values (e.g. `radius-md` 8px).

Light and dark modes are both defined. The **Styles** section of Storybook
renders the palette and type scale live from these tokens, so the documentation
never drifts from the theme.

## What's Inside

The Storybook library is organized top-to-bottom, matching the **Introduction**
page in Storybook:

**Introduction** — a guided overview of the whole library (categories, components,
and every screen).

**Styles** (6) — color palette, typography, icons, elevation, shape, and logos,
rendered live from the Nimbus tokens.

**Base Components** (19) — the core building blocks: avatars, badges, badge groups,
buttons, button group, checkbox, dropdown, file upload, form, input, multi select,
progress indicators, radio buttons, select, slider, tags, textarea, toggle, and
tooltip.

**Application UI** (23) — richer composed patterns: app navigation (sidebar),
alerts, breadcrumbs, carousel, charts, code snippet, command menu, date picker,
dividers, empty state, file upload, filter bars, loading indicator, metrics,
modal, notifications, pagination, pie charts, progress steps, radar charts,
slideout menu, table, and tabs.

**Account Login** (4) — auth page templates: sign up, log in, forgot password, and
verify email.

**App Screens** (17) — full Nimbus product screens assembled entirely from the
system, each with multiple states where relevant:

- **Reporting & metrics** — Key Metrics Dashboard, Performance Insights, Saved
  Queries, Nimbus+ Reporting, Nimbus Benchmarks
- **Payments & finance** — Nimbus+ Payments, Nimbus+ Payouts, Billing Setup, Add
  DocuSign Contracts
- **Demand & campaigns** — Manage Active Demand, Manage Assets, View All Campaigns,
  Campaign Setup, DAS – Billing Rates
- **AdOps & SDK** — Ad Blocking, Ad Blocking – Blocklists, SDK & Documentation

## Getting Started

```bash
npm install              # install dependencies
npm run storybook        # launch the design system at http://localhost:6006
npm run dev              # Vite dev server at http://localhost:5173
npm run build            # type-check + production build
npm run build-storybook  # static Storybook build → ./storybook-static
```

> **Icons:** the icon set installs from a private registry. Put your registry
> token in a local `.env` file (gitignored); the committed `.npmrc` reads it
> during `npm install`. For CI, the token is provided as a repository secret.

## Storybook on GitHub Pages

Every push to `main` builds Storybook and deploys it to GitHub Pages:

> https://girardjustin1.github.io/nimbus-v1/

The Vite prototype app (`src/main.tsx`) deploys alongside it:

> https://girardjustin1.github.io/nimbus-v1/prototype/

## Structure

```
src/
├── components/
│   ├── base/          # Buttons, badges, inputs, avatars, … (Base Components)
│   ├── application/   # Tables, nav, modals, global-nav, … (Application UI)
│   └── foundations/   # Colors, typography, icons, logos (Styles)
├── pages/
│   ├── auth/          # Account Login templates (sign up / log in / …)
│   └── app-screens/   # Full product screens
├── styles/            # theme.css (Nimbus tokens), globals, typography
└── ...
reference/
├── styles/            # Nimbus Figma token export (source of the theme)
└── ...                # source design artifacts (nav, screen exports)
```

## Working in the System

- Prototype on a feature branch; merge to `main` to publish to Pages.
- Add a component or screen with a matching `*.stories.tsx` and it appears in
  the correct Storybook category automatically.
- Reuse the theme classes (`bg-brand-solid`, `text-primary`, `border-secondary`,
  `text-md`, `radius-md`, …) so new work inherits the Nimbus brand for free.
