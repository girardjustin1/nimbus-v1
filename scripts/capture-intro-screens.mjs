// Captures the prototype screens shown on Storybook's introduction pages
// (Start Here › Overview / Style guide / Process & roadmap / How to review, and
// Prototypes › Deal Activation System › Rounds).
//
//   npm run proto:dev            (in another terminal; serves :5195)
//   node scripts/capture-intro-screens.mjs
//
// Re-run after a visible change to the prototypes. Writes JPEGs to src/pages/intro/screens/.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/pages/intro/screens");
const base = process.env.PROTO_URL ?? "http://localhost:5195/";
mkdirSync(out, { recursive: true });

/** Hide the dark prototype toolbar: these are pictures of the product, not of the prototype frame. */
const hideToolbar = (p) =>
    p.evaluate(() => {
        const t = document.querySelector("#root > div.sticky");
        if (t) t.style.display = "none";
    });

/** Clip the top `height` px of the page body (right of the sidebar), from `top` px down. */
const main =
    (height, top = 0) =>
    async (p) => {
        const b = await p.locator("main").first().boundingBox();
        return { x: b.x, y: b.y + top, width: b.width, height };
    };
const element = (selector) => async (p) => {
    const el = p.locator(selector).first();
    await el.scrollIntoViewIfNeeded();
    return el.boundingBox();
};

/** [file, prototype path, optional { act, clip }] */
const SHOTS = [
    // The full application, one per page that an introduction shows.
    ["app-key-metrics", "app/v1/#/key-metrics"],
    ["app-realtime", "app/v1/#/realtime"],
    [
        "app-pi",
        "app/v1/#/pi-query-line",
        {
            act: (p) =>
                p
                    .getByText(/^collapse$/i)
                    .first()
                    .click({ timeout: 3000 })
                    .catch(() => {}),
        },
    ],
    ["app-pi-table", "app/v1/#/pi-query"],
    ["app-buyers", "app/v1/#/buyer-breakdown"],
    ["app-leaderboard", "app/v1/#/benchmarks-leaderboard"],
    ["app-demand", "app/v1/#/demand-active"],
    ["app-demand-config", "app/v1/#/demand-configure-partner"],
    ["app-payments", "app/v1/#/nplus-payments"],
    ["app-campaigns", "app/v1/#/campaigns"],
    ["app-overview", "app/v1/#/view-a-at-risk"],
    ["app-setup", "app/v1/#/setup-ready"],
    ["app-assets", "app/v1/#/asset-view"],
    ["app-blocking", "app/v1/#/ad-blocking"],
    ["app-floors", "app/v1/#/floors"],
    ["app-activity", "app/v1/#/activity"],
    ["app-sdks", "app/v1/#/sdks"],
    ["app-settings", "app/v1/#/settings-api"],
    // DAS, one per round.
    ["das-v6", "das/v6/#/view-a-at-risk", { act: (p) => p.locator("#v-delivery").scrollIntoViewIfNeeded() }],
    ["das-v6-campaigns", "das/v6/#/campaigns"],
    ["das-v6-performance", "das/v6/#/view-d"],
    ["das-v6-setup", "das/v6/#/setup-ready"],
    ["das-v5", "das/v5/#/view-d"],
    ["das-v4", "das/v4/#/campaigns"],
    ["das-v3", "das/v3/#/setup-ready"],
    ["das-v2", "das/v2/#/setup-reviewed"],
    ["das-v1", "das/v1/#/reporting"],
    ["das-studio", "das-studio/v1/#/audience"],
    // Style guide examples: one piece of a screen each.
    ["sg-type", "app/v1/#/view-a-at-risk", { clip: main(430, 190) }],
    ["sg-report-table", "app/v1/#/realtime-table", { clip: main(430, 470) }],
    ["sg-list-table", "app/v1/#/campaigns", { clip: main(400, 470) }],
    ["sg-reporting", "app/v1/#/pi-query", { clip: main(600, 130) }],
    ["sg-controls", "app/v1/#/demand-configure-partner", { clip: main(560, 190) }],
    ["sg-tabs", "app/v1/#/floors", { clip: main(330, 110) }],
    ["sg-chart", "app/v1/#/view-a-at-risk", { clip: element("#v-delivery") }],
    ["sg-copy", "app/v1/#/view-a?c=c4", { clip: main(430, 190) }],
];

const browser = await chromium.launch();
for (const [file, route, opts = {}] of SHOTS) {
    // A fresh page per shot: screens read their hash params on load.
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(base + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    await hideToolbar(page);
    if (opts.act) {
        await opts.act(page);
        await page.waitForTimeout(500);
    }
    const clip = opts.clip ? await opts.clip(page) : undefined;
    await page.screenshot({ path: path.join(out, `${file}.jpg`), type: "jpeg", quality: 80, clip });
    await page.close();
    console.log(`  ✓ ${file}`);
}
await browser.close();
