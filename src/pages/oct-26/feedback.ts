/**
 * Oct 26 — the feedback batch behind Round 5, as data.
 *
 * One entry per change coming out of the 26 October review of Round 4. Quotes are
 * trimmed to the design point, and the reviewer is named by role, because this
 * Storybook publishes to a public URL.
 *
 * Applied means it was decided on the call and is in prototype v5. Kept means Product
 * asked for it to stay as it is for now. To confirm means it is built on a reading that
 * still needs an answer. Pending means it waits on something from outside the prototype.
 */

export type Status = "Applied" | "Kept" | "To confirm" | "Pending";

export interface FeedbackItem {
    slug: string;
    title: string;
    status: Status;
    /** From the 26 Oct call, trimmed to the design point. */
    quotes: string[];
    /** What we did, and why that reading of the quote. */
    decision: string[];
    /** Files in prototype v5 that changed. */
    touches: string[];
}

export const framing = {
    quote: "The functionality and information design and the flow and what you have included for all of DAS, I think, is great. I'm super happy with how it came out.",
    decision:
        "Setup and reporting are approved. What's left is visual: making DAS read as part of the Nimbus dashboard, and writing the rules down so the Performance Insights redesign can reuse them — “once they match, we're going to change the rule one time, and it's going to fix everything.”",
};

export const items: FeedbackItem[] = [
    {
        slug: "full-bleed",
        title: "Tables run full bleed",
        status: "Applied",
        quotes: ["See how, just little things, right? The tables are just full bleed on the page. And then in yours, they turn into this thing."],
        decision: [
            "Every table on a page drops its rounded card and runs edge to edge of the content area, like staging's Manage campaigns, View All Assets and Ad blocking. The first and last cells take the page padding back, so text lines up with the search bar above.",
            "Tables inside a form section (the selected apps, languages, keywords and creatives in setup) stay inside their section.",
        ],
        touches: ["prototypes/das/v5/screens/nimbus-ui.tsx", "prototypes/das/v5/screens/manage-campaigns.tsx", "prototypes/das/v5/screens/asset-library.tsx", "prototypes/das/v5/screens/keyword-library-v3.tsx", "prototypes/das/v5/screens/full-performance.tsx"],
    },
    {
        slug: "table-rule",
        title: "Charcoal headers for reports; lists stay light",
        status: "Applied",
        quotes: [
            "Reports have this charcoal table, and then the alternating tan … when it's data like this. And then when it's a list of stuff, I think I drop it.",
            "Nope, we don't have it as charcoal here. It's a list of things.",
        ],
        decision: [
            "Report → charcoal #101828 header, white labels, warm alternating rows: Full performance and its per-keyword view.",
            "List → light header with bold black labels: Manage campaigns (confirmed on the call), View All Assets, View All Keywords, the overview's creatives, selected items.",
            "Written down in Application UI › Table › List vs Report, with staging's known exceptions to settle in the Performance Insights redesign.",
        ],
        touches: ["src/components/application/chart-type-bar/chart-type-bar.tsx", "prototypes/das/v5/screens/nimbus-ui.tsx", "prototypes/das/v5/screens/full-performance.tsx"],
    },
    {
        slug: "list-headers",
        title: "Bold black headers and column rules",
        status: "Applied",
        quotes: ["See the bold, the black bold headers on this table — you don't have that, and you don't have the vertical line separating the columns."],
        decision: ["Every list table now has Manage campaigns' header: bold black labels and a vertical rule between every column. The asset and keyword libraries had a light-grey header with neither."],
        touches: ["prototypes/das/v5/screens/asset-library.tsx", "prototypes/das/v5/screens/keyword-library-v3.tsx"],
    },
    {
        slug: "search",
        title: "Search sits top left of every table",
        status: "Applied",
        quotes: [
            "Anytime I'm looking for something in the search bar, it's left aligned on the top of the table. That's just how we have it everywhere now.",
            "This Assets label, I think you can just kill it, left align the search bar, and then leave the actions to the right.",
        ],
        decision: ["View All Assets and View All Keywords lose their “Assets” / “Keywords” heading; search moves to the top left, Actions and the pink add button stay on the right. Manage campaigns already had it there."],
        touches: ["prototypes/das/v5/screens/asset-library.tsx", "prototypes/das/v5/screens/keyword-library-v3.tsx"],
    },
    {
        slug: "bands",
        title: "Full performance in Performance Insights' bands",
        status: "Applied",
        quotes: ["On our reporting — if you go to Performance Insights — you've got these, they just are these bands. Across."],
        decision: ["The builder is no longer a card: the date row, Metrics, Breakdown, Filters and Chart Type are full-span bands with a label column, divided by rules, the way Performance Insights lays them out. A Collapse control folds the bands away."],
        touches: ["prototypes/das/v5/screens/full-performance.tsx", "prototypes/das/v5/screens/nimbus-ui.tsx"],
    },
    {
        slug: "teal",
        title: "Checkboxes and radios match staging",
        status: "Applied",
        quotes: [
            "And then the checkboxes are green, not pink.",
            "The radio has the exact same stroke fill, and when it's selected it gets the green dot instead of the checkmark.",
        ],
        decision: ["Checkboxes and radios take staging's look, sampled from the call screenshots: a ticked checkbox is a pale teal box with a teal-grey border and a teal check; a selected radio is a thin teal ring, a white gap and a solid teal dot. Unticked controls are white with a light grey border. One typography for every checkbox and radio; pink buttons and toggles are untouched."],
        touches: ["prototypes/das/v5/screens/nimbus-ui.tsx", "src/components/base/checkbox/checkbox.tsx", "src/components/base/radio-buttons/radio-buttons.tsx"],
    },
    {
        slug: "filters",
        title: "Performance Insights' filter menu",
        status: "Applied",
        quotes: [
            "You're using a completely different filter UI here. Let's use this one, because we have it so many places in the UI.",
            "People are constantly comparing one platform to another … add both and then just quickly toggle one on and off.",
        ],
        decision: [
            "Round 4's DAS-only filter chips are gone. + ADD opens Performance Insights' two-pane menu — categories, then values with Clear Selections — and CANCEL / SAVE.",
            "Saved values sit in the Filters band as checkboxes, so you can toggle one off to compare; the ✕ at the far right clears every filter.",
        ],
        touches: ["src/components/application/chart-type-bar/chart-type-bar.tsx", "prototypes/das/v5/screens/nimbus-ui.tsx", "prototypes/das/v5/screens/full-performance.tsx"],
    },
    {
        slug: "chart-type",
        title: "Chart type buttons fill the band",
        status: "Applied",
        quotes: ["Chart type, good. You can tokenize these buttons though. See how they fill the bar. And these were in the original Sketch files I sent you — these graphics too."],
        decision: [
            "The chart type buttons fill the band's height, the chosen one teal on a teal tint.",
            "27 Oct: the Sketch chart icons are in, and the tabs match staging (bold uppercase pink, the chosen one teal on a full-height tint, no ring on click). One shared component across v4, v5 and the App Screens.",
        ],
        touches: ["src/components/application/chart-type-bar/chart-type-bar.tsx", "prototypes/das/v5/screens/nimbus-ui.tsx", "prototypes/das/v5/screens/full-performance.tsx"],
    },
    {
        slug: "dates",
        title: "Dates use Performance Insights' date token",
        status: "Applied",
        quotes: ["When you represent dates, even if they're not selectable, they should share the layout of this. It's close in yours — just a little bit bigger."],
        decision: ["START DATE / END DATE on Full performance use Performance Insights' cell: small uppercase label over the value, divided by a rule, at its width. The value drops a size to match; the label stays at the 15px type floor."],
        touches: ["src/components/application/chart-type-bar/chart-type-bar.tsx", "prototypes/das/v5/screens/nimbus-ui.tsx", "prototypes/das/v5/screens/full-performance.tsx"],
    },
    {
        slug: "pi-link",
        title: "“Detailed reporting” becomes “Performance Insights”",
        status: "Applied",
        quotes: ["Change Detailed reporting to just have it say Performance Insights. This is going to be something that links to Performance Insights later — for now let's be really obvious about what we're doing there."],
        decision: ["The Total spend chip's link reads Performance Insights and opens Performance Insights (the Full performance screen, linked 27 Oct). The wording may change when the redesign defines where it lands."],
        touches: ["prototypes/das/v5/screens/manage-campaigns.tsx"],
    },
    {
        slug: "tabs",
        title: "Tabs are bold, with the active rule",
        status: "To confirm",
        quotes: ["There's slight difference between these and the ones you have … this one doesn't have the little rules, or does it? And yours isn't as bold."],
        decision: [
            "Asset and keyword tabs are now bold, with thin rules between tabs and the active tab filled teal with a teal rule under it — staging's look.",
            "To confirm: our reading of “the little rules” covers both the dividers between tabs and the active underline.",
        ],
        touches: ["prototypes/das/v5/screens/nimbus-ui.tsx", "prototypes/das/v5/screens/asset-library.tsx", "prototypes/das/v5/screens/keyword-common.tsx"],
    },
    {
        slug: "stat-type",
        title: "Summary cards take the realtime dashboard's type",
        status: "To confirm",
        quotes: ["I think you can probably reuse some of the text styling from this little blocky block for these guys."],
        decision: [
            "The summary cards on Manage campaigns and the campaign overview use the realtime dashboard's stat styling: small uppercase label, large teal value, small supporting lines.",
            "To confirm: “these guys” read as the summary cards, from what was on screen at the time.",
            "27 Oct review: superseded — see “Summary cards: the key metrics card, scaled down”.",
        ],
        touches: ["prototypes/das/v5/screens/campaign-ui.tsx"],
    },
    {
        slug: "kept",
        title: "Kept as they are, for now",
        status: "Kept",
        quotes: [
            "Let's leave it as total spend now, because I think that's a good representation of a number.",
            "Keep them for now. I'm going to show it with them and just see what people think.",
        ],
        decision: [
            "Total spend stays, flagged as ambiguous (lifetime, or active flights?). Product is deciding whether to keep, replace or reframe it.",
            "The progress bars and the paused warning banner stay in the prototype until user feedback.",
        ],
        touches: [],
    },
    {
        slug: "tokens",
        title: "The pieces, tokenized for the Performance Insights redesign",
        status: "Applied",
        quotes: ["Once we have those and once they match, if they're consistent with Performance Insights, then we're going to change the rule one time, and it's going to fix everything."],
        decision: [
            "Tabs, bands, the date cell, quick picker and group-by, UI controller and state action buttons, teal checkboxes and radios, the chart type bar, the filter menu and the two table kinds live once, in nimbus-ui.tsx, and each has a story under Application UI › Nimbus Tokens.",
            "“UI controller” and “state action” are working names — to confirm with engineering.",
        ],
        touches: ["prototypes/das/v5/screens/nimbus-ui.tsx"],
    },
];

/**
 * 27 Oct — a second, shorter review of v5 with Product, folded into this round rather
 * than cut as a new one. Same shape as `items`.
 */
export const review27Framing = {
    quote: "Let's do these little changes … and then I'll get a review time set up for engineering to look through this.",
    decision:
        "Cuts on the keyword pages, the forms matched to staging, and one summary-card style. Next: engineering reviews DAS before work moves to Performance Insights.",
};

export const review27: FeedbackItem[] = [
    {
        slug: "kill-health",
        title: "Keyword Health is gone",
        status: "Applied",
        quotes: ["Let's just kill this keyword health page. Because I don't even know what that would be. And a lot of that's probably on the pub side.", "The pink button that says check traffic … just kill that."],
        decision: [
            "The Keyword Health page and its tab are removed; Manage keywords has two tabs, like Manage assets.",
            "Check Traffic is gone from every row of View All Keywords, and the empty state no longer points to Keyword Health.",
        ],
        touches: ["prototypes/das/v5/screens/keyword-common.tsx", "prototypes/das/v5/screens/keyword-library-v3.tsx", "prototypes/das/v5/screens.tsx"],
    },
    {
        slug: "no-traffic",
        title: "No real-time traffic readouts",
        status: "To confirm",
        quotes: ["This is probably unrealistic. It's in traffic thing. It's gonna require pinging the system probably too much, because it's sort of a real-time thing."],
        decision: [
            "Everything that said whether a keyword is arriving is removed: the In Traffic column on View All Keywords and in its CSV, the In traffic badge in setup's Keywords table, and the “not in traffic” check when adding keywords.",
            "To confirm: the call named the In traffic card on keyword detail; we removed the same readout everywhere it appeared, since it all needs the same real-time check.",
        ],
        touches: ["prototypes/das/v5/screens/keyword-library-v3.tsx", "prototypes/das/v5/screens/keyword-target.tsx", "prototypes/das/v5/screens/keyword-data.ts"],
    },
    {
        slug: "keyword-detail",
        title: "Keyword detail: campaigns, history, Delete",
        status: "Applied",
        quotes: ["All right, so kill the sidebar, kill the keyword little boxy thing, and kill the export button. Everything else is fine."],
        decision: [
            "The sidebar (In traffic, Deleting this keyword), the Keyword card and Export keyword CSV are removed. Delete Keyword stays top right; Campaigns using this keyword and History stay.",
            "The delete rules still apply: a keyword in a live campaign can't be deleted, and the dialog says which campaigns to take it off first.",
        ],
        touches: ["prototypes/das/v5/screens/keyword-detail.tsx"],
    },
    {
        slug: "asset-bar",
        title: "No “Serving now” bar on an asset",
        status: "Applied",
        quotes: ["I think you can kill that because it's possible that they can be in multiple campaigns … it says what campaigns it's in in this column."],
        decision: ["The orange warning bar on asset detail is removed. Associated Campaigns already lists where an asset runs; delete is still blocked while a campaign uses it."],
        touches: ["prototypes/das/v5/screens/asset-detail.tsx"],
    },
    {
        slug: "breadcrumbs",
        title: "Detail pages share the breadcrumb strip",
        status: "Applied",
        quotes: [],
        decision: [
            "Keyword detail and asset detail go back the way the campaign overview does: the breadcrumb strip under the header — “← Keywords : sports”, “← Assets : SampleApp_MREC_Garden” — in place of a small back link. One component, BreadcrumbStrip, on all three.",
        ],
        touches: ["prototypes/das/v5/screens/campaign-ui.tsx", "prototypes/das/v5/screens/keyword-detail.tsx", "prototypes/das/v5/screens/asset-detail.tsx"],
    },
    {
        slug: "fields",
        title: "Fields and dropdowns match staging",
        status: "Applied",
        quotes: ["Can you style the forms this way? The way we have them. See how they're not white?", "And dropdown also.", "Do you want to do teal as a universal? — Yeah, might as well."],
        decision: [
            "Every text field, dropdown, text area, date field and picker takes staging's look, sampled from the call screenshots: a #F8F8F8 fill, a faint warm rule, square-ish corners, 46px tall like staging's; disabled fields fill solid #D8D8D8.",
            "Dropdown lists match staging's: white, options edge to edge, the highlighted one in warm #FCFAF9. The Actions and ⋯ menus and the setup pickers use the same list.",
            "Focus is teal everywhere — fields, buttons, checkboxes — in place of the pink and the browser's blue.",
            "These live in the base components and theme tokens, so every story and every round shows them. Whether staging's field size is right is a global change for engineering.",
        ],
        touches: ["src/styles/theme.css", "src/components/base/input/input.tsx", "src/components/base/select/select.tsx", "src/components/base/select/select-item.tsx", "src/components/base/textarea/textarea.tsx", "src/components/base/dropdown/dropdown.tsx", "prototypes/das/v5/screens/arrow-keys.ts"],
    },
    {
        slug: "search-full",
        title: "Search runs full width",
        status: "Applied",
        quotes: ["You might as well make it across all the way. And then accommodate — if it has any buttons to the right of it, those can be inline and it can be shorter."],
        decision: ["Manage campaigns' search runs the full width of the page. On View All Assets and View All Keywords, Actions and Add stay inline on the right and search takes the rest of the row."],
        touches: ["prototypes/das/v5/screens/manage-campaigns.tsx", "prototypes/das/v5/screens/asset-library.tsx", "prototypes/das/v5/screens/keyword-library-v3.tsx"],
    },
    {
        slug: "stat-cards",
        title: "Summary cards: the key metrics card, scaled down",
        status: "Applied",
        quotes: ["If they are contained, let's do them closer to this. If they are not, then let's do them like this. You can decide what you think looks better."],
        decision: [
            "No third style. The cards on Manage campaigns and the campaign overview take the key metrics card, scaled down: square corners, a light rule and soft shadow, a bold black title and a black value.",
            "Contained, because the Campaigns cards are filters you click — a card reads as something to press. The flat option, the realtime dashboard's blocks, is in Oct 26 › Applied Changes to compare.",
        ],
        touches: ["prototypes/das/v5/screens/campaign-ui.tsx", "prototypes/das/v5/screens/stat-look.ts"],
    },
];

export const bySlug = (slug: string) => [...items, ...review27].find((i) => i.slug === slug)!;

/** Where to see each change: prototype v5 routes, and Storybook story ids. */
export const links: Record<string, { prototype: [string, string][]; stories: [string, string][] }> = {
    "full-bleed": {
        prototype: [["Manage campaigns", "campaigns"], ["View All Assets", "asset-view"], ["Full performance", "view-d"]],
        stories: [["Round 4 → 5 · Campaigns", "oct-26-applied-changes--campaigns-after"], ["Tables token", "application-ui-nimbus-tokens-tables--list"]],
    },
    "table-rule": {
        prototype: [["Full performance", "view-d"], ["By keyword", "view-d-keywords"]],
        stories: [["List vs Report", "application-ui-table-list-vs-report--docs"], ["Report token", "application-ui-nimbus-tokens-tables--report"]],
    },
    "list-headers": {
        prototype: [["View All Assets", "asset-view"], ["View All Keywords", "keyword-view"]],
        stories: [["Round 4 → 5 · Assets", "oct-26-applied-changes--assets-after"]],
    },
    search: {
        prototype: [["View All Assets", "asset-view"], ["View All Keywords", "keyword-view"]],
        stories: [["Round 4 → 5 · Assets", "oct-26-applied-changes--assets-after"]],
    },
    bands: {
        prototype: [["Full performance", "view-d"]],
        stories: [["Round 4 → 5 · Full performance", "oct-26-applied-changes--performance-after"], ["Bands token", "application-ui-nimbus-tokens-bands--builder"]],
    },
    teal: {
        prototype: [["Full performance", "view-d"]],
        stories: [["Teal Controls token", "application-ui-nimbus-tokens-teal-controls--teal"]],
    },
    filters: {
        prototype: [["Full performance", "view-d"]],
        stories: [["Filter Control token", "application-ui-nimbus-tokens-filter-control--comparing-platforms"]],
    },
    "chart-type": {
        prototype: [["Full performance", "view-d"]],
        stories: [["Chart Type Bar token", "application-ui-nimbus-tokens-chart-type-bar--in-a-band"]],
    },
    dates: {
        prototype: [["Full performance", "view-d"]],
        stories: [["Dates token", "application-ui-nimbus-tokens-dates-and-dropdowns--date-row-complete"]],
    },
    "pi-link": {
        prototype: [["Manage campaigns", "campaigns"]],
        stories: [["Round 4 → 5 · Campaigns", "oct-26-applied-changes--campaigns-after"]],
    },
    tabs: {
        prototype: [["Manage assets", "asset-view"], ["Manage keywords", "keyword-view"]],
        stories: [["Page Tabs token", "application-ui-nimbus-tokens-page-tabs--assets"]],
    },
    "stat-type": {
        prototype: [["Campaign overview", "view-a"], ["Manage campaigns", "campaigns"]],
        stories: [["Round 4 → 5 · Overview", "oct-26-applied-changes--overview-after"]],
    },
    kept: {
        prototype: [["Manage campaigns", "campaigns"], ["Paused campaign", "view-a?c=c4"]],
        stories: [],
    },
    tokens: {
        prototype: [],
        stories: [["Nimbus Tokens", "application-ui-nimbus-tokens-00-overview--docs"]],
    },
    "kill-health": {
        prototype: [["View All Keywords", "keyword-view"], ["Keyword Setup", "keyword-setup"]],
        stories: [],
    },
    "no-traffic": {
        prototype: [["View All Keywords", "keyword-view"], ["Setup · Targeting", "step-targeting"]],
        stories: [],
    },
    "keyword-detail": {
        prototype: [["Keyword detail", "keyword-detail"], ["Delete blocked", "keyword-delete-guard"]],
        stories: [["Round 4 → 5 · Keyword detail", "oct-26-applied-changes--keyword-detail-after"]],
    },
    "asset-bar": {
        prototype: [["Asset detail", "asset-detail?a=a1"]],
        stories: [["Round 4 → 5 · Asset detail", "oct-26-applied-changes--asset-detail-after"]],
    },
    breadcrumbs: {
        prototype: [["Keyword detail", "keyword-detail?k=k1"], ["Asset detail", "asset-detail?a=a1"], ["Campaign overview", "view-a?c=c1"]],
        stories: [["Round 4 → 5 · Keyword detail", "oct-26-applied-changes--keyword-detail-after"]],
    },
    fields: {
        prototype: [["Asset Setup", "asset-setup"], ["Setup · General", "step-general"]],
        stories: [["Fields", "oct-26-applied-changes--fields"], ["Input", "base-components-input--docs"]],
    },
    "search-full": {
        prototype: [["Manage campaigns", "campaigns"], ["View All Assets", "asset-view"]],
        stories: [],
    },
    "stat-cards": {
        prototype: [["Manage campaigns", "campaigns"], ["Campaign overview", "view-a"]],
        stories: [["Contained vs flat", "oct-26-applied-changes--summary-cards"]],
    },
};
