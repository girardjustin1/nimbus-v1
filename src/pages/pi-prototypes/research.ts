/**
 * Performance Insights · Round 2 research: what was heard at the 24 Nov 2026 PI sync,
 * the field tiers from the data inventory, the constraints engineering set, and the
 * patterns found on Mobbin.
 *
 * This site is public. Roles, never people's names; no publisher names or figures; the
 * staff-only tier is named, never listed. Mobbin screens are linked, never copied here:
 * the pictures belong to Mobbin and stay in the team's Mobbin collection.
 */

/** The team's Mobbin collection (private: opens for the team only). */
export const MOBBIN_COLLECTION = "https://mobbin.com/collections/ae8ba351-6a9a-4db9-a085-d289af4d1b6d/web/screens";

export const HEARD: { title: string; body: string }[] = [
    {
        title: "Performance Insights becomes the one reporting page",
        body: "It is near real time now, so it replaces the realtime dashboard. A publisher lands on it, and it has to show something on arrival, as realtime does today.",
    },
    {
        title: "Organise, don't redesign",
        body: "Publishers know the dashboard and it isn't broken. If it looks the same but is better organised, that is a valid solve. Keep it simple to start, then push a few concepts further.",
    },
    {
        title: "The filter band needs to be intentional",
        body: "The layout isn't tight enough, + Add ends up looking broken at the end of the row, and a checked filter behaves differently from a checked metric.",
    },
    {
        title: "Inline, not a pop-up",
        body: "Engineering prefers the inline filter row, as on realtime: it drops a library and helps load time. Opening it feels smooth.",
    },
    {
        title: "Speed is a hard limit",
        body: "Filters preload while the data pipes in behind them. A concept that is slow to load does not work, however it looks, so engineering weighs in early.",
    },
    {
        title: "Some lists are too long to list",
        body: "Advertiser has thousands of values and many requests don't name one at all. It has to be searched. Country is long but manageable.",
    },
    {
        title: "Nimbus+ stays one source for publishers",
        body: "Publishers see Nimbus+ as one demand source; staff see the partners inside it (names ending in +). That stays exactly as it is.",
    },
    {
        title: "A new component could serve DAS too",
        body: "If a filter component comes out of this that works well, it could carry back to DAS, for Geos.",
    },
    {
        title: "Generative is the future, not this project",
        body: "A version where you say what you want and it builds the view is loved, but out of scope. A middle step, an assistant that suggests what to toggle, can be shown as the future.",
    },
];

/** The five access tiers from the data inventory. Counts are fields and metrics. */
export const TIERS: { name: string; count: number; who: string; what: string }[] = [
    { name: "Default", count: 7, who: "Publishers and Nimbus", what: "Loads on open, as realtime does: Revenue, Requests, Impressions and eCPM, by day and platform, scoped to one app." },
    {
        name: "Quick add",
        count: 18,
        who: "Publishers and Nimbus",
        what: "One click from the surface: Wins, Win Rate, Fill Rate, Render Rate, Clicks, CTR, RCPM, Ad Unit, Ad Type, Position, Placement, Ad Size, App Version, SDK Version, Demand Source, Country, DAS Campaign, DAS Deal.",
    },
    {
        name: "Explore",
        count: 47,
        who: "Publishers and Nimbus",
        what: "A grouped, searchable picker: Inventory, Geo & network, Device, Audience & session, Request format, Creative & advertiser, Demand & deals, Video & delivery. Any field is a breakdown or a filter, unless it is filter-only.",
    },
    { name: "Nimbus internal", count: 17, who: "Nimbus staff only", what: "Its own tab, shown only to staff and tinted wherever it appears, so a screenshot shows when it holds staff-only data." },
    { name: "Captured, not displayed", count: 10, who: "Nobody in the interface", what: "Kept in the warehouse and never offered as a field." },
];

/** Engineering's constraints for the filter band, as design rules. */
export const CONSTRAINTS: { title: string; body: string }[] = [
    {
        title: "One band, shared with Buyer breakdown and Benchmarks",
        body: "Metrics, Breakdown and Filters share one band. “Filters:”, + Add and the chips expand inline into a category rail, a value list, and Cancel and Save. A change here shows on those two pages as well.",
    },
    {
        title: "Chips are not the query",
        body: "Save builds the chips. Unchecking a chip keeps it on the row but drops it from the query. Clear all removes both.",
    },
    { title: "Lists, not a select library", body: "Values are custom lists with checkboxes. Long lists use search and a cap, never endless scroll." },
    {
        title: "The page stacks at fixed heights",
        body: "Navigation, dates, metrics and filters, chart, table. A taller filter band fights the sticky stack.",
    },
    { title: "The phone is its own flow", body: "Under 737px it is one Display options sheet with an accordion, not a narrow band." },
    {
        title: "Free to restyle, careful to remodel",
        body: "Density, hierarchy, wrap, colour, type and panel polish are open. A new chip model, regrouping, a shell that isn't the inline expand, or very long lists without search and a cap need engineering.",
    },
];

export interface Reference {
    app: string;
    note: string;
    url: string;
}

export interface Pattern {
    id: string;
    title: string;
    takeaway: string;
    refs: Reference[];
}

const m = (id: string) => `https://mobbin.com/screens/${id}`;

export const PATTERNS: Pattern[] = [
    {
        id: "chip-row",
        title: "Filters as one row of removable chips",
        takeaway:
            "The best rows read as sentences (“Country is US ×”), stay on one line, and tuck the rest behind an overflow menu that holds Clear all and Save. Adding a filter is a fixed control, not the last chip.",
        refs: [
            { app: "Plausible Analytics", note: "“Page is /sign-up ×” chips on one row, an overflow with Save as segment and Clear all filters.", url: m("efd91c15-b39f-4c6b-96cd-4176075f286b") },
            { app: "Visitors", note: "Small “is Slack ×” chips over the metric row; the filter control is an icon at the right.", url: m("decbd241-09d5-42e6-be62-b9ef54306e0d") },
            { app: "Revolut", note: "Pill controls for account, period and category in one quiet row above the chart.", url: m("b2809120-c6b3-43d6-9142-35fbfddf28fb") },
            { app: "Whop", note: "The period, comparison and grain as a single row of compact controls.", url: m("0b39694c-dee7-4300-9f2e-ebe25b14c75e") },
        ],
    },
    {
        id: "value-panel",
        title: "A category rail and a value list, in one panel",
        takeaway:
            "The same two-pane shape as today's panel: categories on the left, values with search on the right. Good ones say how many are picked, offer Select all, and let you choose “is one of” or “is not one of”.",
        refs: [
            { app: "Base44", note: "Filters panel: category rail on the left, the chosen category's values with checkboxes on the right, Clear filter.", url: m("a272c926-5944-459a-9e56-0705ac96b621") },
            { app: "Gorgias", note: "“Is one of / is all of / is not one of”, search, Select all with a count, then the values.", url: m("17be7384-36a0-436b-b98b-a3a8cc5e5085") },
            { app: "Mixpanel", note: "Value picker with search, “Select all in list (3)” and one Add button.", url: m("87f36249-9cd4-4341-b932-1acaffc62b85") },
        ],
    },
    {
        id: "search-first",
        title: "Search first when the list is long",
        takeaway: "For fields with thousands of values, the panel opens on a search box and a short list of popular values. Nobody scrolls an alphabet.",
        refs: [
            { app: "Visitors", note: "Country filter opens on a search field; typing “uni” narrows to five.", url: m("a6ee400c-d1b9-4036-bb0c-0465bc23993b") },
            { app: "Preply", note: "Search above a “Popular” group, chosen values shown as chips under the bar.", url: m("a830f90b-5e12-4415-af31-1afb3cf9c338") },
            { app: "Hotjar", note: "Search over saved and recommended segments before anything else.", url: m("ca38e7f1-0157-4475-82f0-603103421c77") },
        ],
    },
    {
        id: "metric-picker",
        title: "Picking metrics and breakdowns",
        takeaway:
            "Metrics grouped by kind, with search; the chosen ones listed apart and in order; breakdowns as chips. A limit on how many metrics chart at once keeps the chart readable.",
        refs: [
            { app: "Reddit Ads", note: "Groups on the left, a checklist in the middle, the 9 selected listed and reorderable on the right; breakdown as chips.", url: m("27e1b0c8-2267-443b-9eac-1515dee05f1b") },
            { app: "Pinterest", note: "Edit metrics sheet: grouped checkboxes, up to five, each numbered in the order it appears.", url: m("1da5691c-51e8-41b8-8f8b-e97cfbcf32a4") },
            { app: "Shopify", note: "Metrics searched within a category, applied together.", url: m("1215369b-1fc6-48b8-ac28-ce5f48bae456") },
            { app: "Mixpanel", note: "Metrics, Filter and Breakdown stacked in one side panel beside the table.", url: m("8a37646e-121c-4446-a108-3706f9afc75a") },
            { app: "Zendesk", note: "Metrics and Attributes tabs; any attribute can be added as a row, a column or a filter.", url: m("91114259-2758-46c7-879a-4df78f0c5de1") },
        ],
    },
    {
        id: "field-drawer",
        title: "Every field in a grouped drawer",
        takeaway: "When fields run to dozens, a drawer with groups down the side and search across all of them is the common answer.",
        refs: [
            { app: "Frame.io", note: "Groups down the left, every field searchable in the middle, the chosen field's options on the right.", url: m("1a8bd942-0e91-4034-99f1-fb39235ba8ef") },
            { app: "Square", note: "A side sheet that filters by one category, with search and checkboxes, then Apply.", url: m("7d869088-c92f-4412-8088-6ecdb40d68fd") },
        ],
    },
    {
        id: "kpi-tabs",
        title: "Metric blocks that switch the chart",
        takeaway: "The headline numbers double as the chart's tabs. One or two at a time, each with its change from the previous period.",
        refs: [
            { app: "Pinterest", note: "Metric cards with a checkbox each: pick up to two to chart.", url: m("ce8ad3cf-159d-44bf-8b48-323a8fd178dc") },
            { app: "Squarespace", note: "A row of KPI tabs over the chart; the selected one is charted, the table follows.", url: m("ab088f05-b521-444b-9ee4-f173dc3b7579") },
            { app: "X", note: "A primary metric and an optional secondary metric over one chart.", url: m("3e77ebad-1450-458e-b0f9-9a2c7d54de37") },
            { app: "Customer.io", note: "The legend is the metric picker: tick a metric beside the chart to plot it.", url: m("9d6e8ea4-9fd9-40b2-a930-93d9f05beb78") },
        ],
    },
    {
        id: "compare",
        title: "Comparing with another period",
        takeaway: "Compare is one control beside the date, with plain options: previous period, same period last year, custom.",
        refs: [
            { app: "Square", note: "Compare to: none, previous period, same period last year, your usual, custom.", url: m("94e2d233-f9b7-431d-929b-a3c6de227514") },
            { app: "Klaviyo", note: "Time period and comparison period in one small panel.", url: m("817e4450-5215-4979-ac69-d8ba8ce88bcf") },
        ],
    },
    {
        id: "saved-views",
        title: "Saved views",
        takeaway: "Saved reports are easiest to reach as a short list or tabs at the top, grouped, with the default first.",
        refs: [
            { app: "Wix", note: "Recently viewed as chips, then saved reports grouped by area.", url: m("ad17d310-25cc-4cd8-9270-d8aadefbc966") },
            { app: "Steep", note: "All reports, My reports and Shared with me as tabs over one list.", url: m("27ba159c-9822-44c1-adc1-e42ebabf3ae2") },
            { app: "Fireflies", note: "Filters with Save view right in the panel.", url: m("6bb70926-9c42-40d1-857c-309bf9c33845") },
        ],
    },
    {
        id: "query-panel",
        title: "The query in a panel beside the report",
        takeaway:
            "The query lives in its own column on the right, in sections with a + each: metrics as lettered cards, filters as readable sentences, breakdowns as cards. The report gets the full width, the dates and comparison sit right over the chart, and the table under it pivots against the dates.",
        refs: [
            { app: "Mixpanel (flow)", note: "Comparing an insight with the previous period: Compare menu, a chip once set, faded lines for the previous period, the change in every cell.", url: "https://mobbin.com/flows/09f6e5da-eaa5-4633-9a33-231f800317f6" },
            { app: "Mixpanel", note: "Metrics A and B, a Country filter card and two breakdown cards on the right; chart over a nested table.", url: m("8a37646e-121c-4446-a108-3706f9afc75a") },
        ],
    },
    {
        id: "insight-beside",
        title: "The key insight next to the chart",
        takeaway:
            "From a study of 2,108 dashboards: the ones people remember do not only show what happened, they say what changed, right beside the chart, and they know what to leave out. Other ideas from it to keep in mind: a live view of activity, a heat map of busy hours, and a metric of your own that people come to quote.",
        refs: [{ app: "Mobbin · I studied 2,108 dashboards (video)", note: "Insights next to the chart, a prompt under it, or a full AI layer alongside; AI dashboards get about twice the saves.", url: "https://www.youtube.com/watch?v=kdRkuqu8apE" }],
    },
    {
        id: "assistant",
        title: "An AI layer beside the report",
        takeaway:
            "The useful ones suggest questions and set up the report the user then controls; the report stays the source of truth. The lightest version is one prompt under the chart; the fullest is a panel you can talk to beside the data.",
        refs: [
            { app: "Linktree", note: "Insights with an assistant docked on the right: suggested questions, an “ask” prompt under every card, answers that show their analysis steps.", url: m("922aee3e-fd5b-4556-99d6-4e3d1d906be0") },
            { app: "Linktree (flow)", note: "Chatting with the assistant: from the suggested questions to a summary and next steps.", url: "https://mobbin.com/flows/7da1f0d6-6070-4eba-9ab1-dfee042adf19" },
            { app: "Linktree (flow)", note: "Renaming a conversation from its title.", url: "https://mobbin.com/flows/fb1b66ac-09cb-49bc-b270-389341542294" },
            { app: "Pipedrive", note: "The question on the left, the generated report and its filters on the right, editable.", url: m("2f13cf32-e76e-4b5a-b52a-036dea6e3bb5") },
            { app: "Seline", note: "Suggested questions over the dashboard before anything is typed.", url: m("33f047c0-7e1c-4f29-a65b-a25189a5e5ff") },
        ],
    },
    {
        id: "pivot",
        title: "Breakdowns as nested rows",
        takeaway: "Two breakdowns read best as nested rows with the top values shown and the rest summed, rather than a wide flat table.",
        refs: [
            { app: "Mixpanel", note: "Metric, device type and cohort nested, each capped to its top 12.", url: m("8a37646e-121c-4446-a108-3706f9afc75a") },
            { app: "Steep", note: "Rows and columns chosen in a side panel; the table shades by value.", url: m("898c9a85-1f81-47c7-8dc0-cfd490b3b8e0") },
            { app: "Amplitude", note: "The breakdown table under the chart, starting from the top value.", url: m("3afcd733-04bd-4028-884b-922ffdbdea98") },
        ],
    },
];
