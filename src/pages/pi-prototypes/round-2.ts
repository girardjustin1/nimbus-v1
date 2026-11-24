/**
 * Performance Insights · Round 2: the concepts planned from the 24 Nov 2026 PI sync.
 *
 * One list, read by Storybook › Prototypes › Performance Insights (Rounds and Research).
 * A concept gets a `screen` (its route in prototypes/performance-insights/v2) when it is
 * built; until then it is "Proposed". This site is public: roles, never people's names,
 * and no publisher names or real figures.
 */

/** How far a concept reaches, read against engineering's constraints. */
export type Reach =
    /** Styling only, inside today's filter band and panel. */
    | "Restyle"
    /** Today's structure, with new states or rules that need some engineering. */
    | "Rework"
    /** A different model: needs engineering to agree before it is built. */
    | "Rethink";

export type ConceptStatus = "Proposed" | "Building" | "Ready for review" | "Approved" | "Set aside";

export interface Concept {
    id: string;
    title: string;
    /** What it answers from the sync, in one line. */
    problem: string;
    /** What the concept does. */
    idea: string;
    reach: Reach;
    status: ConceptStatus;
    /** Research patterns it draws on (ids in ./research.ts). */
    patterns: string[];
    /** Route in prototypes/performance-insights/v2 once built. */
    screen?: string;
}

export const REACH_NOTE: Record<Reach, string> = {
    Restyle: "Colour, type, spacing, wrap and panel chrome on today's filter band. Engineering can take it as CSS.",
    Rework: "Keeps today's band and two-pane panel, adds states or rules. Needs engineering, within the current structure.",
    Rethink: "Changes the model: a drawer, a different first view, a new chip model. Engineering weighs in before it is built.",
};

export const CONCEPTS: Concept[] = [
    {
        id: "C0",
        title: "Control: today's Performance Insights",
        problem: "Every concept is judged against what is there now.",
        idea: "The full application's Performance Insights with the Round 1 styles, unchanged. Filters: + Add opens the inline panel, chips follow it on the row.",
        reach: "Restyle",
        status: "Ready for review",
        patterns: [],
        screen: "pi-query",
    },
    {
        id: "C1",
        title: "A tight filter band",
        problem: "The filter layout is not tight enough and the + Add button ends up looking broken at the end of the row.",
        idea: "Same band, same DOM. + Filter is always the first item on the row, chips follow in a fixed grid, Clear all sits at the end. One chip height, one gap, values truncated with a count (“Country: US, CA +3”).",
        reach: "Restyle",
        status: "Proposed",
        patterns: ["chip-row"],
    },
    {
        id: "C2",
        title: "One rule for a chip: check to apply, × to remove",
        problem: "A checkbox toggles a metric on and off, but unchecking a filter chip deletes it. Same element, two behaviours.",
        idea: "Every chip keeps its checkbox. Unchecked, it stays on the row, greyed, and leaves the query; × removes it. Clear all removes every chip. This is the chip and query split engineering described, made visible.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["chip-row", "value-panel"],
    },
    {
        id: "C3",
        title: "The full filter flow, end to end",
        problem: "The prototype shows a filter being added, not edited, paused or removed.",
        idea: "Every state in one clickable flow: add, pick values, Save, edit a chip's values, uncheck it, remove it, Clear all, Cancel a draft. The control and C1–C2 both get it.",
        reach: "Restyle",
        status: "Proposed",
        patterns: ["value-panel"],
    },
    {
        id: "C4",
        title: "Opens on realtime's view",
        problem: "Performance Insights replaces the realtime dashboard, and today it opens on “select at least one metric”.",
        idea: "The page loads the Default tier: Revenue, Requests, Impressions and eCPM by day and platform, scoped to one app, with realtime's metric blocks over the chart. Nobody starts from a blank query.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["kpi-tabs"],
    },
    {
        id: "C5",
        title: "Quick add on the surface",
        problem: "Today every metric and breakdown is an always-on checkbox grid.",
        idea: "The Default fields show as filled chips; the 18 Quick add fields sit beside them as dashed chips, one click to add or remove. Everything else is one link away (C6).",
        reach: "Rework",
        status: "Proposed",
        patterns: ["metric-picker"],
    },
    {
        id: "C6",
        title: "Explore: every field in one grouped drawer",
        problem: "47 more fields are coming, in eight groups, and they will not fit on the page.",
        idea: "A searchable drawer grouped as in the data inventory (Inventory, Geo & network, Device, Audience & session, Request format, Creative & advertiser, Demand & deals, Video & delivery). Any field can be a breakdown or a filter; high-cardinality ones are marked filter-only.",
        reach: "Rethink",
        status: "Proposed",
        patterns: ["field-drawer", "metric-picker"],
    },
    {
        id: "C7",
        title: "The two-pane panel, polished",
        problem: "The inline panel works, but the rail and the list read loosely.",
        idea: "Category rail with a count of picked values per category, the value list with search on top, Select all visible, and a footer that says how many are picked. Today's Cancel and Save stay.",
        reach: "Restyle",
        status: "Proposed",
        patterns: ["value-panel"],
    },
    {
        id: "C8",
        title: "Search first for long lists",
        problem: "Advertiser has too many values to list; the panel loads a few hundred and stops partway through the alphabet.",
        idea: "Fields like Advertiser, City and Device model open on a search box and the top values, with “Other” and a note that search reaches the rest. No endless scroll.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["search-first"],
    },
    {
        id: "C9",
        title: "Region groups for Country",
        problem: "Product asked whether a new filter component could serve both Performance Insights and DAS Geos.",
        idea: "Country picks by region, as in DAS Geos: a whole region in one click, a count per region, search across all. Built inside the two-pane panel so it can carry back to DAS.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["value-panel", "search-first"],
    },
    {
        id: "C10",
        title: "Metric blocks that drive the chart",
        problem: "Realtime's metric blocks are the part publishers know best.",
        idea: "Each metric block is a tab: click one to chart it, a second to compare two. Each block shows its change from the previous period.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["kpi-tabs", "compare"],
    },
    {
        id: "C11",
        title: "Staff-only fields you can spot",
        problem: "Nimbus staff see fields publishers never do, and a screenshot should show it.",
        idea: "Staff-only fields sit in their own tab and carry one amber tint on every chip and column header they add. Publishers never see the tab.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["field-drawer"],
    },
    {
        id: "C12",
        title: "Saved views along the top",
        problem: "Saved queries live behind a menu.",
        idea: "A row of saved views above the band, as tabs: the default view first, then the user's own. Saving a view keeps its metrics, breakdown and filters.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["saved-views"],
    },
    {
        id: "C13",
        title: "Phone: Display options",
        problem: "Under 737px the page is a different flow, not a narrow band.",
        idea: "The phone's one Display options sheet, with metrics, breakdown and filters as an accordion, using the same chip rules as C2.",
        reach: "Rework",
        status: "Proposed",
        patterns: ["chip-row"],
    },
    {
        id: "C14",
        title: "Future: an assistant that suggests what to toggle",
        problem: "Product loves a generative version, but it is not in scope for this project.",
        idea: "Shown as the future only: a question box that proposes the metrics, breakdown and filters to switch on, and the user applies them. Nothing generates a chart on its own.",
        reach: "Rethink",
        status: "Proposed",
        patterns: ["assistant"],
    },
];
