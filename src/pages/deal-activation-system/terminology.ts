/**
 * DAS terminology — one source of truth for every user-visible term.
 *
 * Rule: if the real product has a word for something, we use that word exactly, including
 * its capitalisation. If we had to invent a term, it carries an ADDED chip on screen so
 * nobody mistakes our vocabulary for the product's.
 *
 * Source of truth is the staging product at dashboard-stage.adsbynimbus.com, captured
 * 1 Oct 2026 in reference/das-system/100126 (gitignored, local only).
 *
 * `origin` tells you how much to trust a string:
 *   "staging"  — read verbatim off a staging screen. Do not reword.
 *   "inferred" — taken from the Review page's read-only row label because the input
 *                screen itself was never captured. Real product wording, but the input
 *                label could differ. Safe to use; worth confirming.
 *   "added"    — no equivalent exists in the product. Renders with an ADDED chip.
 *
 * Two staging terms are dangerously similar and must never be merged:
 *   Ad Type  — how a creative is encoded (HTML, VAST (xml)). Lives on an asset.
 *   Ad Unit  — which placement a campaign targets (All units). Lives on targeting.
 */

export type TermOrigin = "staging" | "inferred" | "added";

export interface Term {
    /** The string to render. */
    label: string;
    origin: TermOrigin;
    /** What we used to call it, when that differs — for the glossary's before/after. */
    was?: string;
    /** Why it is what it is, or what still needs confirming. */
    note?: string;
}

const s = (label: string, was?: string, note?: string): Term => ({ label, origin: "staging", was, note });
const i = (label: string, was?: string, note?: string): Term => ({ label, origin: "inferred", was, note });
const a = (label: string, was?: string, note?: string): Term => ({ label, origin: "added", was, note });

/* --------------------------------------------------------------- Chrome --- */

export const chrome = {
    dasNavGroup: s("Deal Activation System | DAS:", "Deal Activation System", "Every staging nav group heading ends in a colon; DAS carries its acronym."),
    manageAssets: s("manage assets"),
    manageKeywords: a("manage keywords", "keyword library", "Named to mirror “manage assets”, per the Oct 1 review."),
    dealActivationSetup: s("deal activation setup"),
    manageCampaigns: s("manage campaigns"),
    footerSite: s("nimbus.co", "AdsByNimbus.com"),
};

/* ------------------------------------------------------- Campaign setup --- */

export const setup = {
    /** Staging's five wizard steps collapse into sections on one page. */
    general: s("General", "Deal & campaign"),
    budget: s("Budget", "Budget & flight", "Flight dates live inside Budget in the product."),
    targeting: s("Targeting"),
    creative: s("Creative"),
    review: s("Review Campaign Settings"),

    dealId: s("Deal ID"),
    dealName: s("Deal Name"),
    campaignName: i("Campaign Name", "Campaign name", "Review row label; the input screen was not captured."),
    auctionRules: s("Auction Rules", "Auction rules"),
    priority: i("Priority", "Priority vs. other live campaigns", "Staging shows a bare integer."),

    budgetAmount: i("Budget", "Total budget"),
    bidAmount: i("Bid Amount (eCPM)", "eCPM (bid amount)", "Staging inverts ours."),
    flightDates: i("Flight Dates", "Start / End", "One row with a hyphen-joined range."),
    dailyImpressionCap: i("Daily Impression Cap", "Daily impression cap"),
    frequencyCap: i("Frequency Cap", undefined, "Exists in the product; we had no equivalent."),

    geos: s("Geos"),
    platform: s("Platform"),
    apps: s("Apps"),
    adUnit: s("Ad Unit", "Ad unit type", "NOT “Ad Type” — that is the creative encoding on an asset."),
    allUnits: s("All units", undefined, "The default when no unit is chosen."),
    notSpecified: s("Not Specified", undefined, "Staging's explicit empty-target value."),

    keywords: a("Keywords", undefined, "The Extended Targeting charter's new concept. No staging equivalent."),

    publish: s("PUBLISH"),
    publishAndDuplicate: s("PUBLISH & DUPLICATE"),
    makeChanges: s("MAKE CHANGES TO THIS CAMPAIGN"),
    cancelSetup: s("CANCEL CAMPAIGN SETUP"),
    editing: s("Editing"),
    saveDraft: a("Save draft"),
    estDelivery: a("Est. delivery"),
};

/* --------------------------------------------------------------- Assets --- */

export const assets = {
    assetSetup: s("Asset Setup"),
    viewAllAssets: s("View All Assets"),
    creativeName: s("Creative Name"),
    adType: s("Ad Type", undefined, "HTML or VAST (xml). Not the targeting Ad Unit."),
    adSize: s("Ad Size"),
    addMarkup: s("Add Markup"),
    impressionTrackingUrls: s("Impression Tracking URL(s)"),
    clickTrackingUrls: s("Click Tracking URL(s)"),
    clearForm: s("CLEAR FORM"),
    addCreative: s("ADD CREATIVE"),
    testAsset: s("TEST ASSET"),
    searchAssets: s("Search assets", "Search your asset library"),
    addExistingAsset: s("Add Existing Asset", "Creative"),
    campaignCreative: s("Campaign Creative"),
    assetName: s("Asset Name"),
    associatedCampaigns: s("Associated Campaigns"),
    impressionTrackers: s("Impression Trackers"),
    clickTrackers: s("Click Trackers"),
    status: s("Status"),
    addToLibraryHint: s(
        "If you are using brand new assets, you must add them to your library first.",
        "Search your asset library above, or upload a new asset.",
    ),
};

/** Staging's Ad Size options, verbatim — note "Full screen" is not title-cased. */
export const AD_SIZES = ["Full screen", "Medium Rectangle", "Banner"] as const;

/**
 * Staging's Ad Type values. The dropdown was never captured open, so this is the set
 * observed in the asset table rather than a confirmed option list.
 */
export const AD_TYPES = ["HTML", "VAST (xml)"] as const;

/** Targeting Ad Unit values. Not confirmed against staging — the picker was never captured. */
export const AD_UNITS = ["Interstitial", "Inline", "Rewarded", "Dynamic Unit"] as const;

/* ------------------------------------------------------------- Keywords --- */

/**
 * Manage keywords. Keywords have no equivalent anywhere in the product, so every term
 * here is invented and the page carries a banner saying so. Where a word exists on the
 * asset screens we reuse it exactly, so the two libraries read as one pattern.
 */
export const keywords = {
    keywordSetup: a("Keyword Setup", undefined, "Mirrors staging's “Asset Setup”."),
    viewAllKeywords: a("View All Keywords", undefined, "Mirrors staging's “View All Assets”."),
    keywordHealth: a("Keyword Health", undefined, "No asset equivalent. A keyword can be valid and still never match, and nothing else in DAS would say so."),
    bulkAdd: a("Bulk add", undefined, "Sub-page of Keyword Setup for pasting a list out of a remote config."),
    addKeywords: a("Add Keywords", undefined, "Mirrors staging's “ADD CREATIVE”."),
    deleteKeyword: a("Delete Keyword"),
    keywordValue: a("Value", undefined, "The keyword itself, stored lower-case. Read-only once saved — campaigns match on it."),
    keywordNote: a("Note", undefined, "For the publisher's team. Nimbus never interprets it."),
    inTraffic: a("In Traffic", undefined, "Whether any app has sent this keyword in the last 7 days."),
    arrivingOn: a("Arriving on", undefined, "Which of user.keywords / app.keywords / content.keywords carried it. Diagnostic only — the backend collapses all three."),
    howPopulated: a("How they're populated", undefined, "The charter's three integration patterns, inferred from behaviour rather than configured."),
    definedNotArriving: a("Defined, but not arriving", undefined, "In the library, but no app is sending it."),
    arrivingNotDefined: a("Arriving, but not defined", undefined, "Sent by an app, but not in the library, so no campaign can target it."),
    exportCsv: a("Export CSV", undefined, "The charter's reporting guardrail: per-keyword detail leaves by CSV or API, never as an on-screen chart."),
};

/* ------------------------------------------------------------ Glossary --- */

/** Everything above, flattened, for the Storybook glossary page. */
export const glossary: { area: string; term: Term }[] = [
    ...Object.values(chrome).map((term) => ({ area: "Navigation", term })),
    ...Object.values(setup).map((term) => ({ area: "Campaign setup", term })),
    ...Object.values(assets).map((term) => ({ area: "Assets", term })),
    ...Object.values(keywords).map((term) => ({ area: "Keywords", term })),
];

/** What still needs a screenshot before we can call it verified. */
export const openCaptures = [
    "The Ad Type dropdown, open — we have the values HTML and VAST (xml) from the asset table, but not the option list.",
    "Setup steps 1–3 (/create/1, /2, /3) — the real input labels for campaign name, budget, bid amount, flight dates, priority and the targeting pickers. Everything marked “inferred” comes from the Review page's read-only rows instead.",
    "The manage campaigns page — no capture exists, so every string on our Campaigns screen is unverified.",
    "A non-test account, to confirm whether Transparent Publisher Exchange, Finance and advanced reporting are real nav groups.",
];
