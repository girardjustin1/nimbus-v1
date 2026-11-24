import type { ProtoScreen } from "../../../../../shared/prototype-frame";
import type { FilterState } from "../../nimbus-ui";
import { NewQuery } from "./new-query";
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
    const c = (id: string, title: string, description: string, render: ProtoScreen["render"]): ProtoScreen => ({ id, area: CONCEPTS, title, description, render });
    return [
        c("c0-control", "C0 · Control, with filters", "Today's band with the same filters every concept starts from.", () => <NewQuery filters={SOME} />),
        c(
            "c1-tight-band",
            "C1 · A tight filter band",
            "+ Filter first, one bordered group per category, three values then +N, Clear all at the end.",
            () => <NewQuery band="tight" filters={SOME} />,
        ),
        c("c1-tight-band-more", "C1 · +N opens the panel", "Country's +2 opens the panel on Country.", () => <NewQuery band="tight" filters={SOME} openFilterOn="Country" />),
        c(
            "c2-chips",
            "C2 · One rule for a chip",
            "Every value is a chip: its checkbox applies it, × removes it. The category name edits it.",
            () => <NewQuery band="chips" filters={SOME} />,
        ),
        c(
            "c2-chips-paused",
            "C2 · Paused chips",
            "Two countries unchecked and Ad Type paused: they stay on the row and leave the report.",
            () => <NewQuery band="chips" filters={PAUSED} />,
        ),
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
        c("c4-default-view-chips", "C4 · With C2's chips", "Realtime's view with the C2 band and a filter set.", () => <NewQuery defaultView band="chips" filters={SOME} />),
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
