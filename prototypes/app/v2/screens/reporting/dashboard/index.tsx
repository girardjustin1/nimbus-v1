import type { ProtoScreen } from "../../../../../shared/prototype-frame";
import { KeyMetrics } from "./key-metrics";
import { RealtimeDashboard } from "./realtime";

const keyMetrics = "Reporting · Key metrics";
const realtime = "Reporting · Realtime dashboard";

/** Key metrics (all publishers), then the realtime dashboard and its states. */
export const dashboardScreens: ProtoScreen[] = [
    {
        id: "key-metrics",
        area: keyMetrics,
        title: "Key metrics",
        description: "Nimbus Exchange: nine cards; each card's tabs switch the period or segment.",
        render: () => <KeyMetrics />,
    },
    {
        id: "realtime",
        area: realtime,
        title: "Realtime dashboard",
        description: "Last 7 days by day: summary tiles, revenue by platform with metric lines, and the report.",
        render: () => <RealtimeDashboard />,
    },
    {
        id: "realtime-table",
        area: realtime,
        title: "Table view",
        description: "The table switch on: the chart is hidden.",
        render: () => <RealtimeDashboard view="table" />,
    },
    {
        id: "realtime-totals",
        area: realtime,
        title: "Totals only",
        description: "Platforms combined: one bar, one line per metric, one row per day.",
        render: () => <RealtimeDashboard totalsOnly />,
    },
];
