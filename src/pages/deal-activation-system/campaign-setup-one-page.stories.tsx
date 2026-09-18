import type { Meta, StoryObj } from "@storybook/react-vite";
import { CampaignSetupOnePage } from "./campaign-setup-one-page";

/**
 * Deal Activation System → Campaign Setup (one page).
 *
 * The five-step wizard as one scrolling form with a live summary rail. Replaces the
 * separate Review step; Publish enables only when the campaign is valid.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup (One Page)",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Filled in and valid: the rail shows 5/5 and Publish is enabled. */
export const ReadyToPublish: Story = { render: () => <CampaignSetupOnePage /> };

/** Missing budget and mixed creative types: problems link to their section; Publish is disabled. */
export const WithErrors: Story = { render: () => <CampaignSetupOnePage state="errors" /> };

/** Fallback rule selected: budget and eCPM fields disappear because they don't apply. */
export const FallbackRule: Story = { render: () => <CampaignSetupOnePage initialRule="Fallback" /> };
