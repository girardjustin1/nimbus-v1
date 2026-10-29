/**
 * Oct 29 Edits — the 28 Oct DAS reporting review, as data, behind Round 6.
 *
 * One entry per change Product listed after the call. Quotes are trimmed to the design
 * point, and speakers are named by role, because this Storybook publishes to a public URL.
 *
 * Applied means it was decided and is in prototype v6. Concept means Product asked us to
 * explore it, and it's built as an alternative to talk through. To confirm means it is
 * built on a reading that still needs an answer. Pending waits on something outside the
 * prototype.
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
    /** From the 28 Oct call, trimmed to the design point. */
    quotes: Quote[];
    /** What we did, and why that reading of the quote. */
    decision: string[];
    /** Files in prototype v6 that changed. */
    touches: string[];
}

const v6 = (file: string) => `prototypes/das/v6/screens/${file}`;

export const framing = {
    quote: "We're going to stop making it real time for actual spend. We're going to show pacing as a percentage, and it will be real-time accurate. And then all numbers will be the same.",
    decision:
        "Customers' complaint is that DAS and Performance Insights show different spend numbers, not that spend isn't live. So every spend figure in DAS becomes the trued-up one Performance Insights shows, labelled “Subject to true-up”, and what stays live is pacing. Full performance stays in DAS, with more metrics and breakdowns.",
};

export const items: FeedbackItem[] = [
    {
        slug: "pacing-column",
        title: "Campaign Health is Pacing, a sortable column in the list",
        status: "Applied",
        quotes: [
            {
                who: "Product",
                text: "We'll call it just pacing, right? So let's have a column called pacing … let's elevate it to this page so you can sort by pacing, and then all the ones that [need help] will come up to the top.",
            },
        ],
        decision: [
            "Campaign Health is renamed Pacing everywhere: the chip, the campaign overview, the filter and the tooltips.",
            "Pacing is a column beside Status in Manage campaigns. Its first click sorts worst first; campaigns that aren't pacing (queued, paused, complete, Fallback) always sort to the bottom and say why in grey.",
            "Budget and Spend stay as columns. On the call they were going to go, but the plan settled on the trued-up number everywhere, so they stay with “Subject to true-up” on Spend.",
        ],
        touches: [v6("manage-campaigns.tsx"), v6("campaign-data.ts"), v6("campaign-ui.tsx")],
    },
    {
        slug: "lifecycle",
        title: "Campaign Delivery: one column that changes with the campaign",
        status: "Concept",
        quotes: [
            {
                who: "Product",
                text: "This column could change to campaign delivery. And when the campaign is in flight, it can say in-flight pacing on target or in-flight pacing behind.",
            },
            {
                who: "Product",
                text: "And then they could still be 2 columns because then you could sort by spend or sort by budget, which I still think is useful.",
            },
            { who: "Product", text: "At least the bad visual goes away and it just settles to budget and spend." },
        ],
        decision: [
            "A second Manage campaigns screen: Campaign Delivery takes Pacing's place beside Status. In flight, its two cells read as one — “In flight · on target · 102.0% pacing”.",
            "Once a campaign is complete, the same cells settle to its final Budget and Spend, two columns that each sort. A badly paced campaign doesn't stay red forever.",
            "Clicking Campaign Delivery sorts by pacing, worst first. Budget and Spend sort the completed campaigns, with campaigns in flight after them. To talk through together before it's settled.",
        ],
        touches: [v6("manage-campaigns.tsx")],
    },
    {
        slug: "true-up",
        title: "One spend number, subject to true-up",
        status: "Applied",
        quotes: [
            {
                who: "Product",
                text: "The actual specific numbers that we're hanging our hat on are all the same across the whole platform, and we label every single thing subject to true-up.",
            },
            { who: "Product", text: "Showing 2 different numbers is just a big no-no." },
        ],
        decision: [
            "Spend, everywhere in DAS, is the trued-up number Performance Insights shows, with an ⓘ that says “Subject to true-up. Updated hourly. The last 48 hours can still be corrected, so this can move a little up or down.”",
            "Where it appears: the Total spend card and the Spend column on Manage campaigns, the Spend card and the delivery rail on a campaign, and Revenue in Full performance.",
            "Nothing in DAS calls spend real time any more. The delivery rail's “Live delivery” heading is now “Delivery”; the only live figure is pacing.",
        ],
        touches: [v6("campaign-ui.tsx"), v6("manage-campaigns.tsx"), v6("campaign-view.tsx"), v6("full-performance.tsx")],
    },
    {
        slug: "pacing-pct",
        title: "Real-time pacing, to the nearest 0.5%",
        status: "Applied",
        quotes: [
            { who: "Engineering", text: "What if we just do pacing as a percent in real time? … We could go to the nearest half percent." },
            { who: "Product", text: "That's what I think they care about: the trend, less so the actual number." },
        ],
        decision: [
            "Pacing = the share of the budget delivered ÷ the share of the flight gone. 100% is exactly on pace, under is behind, over is ahead. Shown to the nearest 0.5% so it doesn't give away the spend underneath.",
            "The campaign overview's Pacing card shows the percentage, its colour and its word, with “Live · 31% delivered · 57% expected by now” under it. The behind and at-risk banner leads with it.",
        ],
        touches: [v6("campaign-data.ts"), v6("campaign-view.tsx")],
    },
    {
        slug: "pacing-chart",
        title: "The pacing graph: expected against actual, as a percentage",
        status: "Applied",
        quotes: [{ who: "Engineering", text: "And then that chart can show expected and real. As a percent." }],
        decision: [
            "The overview's delivery chart plots the share of the goal delivered (0–100%) against the share expected by each day, not dollars. The axis runs 0% to 100%; the tooltip reads “58.0% of goal”.",
            "Fallback campaigns have no goal, so they still chart impressions.",
        ],
        touches: [v6("campaign-view.tsx")],
    },
    {
        slug: "fp-stays",
        title: "Full performance stays in DAS",
        status: "Applied",
        quotes: [
            {
                who: "Product",
                text: "We all feel like it's appropriate to have this whole full performance thing, kind of a deep dive, in the DAS section, not inside Performance Insights.",
            },
        ],
        decision: ["No move. Performance Insights keeps DAS at deal and campaign level; anything below a campaign is reported here."],
        touches: [],
    },
    {
        slug: "fp-metrics",
        title: "Full performance: Revenue, and render rate, clicks and CTR",
        status: "Applied",
        quotes: [
            {
                who: "Product",
                text: "This is essentially revenue, impressions, eCPM. We'll put CTR here. If we have view-through, they're going to want that too.",
            },
            { who: "Product", text: "We want to add render rate, clicks, and CTR to what we have now." },
        ],
        decision: [
            "Metrics: Revenue (was Spend, the same money, renamed to match Performance Insights), Impressions, eCPM, Render rate, Clicks and CTR. Revenue carries the true-up ⓘ.",
            "View-through has its checkbox, off and marked “if available”, until engineering confirms DAS records it.",
            "Nothing that needs a request, like fill rate or win rate: a request can't be told apart as DAS or Open Marketplace. Rates (eCPM, Render rate, CTR) don't stack or go in a pie.",
        ],
        touches: [v6("full-performance.tsx")],
    },
    {
        slug: "fp-breakdowns",
        title: "Full performance: new breakdowns",
        status: "Applied",
        quotes: [
            { who: "Product", text: "Account, account manager, app category." },
            { who: "Product", text: "Yes, we want position. No, we don't want placement. And then yes, we want region." },
            {
                who: "Product",
                text: "Some people think about things by country and some people absolutely think about things by region. So we actually needed the option for both.",
            },
        ],
        decision: [
            "Breakdowns: Creative, Platform, App, Keyword and Device Language as before, plus Account, Account manager, App category and Position (the name publishers give a placement).",
            "Geo becomes two splits: Region bundles the US, Canada and Mexico under North America; Country keeps them apart. Still two breakdowns at once, to pivot.",
        ],
        touches: [v6("full-performance.tsx")],
    },
    {
        slug: "geo-split",
        title: "Geo is now Region and Country",
        status: "To confirm",
        quotes: [],
        decision: [
            "The notes list geo and also region and country. We read that as Geo being replaced by its two splits rather than three checkboxes that overlap. Say if you want Geo kept as well.",
        ],
        touches: [v6("full-performance.tsx")],
    },
    {
        slug: "pace-colors",
        title: "Pacing colours: a slot for green, yellow and red",
        status: "Pending",
        quotes: [
            {
                who: "Product",
                text: "This is where we'll have to come up with: is that red or is that yellow? It's probably yellow, 'cause there's a lot of time left.",
            },
        ],
        decision: [
            "The colours are in, on placeholder cut-offs so the design reads whole: green 95% and up, yellow 80% to 95%, red under 80%. They live as one setting (PACE_THRESHOLDS), so the real ones are a one-line change.",
            "Yellow, not Round 5's orange. The word beside a yellow dot is dark amber, since yellow text on white can't be read.",
        ],
        touches: [v6("campaign-data.ts")],
    },
];

/** Not in the prototype, but decided or raised on the call. */
export const outside: { title: string; status: Status; note: string }[] = [
    {
        title: "Performance Insights drops the DAS asset breakdown",
        status: "Pending",
        note: "“We're killing asset. That's really the only change to PI.” Engineering, outside the prototype.",
    },
    {
        title: "Sales sign-off on dropping real-time spend",
        status: "Pending",
        note: "Product is checking with sales that publishers don't expect live spend before this ships.",
    },
    {
        title: "Quick fix ahead of the targeting project",
        status: "Pending",
        note: "Engineering may add a plain pacing-percentage column and the true-up tooltips to today's Manage campaigns once sales agrees, with no colours.",
    },
    {
        title: "Staging's “real-time” spend label",
        status: "Pending",
        note: "The prototype never called spend real time; the label to drop is on today's product.",
    },
    { title: "Campaign Delivery column", status: "Concept", note: "To talk through together after the revisions, by the end of next week." },
];

export const bySlug = (slug: string) => items.find((i) => i.slug === slug)!;

/** Where to see each change: prototype v6 routes, and Storybook story ids. */
export const links: Record<string, { prototype: [string, string][]; stories: [string, string][] }> = {
    "pacing-column": {
        prototype: [
            ["Manage campaigns", "campaigns"],
            ["Sorted by pacing", "campaigns-pacing-sorted"],
        ],
        stories: [
            ["Round 5 → 6 · Campaigns", "oct-29-edits-applied-changes--campaigns-after"],
            ["Sorted by pacing", "oct-29-edits-applied-changes--campaigns-sorted"],
        ],
    },
    lifecycle: {
        prototype: [["Campaign Delivery concept", "campaigns-lifecycle"]],
        stories: [["Campaign Delivery concept", "oct-29-edits-applied-changes--campaign-delivery"]],
    },
    "true-up": {
        prototype: [
            ["Manage campaigns", "campaigns"],
            ["Campaign overview", "view-a"],
            ["Full performance", "view-d"],
        ],
        stories: [["Round 5 → 6 · Campaigns", "oct-29-edits-applied-changes--campaigns-after"]],
    },
    "pacing-pct": {
        prototype: [
            ["Overview · at risk", "view-a-at-risk"],
            ["Overview · on target", "view-a"],
        ],
        stories: [["Round 5 → 6 · Overview", "oct-29-edits-applied-changes--overview-after"]],
    },
    "pacing-chart": {
        prototype: [["Overview · behind", "view-a-behind"]],
        stories: [["Round 5 → 6 · Overview", "oct-29-edits-applied-changes--overview-after"]],
    },
    "fp-stays": {
        prototype: [["Full performance", "view-d"]],
        stories: [],
    },
    "fp-metrics": {
        prototype: [["New metrics", "view-d-new-metrics"]],
        stories: [["Round 5 → 6 · Full performance", "oct-29-edits-applied-changes--performance-after"]],
    },
    "fp-breakdowns": {
        prototype: [
            ["Region and country", "view-d-region-country"],
            ["Full performance", "view-d"],
        ],
        stories: [["Region and country", "oct-29-edits-applied-changes--region-country"]],
    },
    "geo-split": {
        prototype: [["Region and country", "view-d-region-country"]],
        stories: [["Region and country", "oct-29-edits-applied-changes--region-country"]],
    },
    "pace-colors": {
        prototype: [
            ["Manage campaigns", "campaigns"],
            ["Overview · behind", "view-a-behind"],
        ],
        stories: [],
    },
};
