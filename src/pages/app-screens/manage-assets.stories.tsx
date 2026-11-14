import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManageAssetsAddExisting, ManageAssetsCreateCampaign, ManageAssetsViewCampaigns } from "./manage-assets";

/**
 * Deal Activation System → Manage Assets.
 *
 * Three reference screens rebuilt on the Nimbus pink/teal theme with the Global
 * Nav + Untitled UI components:
 *   - AddExistingAsset  — search + selected-assets table
 *   - CreateCampaign    — creative-authoring form
 *   - ViewCampaigns     — sortable live-campaigns table
 */
const meta = {
    title: "Archive/App Screens/Manage Assets",
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Add Existing Asset — search library assets and review the selected list. */
export const AddExistingAsset: Story = {
    render: () => <ManageAssetsAddExisting />,
};

/** Create Campaigns — author a new creative with markup, trackers, and caps. */
export const CreateCampaign: Story = {
    render: () => <ManageAssetsCreateCampaign />,
};

/** View Campaigns — sortable table of live/paused/waiting creatives. */
export const ViewCampaigns: Story = {
    render: () => <ManageAssetsViewCampaigns />,
};
