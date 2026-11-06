import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewAllAssets } from "../../../prototypes/das/v6/screens/asset-library";
import { ViewOnePage } from "../../../prototypes/das/v6/screens/campaign-view";
import { FullPerformance } from "../../../prototypes/das/v6/screens/full-performance";
import { ViewAllKeywords } from "../../../prototypes/das/v6/screens/keyword-library-v3";
import { bySlug } from "./feedback";
import { Compare } from "./note";

/**
 * Nov 6 Edits · Applied Changes — what the 6 Nov review changed in prototype v6.
 *
 * Round 6 as reviewed on 29 Oct beside the same screen today. Tables: click any header
 * to sort, again to reverse, a third time to go back.
 */
const meta = {
    title: "Nov 6 Edits/Applied Changes",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const chart = [bySlug("requests"), bySlug("daus")];

export const OverviewBefore: Story = {
    name: "1 · Campaign overview · Round 6",
    render: () => (
        <Compare items={chart} kind="Round 6" title="Pacing only: the line flattens, with nothing to say why">
            <ViewOnePage id="c2" delivery="pacing" />
        </Compare>
    ),
};

export const OverviewAfter: Story = {
    name: "1 · Campaign overview · 6 Nov",
    render: () => (
        <Compare items={chart} kind="6 Nov" title="Opportunity under pacing: requests and users fell from Sep 6, the day pacing slowed">
            <ViewOnePage id="c2" />
        </Compare>
    ),
};

export const OverviewBehind: Story = {
    name: "2 · Campaign overview · same users, fewer slots",
    render: () => (
        <Compare items={[bySlug("daus")]} kind="6 Nov" title="Morning commuters: users held steady, requests fell — a different cause, visible at a glance">
            <ViewOnePage id="c8" />
        </Compare>
    ),
};

export const OverviewOnTarget: Story = {
    name: "3 · Campaign overview · on target",
    render: () => (
        <Compare items={[bySlug("requests")]} kind="6 Nov" title="Sports fans: steady opportunity, Saturday peaks, pacing on the line">
            <ViewOnePage id="c1" />
        </Compare>
    ),
};

export const OverviewFallback: Story = {
    name: "4 · Campaign overview · Fallback",
    render: () => (
        <Compare items={[bySlug("requests")]} kind="6 Nov" title="No budget to pace against: impressions above, opportunity below">
            <ViewOnePage id="c5" />
        </Compare>
    ),
};

const sortable = [bySlug("sortable")];

export const AssetsSortable: Story = {
    name: "5 · View All Assets · sortable",
    render: () => (
        <Compare items={sortable} kind="6 Nov" title="Every header sorts: status, name, campaigns, type, size, trackers">
            <ViewAllAssets />
        </Compare>
    ),
};

export const KeywordsSortable: Story = {
    name: "6 · View All Keywords · sortable",
    render: () => (
        <Compare items={sortable} kind="6 Nov" title="Status, keyword, campaigns, and date updated">
            <ViewAllKeywords />
        </Compare>
    ),
};

export const PerformanceSortable: Story = {
    name: "7 · Full performance · sortable",
    render: () => (
        <Compare items={sortable} kind="6 Nov" title="The report sorts by any breakdown, metric or share">
            <FullPerformance breakdown={["Creative"]} metrics={["Revenue", "Impressions", "eCPM"]} chart="table" />
        </Compare>
    ),
};
