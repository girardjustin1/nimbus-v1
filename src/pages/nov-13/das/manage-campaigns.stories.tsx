import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewOnePage } from "../../../../prototypes/app/v1/screens/campaign-view";
import { FullPerformance } from "../../../../prototypes/app/v1/screens/full-performance";
import { ManageCampaigns } from "../../../../prototypes/app/v1/screens/manage-campaigns";

/** Full application · Deal Activation System · Manage campaigns — from DAS Round 6, unchanged. */
const meta = {
    title: "Prototypes/Full application/Deal Activation System/Manage campaigns",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The campaigns list: Pacing column, one spend number. */
export const Default: Story = { render: () => <ManageCampaigns /> };

/** A campaign's overview, with chart A (6 Nov). */
export const CampaignOverview: Story = { name: "Campaign overview", render: () => <ViewOnePage id="c2" /> };

/** A campaign's full performance. */
export const FullPerformanceReport: Story = { name: "Full performance", render: () => <FullPerformance /> };
