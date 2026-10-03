import { describe, expect, it } from "vitest";
import { allSeedAssets } from "./asset-data";
import { deals } from "./deal-data";
import { allKeywords } from "./keyword-data";
import { APP_LIST } from "./target-data";

/**
 * Round 3 replaced four browse-and-scroll controls with type-aheads, and a type-ahead
 * makes a promise the old controls didn't: whatever you type, it tells you the truth
 * about what is there. A library that cannot answer the first keystroke breaks that
 * promise in the most confusing way available — it looks like the search is broken
 * rather than like the letter is unused.
 *
 * Four libraries have to hold that line, and every one of them was failing it before
 * anyone looked: each deal was "Test Deal — …", each asset "SampleApp_…", the keywords
 * had no k, l, q, u, v, x or z, and the apps were missing ten letters. These are the
 * tests that notice when the next edit quietly undoes it.
 */

const ALPHABET = [..."abcdefghijklmnopqrstuvwxyz"];

/** The picker's own filter: name plus secondary line, case-insensitive substring. */
const missingInitials = (labels: string[]) => {
    const initials = new Set(labels.map((l) => l[0].toLowerCase()));
    return ALPHABET.filter((c) => !initials.has(c));
};

const missingMatches = (haystacks: string[]) =>
    ALPHABET.filter((c) => !haystacks.some((h) => h.toLowerCase().includes(c)));

describe("deals", () => {
    it("has fifty, with unique ids", () => {
        expect(deals).toHaveLength(50);
        expect(new Set(deals.map((d) => d.id)).size).toBe(50);
    });

    it("keeps Round 1's three ids, in order, so demo fill still resolves", () => {
        expect(deals.slice(0, 3).map((d) => d.id)).toEqual(["D-10482", "D-10517", "D-10533"]);
    });

    it("starts one with every letter, and matches something for every letter typed", () => {
        expect(missingInitials(deals.map((d) => d.label))).toEqual([]);
        expect(missingMatches(deals.map((d) => `${d.label} ${d.supportingText}`))).toEqual([]);
    });
});

describe("keywords", () => {
    const keywords = allKeywords();

    it("has fifty, with no repeated value", () => {
        expect(keywords).toHaveLength(50);
        // A keyword is the literal string an app puts on the bid request. Two rows for
        // one value is not a duplicate row, it is a contradiction.
        expect(new Set(keywords.map((k) => k.value)).size).toBe(50);
    });

    it("starts one with every letter", () => {
        expect(missingInitials(keywords.map((k) => k.value))).toEqual([]);
    });
});

describe("apps", () => {
    it("has every app on both platforms, with unique ids", () => {
        expect(APP_LIST).toHaveLength(52);
        expect(new Set(APP_LIST.map((a) => a.id)).size).toBe(52);
        expect(new Set(APP_LIST.map((a) => a.name)).size).toBe(26);
    });

    it("starts one with every letter", () => {
        expect(missingInitials(APP_LIST.map((a) => a.name))).toEqual([]);
    });

    it("matches something for every letter typed, name or bundle", () => {
        expect(missingMatches(APP_LIST.map((a) => `${a.name} ${a.platform} ${a.bundle}`))).toEqual([]);
    });
});

describe("assets", () => {
    const assets = allSeedAssets();

    it("has fifty, with unique names and ids", () => {
        expect(assets).toHaveLength(50);
        expect(new Set(assets.map((a) => a.name)).size).toBe(50);
        expect(new Set(assets.map((a) => a.id)).size).toBe(50);
    });

    it("keeps Round 1's five, so seeded campaigns still point at something real", () => {
        const names = assets.map((a) => a.name);
        for (const n of ["SampleApp_Interstitial_A", "SampleApp_Interstitial_B", "SampleApp_Video_15s", "SampleApp_MREC_Garden", "SampleApp_Banner_Legacy"]) {
            expect(names).toContain(n);
        }
    });

    it("starts one with every letter", () => {
        expect(missingInitials(assets.map((a) => a.name))).toEqual([]);
    });

    it("gives every asset a size its type allows", () => {
        for (const a of assets) {
            if (a.type === "VAST (xml)") expect(a.size, a.name).toBe("N/A");
            else expect(["Full screen", "Medium Rectangle", "Banner", "Invalid"], a.name).toContain(a.size);
        }
    });
});
