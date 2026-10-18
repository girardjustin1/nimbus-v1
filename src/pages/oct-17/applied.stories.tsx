import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Creative } from "../../../prototypes/das/v1/screens/setup-data";
import { AssetSetup as AssetSetupV3 } from "../../../prototypes/das/v3/screens/asset-library";
import { ViewOnePage as ViewOnePageV3, ViewPerformance as ViewPerformanceV3 } from "../../../prototypes/das/v3/screens/campaign-view";
import { CreativeTargetBlock as CreativeTargetBlockV3 } from "../../../prototypes/das/v3/screens/creative-target";
import { ManageCampaignsDelivery as ManageCampaignsV3 } from "../../../prototypes/das/v3/screens/manage-campaigns";
import { AssetSetup as AssetSetupV4 } from "../../../prototypes/das/v4/screens/asset-library";
import { ViewOnePage as ViewOnePageV4 } from "../../../prototypes/das/v4/screens/campaign-view";
import { CreativeTargetBlock as CreativeTargetBlockV4 } from "../../../prototypes/das/v4/screens/creative-target";
import { FullPerformance } from "../../../prototypes/das/v4/screens/full-performance";
import { ManageCampaigns } from "../../../prototypes/das/v4/screens/manage-campaigns";
import { bySlug } from "./feedback";
import { Compare } from "./note";

/**
 * Oct 17 · the changes decided on the 16 Oct call, already in prototype v4.
 *
 * Each one is a pair: Round 3 as it was reviewed (frozen, untouched) and Round 4 as
 * built, so what was removed stays visible and is easy to put back.
 */
const meta = {
    title: "Oct 17/Applied Changes",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const START: Creative[] = [
    { name: "SampleApp_Interstitial_A", type: "HTML", size: "Full screen" },
    { name: "SampleApp_Interstitial_B", type: "HTML", size: "Full screen" },
];

const Creatives = ({ round }: { round: 3 | 4 }) => {
    const [value, setValue] = useState<Creative[]>(START);
    const Block = round === 3 ? CreativeTargetBlockV3 : CreativeTargetBlockV4;
    return (
        <div className="p-6">
            <Block value={value} onChange={setValue} entry="inline" />
        </div>
    );
};

const previews = bySlug("creative-previews");
const table = bySlug("campaigns-table");
const header = bySlug("overview-header");
const performance = bySlug("full-performance");

export const CreativeBefore: Story = {
    name: "1 · Creative · Round 3",
    render: () => (
        <Compare item={previews} kind="Round 3" title="A preview on every search result, and a Preview button on each creative">
            <Creatives round={3} />
        </Compare>
    ),
};

export const CreativeAfter: Story = {
    name: "1 · Creative · Round 4",
    render: () => (
        <Compare item={previews} kind="Round 4" title="Name, Ad Type and Ad Size — nothing that hints at a render">
            <Creatives round={4} />
        </Compare>
    ),
};

export const AssetSetupBefore: Story = {
    name: "2 · Asset Setup · Round 3",
    render: () => (
        <Compare item={previews} quote={1} kind="Round 3" title="A placement preview beside the form">
            <AssetSetupV3 filled />
        </Compare>
    ),
};

export const AssetSetupAfter: Story = {
    name: "2 · Asset Setup · Round 4",
    render: () => (
        <Compare item={previews} quote={1} kind="Round 4" title="The form on its own">
            <AssetSetupV4 filled />
        </Compare>
    ),
};

export const CampaignsBefore: Story = {
    name: "3 · Manage campaigns · Round 3",
    render: () => (
        <Compare item={table} kind="Round 3" title="Campaigns grouped under their deal, as delivery cards">
            <ManageCampaignsV3 />
        </Compare>
    ),
};

export const CampaignsAfter: Story = {
    name: "3 · Manage campaigns · Round 4",
    render: () => (
        <Compare item={table} quote={1} kind="Round 4" title="Staging's table, with Live, Queued, Total spend and Campaign Health above it">
            <ManageCampaigns />
        </Compare>
    ),
};

export const OverviewBefore: Story = {
    name: "4 · Campaign overview · Round 3",
    render: () => (
        <Compare item={header} kind="Round 3" title="Breadcrumb in the body, ad unit and creative count in the header, a rail and previews">
            <ViewOnePageV3 />
        </Compare>
    ),
};

export const OverviewAfter: Story = {
    name: "4 · Campaign overview · Round 4",
    render: () => (
        <Compare item={header} quote={1} kind="Round 4" title="Breadcrumb strip; name, status, rule, flight dates, platform and apps; one summary; dollars in the tooltip">
            <ViewOnePageV4 />
        </Compare>
    ),
};

export const PerformanceBefore: Story = {
    name: "5 · Performance · Round 3",
    render: () => (
        <Compare item={performance} kind="Round 3" title="Summary cards, eCPM against open marketplace, keywords as bars">
            <ViewPerformanceV3 />
        </Compare>
    ),
};

export const PerformanceAfter: Story = {
    name: "5 · Performance · Round 4",
    render: () => (
        <Compare item={performance} quote={2} kind="Round 4" title="Full performance: break down and pivot by everything the campaign targets, then export">
            <FullPerformance breakdown={["Creative", "Platform"]} />
        </Compare>
    ),
};
