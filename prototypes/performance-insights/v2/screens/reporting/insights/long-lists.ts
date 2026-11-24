import { DIM_VALUES } from "./insights-data";

/**
 * Round 2 · C8: a long Advertiser list, as a publisher sees it (the PI sync: thousands of
 * advertisers, many requests naming none). Fictional throughout: made-up names on the
 * reserved .example domain. Only the list is long: the report's own sample data keeps its
 * five advertisers, which lead the list as the top values.
 */

const A = [
    "blue",
    "bright",
    "city",
    "daily",
    "fresh",
    "golden",
    "green",
    "happy",
    "metro",
    "north",
    "prime",
    "quick",
    "rapid",
    "royal",
    "smart",
    "sunny",
    "true",
    "urban",
    "west",
    "wild",
];
const B = [
    "arcade",
    "bank",
    "books",
    "cars",
    "coffee",
    "deals",
    "fitness",
    "foods",
    "games",
    "garden",
    "health",
    "home",
    "loans",
    "music",
    "pets",
    "shoes",
    "sports",
    "travel",
    "tutor",
    "wear",
];
const C = ["", "hub", "now", "co", "go", "plus"];

/** The value requests carry when the buyer names no advertiser. */
export const NOT_SENT = "(Not sent)";

/** Every advertiser the list can offer: the sample data's five, “not sent”, then the long tail. */
export const LONG_ADVERTISERS: string[] = (() => {
    const tail: string[] = [];
    for (const c of C) for (const a of A) for (const b of B) tail.push(`${a}${b}${c}.example`);
    return [...DIM_VALUES.Advertiser, NOT_SENT, ...tail.sort()];
})();

/** The top values a search-first list opens on: the most revenue first, then “not sent”. */
export const TOP_ADVERTISERS = [...DIM_VALUES.Advertiser, NOT_SENT];
