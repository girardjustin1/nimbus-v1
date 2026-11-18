import { APPS, DEMAND_PARTNERS, PLATFORMS, money, percent, seeded } from "../../sample-data";

/**
 * Nimbus benchmarks — the publisher's own eCPM, win rate and CTR beside the Nimbus
 * Exchange's (Nimbus Performance), and the exchange's top demand partners (Nimbus
 * Leaderboard). Synthesised from seeded(); fictional.
 */

export type BenchMetric = "ECPM" | "ECPM Static" | "ECPM Video" | "Win Rate" | "CTR";
export const BENCH_METRICS: BenchMetric[] = ["ECPM", "ECPM Static", "ECPM Video", "Win Rate", "CTR"];
export const DEFAULT_BENCH_METRICS: BenchMetric[] = ["ECPM", "Win Rate", "CTR"];

/** What the tiles, chart legends and table columns call each metric, as staging does. */
export const BENCH_NAME: Record<BenchMetric, string> = {
    ECPM: "eCPM",
    "ECPM Static": "eCPM Static",
    "ECPM Video": "eCPM Video",
    "Win Rate": "Win Rate",
    CTR: "CTR",
};

/** One hue per metric; Nimbus dashed, mine solid, in the same hue. */
export const BENCH_COLOR: Record<BenchMetric, string> = {
    ECPM: "#2E5AAC",
    "ECPM Static": "#37B6B7",
    "ECPM Video": "#854A0E",
    "Win Rate": "#DA6EA3",
    CTR: "#7F56D9",
};

export const isMoney = (m: BenchMetric) => m.startsWith("ECPM");
export const formatBench = (m: BenchMetric, v: number) => (isMoney(m) ? money(v) : percent(v));
export const axisBench = (m: BenchMetric, v: number) => (isMoney(m) ? `$${v.toFixed(2)}` : `${+v.toFixed(2)}%`);

/** Typical levels: the exchange's and the publisher's, before day-to-day noise. */
const LEVEL: Record<BenchMetric, { nimbus: number; mine: number; spread: number }> = {
    ECPM: { nimbus: 1.19, mine: 1.16, spread: 0.08 },
    "ECPM Static": { nimbus: 0.94, mine: 0.88, spread: 0.07 },
    "ECPM Video": { nimbus: 4.85, mine: 5.1, spread: 0.4 },
    "Win Rate": { nimbus: 38.2, mine: 60.4, spread: 2.4 },
    CTR: { nimbus: 0.79, mine: 0.05, spread: 0.04 },
};

export type BenchRange = "7" | "14" | "30";
export const BENCH_RANGES: { id: BenchRange; label: string }[] = [
    { id: "7", label: "Last 7 days" },
    { id: "14", label: "Last 14 days" },
    { id: "30", label: "Last 30 days" },
];
export type BenchInterval = "day" | "week";
export const BENCH_INTERVALS: { id: BenchInterval; label: string }[] = [
    { id: "day", label: "By Day" },
    { id: "week", label: "By Week" },
];

/** Today is Nov 13, 2026, the end of the sample week; ranges count back from it. */
const END = new Date("2026-11-13T12:00:00");
const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export const rangeDays = (range: BenchRange) =>
    Array.from({ length: Number(range) }, (_, i) => {
        const d = new Date(END);
        d.setDate(END.getDate() - (Number(range) - 1 - i));
        return isoOf(d);
    });

export interface BenchPoint {
    /** ISO date of the day, or of the first day of the week. */
    interval: string;
    days: number;
    nimbus: Record<BenchMetric, number>;
    mine: Record<BenchMetric, number>;
}

const blank = () => Object.fromEntries(BENCH_METRICS.map((m) => [m, 0])) as Record<BenchMetric, number>;

/**
 * The series for a range and interval. `empty` is staging's state for a publisher with no
 * benchmarkable traffic yet: the exchange's figures, and zero for "mine". `filterKey`
 * reseeds the publisher's figures when filters narrow them.
 */
export const benchSeries = (range: BenchRange, interval: BenchInterval, { empty = false, filterKey = "" } = {}): BenchPoint[] => {
    const daily = rangeDays(range).map((iso) => {
        const nimbus = blank();
        const mine = blank();
        for (const m of BENCH_METRICS) {
            const l = LEVEL[m];
            nimbus[m] = l.nimbus + l.spread * (seeded(`n:${m}:${iso}`) - 0.5) * 2;
            mine[m] = empty ? 0 : l.mine + l.spread * 1.4 * (seeded(`m:${m}:${iso}:${filterKey}`) - 0.5) * 2;
        }
        return { interval: iso, days: 1, nimbus, mine };
    });
    if (interval === "day") return daily;
    const weeks: BenchPoint[] = [];
    daily.forEach((d, i) => {
        if (i % 7 === 0) weeks.push({ interval: d.interval, days: 0, nimbus: blank(), mine: blank() });
        const w = weeks[weeks.length - 1];
        w.days += 1;
        for (const m of BENCH_METRICS) {
            w.nimbus[m] += d.nimbus[m];
            w.mine[m] += d.mine[m];
        }
    });
    return weeks.map((w) => ({
        ...w,
        nimbus: Object.fromEntries(BENCH_METRICS.map((m) => [m, w.nimbus[m] / w.days])) as Record<BenchMetric, number>,
        mine: Object.fromEntries(BENCH_METRICS.map((m) => [m, w.mine[m] / w.days])) as Record<BenchMetric, number>,
    }));
};

/** The tiles: each metric's average over the range. */
export const benchAverage = (points: BenchPoint[], side: "nimbus" | "mine", m: BenchMetric) =>
    points.length ? points.reduce((s, p) => s + p[side][m] * p.days, 0) / points.reduce((s, p) => s + p.days, 0) : 0;

export const BENCH_FILTER_DIMS = [
    { id: "app", label: "App", values: APPS },
    { id: "platform", label: "Platform", values: [...PLATFORMS] },
];

/* ------------------------------------------------------------ Leaderboard --- */

/**
 * The exchange's demand partners: the app-wide list plus a few more, because staging's
 * eCPM list runs past twenty. All fictional.
 */
const EXCHANGE_PARTNERS = [
    ...DEMAND_PARTNERS,
    "Aurora Media",
    "Beacon Bidder",
    "Cascade RTB",
    "Driftwood Ads",
    "Ember Exchange",
    "Foxglove DSP",
    "Granite Demand",
];

export type LeaderRange = "7" | "30";
export const LEADER_RANGES: { id: LeaderRange; label: string }[] = [
    { id: "7", label: "Last 7 Days" },
    { id: "30", label: "Last 30 Days" },
];
export const leaderDates = (range: LeaderRange) => {
    const days = rangeDays(range);
    return { start: longDate(days[0]), end: longDate(days[days.length - 1]) };
};

export const LEADER_FILTER_DIMS = [
    { id: "platform", label: "Platform", values: [...PLATFORMS] },
    { id: "format", label: "Ad Type", values: ["Static", "Video"] },
];

export interface Leader {
    name: string;
    value: string;
}

/**
 * Share of Voice: each partner's share of the impressions won across the exchange, top
 * eleven (staging lists the partners at 1% or more). Nimbus+ leads; whole percentages.
 */
export const shareOfVoice = (seed: string): Leader[] => {
    const weights = EXCHANGE_PARTNERS.map((name, i) => ({
        name,
        w: name === "Nimbus+" ? 6 : Math.max(0.15, 3 * Math.pow(0.72, i) * (0.7 + 0.6 * seeded(`sov:${name}:${seed}`))),
    }));
    const total = weights.reduce((s, x) => s + x.w, 0);
    return weights
        .map((x) => ({ name: x.name, pct: (x.w / total) * 100 }))
        .sort((a, b) => b.pct - a.pct)
        .filter((x) => Math.round(x.pct) >= 1)
        .slice(0, 11)
        .map((x) => ({ name: x.name, value: `${Math.round(x.pct)}%` }));
};

/** eCPM: every partner's eCPM across the exchange, highest first — a few high-paying video buyers lead. */
export const ecpmLeaders = (seed: string): Leader[] =>
    EXCHANGE_PARTNERS.map((name, i) => ({
        name,
        v: (i % 5 === 2 ? 3.2 : 1.2) + (i % 7 === 4 ? 6.5 : 0) + 1.1 * seeded(`ecpm:${name}:${seed}`),
    }))
        .sort((a, b) => b.v - a.v)
        .map((x) => ({ name: x.name, value: money(x.v) }));
