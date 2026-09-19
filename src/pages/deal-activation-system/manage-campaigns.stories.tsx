import type { Meta, StoryObj } from "@storybook/react-vite";
import { CompareCampaigns, ManageCampaignsDelivery } from "./manage-campaigns";

/**
 * Deal Activation System → Manage Campaigns.
 *
 * Delivery-first campaign management: is each campaign on pace for what was promised,
 * and how do sibling campaigns compare?
 */
const meta = {
    title: "Deal Activation System/Round 1 Concepts/Manage Campaigns",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Concept A: deals group their campaigns; each row leads with delivery vs flight. */
export const ConceptADelivery: Story = { name: "Concept A · Delivery view", render: () => <ManageCampaignsDelivery /> };

/** Concept A with two campaigns selected: the compare / duplicate tray appears. */
export const ConceptASelected: Story = { name: "Concept A · Selected for compare", render: () => <ManageCampaignsDelivery preselected={["c1", "c2"]} /> };

/** Concept B: side-by-side compare with differing setup rows highlighted. */
export const ConceptBCompare: Story = { name: "Concept B · Compare", render: () => <CompareCampaigns /> };
