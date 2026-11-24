import { ROUTES } from "../../nav";
import { APPS, DEMAND_PARTNERS, PEOPLE, compactNum, money, percent, seeded, whole } from "../../sample-data";

/**
 * Performance Insights — the figures behind Saved Queries and New Query (Nov 13 style guide).
 *
 * Staging's metrics and breakdowns, in staging's order and wording. Every figure is
 * fictional and seeded, so the same query always returns the same numbers, and every
 * metric is derived from the same few counts (requests → wins → impressions → clicks,
 * revenue, bids and floors), so rates always agree with the counts beside them.
 */

/** Staging's two tabs; each is its own screen. */
export const PI_TABS = [
    { id: "saved", label: "Saved Queries", href: ROUTES.piSaved },
    { id: "query", label: "New Query", href: ROUTES.piQuery },
];

/* ------------------------------------------------------------- Metrics --- */

export const METRICS = [
    "Requests",
    "Wins",
    "Impressions",
    "Revenue",
    "ECPM",
    "Fill Rate",
    "Win Rate",
    "Render Rate",
    "Clicks",
    "CTR",
    "RCPM",
    "Average Winning Bid Price",
    "Average Impression Bid Floor",
] as const;
export type Metric = (typeof METRICS)[number];

export type Unit = "count" | "money" | "pct";
export const UNIT: Record<Metric, Unit> = {
    Requests: "count",
    Wins: "count",
    Impressions: "count",
    Revenue: "money",
    ECPM: "money",
    "Fill Rate": "pct",
    "Win Rate": "pct",
    "Render Rate": "pct",
    Clicks: "count",
    CTR: "pct",
    RCPM: "money",
    "Average Winning Bid Price": "money",
    "Average Impression Bid Floor": "money",
};

/** Metrics that add up across rows, so they can stack or slice into a pie. */
export const ADDITIVE: Metric[] = ["Requests", "Wins", "Impressions", "Revenue", "Clicks"];

/* ---------------------------------------------------------- Breakdowns --- */

export const DIMS = [
    "Account",
    "Account Manager",
    "Ad ID",
    "Ad Size",
    "Ad Type",
    "Ad Unit",
    "Advertiser",
    "App",
    "App Bundle",
    "App Category",
    "App Version",
    "Common Ad Size",
    "Country",
    "DAS Asset",
    "DAS Campaign",
    "DAS Deal",
    "Demand Source",
    "Demand Source Pool",
    "Demand Source Type",
    "Integration Type",
    "Internal Demand Source",
    "LiveRamp ID",
    "Placement",
    "Platform",
    "Position",
    "Region",
    "SDK Version",
    "Unified ID 2.0",
] as const;
export type Dim = (typeof DIMS)[number];

/** Each breakdown's values. Fictional throughout: sample accounts, apps, partners, example.com advertisers. */
export const DIM_VALUES: Record<Dim, string[]> = {
    Account: ["Test Publisher", "Scoreline Media", "Northlight Apps", "Metro Mobile", "Greenleaf Studio", "Stride Labs"],
    "Account Manager": PEOPLE,
    "Ad ID": ["ad-10482", "ad-10517", "ad-10933", "ad-11206", "ad-11874"],
    "Ad Size": ["320x50", "300x250", "728x90", "320x480", "480x320"],
    "Ad Type": ["Static", "Video", "Native"],
    "Ad Unit": ["Inline", "Interstitial", "Rewarded", "Dynamic Unit"],
    Advertiser: ["shoes.example.com", "travel.example.com", "games.example.com", "bank.example.com", "grocer.example.com"],
    App: APPS,
    "App Bundle": ["com.example.dailyscores", "com.example.matchreport", "com.example.xtrainnings", "com.example.puzzleparade", "com.example.gardenplanner"],
    "App Category": ["Sports", "Puzzle", "Lifestyle"],
    "App Version": ["4.12.0", "4.11.2", "4.10.1", "3.9.0"],
    "Common Ad Size": ["Banner", "MREC", "Interstitial"],
    Country: ["United States", "Canada", "United Kingdom", "Germany", "Mexico", "Brazil", "Japan"],
    "DAS Asset": ["Scoreboard banner", "Halftime interstitial", "Puzzle hint card", "None"],
    "DAS Campaign": ["Sports fans", "Morning commuters", "Weekend puzzlers", "None"],
    "DAS Deal": ["Sports fans PMP", "Commuters PG", "None"],
    "Demand Source": DEMAND_PARTNERS.slice(0, 7),
    "Demand Source Pool": ["Open Auction", "Private Marketplace", "Nimbus+"],
    "Demand Source Type": ["RTB", "SDK Bidder", "Mediation"],
    "Integration Type": ["SDK", "Prebid", "API"],
    "Internal Demand Source": ["Nimbus+", "House", "None"],
    "LiveRamp ID": ["Present", "Absent"],
    Placement: ["Home feed", "Article body", "Level end", "Post-game", "Bonus reward"],
    Platform: ["iOS", "Android"],
    Position: ["Above the fold", "Below the fold", "Full screen"],
    Region: ["North America", "Europe", "Latin America", "Asia Pacific"],
    "SDK Version": ["2.28.0", "2.27.1", "2.26.3", "2.25.0"],
    "Unified ID 2.0": ["Present", "Absent"],
};

/* --------------------------------------------------------- Date ranges --- */

/** A preset, or (v2 · Round 2, C16's date picker) a custom range written "start~end" in ISO dates. */
export type Range = "yesterday" | "7" | "14" | "30" | `${string}~${string}`;
export type Interval = "day" | "week" | "month";

export const RANGES: { id: Range; label: string }[] = [
    { id: "yesterday", label: "Yesterday" },
    { id: "7", label: "Last 7 days" },
    { id: "14", label: "Last 14 days" },
    { id: "30", label: "Last 30 days" },
];
export const INTERVALS: { id: Interval; label: string }[] = [
    { id: "day", label: "By Day" },
    { id: "week", label: "By Week" },
    { id: "month", label: "By Month" },
];
export const rangeLabel = (r: Range) => RANGES.find((x) => x.id === r)?.label ?? r;

/** Today in the sample: the reporting week ends Fri Nov 13, 2026. */
const TODAY = Date.UTC(2026, 10, 13);
const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);

/** The days a range covers, oldest first. */
export const rangeDays = (r: Range): string[] => {
    if (r === "yesterday") return [iso(TODAY - DAY)];
    if (r.includes("~")) {
        const [start, end] = r.split("~").map((d) => Date.parse(`${d}T00:00:00Z`));
        return Array.from({ length: Math.round((end - start) / DAY) + 1 }, (_, k) => iso(start + k * DAY));
    }
    const n = Number(r);
    return Array.from({ length: n }, (_, k) => iso(TODAY - (n - 1 - k) * DAY));
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "Nov 07, 2026" — the START DATE / END DATE format. */
export const longDate = (d: string) => `${MONTHS[Number(d.slice(5, 7)) - 1]} ${d.slice(8, 10)}, ${d.slice(0, 4)}`;
/** "Monday, November 9, 2026" — the chart tooltip's title. */
export const fullDate = (d: string) =>
    new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** The sample data's “today”: every preset ends here, and the date picker stops here. */
export const DATA_TODAY = iso(TODAY);

/** A custom range; a range that matches a preset becomes that preset. */
export const customRange = (start: string, end: string): Range => {
    for (const r of ["yesterday", "7", "14", "30"] as const) {
        const days = rangeDays(r);
        if (days[0] === start && days[days.length - 1] === end) return r;
    }
    return `${start}~${end}`;
};

const shiftDay = (d: string, back: number) => iso(Date.parse(`${d}T00:00:00Z`) - back * DAY);

/** The periods a range splits into, newest first as staging lists them; each with its days. */
export const periodsOf = (r: Range, interval: Interval): { label: string; days: string[] }[] => {
    const days = rangeDays(r);
    const out: { label: string; days: string[] }[] = [];
    days.forEach((d, k) => {
        const label = interval === "day" ? d : interval === "month" ? d.slice(0, 7) : days[k - (k % 7)];
        const last = out[out.length - 1];
        if (last?.label === label) last.days.push(d);
        else out.push({ label, days: [d] });
    });
    return out.reverse();
};

/* ------------------------------------------------------------- Figures --- */

export interface Totals {
    requests: number;
    wins: number;
    impressions: number;
    revenue: number;
    clicks: number;
    /** Sum of winning bid prices (per win) and of bid floors (per impression), for the averages. */
    bid: number;
    floor: number;
}

export const ZERO: Totals = { requests: 0, wins: 0, impressions: 0, revenue: 0, clicks: 0, bid: 0, floor: 0 };

export const addTotals = (a: Totals, b: Totals): Totals => ({
    requests: a.requests + b.requests,
    wins: a.wins + b.wins,
    impressions: a.impressions + b.impressions,
    revenue: a.revenue + b.revenue,
    clicks: a.clicks + b.clicks,
    bid: a.bid + b.bid,
    floor: a.floor + b.floor,
});
export const sumTotals = (list: Totals[]) => list.reduce(addTotals, ZERO);

const ratio = (a: number, b: number) => (b ? a / b : 0);

export const metricOf = (m: Metric, t: Totals): number => {
    switch (m) {
        case "Requests":
            return t.requests;
        case "Wins":
            return t.wins;
        case "Impressions":
            return t.impressions;
        case "Revenue":
            return t.revenue;
        case "ECPM":
            return ratio(t.revenue, t.impressions) * 1000;
        case "Fill Rate":
            return ratio(t.impressions, t.requests) * 100;
        case "Win Rate":
            return ratio(t.wins, t.requests) * 100;
        case "Render Rate":
            return ratio(t.impressions, t.wins) * 100;
        case "Clicks":
            return t.clicks;
        case "CTR":
            return ratio(t.clicks, t.impressions) * 100;
        case "RCPM":
            return ratio(t.revenue, t.requests) * 1000;
        case "Average Winning Bid Price":
            return ratio(t.bid, t.wins);
        case "Average Impression Bid Floor":
            return ratio(t.floor, t.impressions);
    }
};

export const formatMetric = (m: Metric, v: number) => {
    const unit = UNIT[m];
    if (unit === "money") return money(v, 2);
    if (unit === "pct") return percent(v, 2);
    return whole(v);
};

/** Axis ticks: "3.6B", "$1.2M", "80%". */
export const axisTick = (unit: Unit, v: number) => (unit === "money" ? `$${compactNum(v)}` : unit === "pct" ? `${+v.toFixed(2)}%` : compactNum(v));

/** CSV keeps raw figures: counts whole, money and rates to four places. */
export const csvMetric = (m: Metric, t: Totals) => (UNIT[m] === "count" ? String(Math.round(metricOf(m, t))) : metricOf(m, t).toFixed(4));

/** The exchange's day: weekends run about a third busier, as on staging. */
const dayBase = (d: string) => {
    const weekend = [0, 6].includes(new Date(`${d}T12:00:00Z`).getUTCDay());
    const s = (k: string) => seeded(`${k}:${d}`);
    return {
        requests: 3.4e9 * (weekend ? 1.32 : 1) * (0.96 + 0.08 * s("req")),
        win: 0.12 * (0.94 + 0.12 * s("win")),
        // v2 · Round 2: kept low enough that no value's render rate reaches 100%, so nothing is clamped.
        render: 0.84 + 0.05 * s("render"),
        ecpm: 1.8 * (0.92 + 0.16 * s("ecpm")),
        ctr: 0.0075 * (weekend ? 0.88 : 1) * (0.92 + 0.16 * s("ctr")),
        bid: 2.1 * (0.94 + 0.12 * s("bid")),
        floor: 0.85 * (0.95 + 0.1 * s("floor")),
    };
};

type Mult = Record<"win" | "render" | "ecpm" | "ctr" | "bid" | "floor", number>;
const ONE: Mult = { win: 1, render: 1, ecpm: 1, ctr: 1, bid: 1, floor: 1 };

/** A value's share of its breakdown (shares within a breakdown sum to 1). */
const shareOf = (dim: Dim, v: string) => {
    const w = (x: string) => 0.35 + seeded(`w:${dim}:${x}`);
    return w(v) / DIM_VALUES[dim].reduce((s, x) => s + w(x), 0);
};
// Render rate varies less than the rest (±6%), so no value's render rate reaches the 99.5% cap.
const rawMult = (dim: Dim, v: string): Mult =>
    Object.fromEntries(Object.keys(ONE).map((k) => [k, k === "render" ? 0.94 + 0.12 * seeded(`${k}:${dim}:${v}`) : 0.85 + 0.3 * seeded(`${k}:${dim}:${v}`)])) as Mult;

/**
 * v2 · Round 2: each value also moves a little from day to day (±8% of its share, ±4% on
 * each multiplier), so Android and iOS do not rise and fall in step. Shares are rescaled
 * per day to sum to 1 and multipliers per day as below, so breakdowns still add up.
 */
const shareOnDay = (dim: Dim, v: string, d: string) => {
    const w = (x: string) => (0.35 + seeded(`w:${dim}:${x}`)) * (0.92 + 0.16 * seeded(`wd:${dim}:${x}:${d}`));
    return w(v) / DIM_VALUES[dim].reduce((s, x) => s + w(x), 0);
};
const dayRawMult = (dim: Dim, v: string, d: string): Mult =>
    Object.fromEntries(Object.entries(rawMult(dim, v)).map(([k, x]) => [k, x * (0.96 + 0.08 * seeded(`${k}:${dim}:${v}:${d}`))])) as Mult;

/**
 * v2 · Round 2 (24 Nov): a value's multipliers, scaled so a breakdown adds back up to its
 * total. Each count is the share times a chain of multipliers (wins: win; impressions:
 * win × render; revenue: win × render × eCPM; …), so each link is scaled by its chain's
 * share-weighted average over the breakdown's values. Every chain then averages to 1, and
 * Android plus iOS equals the total, as a publisher would expect. (The frozen full
 * application kept the unscaled multipliers, so its breakdowns drift from its totals.)
 */
const multCache = new Map<string, Map<string, Mult>>();
const multOf = (dim: Dim, v: string, day?: string): Mult => {
    const cacheKey = day ? `${dim}|${day}` : dim;
    let byValue = multCache.get(cacheKey);
    if (!byValue) {
        const values = DIM_VALUES[dim];
        const raw = new Map(values.map((x) => [x, day ? dayRawMult(dim, x, day) : rawMult(dim, x)]));
        const weight = (x: string) => (day ? shareOnDay(dim, x, day) : shareOf(dim, x));
        const avg = (f: (m: Mult) => number) => values.reduce((n, x) => n + weight(x) * f(raw.get(x)!), 0);
        const kWin = avg((m) => m.win);
        const kRender = avg((m) => (m.win / kWin) * m.render);
        const kEcpm = avg((m) => (m.win / kWin) * (m.render / kRender) * m.ecpm);
        const kCtr = avg((m) => (m.win / kWin) * (m.render / kRender) * m.ctr);
        const kFloor = avg((m) => (m.win / kWin) * (m.render / kRender) * m.floor);
        const kBid = avg((m) => (m.win / kWin) * m.bid);
        byValue = new Map(
            values.map((x) => {
                const m = raw.get(x)!;
                return [x, { win: m.win / kWin, render: m.render / kRender, ecpm: m.ecpm / kEcpm, ctr: m.ctr / kCtr, floor: m.floor / kFloor, bid: m.bid / kBid }];
            }),
        );
        multCache.set(cacheKey, byValue);
    }
    return byValue.get(v)!;
};

export interface Combo {
    key: string;
    values: string[];
    share: number;
    mult: Mult;
    /** v2 · Round 2: the breakdown each value belongs to, and the values kept of filtered categories outside the breakdown. */
    parts?: [Dim, string][];
    kept?: [Dim, string[]][];
}

/** At most this many breakdown combinations; the smallest are dropped beyond it. */
const MAX_COMBOS = 60;

/**
 * Every combination of the chosen breakdowns' values, largest first. Filters drop values
 * of a chosen breakdown, and scale the rest by the share they keep of any other breakdown.
 */
export const combosOf = (breakdown: Dim[], excluded: Partial<Record<Dim, string[]>>): Combo[] => {
    let combos: Combo[] = [{ key: "", values: [], share: 1, mult: ONE }];
    for (const dim of breakdown) {
        const kept = DIM_VALUES[dim].filter((v) => !excluded[dim]?.includes(v));
        combos = combos
            .flatMap((c) =>
                kept.map((v) => {
                    const m = multOf(dim, v);
                    return {
                        key: c.key ? `${c.key} · ${v}` : v,
                        values: [...c.values, v],
                        share: c.share * shareOf(dim, v),
                        mult: Object.fromEntries(Object.entries(c.mult).map(([k, x]) => [k, x * m[k as keyof Mult]])) as Mult,
                        parts: [...(c.parts ?? []), [dim, v] as [Dim, string]],
                    };
                }),
            )
            .sort((a, b) => b.share - a.share)
            .slice(0, MAX_COMBOS);
    }
    const filterShare = (Object.keys(excluded) as Dim[])
        .filter((d) => !breakdown.includes(d) && excluded[d]?.length)
        .reduce((s, d) => s * DIM_VALUES[d].filter((v) => !excluded[d]!.includes(v)).reduce((a, v) => a + shareOf(d, v), 0), 1);
    const kept = (Object.keys(excluded) as Dim[])
        .filter((d) => !breakdown.includes(d) && excluded[d]?.length)
        .map((d) => [d, DIM_VALUES[d].filter((v) => !excluded[d]!.includes(v))] as [Dim, string[]]);
    return combos.map((c) => ({ ...c, share: c.share * filterShare, kept }));
};

/** v2 · Round 2: a combination's share and multipliers on one day (see shareOnDay). */
const onDay = (d: string, c: Combo): { share: number; mult: Mult } => {
    if (!c.parts) return { share: c.share, mult: c.mult };
    let share = 1;
    let mult = ONE;
    for (const [dim, v] of c.parts) {
        share *= shareOnDay(dim, v, d);
        const m = multOf(dim, v, d);
        mult = Object.fromEntries(Object.entries(mult).map(([k, x]) => [k, x * m[k as keyof Mult]])) as Mult;
    }
    for (const [dim, values] of c.kept ?? []) share *= values.reduce((a, v) => a + shareOnDay(dim, v, d), 0);
    return { share, mult };
};

/** One combination's counts on one day. */
export const dayTotals = (d: string, combo: Combo): Totals => {
    const b = dayBase(d);
    const c = { ...combo, ...onDay(d, combo) };
    const requests = b.requests * c.share;
    const wins = requests * b.win * c.mult.win;
    const impressions = wins * Math.min(0.995, b.render * c.mult.render);
    return {
        requests,
        wins,
        impressions,
        revenue: (impressions * b.ecpm * c.mult.ecpm) / 1000,
        clicks: impressions * b.ctr * c.mult.ctr,
        bid: wins * b.bid * c.mult.bid,
        floor: impressions * b.floor * c.mult.floor,
    };
};

export interface ReportRow {
    id: string;
    /** The period's label ("2026-11-13", a week's first day, "2026-11"), or the range when totals only. */
    period: string;
    combo: Combo;
    t: Totals;
    /** The same period N days earlier, when Compare is set. */
    prev?: Totals;
}

export interface Query {
    range: Range;
    interval: Interval;
    breakdown: Dim[];
    excluded: Partial<Record<Dim, string[]>>;
    totalsOnly?: boolean;
    compare?: number;
}

/** The report: one row per period and breakdown combination, newest period first. */
export const runQuery = ({ range, interval, breakdown, excluded, totalsOnly, compare }: Query): ReportRow[] => {
    const combos = combosOf(breakdown, excluded);
    const days = rangeDays(range);
    const periods = totalsOnly ? [{ label: `${days[0]} – ${days[days.length - 1]}`, days }] : periodsOf(range, interval);
    return periods.flatMap((p) =>
        combos.map((c) => ({
            id: `${p.label}|${c.key}`,
            period: p.label,
            combo: c,
            t: sumTotals(p.days.map((d) => dayTotals(d, c))),
            prev: compare ? sumTotals(p.days.map((d) => dayTotals(shiftDay(d, compare), c))) : undefined,
        })),
    );
};

/* -------------------------------------------------------- Saved queries --- */

export type ChartKind = "table" | "line" | "area" | "bar" | "stacked" | "pie";

export interface SavedQuery {
    id: string;
    name: string;
    range: Range;
    interval: Interval;
    metrics: Metric[];
    breakdown: Dim[];
    chart: ChartKind;
    /** "Nov 02, 2026". */
    created: string;
    account: string;
    type: "Saved" | "Recommended";
}

const SAMPLE_QUERIES: SavedQuery[] = [
    {
        id: "q1",
        name: "Daily requests and CTR",
        range: "7",
        interval: "day",
        metrics: ["Requests", "CTR"],
        breakdown: [],
        chart: "line",
        created: "Nov 02, 2026",
        account: "Nimbus Exchange",
        type: "Saved",
    },
    {
        id: "q2",
        name: "Revenue by demand source",
        range: "30",
        interval: "week",
        metrics: ["Revenue", "ECPM"],
        breakdown: ["Demand Source"],
        chart: "table",
        created: "Oct 27, 2026",
        account: "Nimbus Exchange",
        type: "Saved",
    },
    {
        id: "q3",
        name: "Fill rate by app",
        range: "14",
        interval: "day",
        metrics: ["Requests", "Impressions", "Fill Rate"],
        breakdown: ["App"],
        chart: "table",
        created: "Oct 19, 2026",
        account: "Test Publisher",
        type: "Saved",
    },
    {
        id: "q4",
        name: "Impressions by country",
        range: "7",
        interval: "day",
        metrics: ["Impressions"],
        breakdown: ["Country"],
        chart: "bar",
        created: "Oct 08, 2026",
        account: "Test Publisher",
        type: "Saved",
    },
    {
        id: "r1",
        name: "Win rate by demand source",
        range: "7",
        interval: "day",
        metrics: ["Requests", "Wins", "Win Rate"],
        breakdown: ["Demand Source"],
        chart: "table",
        created: "Sep 14, 2026",
        account: "Nimbus Exchange",
        type: "Recommended",
    },
    {
        id: "r2",
        name: "Render rate by SDK version",
        range: "14",
        interval: "day",
        metrics: ["Wins", "Impressions", "Render Rate"],
        breakdown: ["SDK Version"],
        chart: "line",
        created: "Sep 14, 2026",
        account: "Nimbus Exchange",
        type: "Recommended",
    },
    {
        id: "r3",
        name: "Revenue by ad type",
        range: "30",
        interval: "week",
        metrics: ["Revenue"],
        breakdown: ["Ad Type"],
        chart: "area",
        created: "Sep 14, 2026",
        account: "Nimbus Exchange",
        type: "Recommended",
    },
];

/** Queries saved in this session join the sample list (no backend; lost on reload). */
let store: SavedQuery[] = SAMPLE_QUERIES;
export const savedQueries = () => store;
export const findQuery = (id: string | null) => (id ? store.find((q) => q.id === id) : undefined);
export const addSavedQuery = (q: Omit<SavedQuery, "id" | "created" | "account" | "type">) => {
    const saved: SavedQuery = { ...q, id: `s${store.length + 1}`, created: longDate(iso(TODAY)), account: "Nimbus Exchange", type: "Saved" };
    store = [saved, ...store];
    return saved;
};
