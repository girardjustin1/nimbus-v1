import { describe, expect, it } from "vitest";
import { campaigns, keywords } from "./das-data";
import { paceOf } from "./das-shell";

describe("paceOf", () => {
    const at = (spend: number, flightElapsed: number, budget = 1000) => paceOf({ budget, spend, flightElapsed });

    it("is on track within ±10% of the elapsed flight", () => {
        expect(at(500, 50)).toBe("on track");
        expect(at(460, 50)).toBe("on track");
        expect(at(540, 50)).toBe("on track");
    });

    it("flags behind and ahead outside that band", () => {
        expect(at(440, 50)).toBe("behind");
        expect(at(560, 50)).toBe("ahead");
    });

    it("handles campaigns with no budget or no elapsed flight", () => {
        expect(at(0, 40, 0)).toBe("no budget");
        expect(at(0, 0)).toBe("not started");
    });
});

describe("DAS sample data", () => {
    it("shows one running campaign behind pace (drives the KPI strip)", () => {
        const behind = campaigns.filter((c) => c.status === "Running" && paceOf(c) === "behind");
        expect(behind.map((c) => c.id)).toEqual(["c2"]);
    });

    it("keeps impressions consistent with spend and eCPM", () => {
        for (const c of campaigns.filter((c) => c.ecpm > 0)) {
            expect(Math.abs(c.impressions - (c.spend / c.ecpm) * 1000)).toBeLessThanOrEqual(1);
        }
    });

    it("stores keywords lower-case and unique (matching is case-insensitive)", () => {
        const values = keywords.map((k) => k.value);
        expect(values.every((v) => v === v.toLowerCase())).toBe(true);
        expect(new Set(values).size).toBe(values.length);
    });

    it("never counts more live campaigns than total campaigns for a keyword", () => {
        for (const k of keywords) expect(k.liveCampaigns).toBeLessThanOrEqual(k.campaigns);
    });
});
