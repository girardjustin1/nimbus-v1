import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { demandTotals, pivot, revenueByDay } from "./performance-insights/v1/screens/pi-data";

/**
 * Guards the standalone-prototype layout: every version listed in a prototype's
 * versions.ts must exist as a buildable folder, and "latest" must point at one.
 */

const root = path.dirname(fileURLToPath(import.meta.url));
const prototypeNames = readdirSync(root).filter((name) => existsSync(path.join(root, name, "versions.ts")));

describe("prototype registry", () => {
    it("finds both prototypes", () => {
        expect(prototypeNames.sort()).toEqual(["das", "performance-insights"]);
    });

    describe.each(prototypeNames)("%s", (name) => {
        it("has a folder with index.html, main.tsx and screens.tsx for every listed version", async () => {
            const { versions, latest } = await import(`./${name}/versions.ts`);
            expect(versions.length).toBeGreaterThan(0);
            expect(versions.map((v: { id: string }) => v.id)).toContain(latest);
            for (const v of versions) {
                for (const file of ["index.html", "main.tsx", "screens.tsx"]) {
                    expect(existsSync(path.join(root, name, v.id, file)), `${name}/${v.id}/${file}`).toBe(true);
                }
                // Each version's entry point must declare itself as that version.
                expect(readFileSync(path.join(root, name, v.id, "main.tsx"), "utf8")).toContain(`meta("${v.id}")`);
            }
        });

        it("has a redirect page at the prototype root", () => {
            expect(readFileSync(path.join(root, name, "index.html"), "utf8")).toContain("latest");
        });

        it("has unique screen ids in every version", async () => {
            const { versions } = await import(`./${name}/versions.ts`);
            for (const v of versions) {
                const source = readFileSync(path.join(root, name, v.id, "screens.tsx"), "utf8");
                const ids = [...source.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
                expect(ids.length).toBeGreaterThan(0);
                expect(new Set(ids).size, `${name}/${v.id} duplicate screen id`).toBe(ids.length);
            }
        });
    });
});

describe("Performance Insights v1 sample data", () => {
    it("weekly totals equal the sum of daily revenue per demand source", () => {
        for (const row of demandTotals) {
            const sum = revenueByDay.reduce((s, d) => s + Number(d[row.source as keyof (typeof revenueByDay)[number]]), 0);
            expect(sum).toBe(row.revenue);
        }
    });

    it("pivot child rows add up to their parent app row", () => {
        for (const app of pivot.filter((a) => a.children.length)) {
            app.values.forEach((value, week) => {
                expect(app.children.reduce((s, c) => s + c.values[week], 0)).toBe(value);
            });
        }
    });
});
