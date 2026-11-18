import type { ProtoScreen } from "../../../../../shared/prototype-frame";
import { BuyerBreakdown } from "./buyer-breakdown";
import { NimbusLeaderboard, NimbusPerformance } from "./nimbus-benchmarks";

const BUYERS = "Reporting · Buyer breakdown";
const BENCHMARKS = "Reporting · Nimbus benchmarks";

/** Buyer breakdown and Nimbus benchmarks, in sidebar order: each main screen first, then its states. */
export const buyersScreens: ProtoScreen[] = [
    {
        id: "buyer-breakdown",
        area: BUYERS,
        title: "Buyer breakdown",
        description: "Demand partners for yesterday: summary tiles and a donut per metric.",
        render: () => <BuyerBreakdown />,
    },
    {
        id: "buyer-breakdown-table",
        area: BUYERS,
        title: "Buyer breakdown · Table",
        description: "The same figures as a sortable report, one row per demand partner.",
        render: () => <BuyerBreakdown view="table" />,
    },
    {
        id: "benchmarks",
        area: BENCHMARKS,
        title: "Nimbus Performance",
        description: "My eCPM, win rate and CTR beside the Nimbus Exchange's, last 7 days.",
        render: () => <NimbusPerformance />,
    },
    {
        id: "benchmarks-empty",
        area: BENCHMARKS,
        title: "Nimbus Performance · Empty",
        description: "No traffic of my own yet: the exchange's figures beside zeros.",
        render: () => <NimbusPerformance empty />,
    },
    {
        id: "benchmarks-leaderboard",
        area: BENCHMARKS,
        title: "Nimbus Leaderboard",
        description: "Top performers in the Nimbus Exchange: Share of Voice and eCPM.",
        render: () => <NimbusLeaderboard />,
    },
];
