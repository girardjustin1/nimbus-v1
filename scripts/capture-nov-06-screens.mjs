// Captures the prototype v6 screens shown in Storybook › Nov 6 Edits › Introduction.
//
//   npm run proto:dev            (in another terminal; serves :5190)
//   node scripts/capture-nov-06-screens.mjs
//
// Re-run after any change to v6 so the review guide shows what Product will see.
// Writes JPEGs to src/pages/nov-06/screens/.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/pages/nov-06/screens");
const base = process.env.PROTO_URL ?? "http://localhost:5190/das/v6/";
mkdirSync(out, { recursive: true });

/** Hover the Delivery chart a little past the middle of what's delivered so far. */
const hoverChart =
    (x = 0.42) =>
    async (p) => {
        const box = await p.locator("#v-delivery").boundingBox();
        await p.mouse.move(box.x + box.width * x, box.y + 230, { steps: 6 });
    };

/** Click a sortable header `times` times. */
const sortBy =
    (name, times = 1) =>
    async (p) => {
        for (let i = 0; i < times; i++) await p.getByRole("button", { name, exact: true }).first().click();
    };

/** [file, route, element to capture (or null for the viewport), optional interaction] */
const SHOTS = [
    ["01-delivery-at-risk", "view-a-at-risk", "#v-delivery", hoverChart()],
    ["02-delivery-behind", "view-a-behind", "#v-delivery", hoverChart(0.2)],
    ["03-round-6", "view-a-chart-round-6", "#v-delivery", null],
    ["04-concept-a", "view-a-chart-overlay", "#v-delivery", null],
    ["05-concept-b", "view-a-chart-bars", "#v-delivery", null],
    ["06-concept-c", "view-a-chart-stacked", "#v-delivery", null],
    ["07-concept-d", "view-a-chart-indexed", "#v-delivery", null],
    ["08-concept-e", "view-a-chart-strip", "#v-delivery", null],
    ["09-assets-sorted", "asset-view", null, sortBy("Ad Size")],
    ["10-fp-sorted", "view-d", "table", sortBy("Revenue")],
    ["11-keywords-sorted", "keyword-view", null, sortBy("Updated", 2)],
    ["12-concept-f", "view-a-chart-labelled", "#v-delivery", null],
    ["13-concept-g", "view-a-chart-backdrop", "#v-delivery", null],
    ["14-concept-h", "view-a-chart-scaled", "#v-delivery", null],
    ["15-concept-i", "view-a-chart-bands", "#v-delivery", null],
];

const browser = await chromium.launch();
for (const [file, route, selector, act] of SHOTS) {
    // A fresh page per shot: the overview only reads ?c= on load.
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}#/${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    const target = selector ? page.locator(selector).last() : null;
    if (target) await target.scrollIntoViewIfNeeded();
    if (act) {
        await act(page);
        await page.waitForTimeout(500);
    }
    const shot = { path: path.join(out, `${file}.jpg`), type: "jpeg", quality: 82 };
    // A table shot takes its scroll container, so the header row and total are both in.
    if (target) await (selector === "table" ? target.locator("xpath=..") : target).screenshot(shot);
    else await page.screenshot(shot);
    await page.close();
    console.log(`  ✓ ${file}`);
}
await browser.close();
