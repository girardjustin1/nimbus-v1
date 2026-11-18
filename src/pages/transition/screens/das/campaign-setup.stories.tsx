import type { Meta, StoryObj } from "@storybook/react-vite";
import { CampaignSetup } from "../../../../../prototypes/app/v2/screens/campaign-setup";

/** Round 1 · Deal Activation System · Campaign setup — renders v2, with the Round 1 styles (prototypes/app/v2, #/setup-empty). */
const meta = {
    title: "Transition/Round 1/Screens/Deal Activation System/Campaign setup",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The empty form, in v2. */
export const Default: Story = { render: () => <CampaignSetup preset="empty" screenId="setup-empty" /> };

/** Every section filled, ready to publish, in v2. */
export const Ready: Story = { render: () => <CampaignSetup preset="ready" screenId="setup-ready" /> };
