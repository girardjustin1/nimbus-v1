import type { ProtoScreen } from "../../../../../shared/prototype-frame";
import type { FilterState } from "../../nimbus-ui";
import { NewQuery } from "./new-query";
import { QueryWorkspace } from "./query-workspace";
import { SavedQueries } from "./saved-queries";

/* -------------------------------------------------- Round 2 · concepts --- */

const CONCEPTS = "Round 2 · Concepts (24 Nov)";

/** A filter set like the ones in the PI sync: a long Country list, two ad types, one platform. */
const SOME: FilterState = {
    Country: { values: ["United States", "Canada", "United Kingdom", "Germany", "Mexico"], off: [] },
    "Ad Type": { values: ["Static", "Video"], off: [] },
    Platform: { values: ["iOS"], off: [] },
};

/** The same set with two countries unchecked and Ad Type paused altogether. */
const PAUSED: FilterState = {
    Country: { values: ["United States", "Canada", "United Kingdom", "Germany", "Mexico"], off: ["Germany", "Mexico"] },
    "Ad Type": { values: ["Static", "Video"], off: ["Static", "Video"] },
    Platform: { values: ["iOS"], off: [] },
};

function round2Screens(): ProtoScreen[] {
    const c = (id: string, title: string, description: string, render: ProtoScreen["render"]): ProtoScreen => ({
        id,
        area: CONCEPTS,
        title,
        description,
        render,
    });
    return [
        c("c0-control", "C0 · Control, with filters", "Today's band with the same filters every concept starts from.", () => <NewQuery filters={SOME} />),
        c("c1-tight-band", "C1 · A tight filter band", "+ Filter first, one bordered group per category, three values then +N, Clear all at the end.", () => (
            <NewQuery band="tight" filters={SOME} />
        )),
        c("c1-tight-band-more", "C1 · +N opens the panel", "Country's +2 opens the panel on Country.", () => (
            <NewQuery band="tight" filters={SOME} openFilterOn="Country" />
        )),
        c("c2-chips", "C2 · One rule for a chip", "Every value is a chip: its checkbox applies it, × removes it. The category name edits it.", () => (
            <NewQuery band="chips" filters={SOME} />
        )),
        c("c2-chips-paused", "C2 · Paused chips", "Two countries unchecked and Ad Type paused: they stay on the row and leave the report.", () => (
            <NewQuery band="chips" filters={PAUSED} />
        )),
        c("c3-add", "C3 · Add a filter", "+ Filter opens the panel; picks stay a draft until Save.", () => <NewQuery band="chips" openFilterOn="Country" />),
        c("c3-edit", "C3 · Edit a category", "Country's name on the row opens the panel on Country, with its values picked.", () => (
            <NewQuery band="chips" filters={SOME} openFilterOn="Country" />
        )),
        c("c3-tight-edit", "C3 · Edit, tight band", "The same flow on C1's band.", () => <NewQuery band="tight" filters={PAUSED} openFilterOn="Ad Type" />),
        c(
            "c4-default-view",
            "C4 · Opens on realtime's view",
            "Revenue, Requests, Impressions and eCPM by platform for one app, realtime's metric blocks over the chart.",
            () => <NewQuery defaultView />,
        ),
        c("c4-default-view-chips", "C4 · With C2's chips", "Realtime's view with the C2 band and a filter set.", () => (
            <NewQuery defaultView band="chips" filters={SOME} />
        )),
        c(
            "c7-panel",
            "C7 · The panel, polished",
            "Counts per category in the rail, search, Select all, checkboxes, and a footer that says what is picked.",
            () => <NewQuery band="chips" panel="polished" filters={SOME} openFilterOn="Country" />,
        ),
        c("c7-panel-empty", "C7 · Adding the first filter", "The polished panel with nothing picked yet, on Ad Size.", () => (
            <NewQuery band="chips" panel="polished" openFilterOn="Ad Size" />
        )),
        c(
            "c8-search-first",
            "C8 · Search first for Advertiser",
            "2,406 advertisers: the panel opens on search and the top six, and says search reaches the rest.",
            () => <NewQuery band="chips" panel="polished" longLists openFilterOn="Advertiser" />,
        ),
        c("c8-search-typed", "C8 · Typing narrows it", "“sport” matches 120; the first 50 show, with a count of the rest.", () => (
            <NewQuery band="chips" panel="polished" longLists openFilterOn="Advertiser" panelQuery="sport" />
        )),
        c(
            "c8-picked",
            "C8 · Picks stay in view",
            "Two advertisers picked: they stay listed above the search, so they can be unpicked without searching again.",
            () => (
                <NewQuery
                    band="chips"
                    panel="polished"
                    longLists
                    openFilterOn="Advertiser"
                    filters={{ Advertiser: { values: ["shoes.example.com", "(Not sent)"], off: [] } }}
                />
            ),
        ),
        c(
            "c10-blocks",
            "C10 · Metric blocks drive the chart",
            "Each block is a tab: Revenue is charted by platform; every block shows its change from the previous 7 days.",
            () => <NewQuery defaultView blocksDriveChart />,
        ),
        c("c10-compare", "C10 · Two metrics compared", "Revenue and eCPM picked: the chart compares them on two axes.", () => (
            <NewQuery defaultView blocksDriveChart charted={["Revenue", "ECPM"]} />
        )),
        c(
            "c14-ask",
            "C14 · Ask about this report",
            "The AI layer: Ask in the tabs, three questions under the chart, and the panel docked beside the report.",
            () => <NewQuery defaultView blocksDriveChart assistant="open" />,
        ),
        c(
            "c14-answer",
            "C14 · An answer, and Show this in the report",
            "“Why did revenue change?” answered from the report's own figures, ending with a button that sets the chart.",
            () => <NewQuery defaultView blocksDriveChart assistant assistantAsk="revenue" />,
        ),
        c("c14-closed", "C14 · Just the prompts", "The panel closed: only the questions under the chart, the lightest version of the layer.", () => (
            <NewQuery defaultView blocksDriveChart assistant />
        )),
        c(
            "c16-workspace",
            "C16 · The query beside the report",
            "After Mixpanel's Insights: Metrics, Filter and Breakdown as cards in a panel on the right; dates, quick ranges and Compare over the chart; chart, both or table; a pivoted table.",
            () => <QueryWorkspace />,
        ),
        c(
            "c16-compare",
            "C16 · Compared with the previous period",
            "Compare on: a chip says what with, the chart draws the previous period faded, every cell shows its change.",
            () => <QueryWorkspace compare />,
        ),
        c("c16-filter", "C16 · Editing a filter", "Country's card opens its values in the panel: search, checkboxes, Apply.", () => (
            <QueryWorkspace open={{ kind: "filter-values", dim: "Country", draft: ["United States", "Canada"] }} />
        )),
        c("c16-add-metric", "C16 · Adding a metric", "“Add metric” opens a searchable list of the metrics not in the query yet.", () => (
            <QueryWorkspace open={{ kind: "metric" }} />
        )),
        c("c16-table", "C16 · Table only, compared", "Revenue and eCPM by platform against each day, each cell with its change.", () => (
            <QueryWorkspace compare view="table" metrics={["Revenue", "Impressions", "ECPM"]} />
        )),
        c(
            "c15-notes",
            "C15 · What changed, beside the chart",
            "Three or four facts worked out from the report, next to the chart: revenue against the previous span, the biggest mover, lowest fill, best day.",
            () => <NewQuery defaultView blocksDriveChart insightNotes />,
        ),
    ];
}

const AREA = "Reporting · Performance Insights";

/** Performance Insights: Saved Queries (main) and its empty state, then New Query as a table and charted. */
export const insightsScreens: ProtoScreen[] = [
    {
        id: "pi-saved",
        area: AREA,
        title: "Saved Queries",
        description: "Saved and recommended queries; a row opens it in New Query.",
        render: () => <SavedQueries />,
    },
    {
        id: "pi-saved-empty",
        area: AREA,
        title: "Saved Queries · empty",
        description: "No saved or recommended queries yet.",
        render: () => <SavedQueries empty />,
    },
    {
        id: "pi-query",
        area: AREA,
        title: "New Query",
        description: "Requests and CTR for the last 7 days, by day, as a table. Metrics and breakdowns add columns.",
        render: () => <NewQuery />,
    },
    {
        id: "pi-query-line",
        area: AREA,
        title: "New Query · line chart",
        description: "The same query as a line chart, two axes.",
        render: () => <NewQuery chart="line" />,
    },
    { id: "pi-query-area", area: AREA, title: "New Query · area chart", render: () => <NewQuery chart="area" /> },
    { id: "pi-query-bar", area: AREA, title: "New Query · bar chart", render: () => <NewQuery chart="bar" /> },
    ...round2Screens(),
];
