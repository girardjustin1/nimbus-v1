# Standalone prototypes

Clickable product prototypes that live outside Storybook, each with its own URL and its
own version history. They're built from the same design system (`src/`), so they stay
on-brand automatically.

| Prototype | Local | GitHub Pages |
| --- | --- | --- |
| Deal Activation System | http://localhost:5190/das/ | https://girardjustin1.github.io/nimbus-v1/das/ |
| Performance Insights | http://localhost:5190/performance-insights/ | https://girardjustin1.github.io/nimbus-v1/performance-insights/ |

The bare URL always opens the **latest** version. Every version stays live at its own
path (`…/das/v1/`, `…/das/v2/`) so earlier rounds can be compared.

## Run locally

```bash
npm run proto:dev     # http://localhost:5190/das/ and /performance-insights/
npm run proto:build   # static build → ./dist-prototypes
```

## Layout

```
prototypes/
├── vite.config.ts            # one multi-page build; finds every version automatically
├── shared/
│   ├── prototype-frame.tsx   # toolbar (version + screen switcher) and index page
│   └── prototype.css         # design-system styles
├── das/
│   ├── index.html            # redirects to the latest version
│   ├── versions.ts           # version list: id, label, date, experience summary
│   └── v1/
│       ├── index.html, main.tsx
│       ├── screens.tsx       # screen registry (order = prev/next order)
│       └── screens/          # this version's screen code (frozen once published)
└── performance-insights/     # same shape
```

## Cut a new version

1. Copy the latest folder: `cp -R prototypes/das/v1 prototypes/das/v2`
2. In `prototypes/das/v2/main.tsx`, change `meta("v1")` to `meta("v2")`.
3. Add a `v2` row to `prototypes/das/versions.ts` (label, date, experience summary).
   It becomes the latest, and the bare URL now opens v2.
4. Change the screens in `v2/` freely. `v1/` stays exactly as it was.

Screens use hash routes (`…/das/v1/#/setup-ready`), so every screen has a shareable
link and the static build works on GitHub Pages without server rewrites.

## Notes

- Sample data is fictional. The Pages site is **public**, so don't add real publisher
  data, internal figures or people's names.
- The Round 1 concepts also remain in Storybook (Deal Activation System and Performance
  Insights categories) as a reference. The copies here are independent.
- Components a prototype needs that the design system lacks should graduate into `src/`
  (and Storybook) once approved.
