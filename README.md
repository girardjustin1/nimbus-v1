<p>
  <img src="logos/Nimbus-blue.svg" alt="Nimbus" height="40" />
</p>

# Nimbus Design System

The single source of truth for the **Nimbus** brand: design tokens, foundations,
reusable UI components, application patterns, full product screens, and clickable
product prototypes. Everything is themed from the Nimbus Figma token export.

Built with **React 19 · TypeScript · Tailwind CSS v4 · React Aria · Recharts ·
Storybook 10 · Vite.**

## 🔗 Open it

| What | Live (GitHub Pages) | Local |
| --- | --- | --- |
| **Storybook** (design system) | [girardjustin1.github.io/nimbus-v1](https://girardjustin1.github.io/nimbus-v1/) | `npm run storybook` → http://localhost:6006 |
| **Prototype: Deal Activation System** | […/nimbus-v1/das/](https://girardjustin1.github.io/nimbus-v1/das/) | `npm run proto:dev` → http://localhost:5190/das/ |
| **Prototype: Performance Insights** | […/nimbus-v1/performance-insights/](https://girardjustin1.github.io/nimbus-v1/performance-insights/) | `npm run proto:dev` → http://localhost:5190/performance-insights/ |

Start with the **[Introduction](https://girardjustin1.github.io/nimbus-v1/?path=/docs/introduction--docs)**
page in Storybook. It gives a guided overview and links to both prototypes.

Everything on `main` deploys automatically. Merge to `main`, and a couple of minutes
later the links above show the new version.

---

## 🧪 Active prototypes

**Round 1 review · September 22, 2026**

Prototypes are standalone apps, separate from Storybook, built from the same
components. Each has its own URL, a toolbar to switch screens and versions, and a
shareable link for every screen. The bare URL always opens the **latest** version;
older versions stay live (`…/das/v1/`, `…/das/v2/`, …).

### Deal Activation System: Extended Targeting

[Open prototype →](https://girardjustin1.github.io/nimbus-v1/das/) ·
[Storybook concepts](https://girardjustin1.github.io/nimbus-v1/?path=/docs/deal-activation-system-overview--docs)

> **The experience.** A publisher sets up a direct-sold campaign on a single page
> instead of a five-step wizard. Problems are flagged as they go, and Publish is enabled
> only when everything checks out. They target the campaign with their own keywords
> (words their app already sends, like "sports" or "over21") plus ad unit type and
> device language, and manage those keywords in a new Keyword Library. After launch,
> every campaign shows at a glance whether it's on pace to deliver what was promised,
> and DAS results are reported separately from Open Marketplace revenue.

| Area | Screens |
| --- | --- |
| Campaign Setup (one page) | Ready to publish · With errors · Fallback rule |
| Targeting | A: Inline keyword chips · A: ALL match + warnings · B: Pick from library · C: Audience sentence |
| Keyword Library | Default · Add keywords · Delete keyword in use · Empty state |
| Manage Campaigns | A: Delivery view · A: Selected for compare · B: Compare |
| Reporting | A: DAS overview · B: Query builder · B: Breakdown picker open |

### Performance Insights: Reporting redesign

[Open prototype →](https://girardjustin1.github.io/nimbus-v1/performance-insights/) ·
[Storybook concepts](https://girardjustin1.github.io/nimbus-v1/?path=/docs/performance-insights-overview--docs)

> **The experience.** A publisher opens Performance Insights and starts from a template
> or saved query instead of a blank wall of checkboxes. They build a question as one
> readable sentence ("show revenue and eCPM by demand source for the last 7 days…")
> that only runs when they ask, see every number next to its change from the previous
> period, and drill from app to demand source in a pivot view.

| Concept | Screens |
| --- | --- |
| A: Start page | Templates & saved queries |
| B: Question bar | Results · Edited, not yet run |
| C: Explorer | Pivot with drill-down |

> All prototype data is **fictional sample data**. The Pages site is public, so never
> add real publisher data, internal figures or people's names.

---

## 📚 What's in Storybook

The sidebar runs top to bottom the way you'd build with it: brand primitives,
then components, then full screens, then active prototype work.

| Section | What's inside |
| --- | --- |
| **Introduction** | Guided overview, active-prototype links, changelog |
| **Styles** (6) | Color · Typography · Icons · Elevation · Shape · Logos, rendered live from the tokens |
| **Base Components** (19) | Avatars · Badges · Badge Groups · Buttons · Button Group · Checkbox · Dropdown · File Upload · Form · Input · Multi Select · Progress Indicators · Radio Buttons · Select · Slider · Tags · Textarea · Toggle · Tooltip |
| **Application UI** (23) | App Navigation – Sidebar · Alerts · Breadcrumbs · Carousel · Charts · Code Snippet · Command Menu · Date Picker · Dividers · Empty State · File Upload · Filter Bars · Loading Indicator · Metrics · Modal · Notifications · Pagination · Pie Charts · Progress Steps · Radar Charts · Slideout Menu · Table · Tabs |
| **Account Login** (4) | Sign up · Log in · Forgot Password · Verify Email |
| **App Screens** (17) | Full Nimbus product screens built from the system (see below) |
| **Deal Activation System** | Round 1 screen concepts + overview (reference copy; new rounds happen in the standalone prototype) |
| **Performance Insights** | Round 1 screen concepts + overview (reference copy) |

**App Screens**, grouped by area:

- **Reporting & metrics:** Key Metrics Dashboard, Performance Insights, Saved Queries,
  Nimbus+ Reporting, Nimbus Benchmarks
- **Payments & finance:** Nimbus+ Payments, Nimbus+ Payouts, Billing Setup, Add
  DocuSign Contracts
- **Demand & campaigns:** Manage Active Demand, Manage Assets, View All Campaigns,
  Campaign Setup, DAS – Billing Rates
- **AdOps & SDK:** Ad Blocking, Ad Blocking – Blocklists, SDK & Documentation

## 🎨 Brand & tokens

The theme is generated from the Nimbus design tokens in `reference/styles/` and
applied in `src/styles/theme.css`:

- **Brand:** pink primary (`#DA6EA3` / `--color-brand-500`) with teal (`#37B6B7`) as
  the secondary / `_alt` accent. Deeper tones (`#A94579`, `#1F7F80`) are used where
  white text needs accessible contrast.
- **Neutrals:** a warm gray scale for surfaces, text and borders.
- **Typography:** Proxima Nova on the Nimbus type scale (`text-md` 15px, `text-sm`
  13px, `text-xl` 26px, display sizes up to 72px).
- **Radius & spacing:** Nimbus token values (e.g. `radius-md` 8px).

Light and dark modes are both defined. Reuse the theme classes (`bg-brand-solid`,
`text-primary`, `border-secondary`, `text-md`, …) and new work inherits the brand
automatically.

---

## 🚀 Getting started

Requires **Node 22+** and npm.

```bash
git clone https://github.com/girardjustin1/nimbus-v1.git
cd nimbus-v1
npm install
npm run storybook     # design system → http://localhost:6006
npm run proto:dev     # prototypes    → http://localhost:5190/das/  and  /performance-insights/
```

No tokens or secrets are needed. Icons come from the free `@untitledui/icons` set.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run storybook` | Storybook dev server (port 6006) |
| `npm run build-storybook` | Static Storybook → `storybook-static/` |
| `npm run proto:dev` | Standalone prototypes dev server (port 5190) |
| `npm run proto:build` | Static prototypes → `dist-prototypes/` |
| `npm run typecheck` | TypeScript (`tsc -b`) across `src/` and `prototypes/` |
| `npm run lint` | ESLint |
| `npm run test` | All tests: unit (Node) + Storybook (every story rendered in headless Chromium) |
| `npm run test:unit` / `test:storybook` | Just one of the two test suites |
| `npm run validate` | Everything CI runs: typecheck, lint, tests, both builds |
| `npm run dev` / `build` | The starter Vite app in `src/main.tsx` (not deployed) |

Storybook tests need Playwright's Chromium once per machine:
`npx playwright install chromium`.

## 🗂️ Project structure

```
.
├── src/                          # the design system
│   ├── components/
│   │   ├── base/                 # Base Components (buttons, inputs, select, …)
│   │   ├── application/          # Application UI (table, nav, charts, modals, …)
│   │   ├── foundations/          # Styles stories (color, type, icons, logos)
│   │   └── shared-assets/
│   ├── pages/
│   │   ├── auth/                 # Account Login templates
│   │   ├── app-screens/          # App Screens
│   │   ├── deal-activation-system/   # DAS concepts (Storybook category)
│   │   └── performance-insights/     # PI concepts (Storybook category)
│   ├── styles/                   # theme.css (Nimbus tokens), globals, typography
│   └── Introduction.mdx          # Storybook landing page
├── prototypes/                   # standalone, versioned prototype apps
│   ├── vite.config.ts            # one multi-page build; finds every version
│   ├── shared/                   # prototype toolbar/index frame + styles
│   ├── das/                      # index.html (→ latest) · versions.ts · v1/
│   └── performance-insights/     # same shape
├── .storybook/                   # Storybook config + sidebar order (preview.tsx)
├── .github/workflows/            # CI, Pages deploy, component sync
├── reference/                    # design sources: token export, screen exports
└── logos/
```

## 🛠️ Working in the repo

**Workflow:** branch off `main` → open a PR → CI must pass → merge → Pages redeploys.

- **Add a component or screen.** Put it under `src/`, next to a `*.stories.tsx` with
  `title: "<Section>/<Name>"`. It shows up in that Storybook section automatically.
  Sidebar order lives in `.storybook/preview.tsx`.
- **Start a new prototype round.** Copy the latest version folder
  (`cp -R prototypes/das/v1 prototypes/das/v2`), change `meta("v1")` to `meta("v2")`
  in `v2/main.tsx`, and add a `v2` row to `prototypes/das/versions.ts`. The bare URL
  now opens v2, and v1 stays untouched. Details: [`prototypes/README.md`](prototypes/README.md).
- **Add a new prototype.** Copy `prototypes/performance-insights/` to
  `prototypes/<name>/`, edit its `versions.ts` and `v1/screens.tsx`, and add a card to
  `src/Introduction.mdx`. The build finds it automatically and deploys it to
  `/nimbus-v1/<name>/`.
- **Promote a pattern.** When a prototype introduces something reusable (e.g. the
  keyword chip input or delivery bar), move it into `src/components/` with a story so
  every screen can use it.
- **Keep the Introduction current.** When a prototype round ships, update the date and
  changelog on the Introduction tile and the prototype's `versions.ts`.

## ✅ Quality checks

Every pull request runs **[CI](.github/workflows/ci.yml)**: type-check, lint, unit
tests, Storybook tests, and both builds. Run the same thing locally with
`npm run validate`.

- **Lint:** ESLint with TypeScript and React Hooks rules. It's currently at 0 errors
  and 0 warnings. A leading `_` marks an intentionally unused name.
- **Unit tests** (`*.test.ts`): pacing logic, sample-data consistency, tag-input ID
  reconciliation, and the prototype version registry (every listed version must exist
  and be wired up).
- **Storybook tests:** every story is rendered in headless Chromium, so a broken
  screen fails CI.

## 🌐 Deployment

[`deploy-storybook.yml`](.github/workflows/deploy-storybook.yml) runs on every push to
`main`. It builds Storybook and the prototypes into one site and publishes it to
GitHub Pages:

```
https://girardjustin1.github.io/nimbus-v1/                        Storybook
https://girardjustin1.github.io/nimbus-v1/das/                    DAS prototype (latest)
https://girardjustin1.github.io/nimbus-v1/performance-insights/   PI prototype (latest)
```

No extra setup is needed. Pages is configured to deploy from GitHub Actions. Progress
shows under the repo's **Actions** tab.

## ⚠️ Good to know

- **The Pages site is public.** Anyone with a link can open Storybook and the
  prototypes. Keep data fictional, and keep internal material (briefs, PDFs, staging
  screenshots) out of the repo. `reference/das-system/` is gitignored for this reason.
- **Vendored components.** `src/components/` started from the Untitled UI React kit.
  [`sync-components.yml`](.github/workflows/sync-components.yml) can pull upstream
  updates, which may overwrite local fixes. Review sync PRs carefully.
- **PRO icons (optional).** `@untitledui-pro/icons` isn't installed. To add it, put
  `UNTITLEDUI_PRO_TOKEN` in a local `.env` (read by `.npmrc`) and as a repository
  secret for CI.
- **Ports.** Storybook runs on 6006 and the prototypes on 5190. Locally, the
  Introduction's prototype buttons expect 5190, and the prototypes' "Design system"
  link expects 6006. The prototype server won't silently switch ports if 5190 is taken.
  Storybook will, so if it lands elsewhere (e.g. `npm run storybook -- -p 6007`), that
  one link won't match.
- **Formatting.** Prettier is configured (`.prettierrc`) but not enforced in CI yet,
  and some older files aren't formatted. Format files you touch with
  `npx prettier --write <file>`.
- **AI assistance.** [`CLAUDE.md`](CLAUDE.md) documents the component library's
  conventions (React Aria patterns, styling, icons) for AI coding assistants.
