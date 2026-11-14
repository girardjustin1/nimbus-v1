import type { Meta, StoryObj } from "@storybook/react-vite";
import { AddAssetScreen, ViewCampaignsScreen } from "./view-all-campaigns";

/**
 * Deal Activation System → View All Campaigns.
 *
 * Two tab views rebuilt on the Nimbus pink/teal theme with the Global Nav +
 * Untitled UI components:
 *   - ViewCampaigns — a very wide, horizontally-scrolling campaign table.
 *   - AddAsset      — a creative-authoring form.
 */
const meta = {
    title: "Archive/App Screens/View All Campaigns",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** View Campaigns — the wide campaign table with status, toggles, and pill actions. */
export const ViewCampaigns: Story = {
    render: () => <ViewCampaignsScreen />,
};

/** Add Asset — author a new creative with markup, tracking URLs, and impression caps. */
export const AddAsset: Story = {
    render: () => <AddAssetScreen />,
};
