/**
 * Oct 17 — the feedback batch behind Round 4, as data.
 *
 * One entry per change coming out of the 16 October review of Round 3. Quotes are
 * trimmed to the design point, and the reviewer is named by role, because this
 * Storybook publishes to a public URL.
 *
 * Applied means it was decided on the call and is in prototype v4. Decided means it was
 * a concept until Product picked one on 19 Oct; the pick is in v4 and the others stay in
 * Oct 17 › Concepts as the record. Concepts means the choice is still open. To confirm
 * means it is built on a reading that still needs an answer.
 */

export type Status = "Applied" | "Decided" | "Concepts" | "To confirm";

export interface FeedbackItem {
    slug: string;
    title: string;
    status: Status;
    /** From the 16 Oct call, trimmed to the design point. */
    quotes: string[];
    /** What we did, and why that reading of the quote. */
    decision: string[];
    /** Files in prototype v4 that changed. */
    touches: string[];
    /** When Product settled it, if after the call — e.g. "19 Oct". */
    decidedOn?: string;
    /** Where each quote is from, when not the 16 Oct call. */
    quoteDates?: string[];
}

export const framing = {
    quote: "I think between this and the way we've done the single screen setup, this is going to be a really nice update to DAS.",
    decision:
        "Setup is done: it goes to build, with tweaks during the build. This round is about what happens after a campaign exists — the list, one campaign, and its performance — as three screens, each doing one job.",
};

export const items: FeedbackItem[] = [
    {
        slug: "creative-previews",
        title: "Creative previews come out",
        status: "Applied",
        quotes: [
            "If it's not the real creative, all that's gonna do is make publishers ask for it to be the real creative, and then we'll just have to disappoint them.",
            "Let's just not even hint at it.",
        ],
        decision: [
            "Engineering can't render a publisher's real markup in the dashboard, and a stand-in animation only draws attention to that. Previews are gone everywhere: the creative search results, the Preview button and its modal, Asset Setup, Asset detail, the asset grid, and the campaign view.",
            "A creative is what the library knows about it — name, Ad Type, Ad Size. Rendering is kept as its own future project.",
            "Kept: the Ad Unit guide in Targeting. It explains what an interstitial or a rewarded unit is, not what the publisher's creative looks like. Easy to remove if that still reads as a hint.",
        ],
        touches: [
            "prototypes/das/v4/screens/creative-target.tsx",
            "prototypes/das/v4/screens/asset-picker.tsx",
            "prototypes/das/v4/screens/asset-library.tsx",
            "prototypes/das/v4/screens/asset-detail.tsx",
            "prototypes/das/v4/screens/campaign-view.tsx",
        ],
    },
    {
        slug: "campaigns-table",
        title: "Manage campaigns is the staging table",
        status: "Applied",
        quotes: [
            "I do think we need this more simple table view for the default page on manage campaigns.",
            "For the number of campaigns we're gonna need, and for the ability to compare, I think we need this table still. So just do this table exactly.",
        ],
        decision: [
            "Round 3's deal-grouped delivery cards are replaced by staging's table, column for column: Status, Deal ID, Deal Name, Campaign Name, Geos, Platform, Apps, Ad Units, Budget, Spend, Bid Amount, Start Date, End Date, Campaign Daily Impression Cap. Every column sorts. The search bar stays.",
            "Spend shows real figures rather than staging's N/A.",
            "No Export CSV on this page — raised and withdrawn on the call.",
        ],
        touches: ["prototypes/das/v4/screens/manage-campaigns.tsx", "prototypes/das/v4/screens/campaign-data.ts"],
    },
    {
        slug: "highlight-chips",
        title: "Four highlight chips, in Product's order",
        status: "Applied",
        quotes: ["Live as slot 1, queued slot 2, spend slot 3, pacing slot 4."],
        decision: [
            "Live campaigns, Queued campaigns (replaces Ending in 7 days — campaigns scheduled to start later), Total spend (links into detailed reporting), Campaign Health (was Behind pace).",
            "Live, Queued and Campaign Health also filter the table when clicked, and say so. That is our addition.",
        ],
        touches: ["prototypes/das/v4/screens/manage-campaigns.tsx", "prototypes/das/v4/screens/campaign-ui.tsx"],
    },
    {
        slug: "campaign-health",
        title: "Campaign Health, as a traffic light",
        status: "Decided",
        decidedOn: "19 Oct",
        quotes: [
            "Let's change pacing to something like campaign health. Green, which is like everything's on pace. Orange: pacing is down, but there's still a big duration left of the campaign. And red, where pacing is down but it doesn't look like there's even enough time to make it up.",
            "You don't have to know that math. Even the front end can calculate it. Just represent it and we'll deal with how it actually works.",
            "A.",
        ],
        quoteDates: ["16 Oct review", "16 Oct review", "19 Oct"],
        decision: [
            "Chosen on 19 Oct: A, the counts by colour. The bar (B) and the named list (C) stay in Concepts as the record. Clicking the chip filters the table to the campaigns behind or at risk.",
            "The maths behind green, orange and red is a placeholder, written down in campaign-data.ts so engineering can replace it in one place. Today: on pace within 10% of the flight elapsed; orange if the daily spend needed to finish is at most 1.5× today's; red beyond that.",
            "Still open: whether the table also gets a Campaign Health column — see Campaigns Table.",
        ],
        touches: ["prototypes/das/v4/screens/campaign-data.ts", "prototypes/das/v4/screens/manage-campaigns.tsx"],
    },
    {
        slug: "breadcrumb",
        title: "The breadcrumb gets its own strip",
        status: "Applied",
        quotes: ["There's already a convention for how we do the little breadcrumb nav. We put it in its own strip. So use this."],
        decision: [
            "The convention on Manage active demand — “← Demand : Add Demand Sources” — in a strip under the account header: “← Campaigns : Sports fans”, and on Full performance “← Campaigns : Sports fans : Full performance”.",
            "The old breadcrumb sat in grey in the page body with no contrast against the title; this one is the first thing in the page.",
        ],
        touches: ["prototypes/das/v4/screens/campaign-ui.tsx"],
    },
    {
        slug: "overview-header",
        title: "The overview leads with what matters at a glance",
        status: "Applied",
        quotes: [
            "The things that are going to be relevant at a glance are whether or not it's running, what the rules are, flight dates, apps and platform.",
            "Just put the campaign name.",
        ],
        decision: [
            "The header is the campaign's name, its status and its rule, then three labelled facts: Flight dates, Platform, Apps. Ad unit and creative count leave the header; both are still in the sections below.",
            "Sample campaigns are renamed so a name is only a name — “Sports fans”, not “Sports fans · Interstitial” — in Manage campaigns, setup, the asset and keyword libraries.",
            "Pause, Duplicate and Edit campaign stay as they were.",
        ],
        touches: ["prototypes/das/v4/screens/campaign-view.tsx", "prototypes/das/v4/screens/campaign-setup.tsx"],
    },
    {
        slug: "overview-summary",
        title: "One summary on the overview, not two",
        status: "Decided",
        decidedOn: "19 Oct",
        quotes: ["I would either do this sidebar, or I would make it these top thingies — it's the same content repeated. So I would pick one, and put it on this main page.", "Cards."],
        quoteDates: ["16 Oct review", "19 Oct"],
        decision: [
            "Chosen on 19 Oct: cards. Four cards above the chart — Spend, Campaign Health, Impressions, Days left — so the chart gets the page's full width and the cards match the chips on Manage campaigns.",
            "The sidebar version stays in Concepts as the record.",
        ],
        touches: ["prototypes/das/v4/screens/campaign-view.tsx"],
    },
    {
        slug: "chart-tooltip",
        title: "Dollars back in the delivery tooltip",
        status: "Applied",
        quotes: ["Yep, let's put money back in."],
        decision: [
            "The tooltip read “Spend: 11215”. It now reads the date, the day of the flight, and both lines in dollars — “Sep 12 · day 12 of 30 · Spend $10,235 · On pace $10,000” — at the 15px floor. The x-axis shows dates instead of day numbers.",
        ],
        touches: ["prototypes/das/v4/screens/campaign-ui.tsx", "prototypes/das/v4/screens/campaign-view.tsx"],
    },
    {
        slug: "full-performance",
        title: "Full performance, the third screen",
        status: "Applied",
        quotes: [
            "We need to show it by creative, by platform. We're gonna need UI against this chart.",
            "How is this creative performing on this platform in this geo? Especially if I'm underspending, I want to see where am I underspending.",
            "I don't need any summaries on this. I need a very robust breakdown, and an export CSV of whatever view I'm on.",
            "Across the top — use the look, feel and styling of Performance Insights.",
        ],
        quoteDates: ["16 Oct review", "16 Oct review", "16 Oct review", "19 Oct"],
        decision: [
            "Manage campaigns → overview → Full performance, linked from the delivery chart. No summary panel.",
            "19 Oct: the builder sits across the top in Performance Insights' look — START DATE / END DATE, a range and an interval, then Metrics, Breakdown, Filters (+ ADD) and Chart Type (Table, Line, Area, Bar, Stacked bar, Pie), with pink uppercase actions. Held to the 15px floor.",
            "Break down by Creative, Platform (now with Unity), Geo, App, Keyword and Device Language, two at a time to pivot one against the other; filter any of them; tick any of Spend, Impressions and eCPM.",
            "Download .CSV takes the table on screen, as filtered. Every breakdown adds up to the campaign's real total.",
        ],
        touches: ["prototypes/das/v4/screens/full-performance.tsx", "prototypes/das/v4/screens/campaign-series.ts"],
    },
    {
        slug: "keyword-reporting",
        title: "Keywords: on screen, or CSV only?",
        status: "To confirm",
        quotes: [
            "Keywords is ANY — the same way geo would be, for instance.",
            "In the charter, can you actually check this? That's going to be important on how we report on this.",
        ],
        quoteDates: ["19 Oct", "16 Oct review"],
        decision: [
            "Settled 19 Oct: keywords match on ANY, like geos. So each keyword reports on its own row; an impression that matches more than one counts under the first it matched, so the rows still add up. The “one set” option is gone.",
            "Still open, with an example sent back: may per-keyword figures be on screen? The charter keeps per-keyword breakdowns to CSV and the API at launch, with no per-keyword charting in the dashboard.",
            "A puts Keyword on screen like any breakdown (the prototype's default). B is the charter: Keyword can't be picked on screen, and a Download by keyword .CSV gives the figures.",
        ],
        touches: ["prototypes/das/v4/screens/full-performance.tsx"],
    },
    {
        slug: "targeting-block",
        title: "Targeting, as the charter has it",
        status: "Applied",
        quotes: ["If you're a publisher who has many apps, you can decide which ones."],
        decision: [
            "On the campaign view's Targeting: “Platforms” is now Platform, as in setup; Apps has its own row, grouped by app (“Daily Scores (iOS, Android)”); “ANY of” is gone from Keywords, since keywords match on ANY with no toggle (confirmed 19 Oct).",
            "19 Oct: Device Language has a row again, and Platform can include Unity.",
        ],
        touches: ["prototypes/das/v4/screens/campaign-view.tsx"],
    },
    {
        slug: "unity-platform",
        title: "Unity is a platform",
        status: "Decided",
        decidedOn: "19 Oct",
        quotes: ["Yes — Unity counts as a platform."],
        quoteDates: ["19 Oct"],
        decision: [
            "Platform in setup offers iOS, Android and Unity. The four games in the sample account ship a Unity build, so the Apps picker lists 56 apps, and Unity builds only meet the Unity platform in reporting.",
            "Sample campaigns include Unity, so it shows in the campaigns table, the overview's header and Targeting, and as a Platform breakdown on Full performance.",
        ],
        touches: ["prototypes/das/v4/screens/target-data.ts", "prototypes/das/v4/screens/existing-targets.tsx", "prototypes/das/v4/screens/campaign-data.ts"],
    },
    {
        slug: "device-language",
        title: "Device Language is back",
        status: "Decided",
        decidedOn: "19 Oct",
        quotes: ["This was added in the charter, right? If so, in."],
        quoteDates: ["19 Oct"],
        decision: [
            "It is in the charter — a new standard target, the device's OS locale as ISO 639-1 codes — so it is in. It was dropped on 1 Oct on a note that said otherwise.",
            "Setup has a Device Language module between Ad Unit and Keywords, with the same search-and-table pattern as Apps and Keywords, and the rail lists it. The overview's Targeting has a row, and Full performance can break down by it.",
            "Match logic stays out: keywords match on ANY with no toggle.",
        ],
        touches: ["prototypes/das/v4/screens/language-target.tsx", "prototypes/das/v4/screens/targeting-section.tsx", "prototypes/das/v4/screens/campaign-setup.tsx"],
    },
];

/** A screen in prototype v4: label and its hash route. */
export type ScreenLink = [label: string, route: string];
/** A story in this category: label and its Storybook id. */
export type StoryLink = [label: string, id: string];

/**
 * Where to see each change: the prototype v4 screens it shows on, and the stories in
 * this category that compare or present it. Rendered as links on Oct 17 › Overview.
 */
export const links: Record<string, { prototype: ScreenLink[]; stories: StoryLink[] }> = {
    "creative-previews": {
        prototype: [
            ["Creative step", "step-creative"],
            ["Asset Setup", "asset-setup-filled"],
            ["Asset detail", "asset-detail"],
        ],
        stories: [
            ["Creative · R3 → R4", "oct-17-applied-changes--creative-after"],
            ["Asset Setup · R3 → R4", "oct-17-applied-changes--asset-setup-after"],
        ],
    },
    "campaigns-table": {
        prototype: [
            ["Campaigns table", "campaigns"],
            ["With a health column", "campaigns-health-column"],
        ],
        stories: [
            ["Manage campaigns · R3 → R4", "oct-17-applied-changes--campaigns-after"],
            ["Table concepts", "oct-17-concepts-campaigns-table--as-staging"],
        ],
    },
    "highlight-chips": {
        prototype: [
            ["Campaigns table", "campaigns"],
            ["Filtered by health", "campaigns-attention"],
        ],
        stories: [["Manage campaigns · R4", "oct-17-applied-changes--campaigns-after"]],
    },
    "campaign-health": {
        prototype: [
            ["Counts (chosen)", "campaigns"],
            ["Clicked", "campaigns-attention"],
        ],
        stories: [
            ["A · Counts (chosen)", "oct-17-concepts-campaign-health--counts"],
            ["B · Bar", "oct-17-concepts-campaign-health--bar"],
            ["C · Needs attention", "oct-17-concepts-campaign-health--to-do"],
        ],
    },
    breadcrumb: {
        prototype: [
            ["Overview", "view-a"],
            ["Full performance", "view-d"],
        ],
        stories: [["Overview · R3 → R4", "oct-17-applied-changes--overview-after"]],
    },
    "overview-header": {
        prototype: [
            ["Overview", "view-a"],
            ["At risk", "view-a-at-risk"],
            ["Queued", "view-a-queued"],
        ],
        stories: [
            ["Overview · R3", "oct-17-applied-changes--overview-before"],
            ["Overview · R4", "oct-17-applied-changes--overview-after"],
        ],
    },
    "overview-summary": {
        prototype: [["Cards (chosen)", "view-a"]],
        stories: [
            ["A · Sidebar", "oct-17-concepts-overview-summary--sidebar"],
            ["B · Cards (chosen)", "oct-17-concepts-overview-summary--cards"],
            ["Cards, at risk", "oct-17-concepts-overview-summary--cards-at-risk"],
        ],
    },
    "chart-tooltip": {
        prototype: [["Overview (hover the chart)", "view-a"]],
        stories: [["Overview · R4", "oct-17-applied-changes--overview-after"]],
    },
    "full-performance": {
        prototype: [
            ["Full performance", "view-d"],
            ["Pivot", "view-d-pivot"],
        ],
        stories: [
            ["Performance · R3 → R4", "oct-17-applied-changes--performance-after"],
            ["Across the top (chosen)", "oct-17-concepts-full-performance-layout--decided"],
            ["Stacked bar", "oct-17-concepts-full-performance-layout--stacked-bar"],
        ],
    },
    "keyword-reporting": {
        prototype: [
            ["A · On screen", "view-d-keywords"],
            ["B · CSV only", "view-d-keywords-csv"],
        ],
        stories: [
            ["A · On screen", "oct-17-concepts-keyword-reporting--on-screen"],
            ["B · CSV only", "oct-17-concepts-keyword-reporting--csv-only"],
        ],
    },
    "unity-platform": {
        prototype: [
            ["Setup · Platform", "step-targeting"],
            ["Overview", "view-a"],
            ["Pivot by platform", "view-d-pivot"],
        ],
        stories: [["Overview · R4", "oct-17-applied-changes--overview-after"]],
    },
    "device-language": {
        prototype: [
            ["Setup · Device Language", "step-targeting"],
            ["Overview · Targeting", "view-a"],
        ],
        stories: [["Setup · Targeting", "deal-activation-system-campaign-setup-sections-targeting--filled"]],
    },
    "targeting-block": {
        prototype: [["Overview · Targeting", "view-a"]],
        stories: [["Overview · R4", "oct-17-applied-changes--overview-after"]],
    },
};

export const bySlug = (slug: string): FeedbackItem => {
    const found = items.find((i) => i.slug === slug);
    if (!found) throw new Error(`No Oct 17 feedback item named “${slug}”`);
    return found;
};
