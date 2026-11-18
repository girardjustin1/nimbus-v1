import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ITEMS } from "@/pages/transition/data";
import { FINDINGS, STYLES, TOKENS } from "@/pages/transition/round-1-styles";

/**
 * v2 · Round 1: product's list of Nov 17 is applied from one place
 * (src/pages/transition/round-1-styles.ts, re-exported by ./round-1).
 *
 * v1 holds a 15px floor. v2 goes under it only where Round 1 asks for the current style,
 * and only through those tokens: a size under 15px written anywhere else in v2 fails here.
 */

const dir = __dirname;
const files = (readdirSync(dir, { recursive: true }) as string[]).filter((f) => f.endsWith(".tsx") && !f.endsWith("copy-deck-ui.tsx"));
const source = (f: string) =>
    readFileSync(join(dir, f), "utf8")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/\/\/.*$/gm, "");

/** The tokens allowed under 15px, each tied to its Round 1 item. */
const UNDER_FLOOR: Record<string, string> = {
    staffLink: "R1-01",
    pubBadge: "R1-02",
    kmNote: "R1-03",
    smallUpper: "R1-04",
    kmTab: "R1-04",
    rtPlatformLabel: "R1-06",
    rtPlatformValue: "R1-06",
    tableTotal: "R1-08",
    button: "R1-09",
    showActivityLabel: "R1-12",
    checkboxText: "R1-13",
};

describe("v2 · Round 1 styles", () => {
    it("has one style record for every Round 1 change, and no others", () => {
        const changes = ITEMS.filter((i) => i.round === "Round 1").map((i) => i.id);
        expect(STYLES.map((s) => s.id)).toEqual(changes);
    });

    it("has one finding for every Round 1 change, in the same order", () => {
        expect(FINDINGS.map((f) => f.id)).toEqual(STYLES.map((s) => s.id));
    });

    it("goes under 15px only in the tokens tied to a Round 1 item", () => {
        const small = Object.entries(TOKENS)
            .filter(([, v]) => typeof v === "object" && "fontSize" in v && typeof v.fontSize === "number" && v.fontSize < 15)
            .map(([k]) => k)
            .sort();
        expect(small).toEqual(Object.keys(UNDER_FLOOR).sort());
    });

    it("marks every item whose v2 size is under 15px as below the floor", () => {
        const flagged = new Set(STYLES.filter((s) => s.belowFloor).map((s) => s.id));
        // showActivityLabel (R1-12) is staging's own label beside the toggle; R1-12's section labels are 16px.
        for (const [token, id] of Object.entries(UNDER_FLOOR)) if (token !== "showActivityLabel") expect(flagged.has(id), `${token} → ${id}`).toBe(true);
    });

    it("writes no font size under 15px outside the Round 1 tokens", () => {
        const offences = files.flatMap((f) =>
            [...source(f).matchAll(/fontSize:\s*(\d+(?:\.\d+)?)\b|\btext-\[(\d+(?:\.\d+)?)px\]/g)]
                .filter((m) => Number(m[1] ?? m[2]) < 15)
                .map((m) => `${f}: ${m[0]}`),
        );
        expect(offences).toEqual([]);
    });

    it("keeps every number column on the left (R1-15)", () => {
        const ui = source("nimbus-ui.tsx");
        expect(ui).toContain("[&_td]:text-left!");
        expect(ui).toContain("[&_th]:text-left!");
    });
});
