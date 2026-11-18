/**
 * Shared sample data for the full application (Nov 13 style guide).
 *
 * Everything here is fictional: this prototype and its Storybook publish to a public URL,
 * so no real publisher, app, demand partner or person appears. Screens draw from these
 * lists so the same names and figures recur across the app, and the week shown is the
 * same everywhere.
 */

/** The publisher account the app shows; "Nimbus Exchange" is the all-publisher view. */
export const PUBLISHER = { name: "Test Publisher", badge: "TP" };

/** The publisher's apps (as in DAS Round 6). */
export const APPS = ["Daily Scores", "Match Report", "Xtra Innings", "Puzzle Parade", "Garden Planner"];

export const PLATFORMS = ["iOS", "Android"] as const;

/** Fictional demand partners. "Nimbus+" is Nimbus's own demand, kept by name. */
export const DEMAND_PARTNERS = [
    "Nimbus+",
    "Northwind DSP",
    "Bluefin Exchange",
    "Cobalt Ads",
    "Harbor Media",
    "Lumen RTB",
    "Pinecrest SSP",
    "Quarry Demand",
    "Redwood Bidder",
    "Summit Exchange",
    "Tidewater Ads",
    "Upland Media",
    "Vantage RTB",
    "Willow Demand",
    "Zephyr DSP",
];

/** Fictional people (account managers, who changed what). */
export const PEOPLE = ["Avery Chen", "Jordan Diaz", "Riley Park", "Sam Okafor"];

/** The signed-in user (Settings). */
export const USER = { first: "Alex", last: "Rivera", email: "alex.rivera@example.com" };

/** The reporting week every screen shows: Sat Nov 7 to Fri Nov 13, 2026. */
export const WEEK = ["2026-11-07", "2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13"];
export const WEEK_RANGE = { start: "Nov 07, 2026", end: "Nov 13, 2026", label: "Last 7 days" };

/** "Sat 11/7" — the day labels staging's charts use. */
export const dayLabel = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    return `${d.toLocaleDateString("en-US", { weekday: "short" })} ${d.getMonth() + 1}/${d.getDate()}`;
};

/** A stable pseudo-random 0..1 from a string, so sample numbers never change between renders. */
export const seeded = (key: string) => {
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
    return ((h >>> 0) % 10000) / 10000;
};

export const money = (n: number, digits = 2) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
export const whole = (n: number) => Math.round(n).toLocaleString("en-US");
export const percent = (n: number, digits = 2) => `${n.toFixed(digits)}%`;
export const compactNum = (n: number) => n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });
