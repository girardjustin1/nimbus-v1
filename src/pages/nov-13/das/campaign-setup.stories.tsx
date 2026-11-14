import type { Meta, StoryObj } from "@storybook/react-vite";
import { CampaignSetup } from "../../../../prototypes/app/v1/screens/campaign-setup";

/**
 * Full application · Deal Activation System · Campaign setup — carried over from DAS
 * Round 6 into the full application unchanged (prototypes/app/v1).
 */
const meta = {
    title: "Prototypes/Full application/Deal Activation System/Campaign setup",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty form — staging's "deal activation setup". */
export const Default: Story = { render: () => <CampaignSetup preset="empty" screenId="setup-empty" /> };

/** Every section filled, ready to publish. */
export const Ready: Story = { render: () => <CampaignSetup preset="ready" screenId="setup-ready" /> };
