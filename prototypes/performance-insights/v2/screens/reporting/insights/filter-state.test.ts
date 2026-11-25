import { describe, expect, it } from "vitest";
import { SEARCH_CAP, bandCounts, bandExcluded, searchValues } from "./filter-state";
import { LONG_ADVERTISERS, NOT_SENT, TOP_ADVERTISERS } from "./long-lists";

/** Round 2 · the filter band's rules (engineering's model: chips are not the query). */
const DIMS = [
    { id: "Country", label: "Country", values: ["US", "CA", "UK"] },
    { id: "Ad Type", label: "Ad Type", values: ["Static", "Video", "Native"] },
];

describe("Round 2 filter band", () => {
    it("leaves out every value that isn't chosen and on", () => {
        expect(bandExcluded(DIMS, { Country: { values: ["US", "CA"], off: ["CA"] } })).toEqual({ Country: ["CA", "UK"], "Ad Type": [] });
    });

    it("a paused category (every chip unchecked) filters nothing, rather than everything", () => {
        expect(bandExcluded(DIMS, { "Ad Type": { values: ["Static", "Video"], off: ["Static", "Video"] } })["Ad Type"]).toEqual([]);
    });

    it("no chips, no filtering", () => {
        expect(bandExcluded(DIMS, {})).toEqual({ Country: [], "Ad Type": [] });
    });

    it("counts chips on the row apart from the ones the report uses", () => {
        expect(bandCounts({ Country: { values: ["US", "CA", "UK"], off: ["UK"] }, "Ad Type": { values: ["Video"], off: [] } })).toEqual({
            chips: 4,
            applied: 3,
        });
    });
});

describe("Round 2 search first (C8)", () => {
    const advertiser = { values: LONG_ADVERTISERS, top: TOP_ADVERTISERS };

    it("has a long list of unique, fictional advertisers, “not sent” among the top", () => {
        expect(LONG_ADVERTISERS.length).toBeGreaterThan(1000);
        expect(new Set(LONG_ADVERTISERS).size).toBe(LONG_ADVERTISERS.length);
        expect(LONG_ADVERTISERS.every((v) => v === NOT_SENT || /\.example(\.com)?$/.test(v))).toBe(true);
        expect(TOP_ADVERTISERS).toContain(NOT_SENT);
    });

    it("opens on the top values only", () => {
        expect(searchValues(advertiser, "")).toEqual({ values: TOP_ADVERTISERS, more: 0 });
    });

    it("caps matches and counts the rest", () => {
        const r = searchValues(advertiser, "sport");
        const all = LONG_ADVERTISERS.filter((v) => v.includes("sport"));
        expect(r.values).toHaveLength(SEARCH_CAP);
        expect(r.more).toBe(all.length - SEARCH_CAP);
    });

    it("a short list shows every match, uncapped", () => {
        expect(searchValues({ values: ["United States", "United Kingdom", "Canada"] }, "united").values).toEqual(["United States", "United Kingdom"]);
    });
});
