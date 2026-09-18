import { describe, expect, it } from "vitest";
import { createTagEntries, reconcileTagEntries } from "./tag-entries";

const num = (n: number) => n;
const str = (n: number) => `tag-${n}`;

describe("createTagEntries", () => {
    it("assigns sequential ids and records the next id", () => {
        const state = createTagEntries(["a", "b"], num);
        expect(state.entries).toEqual([
            { id: 0, label: "a" },
            { id: 1, label: "b" },
        ]);
        expect(state.nextId).toBe(2);
    });

    it("supports string ids (InputTagsOuter)", () => {
        expect(createTagEntries(["a"], str).entries[0].id).toBe("tag-0");
    });
});

describe("reconcileTagEntries", () => {
    const start = createTagEntries(["a", "b", "c"], num, ["a", "b", "c"]);

    it("keeps ids for labels still present and gives new labels new ids", () => {
        const next = reconcileTagEntries(start, ["b", "c", "d"], num);
        expect(next.entries).toEqual([
            { id: 1, label: "b" },
            { id: 2, label: "c" },
            { id: 3, label: "d" },
        ]);
        expect(next.nextId).toBe(4);
    });

    it("keeps ids when tags are reordered", () => {
        const next = reconcileTagEntries(start, ["c", "a", "b"], num);
        expect(next.entries.map((e) => e.id)).toEqual([2, 0, 1]);
    });

    it("matches duplicate labels one-to-one", () => {
        const dupes = createTagEntries(["x", "x"], num, ["x", "x"]);
        const next = reconcileTagEntries(dupes, ["x", "x", "x"], num);
        expect(next.entries.map((e) => e.id)).toEqual([0, 1, 2]);
    });

    it("records the value it was built from and never mutates the previous state", () => {
        const value = ["a"];
        const next = reconcileTagEntries(start, value, num);
        expect(next.source).toBe(value);
        expect(start.entries).toHaveLength(3);
        expect(start.nextId).toBe(3);
    });
});
