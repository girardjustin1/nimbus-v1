/**
 * DAS Studio — data model, sample draft and the estimate math behind the live panel.
 *
 * Everything is fictional. Estimates are deliberately simple and deterministic so the
 * prototype reacts believably: more targeting narrows reach, a bid below the
 * recommended range lowers the delivery likelihood, a bigger budget needs more supply.
 */

export type GoalId = "guaranteed" | "priority" | "always-on" | "fallback";
export type FormatId = "banner" | "interstitial" | "rewarded" | "native";
export type BudgetType = "daily" | "lifetime";
export type Period = "daily" | "weekly" | "monthly";
export type Likelihood = "High" | "Medium" | "Low";
export type StepId = "goal" | "deal" | "audience" | "budget" | "creative" | "review";

export interface Goal {
    id: GoalId;
    title: string;
    /** What the campaign is judged on. */
    measure: string;
    hint: string;
    /** Two tones for the tile artwork. */
    art: [string, string];
    badge?: string;
}

export const goals: Goal[] = [
    { id: "guaranteed", title: "Guaranteed delivery", measure: "Impressions, on schedule", hint: "Always beats open-marketplace bids. For promised volume.", art: ["#1F7F80", "#37B6B7"] },
    { id: "priority", title: "Price priority", measure: "eCPM vs open marketplace", hint: "Serves when your eCPM beats the winning bid.", art: ["#A94579", "#DA6EA3"] },
    { id: "always-on", title: "Always on", measure: "Steady share of voice", hint: "Competes on every request for the whole flight.", art: ["#3538CD", "#6172F3"] },
    { id: "fallback", title: "Fill the gaps", measure: "Unfilled requests", hint: "Only serves when open marketplace doesn't fill. No budget.", art: ["#B54708", "#F79009"], badge: "No budget" },
];

export interface Format {
    id: FormatId;
    label: string;
    size: string;
    /** Recommended eCPM range for this format. */
    bid: [number, number];
    /** Share of the app's requests this format can win. */
    supply: number;
    badge?: string;
}

export const formats: Format[] = [
    { id: "banner", label: "Banner", size: "320×50 · 300×250", bid: [1.2, 1.8], supply: 0.5 },
    { id: "interstitial", label: "Interstitial", size: "Full screen · static or video", bid: [7.5, 9.5], supply: 0.25 },
    { id: "rewarded", label: "Rewarded video", size: "15–30s · end card", bid: [11, 14], supply: 0.15 },
    { id: "native", label: "Native", size: "In-feed card", bid: [3, 4.5], supply: 0.1, badge: "Beta" },
];

export const formatById = (id: FormatId) => formats.find((f) => f.id === id)!;

export const geoOptions = [
    { id: "US", label: "United States", share: 0.52 },
    { id: "CA", label: "Canada", share: 0.1 },
    { id: "GB", label: "United Kingdom", share: 0.12 },
    { id: "DE", label: "Germany", share: 0.08 },
    { id: "MX", label: "Mexico", share: 0.06 },
];

export const appOptions = ["Pocket Garden (iOS)", "Pocket Garden (Android)", "Trail Tracker (iOS)", "Trail Tracker (Android)", "Daily Scores"];

export interface Creative {
    brand: string;
    headline: string;
    body: string;
    cta: string;
    url: string;
    /** Brand colours used to draw the sample artwork. */
    palette: [string, string];
    logo?: string;
    image?: string;
    video?: string;
}

export interface StudioDraft {
    goal?: GoalId;
    dealName: string;
    campaignName: string;
    geos: string[];
    platforms: ("iOS" | "Android")[];
    apps: string[];
    keywords: string[];
    match: "ANY" | "ALL";
    format: FormatId;
    budgetType: BudgetType;
    budget?: number;
    bid?: number;
    start?: string;
    end?: string;
    hasEnd: boolean;
    creative: Creative;
}

export const emptyCreative: Creative = { brand: "", headline: "", body: "", cta: "Learn more", url: "", palette: ["#37B6B7", "#1F7F80"] };

export const sampleCreative: Creative = {
    brand: "Summit Sportswear",
    headline: "Built for the fourth quarter",
    body: "The Fall Launch jacket. Wind-proof, featherweight, 20% off this week.",
    cta: "Shop now",
    url: "summit-sportswear.example/fall",
    palette: ["#DA6EA3", "#1F2A44"],
    logo: "summit-logo.png",
    image: "fall-launch-hero.jpg",
    video: "fall-launch-15s.mp4",
};

export const emptyDraft: StudioDraft = {
    dealName: "",
    campaignName: "",
    geos: [],
    platforms: ["iOS", "Android"],
    apps: [],
    keywords: [],
    match: "ANY",
    format: "interstitial",
    budgetType: "lifetime",
    hasEnd: true,
    creative: emptyCreative,
};

export const sampleDraft: StudioDraft = {
    goal: "priority",
    dealName: "Summit Sportswear — Fall Launch",
    campaignName: "Fall Launch · Sports fans",
    geos: ["US", "CA"],
    platforms: ["iOS", "Android"],
    apps: ["Pocket Garden (iOS)", "Pocket Garden (Android)", "Daily Scores"],
    keywords: ["sports", "power-user"],
    match: "ANY",
    format: "interstitial",
    budgetType: "lifetime",
    budget: 25000,
    bid: 8.9,
    start: "2026-10-01",
    end: "2026-10-31",
    hasEnd: true,
    creative: sampleCreative,
};

/* -------------------------------------------------------------- Estimates --- */

const DAILY_REQUESTS = 4_200_000;

const days = (d: StudioDraft) => {
    if (!d.start || !d.end || !d.hasEnd) return 30;
    const ms = Date.parse(`${d.end}T00:00:00Z`) - Date.parse(`${d.start}T00:00:00Z`);
    return Math.max(1, Math.round(ms / 86_400_000) + 1);
};

export const flightDays = days;

/** Requests per day this targeting and format could reach. */
export const available = (d: StudioDraft) => {
    const geo = d.geos.length ? d.geos.reduce((s, g) => s + (geoOptions.find((o) => o.id === g)?.share ?? 0), 0) : 1;
    const plat = d.platforms.length === 1 ? 0.55 : d.platforms.length ? 1 : 0;
    const apps = d.apps.length ? d.apps.length / appOptions.length : 1;
    const kw = d.keywords.length ? (d.match === "ANY" ? 1 - Math.pow(0.7, d.keywords.length) : Math.pow(0.3, d.keywords.length)) : 1;
    return DAILY_REQUESTS * geo * plat * apps * kw * formatById(d.format).supply;
};

export interface Estimate {
    likelihood: Likelihood;
    /** Per day, low–high. */
    impressions: [number, number];
    reach: [number, number];
    ecpm: [number, number];
    dailySpend: number;
    advice: string;
}

export const estimate = (d: StudioDraft): Estimate => {
    const f = formatById(d.format);
    const bid = d.bid ?? f.bid[0];
    const fallback = d.goal === "fallback";
    const winRate = fallback ? 0.08 : Math.min(0.9, Math.max(0.15, 0.25 + ((bid - f.bid[0]) / (f.bid[1] - f.bid[0])) * 0.45));
    const supply = available(d) * winRate;
    const dailySpend = fallback ? 0 : d.budget ? (d.budgetType === "daily" ? d.budget : d.budget / days(d)) : 0;
    const wanted = fallback ? supply : dailySpend ? (dailySpend / bid) * 1000 : supply;
    const deliverable = Math.min(wanted, supply);
    const ratio = wanted ? deliverable / wanted : 1;
    const likelihood: Likelihood = ratio >= 0.9 ? "High" : ratio >= 0.6 ? "Medium" : "Low";
    const advice =
        !d.budget && !fallback
            ? "Add a budget to see how much of it is likely to spend."
            : likelihood === "High"
              ? bid > f.bid[1]
                  ? "Your bid is above the recommended range. You'd likely deliver in full for less."
                  : "Your budget is likely to spend in full with this targeting."
              : bid < f.bid[0]
                ? `Your bid is below the ${usd2(f.bid[0])}–${usd2(f.bid[1])} range for ${f.label.toLowerCase()}. Raise it to win more auctions.`
                : "Your targeting is narrow for this budget. Add apps or geos, or switch keywords to ANY.";
    return {
        likelihood,
        impressions: [deliverable * 0.8, deliverable * 1.15],
        reach: [deliverable * 0.8 * 0.42, deliverable * 1.15 * 0.5],
        ecpm: fallback ? [0, 0] : [Math.max(0.1, bid * 0.82), bid],
        dailySpend,
        advice,
    };
};

export const periodFactor: Record<Period, number> = { daily: 1, weekly: 7, monthly: 30 };

/* ---------------------------------------------------------------- Format --- */

export const usd2 = (n: number) => `$${n.toFixed(2)}`;
export const usd0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
export const compact = (n: number) => n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const range = (r: [number, number], f: (n: number) => string = compact) => `${f(r[0])} – ${f(r[1])}`;

export const shortDate = (iso?: string) => (iso ? new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "—");

/* ------------------------------------------------------------ Validation --- */

export interface StepIssue {
    step: StepId;
    text: string;
}

export const validateDraft = (d: StudioDraft): StepIssue[] => {
    const out: StepIssue[] = [];
    if (!d.goal) out.push({ step: "goal", text: "Choose a goal" });
    if (!d.dealName.trim()) out.push({ step: "deal", text: "Name the deal" });
    if (!d.campaignName.trim()) out.push({ step: "deal", text: "Name the campaign" });
    if (!d.platforms.length) out.push({ step: "audience", text: "Pick at least one platform" });
    if (d.goal !== "fallback") {
        if (!d.budget) out.push({ step: "budget", text: "Set a budget" });
        if (!d.bid) out.push({ step: "budget", text: "Set a bid" });
    }
    if (!d.start) out.push({ step: "budget", text: "Pick a start date" });
    if (d.hasEnd && !d.end) out.push({ step: "budget", text: "Pick an end date" });
    if (d.start && d.end && d.hasEnd && d.end < d.start) out.push({ step: "budget", text: "End date is before the start" });
    if (!d.creative.brand.trim()) out.push({ step: "creative", text: "Add the advertiser name" });
    if (d.format === "rewarded" ? !d.creative.video : !d.creative.image) out.push({ step: "creative", text: d.format === "rewarded" ? "Upload a video" : "Upload an image" });
    return out;
};

export const steps: { id: StepId; title: string; group: "Deal" | "Campaign" | "Creative" | "Review" }[] = [
    { id: "goal", title: "Goal", group: "Deal" },
    { id: "deal", title: "Deal & campaign", group: "Deal" },
    { id: "audience", title: "Audience", group: "Campaign" },
    { id: "budget", title: "Budget & schedule", group: "Campaign" },
    { id: "creative", title: "Creative & preview", group: "Creative" },
    { id: "review", title: "Review & publish", group: "Review" },
];

/* --------------------------------------------------------------- Presets --- */

/** Named starting points for screens, stories and deep links. */
export const studioPresets = {
    sample: sampleDraft,
    empty: emptyDraft,
    narrow: { ...sampleDraft, keywords: ["sports", "power-user", "over21"], match: "ALL" as const, apps: ["Daily Scores"] },
    lowBid: { ...sampleDraft, bid: 5.25 },
    noCreative: { ...sampleDraft, creative: emptyCreative },
    banner: { ...sampleDraft, format: "banner" as const, bid: 1.6 },
    rewarded: { ...sampleDraft, format: "rewarded" as const, bid: 12.5 },
    native: { ...sampleDraft, format: "native" as const, bid: 3.9 },
    incomplete: { ...sampleDraft, end: undefined, creative: { ...sampleDraft.creative, image: undefined, video: undefined } },
    fallback: { ...sampleDraft, goal: "fallback" as const, budget: undefined, bid: undefined },
} satisfies Record<string, StudioDraft>;
