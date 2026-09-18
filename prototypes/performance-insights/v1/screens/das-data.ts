/**
 * Deal Activation System — prototype data.
 *
 * Everything here is fictional sample data for screen concepts. Publisher, deal and
 * keyword names are invented; no figures come from Nimbus reporting.
 */

export type CampaignStatus = "Running" | "Scheduled" | "Paused" | "Complete" | "Draft";
export type AuctionRule = "Guaranteed" | "CPM Priority" | "Always-on CPM Priority" | "Fallback";
export type AdUnitType = "Interstitial" | "Inline" | "Rewarded" | "Dynamic Unit";
export type MatchLogic = "ANY" | "ALL";

/* ------------------------------------------------------------------ Keywords --- */

export interface Keyword {
    id: string;
    /** The exact token the publisher's app sends in `user.keywords` (matched case-insensitively). */
    value: string;
    /** Optional human note — Nimbus never interprets the keyword itself. */
    note?: string;
    /** Campaigns currently targeting this keyword. */
    campaigns: number;
    /** Of those, how many are live right now (deleting/renaming would affect delivery). */
    liveCampaigns: number;
    /** Seen in the app's RTB requests over the last 7 days. */
    seenInTraffic: boolean;
    createdBy: string;
    updated: string;
}

export const keywords: Keyword[] = [
    {
        id: "k1",
        value: "sports",
        note: "Follows 2+ teams",
        campaigns: 4,
        liveCampaigns: 2,
        seenInTraffic: true,
        createdBy: "Maya Chen",
        updated: "Sep 12, 2026",
    },
    {
        id: "k2",
        value: "over21",
        note: "Age-gated; alcohol eligible",
        campaigns: 3,
        liveCampaigns: 1,
        seenInTraffic: true,
        createdBy: "Maya Chen",
        updated: "Sep 10, 2026",
    },
    {
        id: "k3",
        value: "power-user",
        note: "7+ sessions / week",
        campaigns: 2,
        liveCampaigns: 2,
        seenInTraffic: true,
        createdBy: "Luis Ortega",
        updated: "Sep 8, 2026",
    },
    { id: "k4", value: "midwest", campaigns: 1, liveCampaigns: 0, seenInTraffic: true, createdBy: "Luis Ortega", updated: "Aug 30, 2026" },
    {
        id: "k5",
        value: "plant",
        note: "Gardening content readers",
        campaigns: 1,
        liveCampaigns: 1,
        seenInTraffic: true,
        createdBy: "Maya Chen",
        updated: "Aug 28, 2026",
    },
    {
        id: "k6",
        value: "77541",
        note: "Partner segment code",
        campaigns: 2,
        liveCampaigns: 0,
        seenInTraffic: false,
        createdBy: "Ari Patel",
        updated: "Aug 21, 2026",
    },
    { id: "k7", value: "fantasy-football", campaigns: 0, liveCampaigns: 0, seenInTraffic: true, createdBy: "Ari Patel", updated: "Aug 19, 2026" },
    {
        id: "k8",
        value: "new-parent",
        note: "Onboarding survey answer",
        campaigns: 0,
        liveCampaigns: 0,
        seenInTraffic: false,
        createdBy: "Maya Chen",
        updated: "Aug 2, 2026",
    },
];

/** Tokens seen in recent `user.keywords` traffic that aren't in the library yet (suggestions). */
export const trafficSuggestions = ["premium", "night-owl", "commuter", "runner"];

/* ------------------------------------------------------------ Standard targets --- */

export const adUnitTypes: { id: AdUnitType; hint: string }[] = [
    { id: "Interstitial", hint: "Full-screen units" },
    { id: "Inline", hint: "Banners & MRECs in content" },
    { id: "Rewarded", hint: "Opt-in, reward on completion" },
    { id: "Dynamic Unit", hint: "Nimbus hybrid unit" },
];

/** ISO 639-1 codes most common in the sample account; the full list lives in the picker. */
export const languages = [
    { id: "en", label: "English", supportingText: "en" },
    { id: "es", label: "Spanish", supportingText: "es" },
    { id: "pt", label: "Portuguese", supportingText: "pt" },
    { id: "fr", label: "French", supportingText: "fr" },
    { id: "de", label: "German", supportingText: "de" },
    { id: "ja", label: "Japanese", supportingText: "ja" },
    { id: "ko", label: "Korean", supportingText: "ko" },
    { id: "hi", label: "Hindi", supportingText: "hi" },
];

export const apps = ["Pocket Garden (iOS)", "Pocket Garden (Android)", "Trail Tracker (iOS)", "Trail Tracker (Android)", "Daily Scores"];

/* ------------------------------------------------------------------ Campaigns --- */

export interface Campaign {
    id: string;
    dealId: string;
    dealName: string;
    name: string;
    status: CampaignStatus;
    rule: AuctionRule;
    ecpm: number;
    budget: number;
    spend: number;
    impressions: number;
    start: string;
    end: string;
    /** Share of the flight elapsed, 0–100 — compared against spend to judge pacing. */
    flightElapsed: number;
    geos: string;
    platforms: string;
    adUnits: AdUnitType[];
    languages: string[];
    keywords: string[];
    match: MatchLogic;
    creatives: number;
}

export const campaigns: Campaign[] = [
    {
        id: "c1",
        dealId: "D-10482",
        dealName: "Summit Sportswear — Fall Launch",
        name: "Sports fans · Interstitial",
        status: "Running",
        rule: "CPM Priority",
        ecpm: 8.5,
        budget: 25000,
        spend: 14500,
        impressions: 1705882,
        start: "Sep 1",
        end: "Sep 30",
        flightElapsed: 57,
        geos: "United States, Canada",
        platforms: "iOS, Android",
        adUnits: ["Interstitial"],
        languages: ["en"],
        keywords: ["sports", "power-user"],
        match: "ANY",
        creatives: 3,
    },
    {
        id: "c2",
        dealId: "D-10482",
        dealName: "Summit Sportswear — Fall Launch",
        name: "Sports fans · Inline (ES)",
        status: "Running",
        rule: "CPM Priority",
        ecpm: 6.25,
        budget: 10000,
        spend: 3120,
        impressions: 499200,
        start: "Sep 1",
        end: "Sep 30",
        flightElapsed: 57,
        geos: "United States, Mexico",
        platforms: "iOS, Android",
        adUnits: ["Inline"],
        languages: ["es"],
        keywords: ["sports"],
        match: "ANY",
        creatives: 5,
    },
    {
        id: "c3",
        dealId: "D-10517",
        dealName: "Harvest Brewing — 21+",
        name: "Over 21 · Midwest",
        status: "Running",
        rule: "Guaranteed",
        ecpm: 12,
        budget: 40000,
        spend: 30500,
        impressions: 2541667,
        start: "Aug 25",
        end: "Sep 24",
        flightElapsed: 83,
        geos: "United States",
        platforms: "iOS",
        adUnits: ["Interstitial", "Rewarded"],
        languages: ["en"],
        keywords: ["over21", "midwest"],
        match: "ALL",
        creatives: 2,
    },
    {
        id: "c4",
        dealId: "D-10533",
        dealName: "GreenThumb Supply",
        name: "Plant lovers · Always on",
        status: "Paused",
        rule: "Always-on CPM Priority",
        ecpm: 4.1,
        budget: 8000,
        spend: 2650,
        impressions: 646341,
        start: "Sep 5",
        end: "Oct 31",
        flightElapsed: 23,
        geos: "United States, Canada, United Kingdom",
        platforms: "Android",
        adUnits: ["Inline", "Dynamic Unit"],
        languages: ["en"],
        keywords: ["plant"],
        match: "ANY",
        creatives: 4,
    },
    {
        id: "c5",
        dealId: "D-10540",
        dealName: "Evergreen fallback",
        name: "Fallback · All users",
        status: "Running",
        rule: "Fallback",
        ecpm: 0,
        budget: 0,
        spend: 0,
        impressions: 812004,
        start: "Jul 1",
        end: "Dec 31",
        flightElapsed: 44,
        geos: "All",
        platforms: "iOS, Android",
        adUnits: ["Interstitial", "Inline", "Rewarded", "Dynamic Unit"],
        languages: [],
        keywords: [],
        match: "ANY",
        creatives: 6,
    },
    {
        id: "c6",
        dealId: "D-10551",
        dealName: "Trailhead Outfitters",
        name: "Runners · Rewarded",
        status: "Scheduled",
        rule: "CPM Priority",
        ecpm: 9.75,
        budget: 15000,
        spend: 0,
        impressions: 0,
        start: "Oct 1",
        end: "Oct 31",
        flightElapsed: 0,
        geos: "United States",
        platforms: "iOS, Android",
        adUnits: ["Rewarded"],
        languages: ["en", "es"],
        keywords: ["runner", "power-user"],
        match: "ANY",
        creatives: 2,
    },
];

/* ------------------------------------------------------------------ Reporting --- */

/** Daily DAS vs Open Marketplace revenue for the reporting concepts (last 14 days). */
export const dailyRevenue = [
    { day: "Sep 5", das: 1840, omp: 15210 },
    { day: "Sep 6", das: 1920, omp: 14320 },
    { day: "Sep 7", das: 2110, omp: 15010 },
    { day: "Sep 8", das: 2260, omp: 15480 },
    { day: "Sep 9", das: 2380, omp: 16130 },
    { day: "Sep 10", das: 2450, omp: 17200 },
    { day: "Sep 11", das: 2520, omp: 17840 },
    { day: "Sep 12", das: 2610, omp: 17430 },
    { day: "Sep 13", das: 2890, omp: 19960 },
    { day: "Sep 14", das: 2740, omp: 16020 },
    { day: "Sep 15", das: 2690, omp: 13290 },
    { day: "Sep 16", das: 2810, omp: 13190 },
    { day: "Sep 17", das: 2980, omp: 13460 },
    { day: "Sep 18", das: 3050, omp: 13920 },
];

/** Every dimension the reporting builder can break down by, grouped for the picker. */
export const dimensionGroups: { group: string; items: string[] }[] = [
    {
        group: "Deal Activation",
        items: ["DAS Deal", "DAS Campaign", "DAS Asset", "Auction Rule", "Keyword-targeted (yes/no)", "Ad Unit Type", "Device Language"],
    },
    { group: "Inventory", items: ["App", "App Bundle", "App Category", "App Version", "Ad Unit", "Placement", "Position", "Ad Size", "Ad Type"] },
    { group: "Audience & device", items: ["Country", "Region", "Platform", "SDK Version"] },
    { group: "Demand", items: ["Demand Source", "Demand Source Pool", "Advertiser", "Integration Type"] },
    { group: "Account", items: ["Account", "Account Manager"] },
];

export const metricOptions = ["Revenue", "Impressions", "eCPM", "Fill Rate", "Requests", "Wins", "Win Rate", "Render Rate", "Clicks", "CTR", "RCPM"];

export const usd = (n: number, digits = 0) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });

export const compact = (n: number) => n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });
