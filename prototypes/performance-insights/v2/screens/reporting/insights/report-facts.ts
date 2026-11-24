import { type Dim, type Metric, type Range, formatMetric, metricOf, rangeDays, runQuery } from "./insights-data";

/**
 * Round 2 · C14 and C15: facts about the report, worked out from the same sample data the
 * report shows. The assistant (C14) and the notes beside the chart (C15) only ever quote
 * these: nothing is written that the numbers do not say, and nothing advises.
 */

type Excluded = Partial<Record<Dim, string[]>>;

export const spanOf = (range: Range) => rangeDays(range).length;
export const periodName = (range: Range) => (spanOf(range) === 1 ? "the day before" : `the previous ${spanOf(range)} days`);

const pct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v * 100).toFixed(1)}%`;

export interface Change {
    now: number;
    before: number;
    change: number;
}

/** A metric for the whole range against the same span just before it. */
export const changeOf = (metric: Metric, range: Range, excluded: Excluded): Change => {
    const r = runQuery({ range, interval: "day", breakdown: [], excluded, totalsOnly: true, compare: spanOf(range) })[0];
    if (!r) return { now: 0, before: 0, change: 0 };
    const now = metricOf(metric, r.t);
    const before = r.prev ? metricOf(metric, r.prev) : now;
    return { now, before, change: before ? (now - before) / before : 0 };
};

export interface Row {
    value: string;
    now: number;
    before: number;
    /** Change against the previous span, as a share. */
    change: number;
    /** The value's share of the total, for additive metrics. */
    share: number;
}

/** One metric per value of a breakdown, now and before, largest first. */
export const rowsBy = (dim: Dim, metric: Metric, range: Range, excluded: Excluded): Row[] => {
    const rows = runQuery({ range, interval: "day", breakdown: [dim], excluded, totalsOnly: true, compare: spanOf(range) });
    const total = rows.reduce((n, r) => n + metricOf(metric, r.t), 0);
    return rows
        .map((r) => {
            const now = metricOf(metric, r.t);
            const before = r.prev ? metricOf(metric, r.prev) : now;
            return { value: r.combo.values[0], now, before, change: before ? (now - before) / before : 0, share: total ? now / total : 0 };
        })
        .sort((a, b) => b.now - a.now);
};

/** The values that moved the total most, by the size of their change in the metric's own units. */
export const moversBy = (dim: Dim, metric: Metric, range: Range, excluded: Excluded, n = 3): Row[] =>
    [...rowsBy(dim, metric, range, excluded)].sort((a, b) => Math.abs(b.now - b.before) - Math.abs(a.now - a.before)).slice(0, n);

/** The day the metric was highest in the range. */
export const bestDay = (metric: Metric, range: Range, excluded: Excluded) => {
    const days = runQuery({ range, interval: "day", breakdown: [], excluded });
    const best = [...days].sort((a, b) => metricOf(metric, b.t) - metricOf(metric, a.t))[0];
    return best ? { day: best.period, value: metricOf(metric, best.t) } : null;
};

/** A line of fact, with the figures already formatted. */
export interface Fact {
    id: string;
    title: string;
    detail: string;
    /** "up" and "down" colour the figure; "flat" leaves it neutral. */
    trend: "up" | "down" | "flat";
}

const trendOf = (change: number): Fact["trend"] => (Math.abs(change) < 0.0005 ? "flat" : change > 0 ? "up" : "down");

/** C15: what changed in the range, in three lines. */
export const reportFacts = (range: Range, excluded: Excluded): Fact[] => {
    // Filters that match nothing: there is nothing to say.
    if (!runQuery({ range, interval: "day", breakdown: [], excluded, totalsOnly: true }).length) return [];
    const revenue = changeOf("Revenue", range, excluded);
    const platforms = rowsBy("Platform", "Revenue", range, excluded);
    const mover = moversBy("Demand Source", "Revenue", range, excluded, 1)[0];
    const fill = rowsBy("Ad Type", "Fill Rate", range, excluded).sort((a, b) => a.now - b.now)[0];
    const day = bestDay("Revenue", range, excluded);
    const facts: Fact[] = [
        {
            id: "revenue",
            title: `Revenue ${pct(revenue.change)} vs ${periodName(range)}`,
            detail: `${formatMetric("Revenue", revenue.now)}, from ${formatMetric("Revenue", revenue.before)}. ${platforms
                .map((p) => `${p.value} ${pct(p.change)}`)
                .join(", ")}.`,
            trend: trendOf(revenue.change),
        },
    ];
    if (mover)
        facts.push({
            id: "mover",
            title: `${mover.value} moved revenue most`,
            detail: `${formatMetric("Revenue", mover.now)}, ${pct(mover.change)} vs ${periodName(range)}, ${(mover.share * 100).toFixed(1)}% of revenue.`,
            trend: trendOf(mover.change),
        });
    if (fill)
        facts.push({
            id: "fill",
            title: `Lowest fill rate: ${fill.value}`,
            detail: `${formatMetric("Fill Rate", fill.now)} fill, ${pct(fill.change)} vs ${periodName(range)}.`,
            trend: trendOf(fill.change),
        });
    if (day) facts.push({ id: "best-day", title: `Best day: ${day.day}`, detail: `${formatMetric("Revenue", day.value)} in revenue.`, trend: "flat" });
    return facts;
};

export const formatChange = pct;
