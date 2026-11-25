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

/** Staging draws at most this many values in a list (25 Nov); search reaches the rest. */
export const LIST_CAP = 1000;

/** C8: how many matches a search-first list shows at once. */
export const SEARCH_CAP = 50;

/**
 * The values a panel lists for a search. A search-first category (`top` set) opens on its
 * top values and caps matches at SEARCH_CAP, counting the rest; a short list shows every match.
 */
export const searchValues = (dim: { values: string[]; top?: string[] }, query: string): { values: string[]; more: number } => {
    const q = query.trim().toLowerCase();
    // Without top values a list is drawn as staging draws it: at most LIST_CAP, search for the rest.
    const capped = (all: string[]) => ({ values: all.slice(0, LIST_CAP), more: Math.max(0, all.length - LIST_CAP) });
    if (!q) return dim.top ? { values: dim.top, more: 0 } : capped(dim.values);
    const matches = dim.values.filter((v) => v.toLowerCase().includes(q));
    if (!dim.top) return capped(matches);
    return { values: matches.slice(0, SEARCH_CAP), more: Math.max(0, matches.length - SEARCH_CAP) };
};
