import { APPS, compactNum, money, seeded, whole } from "../../sample-data";

/**
 * Figures behind Reporting · key metrics and Reporting · realtime dashboard.
 *
 * All sample: the exchange-wide figures on key metrics are invented at the scale staging
 * shows, and the realtime cube (day × platform × app × ad type) is seeded so it never
 * changes between renders and every filter, platform and total adds up.
 */

/* ============================================================ Key metrics === */

export interface KmPoint {
    label: string;
    v: number;
}

/** What one tab of a key metrics card shows. */
export interface KmFigure {
    value: string;
    /** "Today:" line (Yesterday's Revenue). */
    today?: string;
    /** "High:" line (Yesterday's Revenue). */
    high?: { date: string; value: string };
    series?: KmPoint[];
}

export type KmTone = "teal" | "navy" | "charcoal";
export type KmChartUnit = "money" | "percent" | "cost";

export interface KmCard {
    id: string;
    title: string;
    tone: KmTone;
    /** Bottom tab strip; empty when the card has none. */
    tabs: string[];
    initial?: string;
    chart?: KmChartUnit;
    figures: Record<string, KmFigure>;
}

const MONTHS = ["May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26", "Oct '26", "Nov '26"];
const months = (values: number[]): KmPoint[] => values.map((v, i) => ({ label: MONTHS[i], v }));

/** Monthly blended revenue; segments are shares of it. */
const BLENDED_MONTHS = [338_000, 412_000, 371_000, 352_000, 506_000, 447_000, 431_000];
const segment = (share: number, wiggle: number) => months(BLENDED_MONTHS.map((v, i) => Math.round(v * share * (1 + Math.sin(i * 1.3 + wiggle) * 0.06))));

export const KM_CARDS: KmCard[] = [
    {
        id: "yesterday",
        title: "Yesterday's Revenue",
        tone: "teal",
        tabs: ["CORE", "NIMBUS+", "DAS", "BLENDED"],
        initial: "BLENDED",
        chart: "money",
        figures: {
            CORE: { value: money(6_384.17), today: money(6_012.55), high: { date: "September 12, 2026", value: money(27_118.4) }, series: segment(0.62, 0.4) },
            "NIMBUS+": {
                value: money(3_211.62),
                today: money(2_978.08),
                high: { date: "September 12, 2026", value: money(12_640.95) },
                series: segment(0.3, 1.1),
            },
            DAS: { value: money(828.39), today: money(764.21), high: { date: "October 3, 2026", value: money(3_402.7) }, series: segment(0.08, 2.2) },
            BLENDED: {
                value: money(10_424.18),
                today: money(9_754.84),
                high: { date: "September 12, 2026", value: money(41_206.37) },
                series: months(BLENDED_MONTHS),
            },
        },
    },
    {
        id: "arr",
        title: "ARR",
        tone: "charcoal",
        tabs: ["DAY", "MONTH", "QUARTER"],
        initial: "DAY",
        figures: {
            DAY: { value: money(3_804_825.7) },
            MONTH: { value: money(5_172_000.0) },
            QUARTER: { value: money(5_468_312.44) },
        },
    },
    {
        id: "take-rate",
        title: "Avg. Take Rate",
        tone: "navy",
        tabs: ["CORE", "NIMBUS+", "BLENDED"],
        initial: "BLENDED",
        chart: "percent",
        figures: {
            CORE: { value: "17.24%", series: months([16.4, 16.1, 16.2, 16.5, 18.3, 19.6, 17.2]) },
            "NIMBUS+": { value: "22.61%", series: months([20.8, 20.2, 20.4, 21.0, 22.9, 24.1, 22.6]) },
            BLENDED: { value: "18.92%", series: months([17.6, 17.2, 17.2, 17.5, 19.8, 21.9, 18.9]) },
        },
    },
    {
        id: "gross",
        title: "Gross Revenue",
        tone: "charcoal",
        tabs: ["MONTH", "QUARTER", "YEAR"],
        initial: "YEAR",
        figures: {
            MONTH: { value: money(1_126_408.93) },
            QUARTER: { value: money(3_402_115.6) },
            YEAR: { value: money(12_406_882.15) },
        },
    },
    {
        id: "cost-per-auction",
        title: "Avg. Nimbus Cost Per Auction",
        tone: "charcoal",
        tabs: ["DAY", "WEEK", "MONTH"],
        initial: "MONTH",
        chart: "cost",
        figures: {
            DAY: {
                value: "$0.000038",
                series: ["11/7", "11/8", "11/9", "11/10", "11/11", "11/12", "11/13"].map((label, i) => ({
                    label,
                    v: 0.000036 + seeded(`cpa-d${i}`) * 0.000005,
                })),
            },
            WEEK: {
                value: "$0.000041",
                series: ["9/26", "10/3", "10/10", "10/17", "10/24", "10/31", "11/7"].map((label, i) => ({
                    label,
                    v: 0.000038 + seeded(`cpa-w${i}`) * 0.000006,
                })),
            },
            MONTH: { value: "$0.000043", series: months([0.000047, 0.000046, 0.000045, 0.000046, 0.000042, 0.000041, 0.000043]) },
        },
    },
    {
        id: "proxy",
        title: "Gross Revenue Proxy",
        tone: "charcoal",
        tabs: ["MONTH", "QUARTER", "YEAR"],
        initial: "YEAR",
        figures: {
            MONTH: { value: money(1_873_092.4) },
            QUARTER: { value: money(5_611_740.18) },
            YEAR: { value: money(20_318_454.06) },
        },
    },
    {
        id: "connections",
        title: "Active Demand Connections",
        tone: "charcoal",
        tabs: ["CORE S2S", "CORE SDK", "NIMBUS+", "TOTAL"],
        initial: "TOTAL",
        figures: {
            "CORE S2S": { value: "214" },
            "CORE SDK": { value: "143" },
            "NIMBUS+": { value: "246" },
            TOTAL: { value: "603" },
        },
    },
    {
        id: "ndr",
        title: "NDR",
        tone: "charcoal",
        tabs: ["MONTH", "QUARTER", "YEAR"],
        initial: "MONTH",
        figures: {
            MONTH: { value: "79.42%" },
            QUARTER: { value: "84.07%" },
            YEAR: { value: "91.16%" },
        },
    },
    {
        id: "potential",
        title: "Potential Nimbus+ Connections",
        tone: "charcoal",
        tabs: [],
        figures: { "": { value: "1046" } },
    },
];

export const kmAxis = (unit: KmChartUnit, v: number) =>
    unit === "money" ? `$${compactNum(v)}` : unit === "percent" ? `${Math.round(v)}%` : `$${v.toFixed(6)}`;

export const kmValue = (unit: KmChartUnit, v: number) => (unit === "money" ? money(v, 0) : unit === "percent" ? `${v.toFixed(2)}%` : `$${v.toFixed(6)}`);

/* =============================================================== Realtime === */

export const RT_PLATFORMS = ["iPhone", "Android"] as const;
export type RtPlatform = (typeof RT_PLATFORMS)[number];

export const RT_AD_TYPES = ["Banner", "Interstitial", "Rewarded Video"];

/** Oct 31 – Nov 13, 2026: the week every screen shows, and the one before it. */
export const RT_DAYS = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 9, 31 + i));
    return d.toISOString().slice(0, 10);
});

export type RtRange = "yesterday" | "7" | "14";
export type RtGroup = "day" | "week";

export const RANGE_OPTIONS: { id: RtRange; label: string }[] = [
    { id: "yesterday", label: "Yesterday" },
    { id: "7", label: "Last 7 Days" },
    { id: "14", label: "Last 14 Days" },
];
export const GROUP_OPTIONS: { id: RtGroup; label: string }[] = [
    { id: "day", label: "By Day" },
    { id: "week", label: "By Week" },
];

export const daysIn = (range: RtRange) => (range === "yesterday" ? RT_DAYS.slice(-2, -1) : RT_DAYS.slice(-Number(range)));

export interface Totals {
    requests: number;
    wins: number;
    impressions: number;
    clicks: number;
    revenue: number;
}

interface Cell extends Totals {
    day: string;
    platform: RtPlatform;
    app: string;
    adType: string;
}

const BASE: Record<RtPlatform, { requests: number; winRate: number; render: number; ctr: number; ecpm: number }> = {
    iPhone: { requests: 18_600_000, winRate: 0.27, render: 0.86, ctr: 0.0094, ecpm: 0.97 },
    Android: { requests: 4_420_000, winRate: 0.45, render: 0.9, ctr: 0.0121, ecpm: 1.6 },
};
const APP_SHARE = [0.34, 0.25, 0.19, 0.13, 0.09];
const AD_TYPE = [
    { share: 0.58, ecpm: 0.72 },
    { share: 0.28, ecpm: 1.38 },
    { share: 0.14, ecpm: 1.95 },
];

const dayLift = (iso: string, i: number) => {
    const dow = new Date(`${iso}T12:00:00Z`).getUTCDay();
    const weekend = dow === 0 || dow === 6 ? 1.18 : 1;
    return weekend * (1 + Math.sin(i * 1.7) * 0.07 + Math.cos(i * 0.6) * 0.04);
};

const CUBE: Cell[] = RT_DAYS.flatMap((day, di) =>
    RT_PLATFORMS.flatMap((platform) =>
        APPS.flatMap((app, ai) =>
            RT_AD_TYPES.map((adType, ti) => {
                const b = BASE[platform];
                const k = `${day}|${platform}|${app}|${adType}`;
                const requests = Math.round(b.requests * dayLift(day, di) * APP_SHARE[ai] * AD_TYPE[ti].share * (0.9 + seeded(`${k}r`) * 0.2));
                const wins = Math.round(requests * b.winRate * (0.92 + seeded(`${k}w`) * 0.16));
                const impressions = Math.round(wins * b.render * (0.95 + seeded(`${k}i`) * 0.08));
                const clicks = Math.round(impressions * b.ctr * (0.85 + seeded(`${k}c`) * 0.3));
                const revenue = (impressions / 1000) * b.ecpm * AD_TYPE[ti].ecpm * (0.9 + seeded(`${k}$`) * 0.2);
                return { day, platform, app, adType, requests, wins, impressions, clicks, revenue };
            }),
        ),
    ),
);

export const FILTER_DIMS = [
    { id: "app", label: "App", values: APPS },
    { id: "adType", label: "Ad Type", values: RT_AD_TYPES },
];

const zero = (): Totals => ({ requests: 0, wins: 0, impressions: 0, clicks: 0, revenue: 0 });
export const add = (a: Totals, b: Totals): Totals => ({
    requests: a.requests + b.requests,
    wins: a.wins + b.wins,
    impressions: a.impressions + b.impressions,
    clicks: a.clicks + b.clicks,
    revenue: a.revenue + b.revenue,
});
export const sumAll = (rows: Totals[]) => rows.reduce(add, zero());

export interface RtRow extends Totals {
    /** Bucket key: an ISO day, or the first day of a week. */
    date: string;
    /** "Android" / "iPhone", or "Total" when platforms are combined. */
    platform: string;
}

/**
 * The report rows for a range: one per bucket per platform, or one per bucket when
 * `totalsOnly`. `excluded` lists app and ad type values the filters leave out.
 */
export const rtRows = ({
    range,
    group,
    platforms,
    excluded,
    totalsOnly,
}: {
    range: RtRange;
    group: RtGroup;
    platforms: RtPlatform[];
    excluded: Record<string, string[]>;
    totalsOnly: boolean;
}): RtRow[] => {
    const days = daysIn(range);
    const bucketOf = (day: string) => (group === "day" ? day : days[Math.floor(days.indexOf(day) / 7) * 7]);
    const map = new Map<string, RtRow>();
    for (const c of CUBE) {
        if (!days.includes(c.day) || !platforms.includes(c.platform)) continue;
        if (excluded.app?.includes(c.app) || excluded.adType?.includes(c.adType)) continue;
        const date = bucketOf(c.day);
        const platform = totalsOnly ? "Total" : c.platform;
        const key = `${date}|${platform}`;
        const cur = map.get(key) ?? { date, platform, ...zero() };
        map.set(key, { date, platform, ...add(cur, c) });
    }
    // Staging's order: newest first, Android above iPhone.
    return [...map.values()].sort((a, b) => b.date.localeCompare(a.date) || a.platform.localeCompare(b.platform));
};

/* ---------------------------------------------------------------- Metrics --- */

export const RT_METRICS = ["Revenue", "Requests", "Wins", "Impressions", "Clicks", "Win Rate", "Render Rate", "CTR", "ECPM", "RCPM"] as const;
export type RtMetric = (typeof RT_METRICS)[number];

/** Tiles and table columns list the ticked metrics in checkbox order, with Revenue last (as staging). */
export const ordered = (metrics: RtMetric[]) => [
    ...RT_METRICS.filter((m) => m !== "Revenue" && metrics.includes(m)),
    ...(metrics.includes("Revenue") ? ["Revenue" as const] : []),
];

/** Table column headings where staging spells them differently from the checkbox. */
export const COLUMN_LABEL: Partial<Record<RtMetric, string>> = { ECPM: "eCPM", RCPM: "rCPM" };

export type RtUnit = "revenue" | "count" | "price" | "rate";
export const UNIT: Record<RtMetric, RtUnit> = {
    Revenue: "revenue",
    Requests: "count",
    Wins: "count",
    Impressions: "count",
    Clicks: "count",
    "Win Rate": "rate",
    "Render Rate": "rate",
    CTR: "rate",
    ECPM: "price",
    RCPM: "price",
};

const div = (a: number, b: number) => (b ? a / b : 0);

export const metricOf = (m: RtMetric, t: Totals) => {
    switch (m) {
        case "Revenue":
            return t.revenue;
        case "Requests":
            return t.requests;
        case "Wins":
            return t.wins;
        case "Impressions":
            return t.impressions;
        case "Clicks":
            return t.clicks;
        case "Win Rate":
            return div(t.wins, t.requests) * 100;
        case "Render Rate":
            return div(t.impressions, t.wins) * 100;
        case "CTR":
            return div(t.clicks, t.impressions) * 100;
        case "ECPM":
            return div(t.revenue, t.impressions) * 1000;
        case "RCPM":
            return div(t.revenue, t.requests) * 1000;
    }
};

/** Table and tooltip figures. */
export const formatFull = (m: RtMetric, v: number) => {
    const u = UNIT[m];
    if (u === "revenue" || u === "price") return money(v);
    if (u === "rate") return `${v.toFixed(2)}%`;
    return whole(v);
};

/** Tile figures: counts compact (225.64M), as staging's tiles. */
export const formatTile = (m: RtMetric, v: number) => (UNIT[m] === "count" ? compactNum(v) : formatFull(m, v));

export const formatAxis = (u: RtUnit, v: number) =>
    u === "revenue" ? `$${compactNum(v)}` : u === "price" ? `$${v.toFixed(2)}` : u === "rate" ? `${Math.round(v)}%` : compactNum(v);

/**
 * Series colours from the chart palette. A rate takes the hue of the count it comes from
 * and draws dashed. Android takes the full hue, iPhone a lighter tint of it (as staging).
 */
export const METRIC_COLOR: Record<RtMetric, string> = {
    Revenue: "#37B6B7",
    Requests: "#2E5AAC",
    Wins: "#7F56D9",
    Impressions: "#DA6EA3",
    Clicks: "#854A0E",
    "Win Rate": "#7F56D9",
    "Render Rate": "#DA6EA3",
    CTR: "#854A0E",
    ECPM: "#F79009",
    RCPM: "#F79009",
};
export const DASHED: RtMetric[] = ["Win Rate", "Render Rate", "CTR", "RCPM"];

/** Mix a hex colour with white. */
export const tint = (hex: string, amount: number) => {
    const n = parseInt(hex.slice(1), 16);
    const ch = (shift: number) => Math.round(((n >> shift) & 255) + (255 - ((n >> shift) & 255)) * amount);
    return `#${[16, 8, 0].map((s) => ch(s).toString(16).padStart(2, "0")).join("")}`;
};

export const platformColor = (m: RtMetric, platform: string) => (platform === "iPhone" ? tint(METRIC_COLOR[m], 0.5) : METRIC_COLOR[m]);

/* --------------------------------------------------------------- Dates --- */

const asDate = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** "Nov 07, 2026" — the date cells. */
export const cellDate = (iso: string) => asDate(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: "UTC" });

/** "Wednesday, November 11, 2026" — the chart tooltip title. */
export const longDate = (iso: string) =>
    asDate(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** What Show Activity marks on the chart: changes made in the account (sample). */
export const ACTIVITY = [
    { day: "2026-11-09", label: "Floors updated" },
    { day: "2026-11-11", label: "Demand added" },
];
