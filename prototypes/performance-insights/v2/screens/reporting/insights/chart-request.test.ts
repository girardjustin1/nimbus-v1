import { describe, expect, it } from "vitest";
import { parseRequest } from "./chart-request";
import { rangeDays } from "./insights-data";

/** Round 2 · C16's chat reads a chart request into a query, and lists back what it read. */
describe("C16 chart requests", () => {
    it("reads metrics, breakdown, dates, compare and chart", () => {
        const r = parseRequest("Revenue and eCPM by country for the last 30 days, compared, as a bar chart")!;
        expect(r.change.metrics).toEqual(["Revenue", "ECPM"]);
        expect(r.change.breakdown).toEqual(["Country"]);
        expect(r.change.range).toBe("30");
        expect(r.change.compare).toBe(true);
        expect(r.change.chart).toBe("bar");
    });

    it("reads “win rate” as Win Rate, not Wins, and filter values named in the request", () => {
        const r = parseRequest("win rate and fill by ad type on iOS")!;
        expect(r.change.metrics).toEqual(["Win Rate", "Fill Rate"]);
        expect(r.change.breakdown).toEqual(["Ad Type"]);
        expect(r.change.filters).toEqual({ Platform: { values: ["iOS"], off: [] } });
    });

    it("reads two breakdowns and a custom number of days", () => {
        const r = parseRequest("impressions per demand source and platform over the past 10 days")!;
        expect(r.change.breakdown).toEqual(["Demand Source", "Platform"]);
        expect(rangeDays(r.change.range!)).toHaveLength(10);
    });

    it("totals only when no breakdown is named", () => {
        expect(parseRequest("clicks and CTR yesterday as a table")!.change).toMatchObject({ metrics: ["Clicks", "CTR"], breakdown: [], range: "yesterday", chart: "table" });
    });

    it("finds nothing to build in a request with no metric or breakdown", () => {
        expect(parseRequest("make it look nicer")).toBeNull();
    });
});
