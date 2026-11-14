import { DEMAND_PARTNERS, PEOPLE, USER, seeded } from "../sample-data";

/**
 * AdOps sample data — Nov 13 style guide (reference/111326, 13 Nov).
 *
 * Fictional throughout: advertiser domains use the reserved `.example` TLD, app bundles
 * `com.example.*`, and people and demand partners come from ../sample-data. The IAB
 * content categories are the public IAB taxonomy, not anyone's data.
 */

/** Today in the prototype: the last day of the reporting week. */
export const TODAY = "Nov 13, 2026";
/** Creative blocks last until the quarter ends. */
export const QUARTER_END = "Dec 31, 2026";
export const ME = `${USER.first} ${USER.last}`;

/** "Nov 04, 2026" → a sortable number. */
export const dateKey = (d: string) => new Date(d).getTime();

/* ------------------------------------------------------------ Blocking --- */

export type BlockKind = "crid" | "bcat" | "badv" | "bapp";
export type BlockedOn = "Core" | "N+" | "Core & N+";

export interface BlockEntry {
    id: string;
    value: string;
    by: string;
    on: BlockedOn;
    date: string;
    /** Creative blocks only: when the quarter ends. */
    unblock?: string;
}

export const BLOCK_SECTIONS: Record<BlockKind, { title: string; noun: string; placeholder: string; csv: boolean; file: string }> = {
    crid: { title: "Blocked Creative (crid)", noun: "Blocked creatives", placeholder: "Enter cridID", csv: false, file: "blocked-creatives" },
    bcat: {
        title: "Blocked Categories (bcat)",
        noun: "Blocked categories",
        placeholder: "Search the IAB category list",
        csv: false,
        file: "blocked-categories",
    },
    badv: {
        title: "Blocked Advertisers (badv)",
        noun: "Blocked domains",
        placeholder: "Enter one or more domains (CSV supported)",
        csv: true,
        file: "blocked-advertisers",
    },
    bapp: {
        title: "Blocked Applications (bapp)",
        noun: "Blocked apps",
        placeholder: "Enter one or more application IDs (CSV supported)",
        csv: true,
        file: "blocked-applications",
    },
};

export const BLOCK_KINDS: BlockKind[] = ["crid", "bcat", "badv", "bapp"];

export const SAMPLE_BLOCKS: Record<BlockKind, BlockEntry[]> = {
    crid: [
        { id: "c1", value: "crid-8f3a21c0", by: PEOPLE[0], on: "Core & N+", date: "Oct 22, 2026", unblock: QUARTER_END },
        { id: "c2", value: "crid-4b7e9d12", by: PEOPLE[1], on: "Core", date: "Nov 04, 2026", unblock: QUARTER_END },
    ],
    bcat: [
        { id: "k1", value: "IAB9-9 Cigars", by: PEOPLE[2], on: "Core & N+", date: "Sep 14, 2026" },
        { id: "k2", value: "IAB8-5 Cocktails/Beer", by: PEOPLE[0], on: "Core & N+", date: "Sep 14, 2026" },
        { id: "k3", value: "IAB11-4 Politics", by: PEOPLE[3], on: "N+", date: "Oct 30, 2026" },
    ],
    badv: [
        { id: "a1", value: "spinwin.example", by: PEOPLE[1], on: "Core & N+", date: "Aug 19, 2026" },
        { id: "a2", value: "quickloans.example", by: PEOPLE[1], on: "Core", date: "Oct 07, 2026" },
        { id: "a3", value: "megadeals.example", by: PEOPLE[3], on: "N+", date: "Nov 09, 2026" },
    ],
    bapp: [{ id: "p1", value: "com.example.coinpusher", by: PEOPLE[2], on: "Core & N+", date: "Oct 15, 2026" }],
};

export const EMPTY_BLOCKS: Record<BlockKind, BlockEntry[]> = { crid: [], bcat: [], badv: [], bapp: [] };

/** A slice of the IAB content taxonomy (v1), enough to search. */
export const IAB_CATEGORIES = [
    "IAB1 Arts & Entertainment",
    "IAB1-1 Books & Literature",
    "IAB1-2 Celebrity Fan/Gossip",
    "IAB1-5 Movies",
    "IAB1-6 Music",
    "IAB2 Automotive",
    "IAB3 Business",
    "IAB5 Education",
    "IAB7 Health & Fitness",
    "IAB7-44 Weight Loss",
    "IAB8 Food & Drink",
    "IAB8-5 Cocktails/Beer",
    "IAB8-18 Wine",
    "IAB9 Hobbies & Interests",
    "IAB9-7 Card Games",
    "IAB9-9 Cigars",
    "IAB9-30 Video & Computer Games",
    "IAB10 Home & Garden",
    "IAB11 Law, Gov't & Politics",
    "IAB11-4 Politics",
    "IAB13 Personal Finance",
    "IAB13-7 Investing",
    "IAB14 Society",
    "IAB14-1 Dating",
    "IAB17 Sports",
    "IAB19 Technology & Computing",
    "IAB20 Travel",
    "IAB22 Shopping",
    "IAB23 Religion & Spirituality",
    "IAB24 Uncategorized",
    "IAB26 Illegal Content",
];

/* -------------------------------------------------------------- Floors --- */

export type FloorPlatform = "Android" | "iOS";
export type FloorAdType = "Static" | "Video";
export type DefaultFloorKey = `${FloorPlatform}: ${FloorAdType}`;

export const DEFAULT_FLOOR_KEYS: DefaultFloorKey[] = ["Android: Static", "iOS: Static", "Android: Video", "iOS: Video"];

export const SAMPLE_DEFAULT_FLOORS: Record<DefaultFloorKey, number | undefined> = {
    "Android: Static": 0.5,
    "iOS: Static": 0.65,
    "Android: Video": 4,
    "iOS: Video": 5.5,
};
export const EMPTY_DEFAULT_FLOORS: Record<DefaultFloorKey, number | undefined> = {
    "Android: Static": undefined,
    "iOS: Static": undefined,
    "Android: Video": undefined,
    "iOS: Video": undefined,
};

export interface CustomFloor {
    id: string;
    country: string;
    platform: FloorPlatform;
    adType: FloorAdType;
    adId: string;
    size: string;
    price: number;
}

export const COUNTRIES = ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan", "Brazil", "Mexico"];
export const AD_IDS = ["daily-scores-banner", "daily-scores-rewarded", "match-report-mrec", "xtra-innings-interstitial", "puzzle-parade-banner"];
export const SIZES = ["320x50", "300x250", "728x90", "320x480", "Fullscreen"];

export const SAMPLE_CUSTOM_FLOORS: CustomFloor[] = [
    { id: "f1", country: "United States", platform: "iOS", adType: "Video", adId: "daily-scores-rewarded", size: "Fullscreen", price: 8 },
    { id: "f2", country: "United States", platform: "Android", adType: "Video", adId: "daily-scores-rewarded", size: "Fullscreen", price: 6.5 },
    { id: "f3", country: "Canada", platform: "iOS", adType: "Static", adId: "match-report-mrec", size: "300x250", price: 1.2 },
    { id: "f4", country: "United Kingdom", platform: "Android", adType: "Static", adId: "puzzle-parade-banner", size: "320x50", price: 0.4 },
];

export const floorPrice = (n: number | undefined) => (n === undefined ? "NOT SET" : `$${n.toFixed(2)}`);

/* ----------------------------------------------------------- Test mode --- */

export type OverrideStatus = "Test Mode On" | "Test Mode Off";
export const OVERRIDE_STATUSES: OverrideStatus[] = ["Test Mode On", "Test Mode Off"];

export interface TestOverride {
    id: string;
    status: OverrideStatus;
    platform: FloorPlatform;
    version: string;
    date: string;
    by: string;
}

export const SAMPLE_OVERRIDES: TestOverride[] = [
    { id: "o1", status: "Test Mode On", platform: "iOS", version: "4.12.0", date: "Nov 10, 2026", by: PEOPLE[2] },
    { id: "o2", status: "Test Mode Off", platform: "Android", version: "4.11.2", date: "Nov 03, 2026", by: PEOPLE[3] },
];

/* ---------------------------------------------------- Discrepancy report --- */

/** Third-party demand only: Nimbus+ is Nimbus's own, so it has nothing to reconcile against. */
export const DISCREPANCY_SOURCES = DEMAND_PARTNERS.filter((p) => p !== "Nimbus+");

export interface DiscrepancyRow {
    partner: string;
    demand: number;
    nimbus: number;
    /** (Nimbus − demand) ÷ Nimbus, as a percentage. */
    pct: number;
}

export const discrepancyRows = (sources: string[]): DiscrepancyRow[] =>
    sources.map((partner) => {
        const nimbus = Math.round((150 + seeded(`dr:${partner}`) * 4200) * 100) / 100;
        const gap = 0.004 + seeded(`gap:${partner}`) * 0.14;
        const demand = Math.round(nimbus * (1 - gap) * 100) / 100;
        return { partner, demand, nimbus, pct: ((nimbus - demand) / nimbus) * 100 };
    });

/* ------------------------------------------------------------ Activity --- */

export type ActivityType = "Block" | "Unblock" | "Frequency Cap" | "Pause Demand" | "Enable Demand" | "Floors" | "DAS" | "Other";
export type ActivityGroup = "blocking" | "demand" | "more";

export const ACTIVITY_GROUP: Record<ActivityType, ActivityGroup> = {
    Block: "blocking",
    Unblock: "blocking",
    "Frequency Cap": "demand",
    "Pause Demand": "demand",
    "Enable Demand": "demand",
    Floors: "demand",
    DAS: "more",
    Other: "more",
};

export const BLOCK_TYPES = ["Creative", "Category", "Advertiser", "Application"];

export interface ActivityEntry {
    id: string;
    /** ISO day, within the reporting week. */
    day: string;
    time: string;
    type: ActivityType;
    change: string;
    by: string;
    blockType?: string;
    source?: string;
    note?: string;
}

const P = DEMAND_PARTNERS;

export const SAMPLE_ACTIVITY: ActivityEntry[] = [
    {
        id: "a1",
        day: "2026-11-13",
        time: "10:42 AM",
        type: "Block",
        blockType: "Advertiser",
        change: "Blocked megadeals.example on N+",
        by: PEOPLE[3],
        note: "Landing page redirects to an app store.",
    },
    { id: "a2", day: "2026-11-13", time: "9:15 AM", type: "Floors", source: P[1], change: "iOS: Video default floor $5.00 → $5.50", by: PEOPLE[0] },
    {
        id: "a3",
        day: "2026-11-12",
        time: "4:03 PM",
        type: "Pause Demand",
        source: P[2],
        change: `Paused ${P[2]}`,
        by: PEOPLE[1],
        note: "Paused during a reporting outage on the partner's side.",
    },
    { id: "a4", day: "2026-11-12", time: "11:20 AM", type: "DAS", change: "Campaign “Weekend Sports” published", by: PEOPLE[0] },
    {
        id: "a5",
        day: "2026-11-11",
        time: "3:47 PM",
        type: "Frequency Cap",
        source: P[3],
        change: `${P[3]}: frequency cap set to 3 per user per day`,
        by: PEOPLE[2],
    },
    { id: "a6", day: "2026-11-11", time: "1:05 PM", type: "Unblock", blockType: "Category", change: "Unblocked IAB9-7 Card Games on Core", by: PEOPLE[3] },
    { id: "a7", day: "2026-11-10", time: "5:30 PM", type: "Enable Demand", source: P[5], change: `Enabled ${P[5]}`, by: PEOPLE[1] },
    { id: "a8", day: "2026-11-10", time: "2:12 PM", type: "Other", change: "Test mode override added: iOS 4.12.0", by: PEOPLE[2] },
    {
        id: "a9",
        day: "2026-11-09",
        time: "10:58 AM",
        type: "Block",
        blockType: "Creative",
        change: "Blocked crid-4b7e9d12 on Core",
        by: PEOPLE[1],
        note: "Auto-plays audio.",
    },
    {
        id: "a10",
        day: "2026-11-09",
        time: "9:31 AM",
        type: "Floors",
        source: P[4],
        change: "Custom floor added: United States · Android · Video · $6.50",
        by: PEOPLE[0],
    },
    { id: "a11", day: "2026-11-08", time: "6:44 PM", type: "Pause Demand", source: P[6], change: `Paused ${P[6]}`, by: PEOPLE[3] },
    {
        id: "a12",
        day: "2026-11-08",
        time: "12:09 PM",
        type: "Block",
        blockType: "Application",
        change: "Blocked com.example.coinpusher on Core & N+",
        by: PEOPLE[2],
    },
    { id: "a13", day: "2026-11-07", time: "3:22 PM", type: "Enable Demand", source: P[2], change: `Enabled ${P[2]}`, by: PEOPLE[1] },
    { id: "a14", day: "2026-11-07", time: "11:00 AM", type: "DAS", change: "Campaign “Morning Commute” paused", by: PEOPLE[0] },
];

export type ActivityRange = "today" | "yesterday" | "last7" | "last30";
export const ACTIVITY_RANGES: { id: ActivityRange; label: string; from: string; to: string }[] = [
    { id: "today", label: "Today", from: "2026-11-13", to: "2026-11-13" },
    { id: "yesterday", label: "Yesterday", from: "2026-11-12", to: "2026-11-12" },
    { id: "last7", label: "Last 7 Days", from: "2026-11-07", to: "2026-11-13" },
    { id: "last30", label: "Last 30 Days", from: "2026-10-15", to: "2026-11-13" },
];

/** "2026-11-09" → "Nov 09, 2026". */
export const longDay = (iso: string) => {
    const d = new Date(`${iso}T12:00:00`);
    return `${d.toLocaleDateString("en-US", { month: "short" })} ${String(d.getDate()).padStart(2, "0")}, ${d.getFullYear()}`;
};
