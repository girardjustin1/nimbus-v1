import { type Campaign as RoundOneCampaign } from "../../v1/screens/das-data";

/**
 * Round 4 campaigns — the sample list behind Manage campaigns, the campaign overview and
 * Full performance.
 *
 * Forked from v1's das-data so Round 4 can change it without touching the rounds that
 * were reviewed. What the 16 Oct review needed that the old list didn't have:
 *   - Apps per campaign. The overview leads with flight dates, platform and apps.
 *   - Names that are only names. "Sports fans · Interstitial" read as if the ad unit
 *     were part of the name; a campaign is called what its publisher called it.
 *   - Queued campaigns (scheduled to start later), because Queued is now a top chip.
 *   - One campaign behind but able to catch up, so Campaign Health shows all three states.
 *   - The staging table's columns: daily impression cap.
 *   - The creatives themselves, by name, since there is no preview to stand in for them.
 *
 * 19 Oct: keywords match on ANY (Product), Unity is a platform, and Device Language is
 * back, so campaigns carry their languages again.
 *
 * Everything is fictional sample data.
 */

export interface CampaignCreative {
    name: string;
    type: "HTML" | "VAST (xml)";
    size: string;
}

export interface Campaign extends RoundOneCampaign {
    /** Days in the flight, start and end inclusive. */
    flightDays: number;
    /** App names with their platform, as the Apps picker lists them. */
    apps: string[];
    /** Campaign Daily Impression Cap; null when disabled. */
    dailyCap: number | null;
    creativeList: CampaignCreative[];
}

const html = (name: string, size = "Full screen"): CampaignCreative => ({ name, type: "HTML", size });

export const campaigns: Campaign[] = [
    {
        id: "c1",
        dealId: "D-10482",
        dealName: "Test Deal — Fall Launch",
        name: "Sports fans",
        status: "Running",
        rule: "CPM Priority",
        ecpm: 8.5,
        budget: 25000,
        spend: 14500,
        impressions: 1705882,
        start: "Sep 1",
        end: "Sep 30",
        flightDays: 30,
        flightElapsed: 57,
        geos: "United States, Canada",
        platforms: "iOS, Android, Unity",
        adUnits: ["Interstitial"],
        languages: ["en"],
        keywords: ["sports", "power-user"],
        match: "ANY",
        creatives: 3,
        apps: ["Daily Scores (iOS)", "Daily Scores (Android)", "Match Report (iOS)", "Match Report (Android)", "Xtra Innings (iOS)", "Xtra Innings (Unity)"],
        dailyCap: 80000,
        creativeList: [html("FallLaunch_Interstitial_Stadium"), html("FallLaunch_Interstitial_Jersey"), html("FallLaunch_Interstitial_Countdown")],
    },
    {
        id: "c2",
        dealId: "D-10482",
        dealName: "Test Deal — Fall Launch",
        name: "Sports fans (Spanish)",
        status: "Running",
        rule: "CPM Priority",
        ecpm: 6.25,
        budget: 10000,
        spend: 3120,
        impressions: 499200,
        start: "Sep 1",
        end: "Sep 30",
        flightDays: 30,
        flightElapsed: 57,
        geos: "United States, Mexico",
        platforms: "iOS, Android",
        adUnits: ["Inline"],
        languages: ["es"],
        keywords: ["sports"],
        match: "ANY",
        creatives: 2,
        apps: ["Daily Scores (iOS)", "Daily Scores (Android)", "Match Report (Android)"],
        dailyCap: 25000,
        creativeList: [html("FallLaunch_MREC_Estadio", "Medium Rectangle"), html("FallLaunch_Banner_Estadio", "Banner")],
    },
    {
        id: "c3",
        dealId: "D-10517",
        dealName: "Test Deal — 21+",
        name: "Over 21 Midwest",
        status: "Running",
        rule: "Guaranteed",
        ecpm: 12,
        budget: 40000,
        spend: 30500,
        impressions: 2541667,
        start: "Aug 25",
        end: "Sep 24",
        flightDays: 31,
        flightElapsed: 83,
        geos: "United States",
        platforms: "iOS, Unity",
        adUnits: ["Interstitial", "Rewarded"],
        languages: ["en"],
        keywords: ["over21", "midwest"],
        match: "ANY",
        creatives: 2,
        apps: ["Night Sky (iOS)", "Quiz Night (iOS)", "Quiz Night (Unity)", "Vinyl Crate (iOS)"],
        dailyCap: null,
        creativeList: [html("TwentyOne_Interstitial_Lager"), { name: "TwentyOne_Rewarded_Tasting", type: "VAST (xml)", size: "Full screen" }],
    },
    {
        id: "c8",
        dealId: "D-10566",
        dealName: "Test Deal — Transit",
        name: "Morning commuters",
        status: "Running",
        rule: "CPM Priority",
        ecpm: 7,
        budget: 20000,
        spend: 4200,
        impressions: 600000,
        start: "Sep 10",
        end: "Oct 9",
        flightDays: 30,
        flightElapsed: 25,
        geos: "United States",
        platforms: "iOS, Android",
        adUnits: ["Inline"],
        languages: ["en", "es"],
        keywords: ["commuter"],
        match: "ANY",
        creatives: 2,
        apps: ["Commute Cast (iOS)", "Commute Cast (Android)", "Urban Transit (iOS)", "Urban Transit (Android)", "Pocket Radio (Android)"],
        dailyCap: 40000,
        creativeList: [html("Transit_MREC_Sunrise", "Medium Rectangle"), html("Transit_Banner_Sunrise", "Banner")],
    },
    {
        id: "c4",
        dealId: "D-10533",
        dealName: "Test Deal — Garden",
        name: "Plant lovers",
        status: "Paused",
        rule: "Always-on CPM Priority",
        ecpm: 4.1,
        budget: 8000,
        spend: 2650,
        impressions: 646341,
        start: "Sep 5",
        end: "Oct 31",
        flightDays: 57,
        flightElapsed: 23,
        geos: "United States, Canada, United Kingdom",
        platforms: "Android",
        adUnits: ["Inline", "Dynamic Unit"],
        languages: [],
        keywords: ["plant"],
        match: "ANY",
        creatives: 2,
        apps: ["Zen Garden (Android)", "Recipe Box (Android)"],
        dailyCap: null,
        creativeList: [html("Garden_MREC_Fern", "Medium Rectangle"), html("Garden_Banner_Fern", "Banner")],
    },
    {
        id: "c5",
        dealId: "D-10540",
        dealName: "Test Deal — Fallback",
        name: "Fallback all users",
        status: "Running",
        rule: "Fallback",
        ecpm: 0,
        budget: 0,
        spend: 0,
        impressions: 812004,
        start: "Jul 1",
        end: "Dec 31",
        flightDays: 184,
        flightElapsed: 44,
        geos: "All",
        platforms: "iOS, Android",
        adUnits: ["Interstitial", "Inline", "Rewarded", "Dynamic Unit"],
        languages: [],
        keywords: [],
        match: "ANY",
        creatives: 2,
        apps: [],
        dailyCap: 100000,
        creativeList: [html("House_Interstitial_Upgrade"), html("House_MREC_Upgrade", "Medium Rectangle")],
    },
    {
        id: "c6",
        dealId: "D-10551",
        dealName: "Test Deal — Outdoor",
        name: "Runners",
        status: "Scheduled",
        rule: "CPM Priority",
        ecpm: 9.75,
        budget: 15000,
        spend: 0,
        impressions: 0,
        start: "Oct 1",
        end: "Oct 31",
        flightDays: 31,
        flightElapsed: 0,
        geos: "United States",
        platforms: "iOS, Android",
        adUnits: ["Rewarded"],
        languages: ["en", "es"],
        keywords: ["runner", "power-user"],
        match: "ANY",
        creatives: 1,
        apps: ["Trail Tracker (iOS)", "Trail Tracker (Android)", "Fit Log (iOS)", "Fit Log (Android)"],
        dailyCap: 60000,
        creativeList: [{ name: "Outdoor_Rewarded_Trail", type: "VAST (xml)", size: "Full screen" }],
    },
    {
        id: "c7",
        dealId: "D-10572",
        dealName: "Test Deal — Holiday",
        name: "Holiday shoppers",
        status: "Scheduled",
        rule: "Guaranteed",
        ecpm: 11,
        budget: 30000,
        spend: 0,
        impressions: 0,
        start: "Nov 1",
        end: "Dec 1",
        flightDays: 31,
        flightElapsed: 0,
        geos: "United States, Canada",
        platforms: "iOS, Android",
        adUnits: ["Interstitial"],
        languages: ["en", "fr"],
        keywords: ["gift-giver"],
        match: "ANY",
        creatives: 2,
        apps: ["Budget Jar (iOS)", "Budget Jar (Android)", "Garage Sale (iOS)", "Garage Sale (Android)"],
        dailyCap: null,
        creativeList: [html("Holiday_Interstitial_Ribbon"), html("Holiday_Interstitial_Snow")],
    },
    {
        id: "c9",
        dealId: "D-10482",
        dealName: "Test Deal — Fall Launch",
        name: "Back to school",
        status: "Complete",
        rule: "CPM Priority",
        ecpm: 5.5,
        budget: 12000,
        spend: 11940,
        impressions: 2170909,
        start: "Aug 1",
        end: "Aug 31",
        flightDays: 31,
        flightElapsed: 100,
        geos: "United States",
        platforms: "iOS, Android",
        adUnits: ["Inline"],
        languages: ["en"],
        keywords: ["student"],
        match: "ANY",
        creatives: 1,
        apps: ["Word Streak (iOS)", "Word Streak (Android)"],
        dailyCap: 90000,
        creativeList: [html("School_Banner_Pencil", "Banner")],
    },
];

export const campaignById = (id: string) => campaigns.find((c) => c.id === id);

/* ----------------------------------------------------------- Flight --- */

export const elapsedDays = (c: Campaign) => Math.round((c.flightDays * c.flightElapsed) / 100);
export const daysLeft = (c: Campaign) => c.flightDays - elapsedDays(c);

const MONTHS: Record<string, string> = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
};

/** "Sep 1" → "September 1, 2026", the staging table's date format. */
export const longDate = (short: string) => {
    const [m, d] = short.split(" ");
    return MONTHS[m] ? `${MONTHS[m]} ${d}, 2026` : short;
};

/** "Sep 1 – Sep 30, 2026": one year at the end, since every sample flight is in 2026. */
export const flightRange = (c: Pick<Campaign, "start" | "end">) => `${c.start} – ${c.end}, 2026`;

/* ---------------------------------------------------- Campaign Health --- */

/**
 * Campaign Health — the traffic light asked for on 16 Oct.
 *
 *   green  on pace
 *   orange behind, with enough flight left to catch up
 *   red    behind, with not enough flight left to make it up
 *
 * PLACEHOLDER MATHS. Product is settling the real rule with engineering and said it can
 * run in the front end. Until then: on pace means spend is within 10% of the share of
 * the flight that has gone (ahead counts as on pace). Behind is orange when the daily
 * spend needed to finish is no more than 1.5× today's rate, and red past that.
 *
 * Only live, budgeted campaigns have a health. Paused, queued and complete campaigns
 * aren't pacing, and Fallback has no budget to pace against.
 */
export type Health = "on pace" | "behind" | "at risk";

/** Above this multiple of today's daily spend, catching up is judged out of reach. */
export const RECOVERABLE_MULTIPLE = 1.5;

export const healthOf = (c: Campaign): Health | undefined => {
    if (c.status !== "Running" || !c.budget || c.flightElapsed === 0) return undefined;
    const ratio = ((c.spend / c.budget) * 100) / c.flightElapsed;
    if (ratio >= 0.9) return "on pace";
    const gone = Math.max(1, elapsedDays(c));
    const left = Math.max(1, daysLeft(c));
    const needed = (c.budget - c.spend) / left;
    const current = c.spend / gone;
    return needed <= current * RECOVERABLE_MULTIPLE ? "behind" : "at risk";
};

export const HEALTH_COLOR: Record<Health, string> = {
    "on pace": "#17B26A",
    behind: "#F79009",
    "at risk": "#D92D20",
};

export const HEALTH_LABEL: Record<Health, string> = {
    "on pace": "On pace",
    behind: "Behind",
    "at risk": "At risk",
};

export const HEALTH_MEANING: Record<Health, string> = {
    "on pace": "Spending in step with the flight.",
    behind: "Behind, with enough flight left to catch up.",
    "at risk": "Behind, without enough flight left to make it up.",
};

export const HEALTH_ORDER: Health[] = ["on pace", "behind", "at risk"];

export const healthCounts = (list: Campaign[]) => {
    const counts: Record<Health, Campaign[]> = { "on pace": [], behind: [], "at risk": [] };
    for (const c of list) {
        const h = healthOf(c);
        if (h) counts[h].push(c);
    }
    return counts;
};

/** Daily spend needed from today to finish on budget. */
export const neededPerDay = (c: Campaign) => (c.budget - c.spend) / Math.max(1, daysLeft(c));

/* ---------------------------------------------------------- Formatting --- */

export const usd = (n: number, digits = 0) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits });

export const compact = (n: number) => n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 1 });

/** "Daily Scores (iOS)" → "Daily Scores". */
export const appName = (app: string) => app.replace(/\s*\((iOS|Android|Unity)\)$/, "");

/** An app's platform, from "Daily Scores (iOS)". */
export const appPlatform = (app: string) => app.match(/\((iOS|Android|Unity)\)$/)?.[1];

/** Apps for a sentence: unique names, the first few, then "+N more". */
export const appsSummary = (apps: string[], show = 2) => {
    if (apps.length === 0) return "All apps";
    const names = [...new Set(apps.map(appName))];
    return names.length <= show ? names.join(", ") : `${names.slice(0, show).join(", ")} +${names.length - show} more`;
};
