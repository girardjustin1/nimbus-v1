import type { ProtoScreen } from "../../../../../shared/prototype-frame";
import { NewQuery } from "./new-query";
import { SavedQueries } from "./saved-queries";

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
];
