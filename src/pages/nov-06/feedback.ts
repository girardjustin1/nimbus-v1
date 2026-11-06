/**
 * Nov 6 Edits — the 6 Nov pacing-chart review, as data, behind the Round 6 tweaks.
 *
 * Same shape as Oct 29 Edits. Quotes are trimmed to the design point, and speakers are
 * named by role, because this Storybook publishes to a public URL.
 *
 * Applied means it is in prototype v6. Concept means it's one of the options to choose
 * between. Pending waits on something outside the prototype.
 */

export type Status = "Applied" | "Concept" | "To confirm" | "Pending";

export interface Quote {
    who: "Product" | "Engineering";
    text: string;
}

export interface FeedbackItem {
    slug: string;
    title: string;
    status: Status;
    /** From the 6 Nov call, trimmed to the design point. */
    quotes: Quote[];
    /** What we did, and why that reading of the quote. */
    decision: string[];
    /** Files in prototype v6 that changed. */
    touches: string[];
}

const v6 = (file: string) => `prototypes/das/v6/screens/${file}`;

export const framing = {
    quote: "If pacing is a little bit off, you're seeing that you don't have the opportunities you had … we want to add two lines to this graph.",
    decision:
        "Sales shared Product's worry that a pacing chart could make Nimbus look bad when a campaign is behind. The answer is to keep the chart and give it context: the ad requests and daily active users behind each day, so a dip in pacing can be read against a dip in opportunity. Requests are data Nimbus has today; daily active users are being pulled by the backend and should be ready before launch.",
};

export const items: FeedbackItem[] = [
    {
        slug: "requests",
        title: "Requests on the Delivery chart",
        status: "Applied",
        quotes: [
            {
                who: "Product",
                text: "We want to show what you have: actual pacing, expected pacing. We want to add requests, which is data that we currently have.",
            },
            {
                who: "Product",
                text: "Requests are ad requests. It means a user got to a place that an ad can go.",
            },
        ],
        decision: [
            "The campaign overview's Delivery chart now carries the day's ad requests across the campaign's apps.",
            "The overview opens on concept C (pacing above, opportunity below, one shared hover); the toolbar's Chart menu switches any overview between Round 6 and A–I, and Chart Concepts shows them side by side.",
            "Sample requests swing with the week, busiest on Saturdays, as Performance Insights showed on the call.",
        ],
        touches: [v6("delivery-chart.tsx"), v6("campaign-series.ts"), v6("campaign-view.tsx")],
    },
    {
        slug: "daus",
        title: "Daily active users on the Delivery chart",
        status: "Pending",
        quotes: [
            {
                who: "Product",
                text: "If we have daily active users plus requests, that's going to give the full picture of opportunity.",
            },
        ],
        decision: [
            "Built in, as sample data, and labelled as sample under the chart: the backend is pulling DAUs and Product expects them before launch.",
            "Users and requests together say why opportunity moved. The at-risk sample campaign (Sports fans, Spanish) lost users; the behind one (Morning commuters) kept its users, but they reached fewer ad slots — the frequency-cap case from the call.",
        ],
        touches: [v6("campaign-series.ts"), v6("delivery-chart.tsx")],
    },
    {
        slug: "chart-concepts",
        title: "Five ways to show pacing and opportunity together",
        status: "Concept",
        quotes: [
            {
                who: "Product",
                text: "Yeah, that sounds great.",
            },
        ],
        decision: [
            "Offered on the call: alternative layouts, including active users as bars because they're a volume. Five concepts, A to E, each on the at-risk campaign.",
            "A and B put requests and users on a second axis, as asked. They read only if you check which axis each line uses, and lines cross where the two scales happen to meet rather than where anything happens.",
            "C, D and E keep one scale per chart. C is recommended and is the overview's default; the choice is yours.",
        ],
        touches: [v6("delivery-chart.tsx"), "prototypes/das/v6/screens.tsx"],
    },
    {
        slug: "one-chart",
        title: "On one chart: four overlays",
        status: "Concept",
        quotes: [
            {
                who: "Product",
                text: "Can we overlay them on the same chart rather than 2 separate? Or am I missing an alternate version?",
            },
        ],
        decision: [
            "Not missing one: A and B already overlay, but the page opens on C, so they're one pick away in the toolbar's Chart menu.",
            "A second batch, F to I, keeps everything on one chart and answers A's second axis a different way each: F titles and tints both axes and lets you switch requests and users off; G puts opportunity faint behind pacing with no second axis; H puts all four on one % scale; I shades the days opportunity fell and labels the drop.",
            "Same campaign and numbers as the first batch. The overview still opens on C until Product picks.",
        ],
        touches: [v6("delivery-chart.tsx"), v6("campaign-series.ts"), v6("chart-picker-ui.tsx"), "prototypes/das/v6/screens.tsx"],
    },
    {
        slug: "sortable",
        title: "Every table sorts",
        status: "Applied",
        quotes: [
            {
                who: "Product",
                text: "Every table needs to be sortable … everything's sortable.",
            },
        ],
        decision: [
            "One sortable header for every table in DAS, the same rule Manage campaigns already had: click to sort ascending, again for descending, a third time for the table's own order. Empty values sort last either way.",
            "Newly sortable: View All Assets, View All Keywords, the Full performance table (breakdowns, every metric, share), the campaign overview's creative list, and the selected-items tables in setup (keywords, apps, assets, languages).",
        ],
        touches: [
            v6("table-sort.ts"),
            v6("nimbus-ui.tsx"),
            v6("asset-library.tsx"),
            v6("keyword-library-v3.tsx"),
            v6("full-performance.tsx"),
            v6("campaign-view.tsx"),
            v6("search-select.tsx"),
        ],
    },
    {
        slug: "pace-colors",
        title: "Red and yellow pacing: to be decided",
        status: "Pending",
        quotes: [
            {
                who: "Product",
                text: "We're very TBD on whether or not to highlight the red, the yellow … let's leave it for now.",
            },
        ],
        decision: [
            "Left as it is: the placeholder green, yellow and red stay in the list and the overview until Product and sales decide whether to show them.",
        ],
        touches: [],
    },
];

export const outside: { title: string; status: Status; note: string }[] = [
    {
        title: "Daily active users from the backend",
        status: "Pending",
        note: "The backend team is pulling DAUs; Product expects them before launch. Until then the chart's DAUs are sample data.",
    },
    {
        title: "A global style proposal for engineering",
        status: "Pending",
        note: "Engineering has started building DAS and is asking about styles. Design sends a list of what should change globally, drawn from the Typography Audit, Typography Rules and this Storybook; Product checks the level of effort with engineering so style work doesn't hold up features.",
    },
    {
        title: "How much global restyling DAS takes on",
        status: "Pending",
        note: "Product's direction to engineering for now: lean on the current styles, and keep a running list of global updates for approval.",
    },
];

export const bySlug = (slug: string) => items.find((i) => i.slug === slug)!;

/** Where to see each change: prototype v6 routes, and story ids in this Storybook. */
export const links: Record<string, { prototype: [string, string][]; stories: [string, string][] }> = {
    requests: {
        prototype: [
            ["Overview · at risk", "view-a-at-risk"],
            ["Overview · on target", "view-a"],
        ],
        stories: [["Overview · Round 6 → 6 Nov", "nov-6-edits-applied-changes--overview-after"]],
    },
    daus: {
        prototype: [["Overview · behind", "view-a-behind"]],
        stories: [["Fewer slots, same users", "nov-6-edits-applied-changes--overview-behind"]],
    },
    "chart-concepts": {
        prototype: [
            ["A", "view-a-chart-overlay"],
            ["B", "view-a-chart-bars"],
            ["C", "view-a-chart-stacked"],
            ["D", "view-a-chart-indexed"],
            ["E", "view-a-chart-strip"],
        ],
        stories: [["Chart Concepts", "nov-6-edits-chart-concepts--all-five"]],
    },
    "one-chart": {
        prototype: [
            ["F", "view-a-chart-labelled"],
            ["G", "view-a-chart-backdrop"],
            ["H", "view-a-chart-scaled"],
            ["I", "view-a-chart-bands"],
        ],
        stories: [["On One Chart", "nov-6-edits-on-one-chart--all-four"]],
    },
    sortable: {
        prototype: [
            ["View All Assets", "asset-view"],
            ["View All Keywords", "keyword-view"],
            ["Full performance", "view-d"],
        ],
        stories: [
            ["Assets", "nov-6-edits-applied-changes--assets-sortable"],
            ["Full performance", "nov-6-edits-applied-changes--performance-sortable"],
        ],
    },
    "pace-colors": {
        prototype: [["Manage campaigns", "campaigns"]],
        stories: [],
    },
};
