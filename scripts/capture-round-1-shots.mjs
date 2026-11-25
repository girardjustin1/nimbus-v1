// Captures the before and after pictures for Storybook › Transition › Round 1 › Before and after:
// the same element of the full application in v1 (before Round 1) and v2 (staging's styles).
//
//   npm run proto:dev            (in another terminal; serves :5195)
//   node scripts/capture-round-1-shots.mjs
//
// Both versions use sample data only, so the pictures are safe for the public Storybook.
// Staging itself is never pictured here: its screens hold real accounts and figures.
// Writes JPEGs to src/pages/transition/round-1/shots/<item>-<n>-<version>.jpg.
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "src/pages/transition/round-1/shots");
const BASE = "http://localhost:5195/app";

/**
 * One picture per entry. `find` runs in the page and returns the element to frame;
 * `width` / `height` cap the frame; `hover` names the text to hover first.
 */
const SHOTS = [
    { id: "R1-01", n: 1, screen: "realtime", find: () => document.querySelector('nav[aria-label="Nimbus admin"]'), width: 1000 },
    { id: "R1-02", n: 1, screen: "realtime", find: () => document.querySelector("main > header") },
    { id: "R1-03", n: 1, screen: "key-metrics", find: () => document.querySelector("main section") , height: 260 },
    { id: "R1-03", n: 2, screen: "key-metrics", find: () => document.querySelectorAll("main section")[1] },
    { id: "R1-04", n: 1, screen: "realtime", find: () => [...document.querySelectorAll("main div")].find((d) => d.parentElement?.className.includes("divide-y")), width: 460 },
    { id: "R1-04", n: 2, screen: "setup-empty", find: () => [...document.querySelectorAll("main section")].find((s) => /^Deal/.test(s.innerText.trim())), height: 260 },
    { id: "R1-05", n: 1, screen: "realtime", find: () => document.querySelector("main .gap-y-4.py-6"), width: 760 },
    { id: "R1-06", n: 1, screen: "realtime", find: () => document.querySelector("main .gap-y-4.py-6"), width: 760 },
    { id: "R1-07", n: 1, screen: "setup-empty", find: () => [...document.querySelectorAll("main section")].find((s) => /^Campaign Name/.test(s.innerText.trim())), height: 200 },
    { id: "R1-08", n: 1, screen: "realtime-table", find: () => document.querySelector("tfoot"), above: 100 },
    { id: "R1-09", n: 1, screen: "realtime", find: () => [...document.querySelectorAll("main button")].find((b) => /download/i.test(b.textContent))?.parentElement },
    { id: "R1-10", n: 1, screen: "pi-query", find: () => [...document.querySelectorAll("main button")].find((b) => /save query/i.test(b.textContent))?.parentElement },
    { id: "R1-11", n: 1, screen: "realtime", find: () => document.querySelector("main .divide-y") },
    { id: "R1-12", n: 1, screen: "realtime", find: () => [...document.querySelectorAll("main div")].filter((d) => d.parentElement?.className.includes("divide-y"))[2] },
    { id: "R1-13", n: 1, screen: "realtime", find: () => [...document.querySelectorAll("main div")].filter((d) => d.parentElement?.className.includes("divide-y"))[1] },
    { id: "R1-14", n: 1, screen: "key-metrics", find: () => document.querySelectorAll("main section p")[0]?.parentElement, height: 140 },
    { id: "R1-15", n: 1, screen: "realtime-table", find: () => document.querySelector("main table"), height: 200 },
    { id: "R1-16", n: 1, screen: "setup-empty", find: () => [...document.querySelectorAll("main section")].find((s) => /^Deal/.test(s.innerText.trim())), height: 260, hover: "Generate new ID" },
    { id: "R1-16", n: 2, screen: "setup-empty", find: () => [...document.querySelectorAll("main section")].find((s) => /^Auction Rules/.test(s.innerText.trim())), height: 260, hover: "CPM Priority" },
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });

for (const version of ["v1", "v2"]) {
    for (const shot of SHOTS) {
        await page.goto(`${BASE}/${version}/#/${shot.screen}`, { waitUntil: "networkidle" });
        await page.waitForTimeout(1200);
        // The prototype's own toolbar is chrome, not product, and the sidebar's collapse button hangs over
        // the edge of the page: hide both so neither sits over a frame.
        await page.addStyleTag({ content: "div.sticky.top-0.z-50, button[aria-label=\"Collapse navigation\"] { display: none !important; }" });
        const handle = await page.evaluateHandle(shot.find);
        const el = handle.asElement();
        if (!el) throw new Error(`${version} ${shot.id}-${shot.n}: element not found on #/${shot.screen}`);
        if (shot.hover) {
            await el.evaluate((e) => e.scrollIntoView({ block: "center" }));
            await page.getByText(shot.hover, { exact: true }).first().hover();
            await page.waitForTimeout(400);
        } else {
            await page.mouse.move(2, 2);
        }
        // Frame in page coordinates, so an element anywhere on the page can be pictured whole.
        const box = await el.evaluate((e) => {
            const r = e.getBoundingClientRect();
            return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
        });
        // Exactly the element's box (plus `above`), so neighbouring chrome never shows at the edges.
        const top = Math.max(0, box.y - (shot.above ?? 0));
        const clip = {
            x: box.x,
            y: top,
            width: Math.min(box.width, shot.width ?? 1440, 1440 - box.x),
            height: Math.min(box.y + box.height - top, shot.height ?? 1000),
        };
        const file = path.join(OUT, `${shot.id.toLowerCase()}-${shot.n}-${version}.jpg`);
        await page.screenshot({ path: file, clip, fullPage: !shot.hover, type: "jpeg", quality: 82 });
        console.log(`${version} ${shot.id}-${shot.n}  ${Math.round(clip.width)}×${Math.round(clip.height)}`);
    }
}
await browser.close();
