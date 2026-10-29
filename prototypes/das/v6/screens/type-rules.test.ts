import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Prototype 3's type rules (./type-rules, documented in Storybook › Audits › Typography
 * Rules): nothing under 15px. This keeps the classes that would break it out of v3.
 */
const dir = __dirname;
// Prototype chrome, not product UI: the Copy switch sits in the dark prototype toolbar
// and matches its 12px controls (an exception on the Typography Rules page).
const CHROME = new Set(["copy-deck-ui.tsx"]);
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && !CHROME.has(f));

const offences = (pattern: RegExp) =>
    files.flatMap((f) => {
        const src = readFileSync(join(dir, f), "utf8")
            // Comments may name the classes they are avoiding.
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/\/\/.*$/gm, "");
        return [...src.matchAll(pattern)].map((m) => `${f}: ${m[0].slice(0, 60)}`);
    });

describe("Prototype 3 type rules", () => {
    it("uses no text-xs or text-sm", () => {
        expect(offences(/\btext-(xs|sm|xxs)\b(?![-/])/g)).toEqual([]);
    });

    it("uses no pixel font size under 15px", () => {
        const small = offences(/\btext-\[(\d+(?:\.\d+)?)px\]/g).filter((o) => Number(o.match(/\[(\d+(?:\.\d+)?)px\]/)![1]) < 15);
        expect(small).toEqual([]);
    });

    it("never renders an Input at size sm (13px)", () => {
        expect(offences(/<Input\b[^>]*?\bsize="sm"/g)).toEqual([]);
    });
});
