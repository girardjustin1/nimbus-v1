/**
 * Performance Insights charts — fictional sample data. Same apps and demand partners as
 * the rest of the Performance Insights concepts; none of it comes from Nimbus reporting.
 */

export const days = ["Sep 12", "Sep 13", "Sep 14", "Sep 15", "Sep 16", "Sep 17", "Sep 18"];

/** Daily revenue by demand source (matches the Round 1 question bar). */
export const revenueByDay = [
    { day: "Sep 12", "Nimbus+": 4210, Magnite: 2030, "Index Exchange": 1690, PubMatic: 540, APS: 330 },
    { day: "Sep 13", "Nimbus+": 4820, Magnite: 2290, "Index Exchange": 1840, PubMatic: 610, APS: 360 },
    { day: "Sep 14", "Nimbus+": 3990, Magnite: 1910, "Index Exchange": 1570, PubMatic: 520, APS: 300 },
    { day: "Sep 15", "Nimbus+": 3350, Magnite: 1620, "Index Exchange": 1310, PubMatic: 440, APS: 270 },
    { day: "Sep 16", "Nimbus+": 3320, Magnite: 1580, "Index Exchange": 1300, PubMatic: 430, APS: 260 },
    { day: "Sep 17", "Nimbus+": 3410, Magnite: 1630, "Index Exchange": 1330, PubMatic: 450, APS: 270 },
    { day: "Sep 18", "Nimbus+": 3520, Magnite: 1700, "Index Exchange": 1380, PubMatic: 470, APS: 280 },
];

export const demandSources = ["Nimbus+", "Magnite", "Index Exchange", "PubMatic", "APS"];

/** Total revenue this week vs the previous week, per day. */
export const revenueVsPrevious = [
    { day: "Sep 12", "This week": 8800, "Previous week": 8350 },
    { day: "Sep 13", "This week": 9920, "Previous week": 9110 },
    { day: "Sep 14", "This week": 8290, "Previous week": 8540 },
    { day: "Sep 15", "This week": 6990, "Previous week": 7420 },
    { day: "Sep 16", "This week": 6890, "Previous week": 7060 },
    { day: "Sep 17", "This week": 7090, "Previous week": 6980 },
    { day: "Sep 18", "This week": 7350, "Previous week": 6620 },
];

/** 30 days of revenue and eCPM for the area / combo charts. */
export const revenueAndEcpm = Array.from({ length: 30 }, (_, i) => {
    const wave = Math.sin(i / 3.2) * 0.12 + Math.cos(i / 1.7) * 0.05;
    const weekend = [5, 6].includes(i % 7) ? 1.18 : 1;
    const revenue = Math.round(7200 * (1 + i * 0.008 + wave) * weekend);
    const day = i < 12 ? `Aug ${20 + i}` : `Sep ${i - 11}`;
    return { day, Revenue: revenue, eCPM: +(2.45 + wave * 2 + (weekend - 1) * 1.2).toFixed(2) };
});

/** Revenue by app and platform (grouped / stacked / horizontal bars). */
export const revenueByApp = [
    { app: "Pocket Garden", iOS: 28840, Android: 16020 },
    { app: "Trail Tracker", iOS: 10230, Android: 5460 },
    { app: "Daily Scores", iOS: 2650, Android: 1430 },
    { app: "Meal Prep", iOS: 1920, Android: 2210 },
];

/** Revenue share by demand source (pie / donut / treemap). */
export const revenueShare = [
    { name: "Nimbus+", value: 26620 },
    { name: "Magnite", value: 12760 },
    { name: "Index Exchange", value: 10420 },
    { name: "PubMatic", value: 3460 },
    { name: "APS", value: 2070 },
];

/** Demand partner scorecard, each metric scaled 0–100 (radar). */
export const partnerScores = [
    { metric: "Win rate", "Nimbus+": 82, Magnite: 64, "Index Exchange": 58 },
    { metric: "eCPM", "Nimbus+": 88, Magnite: 61, "Index Exchange": 57 },
    { metric: "Fill", "Nimbus+": 71, Magnite: 48, "Index Exchange": 44 },
    { metric: "Latency", "Nimbus+": 76, Magnite: 70, "Index Exchange": 81 },
    { metric: "Viewability", "Nimbus+": 68, Magnite: 72, "Index Exchange": 66 },
    { metric: "Timeout rate", "Nimbus+": 84, Magnite: 62, "Index Exchange": 69 },
];

/** Progress against monthly goals (activity gauge / progress circles). */
export const goals = [
    { name: "Revenue goal", value: 78, target: "$240K" },
    { name: "Fill rate goal", value: 62, target: "55%" },
    { name: "DAS delivery", value: 91, target: "3 campaigns" },
];

/** Auction funnel for the last 7 days. */
export const auctionFunnel = [
    { stage: "Ad requests", value: 142_600_000 },
    { stage: "Bid requests", value: 131_200_000 },
    { stage: "Bids", value: 88_400_000 },
    { stage: "Wins", value: 52_900_000 },
    { stage: "Impressions", value: 49_800_000 },
];

/** Revenue heatmap: app × week. */
export const heatmapWeeks = ["Aug 24", "Aug 31", "Sep 7", "Sep 14"];
export const heatmapRows = [
    { label: "Pocket Garden (iOS)", values: [24180, 25960, 27410, 28840] },
    { label: "Pocket Garden (Android)", values: [15320, 15880, 16410, 16020] },
    { label: "Trail Tracker (iOS)", values: [8740, 9120, 9610, 10230] },
    { label: "Trail Tracker (Android)", values: [5210, 5090, 5340, 5460] },
    { label: "Daily Scores", values: [2980, 3350, 3720, 4080] },
];

/** Ad units: eCPM vs fill rate, sized by revenue (scatter / bubble). */
export const adUnits = [
    { name: "Home banner", format: "Banner", ecpm: 0.92, fill: 0.81, revenue: 6200 },
    { name: "Feed MREC", format: "Banner", ecpm: 1.64, fill: 0.72, revenue: 8900 },
    { name: "Level-end interstitial", format: "Interstitial", ecpm: 7.8, fill: 0.58, revenue: 21400 },
    { name: "App-open interstitial", format: "Interstitial", ecpm: 6.1, fill: 0.44, revenue: 9800 },
    { name: "Extra-life rewarded", format: "Rewarded", ecpm: 12.4, fill: 0.63, revenue: 15600 },
    { name: "Daily-bonus rewarded", format: "Rewarded", ecpm: 10.9, fill: 0.39, revenue: 5400 },
    { name: "In-feed native", format: "Native", ecpm: 3.7, fill: 0.51, revenue: 4300 },
];

/** Headline metrics with a 7-day trend (metric cards). */
export const kpis = [
    { label: "Revenue", value: 55330, prev: 54080, fmt: "usd" as const, trend: [8800, 9920, 8290, 6990, 6890, 7090, 7350] },
    { label: "eCPM", value: 2.71, prev: 2.66, fmt: "usd2" as const, trend: [2.58, 2.61, 2.66, 2.64, 2.69, 2.7, 2.71] },
    { label: "Fill rate", value: 0.52, prev: 0.53, fmt: "pct" as const, trend: [0.54, 0.53, 0.53, 0.52, 0.52, 0.51, 0.52] },
    { label: "Impressions", value: 20_400_000, prev: 20_300_000, fmt: "compact" as const, trend: [3.2, 3.4, 2.9, 2.6, 2.7, 2.8, 2.8] },
];
