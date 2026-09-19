/**
 * Explorer — a tiny in-browser "warehouse" so the pivot reacts to any layout.
 *
 * One fictional fact row per App × Demand Source × Country × Ad Unit × Week, carrying
 * additive measures (revenue, impressions, requests, bids, clicks). Rate metrics are
 * derived after aggregation (eCPM = revenue / impressions × 1000, etc.), so any
 * roll-up is consistent. App × Week totals are scaled to the Round 1 pivot figures.
 */

import { pivot, weeks } from "./pi-data";

export const dimensionValues = {
    App: pivot.map((p) => p.app),
    "Demand Source": ["Nimbus+", "Magnite", "Index Exchange", "PubMatic", "APS"],
    Country: ["United States", "Canada", "United Kingdom", "Germany", "Brazil"],
    Platform: ["iOS", "Android", "Web"],
    "Ad Unit": ["Banner", "Interstitial", "Rewarded video"],
    Week: weeks.map((w) => `Week of ${w}`),
    Month: ["August", "September"],
} as const;

export type Dimension = keyof typeof dimensionValues;
export const dimensions = Object.keys(dimensionValues) as Dimension[];
export const timeDimensions: Dimension[] = ["Week", "Month"];

export const metrics = ["Revenue", "Impressions", "eCPM", "Requests", "Fill Rate", "Win Rate", "Clicks", "CTR"] as const;
export type Metric = (typeof metrics)[number];
export type Field = Dimension | Metric;

export const isMetric = (f: string): f is Metric => (metrics as readonly string[]).includes(f);

interface Measures {
    revenue: number;
    impressions: number;
    requests: number;
    bids: number;
    clicks: number;
}

type Fact = Record<Dimension, string> & Measures;

/* Deterministic noise so the numbers look real but never change between reloads. */
const noise = (key: string) => {
    let h = 2166136261;
    for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 16777619);
    return 0.85 + ((h >>> 0) % 1000) / 1000 / 3.33; // 0.85 – 1.15
};

const sourceShare = [0.46, 0.22, 0.19, 0.075, 0.055];
const sourceEcpm = [3.42, 2.18, 2.05, 1.64, 3.1];
const sourceFill = [0.71, 0.48, 0.44, 0.21, 0.09];
const countryShare = [0.52, 0.12, 0.14, 0.1, 0.12];
const countryEcpm = [1.25, 1.0, 1.05, 0.95, 0.4];
const unitShare = [0.3, 0.45, 0.25];
const unitEcpm = [0.45, 1.3, 2.2];
const unitCtr = [0.004, 0.012, 0.018];

const platformOf = (app: string) => (app.includes("(iOS)") ? "iOS" : app.includes("(Android)") ? "Android" : "Web");
const monthOf = (weekIndex: number) => (weekIndex < 2 ? "August" : "September");

export const facts: Fact[] = pivot.flatMap((app) =>
    dimensionValues["Demand Source"].flatMap((source, si) =>
        dimensionValues.Country.flatMap((country, ci) =>
            dimensionValues["Ad Unit"].flatMap((unit, ui) =>
                dimensionValues.Week.map((week, wi) => {
                    const key = `${app.app}|${source}|${country}|${unit}|${week}`;
                    const revenue = app.values[wi] * sourceShare[si] * countryShare[ci] * unitShare[ui] * noise(key);
                    const ecpm = sourceEcpm[si] * countryEcpm[ci] * unitEcpm[ui] * noise(`${key}|e`);
                    const impressions = (revenue / ecpm) * 1000;
                    const fill = Math.min(0.95, sourceFill[si] * noise(`${key}|f`));
                    const requests = impressions / fill;
                    const winRate = Math.min(0.97, fill + 0.15);
                    return {
                        App: app.app,
                        "Demand Source": source,
                        Country: country,
                        Platform: platformOf(app.app),
                        "Ad Unit": unit,
                        Week: week,
                        Month: monthOf(wi),
                        revenue,
                        impressions,
                        requests,
                        bids: impressions / winRate,
                        clicks: impressions * unitCtr[ui] * noise(`${key}|c`),
                    };
                }),
            ),
        ),
    ),
);

const empty = (): Measures => ({ revenue: 0, impressions: 0, requests: 0, bids: 0, clicks: 0 });
const add = (a: Measures, b: Measures) => {
    a.revenue += b.revenue;
    a.impressions += b.impressions;
    a.requests += b.requests;
    a.bids += b.bids;
    a.clicks += b.clicks;
};

export const metricValue = (m: Metric, x: Measures): number => {
    switch (m) {
        case "Revenue":
            return x.revenue;
        case "Impressions":
            return x.impressions;
        case "Requests":
            return x.requests;
        case "Clicks":
            return x.clicks;
        case "eCPM":
            return x.impressions ? (x.revenue / x.impressions) * 1000 : 0;
        case "Fill Rate":
            return x.requests ? x.impressions / x.requests : 0;
        case "Win Rate":
            return x.bids ? x.impressions / x.bids : 0;
        case "CTR":
            return x.impressions ? x.clicks / x.impressions : 0;
    }
};

export const formatMetric = (m: Metric, v: number) => {
    switch (m) {
        case "Revenue":
            return `$${Math.round(v).toLocaleString("en-US")}`;
        case "eCPM":
            return `$${v.toFixed(2)}`;
        case "Fill Rate":
        case "Win Rate":
            return `${(v * 100).toFixed(1)}%`;
        case "CTR":
            return `${(v * 100).toFixed(2)}%`;
        default:
            return v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)}M` : v >= 10_000 ? `${(v / 1000).toFixed(1)}K` : Math.round(v).toLocaleString("en-US");
    }
};

/* ------------------------------------------------------------------ Pivot --- */

export interface Layout {
    rows: Dimension[];
    columns: Dimension[];
    values: Metric[];
    /** Dimension → allowed values (missing = all). */
    filters: Partial<Record<Dimension, string[]>>;
}

export interface PivotNode {
    key: string;
    label: string;
    depth: number;
    /** Aggregated measures per column key. */
    cells: Map<string, Measures>;
    total: Measures;
    children: PivotNode[];
}

export interface PivotResult {
    columnKeys: { key: string; labels: string[] }[];
    rows: PivotNode[];
    grand: { cells: Map<string, Measures>; total: Measures };
    factCount: number;
}

const SEP = " › ";

/** Ordered distinct values of the column dimensions that actually occur. */
const columnKeysFor = (columns: Dimension[], rows: Fact[]) => {
    if (!columns.length) return [{ key: "", labels: [] as string[] }];
    const seen = new Set(rows.map((f) => columns.map((c) => f[c]).join(SEP)));
    const product = columns.reduce<string[][]>((acc, c) => acc.flatMap((prefix) => dimensionValues[c].map((v) => [...prefix, v])), [[]]);
    return product.filter((labels) => seen.has(labels.join(SEP))).map((labels) => ({ key: labels.join(SEP), labels }));
};

export const buildPivot = (layout: Layout): PivotResult => {
    const filtered = facts.filter((f) => Object.entries(layout.filters).every(([d, allowed]) => !allowed || allowed.includes(f[d as Dimension])));
    const columnKeys = columnKeysFor(layout.columns, filtered);
    const sortMetric = layout.values[0] ?? "Revenue";

    const grand = { cells: new Map<string, Measures>(), total: empty() };
    type Draft = { node: Omit<PivotNode, "children">; kids: Map<string, Draft> };
    const roots = new Map<string, Draft>();

    for (const f of filtered) {
        const colKey = layout.columns.map((c) => f[c]).join(SEP);
        if (!grand.cells.has(colKey)) grand.cells.set(colKey, empty());
        add(grand.cells.get(colKey)!, f);
        add(grand.total, f);

        let level = roots;
        let path = "";
        layout.rows.forEach((dim, depth) => {
            const label = f[dim];
            path = path ? `${path}${SEP}${label}` : label;
            let draft = level.get(label);
            if (!draft) {
                draft = { node: { key: path, label, depth, cells: new Map(), total: empty() }, kids: new Map() };
                level.set(label, draft);
            }
            if (!draft.node.cells.has(colKey)) draft.node.cells.set(colKey, empty());
            add(draft.node.cells.get(colKey)!, f);
            add(draft.node.total, f);
            level = draft.kids;
        });
    }

    /* Materialise children and sort each level by the first value metric, biggest first. */
    const finish = (map: Map<string, Draft>): PivotNode[] =>
        [...map.values()]
            .map(({ node, kids }) => ({ ...node, children: finish(kids) }))
            .sort((a, b) => metricValue(sortMetric, b.total) - metricValue(sortMetric, a.total));

    return { columnKeys, rows: finish(roots), grand, factCount: filtered.length };
};

/* --------------------------------------------------------- Link encoding --- */

const list = (s: string | null) => (s ? s.split(",").filter(Boolean) : []);

export const layoutToParams = (l: Layout) => ({
    rows: l.rows.join(",") || undefined,
    cols: l.columns.join(",") || undefined,
    vals: l.values.join(",") || undefined,
    filter:
        Object.entries(l.filters)
            .map(([d, v]) => `${d}:${(v ?? []).join("|")}`)
            .join(";") || undefined,
});

export const layoutFromParams = (p: URLSearchParams): Layout | undefined => {
    if (!p.has("rows") && !p.has("cols") && !p.has("vals") && !p.has("filter")) return undefined;
    const dims = (xs: string[]) => xs.filter((x): x is Dimension => (dimensions as string[]).includes(x));
    const filters: Layout["filters"] = {};
    for (const part of (p.get("filter") ?? "").split(";").filter(Boolean)) {
        const [d, v] = part.split(":");
        if ((dimensions as string[]).includes(d)) filters[d as Dimension] = (v ?? "").split("|").filter(Boolean);
    }
    return { rows: dims(list(p.get("rows"))), columns: dims(list(p.get("cols"))), values: list(p.get("vals")).filter(isMetric), filters };
};
