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

| What | GitHub Pages (primary) | Netlify (backup) | Local |
| --- | --- | --- | --- |
| **Storybook** (design system) | [girardjustin1.github.io/nimbus-v1](https://girardjustin1.github.io/nimbus-v1/) | [nimbus-ds-v1.netlify.app](https://nimbus-ds-v1.netlify.app/) | `npm run storybook` → http://localhost:6006 |
| **Prototype: Deal Activation System** | […/nimbus-v1/das/](https://girardjustin1.github.io/nimbus-v1/das/) | […netlify.app/das/](https://nimbus-ds-v1.netlify.app/das/) | `npm run proto:dev` → http://localhost:5190/das/ |
| **Prototype: Performance Insights** | […/nimbus-v1/performance-insights/](https://girardjustin1.github.io/nimbus-v1/performance-insights/) | […netlify.app/performance-insights/](https://nimbus-ds-v1.netlify.app/performance-insights/) | `npm run proto:dev` → http://localhost:5190/performance-insights/ |
| **Prototype: DAS Studio** | […/nimbus-v1/das-studio/](https://girardjustin1.github.io/nimbus-v1/das-studio/) | […netlify.app/das-studio/](https://nimbus-ds-v1.netlify.app/das-studio/) | `npm run proto:dev` → http://localhost:5190/das-studio/ |

Start with the **[Introduction](https://girardjustin1.github.io/nimbus-v1/?path=/docs/introduction--docs)**
page in Storybook. It gives a guided overview and links to every prototype.

Everything on `main` deploys automatically to both hosts. Merge to `main`, and a couple
of minutes later the links above show the new version. GitHub Pages is the primary;
Netlify builds the same site and is the backup. If one is behind (for example during a
GitHub Actions outage), use the other.

---

## 🧪 Active prototypes

Prototypes are standalone apps, separate from Storybook, built from the same
components. Each has its own URL, a toolbar to switch screens and versions, and a
shareable link for every screen. The bare URL always opens the **latest** version;
older versions stay live (`…/das/v1/`, `…/das/v2/`, …).

### Deal Activation System: Extended Targeting

**Round 3 is current** (built from the 2 Oct review, updated from the 5 Oct review).
Rounds 1 (22 Sep) and 2 (1 Oct) stay live, unchanged, at `…/das/v1/` and `…/das/v2/`.

[Open prototype →](https://girardjustin1.github.io/nimbus-v1/das/) ([backup](https://nimbus-ds-v1.netlify.app/das/)) ·
[Campaign Setup spec](https://girardjustin1.github.io/nimbus-v1/?path=/docs/deal-activation-system-campaign-setup-spec--docs) ([backup](https://nimbus-ds-v1.netlify.app/?path=/docs/deal-activation-system-campaign-setup-spec--docs))

> **The experience.** A publisher sets up a direct-sold campaign on one page. Everything
> they choose from a library they already built (deal, priority, frequency cap, geos,
> apps, keywords, creative) works the same way: click or press ↓ for the whole list
> A–Z, type to narrow, Enter to pick. Apps, keywords and creative land in tables rather
> than chips. A rail on the right counts the product's five steps and ends in Review,
> which opens a modal with Publish and Publish & Duplicate. Two libraries sit behind the
> form: assets (markup pasted and previewed live) and keywords (with Keyword Health,
> which shows whether keywords are actually arriving).

**From the 5 Oct review:**
- **Type:** Proxima Nova, extra-bold headlines, bold black labels, and nothing under 15px.
- **Layout:** instructions sit above the control, and errors below it.
- **Pickers:** Flight Dates are dates only, and every picker has a Done button.
- **Published campaigns** offer Duplicate, and the setup tabs are gone.
- **Copy switch:** a toolbar control shows staging's original wording, or ours with new
  copy highlighted or hidden.

| Area | Screens (43) |
| --- | --- |
| Deal activation setup (14) | Empty form · General · Auction Rules · Budget · Targeting · Creative · Ready to review · Keywords in a modal · Publish & Duplicate in a footer · After Publish & Duplicate · Review modal · Review found problems · End before the start · Published |
| Right rail: two concepts (3) | Summary → Review → Publish · Live validation → Publish · Live validation, with problems |
| Manage assets (10) | Asset Setup (empty · filled) · markup validation (clean · four faults · macros) · View All Assets (· searching) · Asset detail (edit · serving now) · Can't delete a live asset |
| Manage keywords (9) | Keyword Setup (empty · filled) · View All Keywords (· nothing yet) · Keyword detail (· never arrived) · Delete blocked · Delete OK · Keyword Health |
| Manage campaigns (3) | Delivery view · Searching · Compare |
| After publishing (4) | A: One page · B: Delivery first · C: Campaign as one sentence · D: Performance |

### Performance Insights: Reporting redesign

[Open prototype →](https://girardjustin1.github.io/nimbus-v1/performance-insights/) ([backup](https://nimbus-ds-v1.netlify.app/performance-insights/)) ·
[Storybook concepts](https://girardjustin1.github.io/nimbus-v1/?path=/docs/performance-insights-overview--docs)

> **The experience.** A publisher opens Performance Insights and starts from a template
> or saved query instead of a blank wall of checkboxes. They build a question as one
> readable sentence ("show revenue and eCPM by demand source for the last 7 days…")
> that only runs when they ask, see every number next to its change from the previous
> period, and build any breakdown by dragging fields into a pivot that rebuilds live.
> Saved queries show their date range, trend and latest number at a glance.

| Concept | Screens |
| --- | --- |
| A: Start page | Templates & saved queries · Searching · Search with no results |
| B: Question bar | Results · Metric picker open · Edited, not yet run · Save dialog · Saved confirmation |
| C: Explorer (drag to build) | Default · Country by platform · Filtered · No columns · Too many columns · Empty · Rail collapsed. Drag fields from the right rail; the layout is kept in the link |
| Saved Queries (reference) | Today's page |
| D: Smart table | 15 states: filters, grouping, search, first run, loading, selection, row menu, schedule, delete, bulk delete, undo |
| E: Preview cards | All · Filtered by type · "Why this?" open · Recommendation dismissed |
| F: Date-range timeline | By account · By report type · Bar selected · Ended ranges highlighted |
| G: List + preview | Saved · Recommendation · Ended range · Loading · Share |

### DAS Studio: build with the result in view

[Open prototype →](https://girardjustin1.github.io/nimbus-v1/das-studio/) ([backup](https://nimbus-ds-v1.netlify.app/das-studio/)) ·
[Storybook concept](https://girardjustin1.github.io/nimbus-v1/?path=/docs/deal-activation-system-studio-concept-overview--docs)

> **The experience.** A publisher builds a deal campaign in a focused, full-screen
> studio: pick a goal from four visual tiles, name the deal, choose who sees it, then set
> budget, bid and dates. A live panel estimates delivery likelihood, impressions and
> reach as they go. While building the creative, the ad renders in a real app screen
> beside the form (banner, interstitial, rewarded video or native) and updates with
> every keystroke. Review leads with the flight, budget and a render of the ad, and a
> full-screen preview steps through every moment of the format on phone or tablet.

| Step | Screens |
| --- | --- |
| 1: Goal | Start from scratch · Goal chosen · Next without a goal |
| 2: Deal & campaign | Deal & campaign |
| 3: Audience | Audience · Too narrow |
| 4: Budget & schedule | Budget, bid & schedule · Bid below range · Calendar open · Fallback goal |
| 5: Creative & preview | Nothing added · Interstitial · Banner · Rewarded video · Rewarded end card · Native |
| 6: Review & publish | Ready · Publish pressed with problems · Published |
| Full-screen preview | Phone · Tablet · Banner moments · Rewarded end card · Processing |

Back / Next keep your choices from step to step. Opening a screen's link directly
starts from that screen's sample state.

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
| **Deal Activation System** | **Campaign Setup Spec** (the setup page's rules and open questions), then **Campaign Setup**: every component on Round 3's setup page, rendered from the prototype's own code. It runs Page → Sections (9) → Targeting (5) → Controls (13) → Rail (2), 82 stories. Round 1, Round 2, the Studio concept and the Prototype 3 review pages are hidden from the sidebar (tag `!dev`) but still open by direct link |
| **Performance Insights** | Overview, Round 1 concepts (reference copy), and **Charts**: 14 Nimbus-styled chart types (every Untitled UI chart plus combo, heatmap, funnel, scatter and treemap) with a Gallery and an Overview |

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
│   │   ├── deal-activation-system/   # campaign-setup-spec.mdx + campaign-setup/ (Round 3
│   │   │                             # setup inventory); Round 1, round-1-components/ and
│   │   │                             # studio/ are kept but hidden from the sidebar
│   │   ├── prototype-3/              # Round 3 review pages (hidden from the sidebar)
│   │   └── performance-insights/     # PI concepts (Storybook category)
│   ├── styles/                   # theme.css (Nimbus tokens), globals, typography
│   └── Introduction.mdx          # Storybook landing page
├── prototypes/                   # standalone, versioned prototype apps
│   ├── vite.config.ts            # one multi-page build; finds every version
│   ├── shared/                   # prototype toolbar/index frame + styles
│   ├── das/                      # index.html (→ latest) · versions.ts · v1/ v2/ v3/
│   ├── performance-insights/     # same shape
│   └── das-studio/               # same shape; screens come from src/…/studio
├── .storybook/                   # Storybook config + sidebar order (preview.tsx)
├── .github/workflows/            # CI, Pages deploy
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
- **Hide, don't delete.** To take a Storybook page out of the sidebar but keep it
  linkable, add `tags: ["!dev"]` to its meta (or `tags={["!dev"]}` on an MDX `<Meta>`).
- **Prototype 3's setup inventory** (`src/pages/deal-activation-system/campaign-setup/`)
  imports the prototype's own components through `harness.tsx`. Change the component in
  `prototypes/das/v3/screens/` and the story follows.

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

Every push to `main` deploys the same site, Storybook with the prototypes beside it, to
two hosts.

**GitHub Pages (primary).** [`deploy-storybook.yml`](.github/workflows/deploy-storybook.yml)
builds and publishes it. Progress shows under the repo's **Actions** tab.

```
https://girardjustin1.github.io/nimbus-v1/                        Storybook
https://girardjustin1.github.io/nimbus-v1/das/                    DAS prototype (latest)
https://girardjustin1.github.io/nimbus-v1/performance-insights/   PI prototype (latest)
https://girardjustin1.github.io/nimbus-v1/das-studio/             DAS Studio prototype (latest)
```

**Netlify (backup).** [`netlify.toml`](netlify.toml) holds the build: the same commands,
publishing `storybook-static/`, on Node 22. Netlify builds on its own machines, so it
stays current when GitHub Actions is delayed. Progress shows in the Netlify project's
**Deploys** tab.

```
https://nimbus-ds-v1.netlify.app/                        Storybook
https://nimbus-ds-v1.netlify.app/das/                    DAS prototype (latest)
https://nimbus-ds-v1.netlify.app/performance-insights/   PI prototype (latest)
https://nimbus-ds-v1.netlify.app/das-studio/             DAS Studio prototype (latest)
```

Every link inside the site is relative, so it works the same on either host.

## ⚠️ Good to know

- **Both hosts are public.** Anyone with a link can open Storybook and the prototypes,
  on GitHub Pages or Netlify. By default Netlify also publishes a preview for each pull
  request. Keep data fictional, and keep internal material (briefs, PDFs, staging
  screenshots) out of the repo. `reference/das-system/` is gitignored for this reason.
- **Vendored components.** `src/components/`, `src/hooks/`, `src/utils/` and
  `src/providers/` started from the Untitled UI React kit and are treated as vendored:
  lint reports findings there as warnings rather than errors, so the originals stay
  recognisable. Prefer wrapping or composing over editing them in place.
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
