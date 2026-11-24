import { APPS, DEMAND_PARTNERS, PLATFORMS, WEEK, compactNum, money, seeded, whole } from "../../sample-data";

/**
 * Buyer breakdown — the figures behind the four "Demand …" donuts and the table view.
 *
 * Every number is synthesised from seeded() so it never changes between renders, and
 * built per demand partner × app × platform so the Filters band can narrow it and every
 * view still adds up. Fictional, like all of the app's sample data.
 */

export type BuyerMetric = "ECPM" | "Wins" | "Impressions" | "Clicks" | "Revenue";
export const BUYER_METRICS: BuyerMetric[] = ["ECPM", "Wins", "Impressions", "Clicks", "Revenue"];
/** Staging's default: everything but Clicks. */
export const DEFAULT_BUYER_METRICS: BuyerMetric[] = ["ECPM", "Wins", "Impressions", "Revenue"];
/** The donut each metric draws, as staging titles them. */
export const DONUT_TITLE: Record<BuyerMetric, string> = {
    ECPM: "Demand eCPM",
    Wins: "Demand Wins",
    Impressions: "Demand Impressions",
    Clicks: "Demand Clicks",
    Revenue: "Demand Revenue",
};

export type BuyerRange = "yesterday" | "today" | "7";
export const BUYER_RANGES: { id: BuyerRange; label: string }[] = [
    { id: "yesterday", label: "Yesterday" },
    { id: "today", label: "Today" },
    { id: "7", label: "Last 7 days" },
];
/** Today is the last day of the sample week (Nov 13); today's figures are part-day. */
const RANGE_DATES: Record<BuyerRange, { start: string; end: string; days: number }> = {
    yesterday: { start: "Nov 12, 2026", end: "Nov 12, 2026", days: 1 },
    today: { start: "Nov 13, 2026", end: "Nov 13, 2026", days: 0.55 },
    "7": { start: "Nov 07, 2026", end: "Nov 13, 2026", days: WEEK.length },
};
export const rangeDates = (r: BuyerRange) => RANGE_DATES[r];

/** A partner's share of the day's impressions: Nimbus+ leads, a long tail behind it. */
const SHARE: Record<string, number> = {
    "Nimbus+": 0.42,
    "Northwind DSP": 0.12,
    "Bluefin Exchange": 0.09,
    "Cobalt Ads": 0.075,
    "Harbor Media": 0.06,
    "Lumen RTB": 0.05,
    "Pinecrest SSP": 0.04,
    "Quarry Demand": 0.033,
    "Redwood Bidder": 0.027,
    "Summit Exchange": 0.022,
    "Tidewater Ads": 0.018,
    "Upland Media": 0.014,
    "Vantage RTB": 0.011,
    "Willow Demand": 0.008,
    "Zephyr DSP": 0.005,
};
/** About 5.9M impressions on a full day across the publisher's apps. */
const DAY_IMPRESSIONS = 5_900_000;

interface Cell {
    partner: string;
    app: string;
    platform: string;
    impressions: number;
    wins: number;
    clicks: number;
    revenue: number;
}

const appWeight = (app: string) => 0.6 + seeded(`app:${app}`);

const buildCells = (range: BuyerRange): Cell[] => {
    const { days } = RANGE_DATES[range];
    const appTotal = APPS.reduce((s, a) => s + appWeight(a), 0);
    return DEMAND_PARTNERS.flatMap((partner) =>
        APPS.flatMap((app) =>
            PLATFORMS.map((platform) => {
                const k = `${range}:${partner}:${app}:${platform}`;
                const share = (SHARE[partner] ?? 0.01) * (appWeight(app) / appTotal) * (platform === "iOS" ? 0.55 : 0.45);
                const impressions = DAY_IMPRESSIONS * days * share * (0.85 + 0.3 * seeded(`imp:${k}`));
                // Nimbus+ and the larger DSPs pay a little more; the tail spreads wide.
                const ecpm = (partner === "Nimbus+" ? 0.72 : 0.5) + 0.8 * seeded(`ecpm:${partner}`) + 0.15 * seeded(`ecpm:${k}`);
                return {
                    partner,
                    app,
                    platform,
                    impressions,
                    // Wins outnumber impressions on staging: not every won auction renders.
                    wins: impressions * (1.9 + 0.6 * seeded(`win:${k}`)),
                    clicks: impressions * (0.004 + 0.008 * seeded(`ctr:${k}`)),
                    revenue: (impressions / 1000) * ecpm,
                };
            }),
        ),
    );
};

export interface BuyerRow {
    partner: string;
    impressions: number;
    wins: number;
    clicks: number;
    revenue: number;
}

const zero = (partner: string): BuyerRow => ({ partner, impressions: 0, wins: 0, clicks: 0, revenue: 0 });

const add = (a: BuyerRow, b: Omit<BuyerRow, "partner">) => {
    a.impressions += b.impressions;
    a.wins += b.wins;
    a.clicks += b.clicks;
    a.revenue += b.revenue;
};

/** Per partner, after filters; `excluded` is filterExcluded()'s output. Sorted by revenue. */
export const buyerRows = (range: BuyerRange, excluded: Record<string, string[]>): BuyerRow[] => {
    const out = new Map<string, BuyerRow>();
    for (const c of buildCells(range)) {
        if (excluded.partner?.includes(c.partner) || excluded.app?.includes(c.app) || excluded.platform?.includes(c.platform)) continue;
        const row = out.get(c.partner) ?? zero(c.partner);
        add(row, c);
        out.set(c.partner, row);
    }
    return [...out.values()].sort((a, b) => b.revenue - a.revenue);
};

export const totalOf = (rows: BuyerRow[], label = "Total"): BuyerRow => {
    const t = zero(label);
    rows.forEach((r) => add(t, r));
    return t;
};

export const metricValue = (m: BuyerMetric, r: BuyerRow) => {
    switch (m) {
        case "ECPM":
            return r.impressions ? (r.revenue / r.impressions) * 1000 : 0;
        case "Wins":
            return r.wins;
        case "Impressions":
            return r.impressions;
        case "Clicks":
            return r.clicks;
        case "Revenue":
            return r.revenue;
    }
};

export const formatMetric = (m: BuyerMetric, v: number) => (m === "ECPM" || m === "Revenue" ? money(v) : whole(v));
export const shortMetric = (m: BuyerMetric, v: number) => (m === "ECPM" ? money(v) : m === "Revenue" ? `$${compactNum(v)}` : compactNum(v));
/** CSV keeps raw figures: counts whole, money to two places. */
export const csvMetric = (m: BuyerMetric, v: number) => (m === "ECPM" || m === "Revenue" ? v.toFixed(2) : String(Math.round(v)));

/* ------------------------------------------------------------- Colour --- */

/**
 * At most eight slices a donut (dataviz rule): six named partners + "Other". The six are
 * the publisher's top partners by revenue over the unfiltered week, fixed, so a colour
 * always means the same partner whatever the date or filter (colour follows the entity).
 * The order is the one that passes the palette validator's colour-blind check for
 * neighbouring slices.
 */
export const SLICE_COLORS = ["#2E5AAC", "#37B6B7", "#854A0E", "#DA6EA3", "#7F56D9", "#F79009"];
export const OTHER = "Other";
export const OTHER_COLOR = "#98A2B3";

export const NAMED_PARTNERS = buyerRows("7", {})
    .slice(0, SLICE_COLORS.length)
    .map((r) => r.partner);

export const partnerColor = (partner: string) => {
    const i = NAMED_PARTNERS.indexOf(partner);
    return i >= 0 ? SLICE_COLORS[i] : OTHER_COLOR;
};

export interface Slice {
    name: string;
    value: number;
    color: string;
}

/**
 * A metric's slices: the named partners in their fixed order, then everyone else folded
 * into "Other". eCPM is a rate, so "Other" is the tail's blended eCPM, not a sum.
 */
export const slicesFor = (m: BuyerMetric, rows: BuyerRow[]): Slice[] => {
    const named = NAMED_PARTNERS.map((p) => rows.find((r) => r.partner === p)).filter((r): r is BuyerRow => !!r);
    const rest = rows.filter((r) => !NAMED_PARTNERS.includes(r.partner));
    const slices = named.map((r) => ({ name: r.partner, value: metricValue(m, r), color: partnerColor(r.partner) }));
    if (rest.length) slices.push({ name: OTHER, value: metricValue(m, totalOf(rest, OTHER)), color: OTHER_COLOR });
    return slices.filter((s) => s.value > 0);
};

/** Filter categories in the Filters band's + ADD menu. */
export const BUYER_FILTER_DIMS = [
    { id: "partner", label: "Demand Partner", values: DEMAND_PARTNERS },
    { id: "app", label: "App", values: APPS },
    { id: "platform", label: "Platform", values: [...PLATFORMS] },
];
