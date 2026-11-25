import { describe, expect, it } from "vitest";
import { AUCTION_FIELDS, STAGING_FIELDS } from "./field-set";
import { DIM_VALUES, METRIC_DEFINITIONS, NEW_DIMS, NEW_METRICS, UNIT, VALUE_TAGS, metricOf } from "./insights-data";

const T = { requests: 1e6, wins: 2.5e5, impressions: 2e5, revenue: 1000, clicks: 2000, bid: 1e6, floor: 86000 };

describe("v2 · Round 2 field sets (25 Nov)", () => {
    it("keeps C0 on staging's 13 metrics and 28 breakdowns", () => {
        expect(STAGING_FIELDS.metrics).toHaveLength(13);
        expect(STAGING_FIELDS.dims).toHaveLength(28);
        for (const m of NEW_METRICS) expect(STAGING_FIELDS.metrics).not.toContain(m);
        for (const d of NEW_DIMS) expect(STAGING_FIELDS.dims).not.toContain(d);
    });

    it("gives the concepts staging's fields plus the auction traffic spec's", () => {
        expect(AUCTION_FIELDS.metrics).toEqual([...STAGING_FIELDS.metrics, ...NEW_METRICS]);
        expect([...AUCTION_FIELDS.dims].sort()).toEqual([...STAGING_FIELDS.dims, ...NEW_DIMS].sort());
    });

    it("gives every new metric a unit, a definition and a finite value", () => {
        for (const m of NEW_METRICS) {
            expect(UNIT[m]).toBeDefined();
            expect(METRIC_DEFINITIONS[m]).toBeTruthy();
            expect(Number.isFinite(metricOf(m, T))).toBe(true);
        }
    });

    it("gives every new breakdown sample values, tags only from the spec's three", () => {
        for (const d of NEW_DIMS) {
            expect(DIM_VALUES[d].length).toBeGreaterThan(1);
            for (const v of DIM_VALUES[d]) if (["Unknown", "Unavailable", "Other"].includes(v)) expect(VALUE_TAGS[v]).toBeTruthy();
        }
    });
});
