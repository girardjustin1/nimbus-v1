import type { FilterDim, FilterState } from "../../nimbus-ui";

/** Round 2 · the two looks of the filter band concepts (see ./filter-band.tsx). */
export type BandLook = "tight" | "chips";

/**
 * What the band leaves out of the report, per category. A category with every value
 * unchecked is paused: it leaves nothing out, rather than everything.
 */
export const bandExcluded = (dims: FilterDim[], state: FilterState): Record<string, string[]> =>
    Object.fromEntries(
        dims.map((d) => {
            const f = state[d.id];
            if (!f?.values.length) return [d.id, []];
            const kept = f.values.filter((v) => !f.off.includes(v));
            if (kept.length === 0) return [d.id, []];
            return [d.id, d.values.filter((v) => !kept.includes(v))];
        }),
    );

/** Chips on the row, and how many of them the report is using. */
export const bandCounts = (state: FilterState) => {
    const all = Object.values(state).flatMap((f) => f.values);
    const off = Object.values(state).flatMap((f) => f.off);
    return { chips: all.length, applied: all.length - off.length };
};

