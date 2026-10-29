import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewOnePage as ViewOnePageV5 } from "../../../prototypes/das/v5/screens/campaign-view";
import { FullPerformance as FullPerformanceV5 } from "../../../prototypes/das/v5/screens/full-performance";
import { ManageCampaigns as ManageCampaignsV5 } from "../../../prototypes/das/v5/screens/manage-campaigns";
import { ViewOnePage } from "../../../prototypes/das/v6/screens/campaign-view";
import { FullPerformance } from "../../../prototypes/das/v6/screens/full-performance";
import { ManageCampaigns } from "../../../prototypes/das/v6/screens/manage-campaigns";
import { bySlug } from "./feedback";
import { Compare } from "./note";

/**
 * Oct 29 Edits · the changes from the 28 Oct reporting review, in prototype v6.
 *
 * Each change is a pair: Round 5 as it was reviewed (frozen, untouched) and Round 6 as
 * built. The Campaign Delivery column is a concept, shown on its own.
 */
const meta = {
    title: "Oct 29 Edits/Applied Changes",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const campaigns = [bySlug("pacing-column"), bySlug("true-up"), bySlug("pace-colors")];
const overview = [bySlug("pacing-pct"), bySlug("pacing-chart"), bySlug("true-up")];
const performance = [bySlug("fp-stays"), bySlug("fp-metrics"), bySlug("fp-breakdowns")];

export const CampaignsBefore: Story = {
    name: "1 · Manage campaigns · Round 5",
    render: () => (
        <Compare items={campaigns} kind="Round 5" title="Campaign Health only as a chip; Spend with no note">
            <ManageCampaignsV5 />
        </Compare>
    ),
};

export const CampaignsAfter: Story = {
    name: "1 · Manage campaigns · Round 6",
    render: () => (
        <Compare items={campaigns} kind="Round 6" title="A Pacing column beside Status; Total spend and Spend say “Subject to true-up” (hover the ⓘ)">
            <ManageCampaigns />
        </Compare>
    ),
};

export const CampaignsSorted: Story = {
    name: "2 · Manage campaigns · sorted by pacing",
    render: () => (
        <Compare items={[bySlug("pacing-column")]} kind="Round 6" title="One click on Pacing: at risk, then behind, then on target; campaigns not pacing last">
            <ManageCampaigns sortBy="pacing" />
        </Compare>
    ),
};

export const CampaignDelivery: Story = {
    name: "3 · Campaign Delivery column · concept",
    render: () => (
        <Compare
            items={[bySlug("lifecycle")]}
            kind="Concept"
            title="Pacing while in flight; final budget and spend once complete — scroll down to Back to school"
        >
            <ManageCampaigns delivery="lifecycle" />
        </Compare>
    ),
};

export const OverviewBefore: Story = {
    name: "4 · Campaign overview · Round 5",
    render: () => (
        <Compare items={overview} kind="Round 5" title="Campaign Health as a word; the chart in dollars">
            <ViewOnePageV5 id="c2" />
        </Compare>
    ),
};

export const OverviewAfter: Story = {
    name: "4 · Campaign overview · Round 6",
    render: () => (
        <Compare items={overview} kind="Round 6" title="Pacing 54.5%, live; expected against actual as a share of the goal">
            <ViewOnePage id="c2" />
        </Compare>
    ),
};

export const OverviewComplete: Story = {
    name: "5 · Campaign overview · complete",
    render: () => (
        <Compare items={[bySlug("true-up")]} kind="Round 6" title="A finished campaign: no pacing, the final trued-up spend">
            <ViewOnePage id="c9" />
        </Compare>
    ),
};

export const PerformanceBefore: Story = {
    name: "6 · Full performance · Round 5",
    render: () => (
        <Compare items={performance} kind="Round 5" title="Spend, Impressions and eCPM; six breakdowns">
            <FullPerformanceV5 />
        </Compare>
    ),
};

export const PerformanceAfter: Story = {
    name: "6 · Full performance · Round 6",
    render: () => (
        <Compare items={performance} kind="Round 6" title="Revenue, Impressions, eCPM, Render rate, Clicks, CTR (view-through if available); eleven breakdowns">
            <FullPerformance breakdown={["Position"]} metrics={["Impressions", "Render rate", "Clicks", "CTR"]} chart="table" />
        </Compare>
    ),
};

export const RegionCountry: Story = {
    name: "7 · Full performance · region and country",
    render: () => (
        <Compare
            items={[bySlug("fp-breakdowns"), bySlug("geo-split")]}
            kind="Round 6"
            title="Region bundles the US and Mexico under North America; Country keeps them apart"
        >
            <FullPerformance id="c2" breakdown={["Region", "Country"]} chart="table" />
        </Compare>
    ),
};
