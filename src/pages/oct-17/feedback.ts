/**
 * Oct 17 — the feedback batch behind Round 4, as data.
 *
 * One entry per change coming out of the 16 October review of Round 3. Quotes are
 * trimmed to the design point, and the reviewer is named by role, because this
 * Storybook publishes to a public URL.
 *
 * Applied means it was decided on the call and is in prototype v4. Concepts means the
 * call left a choice open, and the options sit side by side under Oct 17 › Concepts.
 * To confirm means it is built on a reading that still needs an answer.
 */

export type Status = "Applied" | "Concepts" | "To confirm";

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
        status: "Concepts",
        quotes: [
            "Let's change pacing to something like campaign health. Green, which is like everything's on pace. Orange: pacing is down, but there's still a big duration left of the campaign. And red, where pacing is down but it doesn't look like there's even enough time to make it up.",
            "You don't have to know that math. Even the front end can calculate it. Just represent it and we'll deal with how it actually works.",
        ],
        decision: [
            "Three ways to show the same three counts in one chip: the counts by colour, a segmented bar, or the campaigns that need attention by name. Same click in all three — it filters the table to the campaigns behind or at risk.",
            "The maths behind green, orange and red is a placeholder, written down in campaign-data.ts so engineering can replace it in one place. Today: on pace within 10% of the flight elapsed; orange if the daily spend needed to finish is at most 1.5× today's; red beyond that.",
            "A fourth option, a Campaign Health column in the table, is under Campaigns Table.",
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
        status: "Concepts",
        quotes: ["I would either do this sidebar, or I would make it these top thingies — it's the same content repeated. So I would pick one, and put it on this main page."],
        decision: [
            "A keeps Round 3's Live delivery rail beside the chart. B moves the same figures into four cards above it: Spend, Campaign Health, Impressions, Days left. Both now carry Campaign Health.",
            "The prototype opens on B. Cards give the chart the page's full width, and the cards match the chips on Manage campaigns.",
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
        ],
        decision: [
            "Manage campaigns → overview → Full performance, linked from the delivery chart. No summary panel.",
            "Break down by Creative, Platform, Geo, App and Keywords, two at a time to pivot one against the other; filter any of them; Spend, Impressions or eCPM; flight to date, 14 or 7 days; line, bar or table. Modelled on Performance Insights' query builder.",
            "Export CSV downloads the table on screen, as filtered. Every breakdown adds up to the campaign's real total.",
            "Where the controls sit — across the top or down the left — is under Concepts.",
        ],
        touches: ["prototypes/das/v4/screens/full-performance.tsx", "prototypes/das/v4/screens/campaign-series.ts"],
    },
    {
        slug: "keyword-reporting",
        title: "Keywords: all-or-nothing, or any?",
        status: "To confirm",
        quotes: [
            "It's by the combination of keywords. It's all or nothing on the keywords mapped to a particular campaign.",
            "In the charter, can you actually check this? I think it's all or nothing. If it's not in the charter, tell me and I will get an answer — that's going to be important on how we report on this.",
        ],
        decision: [
            "Checked. The charter does not say all-or-nothing. Its setup wireframe has a Match Logic toggle — ANY keyword matches / ALL must match — and says to default to ANY. Match logic was then dropped from setup on 1 Oct, so which one the backend does is now unstated.",
            "The charter's reporting guardrail also matters here: per-keyword breakdowns are CSV and API only at launch, with no per-keyword charting in the dashboard.",
            "Built on Product's reading: a campaign's keywords report as one set (“sports + power-user”), which is one row and stays inside the guardrail. Concept B shows keywords one by one for comparison; it would need the guardrail changed.",
        ],
        touches: ["prototypes/das/v4/screens/full-performance.tsx"],
    },
    {
        slug: "targeting-block",
        title: "Targeting, as the charter has it",
        status: "Applied",
        quotes: ["If you're a publisher who has many apps, you can decide which ones."],
        decision: [
            "On the campaign view's Targeting: “Platforms” is now Platform, as in setup; Apps has its own row, grouped by app (“Daily Scores (iOS, Android)”); “ANY of” is gone from Keywords, since match logic was dropped from setup on 1 Oct.",
            "Device Language is still out pending Product, and Manage campaigns no longer shows a language anywhere.",
        ],
        touches: ["prototypes/das/v4/screens/campaign-view.tsx"],
    },
];

export const bySlug = (slug: string): FeedbackItem => {
    const found = items.find((i) => i.slug === slug);
    if (!found) throw new Error(`No Oct 17 feedback item named “${slug}”`);
    return found;
};
