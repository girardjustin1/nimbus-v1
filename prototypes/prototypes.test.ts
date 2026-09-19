import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildPivot, dimensionValues, facts, metricValue } from "./performance-insights/v1/screens/explorer-data";
import { demandTotals, pivot, revenueByDay } from "./performance-insights/v1/screens/pi-data";
import { daysAgo, hasEnded, savedQueryList } from "./performance-insights/v1/screens/sq-data";

/**
 * Guards the standalone-prototype layout: every version listed in a prototype's
 * versions.ts must exist as a buildable folder, and "latest" must point at one.
 */

const root = path.dirname(fileURLToPath(import.meta.url));
const prototypeNames = readdirSync(root).filter((name) => existsSync(path.join(root, name, "versions.ts")));

describe("prototype registry", () => {
    it("finds every prototype", () => {
        expect(prototypeNames.sort()).toEqual(["das", "das-studio", "performance-insights"]);
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

describe("Performance Insights explorer", () => {
    it("has one fact per App × Demand Source × Country × Ad Unit × Week", () => {
        const n = (Object.keys(dimensionValues) as (keyof typeof dimensionValues)[])
            .filter((d) => !["Platform", "Month"].includes(d))
            .reduce((acc, d) => acc * dimensionValues[d].length, 1);
        expect(facts.length).toBe(n);
    });

    it("child rows add up to their parent, and the grand total matches any layout", () => {
        const a = buildPivot({ rows: ["App", "Demand Source"], columns: ["Week"], values: ["Revenue"], filters: {} });
        const b = buildPivot({ rows: ["Country"], columns: [], values: ["Revenue"], filters: {} });
        for (const app of a.rows) {
            const sum = app.children.reduce((s, c) => s + c.total.revenue, 0);
            expect(sum).toBeCloseTo(app.total.revenue, 6);
        }
        expect(a.grand.total.revenue).toBeCloseTo(b.grand.total.revenue, 6);
    });

    it("derives rate metrics after aggregation", () => {
        const { grand } = buildPivot({ rows: [], columns: [], values: ["eCPM"], filters: {} });
        expect(metricValue("eCPM", grand.total)).toBeCloseTo((grand.total.revenue / grand.total.impressions) * 1000, 9);
        expect(metricValue("Fill Rate", grand.total)).toBeLessThan(1);
    });

    it("filters shrink the data", () => {
        const all = buildPivot({ rows: [], columns: [], values: ["Revenue"], filters: {} });
        const us = buildPivot({ rows: [], columns: [], values: ["Revenue"], filters: { Country: ["United States"] } });
        expect(us.factCount).toBe(all.factCount / dimensionValues.Country.length);
        expect(us.grand.total.revenue).toBeLessThan(all.grand.total.revenue);
    });
});

describe("Saved Queries sample data", () => {
    it("has unique ids and nothing created in the future", () => {
        expect(new Set(savedQueryList.map((q) => q.id)).size).toBe(savedQueryList.length);
        for (const q of savedQueryList) expect(daysAgo(q.created)).toBeGreaterThanOrEqual(0);
    });

    it("the weekly exec summary trend adds up to its revenue KPI", () => {
        const exec = savedQueryList.find((q) => q.id === "exec")!;
        expect(exec.trend.reduce((a, b) => a + b, 0)).toBe(exec.kpis[0].value);
    });

    it("includes ended fixed ranges for the stale-range states", () => {
        expect(savedQueryList.filter((q) => hasEnded(q.range)).length).toBeGreaterThanOrEqual(2);
    });
});
