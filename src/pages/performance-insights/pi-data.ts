/**
 * Performance Insights — prototype data.
 *
 * Fictional sample figures for screen concepts. Demand partner names match the ones
 * already used in App Screens; none of the numbers come from Nimbus reporting.
 */

export const demandSources = ["Nimbus+", "Magnite", "Index Exchange", "PubMatic", "APS"] as const;

/** Daily revenue by demand source, last 7 days. */
export const revenueByDay = [
    { day: "Sep 12", "Nimbus+": 4210, Magnite: 2030, "Index Exchange": 1690, PubMatic: 540, APS: 330 },
    { day: "Sep 13", "Nimbus+": 4820, Magnite: 2290, "Index Exchange": 1840, PubMatic: 610, APS: 360 },
    { day: "Sep 14", "Nimbus+": 3990, Magnite: 1910, "Index Exchange": 1570, PubMatic: 520, APS: 300 },
    { day: "Sep 15", "Nimbus+": 3350, Magnite: 1620, "Index Exchange": 1310, PubMatic: 440, APS: 270 },
    { day: "Sep 16", "Nimbus+": 3320, Magnite: 1580, "Index Exchange": 1300, PubMatic: 430, APS: 260 },
    { day: "Sep 17", "Nimbus+": 3410, Magnite: 1630, "Index Exchange": 1330, PubMatic: 450, APS: 270 },
    { day: "Sep 18", "Nimbus+": 3520, Magnite: 1700, "Index Exchange": 1380, PubMatic: 470, APS: 280 },
];

export const seriesColors: Record<(typeof demandSources)[number], string> = {
    "Nimbus+": "#DA6EA3",
    Magnite: "#37B6B7",
    "Index Exchange": "#6172F3",
    PubMatic: "#F79009",
    APS: "#98A2B3",
};

/** Totals for the question-bar result table (this week vs previous). */
export const demandTotals = [
    { source: "Nimbus+", revenue: 26620, prev: 24910, ecpm: 3.42, prevEcpm: 3.31, fill: 0.71 },
    { source: "Magnite", revenue: 12760, prev: 13480, ecpm: 2.18, prevEcpm: 2.26, fill: 0.48 },
    { source: "Index Exchange", revenue: 10420, prev: 9870, ecpm: 2.05, prevEcpm: 1.98, fill: 0.44 },
    { source: "PubMatic", revenue: 3460, prev: 3510, ecpm: 1.64, prevEcpm: 1.66, fill: 0.21 },
    { source: "APS", revenue: 2070, prev: 2310, ecpm: 3.1, prevEcpm: 3.22, fill: 0.09 },
];

/** Pivot data: App → Demand Source × week (revenue). */
export const weeks = ["Aug 24", "Aug 31", "Sep 7", "Sep 14"];

export const pivot: { app: string; values: number[]; children: { source: string; values: number[] }[] }[] = [
    {
        app: "Pocket Garden (iOS)",
        values: [24180, 25960, 27410, 28840],
        children: [
            { source: "Nimbus+", values: [11020, 11890, 12640, 13380] },
            { source: "Magnite", values: [5610, 5920, 6120, 6310] },
            { source: "Index Exchange", values: [4380, 4760, 5080, 5420] },
            { source: "PubMatic", values: [1920, 2010, 2090, 2150] },
            { source: "APS", values: [1250, 1380, 1480, 1580] },
        ],
    },
    { app: "Pocket Garden (Android)", values: [15320, 15880, 16410, 16020], children: [] },
    { app: "Trail Tracker (iOS)", values: [8740, 9120, 9610, 10230], children: [] },
    { app: "Trail Tracker (Android)", values: [5210, 5090, 5340, 5460], children: [] },
    { app: "Daily Scores", values: [2980, 3350, 3720, 4080], children: [] },
];

export const templates = [
    { title: "Revenue by demand source", tags: ["Revenue", "eCPM", "Demand Source"], trend: [4, 5, 5, 6, 5, 7, 8] },
    { title: "Fill rate by app", tags: ["Fill Rate", "Requests", "App"], trend: [6, 6, 5, 6, 7, 7, 7] },
    { title: "eCPM trend by platform", tags: ["eCPM", "Platform", "Day"], trend: [5, 4, 5, 5, 6, 6, 7] },
    { title: "DAS campaign delivery", tags: ["Revenue", "Impressions", "DAS Campaign"], trend: [2, 3, 3, 4, 5, 5, 6] },
    { title: "Win rate by ad unit", tags: ["Win Rate", "Wins", "Ad Unit"], trend: [7, 6, 6, 5, 6, 5, 5] },
    { title: "Top countries", tags: ["Revenue", "Impressions", "Country"], trend: [3, 4, 4, 5, 4, 5, 6] },
];

export const savedQueries = [
    { name: "Weekly exec summary", owner: "Maya Chen", lastRun: "Today, 9:02 AM", schedule: "Mondays · email" },
    { name: "Android fill-rate watch", owner: "Luis Ortega", lastRun: "Yesterday", schedule: "Daily · email" },
    { name: "Nimbus+ vs OMP eCPM", owner: "You", lastRun: "Sep 15", schedule: "—" },
    { name: "Q3 country mix", owner: "Ari Patel", lastRun: "Sep 2", schedule: "—" },
];

export const usd = (n: number, digits = 0) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });
