import { describe, expect, it } from "vitest";
import { bandCounts, bandExcluded } from "./filter-state";

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
        expect(bandCounts({ Country: { values: ["US", "CA", "UK"], off: ["UK"] }, "Ad Type": { values: ["Video"], off: [] } })).toEqual({ chips: 4, applied: 3 });
    });
});
