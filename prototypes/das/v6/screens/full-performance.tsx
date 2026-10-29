import { useMemo, useState } from "react";
import { TrendUp01 } from "@untitledui/icons";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { downloadCsv } from "./batch-data";
import { type Campaign, appPlatform, compact, flightRange, usd } from "./campaign-data";
import { axis, dailyDelivery, flightDay, useCampaign, wobble } from "./campaign-series";
import { BreadcrumbStrip, ChartTooltip, TrueUp } from "./campaign-ui";
import { DasShell, PINK, TEAL } from "./das-shell";
import { V3_NAV_ITEMS } from "./nav";
import {
    Band,
    Bands,
    BareSelect,
    ChartTypeBar,
    type ChartTypeOption,
    CollapseButton,
    DEFAULT_CHART_ICONS,
    DateCell,
    DateRow,
    FilterControl,
    type FilterState,
    REPORT_STRIPE,
    StateAction,
    TABLE,
    filterExcluded,
    tableHead,
} from "./nimbus-ui";
import { languageLabel } from "./target-data";
import { LABEL } from "./type-rules";

/**
 * Full performance — the third screen: Manage campaigns → campaign overview → this.
 *
 * 16 Oct: a chart you can break down by everything the campaign targets and every
 * creative in it, two at a time, with no summary panel and a CSV of whatever view is on
 * screen.
 *
 * 19 Oct, Product's calls:
 *   - The builder sits across the top, in Performance Insights' look: a date row with
 *     START DATE / END DATE, a range and an interval, then labelled rows — Metrics,
 *     Breakdown, Filters (+ ADD), Chart Type — with pink uppercase actions and teal for
 *     what is selected. Held to Round 4's type rules, so nothing is under 15px.
 *   - Keywords match on ANY, like geos. Each keyword is its own row; an impression that
 *     matches more than one counts under the first it matched, so the rows add up.
 *   - Unity is a platform, and Device Language is a breakdown again.
 *
 * 26 Oct, Product's calls (Round 5 — the look, not the content):
 *   - Performance Insights' pieces, from ./nimbus-ui, so one rule change later fixes
 *     both: full-bleed bands instead of a rounded card (date row, Metrics, Breakdown,
 *     Filters, Chart Type), each with its band label; teal checkboxes, not pink.
 *   - Dates use Performance Insights' START DATE / END DATE token even though they aren't
 *     selectable here. "All reports are in UTC.", a Collapse control for the bands, and
 *     Download .CSV as a state action — inactive until a metric is ticked.
 *   - Filters is Performance Insights' filter menu: + ADD → category and values → SAVE.
 *     Saved values become checkboxes to toggle one off and compare (iOS against
 *     Android); the ✕ at the far right clears them all. The old chip UI is gone.
 *   - Chart type buttons fill the band, in staging's tab style with the Sketch-file
 *     chart icons (27 Oct; the shared ChartTypeBar).
 *   - The results table is a report, so it takes the charcoal header and alternating
 *     warm rows, full bleed like staging.
 *
 * 28 Oct review (Round 6), Product's calls:
 *   - Full performance stays in the DAS section; Performance Insights keeps DAS at deal
 *     and campaign level only.
 *   - Metrics: Revenue (was Spend; the trued-up figure, so it says "Subject to true-up"),
 *     Impressions and eCPM, plus Render rate, Clicks and CTR. View-through has a place
 *     but stays off until engineering confirms DAS has it. Nothing that needs a request
 *     (fill rate, win rate): a request can't be told apart as DAS or Open Marketplace.
 *   - Breakdowns: Creative, Platform, App, Keyword and Device Language as before, plus
 *     Account, Account manager, App category and Position, and Geo as two splits,
 *     Region (North America bundles the US, Canada and Mexico) and Country.
 *
 * Per-keyword figures are on screen: Product chose that over the charter's CSV-only
 * guardrail on 19 Oct ("the harder design"). `keywordMode="csv"` still draws the
 * charter's version for the record in Storybook.
 *
 * All figures are synthesised from the campaign's totals so every breakdown adds up.
 */

export type KeywordMode = "screen" | "csv";
export type Dim =
    "Creative" | "Platform" | "Region" | "Country" | "App" | "App category" | "Account" | "Account manager" | "Position" | "Keyword" | "Device Language";
export type Metric = "Revenue" | "Impressions" | "eCPM" | "Render rate" | "Clicks" | "CTR";
export type ChartKind = "table" | "line" | "area" | "bar" | "stacked" | "pie";
type Range = "flight" | "14" | "7";
type Interval = "day" | "week";

const DIMS: Dim[] = [
    "Creative",
    "Platform",
    "Region",
    "Country",
    "App",
    "App category",
    "Account",
    "Account manager",
    "Position",
    "Keyword",
    "Device Language",
];
const METRICS: Metric[] = ["Revenue", "Impressions", "eCPM", "Render rate", "Clicks", "CTR"];
/** Rates: they don't add up, so they don't stack or split into a pie. */
const RATES: Metric[] = ["eCPM", "Render rate", "CTR"];
/** Fallback has no budget, so no revenue or eCPM to report. */
const FALLBACK_METRICS: Metric[] = ["Impressions", "Render rate", "Clicks", "CTR"];
const SERIES_COLORS = [TEAL, PINK, "#7F56D9", "#F79009", "#2E90FA", "#667085"];
const MAX_BREAKDOWN = 2;
const NONE = Object.fromEntries(DIMS.map((d) => [d, []])) as unknown as Record<Dim, string[]>;

/* ------------------------------------------------------------ The cube --- */

/** Deterministic 0–1 from a string, so the same slice always gets the same share. */
const hash01 = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return ((h >>> 0) % 1000) / 1000;
};

/* Sample lookups for the new breakdowns. Fictional, like every other figure here. */

const REGION: Record<string, string> = { "United States": "North America", Canada: "North America", Mexico: "North America", "United Kingdom": "Europe" };

const APP_CATEGORY: Record<string, string> = {
    "Daily Scores": "Sports",
    "Match Report": "Sports",
    "Xtra Innings": "Sports",
    "Night Sky": "Education",
    "Quiz Night": "Trivia",
    "Vinyl Crate": "Music",
    "Pocket Radio": "Music",
    "Commute Cast": "News",
    "Urban Transit": "Navigation",
    "Zen Garden": "Lifestyle",
    "Recipe Box": "Food & Drink",
    "Trail Tracker": "Health & Fitness",
    "Fit Log": "Health & Fitness",
    "Budget Jar": "Finance",
    "Garage Sale": "Shopping",
    "Word Streak": "Word",
};

const ACCOUNT: Record<string, string> = {
    "Daily Scores": "Scoreline Media",
    "Match Report": "Scoreline Media",
    "Xtra Innings": "Scoreline Media",
    "Night Sky": "Northlight Apps",
    "Quiz Night": "Northlight Apps",
    "Vinyl Crate": "Northlight Apps",
    "Word Streak": "Northlight Apps",
    "Commute Cast": "Metro Mobile",
    "Urban Transit": "Metro Mobile",
    "Pocket Radio": "Metro Mobile",
    "Zen Garden": "Greenleaf Studio",
    "Recipe Box": "Greenleaf Studio",
    "Trail Tracker": "Stride Labs",
    "Fit Log": "Stride Labs",
    "Budget Jar": "Pennywise Apps",
    "Garage Sale": "Pennywise Apps",
};

const ACCOUNT_MANAGER: Record<string, string> = {
    "Scoreline Media": "Avery Chen",
    "Northlight Apps": "Jordan Diaz",
    "Metro Mobile": "Avery Chen",
    "Greenleaf Studio": "Riley Park",
    "Stride Labs": "Jordan Diaz",
    "Pennywise Apps": "Riley Park",
};

/** Positions are named by the publisher, per ad unit. */
const POSITIONS: Record<string, string[]> = {
    Interstitial: ["Level end", "Post-game"],
    Inline: ["Home feed", "Article body"],
    Rewarded: ["Bonus reward"],
    "Dynamic Unit": ["Home feed"],
};

const bareApp = (app: string) => app.replace(/\s*\((iOS|Android|Unity)\)$/, "");

/** The dimensions the cube is built from; the rest follow from these. */
type BaseDim = "Creative" | "Platform" | "Country" | "App" | "Position" | "Keyword" | "Device Language";
const BASE: BaseDim[] = ["Creative", "Platform", "Country", "App", "Position", "Keyword", "Device Language"];

const derive = (cell: Record<BaseDim, string>): Record<Exclude<Dim, BaseDim>, string> => {
    const app = bareApp(cell.App);
    const account = ACCOUNT[app] ?? "All accounts";
    return {
        Region: REGION[cell.Country] ?? "Rest of world",
        "App category": APP_CATEGORY[app] ?? "All categories",
        Account: account,
        "Account manager": ACCOUNT_MANAGER[account] ?? "Unassigned",
    };
};

const baseValues = (c: Campaign, dim: BaseDim): string[] => {
    switch (dim) {
        case "Creative":
            return c.creativeList.map((cr) => cr.name);
        case "Platform":
            return c.platforms.split(", ");
        case "Country":
            return c.geos === "All" ? ["United States", "Canada", "Other"] : c.geos.split(", ");
        case "App":
            return c.apps.length ? c.apps : ["All apps"];
        case "Position":
            return [...new Set(c.adUnits.flatMap((u) => POSITIONS[u] ?? [u]))];
        case "Keyword":
            return c.keywords.length ? c.keywords : ["No keyword targeting"];
        case "Device Language":
            // Untargeted campaigns still serve in some languages; report what they served in.
            return c.languages.length ? c.languages.map(languageLabel) : ["English (en)", "Spanish (es)", "Other"];
    }
};

/** Every value a dimension takes for this campaign, derived ones included. */
const dimValues = (c: Campaign, dim: Dim): string[] => {
    if ((BASE as Dim[]).includes(dim)) return baseValues(c, dim as BaseDim);
    const derived = dim as Exclude<Dim, BaseDim>;
    const apps = baseValues(c, "App");
    const countries = baseValues(c, "Country");
    const out =
        derived === "Region"
            ? countries.map((country) => derive({ Country: country, App: apps[0] } as Record<BaseDim, string>).Region)
            : apps.map((app) => derive({ Country: countries[0], App: app } as Record<BaseDim, string>)[derived]);
    return [...new Set(out)];
};

type Cell = Record<Dim, string> & { weight: number; ecpm: number; ctr: number; renderRate: number };

/**
 * Every combination of the campaign's targeting, each with its share of delivery. An app
 * only runs on its own platform, so "Daily Scores (iOS)" never meets Android.
 */
const buildCube = (c: Campaign): Cell[] => {
    let rows: Partial<Record<BaseDim, string>>[] = [{}];
    for (const dim of BASE) rows = rows.flatMap((r) => baseValues(c, dim).map((v) => ({ ...r, [dim]: v })));
    const cells = rows
        .filter((r) => {
            const p = r.App ? appPlatform(r.App) : undefined;
            return !p || p === r.Platform;
        })
        .map((r) => {
            const base = r as Record<BaseDim, string>;
            const w = BASE.reduce((acc, d) => acc * (0.5 + hash01(`${d}:${base[d]}`)), 1);
            const key = BASE.map((d) => base[d]).join("|");
            return {
                ...base,
                ...derive(base),
                weight: w,
                ecpm: c.ecpm * (0.85 + 0.3 * hash01(key)),
                // Sample rates: clicks 0.4–1.6% of impressions; 90–98% of won ads render.
                ctr: 0.004 + 0.012 * hash01(`ctr:${key}`),
                renderRate: 0.9 + 0.08 * hash01(`render:${key}`),
            };
        });
    const total = cells.reduce((s, x) => s + x.weight, 0) || 1;
    return cells.map((x) => ({ ...x, weight: x.weight / total }));
};

interface Totals {
    spend: number;
    impressions: number;
    clicks: number;
    /** Ads won; rendered ones are impressions, so render rate = impressions ÷ won. */
    won: number;
}

interface Group extends Totals {
    key: string;
    values: string[];
    daily: Totals[];
}

const zero = (): Totals => ({ spend: 0, impressions: 0, clicks: 0, won: 0 });

const aggregate = (c: Campaign, cube: Cell[], breakdown: Dim[], excluded: Record<Dim, string[]>, range: Range) => {
    const fallback = c.rule === "Fallback";
    const daily = dailyDelivery(c);
    const from = range === "flight" ? 0 : Math.max(0, daily.length - Number(range));
    const days = daily.slice(from).map((v, i) => ({ v, i: i + from }));
    const kept = cube.filter((cell) => DIMS.every((d) => !excluded[d].includes(cell[d])));
    // Each slice wobbles day to day; normalising per day over the whole cube keeps every
    // breakdown summing to the campaign's real total.
    const wob = (cell: Cell, i: number) => cell.weight * (0.9 + 0.2 * wobble(i + cell.weight * 1000));
    const dayNorm = days.map(({ i }) => cube.reduce((s, cell) => s + wob(cell, i), 0) || 1);

    const groups = new Map<string, Group>();
    for (const cell of kept) {
        const values = breakdown.map((d) => cell[d]);
        const key = values.join(" · ") || "All delivery";
        const g = groups.get(key) ?? { key, values, ...zero(), daily: days.map(zero) };
        days.forEach(({ v, i }, j) => {
            const share = wob(cell, i) / dayNorm[j];
            const spend = fallback ? 0 : v * share;
            const impressions = fallback ? v * share : (spend / cell.ecpm) * 1000;
            const add = { spend, impressions, clicks: impressions * cell.ctr, won: impressions / cell.renderRate };
            for (const t of [g.daily[j], g] as Totals[]) {
                t.spend += add.spend;
                t.impressions += add.impressions;
                t.clicks += add.clicks;
                t.won += add.won;
            }
        });
        groups.set(key, g);
    }
    return { groups: [...groups.values()].sort((a, b) => (fallback ? b.impressions - a.impressions : b.spend - a.spend)), days };
};

const sum = (list: Totals[]): Totals =>
    list.reduce((a, t) => ({ spend: a.spend + t.spend, impressions: a.impressions + t.impressions, clicks: a.clicks + t.clicks, won: a.won + t.won }), zero());

const metricOf = (m: Metric, t: Totals) => {
    switch (m) {
        case "Revenue":
            return t.spend;
        case "Impressions":
            return t.impressions;
        case "eCPM":
            return t.impressions ? (t.spend / t.impressions) * 1000 : 0;
        case "Render rate":
            return t.won ? (t.impressions / t.won) * 100 : 0;
        case "Clicks":
            return t.clicks;
        case "CTR":
            return t.impressions ? (t.clicks / t.impressions) * 100 : 0;
    }
};
const formatMetric = (m: Metric, v: number) => {
    if (m === "Revenue") return usd(v);
    if (m === "eCPM") return usd(v, 2);
    if (m === "Render rate") return `${v.toFixed(1)}%`;
    if (m === "CTR") return `${v.toFixed(2)}%`;
    return Math.round(v).toLocaleString("en-US");
};
const axisMetric = (m: Metric, v: number) => {
    if (m === "Revenue") return `$${compact(v)}`;
    if (m === "eCPM") return `$${v.toFixed(2)}`;
    if (m === "Render rate" || m === "CTR") return `${v.toFixed(m === "CTR" ? 1 : 0)}%`;
    return compact(v);
};
/** CSV keeps raw figures: counts whole, money and rates to two places. */
const csvMetric = (m: Metric, t: Totals) => (m === "Impressions" || m === "Clicks" ? String(Math.round(metricOf(m, t))) : metricOf(m, t).toFixed(2));

/* -------------------------------------------------------- Chart types --- */

/** The chart types, with the Sketch-file chart icons. */
const CHART_TYPES: ChartTypeOption<ChartKind>[] = [
    { id: "table", label: "Table", icon: DEFAULT_CHART_ICONS.table },
    { id: "line", label: "Line", icon: DEFAULT_CHART_ICONS.line },
    { id: "area", label: "Area", icon: DEFAULT_CHART_ICONS.area },
    { id: "bar", label: "Bar", icon: DEFAULT_CHART_ICONS.bar },
    { id: "stacked", label: "Stacked bar", icon: DEFAULT_CHART_ICONS.stacked },
    { id: "pie", label: "Pie", icon: DEFAULT_CHART_ICONS.pie },
];

/* --------------------------------------------------------------- Page --- */

export const FullPerformance = ({
    id = "c1",
    keywordMode = "screen",
    breakdown: initialBreakdown = ["Creative"],
    metrics: initialMetrics = ["Revenue", "Impressions"],
    chart: initialChart = "line",
}: {
    id?: string;
    keywordMode?: KeywordMode;
    breakdown?: Dim[];
    metrics?: Metric[];
    chart?: ChartKind;
}) => {
    const c = useCampaign(id);
    const fallback = c.rule === "Fallback";
    const available = DIMS.filter((d) => !(keywordMode === "csv" && d === "Keyword"));
    const [range, setRange] = useState<Range>("flight");
    const [interval, setPeriod] = useState<Interval>("day");
    const [metrics, setMetrics] = useState<Metric[]>(fallback ? ["Impressions"] : initialMetrics);
    const [breakdown, setBreakdown] = useState<Dim[]>(initialBreakdown.filter((d) => available.includes(d)));
    const [filters, setFilters] = useState<FilterState>({});
    const [collapsed, setCollapsed] = useState(false);
    const [chart, setChart] = useState<ChartKind>(initialChart);

    const filterDims = useMemo(() => available.map((d) => ({ id: d, label: d, values: dimValues(c, d) })), [c, keywordMode]); // eslint-disable-line react-hooks/exhaustive-deps
    const excluded = useMemo(() => ({ ...NONE, ...filterExcluded(filterDims, filters) }) as Record<Dim, string[]>, [filterDims, filters]);

    const cube = useMemo(() => buildCube(c), [c]);
    const { groups, days } = useMemo(() => aggregate(c, cube, breakdown, excluded, range), [c, cube, breakdown, excluded, range]);
    const shown = groups.slice(0, SERIES_COLORS.length);
    const total = sum(groups);
    const totalSpend = total.spend;
    const totalImps = total.impressions;
    const filtered = DIMS.some((d) => excluded[d].length);
    const ordered = METRICS.filter((m) => metrics.includes(m));
    const chartMetric = ordered[0];
    // Rates don't add up, so they don't stack or slice into a pie.
    const rateOnly = RATES.includes(chartMetric) && (chart === "stacked" || chart === "pie");

    const toggleMetric = (m: Metric) => setMetrics((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
    const toggleDim = (d: Dim) => setBreakdown((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : cur.length >= MAX_BREAKDOWN ? cur : [...cur, d]));

    const slug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const exportCsv = () =>
        downloadCsv(
            `${slug}-performance`,
            [...(breakdown.length ? breakdown : ["Slice"]), ...ordered, "Share"],
            groups.map((g) => [
                ...(breakdown.length ? g.values : [g.key]),
                ...ordered.map((m) => csvMetric(m, g)),
                `${((fallback ? g.impressions / (totalImps || 1) : g.spend / (totalSpend || 1)) * 100 || 0).toFixed(1)}%`,
            ]),
        );
    const exportByKeyword = () => {
        const { groups: kw } = aggregate(c, cube, ["Keyword"], excluded, range);
        const cols: Metric[] = ["Revenue", "Impressions", "eCPM", "Clicks", "CTR"];
        downloadCsv(
            `${slug}-by-keyword`,
            ["Keyword", ...cols],
            kw.map((g) => [g.values[0], ...cols.map((m) => csvMetric(m, g))]),
        );
    };

    const crumbs = [{ label: "Campaigns", href: "#/campaigns" }, { label: c.name, href: `#/view-a?c=${c.id}` }, { label: "Full performance" }];

    if (c.status === "Scheduled")
        return (
            <DasShell navItems={V3_NAV_ITEMS} navKey="manage campaigns">
                <BreadcrumbStrip trail={crumbs} />
                <div className="px-8 py-8">
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-secondary px-6 py-16 text-center">
                        <TrendUp01 className="size-6 text-fg-quaternary" aria-hidden="true" />
                        <p className="text-md font-semibold text-primary">Performance appears after the first day of delivery</p>
                        <p className="max-w-md text-md text-tertiary">
                            {c.name} starts {c.start}. From then you can break it down by creative, platform, region, country, app, account, position, keyword,
                            device language and more.
                        </p>
                    </div>
                </div>
            </DasShell>
        );

    /* -------- series -------- */

    const periods = (() => {
        const perDay = days.map(({ i }, j) => ({ label: flightDay(c, i), j }));
        if (interval === "day") return perDay.map((d) => ({ label: d.label, js: [d.j] }));
        const weeks: { label: string; js: number[] }[] = [];
        perDay.forEach((d, k) => {
            if (k % 7 === 0) weeks.push({ label: `Week of ${d.label}`, js: [] });
            weeks[weeks.length - 1].js.push(d.j);
        });
        return weeks;
    })();

    const seriesData = periods.map((p) => {
        const row: Record<string, string | number> = { period: p.label };
        for (const g of shown) {
            row[g.key] = chartMetric ? +metricOf(chartMetric, sum(p.js.map((j) => g.daily[j]))).toFixed(2) : 0;
        }
        return row;
    });
    const totalsData = shown.map((g) => ({ name: g.key, value: chartMetric ? +metricOf(chartMetric, g).toFixed(2) : 0 }));
    const tooltip = <ChartTooltip format={(v) => (chartMetric ? formatMetric(chartMetric, v) : String(v))} />;
    const xTicks = { ...axis, interval: Math.max(0, Math.round(periods.length / 6) - 1) };

    const chartBody = (() => {
        if (chart === "line")
            return (
                <LineChart data={seriesData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                    <XAxis dataKey="period" {...xTicks} />
                    <YAxis {...axis} width={64} tickFormatter={(v: number) => axisMetric(chartMetric, v)} />
                    <Tooltip content={tooltip} />
                    {shown.map((g, i) => (
                        <Line key={g.key} dataKey={g.key} stroke={SERIES_COLORS[i]} strokeWidth={2} dot={false} isAnimationActive={false} />
                    ))}
                </LineChart>
            );
        if (chart === "area")
            return (
                <AreaChart data={seriesData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                    <XAxis dataKey="period" {...xTicks} />
                    <YAxis {...axis} width={64} tickFormatter={(v: number) => axisMetric(chartMetric, v)} />
                    <Tooltip content={tooltip} />
                    {shown.map((g, i) => (
                        <Area
                            key={g.key}
                            dataKey={g.key}
                            stroke={SERIES_COLORS[i]}
                            fill={SERIES_COLORS[i]}
                            fillOpacity={0.12}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />
                    ))}
                </AreaChart>
            );
        if (chart === "stacked")
            return (
                <BarChart data={seriesData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                    <XAxis dataKey="period" {...xTicks} />
                    <YAxis {...axis} width={64} tickFormatter={(v: number) => axisMetric(chartMetric, v)} />
                    <Tooltip content={tooltip} cursor={{ fill: "#F2F4F7" }} />
                    {shown.map((g, i) => (
                        <Bar key={g.key} dataKey={g.key} stackId="s" fill={SERIES_COLORS[i]} isAnimationActive={false} />
                    ))}
                </BarChart>
            );
        if (chart === "pie")
            return (
                <PieChart>
                    <Tooltip content={tooltip} />
                    <Pie data={totalsData} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="80%" paddingAngle={1} isAnimationActive={false}>
                        {totalsData.map((d, i) => (
                            <Cell key={d.name} fill={SERIES_COLORS[i]} />
                        ))}
                    </Pie>
                </PieChart>
            );
        return (
            <BarChart data={totalsData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                <XAxis dataKey="name" {...axis} interval={0} tickFormatter={(v: string) => (v.length > 22 ? `${v.slice(0, 21)}…` : v)} />
                <YAxis {...axis} width={64} tickFormatter={(v: number) => axisMetric(chartMetric, v)} />
                <Tooltip content={tooltip} cursor={{ fill: "#F2F4F7" }} />
                <Bar dataKey="value" name={chartMetric} fill={TEAL} radius={[6, 6, 0, 0]} isAnimationActive={false} />
            </BarChart>
        );
    })();

    const shareOf = (g: Group) => (fallback ? g.impressions / (totalImps || 1) : g.spend / (totalSpend || 1));

    return (
        <DasShell
            navItems={V3_NAV_ITEMS}
            navKey="manage campaigns"
            concept={{
                label: keywordMode === "screen" ? "Full performance" : "Full performance · keywords in CSV only",
                title: "Break the campaign down by everything it targets",
                notes: [
                    "Third screen: Manage campaigns → overview → this. No summary panel; the overview has one.",
                    "Built from Performance Insights' pieces (Product, 26 Oct): full-bleed bands for the date row, Metrics, Breakdown, Filters (+ ADD menu) and Chart Type; teal checkboxes; a charcoal report table. Download .CSV takes the table on screen.",
                    "Stays in DAS (28 Oct). Metrics: Revenue (trued up), Impressions, eCPM, and new Render rate, Clicks and CTR. View-through has a place, off until engineering confirms it.",
                    "Break down by Creative, Platform, Region, Country, App, App category, Account, Account manager, Position, Keyword and Device Language — two at a time to pivot.",
                    keywordMode === "screen"
                        ? "Keywords match on ANY, so each keyword is a row, on screen — Product's choice on 19 Oct over the charter's CSV-only guardrail."
                        : "The charter's version: Keyword is not a breakdown on screen; per-keyword figures come from Download by keyword .CSV.",
                ],
            }}
        >
            <BreadcrumbStrip trail={crumbs} />
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-display-xs font-extrabold text-primary">Full performance</h2>
                        <p className="text-md text-tertiary">
                            {c.name} · {flightRange(c)}
                        </p>
                    </div>
                    {/* Where staging's tab row carries them, beside the page's own heading. */}
                    <div className="flex items-center gap-3">
                        <span className="text-md text-tertiary">All reports are in UTC.</span>
                        <CollapseButton collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
                    </div>
                </div>

                <Bands>
                    <DateRow
                        trailing={
                            <>
                                {keywordMode === "csv" && c.keywords.length > 0 && (
                                    <StateAction quiet disabled={ordered.length === 0} onPress={exportByKeyword}>
                                        Download by keyword .CSV
                                    </StateAction>
                                )}
                                <StateAction disabled={ordered.length === 0} onPress={exportCsv}>
                                    Download .CSV
                                </StateAction>
                            </>
                        }
                    >
                        <DateCell label="Start date">{flightDay(c, days[0]?.i ?? 0)}, 2026</DateCell>
                        <DateCell label="End date">{flightDay(c, days[days.length - 1]?.i ?? 0)}, 2026</DateCell>
                        <BareSelect
                            label="Date range"
                            value={range}
                            onChange={setRange}
                            options={[
                                { id: "flight", label: "Flight to date" },
                                { id: "14", label: "Last 14 days" },
                                { id: "7", label: "Last 7 days" },
                            ]}
                        />
                        <BareSelect
                            label="Interval"
                            value={interval}
                            onChange={setPeriod}
                            options={[
                                { id: "day", label: "By Day" },
                                { id: "week", label: "By Week" },
                            ]}
                        />
                    </DateRow>

                    {!collapsed && (
                        <>
                            <Band label="Metrics">
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                    {METRICS.map((m) => (
                                        <span key={m} className="inline-flex items-center gap-1.5">
                                            <Checkbox
                                                size="md"
                                                label={<span className={LABEL}>{m}</span>}
                                                isSelected={metrics.includes(m)}
                                                isDisabled={fallback && !FALLBACK_METRICS.includes(m)}
                                                onChange={() => toggleMetric(m)}
                                            />
                                            {m === "Revenue" && <TrueUp />}
                                        </span>
                                    ))}
                                    {/* 28 Oct: "If we have view-through, they're going to want that too." */}
                                    <Checkbox
                                        size="md"
                                        label={
                                            <span className={LABEL}>
                                                View-through<span className="ml-1.5 font-semibold text-tertiary">· if available</span>
                                            </span>
                                        }
                                        isSelected={false}
                                        isDisabled
                                    />
                                </div>
                            </Band>

                            <Band label="Breakdown">
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                                        {DIMS.map((d) => {
                                            const csvOnly = keywordMode === "csv" && d === "Keyword";
                                            const on = breakdown.includes(d);
                                            const full = !on && breakdown.length >= MAX_BREAKDOWN;
                                            return (
                                                <Checkbox
                                                    key={d}
                                                    size="md"
                                                    label={
                                                        <span className={LABEL}>
                                                            {d}
                                                            {csvOnly && <span className="ml-1.5 font-semibold text-tertiary">· CSV only</span>}
                                                        </span>
                                                    }
                                                    isSelected={on}
                                                    isDisabled={csvOnly || full}
                                                    onChange={() => toggleDim(d)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <span className="text-md text-tertiary">Up to two at once, to pivot one against the other.</span>
                                </div>
                            </Band>

                            <Band label="Filters">
                                <FilterControl dims={filterDims} value={filters} onChange={setFilters} />
                            </Band>

                            <Band label="Chart Type" flush>
                                <ChartTypeBar options={CHART_TYPES} value={chart} onChange={setChart} />
                            </Band>
                        </>
                    )}
                </Bands>

                {ordered.length === 0 ? (
                    <p className="text-md text-tertiary">Select at least one metric.</p>
                ) : (
                    <>
                        {chart !== "table" && (
                            <div className="flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-secondary">
                                <h3 className="text-lg font-extrabold text-primary">
                                    {chartMetric}
                                    {chart === "bar" || chart === "pie" ? " in total" : interval === "day" ? " per day" : " per week"}
                                    {breakdown.length ? ` by ${breakdown.join(" and ")}` : ""}
                                </h3>
                                {rateOnly ? (
                                    <p className="rounded-xl border border-dashed border-secondary px-6 py-10 text-center text-md text-tertiary">
                                        {chartMetric} is a rate, so it doesn't stack or split into a pie. Pick Revenue, Impressions or Clicks first, or choose
                                        Line, Area or Bar.
                                    </p>
                                ) : (
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            {chartBody}
                                        </ResponsiveContainer>
                                    </div>
                                )}
                                {chart !== "bar" && !rateOnly && (
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-md text-tertiary">
                                        {shown.map((g, i) => (
                                            <span key={g.key} className="inline-flex items-center gap-1.5">
                                                <span className="size-2.5 rounded-sm" style={{ backgroundColor: SERIES_COLORS[i] }} /> {g.key}
                                            </span>
                                        ))}
                                        {groups.length > shown.length && <span>+{groups.length - shown.length} more in the table</span>}
                                    </div>
                                )}
                                {ordered.length > 1 && (
                                    <p className="text-md text-tertiary">The chart shows {chartMetric}; every ticked metric is in the table.</p>
                                )}
                            </div>
                        )}

                        <div className={TABLE.bleed}>
                            <table className={TABLE.table}>
                                <thead style={tableHead("report")}>
                                    <tr>
                                        {(breakdown.length ? breakdown : ["Slice"]).map((d) => (
                                            <th key={d} scope="col" className={TABLE.report.th}>
                                                {d}
                                            </th>
                                        ))}
                                        {[...ordered, fallback ? "Share" : "Share of revenue"].map((h) => (
                                            <th key={h} scope="col" className={cx(TABLE.report.th, "text-right")}>
                                                {h === "Revenue" ? (
                                                    <span className="inline-flex items-center justify-end gap-1.5 [&_svg]:text-white/70">
                                                        Revenue <TrueUp />
                                                    </span>
                                                ) : (
                                                    h
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map((g, gi) => (
                                        <tr key={g.key} style={gi % 2 === 1 ? { backgroundColor: REPORT_STRIPE } : undefined}>
                                            {(breakdown.length ? g.values : [g.key]).map((v, i) => (
                                                <td key={i} className={cx(TABLE.report.td, breakdown[i] === "Keyword" && "font-mono")}>
                                                    {v}
                                                </td>
                                            ))}
                                            {ordered.map((m, i) => (
                                                <td
                                                    key={m}
                                                    className={cx(TABLE.report.td, "text-right tabular-nums", i === 0 ? "font-semibold" : "text-secondary")}
                                                >
                                                    {formatMetric(m, metricOf(m, g))}
                                                </td>
                                            ))}
                                            <td className={cx(TABLE.report.td, "text-right text-secondary tabular-nums")}>
                                                <span className="inline-flex items-center justify-end gap-2">
                                                    <span className="h-1.5 w-16 overflow-hidden rounded-full bg-quaternary">
                                                        <span
                                                            className="block h-full rounded-full"
                                                            style={{ width: `${shareOf(g) * 100}%`, backgroundColor: TEAL }}
                                                        />
                                                    </span>
                                                    {(shareOf(g) * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className={TABLE.report.foot}>
                                    <tr>
                                        <td colSpan={Math.max(1, breakdown.length)} className={cx(TABLE.report.td, "font-bold")}>
                                            Total{filtered && " (filtered)"}
                                        </td>
                                        {ordered.map((m) => (
                                            <td key={m} className={cx(TABLE.report.td, "text-right font-bold tabular-nums")}>
                                                {formatMetric(m, metricOf(m, total))}
                                            </td>
                                        ))}
                                        <td className={cx(TABLE.report.td, "text-right font-bold")}>100%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {breakdown.includes("Keyword") && (
                            <p className="text-md text-tertiary">
                                Keywords match on ANY. An impression that matches more than one counts under the first it matched, so the rows add up.
                            </p>
                        )}
                    </>
                )}
            </div>
        </DasShell>
    );
};
