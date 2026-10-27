// Captures the prototype v5 screens shown in Storybook › Oct 26 › Introduction.
//
//   npm run proto:dev            (in another terminal; serves :5190)
//   node scripts/capture-oct-26-screens.mjs
//
// Re-run after any change to v5 so the review guide shows what Product will see.
// Writes JPEGs to src/pages/oct-26/screens/.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/pages/oct-26/screens");
const base = process.env.PROTO_URL ?? "http://localhost:5190/das/v5/";
mkdirSync(out, { recursive: true });

/** [file, route, optional interaction, optional full-page] */
const SHOTS = [
    ["01-campaigns", "campaigns"],
    ["02-overview", "view-a?c=c1"],
    ["03-overview-paused", "view-a?c=c4"],
    ["04-full-performance", "view-d?c=c1"],
    [
        "05-filter-menu",
        "view-d?c=c1",
        async (p) => {
            await p.getByRole("button", { name: /^add$/i }).click();
            await p.getByRole("button", { name: /^Platform/ }).first().click();
            await p.getByRole("button", { name: "iOS", exact: true }).click();
            await p.getByRole("button", { name: "Android", exact: true }).click();
        },
    ],
    [
        "06-filters-saved",
        "view-d?c=c1",
        async (p) => {
            await p.getByRole("button", { name: /^add$/i }).click();
            await p.getByRole("button", { name: /^Platform/ }).first().click();
            await p.getByRole("button", { name: "iOS", exact: true }).click();
            await p.getByRole("button", { name: "Android", exact: true }).click();
            await p.getByRole("button", { name: /^save$/i }).click();
            await p.getByRole("checkbox", { name: "Android" }).click({ force: true });
        },
    ],
    ["07-collapsed", "view-d?c=c1", async (p) => p.getByRole("button", { name: "Collapse", exact: true }).click()],
    ["08-report-table", "view-d?c=c1", async (p) => p.getByRole("radio", { name: /table/i }).click()],
    ["09-by-keyword", "view-d-keywords"],
    ["10-assets", "asset-view"],
    [
        "11-assets-batch",
        "asset-view",
        async (p) => {
            await p.getByRole("button", { name: /actions/i }).click();
            await p.getByText("Batch actions").click();
            const boxes = p.getByRole("checkbox");
            await boxes.nth(1).click({ force: true });
            await boxes.nth(3).click({ force: true });
            // Ticking rows scrolls the page; put it back so the header shows.
            await p.evaluate(() => document.querySelectorAll("*").forEach((el) => el.scrollTop && (el.scrollTop = 0)));
        },
    ],
    ["12-keywords", "keyword-view"],
    ["13-keyword-detail", "keyword-detail"],
    ["14-setup", "setup-empty"],
    ["15-setup-rules", "step-rules"],
    ["16-setup-targeting", "step-targeting"],
    ["17-asset-setup-fields", "asset-setup", async (p) => p.getByRole("textbox", { name: "Creative Name" }).focus()],
    [
        "18-dropdown-open",
        "asset-setup",
        async (p) => {
            await p.getByRole("button", { name: /Ad Type/i }).first().click();
            await p.getByRole("option", { name: "HTML" }).hover();
        },
    ],
    ["19-asset-detail", "asset-detail?a=a1"],
];

const browser = await chromium.launch();
for (const [file, route, act] of SHOTS) {
    // A fresh page per shot: the overview only reads ?c= on load.
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}#/${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    if (act) {
        await act(page);
        await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(out, `${file}.jpg`), type: "jpeg", quality: 82 });
    await page.close();
    console.log(`  ✓ ${file}`);
}
await browser.close();
