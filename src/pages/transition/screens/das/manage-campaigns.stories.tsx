import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewOnePage } from "../../../../../prototypes/app/v2/screens/campaign-view";
import { FullPerformance } from "../../../../../prototypes/app/v2/screens/full-performance";
import { ManageCampaigns } from "../../../../../prototypes/app/v2/screens/manage-campaigns";

/** Round 1 · Deal Activation System · Manage campaigns — renders v2, with the Round 1 styles (prototypes/app/v2, #/campaigns). */
const meta = {
    title: "Transition/Round 1/Screens/Deal Activation System/Manage campaigns",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The campaigns list, in v2. */
export const Default: Story = { render: () => <ManageCampaigns /> };

/** A campaign's overview, in v2. */
export const CampaignOverview: Story = { name: "Campaign overview", render: () => <ViewOnePage id="c2" /> };

/** A campaign's full performance, in v2. */
export const FullPerformanceReport: Story = { name: "Full performance", render: () => <FullPerformance /> };
