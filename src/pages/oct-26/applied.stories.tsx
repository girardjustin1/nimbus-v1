import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewAllAssets as ViewAllAssetsV4 } from "../../../prototypes/das/v4/screens/asset-library";
import { ViewOnePage as ViewOnePageV4 } from "../../../prototypes/das/v4/screens/campaign-view";
import { FullPerformance as FullPerformanceV4 } from "../../../prototypes/das/v4/screens/full-performance";
import { ManageCampaigns as ManageCampaignsV4 } from "../../../prototypes/das/v4/screens/manage-campaigns";
import { ViewAllAssets } from "../../../prototypes/das/v5/screens/asset-library";
import { ViewOnePage } from "../../../prototypes/das/v5/screens/campaign-view";
import { FullPerformance } from "../../../prototypes/das/v5/screens/full-performance";
import { ManageCampaigns } from "../../../prototypes/das/v5/screens/manage-campaigns";
import { bySlug } from "./feedback";
import { Compare } from "./note";

/**
 * Oct 26 · the changes decided on the 26 Oct call, in prototype v5.
 *
 * Each one is a pair: Round 4 as it was reviewed (frozen, untouched) and Round 5 as
 * built, so what changed is easy to see and easy to put back.
 */
const meta = {
    title: "Oct 26/Applied Changes",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const campaigns = [bySlug("full-bleed"), bySlug("pi-link"), bySlug("stat-type")];
const assets = [bySlug("search"), bySlug("list-headers"), bySlug("tabs")];
const performance = [bySlug("bands"), bySlug("filters"), bySlug("table-rule"), bySlug("teal"), bySlug("chart-type"), bySlug("dates")];
const overview = [bySlug("stat-type"), bySlug("kept")];

export const CampaignsBefore: Story = {
    name: "1 · Manage campaigns · Round 4",
    render: () => (
        <Compare items={campaigns} kind="Round 4" title="Table in a rounded card; Total spend links to “Detailed reporting”">
            <ManageCampaignsV4 />
        </Compare>
    ),
};

export const CampaignsAfter: Story = {
    name: "1 · Manage campaigns · Round 5",
    render: () => (
        <Compare items={campaigns} kind="Round 5" title="Full-bleed list table; Total spend links to Performance Insights">
            <ManageCampaigns />
        </Compare>
    ),
};

export const AssetsBefore: Story = {
    name: "2 · View All Assets · Round 4",
    render: () => (
        <Compare items={assets} kind="Round 4" title="An “Assets” heading, search on the right, light-grey header without column rules">
            <ViewAllAssetsV4 />
        </Compare>
    ),
};

export const AssetsAfter: Story = {
    name: "2 · View All Assets · Round 5",
    render: () => (
        <Compare items={assets} kind="Round 5" title="Search top left, actions on the right, bold black headers with column rules, full bleed">
            <ViewAllAssets />
        </Compare>
    ),
};

export const PerformanceBefore: Story = {
    name: "3 · Full performance · Round 4",
    render: () => (
        <Compare items={performance} kind="Round 4" title="The builder in a card, pink checkboxes, DAS-only filter chips, a light-header table">
            <FullPerformanceV4 breakdown={["Creative", "Platform"]} chart="table" />
        </Compare>
    ),
};

export const PerformanceAfter: Story = {
    name: "3 · Full performance · Round 5",
    render: () => (
        <Compare items={performance} kind="Round 5" title="Performance Insights' bands, teal checkboxes, the filter menu, chart type filling its band, a charcoal report table">
            <FullPerformance breakdown={["Creative", "Platform"]} chart="table" />
        </Compare>
    ),
};

export const OverviewBefore: Story = {
    name: "4 · Campaign overview · Round 4",
    render: () => (
        <Compare items={overview} kind="Round 4" title="Summary cards in Round 4's type">
            <ViewOnePageV4 />
        </Compare>
    ),
};

export const OverviewAfter: Story = {
    name: "4 · Campaign overview · Round 5",
    render: () => (
        <Compare items={overview} kind="Round 5" title="Summary cards in the realtime dashboard's type; progress bars and the paused banner kept">
            <ViewOnePage />
        </Compare>
    ),
};

export const PausedAfter: Story = {
    name: "5 · Paused campaign · Round 5 (banner kept)",
    render: () => (
        <Compare items={[bySlug("kept")]} kind="Round 5" title="The paused warning banner and the spend progress bar stay until user feedback">
            <ViewOnePage id="c4" />
        </Compare>
    ),
};
