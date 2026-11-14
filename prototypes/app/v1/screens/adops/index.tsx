import type { ProtoScreen } from "../../../../shared/prototype-frame";
import { Activity } from "./activity";
import { AdBlocking } from "./ad-blocking";
import { DiscrepancyReports } from "./discrepancy-reports";
import { ActiveFloors, ConfigureFloors } from "./floors";
import { TestMode } from "./test-mode";

/** AdOps, in sidebar order: ad blocking, floors, manage test mode, discrepancy reports, activity. */
export const adopsScreens: ProtoScreen[] = [
    {
        id: "ad-blocking",
        area: "AdOps · Ad blocking",
        title: "Ad blocking",
        description: "Block Bad Ads, then crid, bcat, badv and bapp block lists with a few entries. Blocking adds a row; UNBLOCK removes it.",
        render: () => <AdBlocking />,
    },
    {
        id: "ad-blocking-empty",
        area: "AdOps · Ad blocking",
        title: "Ad blocking · empty",
        description: "Nothing blocked yet: every list at zero.",
        render: () => <AdBlocking empty />,
    },
    {
        id: "floors",
        area: "AdOps · Floors",
        title: "Active Floors",
        description: "Default floors per platform and ad type, and the custom floors list.",
        render: () => <ActiveFloors />,
    },
    {
        id: "floors-empty",
        area: "AdOps · Floors",
        title: "Active Floors · empty",
        description: "No floors set: NOT SET tiles and no custom floors.",
        render: () => <ActiveFloors empty />,
    },
    {
        id: "floors-configure",
        area: "AdOps · Floors",
        title: "Configure Floors",
        description: "Default Floors with CHANGE / REMOVE, and the New Custom Floor form.",
        render: () => <ConfigureFloors />,
    },
    {
        id: "test-mode",
        area: "AdOps · Manage test mode",
        title: "Manage test mode",
        description: "Active Overrides and Add Test Mode Override.",
        render: () => <TestMode />,
    },
    {
        id: "test-mode-empty",
        area: "AdOps · Manage test mode",
        title: "Manage test mode · empty",
        description: "No active overrides.",
        render: () => <TestMode empty />,
    },
    {
        id: "discrepancy-reports",
        area: "AdOps · Discrepancy reports",
        title: "Discrepancy reports",
        description: "Date row and Demand Sources, the Build a Nimbus Discrepancy Report hero and Using Our Template.",
        render: () => <DiscrepancyReports />,
    },
    {
        id: "discrepancy-reports-report",
        area: "AdOps · Discrepancy reports",
        title: "Discrepancy reports · report",
        description: "After SEE REPORT: demand vs Nimbus revenue per demand partner.",
        render: () => <DiscrepancyReports report />,
    },
    {
        id: "activity",
        area: "AdOps · Activity",
        title: "Activity",
        description: "The week's changes, filtered by the Blocking Activity, Demand Management and More checkboxes.",
        render: () => <Activity />,
    },
    {
        id: "activity-empty",
        area: "AdOps · Activity",
        title: "Activity · empty",
        description: "No data to display in this date range.",
        render: () => <Activity empty />,
    },
];
