// Captures the prototype v6 screens shown in Storybook › Oct 29 Edits › Introduction.
//
//   npm run proto:dev            (in another terminal; serves :5190)
//   node scripts/capture-oct-29-screens.mjs
//
// Re-run after any change to v6 so the review guide shows what Product will see.
// Writes JPEGs to src/pages/oct-29/screens/.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "src/pages/oct-29/screens");
const base = process.env.PROTO_URL ?? "http://localhost:5190/das/v6/";
mkdirSync(out, { recursive: true });

/** [file, route, optional interaction, optional full-page] */
const SHOTS = [
    ["01-campaigns", "campaigns"],
    ["02-campaigns-sorted", "campaigns-pacing-sorted"],
    [
        "03-true-up",
        "campaigns",
        async (p) => {
            // react-aria opens tooltips on real pointer movement, not a synthetic hover.
            const box = await p.getByRole("button", { name: "Total spend" }).boundingBox();
            await p.mouse.move(box.x - 40, box.y + box.height / 2);
            await p.mouse.move(box.x + box.width - 8, box.y + box.height / 2, { steps: 8 });
            await p.waitForTimeout(900);
        },
    ],
    ["04-lifecycle", "campaigns-lifecycle", null, true],
    ["05-overview-at-risk", "view-a-at-risk"],
    ["06-overview-on-target", "view-a"],
    ["07-fp-metrics", "view-d-new-metrics"],
    ["08-fp-region-country", "view-d-region-country"],
    ["09-overview-complete", "view-a-complete"],
];

const browser = await chromium.launch();
for (const [file, route, act, fullPage] of SHOTS) {
    // A fresh page per shot: the overview only reads ?c= on load.
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}#/${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(700);
    if (act) {
        await act(page);
        await page.waitForTimeout(500);
    }
    await page.screenshot({ path: path.join(out, `${file}.jpg`), type: "jpeg", quality: 82, fullPage: !!fullPage });
    await page.close();
    console.log(`  ✓ ${file}`);
}
await browser.close();
