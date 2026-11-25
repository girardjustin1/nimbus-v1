import { describe, expect, it } from "vitest";
import { CONCEPTS } from "../../../../../../src/pages/pi-prototypes/round-2";
import { CONCEPT_GROUP } from "./index";

/** The prototype's screen menu and Storybook's Round 2 page group the concepts the same way. */
describe("Round 2 concept groups", () => {
    it("match Storybook's list", () => {
        for (const c of CONCEPTS) {
            const n = Number(c.id.slice(1));
            expect([c.id, CONCEPT_GROUP[n]]).toEqual([c.id, c.group ?? "control"]);
        }
    });

    it("leave no concept ungrouped except the control", () => {
        expect(CONCEPTS.filter((c) => !c.group).map((c) => c.id)).toEqual(["C0"]);
    });
});
