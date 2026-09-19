/**
 * Saved Queries — prototype data.
 *
 * Fictional saved and recommended queries for the Saved Queries concepts. The columns
 * mirror today's page (Report Name, Report Date Range, Date Created, Account, Report
 * Type); everything else (trend, KPIs, schedule, reasons) is what the concepts add.
 */

export type ReportType = "Performance" | "Demand" | "Fill & Requests" | "DAS Campaign" | "Keyword";
export type Format = "usd" | "usd2" | "pct" | "num";

export type DateRange = { kind: "rolling"; days: number } | { kind: "fixed"; start: string; end: string };

export interface Kpi {
    label: string;
    value: number;
    prev: number;
    format: Format;
}

export interface SavedQuery {
    id: string;
    name: string;
    source: "saved" | "recommended";
    type: ReportType;
    account: string;
    /** ISO date (UTC). For recommendations, the day it was suggested. */
    created: string;
    range: DateRange;
    metrics: string[];
    breakdown: string[];
    owner: string;
    lastRun?: string;
    schedule?: string;
    pinned?: boolean;
    /** Why a recommendation is shown. */
    reason?: string;
    /** Daily values of the first KPI, Sep 12–18. */
    trend: number[];
    kpis: Kpi[];
}

/** The prototype's "today". */
export const TODAY = "2026-09-18";
export const trendDays = ["Sep 12", "Sep 13", "Sep 14", "Sep 15", "Sep 16", "Sep 17", "Sep 18"];

export const reportTypes: ReportType[] = ["Performance", "Demand", "Fill & Requests", "DAS Campaign", "Keyword"];

export const typeColors: Record<ReportType, { fg: string; bg: string; solid: string }> = {
    Performance: { fg: "#1F7F80", bg: "#E3F5F5", solid: "#37B6B7" },
    Demand: { fg: "#A94579", bg: "#FCE7F1", solid: "#DA6EA3" },
    "Fill & Requests": { fg: "#3538CD", bg: "#EEF4FF", solid: "#6172F3" },
    "DAS Campaign": { fg: "#B54708", bg: "#FEF6EE", solid: "#F79009" },
    Keyword: { fg: "#344054", bg: "#F2F4F7", solid: "#667085" },
};

export const savedQueryList: SavedQuery[] = [
    {
        id: "exec",
        name: "Weekly exec summary",
        source: "saved",
        type: "Performance",
        account: "Pocket Garden Media",
        created: "2026-06-03",
        range: { kind: "rolling", days: 7 },
        metrics: ["Revenue", "eCPM", "Fill Rate"],
        breakdown: ["Demand Source"],
        owner: "Maya Chen",
        lastRun: "Today, 9:02 AM",
        schedule: "Mondays · email",
        pinned: true,
        trend: [8800, 9920, 8290, 6990, 6890, 7090, 7350],
        kpis: [
            { label: "Revenue", value: 55330, prev: 54080, format: "usd" },
            { label: "eCPM", value: 2.71, prev: 2.66, format: "usd2" },
            { label: "Fill rate", value: 0.52, prev: 0.53, format: "pct" },
        ],
    },
    {
        id: "android-fill",
        name: "Android fill-rate watch",
        source: "saved",
        type: "Fill & Requests",
        account: "Pocket Garden Media",
        created: "2026-07-21",
        range: { kind: "rolling", days: 30 },
        metrics: ["Fill Rate", "Requests"],
        breakdown: ["App", "Demand Source"],
        owner: "Luis Ortega",
        lastRun: "Yesterday",
        schedule: "Daily · email",
        pinned: true,
        trend: [0.49, 0.49, 0.48, 0.47, 0.46, 0.46, 0.45],
        kpis: [
            { label: "Fill rate", value: 0.46, prev: 0.49, format: "pct" },
            { label: "Requests", value: 18400000, prev: 17900000, format: "num" },
        ],
    },
    {
        id: "nimbus-vs-omp",
        name: "Nimbus+ vs OMP eCPM",
        source: "saved",
        type: "Demand",
        account: "Pocket Garden Media",
        created: "2026-09-15",
        range: { kind: "rolling", days: 14 },
        metrics: ["eCPM", "Win Rate"],
        breakdown: ["Demand Source"],
        owner: "You",
        lastRun: "Sep 15",
        trend: [3.31, 3.36, 3.38, 3.4, 3.39, 3.44, 3.42],
        kpis: [
            { label: "Nimbus+ eCPM", value: 3.42, prev: 3.31, format: "usd2" },
            { label: "OMP eCPM", value: 2.18, prev: 2.26, format: "usd2" },
        ],
    },
    {
        id: "q3-country",
        name: "Q3 country mix",
        source: "saved",
        type: "Performance",
        account: "All accounts",
        created: "2026-09-02",
        range: { kind: "fixed", start: "2026-07-01", end: "2026-09-30" },
        metrics: ["Revenue", "Impressions"],
        breakdown: ["Country"],
        owner: "Ari Patel",
        lastRun: "Sep 2",
        trend: [14100, 15300, 13900, 12400, 12200, 12600, 12900],
        kpis: [
            { label: "Revenue", value: 1182000, prev: 1094000, format: "usd" },
            { label: "Impressions", value: 431000000, prev: 402000000, format: "num" },
        ],
    },
    {
        id: "bts-recap",
        name: "Back-to-school campaign recap",
        source: "saved",
        type: "DAS Campaign",
        account: "Trail Tracker Co.",
        created: "2026-09-01",
        range: { kind: "fixed", start: "2026-08-01", end: "2026-08-31" },
        metrics: ["Revenue", "Impressions"],
        breakdown: ["DAS Campaign"],
        owner: "You",
        lastRun: "Sep 1",
        trend: [1320, 1410, 1380, 1460, 1520, 1490, 1550],
        kpis: [
            { label: "Revenue", value: 41800, prev: 36200, format: "usd" },
            { label: "Impressions", value: 9600000, prev: 8900000, format: "num" },
        ],
    },
    {
        id: "q2-close",
        name: "Q2 revenue close",
        source: "saved",
        type: "Performance",
        account: "All accounts",
        created: "2026-07-02",
        range: { kind: "fixed", start: "2026-04-01", end: "2026-06-30" },
        metrics: ["Revenue"],
        breakdown: ["Account", "Month"],
        owner: "Maya Chen",
        lastRun: "Jul 2",
        trend: [11800, 12100, 12600, 12400, 12900, 13300, 13100],
        kpis: [{ label: "Revenue", value: 1046000, prev: 968000, format: "usd" }],
    },
    {
        id: "keyword-pilot",
        name: "Keyword match rate (pilot)",
        source: "saved",
        type: "Keyword",
        account: "Daily Scores",
        created: "2026-09-16",
        range: { kind: "rolling", days: 7 },
        metrics: ["Impressions", "Match Rate"],
        breakdown: ["Keyword"],
        owner: "You",
        lastRun: "Sep 16",
        trend: [0.31, 0.33, 0.34, 0.36, 0.35, 0.38, 0.39],
        kpis: [
            { label: "Match rate", value: 0.39, prev: 0.31, format: "pct" },
            { label: "Impressions", value: 212000, prev: 168000, format: "num" },
        ],
    },
    {
        id: "rec-demand",
        name: "Revenue by demand source",
        source: "recommended",
        type: "Demand",
        account: "Pocket Garden Media",
        created: TODAY,
        range: { kind: "rolling", days: 7 },
        metrics: ["Revenue", "eCPM"],
        breakdown: ["Demand Source"],
        owner: "Nimbus",
        reason: "You open demand-source breakdowns most weeks. This one has them ready to go.",
        trend: [8800, 9920, 8290, 6990, 6890, 7090, 7350],
        kpis: [
            { label: "Revenue", value: 55330, prev: 54080, format: "usd" },
            { label: "eCPM", value: 2.71, prev: 2.66, format: "usd2" },
        ],
    },
    {
        id: "rec-android-drop",
        name: "Fill-rate drop on Android",
        source: "recommended",
        type: "Fill & Requests",
        account: "Pocket Garden Media",
        created: TODAY,
        range: { kind: "rolling", days: 7 },
        metrics: ["Fill Rate", "Requests"],
        breakdown: ["Demand Source"],
        owner: "Nimbus",
        reason: "Fill rate on Pocket Garden (Android) fell from 49% to 46% this week. This breaks the drop down by demand source.",
        trend: [0.49, 0.49, 0.48, 0.47, 0.46, 0.46, 0.45],
        kpis: [
            { label: "Fill rate", value: 0.46, prev: 0.49, format: "pct" },
            { label: "Requests", value: 4300000, prev: 4100000, format: "num" },
        ],
    },
    {
        id: "rec-das-pace",
        name: "DAS campaigns behind pace",
        source: "recommended",
        type: "DAS Campaign",
        account: "Pocket Garden Media",
        created: "2026-09-17",
        range: { kind: "rolling", days: 14 },
        metrics: ["Spend", "Impressions"],
        breakdown: ["DAS Campaign"],
        owner: "Nimbus",
        reason: "One running campaign is spending slower than its flight. See it next to the others.",
        trend: [640, 610, 590, 560, 540, 530, 520],
        kpis: [
            { label: "Spend", value: 8120, prev: 9340, format: "usd" },
            { label: "Impressions", value: 2100000, prev: 2400000, format: "num" },
        ],
    },
    {
        id: "rec-countries",
        name: "Top countries by eCPM",
        source: "recommended",
        type: "Performance",
        account: "Pocket Garden Media",
        created: "2026-09-14",
        range: { kind: "rolling", days: 30 },
        metrics: ["eCPM", "Revenue"],
        breakdown: ["Country"],
        owner: "Nimbus",
        reason: "Popular with accounts like yours. Shows where your best-paying traffic comes from.",
        trend: [2.58, 2.61, 2.66, 2.64, 2.69, 2.7, 2.71],
        kpis: [
            { label: "eCPM", value: 2.71, prev: 2.58, format: "usd2" },
            { label: "Revenue", value: 231400, prev: 219800, format: "usd" },
        ],
    },
];

export const queryById = (id: string) => savedQueryList.find((q) => q.id === id)!;

/* --------------------------------------------------------------- Dates --- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY = 86_400_000;

export const toTime = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const shortDate = (t: number) => `${MONTHS[new Date(t).getUTCMonth()]} ${new Date(t).getUTCDate()}`;
export const longDate = (iso: string) => `${shortDate(toTime(iso))}, ${new Date(toTime(iso)).getUTCFullYear()}`;

/** Whole days from `iso` to TODAY (positive = in the past). */
export const daysAgo = (iso: string) => Math.round((toTime(TODAY) - toTime(iso)) / DAY);

export const relativeDay = (iso: string) => {
    const d = daysAgo(iso);
    if (d === 0) return "Today";
    if (d === 1) return "Yesterday";
    if (d < 30) return `${d} days ago`;
    const months = Math.round(d / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
};

/** Start/end of a range as timestamps (rolling ranges end today). */
export const rangeBounds = (r: DateRange) =>
    r.kind === "rolling" ? { start: toTime(TODAY) - (r.days - 1) * DAY, end: toTime(TODAY) } : { start: toTime(r.start), end: toTime(r.end) };

export const rangeLabel = (r: DateRange) => (r.kind === "rolling" ? `Last ${r.days} days` : `${shortDate(toTime(r.start))} – ${longDate(r.end)}`);

export const rangeDetail = (r: DateRange) => {
    const { start, end } = rangeBounds(r);
    return r.kind === "rolling" ? `Rolling · ${shortDate(start)} – ${shortDate(end)}` : `Fixed · ${Math.round((end - start) / DAY) + 1} days`;
};

/** Fixed ranges that ended before today — candidates for "roll forward". */
export const hasEnded = (r: DateRange) => r.kind === "fixed" && toTime(r.end) < toTime(TODAY);
export const endedDaysAgo = (r: DateRange) => (r.kind === "fixed" ? daysAgo(r.end) : 0);

/* ------------------------------------------------------------- Numbers --- */

export const fmt = (n: number, f: Format) => {
    if (f === "pct") return `${Math.round(n * 100)}%`;
    if (f === "usd2") return `$${n.toFixed(2)}`;
    if (f === "usd") return n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(2)}M` : `$${Math.round(n).toLocaleString("en-US")}`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 10_000) return `${Math.round(n / 1000)}K`;
    return Math.round(n).toLocaleString("en-US");
};

export const initials = (name: string) =>
    name
        .split(/\s+/)
        .filter((w) => /^[A-Z]/.test(w))
        .slice(0, 2)
        .map((w) => w[0])
        .join("");
