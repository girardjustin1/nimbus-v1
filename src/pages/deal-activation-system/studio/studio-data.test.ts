import { describe, expect, it } from "vitest";
import { nextMonth } from "../dates";
import { estimate, flightDays, formats, studioPresets, validateDraft } from "./studio-data";

describe("DAS Studio estimates", () => {
    it("rates the sample draft as likely to deliver", () => {
        expect(estimate(studioPresets.sample).likelihood).toBe("High");
    });

    it("drops likelihood when the bid is below the recommended range", () => {
        expect(estimate(studioPresets.lowBid).likelihood).not.toBe("High");
    });

    it("drops likelihood when the audience is narrowed to ALL of several keywords on one app", () => {
        expect(estimate(studioPresets.narrow).impressions[1]).toBeLessThan(estimate(studioPresets.sample).impressions[1]);
        expect(estimate(studioPresets.narrow).likelihood).toBe("Low");
    });

    it("has no eCPM or spend for fallback campaigns", () => {
        const e = estimate(studioPresets.fallback);
        expect(e.ecpm).toEqual([0, 0]);
        expect(e.dailySpend).toBe(0);
    });

    it("counts both flight days inclusively (the sample runs all of next month)", () => {
        const { start, end } = nextMonth();
        expect(flightDays(studioPresets.sample)).toBe(end.day - start.day + 1);
    });

    it("keeps every format's recommended range ordered", () => {
        for (const f of formats) expect(f.bid[0]).toBeLessThan(f.bid[1]);
    });
});

describe("DAS Studio validation", () => {
    it("passes the sample draft", () => {
        expect(validateDraft(studioPresets.sample)).toEqual([]);
    });

    it("flags the missing end date and artwork on the incomplete draft", () => {
        expect(validateDraft(studioPresets.incomplete).map((i) => i.text)).toEqual(["Pick an end date", "Upload an image"]);
    });

    it("doesn't ask fallback campaigns for a budget or bid", () => {
        expect(validateDraft(studioPresets.fallback)).toEqual([]);
    });

    it("asks rewarded video for a video, not an image", () => {
        const d = { ...studioPresets.rewarded, creative: { ...studioPresets.rewarded.creative, video: undefined } };
        expect(validateDraft(d).map((i) => i.text)).toContain("Upload a video");
    });
});
