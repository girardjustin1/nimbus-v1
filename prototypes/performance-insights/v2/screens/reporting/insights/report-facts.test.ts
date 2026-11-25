import { describe, expect, it } from "vitest";
import { matchQuestion } from "./assistant-questions";
import { DATA_TODAY, customRange, metricOf, rangeDays, runQuery } from "./insights-data";
import { changeOf, moversBy, reportFacts, rowsBy } from "./report-facts";

/** Round 2 · C14 and C15 quote only figures worked out from the report's own data. */
describe("Round 2 report facts", () => {
    it("the revenue change is the report's total against the same span before it", () => {
        const r = runQuery({ range: "7", interval: "day", breakdown: [], excluded: {}, totalsOnly: true, compare: 7 })[0];
        const c = changeOf("Revenue", "7", {});
        expect(c.now).toBeCloseTo(metricOf("Revenue", r.t));
        expect(c.before).toBeCloseTo(metricOf("Revenue", r.prev!));
        expect(c.change).toBeCloseTo((c.now - c.before) / c.before);
    });

    it.each(["Platform", "Ad Type", "Country", "Demand Source"] as const)("%s adds up to the total for every count, and its shares to 1", (dim) => {
        for (const m of ["Requests", "Wins", "Impressions", "Revenue", "Clicks"] as const) {
            const rows = rowsBy(dim, m, "7", {});
            const total = changeOf(m, "7", {}).now;
            expect(rows.reduce((n, r) => n + r.now, 0) / total).toBeCloseTo(1, 9);
        }
        expect(rowsBy(dim, "Revenue", "7", {}).reduce((n, r) => n + r.share, 0)).toBeCloseTo(1);
    });

    it("filters change the facts (a filtered report gets its own answer)", () => {
        const all = changeOf("Revenue", "7", {}).now;
        const ios = changeOf("Revenue", "7", { Platform: ["Android"] }).now;
        expect(ios).toBeLessThan(all);
    });

    it("movers are ranked by the size of their change", () => {
        const m = moversBy("Demand Source", "Revenue", "7", {}, 3);
        const size = m.map((r) => Math.abs(r.now - r.before));
        expect([...size].sort((a, b) => b - a)).toEqual(size);
    });

    it("the notes beside the chart say what changed, without advice", () => {
        const facts = reportFacts("7", {});
        expect(facts.length).toBeGreaterThanOrEqual(3);
        expect(facts.map((f) => `${f.title} ${f.detail}`).join(" ")).not.toMatch(/\b(should|try|consider|recommend|we suggest)\b/i);
    });
});

describe("Round 2 assistant questions", () => {
    it("matches typed questions to the three it answers, and nothing else", () => {
        expect(matchQuestion("Which country makes the most money?")).toBe("countries");
        expect(matchQuestion("why is fill so low")).toBe("fill");
        expect(matchQuestion("Why did revenue drop?")).toBe("revenue");
        expect(matchQuestion("what's the weather")).toBeNull();
    });
});

describe("Round 2 custom date ranges (C16's date picker)", () => {
    it("a custom range covers every day from start to end", () => {
        expect(rangeDays(customRange("2026-11-01", "2026-11-10"))).toHaveLength(10);
        expect(rangeDays(customRange("2026-10-30", "2026-11-02"))).toEqual(["2026-10-30", "2026-10-31", "2026-11-01", "2026-11-02"]);
    });

    it("a range that matches a preset becomes the preset", () => {
        const d7 = rangeDays("7");
        expect(customRange(d7[0], d7[6])).toBe("7");
        expect(customRange(rangeDays("yesterday")[0], rangeDays("yesterday")[0])).toBe("yesterday");
        expect(d7[6]).toBe(DATA_TODAY);
    });

    it("compare reaches back the length of a custom range", () => {
        expect(changeOf("Revenue", customRange("2026-11-01", "2026-11-10"), {}).before).toBeGreaterThan(0);
    });
});
